/**
 * Brand Drive — brands.js
 * Dual-row logo marquee (desktop + mobile) + clients grid
 */
(function () {
  'use strict';

  const BRAND_COUNT = 14;
  const brandPath = (n) => `assets/images/brands/brand-${n}.png`;
  const ROW1 = [1, 2, 3, 4, 5, 6, 7];
  const ROW2 = [8, 9, 10, 11, 12, 13, 14];

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function createMarqueeItem(n) {
    const item = document.createElement('div');
    item.className = 'marquee__item';
    const img = document.createElement('img');
    img.src = brandPath(n);
    img.alt = `Partner brand ${n}`;
    img.width = 220;
    img.height = 110;
    img.decoding = 'async';
    img.loading = 'eager';
    if (n <= 4) img.fetchPriority = 'high';
    item.appendChild(img);
    return item;
  }

  function fillTrack(track, order) {
    track.innerHTML = '';
    order.forEach((n) => track.appendChild(createMarqueeItem(n)));
  }

  function duplicateTrack(track) {
    if (track.dataset.cloned === 'true') return;
    const items = Array.from(track.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      const img = clone.querySelector('img');
      if (img) {
        img.alt = '';
        img.loading = 'eager';
      }
      track.appendChild(clone);
    });
    track.dataset.cloned = 'true';
  }

  function stripClones(track) {
    if (track.dataset.cloned !== 'true') return;
    const items = Array.from(track.children);
    items.slice(Math.floor(items.length / 2)).forEach((el) => el.remove());
    track.dataset.cloned = 'false';
  }

  function setMarqueeMotion(animated) {
    const section = document.querySelector('.marquee-section');
    if (!section) return;
    section.classList.toggle('is-animated', animated);
  }

  function waitForImages(imgs, timeoutMs) {
    return new Promise((resolve) => {
      let left = imgs.length;
      if (!left) {
        resolve();
        return;
      }
      const done = () => {
        left -= 1;
        if (left <= 0) resolve();
      };
      imgs.forEach((img) => {
        if (img.complete && img.naturalWidth > 0) done();
        else {
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
        }
      });
      setTimeout(resolve, timeoutMs);
    });
  }

  function initMarquees() {
    const row1 = document.querySelector('[data-brands-row="1"]');
    const row2 = document.querySelector('[data-brands-row="2"]');
    if (!row1 || !row2) return;

    const track1 = row1.querySelector('.marquee__track');
    const track2 = row2.querySelector('.marquee__track');
    if (!track1 || !track2) return;

    // Always rebuild rows so HTML + JS stay in sync (7 + 7)
    track1.dataset.cloned = 'false';
    track2.dataset.cloned = 'false';
    fillTrack(track1, ROW1);
    fillTrack(track2, ROW2);

    // Ensure inline HTML logos also load eagerly on first paint
    document.querySelectorAll('.marquee-section img').forEach((img, i) => {
      img.loading = 'eager';
      img.decoding = 'async';
      if (i < 4) img.fetchPriority = 'high';
    });

    const shouldAnimate = !prefersReducedMotion();

    if (shouldAnimate) {
      duplicateTrack(track1);
      duplicateTrack(track2);
    } else {
      stripClones(track1);
      stripClones(track2);
    }

    document.querySelectorAll('.marquee-section .marquee').forEach((marquee) => {
      const track = marquee.querySelector('.marquee__track');
      if (!track) return;
      track.style.animationDuration = (parseFloat(marquee.dataset.speed) || 40) + 's';
    });

    setMarqueeMotion(false);

    const imgs = Array.from(document.querySelectorAll('.marquee-section img'));
    const startMotion = () => {
      if (shouldAnimate) setMarqueeMotion(true);
    };

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    waitForImages(imgs, isMobile ? 4500 : 1200).then(() => {
      if (isMobile && document.body.classList.contains('is-loading')) {
        window.addEventListener('branddrive:ready', startMotion, { once: true });
        // safety if ready already fired
        setTimeout(() => {
          if (!document.body.classList.contains('is-loading')) startMotion();
        }, 5200);
      } else {
        startMotion();
      }
    });
  }

  function createGridLogo(n) {
    const img = document.createElement('img');
    img.src = brandPath(n);
    img.alt = `Partner brand ${n}`;
    img.className = 'logo-grid__logo';
    img.width = 220;
    img.height = 110;
    img.decoding = 'async';
    img.loading = 'lazy';
    return img;
  }

  function buildLogoGrid() {
    const grid = document.querySelector('.logo-grid[data-brands]');
    if (!grid) return;

    grid.innerHTML = '';
    for (let n = 1; n <= BRAND_COUNT; n++) {
      const item = document.createElement('div');
      item.className = 'logo-grid__item';
      item.appendChild(createGridLogo(n));
      grid.appendChild(item);
    }
  }

  function init() {
    initMarquees();
    buildLogoGrid();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(initMarquees, 200);
  });
})();
