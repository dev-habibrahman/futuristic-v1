/* Nebulix — interactions */
(function () {
  'use strict';

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('navMenu');
  const links = document.querySelector('.nav__links');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Card hover spotlight ---------- */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.section__head, .card, .metric, .split__copy, .console, .cta__inner'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = Math.min(i * 60, 240);
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => io.observe(el));

  /* ---------- Animated metrics ---------- */
  const metricEls = document.querySelectorAll('.metric b[data-count]');
  const animateNumber = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isFloat = target % 1 !== 0;
    const duration = 1400;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = (isFloat ? value.toFixed(2) : Math.round(value)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const metricIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        metricIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  metricEls.forEach(el => metricIO.observe(el));

  /* ---------- Starfield ---------- */
  const canvas = document.getElementById('starfield');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w, h, dpr;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 * dpr + 0.3 * dpr,
        a: Math.random() * 0.6 + 0.2,
        s: Math.random() * 0.015 + 0.004
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const star of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * star.s * 60 + star.x);
        ctx.globalAlpha = star.a * twinkle;
        ctx.fillStyle = '#cfd9ff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      t += 0.016;
      requestAnimationFrame(draw);
    };
    draw();
  }
})();
