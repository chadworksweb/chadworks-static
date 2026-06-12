// LEIT submission logger — portable across all LEIT contact-form sites.
// Writes every form submission to the shared Turso DB before attempting Resend
// delivery, so submissions survive Resend outages, key rotation bugs, or any
// downstream failure. Update the row with the Resend result after send.
//
// Required env vars: LEIT_TURSO_URL, LEIT_TURSO_TOKEN
// Drop into any Vercel project's api/ folder. Keep this file in sync across sites.

var crypto = require('crypto');

function httpUrl(libsqlUrl) {
  return String(libsqlUrl || '').replace(/^libsql:\/\//, 'https://');
}

function sanitizeKey(raw) {
  return String(raw || '').trim().replace(/\\n$/, '').replace(/\\r$/, '');
}

function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(String(ip)).digest('hex').slice(0, 32);
}

async function pipeline(stmts) {
  var url = httpUrl(process.env.LEIT_TURSO_URL);
  var token = sanitizeKey(process.env.LEIT_TURSO_TOKEN);
  if (!url || !token) throw new Error('LEIT_TURSO_URL or LEIT_TURSO_TOKEN missing');
  var body = {
    requests: stmts.map(function (s) { return { type: 'execute', stmt: s }; })
                   .concat([{ type: 'close' }])
  };
  var res = await fetch(url + '/v2/pipeline', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Turso ' + res.status + ': ' + await res.text());
  var json = await res.json();
  for (var i = 0; i < json.results.length; i++) {
    if (json.results[i].type === 'error') {
      throw new Error('Turso stmt error: ' + JSON.stringify(json.results[i]));
    }
  }
  return json.results;
}

// Log a submission attempt. Returns the inserted row id, or null if logging failed.
// Logging failure must never block delivery — caller should still attempt to send.
async function logSubmission(opts) {
  var site = opts.site;
  var source = opts.source || null;
  var payload = opts.payload || {};
  var ip = opts.ip || null;
  var ua = opts.userAgent || null;
  var ts = Math.floor(Date.now() / 1000);
  try {
    var results = await pipeline([{
      sql: 'INSERT INTO submissions (site, source, submitted_at, payload_json, ip_hash, user_agent) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
      args: [
        { type: 'text', value: String(site) },
        source ? { type: 'text', value: String(source) } : { type: 'null', value: null },
        { type: 'integer', value: String(ts) },
        { type: 'text', value: JSON.stringify(payload) },
        ip ? { type: 'text', value: hashIp(ip) } : { type: 'null', value: null },
        ua ? { type: 'text', value: String(ua).slice(0, 500) } : { type: 'null', value: null }
      ]
    }]);
    var row = results[0].response.result.rows[0];
    return row && row[0] ? parseInt(row[0].value, 10) : null;
  } catch (e) {
    console.error('[leit-log-failed]', e.message);
    return null;
  }
}

// Update a submission row with the Resend result. Status: 'sent' | 'failed' | 'spam_filtered'.
async function updateSubmission(id, status, resendId, resendError) {
  if (!id) return;
  try {
    await pipeline([{
      sql: 'UPDATE submissions SET resend_status = ?, resend_id = ?, resend_error = ? WHERE id = ?',
      args: [
        { type: 'text', value: String(status) },
        resendId ? { type: 'text', value: String(resendId) } : { type: 'null', value: null },
        resendError ? { type: 'text', value: String(resendError).slice(0, 1000) } : { type: 'null', value: null },
        { type: 'integer', value: String(id) }
      ]
    }]);
  } catch (e) {
    console.error('[leit-update-failed]', id, e.message);
  }
}

module.exports = { logSubmission: logSubmission, updateSubmission: updateSubmission, sanitizeKey: sanitizeKey };
