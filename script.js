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
// HERO TYPEWRITER ANIMATION (REPLAY ON VIEWPORT FOCUS)
// =============================================
const initTypewriter = () => {
  const line1El = document.getElementById('heroLine1');
  const line2El = document.getElementById('heroLine2');
  const cursorEl = document.getElementById('typeCursor');
  const heroTitle = document.querySelector('.hero__title');

  if (!line1El || !line2El || !cursorEl || !heroTitle) return;

  const text1 = "Software Engineer |";
  const text2 = "Backend-Focused Full Stack Developer";

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    line1El.textContent = text1;
    line2El.textContent = text2;
    return;
  }

  let typeTimer = null;
  let isTyping = false;

  const stopTyping = () => {
    if (typeTimer) {
      clearTimeout(typeTimer);
      typeTimer = null;
    }
    isTyping = false;
  };

  const startTyping = () => {
    stopTyping();
    isTyping = true;

    // Clear text for clean typing effect
    line1El.textContent = '';
    line2El.textContent = '';
    line1El.after(cursorEl);

    let i = 0;
    let j = 0;
    const speedLine1 = 55; // ms per character
    const speedLine2 = 45; // ms per character
    const pauseBetweenLines = 280; // ms

    const typeLine1 = () => {
      if (!isTyping) return;
      if (i < text1.length) {
        line1El.textContent += text1.charAt(i);
        i++;
        typeTimer = setTimeout(typeLine1, speedLine1);
      } else {
        typeTimer = setTimeout(() => {
          if (!isTyping) return;
          line2El.after(cursorEl);
          typeLine2();
        }, pauseBetweenLines);
      }
    };

    const typeLine2 = () => {
      if (!isTyping) return;
      if (j < text2.length) {
        line2El.textContent += text2.charAt(j);
        j++;
        typeTimer = setTimeout(typeLine2, speedLine2);
      } else {
        isTyping = false;
      }
    };

    typeTimer = setTimeout(typeLine1, 200);
  };

  // Observe hero title: replay typing whenever it scrolls back into view
  let hasInitiallyFired = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTyping();
        hasInitiallyFired = true;
      } else {
        if (hasInitiallyFired) {
          stopTyping();
          // Hide text when scrolled down so it re-types fresh when scrolling back up
          line1El.textContent = '';
          line2El.textContent = '';
        }
      }
    });
  }, {
    threshold: 0.15
  });

  observer.observe(heroTitle);
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

// =============================================
// FEATURED PROJECTS CATEGORY FILTER
// =============================================
const filterBtns = document.querySelectorAll('.proj-filter-btn');
const projCards = document.querySelectorAll('.proj-card');

if (filterBtns.length && projCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Toggle active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards with smooth fade
      projCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 220);
        }
      });
    });
  });
}
