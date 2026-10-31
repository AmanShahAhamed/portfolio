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

// =============================================
// HERO TYPEWRITER ANIMATION
// =============================================
const initTypewriter = () => {
  const line1El = document.getElementById('heroLine1');
  const line2El = document.getElementById('heroLine2');
  const cursorEl = document.getElementById('typeCursor');

  if (!line1El || !line2El || !cursorEl) return;

  const text1 = "Software Engineer |";
  const text2 = "Backend-Focused Full Stack Developer";

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    line1El.textContent = text1;
    line2El.textContent = text2;
    return;
  }

  // Clear initial text for animated typing
  line1El.textContent = '';
  line2El.textContent = '';

  // Position cursor right after line 1 initially
  line1El.after(cursorEl);

  let i = 0;
  let j = 0;
  const speedLine1 = 65; // ms per character
  const speedLine2 = 55; // ms per character
  const pauseBetweenLines = 320; // ms

  const typeLine1 = () => {
    if (i < text1.length) {
      line1El.textContent += text1.charAt(i);
      i++;
      setTimeout(typeLine1, speedLine1);
    } else {
      setTimeout(() => {
        // Move cursor to line 2 and begin typing
        line2El.after(cursorEl);
        typeLine2();
      }, pauseBetweenLines);
    }
  };

  const typeLine2 = () => {
    if (j < text2.length) {
      line2El.textContent += text2.charAt(j);
      j++;
      setTimeout(typeLine2, speedLine2);
    }
  };

  // Start typing smoothly after hero entrance animation
  setTimeout(typeLine1, 350);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTypewriter);
} else {
  initTypewriter();
}

// =============================================
// BACK TO TOP SMOOTH SCROLL
// =============================================
const backToTopBtn = document.getElementById('backToTopBtn');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
