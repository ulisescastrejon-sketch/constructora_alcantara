/* ============================================================
   Constructora Alcantara — script.js
   ============================================================ */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── Active nav highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--blue)';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observer.observe(s));

/* ── Entrance animations (Intersection Observer) ── */
const animateConfig = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animateObserver.unobserve(entry.target);
    }
  });
}, animateConfig);

// Register elements for animation
document.querySelectorAll([
  '.servicio-card',
  '.cliente-card',
  '.valor-card',
  '.metric-card',
  '.dif-item',
  '.nosotros-content',
  '.nosotros-image-wrapper',
  '.contacto-info',
  '.contacto-form-wrapper',
  '.por-que-content',
  '.section-header',
].join(',')).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.6s ease ${(i % 5) * 0.08}s, transform 0.6s ease ${(i % 5) * 0.08}s`;
  animateObserver.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  // Add .visible CSS rule dynamically
  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
});

/* ── Animated counters for stat numbers ── */
function animateCounter(el, target, suffix = '', duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.stat-number');
      numbers.forEach(n => {
        const text = n.textContent;
        const match = text.match(/[\d]+/);
        if (match) {
          const num = parseInt(match[0]);
          const prefix = text.startsWith('+') ? '+' : '';
          n.textContent = prefix + '0';
          animateCounter(n, num, '', 1800);
          if (prefix) setTimeout(() => { n.textContent = '+' + n.textContent.replace(/\D/g, ''); }, 0);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ── Metric cards counter ── */
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.metric-number');
      numbers.forEach(n => {
        const fullText = n.innerHTML;
        const match = fullText.match(/(\d+)/);
        if (match) {
          const num = parseInt(match[1]);
          const spanContent = n.querySelector('span') ? n.querySelector('span').outerHTML : '';
          let count = 0;
          const step = Math.ceil(num / 50);
          const timer = setInterval(() => {
            count = Math.min(count + step, num);
            n.innerHTML = count + spanContent;
            if (count >= num) clearInterval(timer);
          }, 30);
        }
      });
      metricObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.metric-card').forEach(card => metricObserver.observe(card));

/* ── Contact form handler ── */
const form = document.getElementById('contacto-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.textContent = '✓ ¡Mensaje enviado! Nos pondremos en contacto pronto.';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    btn.style.boxShadow = '0 4px 20px rgba(34,197,94,0.4)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = 'Enviar solicitud <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      btn.style.background = '';
      btn.style.boxShadow = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
}

/* ── Smooth parallax on hero ── */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  if (hero && window.scrollY < window.innerHeight) {
    hero.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    hero.style.opacity = 1 - window.scrollY / (window.innerHeight * 0.8);
  }
}, { passive: true });

/* ── Client card tilt effect on hover ── */
document.querySelectorAll('.cliente-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
