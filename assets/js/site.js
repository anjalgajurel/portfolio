/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — Apple-inspired Interactions
   GSAP 3.12 + ScrollTrigger
   Staggered reveals, frosted header, smooth scroll, 
   SVG progress back-to-top, mobile nav, contact form
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Apple easing ── */
  const EASE = 'power3.out';
  const STAGGER_DELAY = 0.12;
  const REVEAL_DURATION = 0.7;
  const REVEAL_Y = 28;

  /* ── Boot ── */
  function init() {
    if (typeof gsap === 'undefined') {
      // Fallback: make everything visible if GSAP fails to load
      document.querySelectorAll('.stagger-item').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Dismiss preloader then reveal hero
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('done');
        revealHeroItems();
      }, 400);
    } else {
      revealHeroItems();
    }

    initScrollReveals();
    initStickyHeader();
    initMobileNav();
    initSmoothScroll();
    initProgressCircle();
    initContactForm();
    initActiveNav();
    initParallax();
    initAnimLines();
  }

  // Run on load (GSAP defer scripts will have executed by then)
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }


  /* ═══ HERO STAGGER REVEAL ═══ */
  function revealHeroItems() {
    const heroItems = document.querySelectorAll('.hero .stagger-item');
    heroItems.forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: REVEAL_DURATION,
        delay: i * STAGGER_DELAY + 0.2,
        ease: EASE,
        onStart: () => el.classList.add('revealed'),
      });
    });
  }

  /* ═══ SCROLL-TRIGGERED STAGGER REVEALS ═══ */
  function initScrollReveals() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      const items = section.querySelectorAll('.stagger-item');
      if (!items.length) return;

      ScrollTrigger.batch(items, {
        start: 'top 88%',
        onEnter: batch => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: REVEAL_DURATION,
            stagger: STAGGER_DELAY,
            ease: EASE,
            onComplete: () => batch.forEach(el => el.classList.add('revealed')),
          });
        },
        once: true,
      });
    });
  }

  /* ═══ DIRECTION-AWARE STICKY HEADER ═══ */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const HEADER_THRESHOLD = 100;

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: self => {
        const y = self.scroll();
        if (y > HEADER_THRESHOLD) {
          header.classList.toggle('hidden', self.direction === 1);
        } else {
          header.classList.remove('hidden');
        }
      },
    });
  }

  /* ═══ MOBILE NAV ═══ */
  function initMobileNav() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileClose = document.getElementById('mobile-close');
    if (!menuToggle || !mobileNav) return;

    function openMobileNav() {
      mobileNav.classList.add('active');
      mobileNav.setAttribute('aria-hidden', 'false');
      mobileOverlay.classList.add('active');
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
      mobileNav.classList.remove('active');
      mobileNav.setAttribute('aria-hidden', 'true');
      mobileOverlay.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openMobileNav);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

    document.querySelectorAll('.mobile-nav-list a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMobileNav();
      }
    });
  }

  /* ═══ SMOOTH SCROLL ═══ */
  function initSmoothScroll() {
    const header = document.querySelector('.site-header');
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = header ? header.offsetHeight + 24 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ═══ SVG PROGRESS BACK-TO-TOP ═══ */
  function initProgressCircle() {
    const progressWrap = document.querySelector('.progress-wrap');
    const progressPath = document.querySelector('.progress-path');
    if (!progressWrap || !progressPath) return;

    const pathLength = progressPath.getTotalLength();
    progressPath.style.strokeDasharray = pathLength;
    progressPath.style.strokeDashoffset = pathLength;

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: self => {
        const draw = pathLength * self.progress;
        progressPath.style.strokeDashoffset = pathLength - draw;
        progressWrap.classList.toggle('visible', self.scroll() > 300);
      },
    });

    progressWrap.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══ CONTACT FORM ═══ */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          btn.textContent = 'Sent!';
          form.reset();
          setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 3000);
        } else {
          throw new Error('fail');
        }
      } catch {
        btn.textContent = 'Error — Try Again';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = originalText; }, 3000);
      }
    });
  }

  /* ═══ ACTIVE NAV HIGHLIGHT ═══ */
  function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-list a');
    const sectionIds = Array.from(navLinks).map(a => a.getAttribute('href'));

    sectionIds.forEach(id => {
      const target = document.querySelector(id);
      if (!target) return;

      ScrollTrigger.create({
        trigger: target,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      });
    });

    function setActive(id) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    }
  }

  /* ═══ PARALLAX BACKGROUND ═══ */
  function initParallax() {
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    parallaxBgs.forEach(bg => {
      gsap.to(bg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: bg.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  }

  /* ═══ ANIMATED LINE REVEALS ═══ */
  function initAnimLines() {
    const lines = document.querySelectorAll('.anim-line');
    lines.forEach(line => {
      gsap.to(line, {
        width: '100%',
        maxWidth: '180px',
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 90%',
          once: true,
        },
      });
    });
  }

})();