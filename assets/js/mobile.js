/**
 * Brand Drive — mobile.js
 * Mobile-only UX: footer accordion + iOS-safe card carousels.
 *
 * iOS Safari blanks continuous translate / scrollLeft / marginLeft marquees
 * after one loop. Mobile slideshows use one-card-at-a-time fades — no
 * horizontal scroll animation, no clones, no transform loops.
 */
(function () {
  'use strict';

  const MOBILE_MQ = window.matchMedia('(max-width: 768px)');
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
  const carousels = new WeakMap();

  function isMobileFooter() {
    return MOBILE_MQ.matches;
  }

  function shouldRunSlideshow() {
    return MOBILE_MQ.matches && !REDUCED_MOTION.matches;
  }

  function stopCarousel(container) {
    const state = carousels.get(container);
    if (!state) return;
    if (state.timer) window.clearInterval(state.timer);
    if (state.io) state.io.disconnect();
    if (state.onTouchStart) {
      container.removeEventListener('touchstart', state.onTouchStart);
      container.removeEventListener('touchend', state.onTouchEnd);
      container.removeEventListener('touchcancel', state.onTouchEnd);
    }
    carousels.delete(container);
  }

  function forceVisible(root) {
    root.querySelectorAll('.reveal, .process-step, .solution-card, .why-item, .value-card').forEach((el) => {
      el.classList.add('is-visible');
      // Clear GSAP/reveal inline opacity so CSS can hide inactive slides
      el.style.removeProperty('opacity');
      el.style.removeProperty('visibility');
      el.style.setProperty('transform', 'none', 'important');
    });
  }

  function getCards(container) {
    const track = container.querySelector('.mobile-slideshow__track');
    if (!track) return [];
    return Array.from(track.children).filter((el) => !el.classList.contains('mobile-slideshow__dots'));
  }

  function showCard(container, index) {
    const cards = getCards(container);
    if (!cards.length) return 0;
    const i = ((index % cards.length) + cards.length) % cards.length;

    cards.forEach((card, n) => {
      const active = n === i;
      card.classList.toggle('is-slide-active', active);
      card.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    const dots = container.querySelectorAll('.mobile-slideshow__dot');
    dots.forEach((dot, n) => {
      dot.classList.toggle('is-active', n === i);
      dot.setAttribute('aria-current', n === i ? 'true' : 'false');
    });

    forceVisible(container);
    return i;
  }

  function ensureDots(container, count) {
    let dots = container.querySelector('.mobile-slideshow__dots');
    if (!dots) {
      dots = document.createElement('div');
      dots.className = 'mobile-slideshow__dots';
      dots.setAttribute('aria-hidden', 'true');
      container.appendChild(dots);
    }
    dots.innerHTML = '';
    for (let n = 0; n < count; n += 1) {
      const dot = document.createElement('span');
      dot.className = 'mobile-slideshow__dot' + (n === 0 ? ' is-active' : '');
      dots.appendChild(dot);
    }
  }

  /**
   * iOS-safe: fade between cards. Never scrolls or translates the track.
   */
  function startCarousel(container) {
    stopCarousel(container);
    forceVisible(container);

    const track = container.querySelector('.mobile-slideshow__track');
    if (!track) return;

    track.classList.add('is-js-driven');
    track.style.marginLeft = '';
    track.style.transform = '';
    track.style.webkitTransform = '';
    track.style.animation = 'none';
    container.scrollLeft = 0;

    const cards = getCards(container);
    if (cards.length < 2) return;

    ensureDots(container, cards.length);

    const secondsPerCard = container.classList.contains('process-track')
      || container.classList.contains('grid-3')
      || container.classList.contains('values-grid')
      ? 4
      : 5;

    let index = showCard(container, 0);
    let inView = true;
    let touchX = 0;
    let touchY = 0;

    const state = {
      timer: null,
      io: null,
      onTouchStart: null,
      onTouchEnd: null,
      tick() {
        if (!inView || document.hidden || container.classList.contains('is-hold-paused')) return;
        index = showCard(container, index + 1);
      },
    };

    state.timer = window.setInterval(state.tick, secondsPerCard * 1000);

    state.onTouchStart = (e) => {
      if (!e.touches || !e.touches[0]) return;
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    };

    state.onTouchEnd = (e) => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      index = showCard(container, index + (dx < 0 ? 1 : -1));
      if (state.timer) {
        window.clearInterval(state.timer);
        state.timer = window.setInterval(state.tick, secondsPerCard * 1000);
      }
    };

    container.addEventListener('touchstart', state.onTouchStart, { passive: true });
    container.addEventListener('touchend', state.onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', state.onTouchEnd, { passive: true });

    if (typeof IntersectionObserver !== 'undefined') {
      state.io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
          if (entry.isIntersecting) {
            index = showCard(container, index);
          }
        });
      }, { threshold: 0.15 });
      state.io.observe(container);
    }

    carousels.set(container, state);
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

  function buildSlideshow(container) {
    // Flatten any previous track/group markup into original cards
    const existing = container.querySelector('.mobile-slideshow__track');
    if (existing) {
      const originals = existing.querySelector('.mobile-slideshow__group:not([aria-hidden="true"])')
        || existing.querySelector('.mobile-slideshow__group');
      if (originals) {
        Array.from(originals.children).forEach((item) => container.appendChild(item));
      } else {
        Array.from(existing.children).forEach((item) => {
          if (!item.classList.contains('mobile-slideshow__dots')) {
            container.appendChild(item);
          }
        });
      }
      existing.remove();
      stopCarousel(container);
    }

    const oldDots = container.querySelector('.mobile-slideshow__dots');
    if (oldDots) oldDots.remove();

    const items = Array.from(container.children).filter(
      (el) => !el.classList.contains('mobile-slideshow__track')
        && !el.classList.contains('mobile-slideshow__dots')
    );
    if (items.length < 2) return;

    const track = document.createElement('div');
    track.className = 'mobile-slideshow__track is-js-driven';
    items.forEach((item) => {
      item.classList.remove('is-slide-active');
      track.appendChild(item);
    });
    container.appendChild(track);
    container.classList.add('is-ready');
    forceVisible(container);
    startCarousel(container);
  }

  function destroySlideshow(container) {
    stopCarousel(container);
    const dots = container.querySelector('.mobile-slideshow__dots');
    if (dots) dots.remove();

    const track = container.querySelector('.mobile-slideshow__track');
    if (!track) return;

    const group = track.querySelector('.mobile-slideshow__group:not([aria-hidden="true"])')
      || track.querySelector('.mobile-slideshow__group');
    if (group) {
      Array.from(group.children).forEach((item) => {
        item.classList.remove('is-slide-active');
        item.removeAttribute('aria-hidden');
        container.appendChild(item);
      });
    } else {
      Array.from(track.children).forEach((item) => {
        item.classList.remove('is-slide-active');
        item.removeAttribute('aria-hidden');
        container.appendChild(item);
      });
    }
    track.remove();
    container.classList.remove('is-ready');
    container.scrollLeft = 0;
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

  function initHoldToPause() {
    document.querySelectorAll('.marquee-section, .mobile-slideshow').forEach((el) => {
      if (el.dataset.holdPauseBound === 'true') return;
      el.dataset.holdPauseBound = 'true';

      el.addEventListener('touchstart', () => {
        if (!MOBILE_MQ.matches || REDUCED_MOTION.matches) return;
        el.classList.add('is-hold-paused');
      }, { passive: true });

      el.addEventListener('touchend', () => {
        el.classList.remove('is-hold-paused');
      }, { passive: true });

      el.addEventListener('touchcancel', () => {
        el.classList.remove('is-hold-paused');
      }, { passive: true });
    });
  }

  function boot() {
    initFooterAccordion();
    initMobileSlideshows();
    initHoldToPause();
    syncFeatureBarLoop();
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
        forceVisible(el);
        if (el.querySelector('.mobile-slideshow__track') && !carousels.get(el)) {
          startCarousel(el);
        } else if (el.querySelector('.mobile-slideshow__track')) {
          const state = carousels.get(el);
          if (state) showCard(el, 0);
        }
      });
    }
    syncFeatureBarLoop();
  });
})();
