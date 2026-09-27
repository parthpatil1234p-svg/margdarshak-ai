/**
 * MargDarshak AI - Animated Project Icon Component
 * Inspired by 21st.dev animated icons, Aceternity micro-interactions, and Vengeance UI.
 * 
 * Features:
 * - Geometric Career Compass & 4-Stage Pathway Waypoints
 * - Physics-driven rotating magnetic needle (±14° oscillation with spring ease)
 * - Continuous 360° radar sweep orbit (Hardware-accelerated SVG/CSS)
 * - Interactive 360° spring-spin on hover / click
 * - Responsive vector scaling (from 16px favicon to 88px hero display)
 */

const getMargDarshakIconSvg = (size = 36, animated = true, idPrefix = 'md-icon') => {
  const animClass = animated ? 'md-icon-animated' : '';
  return `
    <svg class="margdarshak-project-icon ${animClass}" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MargDarshak AI Compass Icon">
      <defs>
        <!-- Gradients -->
        <linearGradient id="${idPrefix}-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.9" />
        </linearGradient>
        <linearGradient id="${idPrefix}-needle-north" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#818cf8" />
        </linearGradient>
        <linearGradient id="${idPrefix}-needle-south" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4338ca" />
          <stop offset="100%" stop-color="#1e1b4b" />
        </linearGradient>
        <radialGradient id="${idPrefix}-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
        </radialGradient>
        <filter id="${idPrefix}-drop-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Ambient Glow Behind Icon -->
      <circle cx="24" cy="24" r="20" fill="url(#${idPrefix}-glow)" opacity="0.6" class="md-icon-ambient" />

      <!-- Outer Squircle / Hex-Shield Container -->
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#${idPrefix}-bg-grad)" stroke="rgba(255, 255, 255, 0.28)" stroke-width="1.5" class="md-icon-box" />

      <!-- Radar Sweep Orbit Ring -->
      <circle cx="24" cy="24" r="16" stroke="rgba(255, 255, 255, 0.22)" stroke-width="1" stroke-dasharray="2 3" class="md-icon-ring" />
      <circle cx="24" cy="24" r="16" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="25 75" stroke-linecap="round" class="md-icon-radar-sweep" />

      <!-- 4 Pathway Cardinal Diamond Markers (Class 10, Stage 2, College, Career) -->
      <circle cx="24" cy="8" r="1.75" fill="#ffffff" class="md-marker-n" />
      <circle cx="40" cy="24" r="1.5" fill="rgba(255, 255, 255, 0.75)" class="md-marker-e" />
      <circle cx="24" cy="40" r="1.5" fill="rgba(255, 255, 255, 0.75)" class="md-marker-s" />
      <circle cx="8" cy="24" r="1.5" fill="rgba(255, 255, 255, 0.75)" class="md-marker-w" />

      <!-- Rotating Compass Needle (The MargDarshak Star) -->
      <g class="md-icon-needle-group" transform-origin="24 24">
        <!-- North Pointer (Cyan) -->
        <polygon points="24,10 27.5,24 24,22.5" fill="url(#${idPrefix}-needle-north)" filter="url(#${idPrefix}-drop-glow)" />
        <polygon points="24,10 20.5,24 24,22.5" fill="#7dd3fc" />

        <!-- South Pointer (Indigo) -->
        <polygon points="24,38 27.5,24 24,25.5" fill="url(#${idPrefix}-needle-south)" />
        <polygon points="24,38 20.5,24 24,25.5" fill="#6366f1" />

        <!-- East-West Cross Wings -->
        <polygon points="12,24 24,21.5 24,26.5" fill="#818cf8" opacity="0.85" />
        <polygon points="36,24 24,21.5 24,26.5" fill="#38bdf8" opacity="0.85" />

        <!-- Center Core Nexus Node -->
        <circle cx="24" cy="24" r="3.2" fill="#ffffff" stroke="#0f172a" stroke-width="1" />
        <circle cx="24" cy="24" r="1.2" fill="#38bdf8" />
      </g>
    </svg>
  `;
};

// Initialize Project Icons across DOM
document.addEventListener('DOMContentLoaded', () => {
  // 1. Replace static brand icon in sidebar header
  const brandIconContainer = document.querySelector('.brand-icon-box');
  if (brandIconContainer) {
    brandIconContainer.innerHTML = getMargDarshakIconSvg(40, true, 'brand-header');
    brandIconContainer.classList.add('cursor-pointer');
    brandIconContainer.setAttribute('title', 'MargDarshak AI Compass - Click to Spin');
    brandIconContainer.addEventListener('click', () => {
      const needle = brandIconContainer.querySelector('.md-icon-needle-group');
      if (needle) {
        needle.classList.remove('spin-active');
        void needle.offsetWidth; // trigger reflow
        needle.classList.add('spin-active');
      }
    });
  }

  // 2. Sidebar Quick Tools icon slot
  const sidebarSlot = document.getElementById('sidebarProjectIconSlot');
  if (sidebarSlot) {
    sidebarSlot.innerHTML = getMargDarshakIconSvg(20, true, 'sidebar-quick');
  }

  // 3. Modal project icon slots
  const modalHeaderSlot = document.getElementById('modalProjectIconHeaderSlot');
  if (modalHeaderSlot) {
    modalHeaderSlot.innerHTML = getMargDarshakIconSvg(26, true, 'modal-header');
  }
  const modalBigSlot = document.getElementById('modalBigProjectIconSlot');
  if (modalBigSlot) {
    modalBigSlot.innerHTML = getMargDarshakIconSvg(88, true, 'modal-big');
    modalBigSlot.addEventListener('click', () => {
      const needle = modalBigSlot.querySelector('.md-icon-needle-group');
      if (needle) {
        needle.classList.remove('spin-active');
        void needle.offsetWidth;
        needle.classList.add('spin-active');
      }
    });
  }

  // 4. Hero banner chip icon slot if present
  const heroIconSlot = document.getElementById('heroProjectIconSlot');
  if (heroIconSlot) {
    heroIconSlot.innerHTML = getMargDarshakIconSvg(22, true, 'hero-chip');
  }

  // 5. Set SVG Favicon dynamically in head
  let favicon = document.querySelector("link[rel*='icon']");
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'shortcut icon';
    favicon.type = 'image/svg+xml';
    document.head.appendChild(favicon);
  }
  
  // High-contrast clean vector data URI for browser tab
  const faviconSvg = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="%234f46e5"/><circle cx="24" cy="24" r="16" fill="none" stroke="%2338bdf8" stroke-width="2.5"/><polygon points="24,10 28,24 24,22" fill="%2338bdf8"/><polygon points="24,10 20,24 24,22" fill="%23fff"/><polygon points="24,38 28,24 24,26" fill="%231e1b4b"/><polygon points="24,38 20,24 24,26" fill="%236366f1"/><circle cx="24" cy="24" r="3" fill="%23fff"/></svg>`;
  favicon.href = faviconSvg;
});

// Modal / Interactive Radar Showcase Trigger
window.openProjectIconShowcase = () => {
  const modalEl = document.getElementById('projectRadarModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
};

window.triggerIconSpinAll = () => {
  const needles = document.querySelectorAll('.md-icon-needle-group');
  needles.forEach(needle => {
    needle.classList.remove('spin-active');
    void needle.offsetWidth;
    needle.classList.add('spin-active');
  });
};

window.getMargDarshakIconSvg = getMargDarshakIconSvg;
