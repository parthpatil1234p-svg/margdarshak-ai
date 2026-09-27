/**
 * 21st.dev Style Dynamic Particle Burst Animation for Interactive Buttons
 */
(function() {
  const PARTICLE_COLORS = ['#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#f43f5e', '#ffffff'];

  function createParticleBurst(x, y, count = 16) {
    const container = document.createElement('div');
    container.className = 'particle-burst-container';
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '99999';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'burst-particle';
      const size = Math.random() * 5 + 3;
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      
      const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const velocity = Math.random() * 70 + 40;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity - 25;

      particle.style.position = 'fixed';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = color;
      particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
      particle.style.opacity = '1';
      particle.style.transition = 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
      particle.style.transform = 'translate(-50%, -50%) scale(1)';

      container.appendChild(particle);

      requestAnimationFrame(() => {
        particle.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0)`;
        particle.style.opacity = '0';
      });
    }

    setTimeout(() => {
      container.remove();
    }, 750);
  }

  // Attach automatically to primary simulation buttons
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.shimmer-btn, .btn-primary, .persona-pill-btn, .interactive-hover-btn, .particle-btn-trigger');
    if (target) {
      const rect = target.getBoundingClientRect();
      const clickX = e.clientX || (rect.left + rect.width / 2);
      const clickY = e.clientY || (rect.top + rect.height / 2);
      createParticleBurst(clickX, clickY, 14);
    }
  });

  window.triggerParticleBurst = createParticleBurst;
})();
