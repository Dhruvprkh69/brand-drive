/**
 * Brand Drive — mobile.js
 * Mobile-only UX: footer accordion + auto card slideshows.
 */
(function () {
  'use strict';

  const MOBILE_MQ = window.matchMedia('(max-width: 768px)');
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

  function isMobileFooter() {
    return MOBILE_MQ.matches;
  }

  function shouldRunSlideshow() {
    return MOBILE_MQ.matches && !REDUCED_MOTION.matches;
  }

  function buildSlideshow(container) {
    if (container.querySelector('.mobile-slideshow__track')) return;

    const items = Array.from(container.children).filter((el) => !el.classList.contains('mobile-slideshow__track'));
    if (items.length < 2) return;

    const track = document.createElement('div');
    track.className = 'mobile-slideshow__track';

    const group1 = document.createElement('div');
    group1.className = 'mobile-slideshow__group';

    const group2 = document.createElement('div');
    group2.className = 'mobile-slideshow__group';
    group2.setAttribute('aria-hidden', 'true');

    items.forEach((item) => group1.appendChild(item));
    items.forEach((item) => group2.appendChild(item.cloneNode(true)));

    track.appendChild(group1);
    track.appendChild(group2);
    container.appendChild(track);

    const secondsPerCard = container.classList.contains('process-track')
      || container.classList.contains('grid-3')
      ? 5.5
      : 6.5;
    track.style.setProperty('--slideshow-duration', `${Math.max(items.length * secondsPerCard, 24)}s`);
  }

  function destroySlideshow(container) {
    const track = container.querySelector('.mobile-slideshow__track');
    if (!track) return;

    const group1 = track.querySelector('.mobile-slideshow__group:not([aria-hidden="true"])')
      || track.querySelector('.mobile-slideshow__group');
    if (!group1) {
      track.remove();
      return;
    }

    Array.from(group1.children).forEach((item) => container.appendChild(item));
    track.remove();
  }

  function initMobileSlideshows() {
    document.querySelectorAll('.mobile-slideshow').forEach((container) => {
      if (shouldRunSlideshow()) {
        buildSlideshow(container);
      } else {
        destroySlideshow(container);
      }
    });
  }

  function setupFooterColumns() {
    document.querySelectorAll('.footer__top > div:not(.footer__brand)').forEach((col) => {
      col.classList.add('footer__col');

      const heading = col.querySelector('.footer__heading');
      if (!heading || heading.dataset.footerAccordion === 'true') return;

      heading.dataset.footerAccordion = 'true';
      heading.setAttribute('role', 'button');
      heading.setAttribute('tabindex', '0');
      heading.setAttribute('aria-expanded', col.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  function toggleFooterColumn(col) {
    if (!col || col.classList.contains('footer__brand')) return;

    col.classList.toggle('is-open');
    const heading = col.querySelector('.footer__heading');
    if (heading) {
      heading.setAttribute('aria-expanded', col.classList.contains('is-open') ? 'true' : 'false');
    }
  }

  function handleFooterToggle(e) {
    if (!isMobileFooter()) return;

    const heading = e.target.closest('.footer__heading');
    if (!heading) return;

    const col = heading.closest('.footer__col');
    if (!col) return;

    e.preventDefault();
    toggleFooterColumn(col);
  }

  function initFooterAccordion() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    footer.setAttribute('data-lenis-prevent', '');
    setupFooterColumns();

    if (footer.dataset.footerBound === 'true') return;
    footer.dataset.footerBound = 'true';

    footer.addEventListener('click', handleFooterToggle);
    footer.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      handleFooterToggle(e);
    });
  }

  function boot() {
    initFooterAccordion();
    initMobileSlideshows();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  MOBILE_MQ.addEventListener('change', () => {
    setupFooterColumns();
    initMobileSlideshows();
    if (!isMobileFooter()) {
      document.querySelectorAll('.footer__col.is-open').forEach((col) => col.classList.remove('is-open'));
    }
  });

  REDUCED_MOTION.addEventListener('change', initMobileSlideshows);
})();
