/* chadworks niche-page contact form — LEIT submission handler.
 * Mirrors the AAC pattern: honeypot + timestamp anti-spam, JSON POST to
 * /api/send, success/error states. Form is the only automated contact route.
 */
(function () {
  'use strict';

  var FORM_ENDPOINT = '/api/send';
  var form = document.querySelector('.industry_contact_form');
  if (!form) return;

  function injectAntispamFields(form) {
    if (form.dataset.leitAntispam === '1') return;
    form.dataset.leitAntispam = '1';

    var hp = document.createElement('div');
    hp.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;';
    hp.setAttribute('aria-hidden', 'true');
    hp.innerHTML = '<label for="leit_company_url_' + Math.random().toString(36).slice(2, 8) + '">Company Website</label>' +
      '<input type="text" name="leit_company_url" value="" autocomplete="off" tabindex="-1">';
    form.appendChild(hp);

    var ts = document.createElement('input');
    ts.type = 'hidden';
    ts.name = 'leit_cf_ts';
    ts.value = btoa(String(Math.floor(Date.now() / 1000)));
    form.appendChild(ts);
  }

  function validateForm(form) {
    var valid = true;
    var fields = form.querySelectorAll('[required]');
    fields.forEach(function (field) {
      var group = field.closest('.industry_contact_form_field');
      var val = (field.value || '').trim();
      if (!val) {
        valid = false;
        if (group) group.classList.add('has-error');
      } else {
        if (group) group.classList.remove('has-error');
      }
      if (field.type === 'email' && val) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          valid = false;
          if (group) group.classList.add('has-error');
        }
      }
    });
    return valid;
  }

  function collectFormData(form) {
    var data = {};
    var inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function (field) {
      if (!field.name) return;
      var v = (field.value || '').trim();
      if (v) data[field.name] = v;
    });
    return data;
  }

  function handleSubmit(e) {
    e.preventDefault();
    var submitBtn = form.querySelector('[type="submit"]');
    var successEl = form.querySelector('.industry_contact_form_success');
    var errorEl = form.querySelector('.industry_contact_form_error');

    if (!validateForm(form)) {
      var firstError = form.querySelector('.has-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    var data = collectFormData(form);

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(function (res) {
      if (res.ok) {
        form.reset();
        if (successEl) successEl.hidden = false;
        if (errorEl) errorEl.hidden = true;
        // Reinject anti-spam fields for the next submission.
        delete form.dataset.leitAntispam;
        injectAntispamFields(form);
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(function () {
      if (errorEl) errorEl.hidden = false;
      if (successEl) successEl.hidden = true;
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    });
  }

  // Clear field error when user starts typing again
  form.addEventListener('input', function (e) {
    var group = e.target.closest('.industry_contact_form_field');
    if (group && group.classList.contains('has-error')) {
      if ((e.target.value || '').trim()) group.classList.remove('has-error');
    }
  });

  injectAntispamFields(form);
  form.addEventListener('submit', handleSubmit);
})();
