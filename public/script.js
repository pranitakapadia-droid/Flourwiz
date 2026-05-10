/* FlourWiz – Main Script */
'use strict';

/* ── CUSTOM CURSOR ── */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .product-card, .feature-item, .order-btn').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    cursorFollower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    cursorFollower.classList.remove('hover');
  });
});

/* ── SCROLL PROGRESS & STICKY NAV ── */
const scrollProgress = document.getElementById('scrollProgress');
const nav            = document.getElementById('nav');

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';

  nav.classList.toggle('scrolled', scrollTop > 50);

  updateActiveNav();
}, { passive: true });

/* ── MOBILE MENU ── */
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let   menuOpen   = false;

function closeMobileMenu() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  const [s1, s2, s3] = navToggle.querySelectorAll('span');
  s1.style.transform = '';
  s2.style.opacity   = '1';
  s3.style.transform = '';
}

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const [s1, s2, s3] = navToggle.querySelectorAll('span');
  if (menuOpen) {
    s1.style.transform = 'rotate(45deg) translate(5px, 5px)';
    s2.style.opacity   = '0';
    s3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    closeMobileMenu();
  }
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeMobileMenu();
    const navH = 80;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});

/* Scroll-to via data attribute (Order Now buttons) */
document.querySelectorAll('[data-scroll-to]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.scrollTo);
    if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  });
});

/* ── ACTIVE NAV HIGHLIGHT ── */
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

/* ── INTERSECTION OBSERVER – SCROLL ANIMATIONS ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('animate-in');

      /* Trigger highlight underlines inside this element */
      entry.target.querySelectorAll('.highlight').forEach((h) => h.classList.add('active'));

      /* Counter animation for any stat numbers inside */
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-animate]').forEach((el) => revealObserver.observe(el));

/* Also trigger highlight underlines in the hero (no data-animate wrapper) */
setTimeout(() => {
  document.querySelectorAll('.hero-title .highlight').forEach((h) => h.classList.add('active'));
}, 900);

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const interval = 16;
  const steps    = duration / interval;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN');
  }, interval);
}

/* ── PARALLAX – HERO FLOATS & SHAPES ── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  document.querySelectorAll('.float-item').forEach((item, i) => {
    const speed = 0.08 + i * 0.04;
    item.style.transform = `translateY(${scrollY * speed}px)`;
  });

  document.querySelectorAll('.hero-shape').forEach((shape, i) => {
    const speed = 0.04 + i * 0.025;
    shape.style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Basic validation */
    const name  = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    if (!name || !email) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    }, 1200);
  });
}

/* ── HERO SCROLL NUDGE ── */
const heroScroll = document.getElementById('heroScroll');
if (heroScroll) {
  heroScroll.addEventListener('click', () => {
    const features = document.querySelector('.features');
    if (features) window.scrollTo({ top: features.offsetTop, behavior: 'smooth' });
  });
}

/* ── NEWSLETTER ── */
const newsletterBtn   = document.getElementById('newsletterBtn');
const newsletterEmail = document.getElementById('newsletterEmail');

if (newsletterBtn && newsletterEmail) {
  newsletterBtn.addEventListener('click', () => {
    const val = newsletterEmail.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(val)) {
      newsletterEmail.focus();
      newsletterEmail.style.borderColor = 'var(--champ-400)';
      setTimeout(() => { newsletterEmail.style.borderColor = ''; }, 2000);
      return;
    }
    newsletterBtn.textContent              = '✓ Subscribed!';
    newsletterBtn.style.background         = 'linear-gradient(135deg,#52a85b,#2d6b32)';
    newsletterEmail.value                  = '';
    setTimeout(() => {
      newsletterBtn.textContent    = 'Subscribe';
      newsletterBtn.style.background = '';
    }, 3200);
  });
}

/* ── PRODUCT CARD TILT (subtle 3-D hover) ── */
document.querySelectorAll('.product-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-10px) scale(1.01) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
