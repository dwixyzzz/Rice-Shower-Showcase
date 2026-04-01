/* ============================================================
   RICE SHOWER — Character Portfolio JS
   All Interactivity · Animations · Effects
   ============================================================ */

'use strict';

/* ─── Entry Point ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initParticles();
  initNavbar();
  initSmoothScroll();
  initTypingEffect();
  initHeroParallax();
  initScrollReveal();
  initCardTilt();
  initStatsBars();
  initNightBloom();
  initMusic();
  initGalleryAmbience();
});


/* ─── 1. Cursor Glow ─────────────────────────────────────── */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let mx = -300, my = -300;
  let cx = -300, cy = -300;
  let raf;

  const lerp = (a, b, t) => a + (b - a) * t;

  function tick() {
    cx = lerp(cx, mx, 0.12);
    cy = lerp(cy, my, 0.12);
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    raf = requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mx = my = -300;
  });

  tick();

  // Scale up on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .g-item, .stat-card, .story-block, .tilt-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      glow.style.transform = 'translate(-50%, -50%) scale(1.5)';
      glow.style.opacity = '0.7';
    });
    el.addEventListener('mouseleave', () => {
      glow.style.transform = 'translate(-50%, -50%) scale(1)';
      glow.style.opacity = '1';
    });
  });
}


/* ─── 2. Floating Particle System ────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 80;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const NIGHT_COLORS = ['#ff00cc', '#00ffff', '#ff66ee', '#66ffff'];
  const NORM_COLORS  = ['#c77dff', '#9b59b6', '#e0aaff', '#6a0dad', '#ffffff'];

  function getColors() {
    return document.body.classList.contains('night-bloom') ? NIGHT_COLORS : NORM_COLORS;
  }

  function makeParticle() {
    const colors = getColors();
    return {
      x:     Math.random() * W,
      y:     H + 10,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:    -(0.25 + Math.random() * 0.55),
      size:  0.5 + Math.random() * 1.5,
      alpha: 0.15 + Math.random() * 0.5,
      life:  0,
      maxLife: 200 + Math.random() * 400,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.04,
    };
  }

  for (let i = 0; i < COUNT; i++) {
    const p = makeParticle();
    p.y = Math.random() * H;  // scatter initially
    p.life = Math.random() * p.maxLife;
    particles.push(p);
  }

  function drawParticle(p) {
    const progress = p.life / p.maxLife;
    const fadeIn  = Math.min(1, p.life / 60);
    const fadeOut = Math.min(1, (p.maxLife - p.life) / 60);
    const twinkle = 0.7 + 0.3 * Math.sin(p.twinkle);
    const a = p.alpha * Math.min(fadeIn, fadeOut) * twinkle;

    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx + Math.sin(p.life * 0.015) * 0.2;
      p.y += p.vy;
      p.life++;
      p.twinkle += p.twinkleSpeed;

      if (p.life >= p.maxLife || p.y < -10) {
        const colors = getColors();
        const fresh  = makeParticle();
        // refresh color on night bloom change
        fresh.color = colors[Math.floor(Math.random() * colors.length)];
        particles[i] = fresh;
      } else {
        drawParticle(p);
      }
    }

    requestAnimationFrame(frame);
  }

  frame();
}


/* ─── 3. Navbar ──────────────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu= document.getElementById('mobileMenu');
  if (!navbar) return;

  // Scroll behavior
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  // Hamburger
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
    });
  });

  // Active link highlight
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');
    const scrollY  = window.scrollY + 120;

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY && sec.offsetTop + sec.offsetHeight > scrollY) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        active?.classList.add('active');
      }
    });
  }
}


/* ─── 4. Smooth Scroll ───────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}


/* ─── 5. Typing Effect ───────────────────────────────────── */
function initTypingEffect() {
  const el = document.getElementById('typeText');
  if (!el) return;

  const phrases = [
    'Bringer of Misfortune...',
    'The Phantom of the Track...',
    'She Who Runs Against Fate...',
    'Silent. Determined. Unstoppable.',
    'The Dark Horse of the Classics...',
    'A Rain That Nourishes the Earth...',
    '"I race because I must."',
  ];

  let pIdx = 0, cIdx = 0, deleting = false;
  const PAUSE_BEFORE_DELETE = 2200;
  const PAUSE_BEFORE_TYPE   = 500;
  const TYPE_SPEED  = 48;
  const DELETE_SPEED = 28;

  function tick() {
    const phrase = phrases[pIdx];

    if (!deleting) {
      cIdx++;
      el.textContent = phrase.slice(0, cIdx);
      if (cIdx >= phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE_BEFORE_DELETE);
        return;
      }
      setTimeout(tick, TYPE_SPEED + Math.random() * 30);
    } else {
      cIdx--;
      el.textContent = phrase.slice(0, cIdx);
      if (cIdx <= 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE_TYPE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Start with a delay
  setTimeout(tick, 1400);
}


/* ─── 6. Hero Parallax ───────────────────────────────────── */
function initHeroParallax() {
  const bg      = document.getElementById('heroBg');
  const content = document.querySelector('.hero-content');
  const kanji   = document.getElementById('heroKanji');
  if (!bg) return;

  let lastY = 0;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    const maxH = window.innerHeight;
    const progress = Math.min(y / maxH, 1);

    // Subtle parallax on background
    bg.style.transform = `scale(1.08) translateY(${progress * 30}px)`;

    // Content drift
    if (content) {
      content.style.transform = `translateY(${progress * 60}px)`;
      content.style.opacity   = String(1 - progress * 1.4);
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}


/* ─── 7. Scroll Reveal (Intersection Observer) ───────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.animDelay || el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => io.observe(el));
}


/* ─── 8. Card 3D Tilt ────────────────────────────────────── */
function initCardTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  const MAX_TILT = 8; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * MAX_TILT;
      const rotY   =  dx * MAX_TILT;
      const glare  = Math.sqrt(dx * dx + dy * dy) * 0.06;

      card.style.transform =
        `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      card.style.boxShadow =
        `${-dx * 12}px ${-dy * 12}px 40px rgba(0,0,0,0.4), var(--glow-md)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });

    // Touch support (no tilt, just scale)
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(1.02)';
    }, { passive: true });
    card.addEventListener('touchend', () => {
      card.style.transform = '';
    });
  });
}


/* ─── 9. Stats Bar Animation ─────────────────────────────── */
function initStatsBars() {
  const fills = document.querySelectorAll('.stat-fill');
  const nums  = document.querySelectorAll('.stat-num');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const section = entry.target;

      section.querySelectorAll('.stat-fill').forEach(fill => {
        const val = parseInt(fill.dataset.val, 10);
        // Small delay for stagger
        const card  = fill.closest('.stat-card');
        const delay = parseInt(card?.dataset.animDelay || '0', 10);
        setTimeout(() => {
          fill.style.width = val + '%';
        }, delay + 300);
      });

      section.querySelectorAll('.stat-num').forEach(num => {
        const target = parseInt(num.dataset.target, 10);
        const card   = num.closest('.stat-card');
        const delay  = parseInt(card?.dataset.animDelay || '0', 10);
        animateCounter(num, 0, target, 1600, delay + 300);
      });

      io.unobserve(section);
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) io.observe(statsSection);
}

function animateCounter(el, from, to, duration, delay) {
  setTimeout(() => {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, delay);
}


/* ─── 10. Night Bloom Toggle ─────────────────────────────── */
function initNightBloom() {
  const btn = document.getElementById('nightBloomToggle');
  if (!btn) return;

  const STORAGE_KEY = 'rs-nightbloom';

  function setBloom(active) {
    document.body.classList.toggle('night-bloom', active);
    btn.classList.toggle('active', active);
    btn.title = active ? 'Night Bloom: ON — Click to disable' : 'Night Bloom Mode';
    try { localStorage.setItem(STORAGE_KEY, active ? '1' : '0'); } catch(_) {}

    // Flash effect on toggle
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed; inset:0; z-index:9998; pointer-events:none;
      background:${active ? 'rgba(255,0,204,0.06)' : 'rgba(199,125,255,0.04)'};
      transition:opacity 0.8s; opacity:1;
    `;
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 900);
    });
  }

  // Restore state
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') setBloom(true);
  } catch(_) {}

  btn.addEventListener('click', () => {
    setBloom(!document.body.classList.contains('night-bloom'));
  });
}


/* ─── 11. Music Toggle ───────────────────────────────────── */
function initMusic() {
  const btn  = document.getElementById('musicToggle');
  const bgm  = document.getElementById('bgm');
  if (!btn || !bgm) return;

  const iconOff = btn.querySelector('.music-off');
  const iconOn  = btn.querySelector('.music-on');
  let playing   = false;

  function setPlaying(active) {
    playing = active;
    iconOff.style.display = active ? 'none'  : '';
    iconOn.style.display  = active ? ''       : 'none';
    btn.title = active ? 'Pause BGM' : 'Play BGM';

    if (active) {
      bgm.volume = 0;
      bgm.play().then(() => fadeAudio(bgm, 0, 0.35, 2000)).catch(() => {
        // Autoplay blocked — silently fail
        setPlaying(false);
      });
    } else {
      fadeAudio(bgm, bgm.volume, 0, 800, () => bgm.pause());
    }
  }

  btn.addEventListener('click', () => setPlaying(!playing));
  // Autoplay saat halaman load
window.addEventListener('click', function startOnce() {
  setPlaying(true);
  window.removeEventListener('click', startOnce);
}, { once: true });
}

function fadeAudio(audio, from, to, duration, callback) {
  const step  = (to - from) / (duration / 16);
  let current = from;

  const id = setInterval(() => {
    current += step;
    const clamped = Math.max(0, Math.min(1, current));
    audio.volume = clamped;

    if ((step > 0 && clamped >= to) || (step < 0 && clamped <= to)) {
      clearInterval(id);
      callback?.();
    }
  }, 16);
}


/* ─── 12. Gallery Ambient Glow ───────────────────────────── */
function initGalleryAmbience() {
  // Each gallery item gets a subtle colour radial on hover
  const items = document.querySelectorAll('.g-item');

  items.forEach((item, i) => {
    const hues = [260, 280, 300, 250, 270, 290];
    const h = hues[i % hues.length];

    item.addEventListener('mouseenter', () => {
      item.style.setProperty('--gx', '50%');
      item.style.setProperty('--gy', '50%');
    });

    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      item.querySelector('.g-img')?.style.setProperty('--gx', x);
      item.querySelector('.g-img')?.style.setProperty('--gy', y);
    });
  });
}


/* ─── Utilities ──────────────────────────────────────────── */

// Debounce helper
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// Add cursor:none to all interactive elements
(function patchCursors() {
  document.querySelectorAll('a, button, .g-item, .nav-btn, .cta-primary, .cta-secondary').forEach(el => {
    el.style.cursor = 'none';
  });
})();