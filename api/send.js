// chadworks-static lead/contact form handler (the LEIT contact form pattern,
// copied verbatim from the chadworks niche pages).
// Logs every submission to LEIT Turso DB before sending, then fires Resend
// to chad@chadworks.co. Same anti-spam, same log-before-send guarantee. The
// `SITE` constant marks all chadworks-static submissions in LEIT (the
// per-page form comes through in the payload's `_source` field).
var leit = require('./_leit-submissions');

var SITE = 'chadworks-static';

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Origin check — accept chadworks.co, *.vercel.app preview, and localhost dev.
  var origin = req.headers.origin || '';
  var referer = req.headers.referer || '';
  var allowed = /(^|\/\/)(www\.)?(chadworks\.co|localhost|127\.0\.0\.1|.+\.vercel\.app)(:\d+)?(\/|$)/i;
  if (!allowed.test(origin) && !allowed.test(referer)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  var ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || null;
  var ua = req.headers['user-agent'] || null;

  var data = Object.assign({}, req.body || {});
  var source = data._source || 'chadworks niche page';
  var subject = data._subject || 'New chadworks Inquiry — ' + source;

  // Honeypot
  if (data.leit_company_url) {
    await logBlocked(data, source, ip, ua, 'honeypot');
    return res.status(200).json({ ok: true });
  }

  // Timestamp
  var tsRaw = data.leit_cf_ts || '';
  var submitted = 0;
  try {
    submitted = parseInt(Buffer.from(String(tsRaw), 'base64').toString('utf8'), 10) || 0;
  } catch (e) {}
  var now = Math.floor(Date.now() / 1000);
  if (!submitted) {
    await logBlocked(data, source, ip, ua, 'missing_timestamp');
    return res.status(200).json({ ok: true });
  }
  if ((now - submitted) < 3) {
    await logBlocked(data, source, ip, ua, 'fast_submit');
    return res.status(200).json({ ok: true });
  }
  if ((now - submitted) > 60 * 60 * 6) {
    await logBlocked(data, source, ip, ua, 'stale_timestamp');
    return res.status(200).json({ ok: true });
  }

  // Email format
  var email = String(data.email || '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    await logBlocked(data, source, ip, ua, 'invalid_email');
    return res.status(200).json({ ok: true });
  }

  // Gibberish
  var nameVal = String(data.name || data.full_name || data.first_name || '').trim();
  var messageVal = String(data.message || data.details || '').trim();
  if (isGibberish(nameVal)) {
    await logBlocked(data, source, ip, ua, 'gibberish_name');
    return res.status(200).json({ ok: true });
  }
  if (isGibberish(messageVal)) {
    await logBlocked(data, source, ip, ua, 'gibberish_message');
    return res.status(200).json({ ok: true });
  }

  // Strip internal markers
  delete data._source;
  delete data._subject;
  delete data.leit_company_url;
  delete data.leit_cf_ts;

  // Log to Turso BEFORE Resend
  var rowId = await leit.logSubmission({
    site: SITE,
    source: source,
    payload: data,
    ip: ip,
    userAgent: ua
  });

  var Resend;
  try {
    Resend = require('resend').Resend;
  } catch (e) {
    await leit.updateSubmission(rowId, 'failed', null, 'module_load: ' + e.message);
    console.error('[leit-resend-failed]', SITE, 'module_load', e.message);
    return res.status(500).json({ error: 'Module load failed' });
  }

  var apiKey = leit.sanitizeKey(process.env.RESEND_API_KEY);
  if (!apiKey) {
    await leit.updateSubmission(rowId, 'failed', null, 'missing_api_key');
    console.error('[leit-resend-failed]', SITE, 'missing_api_key');
    return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
  }

  var resend = new Resend(apiKey);

  try {
    var rows = Object.entries(data)
      .filter(function (entry) { return entry[1]; })
      .map(function (entry) {
        var key = entry[0];
        var value = String(entry[1]).replace(/</g, '&lt;');
        var label = key.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        return '<tr><td style="padding:8px 12px;font-weight:600;vertical-align:top;white-space:nowrap;color:#243989;">' + label + '</td><td style="padding:8px 12px;color:#595959;">' + value + '</td></tr>';
      })
      .join('');

    var html = '<div style="font-family:Arial,sans-serif;max-width:600px;">' +
      '<h2 style="color:#243989;border-bottom:2px solid #8054bc;padding-bottom:8px;">' + subject + '</h2>' +
      '<table style="width:100%;border-collapse:collapse;">' + rows + '</table>' +
      '<p style="margin-top:24px;font-size:12px;color:#999;">Sent from a chadworks niche page</p>' +
      '</div>';

    var result = await resend.emails.send({
      from: 'chadworks <noreply@chadworks.co>',
      to: 'chad@chadworks.co',
      subject: subject,
      html: html
    });

    if (result.error) {
      await leit.updateSubmission(rowId, 'failed', null, result.error.message);
      console.error('[leit-resend-failed]', SITE, rowId, result.error.message);
      return res.status(500).json({ error: result.error.message });
    }

    var sentId = result.data && result.data.id ? result.data.id : null;
    await leit.updateSubmission(rowId, 'sent', sentId, null);
    console.log('[leit-sent]', SITE, rowId, sentId);
    return res.status(200).json({ ok: true });
  } catch (error) {
    await leit.updateSubmission(rowId, 'failed', null, error.message);
    console.error('[leit-resend-failed]', SITE, rowId, error.message);
    return res.status(500).json({ error: error.message });
  }
};

async function logBlocked(data, source, ip, ua, reason) {
  var clean = Object.assign({}, data);
  delete clean._source;
  delete clean._subject;
  delete clean.leit_company_url;
  delete clean.leit_cf_ts;
  var rowId = await leit.logSubmission({
    site: SITE,
    source: source,
    payload: clean,
    ip: ip,
    userAgent: ua
  });
  await leit.updateSubmission(rowId, 'spam_filtered', null, reason);
  console.log('[leit-blocked]', SITE, rowId, reason);
}

function isGibberish(text) {
  var t = String(text || '').trim();
  if (t.length < 6) return false;

  var alpha = t.replace(/[^a-zA-Z]/g, '').toLowerCase();
  if (alpha.length < 4) return false;

  var vowels = (alpha.match(/[aeiou]/g) || []).length;
  var consonants = alpha.length - vowels;
  if (consonants / alpha.length > 0.78) return true;

  if (/[^aeiou\s]{5,}/i.test(alpha)) return true;

  var words = t.split(/\s+/);
  for (var i = 0; i < words.length; i++) {
    var w = words[i];
    if (w.length <= 6) continue;
    var up = (w.match(/[A-Z]/g) || []).length;
    var lo = (w.match(/[a-z]/g) || []).length;
    if (up > 0 && lo > 0 && up / w.length > 0.3) return true;
  }

  return false;
}
