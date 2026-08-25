/**
 * Brand Drive — main.js
 * Navigation, theme, forms, loader, Lenis init
 */
(function () {
  'use strict';

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxtHLxqDsPrgqJcCKkVbOZMHPL0cwarjgnF8zcxx1tZ6qRyEYo_C8RoYmiv4bQBfpgRg/exec';

  /* ── Loader ── */
  const loader = document.getElementById('loader');
  const loaderLogo = loader?.querySelector('.logo-brand--loader');
  let loaderHidden = false;
  const isMobileView = () => window.matchMedia('(max-width: 768px)').matches;

  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    loader?.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    window.dispatchEvent(new Event('branddrive:ready'));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function waitForImage(img, timeoutMs) {
    return new Promise((resolve) => {
      if (!img) {
        resolve(false);
        return;
      }
      if (img.complete && img.naturalWidth > 0) {
        resolve(true);
        return;
      }
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        resolve(ok);
      };
      img.addEventListener('load', () => done(true), { once: true });
      img.addEventListener('error', () => done(false), { once: true });
      setTimeout(() => done(img.complete && img.naturalWidth > 0), timeoutMs);
    });
  }

  function preloadUrl(src, timeoutMs) {
    return new Promise((resolve) => {
      if (!src) {
        resolve(false);
        return;
      }
      const img = new Image();
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        resolve(ok);
      };
      img.onload = () => done(true);
      img.onerror = () => done(false);
      img.src = src;
      setTimeout(() => done(img.complete && img.naturalWidth > 0), timeoutMs);
    });
  }

  async function runLoader() {
    // Laptop: keep fast, polished open
    if (!isMobileView()) {
      await waitForImage(loaderLogo, 1800);
      loader?.classList.add('is-logo-ready');
      const minShow = new Promise((r) => setTimeout(r, 700));
      const pageLoad = new Promise((r) => {
        if (document.readyState === 'complete') r();
        else window.addEventListener('load', r, { once: true });
      });
      await Promise.race([
        Promise.all([minShow, pageLoad]),
        new Promise((r) => setTimeout(r, 2200)),
      ]);
      hideLoader();
      return;
    }

    // Mobile: wait until first-screen assets are ready (up to ~5s)
    loader?.classList.add('is-logo-ready');
    const critical = [
      waitForImage(loaderLogo, 4500),
      waitForImage(document.querySelector('.logo-brand--header'), 4500),
      waitForImage(document.querySelector('.hero__bg img'), 4500),
      preloadUrl('assets/images/brands/brand-1.webp', 4500),
      preloadUrl('assets/images/brands/brand-2.webp', 4500),
      preloadUrl('assets/images/brands/brand-3.webp', 4500),
      preloadUrl('assets/images/brands/brand-4.webp', 4500),
      preloadUrl('assets/images/brands/brand-5.webp', 4500),
      preloadUrl('assets/images/brands/brand-6.webp', 4500),
    ];

    const pageLoad = new Promise((r) => {
      if (document.readyState === 'complete') r();
      else window.addEventListener('load', r, { once: true });
    });

    await Promise.race([
      Promise.all([...critical, pageLoad]),
      new Promise((r) => setTimeout(r, 5000)),
    ]);

    // brief beat so client sees complete loader, then reveal
    await new Promise((r) => setTimeout(r, 250));
    hideLoader();
  }

  runLoader();
  // absolute safety net
  setTimeout(hideLoader, isMobileView() ? 5500 : 2800);

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
      { id: 'process', getLink: () => navList.querySelector('a[href="why.html"]') },
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

  function setMobileNavOpen(isOpen) {
    navToggle?.classList.toggle('is-active', isOpen);
    nav?.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('is-nav-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (!isOpen) resetDrillNav();
  }

  function resetDrillNav() {
    nav?.classList.remove('is-drill-view');
    document.querySelectorAll('.nav__item--has-dropdown.is-drill-open').forEach((el) => {
      el.classList.remove('is-drill-open');
    });
  }

  function ensureDrillHead(item) {
    const dropdown = item.querySelector('.nav__dropdown');
    if (!dropdown || dropdown.querySelector('.nav__drill-head')) return;

    const trigger = item.querySelector('.nav__link--dropdown');
    const href = trigger?.getAttribute('href') || '#';
    const label = dropdown.getAttribute('aria-label')
      || (trigger?.childNodes && Array.from(trigger.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent.trim())
        .join(' '))
      || 'Menu';

    const head = document.createElement('div');
    head.className = 'nav__drill-head';
    head.innerHTML = `
      <button type="button" class="nav__drill-back" aria-label="Back to main menu">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
        <span>Back</span>
      </button>
      <a href="${href}" class="nav__drill-title">${label}</a>
    `;
    dropdown.insertBefore(head, dropdown.firstChild);

    head.querySelector('.nav__drill-back').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetDrillNav();
    });
  }

  navToggle?.addEventListener('click', () => {
    setMobileNavOpen(!nav?.classList.contains('is-open'));
  });

  navLinks.forEach((link) => {
    if (link.classList.contains('nav__link--dropdown')) return;
    link.addEventListener('click', () => {
      setMobileNavOpen(false);
      closeAllDropdowns();
    });
  });

  document.querySelectorAll('.nav__dropdown a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!window.matchMedia('(max-width: 768px)').matches) return;
      setMobileNavOpen(false);
      resetDrillNav();
    });
  });

  function closeAllDropdowns() {
    document.querySelectorAll('.nav__item--has-dropdown.is-open').forEach((el) => el.classList.remove('is-open'));
  }

  /* Nav dropdowns — desktop hover/click; mobile drill-down panel */
  document.querySelectorAll('.nav__item--has-dropdown').forEach((item) => {
    const trigger = item.querySelector('.nav__link--dropdown');
    if (!trigger) return;

    ensureDrillHead(item);

    trigger.addEventListener('click', (e) => {
      const isMobileNav = window.matchMedia('(max-width: 768px)').matches;

      if (isMobileNav) {
        e.preventDefault();
        e.stopPropagation();
        closeAllDropdowns();
        document.querySelectorAll('.nav__item--has-dropdown.is-drill-open').forEach((el) => {
          if (el !== item) el.classList.remove('is-drill-open');
        });
        item.classList.add('is-drill-open');
        nav?.classList.add('is-drill-view');
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      const wasOpen = item.classList.contains('is-open');
      closeAllDropdowns();
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  document.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (!e.target.closest('.nav__item--has-dropdown')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (nav?.classList.contains('is-drill-view')) {
      resetDrillNav();
      return;
    }
    closeAllDropdowns();
  });

  window.matchMedia('(max-width: 768px)').addEventListener('change', (e) => {
    if (!e.matches) resetDrillNav();
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

  function clearFieldErrors() {
    if (!contactForm) return;
    contactForm.querySelectorAll('.form-group.is-invalid').forEach((group) => {
      group.classList.remove('is-invalid');
    });
    contactForm.querySelectorAll('.form-field-error').forEach((el) => el.remove());
  }

  function showFieldError(field, message) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.add('is-invalid');
    let err = group.querySelector('.form-field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'form-field-error';
      group.appendChild(err);
    }
    err.textContent = message;
  }

  function digitsOnly(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateContactForm() {
    clearFieldErrors();
    setStatus('', '');

    const nameEl = contactForm.querySelector('#name');
    const emailEl = contactForm.querySelector('#email');
    const phoneEl = contactForm.querySelector('#phone');
    const subjectEl = contactForm.querySelector('#subject');
    const budgetEl = contactForm.querySelector('#budget');
    const messageEl = contactForm.querySelector('#message');

    const name = (nameEl?.value || '').trim();
    const email = (emailEl?.value || '').trim();
    const phone = digitsOnly(phoneEl?.value);
    const subject = (subjectEl?.value || '').trim();
    const budget = (budgetEl?.value || '').trim();
    const message = (messageEl?.value || '').trim();

    let firstInvalid = null;

    if (!name) {
      showFieldError(nameEl, 'Please fill this field');
      firstInvalid = firstInvalid || nameEl;
    }

    if (!email) {
      showFieldError(emailEl, 'Please fill this field');
      firstInvalid = firstInvalid || emailEl;
    } else if (!isValidEmail(email)) {
      showFieldError(emailEl, 'Please enter a valid email');
      firstInvalid = firstInvalid || emailEl;
    }

    if (!phone) {
      showFieldError(phoneEl, 'Please fill this field');
      firstInvalid = firstInvalid || phoneEl;
    } else if (phone.length !== 10) {
      showFieldError(phoneEl, 'Phone number must be 10 digits');
      firstInvalid = firstInvalid || phoneEl;
    }

    if (!subject) {
      showFieldError(subjectEl, 'Please fill this field');
      firstInvalid = firstInvalid || subjectEl;
    }

    if (!budget) {
      showFieldError(budgetEl, 'Please fill this field');
      firstInvalid = firstInvalid || budgetEl;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return null;
    }

    if (phoneEl) phoneEl.value = phone;

    return { name, email, phone, subject, budget, message };
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

  contactForm?.addEventListener('input', (e) => {
    const group = e.target.closest('.form-group');
    if (!group?.classList.contains('is-invalid')) return;
    group.classList.remove('is-invalid');
    group.querySelector('.form-field-error')?.remove();
  });

  contactForm?.addEventListener('change', (e) => {
    const group = e.target.closest('.form-group');
    if (!group?.classList.contains('is-invalid')) return;
    group.classList.remove('is-invalid');
    group.querySelector('.form-field-error')?.remove();
  });

  contactForm?.querySelector('#phone')?.addEventListener('input', (e) => {
    e.target.value = digitsOnly(e.target.value).slice(0, 10);
  });

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')) {
      setStatus('error', 'Form not configured — add your Google Script URL in main.js.');
      return;
    }

    const honeypot = contactForm.querySelector('[name="website"]');
    if (honeypot?.value) return;

    const data = validateContactForm();
    if (!data) return;

    contactSubmit.disabled = true;
    contactSubmit.textContent = 'Sending...';
    setStatus('', '');

    try {
      await postToGoogleSheet(data);
      clearFieldErrors();
      contactForm.reset();
      setStatus('success', 'Thank you! Your message has been sent. We\'ll reach you within 24 hours.');
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

  /* ── Industries: Challenges / Solutions / Benefits tabs ── */
  document.querySelectorAll('.industry-detail__grid > div').forEach((col) => {
    const lists = Array.from(col.querySelectorAll(':scope > .detail-list'));
    if (lists.length < 2) return;

    const box = document.createElement('div');
    box.className = 'insight-tabs';

    const nav = document.createElement('div');
    nav.className = 'insight-tabs__nav';
    nav.setAttribute('role', 'tablist');

    lists.forEach((list, index) => {
      const title = (list.querySelector('.detail-list__title')?.textContent || `Option ${index + 1}`).trim();
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'insight-tabs__btn' + (index === 0 ? ' is-active' : '');
      btn.textContent = title;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

      list.classList.toggle('is-active', index === 0);

      btn.addEventListener('click', () => {
        nav.querySelectorAll('.insight-tabs__btn').forEach((tab) => {
          tab.classList.remove('is-active');
          tab.setAttribute('aria-selected', 'false');
        });
        lists.forEach((panel) => panel.classList.remove('is-active'));
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        list.classList.add('is-active');
      });

      nav.appendChild(btn);
    });

    lists.forEach((list) => box.appendChild(list));
    box.insertBefore(nav, box.firstChild);
    col.insertBefore(box, col.querySelector('.btn, .industry-consult'));
  });
})();
