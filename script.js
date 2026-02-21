/* ============================================================
   PORTFOLIO SCRIPT — script.js
   Sections:
   1. Custom Cursor
   2. Loader
   3. Navbar (scroll + hamburger)
   4. Hero Canvas Particles
   5. Typed Text Effect
   6. Scroll Reveal
   7. Counter Animation
   8. Skill Bars
   9. Active Nav Link on Scroll
   10. Contact Form
============================================================ */


/* ─── 1. CUSTOM CURSOR ─────────────────────────────────── */
const cursorDot     = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth outline follow
function animateCursor() {
  outlineX += (mouseX - outlineX) * 0.12;
  outlineY += (mouseY - outlineY) * 0.12;
  cursorOutline.style.left = outlineX + 'px';
  cursorOutline.style.top  = outlineY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect
document.querySelectorAll('a, button, .pill, .cert-card, .proj-card, .chip').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorOutline.style.width  = '52px';
    cursorOutline.style.height = '52px';
    cursorOutline.style.borderColor = 'var(--accent)';
  });
  el.addEventListener('mouseleave', () => {
    cursorOutline.style.width  = '36px';
    cursorOutline.style.height = '36px';
    cursorOutline.style.borderColor = 'rgba(110,231,183,0.4)';
  });
});


/* ─── 2. LOADER ─────────────────────────────────────────── */
const loader      = document.getElementById('loader');
const loaderBar   = document.getElementById('loaderBar');
const loaderPct   = document.getElementById('loaderPercent');

let progress = 0;
const loadInterval = setInterval(() => {
  // Use a guaranteed minimum increment so loader never stalls
  progress += 8 + Math.random() * 14;
  if (progress >= 100) {
    progress = 100;
    loaderBar.style.width = '100%';
    loaderPct.textContent  = '100%';
    clearInterval(loadInterval);
    // Hide loader after short pause
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger hero reveals after loader
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    }, 400);
    return;
  }
  loaderBar.style.width = progress + '%';
  loaderPct.textContent  = Math.floor(progress) + '%';
}, 80);


/* ─── 3. NAVBAR ─────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu= document.getElementById('mobileMenu');

// Scroll: add .scrolled class
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* ─── 4. HERO CANVAS PARTICLES ─────────────────────────── */
const canvas  = document.getElementById('heroCanvas');
const ctx     = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 60;
const particles = [];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = randomBetween(0, canvas.width);
    this.y  = randomBetween(0, canvas.height);
    this.r  = randomBetween(0.8, 2.5);
    this.vx = randomBetween(-0.15, 0.15);
    this.vy = randomBetween(-0.2, -0.05);
    this.alpha = randomBetween(0.15, 0.55);
    this.color = Math.random() > 0.5 ? '110,231,183' : '56,189,248';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -5) this.reset();
    if (this.x < -5) this.x = canvas.width + 5;
    if (this.x > canvas.width + 5) this.x = -5;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

// Draw connecting lines between close particles
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(110,231,183,${(1 - dist / 100) * 0.08})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLines();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* ─── 5. TYPED TEXT EFFECT ───────────────────────────────── */
const typedEl = document.getElementById('typedText');
const words   = [
  'Frontend Developer',
  'Python Enthusiast',
  'UI/UX Thinker',
  'Problem Solver',
  'Web Creator',
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 90;

function typeWriter() {
  const current = words[wordIndex];

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      typingSpeed = 1800; // pause before delete
    } else {
      typingSpeed = 90;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex  = (wordIndex + 1) % words.length;
      typingSpeed = 400; // pause before next word
    } else {
      typingSpeed = 45;
    }
  }
  setTimeout(typeWriter, typingSpeed);
}

// Start after loader
setTimeout(typeWriter, 1600);


/* ─── 6. SCROLL REVEAL ───────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, idx) => {
          const delay = Array.from(siblings).indexOf(el) * 80;
          setTimeout(() => el.classList.add('visible'), delay);
        });
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─── 7. COUNTER ANIMATION ───────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step     = 16;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


/* ─── 8. SKILL BARS ─────────────────────────────────────── */
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.bar-fill');
        fills.forEach(fill => {
          const width = fill.dataset.w;
          // Small delay so CSS transition plays nicely
          setTimeout(() => { fill.style.width = width + '%'; }, 200);
        });
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const skillBarsSection = document.querySelector('.skill-bars');
if (skillBarsSection) barObserver.observe(skillBarsSection);


/* ─── 9. ACTIVE NAV LINK ON SCROLL ──────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(section => sectionObserver.observe(section));


/* ─── 10. CONTACT FORM ───────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const submitTxt   = document.getElementById('submitTxt');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsub').value.trim();
  const message = document.getElementById('fmsg').value.trim();

  // Simple validation
  if (!name || !email || !subject || !message) {
    showFormError('Please fill in all fields.');
    return;
  }
  if (!isValidEmail(email)) {
    showFormError('Please enter a valid email address.');
    return;
  }

  // Simulate submission (replace with real backend/email service)
  submitBtn.disabled = true;
  submitTxt.textContent = 'Sending…';

  setTimeout(() => {
    submitBtn.classList.add('success');
    submitTxt.textContent = '✓ Message Sent!';
    contactForm.reset();
    setTimeout(() => {
      submitBtn.classList.remove('success');
      submitTxt.textContent = 'Send Message';
      submitBtn.disabled = false;
    }, 3500);
  }, 1200);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormError(msg) {
  // Simple inline error toast
  const existing = document.querySelector('.form-error');
  if (existing) existing.remove();

  const err = document.createElement('div');
  err.className = 'form-error';
  err.textContent = msg;
  err.style.cssText = `
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.3);
    color: #f87171;
    padding: 0.7rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  `;
  contactForm.prepend(err);
  setTimeout(() => err.remove(), 3000);
}


/* ─── SMOOTH SCROLL for nav links ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
