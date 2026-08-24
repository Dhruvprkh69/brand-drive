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

  const runningLoops = new WeakMap();

  function stopJsLoop(container) {
    const handle = runningLoops.get(container);
    if (handle) {
      cancelAnimationFrame(handle.raf);
      runningLoops.delete(container);
    }
  }

  function groupWidth(group) {
    return group ? Math.round(group.offsetWidth) : 0;
  }

  /**
   * iOS Safari unpaints overflow/transform layers when scrollLeft or
   * translateX wraps. Move the leading group to the end instead (tape loop).
   */
  function startJsLoop(container) {
    stopJsLoop(container);
    const track = container.querySelector('.mobile-slideshow__track');
    if (!track || track.children.length < 2) return;

    container.scrollLeft = 0;
    track.classList.add('is-js-driven');
    track.style.cssText += 'animation:none;-webkit-animation:none;transform:none;-webkit-transform:none;margin-left:0;';

    const durationSec = parseFloat(track.style.getPropertyValue('--slideshow-duration'))
      || parseFloat(getComputedStyle(track).getPropertyValue('--slideshow-duration'))
      || 36;

    let offset = 0;
    let last = 0;
    const state = { raf: 0 };

    function applyOffset() {
      track.style.marginLeft = -offset + 'px';
    }

    function tick(now) {
      if (!last) last = now;
      const dt = Math.min(now - last, 40);
      last = now;

      if (!container.classList.contains('is-hold-paused') && !document.hidden) {
        const first = track.firstElementChild;
        const w = groupWidth(first);
        if (w > 1) {
          offset += (w / (durationSec * 1000)) * dt;
          while (track.children.length > 1 && offset >= groupWidth(track.firstElementChild)) {
            const node = track.firstElementChild;
            const nodeW = groupWidth(node);
            track.appendChild(node);
            offset -= nodeW;
          }
          applyOffset();
        }
      } else {
        last = now;
      }
      state.raf = requestAnimationFrame(tick);
    }

    applyOffset();
    state.raf = requestAnimationFrame(tick);
    runningLoops.set(container, state);
  }

  function syncFeatureBarLoop() {
    const track = document.querySelector('.feature-bar__track');
    if (!track) return;
    const group = track.querySelector('.feature-bar__group:not([aria-hidden="true"])')
      || track.querySelector('.feature-bar__group');
    if (!group) return;
    requestAnimationFrame(() => {
      const width = group.getBoundingClientRect().width;
      if (width > 0) track.style.setProperty('--loop-distance', width + 'px');
    });
  }

  function syncAllMobileLoops() {
    document.querySelectorAll('.mobile-slideshow').forEach((el) => {
      if (shouldRunSlideshow()) startJsLoop(el);
    });
    syncFeatureBarLoop();
  }

  function revealSlideshowItems(root) {
    root.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
      el.classList.add('is-visible');
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('transform', 'none', 'important');
    });
  }

  function buildSlideshow(container) {
    if (container.querySelector('.mobile-slideshow__track')) {
      revealSlideshowItems(container);
      startJsLoop(container);
      return;
    }

    const items = Array.from(container.children).filter((el) => !el.classList.contains('mobile-slideshow__track'));
    if (items.length < 2) return;

    const track = document.createElement('div');
    track.className = 'mobile-slideshow__track is-js-driven';

    const group1 = document.createElement('div');
    group1.className = 'mobile-slideshow__group';

    items.forEach((item) => group1.appendChild(item));
    track.appendChild(group1);

    // Two clones so iOS always has cards on-screen when the loop wraps
    for (let i = 0; i < 2; i++) {
      const clone = document.createElement('div');
      clone.className = 'mobile-slideshow__group';
      clone.setAttribute('aria-hidden', 'true');
      items.forEach((item) => clone.appendChild(item.cloneNode(true)));
      track.appendChild(clone);
    }

    container.appendChild(track);
    container.classList.add('is-ready');
    revealSlideshowItems(container);

    const secondsPerCard = container.classList.contains('process-track')
      || container.classList.contains('grid-3')
      || container.classList.contains('values-grid')
      ? 5
      : 6;
    track.style.setProperty('--slideshow-duration', `${Math.max(items.length * secondsPerCard, 20)}s`);
    startJsLoop(container);
  }

  function destroySlideshow(container) {
    stopJsLoop(container);
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
    container.classList.remove('is-ready');
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
    initHoldToPause();
    syncFeatureBarLoop();
  }

  /**
   * Press-and-hold to pause auto-scroll (mobile only).
   * Touch down → pause at current frame; lift → resume (no restart).
   */
  function initHoldToPause() {
    const targets = document.querySelectorAll(
      '.marquee-section, .mobile-slideshow'
    );

    targets.forEach((el) => {
      if (el.dataset.holdPauseBound === 'true') return;
      el.dataset.holdPauseBound = 'true';

      const pause = () => {
        if (!MOBILE_MQ.matches || REDUCED_MOTION.matches) return;
        el.classList.add('is-hold-paused');
      };

      const resume = () => {
        el.classList.remove('is-hold-paused');
      };

      el.addEventListener('touchstart', pause, { passive: true });
      el.addEventListener('touchend', resume, { passive: true });
      el.addEventListener('touchcancel', resume, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  MOBILE_MQ.addEventListener('change', () => {
    setupFooterColumns();
    initMobileSlideshows();
    initHoldToPause();
    syncFeatureBarLoop();
    if (!MOBILE_MQ.matches) {
      document.querySelectorAll('.is-hold-paused').forEach((el) => el.classList.remove('is-hold-paused'));
    }
    if (!isMobileFooter()) {
      document.querySelectorAll('.footer__col.is-open').forEach((col) => col.classList.remove('is-open'));
    }
  });

  REDUCED_MOTION.addEventListener('change', () => {
    initMobileSlideshows();
    syncFeatureBarLoop();
    document.querySelectorAll('.is-hold-paused').forEach((el) => el.classList.remove('is-hold-paused'));
  });

  window.addEventListener('load', () => {
    if (shouldRunSlideshow()) {
      document.querySelectorAll('.mobile-slideshow').forEach((el) => {
        if (el.querySelector('.mobile-slideshow__track') && !runningLoops.get(el)) {
          startJsLoop(el);
        }
      });
    }
    syncFeatureBarLoop();
  });
})();
