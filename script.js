/**
 * Orange Taxi Basel – script.js
 * Funktionen: Sticky Header, Mobile Nav, Scroll Animations, Formular, Jahr
 */

'use strict';

/* ── DOM REFERENZEN ── */
const header    = document.getElementById('header');
const burger    = document.getElementById('burger');
const nav       = document.getElementById('nav');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const yearEl    = document.getElementById('year');

/* ── AKTUELLES JAHR IM FOOTER ── */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── STICKY HEADER ── */
function handleScroll() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // Initial ausführen

/* ── MOBILE NAVIGATION ── */
if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Schliessen bei Klick auf einen Nav-Link
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Schliessen bei Klick ausserhalb
  document.addEventListener('click', e => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ── SMOOTH SCROLL FÜR ANKER-LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── SCROLL ANIMATIONEN ── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// Starte nach DOMContentLoaded (oder sofort, falls bereits geladen)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

/* ── KONTAKTFORMULAR ── */
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Einfache Validierung
    let valid = true;
    const required = contactForm.querySelectorAll('[required]');

    required.forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) {
      // Erstes fehlerhaftes Feld fokussieren
      const firstError = contactForm.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Formulardaten sammeln (für mailto-Fallback oder spätere Backend-Integration)
    const data = {
      name:    document.getElementById('name')?.value.trim()    || '',
      phone:   document.getElementById('phone')?.value.trim()   || '',
      email:   document.getElementById('email')?.value.trim()   || '',
      from:    document.getElementById('from')?.value.trim()    || '',
      to:      document.getElementById('to')?.value.trim()      || '',
      date:    document.getElementById('date')?.value           || '',
      time:    document.getElementById('time')?.value           || '',
      message: document.getElementById('message')?.value.trim() || '',
    };

    // mailto-Fallback: öffnet Standard-Mail-App mit allen Feldern vorausgefüllt
    const subject = encodeURIComponent('Taxifahrt-Anfrage – Orange Taxi Basel');
    const body = encodeURIComponent(
      `Neue Anfrage über orangetaxi.ch\n\n` +
      `Name:        ${data.name}\n` +
      `Telefon:     ${data.phone}\n` +
      `E-Mail:      ${data.email}\n` +
      `Abholort:    ${data.from}\n` +
      `Zielort:     ${data.to}\n` +
      `Datum:       ${data.date}\n` +
      `Uhrzeit:     ${data.time}\n\n` +
      `Nachricht:\n${data.message}`
    );

    // Mailto-Link öffnen
    window.location.href = `mailto:baki.portakal@hotmail.com?subject=${subject}&body=${body}`;

    // Erfolgsanzeige
    contactForm.reset();
    if (formSuccess) {
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    }
  });

  // Fehler-Klasse bei Eingabe entfernen
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}

/* ── ACTIVE NAV LINK (Scroll Spy) ── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    {
      threshold: 0.25,
      rootMargin: '-64px 0px -60% 0px',
    }
  );

  sections.forEach(section => observer.observe(section));
}
document.addEventListener('DOMContentLoaded', initScrollSpy);
