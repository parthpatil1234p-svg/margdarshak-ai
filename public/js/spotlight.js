/**
 * MargDarshak AI - Interactive Spotlight & Bento Grid Micro-Interactions
 * Inspired by 21st.dev, Aceternity UI, and modern Vengeance UI components
 */

(function initSpotlightCards() {
  function handleMouseMove(e) {
    const cards = document.querySelectorAll('.spotlight-card, .bento-item, .custom-card, .pathway-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  }

  // Optimize with requestAnimationFrame
  let ticking = false;
  window.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleMouseMove(e);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Dynamic Glow Button Ripple and Tilt Micro-Interactions
  document.addEventListener('DOMContentLoaded', () => {
    const glowButtons = document.querySelectorAll('.glow-btn, .persona-btn');
    glowButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty('--btn-mouse-x', `${x}px`);
        btn.style.setProperty('--btn-mouse-y', `${y}px`);
      });
    });
  });
})();
