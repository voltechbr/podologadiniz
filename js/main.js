(function () {
  'use strict';

  /* ------------------------------------------------------------
     CONFIGURAÇÃO — preencha o número de WhatsApp da Luciana
     Formato internacional, só dígitos. Ex.: DDI 55 + DDD + número
     ------------------------------------------------------------ */
  var WHATSAPP_NUMBER = '5511971585951';
  var WHATSAPP_MESSAGE = 'Olá, Luciana! Gostaria de agendar um atendimento.';

  var doc = document;
  var body = doc.body;
  var header = doc.querySelector('.header');
  var burger = doc.querySelector('.burger');
  var nav = doc.getElementById('menu');
  var isMobile = window.matchMedia('(max-width: 960px)');

  /* ---------- Links do WhatsApp ---------- */
  if (WHATSAPP_NUMBER) {
    var url = 'https://wa.me/' + WHATSAPP_NUMBER.replace(/\D/g, '') +
              '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);
    doc.querySelectorAll('[data-whatsapp]').forEach(function (a) {
      var msg = a.getAttribute('data-msg');
      a.href = msg ? 'https://wa.me/' + WHATSAPP_NUMBER.replace(/\D/g, '') + '?text=' + encodeURIComponent(msg) : url;
      a.target = '_blank'; a.rel = 'noopener noreferrer';
    });
  }

  /* ---------- Header: estado ao rolar ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
    if (isMobile.matches) {
      if (open) { nav.removeAttribute('inert'); } else { nav.setAttribute('inert', ''); }
    }
  }
  function syncInert() {
    if (isMobile.matches) { nav.setAttribute('inert', ''); } else { nav.removeAttribute('inert'); setMenu(false); }
  }
  syncInert();
  isMobile.addEventListener('change', syncInert);

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { if (isMobile.matches) setMenu(false); });
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      setMenu(false); burger.focus();
    }
  });

  /* ---------- Vídeo do hero ---------- */
  var video = doc.querySelector('.hero__video');
  if (video) {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var conn = navigator.connection || {};
    var saveData = conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || '');

    video.muted = true; // garante autoplay em todos os navegadores
    if (reduceMotion || saveData) {
      // respeita preferências: mantém apenas o quadro de capa
      video.removeAttribute('autoplay');
      video.pause();
    } else {
      var p = video.play();
      if (p && p.catch) { p.catch(function () { /* autoplay bloqueado: o poster permanece */ }); }
    }
  }

  /* ---------- Link ativo no menu (preparado para as próximas seções) ---------- */
  var links = Array.prototype.slice.call(doc.querySelectorAll('.nav__link'));
  var targets = links.map(function (l) { return doc.querySelector(l.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = targets.indexOf(en.target);
        links.forEach(function (l, j) { l.classList.toggle('is-active', j === i); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { if (t) io.observe(t); });
  }

  /* ---------- Ano do rodapé ---------- */
  doc.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Revelar seções ao rolar ---------- */
  var reveals = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    doc.documentElement.classList.add('js');
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  }
})();
