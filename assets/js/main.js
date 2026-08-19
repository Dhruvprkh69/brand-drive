/**
 * Brand Drive — main.js
 * Navigation, theme, forms, loader, Lenis init
 */
(function () {
  'use strict';

  const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';

  /* ── Loader ── */
  const loader = document.getElementById('loader');

  function hideLoader() {
    loader?.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  window.addEventListener('load', () => {
    setTimeout(hideLoader, 1900);
  });
  setTimeout(hideLoader, 2800);

  /* ── Header ── */
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateHeader() {
    if (!header) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('is-scrolled', scrollY > 60);
  }

  function onScroll() {
    updateHeader();
    window.updateHomeScrollSpy?.();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateHeader();

  /* Active page link (subpages — homepage uses scroll spy below) */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isHomePage = currentPage === 'index.html' || currentPage === '';

  if (!isHomePage) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const linkPage = href.split('/').pop().split('#')[0];
      if (linkPage === currentPage) {
        link.classList.add('is-active');
      }
    });
  }

  /* Homepage scroll spy — sliding nav underline */
  function initHomeScrollSpy() {
    if (!isHomePage) return;

    const navList = document.querySelector('.nav__list');
    if (!navList) return;

    navList.classList.add('nav__list--scrollspy');

    const indicator = document.createElement('span');
    indicator.className = 'nav__indicator';
    indicator.setAttribute('aria-hidden', 'true');
    navList.appendChild(indicator);

    const sectionMap = [
      { id: 'hero', getLink: () => navList.querySelector('a[href="index.html"]') },
      { id: 'trusted', getLink: () => navList.querySelector('a[href="clients.html"]') },
      { id: 'about-preview', getLink: () => navList.querySelector('a[href="about.html"]:not([href*="#"])') },
      { id: 'industries', getLink: () => navList.querySelector('a[href*="industries.html"].nav__link--dropdown') },
      { id: 'solutions', getLink: () => navList.querySelector('a[href*="solutions.html"].nav__link--dropdown') },
      { id: 'process', getLink: () => navList.querySelector('a[href="about.html#why"]') },
      { id: 'metrics', getLink: () => navList.querySelector('a[href="clients.html"]') },
    ];

    const sections = sectionMap
      .map((entry) => ({ ...entry, el: document.getElementById(entry.id) }))
      .filter((entry) => entry.el);

    let activeLink = null;

    function moveIndicator(link) {
      if (!link) {
        indicator.style.opacity = '0';
        return;
      }
      const listRect = navList.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.left = `${linkRect.left - listRect.left}px`;
      indicator.style.opacity = '1';
    }

    function setActiveLink(link) {
      navLinks.forEach((l) => l.classList.remove('is-active'));
      if (link) link.classList.add('is-active');
      moveIndicator(link);
      activeLink = link;
    }

    function updateHomeScrollSpy() {
      const offset = (header?.offsetHeight || 88) + 96;
      const scrollY = window.getLenis?.()?.scroll ?? (window.scrollY || document.documentElement.scrollTop);
      const scrollPos = scrollY + offset;
      let current = sections[0];

      sections.forEach((section) => {
        if (section.el.offsetTop <= scrollPos) current = section;
      });

      const link = current.getLink();
      if (link !== activeLink) setActiveLink(link);
    }

    window.updateHomeScrollSpy = updateHomeScrollSpy;

    window.addEventListener('resize', () => moveIndicator(activeLink));
    window.addEventListener('load', () => {
      updateHomeScrollSpy();
      moveIndicator(activeLink);
    });

    updateHomeScrollSpy();
  }

  initHomeScrollSpy();

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('is-active');
    nav?.classList.toggle('is-open');
    document.body.style.overflow = nav?.classList.contains('is-open') ? 'hidden' : '';
  });

  navLinks.forEach((link) => {
    if (link.classList.contains('nav__link--dropdown')) return;
    link.addEventListener('click', () => {
      navToggle?.classList.remove('is-active');
      nav?.classList.remove('is-open');
      document.body.style.overflow = '';
      closeAllDropdowns();
    });
  });

  function closeAllDropdowns() {
    document.querySelectorAll('.nav__item--has-dropdown.is-open').forEach((el) => el.classList.remove('is-open'));
  }

  /* Nav dropdowns — desktop click + mobile tap */
  document.querySelectorAll('.nav__item--has-dropdown').forEach((item) => {
    const trigger = item.querySelector('.nav__link--dropdown');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wasOpen = item.classList.contains('is-open');
      closeAllDropdowns();
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__item--has-dropdown')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  /* Dropdown scroll — keep wheel inside menu, not the page (Lenis fix) */
  document.querySelectorAll('.nav__dropdown').forEach((dropdown) => {
    dropdown.setAttribute('data-lenis-prevent', '');

    dropdown.addEventListener('wheel', (e) => {
      if (dropdown.scrollHeight <= dropdown.clientHeight) return;

      const goingUp = e.deltaY < 0;
      const goingDown = e.deltaY > 0;
      const atTop = dropdown.scrollTop <= 0;
      const atBottom = dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight - 1;

      if ((goingUp && atTop) || (goingDown && atBottom)) {
        e.preventDefault();
      }
      e.stopPropagation();
    }, { passive: false });
  });

  /* ── Lenis (desktop only) ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  let lenis = null;

  window.initLenis = function () {
    if (prefersReducedMotion || isTouch || typeof Lenis === 'undefined') return null;

    lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', () => {
      updateHeader();
      window.updateHomeScrollSpy?.();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });

    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -88 });
      });
    });

    return lenis;
  };

  window.getLenis = () => lenis;

  /* ── Magnetic buttons ── */
  if (!prefersReducedMotion && !isTouch) {
    document.querySelectorAll('.btn--magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.12;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ── Footer newsletter ── */
  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input?.value) {
      alert('Thank you for subscribing! We\'ll be in touch soon.');
      input.value = '';
    }
  });

  /* ── Contact form → Google Sheets ── */
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  const contactSubmit = document.getElementById('contact-submit');

  function setStatus(type, msg) {
    if (!contactStatus) return;
    contactStatus.textContent = msg || '';
    contactStatus.className = 'form-status' + (type ? ` form-status--${type}` : '');
  }

  function postToGoogleSheet(data) {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden-form-' + Date.now();
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = GOOGLE_SCRIPT_URL;
      form.target = iframe.name;

      Object.entries(data).forEach(([key, val]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = val;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      iframe.onload = () => {
        setTimeout(() => {
          form.remove();
          iframe.remove();
          resolve();
        }, 500);
      };
      iframe.onerror = reject;
      form.submit();
    });
  }

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')) {
      setStatus('error', 'Form not configured — add your Google Script URL in main.js.');
      return;
    }

    const honeypot = contactForm.querySelector('[name="website"]');
    if (honeypot?.value) return;

    const fd = new FormData(contactForm);
    const name = (fd.get('name') || '').trim();
    const email = (fd.get('email') || '').trim();
    const phone = (fd.get('phone') || '').trim();
    const subject = (fd.get('subject') || '').trim();
    let message = (fd.get('message') || '').trim();

    if (!name || !email || !message) {
      setStatus('error', 'Please fill in all required fields.');
      return;
    }

    if (subject) message = `Subject: ${subject}\n\n${message}`;

    contactSubmit.disabled = true;
    contactSubmit.textContent = 'Sending...';
    setStatus('', '');

    try {
      await postToGoogleSheet({ name, email, phone, message });
      contactForm.reset();
      setStatus('success', 'Thank you! Your message has been sent. We\'ll get back to you soon.');
    } catch {
      setStatus('error', 'Something went wrong. Please try again or WhatsApp us directly.');
    } finally {
      contactSubmit.disabled = false;
      contactSubmit.textContent = 'Send Message';
    }
  });

  /* ── Footer year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
