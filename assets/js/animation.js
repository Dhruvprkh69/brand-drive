/**
 * Brand Drive — animation.js
 * GSAP + ScrollTrigger animations
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STAGGER_SELECTORS = '.industry-card, .solution-card, .why-item, .value-card, .process-step';

  function markVisible(el) {
    el.classList.add('is-visible');
    el.style.opacity = '';
    el.style.transform = '';
  }

  function initAnimations() {
    if (prefersReducedMotion || typeof gsap === 'undefined') {
      document.querySelectorAll('.reveal').forEach(markVisible);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ limitCallbacks: true });

    /* Hero — home page only */
    if (document.querySelector('.hero__title')) {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.hero__tag', { opacity: 0, y: 20, duration: 0.6 })
        .from('.hero__title', { opacity: 0, y: 32, duration: 0.8 }, '-=0.3')
        .from('.hero__text', { opacity: 0, y: 24, duration: 0.7 }, '-=0.5')
        .from('.hero__actions', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4');
    }

    /* Reveal — skip grid/card items (handled by stagger) */
    gsap.utils.toArray('.reveal').forEach((el) => {
      if (el.closest('.mobile-slideshow, .grid-3, .why-grid, .process-track, .values-grid') || el.matches(STAGGER_SELECTORS)) {
        markVisible(el);
        return;
      }
      if (el.closest('.contact-form-col, #metrics, .stats-row, .contact-map') || el.classList.contains('contact-form-col')) {
        markVisible(el);
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
          onComplete: () => markVisible(el),
        }
      );
    });

    /* Stagger groups — single animation per grid */
    document.querySelectorAll('.grid-3, .why-grid, .process-track, .values-grid').forEach((grid) => {
      if (grid.classList.contains('mobile-slideshow') && window.matchMedia('(max-width: 768px)').matches) {
        grid.querySelectorAll('.reveal, ' + STAGGER_SELECTORS).forEach(markVisible);
        return;
      }
      const items = grid.querySelectorAll(STAGGER_SELECTORS);
      if (!items.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 88%',
            once: true,
          },
          onComplete: () => items.forEach(markVisible),
        }
      );
    });

    /* Subtle parallax — reduced movement */
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      gsap.to(el, {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    /* Counters — IntersectionObserver so they don't get stuck at 0 */
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';

      function finish() {
        el.textContent = target + suffix;
        el.dataset.counted = 'true';
      }

      function run() {
        if (el.dataset.counted === 'true') return;
        el.dataset.counted = 'true';

        if (prefersReducedMotion || typeof gsap === 'undefined') {
          finish();
          return;
        }

        gsap.fromTo(
          el,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.6,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate() {
              el.textContent = Math.round(Number(el.textContent) || 0) + suffix;
            },
            onComplete: finish,
          }
        );
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

      io.observe(el.closest('.stat') || el);
      setTimeout(() => {
        if (el.dataset.counted !== 'true') finish();
      }, 3500);
    });

    /* Page hero */
    const pageHeroTitle = document.querySelector('.page-hero__title');
    if (pageHeroTitle) {
      gsap.from(pageHeroTitle, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });
    }

    /* Solution page sections */
    gsap.utils.toArray('.solution-section').forEach((section) => {
      const visual = section.querySelector('.solution-section__visual');
      const content = section.querySelector('.solution-section__content');
      if (!visual || !content) return;

      gsap.fromTo(
        [visual, content],
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        }
      );
    });

    /* Cursor glow */
    const glow = document.getElementById('cursor-glow');
    if (glow && !window.matchMedia('(pointer: coarse)').matches) {
      document.body.classList.add('has-cursor');
      let mx = 0, my = 0, cx = 0, cy = 0;
      document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
      function moveGlow() {
        cx += (mx - cx) * 0.1;
        cy += (my - cy) * 0.1;
        glow.style.left = cx + 'px';
        glow.style.top = cy + 'px';
        requestAnimationFrame(moveGlow);
      }
      moveGlow();
    }

    window.addEventListener('load', () => ScrollTrigger.refresh());
    window.addEventListener('resize', () => ScrollTrigger.refresh());
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.initLenis?.();
    initAnimations();
  });
})();
