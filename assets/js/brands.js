/**
 * Brand Drive — brands.js
 * Dual-row marquee + clients logo grid (Brand-1.png … Brand-12.png)
 */
(function () {
  'use strict';

  const BRAND_COUNT = 12;
  const brandPath = (n) => `assets/images/brands/brand-${n}.png?v=2`;

  function createMarqueeItem(n, { hidden = false } = {}) {
    const item = document.createElement('div');
    item.className = 'marquee__item';
    const img = document.createElement('img');
    img.src = brandPath(n);
    img.alt = hidden ? '' : `Partner brand ${n}`;
    img.width = 220;
    img.height = 110;
    img.loading = 'eager';
    img.decoding = 'async';
    if (hidden) img.setAttribute('aria-hidden', 'true');
    item.appendChild(img);
    return item;
  }

  function fillTrack(track, order, { hidden = false } = {}) {
    track.innerHTML = '';
    order.forEach((n) => track.appendChild(createMarqueeItem(n, { hidden })));
  }

  function duplicateTrack(track) {
    const items = Array.from(track.children);
    items.forEach((item) => track.appendChild(item.cloneNode(true)));
  }

  function initMarquees() {
    const row1 = document.querySelector('[data-brands-row="1"]');
    const row2 = document.querySelector('[data-brands-row="2"]');
    if (!row1 || !row2) return;

    const row1Brands = [1, 2, 3, 4, 5, 6];
    const row2Brands = [7, 8, 9, 10, 11, 12];

    const track1 = row1.querySelector('.marquee__track');
    const track2 = row2.querySelector('.marquee__track');
    if (!track1 || !track2) return;

    fillTrack(track1, row1Brands);
    fillTrack(track2, row2Brands);

    duplicateTrack(track1);
    duplicateTrack(track2);

    document.querySelectorAll('.marquee-section .marquee').forEach((marquee) => {
      const track = marquee.querySelector('.marquee__track');
      if (!track) return;
      const speed = parseFloat(marquee.dataset.speed) || 40;
      track.style.animationDuration = speed + 's';
    });
  }

  function createGridLogo(n) {
    const img = document.createElement('img');
    img.src = brandPath(n);
    img.alt = `Partner brand ${n}`;
    img.className = 'logo-grid__logo';
    img.loading = 'lazy';
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

  document.addEventListener('DOMContentLoaded', () => {
    initMarquees();
    buildLogoGrid();
  });
})();
