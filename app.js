document.addEventListener('DOMContentLoaded', () => {
  // 1. Setup staggered animation indexes for list items
  const categories = document.querySelectorAll('.category-card');
  categories.forEach((card) => {
    const items = card.querySelectorAll('.list-item');
    items.forEach((item, index) => {
      // Set inline custom property for CSS delay calculations
      item.style.setProperty('--item-index', index);
    });
  });

  // 2. Intersection Observer for Scroll Reveals
  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        // Once visible, stop observing to prevent repeating animations
        observer.unobserve(entry.target);
      }
    });
  };

  const revealOptions = {
    root: null, // viewport
    rootMargin: '0px 0px -40px 0px', // trigger slightly before entering viewport
    threshold: 0.05 // trigger when 5% visible
  };

  const observer = new IntersectionObserver(revealCallback, revealOptions);
  
  const revealElements = document.querySelectorAll('[data-reveal]');
  revealElements.forEach((el) => {
    observer.observe(el);
  });

  // 3. Tactile feedback: Shake lock on click/tap and show premium Toast
  const listItems = document.querySelectorAll('.list-item');
  listItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      // Prevent rapid double triggers
      if (item.classList.contains('shaking')) return;
      item.classList.add('shaking');

      const lockSvg = item.querySelector('.lock-svg');
      if (lockSvg) {
        lockSvg.classList.add('lock-shake');
      }

      showToast("Ushbu dars faqat hamjamiyat a'zolari uchun yopiq 🔒");

      setTimeout(() => {
        item.classList.remove('shaking');
        if (lockSvg) {
          lockSvg.classList.remove('lock-shake');
        }
      }, 600);
    });
  });

  // 4. Scroll to bottom functionality (Telegram style)
  const scrollBtn = document.getElementById('scroll-to-bottom');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });

    // Toggle button visibility based on scroll position / CTA visibility
    const toggleScrollBtnVisibility = () => {
      const ctaButton = document.querySelector('.cta-button');
      if (ctaButton) {
        const rect = ctaButton.getBoundingClientRect();
        // If CTA button is visible in the viewport, hide the scroll button
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          scrollBtn.classList.add('scroll-btn-hidden');
        } else {
          scrollBtn.classList.remove('scroll-btn-hidden');
        }
      }
    };

    window.addEventListener('scroll', toggleScrollBtnVisibility);
    // Initial check on load
    setTimeout(toggleScrollBtnVisibility, 500);
  }

  // 5. Premium Toast Notification implementation
  function showToast(message) {
    // Remove existing toast if present
    const existingToast = document.querySelector('.premium-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'premium-toast';
    toast.innerHTML = `
      <span class="toast-icon">✨</span>
      <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    // Fade and slide in
    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 50);

    // Fade and slide out, then remove
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 2800);
  }
});
