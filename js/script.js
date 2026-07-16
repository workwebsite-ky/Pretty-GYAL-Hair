/* ============================================================
   PRETTY GYAL HAIR LLC — Interactions & Motion
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Preloader ---------- */
  window.addEventListener('load', function () {
    var pre = document.querySelector('.preloader');
    if (pre) setTimeout(function () { pre.classList.add('hidden'); }, 500);
  });
  // Safety: hide preloader after 3s no matter what
  setTimeout(function () {
    var pre = document.querySelector('.preloader');
    if (pre) pre.classList.add('hidden');
  }, 3000);

  /* ---------- Sticky navbar ---------- */
  var navbar = document.querySelector('.navbar');
  function onScrollNav() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.navbar__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        links.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal, .stagger');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Hero parallax ---------- */
  var heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroBg.style.transform = 'scale(1.08) translateY(' + y * 0.25 + 'px)';
      }
    }, { passive: true });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1800, start = null;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var answer = item.querySelector('.faq__a');
      var isOpen = item.classList.contains('open');
      // close others
      document.querySelectorAll('.faq__item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq__a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Pricing tabs ---------- */
  var tabs = document.querySelectorAll('.price-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelectorAll('.price-panel').forEach(function (p) { p.classList.remove('active'); });
      var panel = document.getElementById(tab.getAttribute('data-panel'));
      if (panel) panel.classList.add('active');
    });
  });

  /* ---------- Back to top ---------- */
  var backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    document.querySelectorAll('.gallery__item, [data-lightbox]').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.tagName === 'IMG' ? item : item.querySelector('img');
        if (!img) return;
        lbImg.src = img.src;
        lbImg.alt = img.alt || 'Pretty GYAL Hair';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLb() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox__close')) closeLb();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }

  /* ---------- Countdown (Hair Show page) ---------- */
  var cd = document.querySelector('[data-countdown]');
  if (cd) {
    var targetDate = new Date(cd.getAttribute('data-countdown')).getTime();
    var dEl = cd.querySelector('.cd-days'), hEl = cd.querySelector('.cd-hours'),
        mEl = cd.querySelector('.cd-mins'), sEl = cd.querySelector('.cd-secs');
    function updateCd() {
      var diff = targetDate - Date.now();
      if (diff < 0) diff = 0;
      var d = Math.floor(diff / 864e5),
          h = Math.floor(diff % 864e5 / 36e5),
          m = Math.floor(diff % 36e5 / 6e4),
          s = Math.floor(diff % 6e4 / 1e3);
      if (dEl) dEl.textContent = String(d).padStart(2, '0');
      if (hEl) hEl.textContent = String(h).padStart(2, '0');
      if (mEl) mEl.textContent = String(m).padStart(2, '0');
      if (sEl) sEl.textContent = String(s).padStart(2, '0');
    }
    updateCd();
    setInterval(updateCd, 1000);
  }

  /* ---------- Contact / booking forms (mailto fallback) ---------- */
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var to = form.getAttribute('data-mailto');
      var subjectBase = form.getAttribute('data-subject') || 'Website Inquiry — Pretty GYAL Hair';
      var fields = form.querySelectorAll('input, textarea, select');
      var lines = [];
      fields.forEach(function (f) {
        if (f.name && f.value) lines.push(f.name + ': ' + f.value);
      });
      var body = encodeURIComponent(lines.join('\n'));
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subjectBase) + '&body=' + body;
      var note = form.querySelector('.form-sent');
      if (note) note.style.display = 'block';
    });
  });

  /* ---------- Active nav link ---------- */
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a').forEach(function (a) {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();
