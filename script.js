// =============================================
// NAVIGATION & HEADER INTERACTIONS
// =============================================
const nav = document.querySelector('.nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Sticky nav elevation on scroll
const handleNavScroll = () => {
  if (nav) {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// Mobile menu toggle
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close menu on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || targetId === '') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Active nav link highlight on scroll
const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav__links a');

if (sections.length && links.length) {
  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-25% 0px -55% 0px' });

  sections.forEach(s => activeSectionObserver.observe(s));
}

// =============================================
// SCROLL-TRIGGERED REVEAL SYSTEM
// =============================================
const revealElements = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // If user prefers reduced motion, reveal all elements immediately without transitions
  revealElements.forEach(el => el.classList.add('revealed'));
} else if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after entrance to avoid unnecessary re-triggers and preserve performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  // Fallback for older browsers
  revealElements.forEach(el => el.classList.add('revealed'));
}

// =============================================
// DYNAMIC COPYRIGHT YEAR
// =============================================
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}
