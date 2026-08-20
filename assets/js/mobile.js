/**
 * Brand Drive — mobile.js
 * Mobile footer accordion + controllable card slideshows (pause / prev / next).
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

  function revealSlideshowItems(root) {
    root.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
    });
  }

  function createControls() {
    const wrap = document.createElement('div');
    wrap.className = 'slideshow-controls';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Slideshow controls');
    wrap.innerHTML = [
      '<button type="button" class="slideshow-controls__btn" data-action="prev" aria-label="Previous">',
      '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>',
      '<button type="button" class="slideshow-controls__btn slideshow-controls__btn--toggle" data-action="toggle" aria-label="Pause slideshow" aria-pressed="false">',
      '<i class="fa-solid fa-pause" aria-hidden="true"></i></button>',
      '<button type="button" class="slideshow-controls__btn" data-action="next" aria-label="Next">',
      '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>',
    ].join('');
    return wrap;
  }

  function setToggleUi(btn, paused) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    btn.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    btn.innerHTML = paused
      ? '<i class="fa-solid fa-play" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
  }

  function buildSlideshow(container) {
    if (container.dataset.slideshowBound === 'true') {
      revealSlideshowItems(container);
      return;
    }

    const items = Array.from(container.children).filter(
      (el) => !el.classList.contains('mobile-slideshow__track')
        && !el.classList.contains('slideshow-controls')
    );
    if (items.length < 2) return;

    const track = document.createElement('div');
    track.className = 'mobile-slideshow__track';

    const group = document.createElement('div');
    group.className = 'mobile-slideshow__group';
    items.forEach((item) => group.appendChild(item));
    track.appendChild(group);
    container.appendChild(track);

    const controls = createControls();
    container.appendChild(controls);
    container.classList.add('is-ready', 'is-controllable');
    container.dataset.slideshowBound = 'true';
    revealSlideshowItems(container);

    let index = 0;
    let paused = false;
    let timer = null;
    const toggleBtn = controls.querySelector('[data-action="toggle"]');

    function cardStep() {
      const first = group.children[0];
      if (!first) return 0;
      const styles = window.getComputedStyle(group);
      const gap = parseFloat(styles.columnGap || styles.gap) || 14;
      return first.getBoundingClientRect().width + gap;
    }

    function goTo(nextIndex, userAction) {
      const count = group.children.length;
      if (!count) return;
      index = ((nextIndex % count) + count) % count;
      track.style.transform = `translate3d(${-index * cardStep()}px, 0, 0)`;
      if (userAction) {
        paused = true;
        container.classList.add('is-paused');
        setToggleUi(toggleBtn, true);
        stopAuto();
      }
    }

    function next(userAction) {
      goTo(index + 1, userAction);
    }

    function prev(userAction) {
      goTo(index - 1, userAction);
    }

    function stopAuto() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function startAuto() {
      stopAuto();
      if (paused || REDUCED_MOTION.matches) return;
      const seconds = container.classList.contains('process-track')
        || container.classList.contains('values-grid')
        || container.classList.contains('grid-3')
        ? 4500
        : 5000;
      timer = window.setInterval(() => next(false), seconds);
    }

    function toggle() {
      paused = !paused;
      container.classList.toggle('is-paused', paused);
      setToggleUi(toggleBtn, paused);
      if (paused) stopAuto();
      else startAuto();
    }

    controls.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action === 'prev') prev(true);
      if (action === 'next') next(true);
      if (action === 'toggle') toggle();
    });

    // swipe support
    let startX = 0;
    track.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) next(true);
      else prev(true);
    }, { passive: true });

    window.addEventListener('resize', () => {
      goTo(index, false);
    });

    goTo(0, false);
    startAuto();
    container._slideshow = { stopAuto, startAuto, goTo };
  }

  function destroySlideshow(container) {
    stopController(container);
    const track = container.querySelector('.mobile-slideshow__track');
    const controls = container.querySelector('.slideshow-controls');
    if (controls) controls.remove();

    if (track) {
      const group = track.querySelector('.mobile-slideshow__group');
      if (group) {
        Array.from(group.children).forEach((item) => container.appendChild(item));
      }
      track.remove();
    }

    container.classList.remove('is-ready', 'is-controllable', 'is-paused');
    delete container.dataset.slideshowBound;
  }

  function stopController(container) {
    if (container._slideshow) {
      container._slideshow.stopAuto();
      delete container._slideshow;
    }
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

  /* ── Feature bar (mobile marquee) controls ── */
  function initFeatureBarControls() {
    const bar = document.querySelector('.feature-bar');
    if (!bar) return;

    let controls = bar.querySelector('.slideshow-controls');
    if (!MOBILE_MQ.matches || REDUCED_MOTION.matches) {
      if (controls) controls.remove();
      bar.classList.remove('is-paused');
      return;
    }
    if (controls && controls.dataset.bound === 'true') return;

    if (!controls) {
      controls = createControls();
      bar.appendChild(controls);
    }
    controls.dataset.bound = 'true';

    const track = bar.querySelector('.feature-bar__track');
    const toggleBtn = controls.querySelector('[data-action="toggle"]');
    let paused = false;

    function freeze() {
      if (!track) return;
      const matrix = new DOMMatrix(getComputedStyle(track).transform);
      track.dataset.frozenX = String(matrix.m41 || 0);
      track.style.animation = 'none';
      track.style.transform = `translate3d(${matrix.m41}px, 0, 0)`;
    }

    function release() {
      if (!track) return;
      track.style.animation = '';
      track.style.transform = '';
      delete track.dataset.frozenX;
    }

    function nudge(dir) {
      if (!track) return;
      const step = Math.min(window.innerWidth * 0.72, 300);
      const current = parseFloat(track.dataset.frozenX || '0') || 0;
      const next = current + (dir * step);
      track.dataset.frozenX = String(next);
      track.style.transform = `translate3d(${next}px, 0, 0)`;
    }

    function setPaused(next) {
      if (next === paused) return;
      paused = next;
      bar.classList.toggle('is-paused', paused);
      setToggleUi(toggleBtn, paused);
      if (paused) freeze();
      else release();
    }

    controls.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action === 'toggle') {
        setPaused(!paused);
        return;
      }
      if (!paused) setPaused(true);
      nudge(action === 'next' ? -1 : 1);
    });
  }

  /* ── Trusted By marquee controls (mobile + desktop) ── */
  function initMarqueeControls() {
    const section = document.querySelector('.marquee-section');
    if (!section) return;

    let controls = section.querySelector('.slideshow-controls');
    if (REDUCED_MOTION.matches) {
      if (controls) controls.remove();
      section.classList.remove('is-paused');
      return;
    }

    if (!controls) {
      controls = createControls();
      const cta = section.querySelector('.marquee-section__cta');
      if (cta) section.insertBefore(controls, cta);
      else section.appendChild(controls);
    }

    if (controls.dataset.bound === 'true') return;
    controls.dataset.bound = 'true';

    const toggleBtn = controls.querySelector('[data-action="toggle"]');
    let paused = false;

    function tracks() {
      return Array.from(section.querySelectorAll('.marquee__track'));
    }

    function freezeTracks() {
      tracks().forEach((track) => {
        const matrix = new DOMMatrix(getComputedStyle(track).transform);
        track.dataset.frozenX = String(matrix.m41 || 0);
        track.style.animation = 'none';
        track.style.transform = `translate3d(${matrix.m41}px, 0, 0)`;
      });
    }

    function releaseTracks() {
      tracks().forEach((track) => {
        track.style.animation = '';
        track.style.transform = '';
        delete track.dataset.frozenX;
      });
    }

    function nudgeTracks(dir) {
      const step = MOBILE_MQ.matches ? 152 : 236;
      tracks().forEach((track) => {
        const current = parseFloat(track.dataset.frozenX || '0') || 0;
        const next = current + (dir * step);
        track.dataset.frozenX = String(next);
        track.style.transform = `translate3d(${next}px, 0, 0)`;
      });
    }

    function setPaused(next) {
      if (next === paused) return;
      paused = next;
      section.classList.toggle('is-paused', paused);
      setToggleUi(toggleBtn, paused);
      if (paused) freezeTracks();
      else releaseTracks();
    }

    controls.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action === 'toggle') {
        setPaused(!paused);
        return;
      }
      if (!paused) setPaused(true);
      nudgeTracks(action === 'next' ? -1 : 1);
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
    initFeatureBarControls();
    initMarqueeControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  MOBILE_MQ.addEventListener('change', () => {
    setupFooterColumns();
    initMobileSlideshows();
    initFeatureBarControls();
    initMarqueeControls();
    if (!isMobileFooter()) {
      document.querySelectorAll('.footer__col.is-open').forEach((col) => col.classList.remove('is-open'));
    }
  });

  REDUCED_MOTION.addEventListener('change', () => {
    initMobileSlideshows();
    initFeatureBarControls();
    initMarqueeControls();
  });
})();
