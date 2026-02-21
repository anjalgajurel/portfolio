/* ═══════════════════════════════════════════════════════════
   UCHI-INSPIRED PORTFOLIO — Interactions & Animations
   GSAP 3 + ScrollTrigger, vanilla JS (no jQuery)
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });

  // ─── PRELOADER ───
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('done'), 300);
    });
    // Fallback: hide after 4s max
    setTimeout(() => preloader.classList.add('done'), 4000);
  }

  // Mark body as animation-ready (enables gingko display)
  document.body.classList.add('animation-ready');

  const easing = 'cubic-bezier(0.355, 0.820, 0.335, 1)';

  // ─── STICKY HEADER (direction-aware) ───
  const header = document.querySelector('.global-header');
  if (header) {
    ScrollTrigger.create({
      start: 'top -50',
      end: 99999,
      toggleClass: { className: 'sticky', targets: '.global-header' },
      onUpdate: (self) => {
        if (self.direction > 0) {
          header.classList.add('go-away');
        } else {
          header.classList.remove('go-away');
        }
      }
    });

    // Dynamic content padding
    const content = document.getElementById('content');
    if (content) {
      const setPadding = () => {
        content.style.paddingTop = header.offsetHeight + 'px';
      };
      setPadding();
      window.addEventListener('resize', setPadding);
    }
  }

  // ─── SIDE NAV ───
  const slideNav = document.getElementById('slide-nav');
  const overlay = document.querySelector('.side-nav-overlay');
  const hamburger = document.getElementById('hamburger');
  const closeBtn = document.querySelector('.close-nav-btn');

  function openNav() {
    if (!slideNav) return;
    gsap.to(slideNav, { xPercent: -100, duration: 0.8, ease: 'power3.inOut' });
    gsap.to(overlay, { opacity: 0.7, duration: 0.8, ease: 'power3.inOut' });
    slideNav.classList.add('open');
    slideNav.setAttribute('aria-hidden', 'false');
    overlay.style.display = 'block';
    overlay.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Close on Escape
    document.addEventListener('keydown', onEscape);
  }

  function closeNav() {
    if (!slideNav) return;
    gsap.to(slideNav, { xPercent: 0, duration: 0.8, ease: 'power3.inOut' });
    gsap.to(overlay, { opacity: 0, duration: 0.8, ease: 'power3.inOut' });
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onEscape);

    setTimeout(() => {
      slideNav.classList.remove('open');
      slideNav.setAttribute('aria-hidden', 'true');
      overlay.style.display = 'none';
      overlay.classList.remove('open');
    }, 800);
  }

  function onEscape(e) {
    if (e.key === 'Escape') closeNav();
  }

  hamburger?.addEventListener('click', openNav);
  closeBtn?.addEventListener('click', closeNav);
  overlay?.addEventListener('click', closeNav);

  // Close nav on link click
  document.querySelectorAll('.side-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  // ─── SMOOTH SCROLL FOR NAV LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.offsetTop - headerHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── GSAP SCROLL ANIMATIONS ───

  // .aos — fade up + opacity
  gsap.utils.toArray('.aos').forEach(block => {
    gsap.from(block, {
      y: 24,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: block,
        start: 'top bottom-=150',
        once: true,
        toggleClass: 'animated'
      }
    });
    gsap.fromTo(block,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: block,
          start: 'top bottom-=150',
          once: true
        }
      }
    );
  });

  // .scale-on-scroll img — scrub zoom
  gsap.utils.toArray('.scale-on-scroll img').forEach(img => {
    gsap.from(img, {
      scale: 1.15,
      ease: 'none',
      scrollTrigger: { trigger: img, scrub: true }
    });
  });

  // .parallax — yPercent drift
  gsap.utils.toArray('.parallax').forEach(block => {
    const yP = block.dataset.ypercent || '+15';
    gsap.to(block, {
      yPercent: parseFloat(yP),
      ease: 'none',
      scrollTrigger: { trigger: block, scrub: true }
    });
  });

  // .anim-lines — text line reveal (manual split)
  const waitForFonts = setInterval(() => {
    if (document.fonts.status === 'loaded') {
      clearInterval(waitForFonts);

      gsap.utils.toArray('.anim-lines').forEach(el => {
        // Wrap each line using a simple split approach
        const text = el.innerHTML;
        const words = text.split(/\s+/);
        el.innerHTML = '';

        // Create a temp span to measure
        const wrapper = document.createElement('span');
        wrapper.style.visibility = 'hidden';
        wrapper.style.position = 'absolute';
        wrapper.style.whiteSpace = 'nowrap';
        wrapper.style.font = getComputedStyle(el).font;
        document.body.appendChild(wrapper);

        // Just animate the whole element as one unit for simplicity
        document.body.removeChild(wrapper);
        el.innerHTML = text;

        gsap.from(el, {
          opacity: 0,
          yPercent: 30,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=100',
            once: true,
            toggleClass: 'animated'
          }
        });
      });
    }
  }, 200);

  // ─── GINGKO LEAF ANIMATIONS ───
  gsap.utils.toArray('.gingko').forEach(gingko => {
    let scale = 1.2, rotate = 100, dur = 1.5;

    if (gingko.classList.contains('gingko-2')) { scale = 0.9; rotate = 100; dur = 2 }
    if (gingko.classList.contains('gingko-3')) { scale = 0.8; rotate = 80; dur = 3 }

    // Entry: fall from above
    gsap.from(gingko, {
      y: -(gingko.offsetTop + gingko.offsetHeight + 200),
      scale,
      rotate,
      ease: 'power2.out',
      duration: dur
    });

    // Parallax: float downward on scroll
    const yP = gingko.dataset.ypercent || gsap.utils.random(100, 150, 10);
    gsap.to(gingko, {
      yPercent: yP,
      ease: 'none',
      scrollTrigger: {
        trigger: '.uchi-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  });

  // ─── KANJI HOVER ───
  const kanjiEl = document.querySelector('.hero-kanji');
  if (kanjiEl) {
    kanjiEl.addEventListener('mouseenter', () => {
      kanjiEl.querySelector('.kanji').style.opacity = '0';
      kanjiEl.querySelector('.kanji-translation').style.opacity = '1';
    });
    kanjiEl.addEventListener('mouseleave', () => {
      kanjiEl.querySelector('.kanji').style.opacity = '1';
      kanjiEl.querySelector('.kanji-translation').style.opacity = '0';
    });
  }

  // ─── SVG PROGRESS BACK TO TOP ───
  const progressWrap = document.querySelector('.progress-wrap');
  const progressPath = document.querySelector('.progress-path');

  if (progressWrap && progressPath) {
    const pathLength = progressPath.getTotalLength();
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;

    const updateProgress = () => {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height <= 0) return;
      const progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = progress;
    };

    window.addEventListener('scroll', () => {
      updateProgress();
      if (window.scrollY > 200) {
        progressWrap.classList.add('active-progress');
      } else {
        progressWrap.classList.remove('active-progress');
      }
    });

    updateProgress();

    progressWrap.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── CONTACT FORM ───
  const form = document.querySelector('.contact-form');
  if (form) {
    // Material label: use placeholder trick (CSS handles via :placeholder-shown)
    form.querySelectorAll('input, textarea').forEach(input => {
      // Set empty placeholder for CSS :placeholder-shown to work
      if (!input.placeholder) input.placeholder = ' ';

      input.addEventListener('focus', () => input.parentElement.classList.add('filled'));
      input.addEventListener('blur', () => {
        if (!input.value) input.parentElement.classList.remove('filled');
      });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const originalText = btn.textContent;
      btn.textContent = 'sending...';
      btn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          btn.textContent = 'sent — thank you!';
          form.reset();
          setTimeout(() => { btn.textContent = originalText; btn.disabled = false }, 3000);
        } else {
          btn.textContent = 'error — try again';
          btn.disabled = false;
          setTimeout(() => { btn.textContent = originalText }, 3000);
        }
      } catch {
        btn.textContent = 'error — try again';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = originalText }, 3000);
      }
    });
  }
});
