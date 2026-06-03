/* ═══════════════════════════════════════════════
   KENNETH M. SANTOS — PORTFOLIO JS
   Particles · Typewriter · Scroll · Cursor
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Custom Cursor ──
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-group, .contact-item');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  // ── Particle Canvas ──
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.3 + 0.08;
      this.fadeDir = Math.random() > 0.5 ? 1 : -1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeDir * 0.002;
      if (this.opacity > 0.4 || this.opacity < 0.05) this.fadeDir *= -1;
      if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 60);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawConnections();
    animFrameId = requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ── Typewriter Effect ──
  const taglines = ['Full-Stack Developer', 'Cybersecurity Enthusiast', 'ML Engineer'];
  const taglineEl = document.getElementById('taglineText');
  let taglineIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typewrite() {
    const current = taglines[taglineIdx];
    if (!isDeleting) {
      taglineEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        typeSpeed = 2500; // pause at full text
      } else {
        typeSpeed = 60 + Math.random() * 40;
      }
    } else {
      taglineEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        taglineIdx = (taglineIdx + 1) % taglines.length;
        typeSpeed = 400;
      } else {
        typeSpeed = 30;
      }
    }
    setTimeout(typewrite, typeSpeed);
  }
  setTimeout(typewrite, 1200);

  // ── Scroll Animations ──
  const animatedEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  animatedEls.forEach((el) => observer.observe(el));

  // ── Nav scroll state ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ── Mobile menu toggle ──
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Smooth scroll for nav links ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
