/**
 * Brand Drive — brands.js
 * Dual-row marquee (desktop) + static logo grid (mobile) + clients grid
 */
(function () {
  'use strict';

  const BRAND_COUNT = 12;
  const brandPath = (n) => `assets/images/brands/brand-${n}.png`;

  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

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
      if (img) img.alt = '';
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

  function initMarquees() {
    const row1 = document.querySelector('[data-brands-row="1"]');
    const row2 = document.querySelector('[data-brands-row="2"]');
    if (!row1 || !row2) return;

    const track1 = row1.querySelector('.marquee__track');
    const track2 = row2.querySelector('.marquee__track');
    if (!track1 || !track2) return;

    if (!track1.children.length) fillTrack(track1, [1, 2, 3, 4, 5, 6]);
    if (!track2.children.length) fillTrack(track2, [7, 8, 9, 10, 11, 12]);

    const shouldAnimate = !isMobile() && !prefersReducedMotion();

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
    const ready = imgs.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });

    Promise.all(ready).then(() => {
      if (shouldAnimate) setMarqueeMotion(true);
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

  document.addEventListener('DOMContentLoaded', init);
  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(initMarquees, 200);
  });
})();
