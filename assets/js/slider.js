/**
 * Brand Drive — slider.js
 * Swiper testimonials
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const el = document.querySelector('.testimonials-swiper');
    if (!el || typeof Swiper === 'undefined') return;

    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 32,
      loop: true,
      speed: 800,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: { slidesPerView: 1.2, centeredSlides: true },
        1024: { slidesPerView: 1.5, centeredSlides: true },
      },
    });
  });
})();
