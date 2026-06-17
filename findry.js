/* ================================================================
   findry.js — shared site logic
   WhatsApp: +92 345 2016125
   ================================================================ */
(function () {
  'use strict';

  var WA_URL = 'https://wa.me/923452016125?text=' + encodeURIComponent(
    'Hello Findry! I\'d like to learn about improving my Google visibility on Search and Maps.'
  );

  /* ── WhatsApp links ── */
  document.querySelectorAll('[data-wa]').forEach(function (el) { el.href = WA_URL; });

  /* ── Sticky nav shadow ── */
  var nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 6);
    }, { passive: true });
  }

  /* ── Mobile hamburger ── */
  var ham = document.querySelector('.nav-hamburger');
  var mob = document.querySelector('.nav-mobile');
  if (ham && mob) {
    ham.addEventListener('click', function () {
      var open = ham.classList.toggle('open');
      mob.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (nav && !nav.contains(e.target) && mob.classList.contains('open')) {
        ham.classList.remove('open');
        mob.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Scroll reveal ── */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── i18n ── */
  var SHARED_UR = {
    navLocalSeo: 'لوکل ایس ای او', navCases: 'کیس اسٹڈیز', navPricing: 'قیمتیں',
    navBook: 'کال بُک کریں', navFreeCheck: 'مفت جائزہ',
    waBtn: 'WhatsApp کریں', waStickyBtn: 'WhatsApp',
    colServices: 'خدمات', colStart: 'آغاز کریں', colFollow: 'فالو کریں',
    footerTagline: 'نمایاں رہیں — مقامی کاروبار کے لیے بنایا گیا۔ ہم آپ کو آپ کے قریب ترین گاہکوں تک پہنچاتے ہیں۔',
    footerPrivacy: 'پرائیویسی', footerTerms: 'شرائط',
    getStarted: 'شروع کریں',
    planEntry: 'انٹری', tagEntry: 'ایک دکان کے لیے جو ابھی شروع ہو رہی ہے۔',
    planGrowth: 'گروتھ', tagGrowth: 'مصروف دکانوں کے لیے جہاں مقابلہ زیادہ ہو۔',
    planBasic: 'بیسک', tagBasic: 'بہت چھوٹی لسٹنگ کے لیے سادہ پلان۔',
    mostStart: 'زیادہ تر یہیں سے شروع کرتے ہیں',
    setupLabel: 'ایک بار کا سیٹ اپ', perMo: '/ماہ', monthToMonth: 'ماہ بہ ماہ',
    viewAllPlans: 'تمام پلان دیکھیں', seeAllPlans: 'تمام پلان دیکھیں'
  };

  var PAGE_T = window.FINDRY_T || {};
  var T = {
    en: Object.assign({}, PAGE_T.en || {}),
    ur: Object.assign({}, SHARED_UR, PAGE_T.ur || {})
  };

  /* Cache original English text from HTML before any swap happens */
  var origEN = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    origEN[el.dataset.i18n] = el.textContent;
  });

  var lang = 'en';
  try { lang = localStorage.getItem('findry-lang') || 'en'; } catch (e) {}
  var urFonts = false;

  function loadUrFonts() {
    if (urFonts) return;
    urFonts = true;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }

  function applyLang(l) {
    /* EN → restore original HTML content; UR → use T.ur dict */
    var t = l === 'en' ? origEN : (T[l] || {});
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ur' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t[el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === l);
    });
    if (l === 'ur') loadUrFonts();
  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem('findry-lang', l); } catch (e) {}
    applyLang(l);
  }

  document.querySelectorAll('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  if (lang !== 'en') applyLang(lang);

  /* ── Analytics (GTM dataLayer) ── */
  window.dataLayer = window.dataLayer || [];

  /* WhatsApp clicks */
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    el.addEventListener('click', function () {
      window.dataLayer.push({ event: 'whatsapp_click', element_type: el.tagName.toLowerCase() });
    });
  });

  /* Phone link clicks (footer bdi containing the number) */
  document.querySelectorAll('a.footer-wa-link').forEach(function (el) {
    el.addEventListener('click', function () {
      window.dataLayer.push({ event: 'phone_click' });
    });
  });

  /* CTA button clicks (pricing CTAs, hero CTAs, nav CTAs) */
  document.querySelectorAll('.btn-primary, .btn-dark, .btn-wa, .btn-outline, .btn-outline-light').forEach(function (el) {
    el.addEventListener('click', function () {
      var text = (el.textContent || '').trim().slice(0, 80);
      var href = el.getAttribute('href') || '';
      var type = href.indexOf('free-check') > -1 ? 'free_check_cta'
               : href.indexOf('book-a-call') > -1 ? 'book_call_cta'
               : href.indexOf('pricing') > -1 ? 'pricing_cta'
               : 'cta_click';
      window.dataLayer.push({ event: type, cta_text: text, destination: href });
    });
  });

})();
