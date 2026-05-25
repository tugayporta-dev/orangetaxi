/**
 * Orange Taxi Basel – script.js
 * Sticky Header · Mobile Nav · Scroll Reveal · Form · Jahr
 */
'use strict';

const header      = document.getElementById('header');
const burger      = document.getElementById('burger');
const nav         = document.getElementById('nav');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const yearEl      = document.getElementById('year');

/* ── JAHR ── */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── STICKY HEADER ── */
function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── MOBILE NAV ── */
if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav__link').forEach(l => {
    l.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', e => {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !burger.contains(e.target)) {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'), 10) || 76;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hh, behavior: 'smooth' });
  });
});

/* ── SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -48px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── FORM ── */
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let ok = true;
    this.querySelectorAll('[required]').forEach(f => {
      f.classList.remove('error');
      if (!f.value.trim()) { f.classList.add('error'); ok = false; }
    });
    if (!ok) { this.querySelector('.error')?.focus(); return; }

    const g = id => document.getElementById(id)?.value.trim() || '';
    const subject = encodeURIComponent('Taxifahrt-Anfrage – Orange Taxi Basel');
    const body = encodeURIComponent(
      'Neue Anfrage über orangetaxi.ch\n\n' +
      'Name:      ' + g('name')    + '\n' +
      'Telefon:   ' + g('phone')   + '\n' +
      'E-Mail:    ' + g('email')   + '\n' +
      'Abholort:  ' + g('from')    + '\n' +
      'Zielort:   ' + g('to')      + '\n' +
      'Datum:     ' + g('date')    + '\n' +
      'Uhrzeit:   ' + g('time')    + '\n\n' +
      'Nachricht:\n' + g('message')
    );

    window.location.href = 'mailto:baki.portakal@hotmail.com?subject=' + subject + '&body=' + body;
    this.reset();
    if (formSuccess) {
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 7000);
    }
  });

  contactForm.querySelectorAll('input,textarea').forEach(f => {
    f.addEventListener('input', () => f.classList.remove('error'));
  });
}
