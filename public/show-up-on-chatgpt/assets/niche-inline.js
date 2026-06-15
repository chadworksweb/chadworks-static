/* niche-inline.js — inline behaviors enqueued by cf-niche-pages plugin
   FAQ accordion, scroll-reveal, scorecard, wireframe scroll-hijack. */

(function () {
  'use strict';

  // ---------- Intersection-based reveals ----------
  var revealEls = document.querySelectorAll('.lp_reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ---------- Scroll-fill heading ----------
  var fillTargets = document.querySelectorAll('[data-fill]');
  if (fillTargets.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    function updateFills() {
      var vh = window.innerHeight;
      fillTargets.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        // map [vh*0.85, vh*0.25] -> [100% (unfilled), 0% (filled)]
        var start = vh * 0.85;
        var end = vh * 0.25;
        var t = (start - rect.top) / (start - end);
        t = Math.max(0, Math.min(1, t));
        // background-position goes from 100% (unfilled) to 0% (filled)
        var pos = 100 - (t * 100);
        el.style.backgroundPosition = pos + '% 0';
      });
    }
    window.addEventListener('scroll', updateFills, { passive: true });
    window.addEventListener('resize', updateFills);
    updateFills();
  }

  // ---------- Interactive scorecard ----------
  var rubricList = document.getElementById('lp_rubric_list');
  var totalNumEl = document.getElementById('lp_score_total_num');
  var verdictEl  = document.getElementById('lp_score_verdict');
  var resetBtn   = document.getElementById('lp_score_reset');
  var ctaEl      = document.getElementById('lp_score_cta');

  if (rubricList && totalNumEl && verdictEl) {
    var items = rubricList.querySelectorAll('.lp_rubric_item');
    var total = items.length;

    function verdictFor(score) {
      if (score === 0) return { tier: '0',    text: 'Tap rows above to start.' };
      if (score <= 2)  return { tier: 'low',  text: 'Your site is invisible to panic searches. Most leads are slipping past you.' };
      if (score <= 4)  return { tier: 'mid',  text: 'You are in the game. Closing the gaps would lock in more of the high-intent calls.' };
      if (score === 5) return { tier: 'high', text: 'Strong. You are catching most of the panic leads in your area.' };
      return { tier: 'max', text: 'You are already winning the 11pm calls. This site is a closer.' };
    }

    function recalc() {
      var score = 0;
      items.forEach(function (btn) {
        if (btn.getAttribute('data-on') === '1') score++;
      });
      totalNumEl.textContent = score + ' / ' + total;
      totalNumEl.classList.remove('lp_score_pop');
      // Force reflow so the animation re-fires on each tap
      void totalNumEl.offsetWidth;
      totalNumEl.classList.add('lp_score_pop');
      var v = verdictFor(score);
      verdictEl.setAttribute('data-tier', v.tier);
      verdictEl.textContent = v.text;
      if (ctaEl) {
        ctaEl.textContent = score === total ? 'Contact me anyway' : "Let's fix that";
      }
    }

    items.forEach(function (btn) {
      var scoreText = btn.querySelector('.lp_rubric_score_text');
      btn.addEventListener('click', function () {
        var nextOn = btn.getAttribute('data-on') === '1' ? '0' : '1';
        btn.setAttribute('data-on', nextOn);
        btn.setAttribute('aria-pressed', nextOn === '1' ? 'true' : 'false');
        if (scoreText) scoreText.textContent = nextOn + ' / 1';
        recalc();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        items.forEach(function (btn) {
          btn.setAttribute('data-on', '0');
          btn.setAttribute('aria-pressed', 'false');
          var scoreText = btn.querySelector('.lp_rubric_score_text');
          if (scoreText) scoreText.textContent = '0 / 1';
        });
        recalc();
      });
    }
  }
})();

/* FAQ accordion — toggles .is-open and aria-expanded for smooth grid-rows transition */
(function () {
  document.querySelectorAll('.lp_faq_item .lp_faq_q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();

/* Wireframe scroll-hijack — sticky stage cycles 8 steps based on scroll position; pills jump to specific step */
(function () {
  var hijack = document.getElementById('lp_wireframe_hijack');
  if (!hijack) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var blockSteps = hijack.querySelectorAll('.lp_wf_step');
  var explainSteps = hijack.querySelectorAll('.lp_wf_step_explain');
  var pills = hijack.querySelectorAll('.lp_wf_pill');
  var progressNum = document.getElementById('lp_wf_progress_num');
  var dim = document.getElementById('lp_wireframe_hijack_dim');
  var stepCount = pills.length;
  if (!stepCount) return;

  // Re-parent dim to <body> so position:fixed isn't trapped by an ancestor with transform
  if (dim && dim.parentNode !== document.body) {
    document.body.appendChild(dim);
  }

  function getDimOpacity() {
    var rect = hijack.getBoundingClientRect();
    var vh = window.innerHeight;
    // Fade in as the hijack top moves from 80vh down to 17vh (where it locks)
    var inT = (vh * 0.8 - rect.top) / (vh * 0.63);
    // Fade out as the hijack bottom moves from 83vh down to 20vh
    var outT = (rect.bottom - vh * 0.2) / (vh * 0.63);
    var t = Math.min(inT, outT);
    return Math.max(0, Math.min(1, t));
  }

  var rafId = null;
  var lastStep = 0;

  function setActive(step) {
    if (step === lastStep) return;
    lastStep = step;
    blockSteps.forEach(function (el) {
      el.classList.toggle('is-active', parseInt(el.dataset.step, 10) === step);
    });
    explainSteps.forEach(function (el) {
      el.classList.toggle('is-active', parseInt(el.dataset.step, 10) === step);
    });
    pills.forEach(function (el) {
      el.classList.toggle('is-active', parseInt(el.dataset.step, 10) === step);
    });
    if (progressNum) progressNum.textContent = (step + 1);
  }

  function updateFromScroll() {
    var rect = hijack.getBoundingClientRect();
    var total = hijack.offsetHeight - window.innerHeight;
    var scrolled = Math.max(0, Math.min(total, -rect.top));
    var progress = total > 0 ? scrolled / total : 0;
    // Slight bias so the active step lines up with the visible center of each segment
    var step = Math.min(stepCount - 1, Math.floor(progress * stepCount + 0.0001));
    setActive(step);
    if (dim) dim.style.opacity = getDimOpacity();
  }

  window.addEventListener('scroll', function () {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      updateFromScroll();
      rafId = null;
    });
  }, { passive: true });

  window.addEventListener('resize', updateFromScroll, { passive: true });

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var step = parseInt(pill.dataset.step, 10);
      var rect = hijack.getBoundingClientRect();
      var total = hijack.offsetHeight - window.innerHeight;
      // Aim for the middle of the step's scroll segment, plus a tiny offset so the right step fires
      var target = window.scrollY + rect.top + (step + 0.5) * (total / stepCount);
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });

  // Skip-ahead button: jump past the entire hijack track
  var skipBtn = document.getElementById('lp_wf_skip');
  if (skipBtn) {
    skipBtn.addEventListener('click', function () {
      var rect = hijack.getBoundingClientRect();
      var target = window.scrollY + rect.top + hijack.offsetHeight - window.innerHeight * 0.1;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  }

  // Go-back button: jump to right before the hijack engages (top of chapter 03)
  var backBtn = document.getElementById('lp_wf_back');
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      var ch03 = document.getElementById('lp_methods_ch03');
      var anchor = ch03 || hijack;
      var rect = anchor.getBoundingClientRect();
      var target = window.scrollY + rect.top - 120;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  }

  // Init
  updateFromScroll();
})();
