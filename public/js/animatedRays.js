/**
 * MargDarshak AI - Animated Rays & Dynamic Motion Background Canvas
 * Inspired by Vengeance UI (animated-rays) and GetLayers dynamic WebGL/Canvas aesthetics
 */

function initAnimatedRays() {
  const hero = document.querySelector('.hero-banner');
  if (!hero) return;

  // Prevent duplicate canvases
  let canvas = hero.querySelector('#ambientRaysCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'ambientRaysCanvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.75';
    hero.style.position = 'relative';
    hero.style.overflow = 'hidden';
    hero.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;

  // Particle beams & ray definitions
  const rays = [
    { x: 0.15, angle: 35, speed: 0.003, color: 'rgba(99, 102, 241, 0.18)', width: 140 },
    { x: 0.50, angle: 45, speed: 0.004, color: 'rgba(14, 165, 233, 0.14)', width: 180 },
    { x: 0.85, angle: 30, speed: 0.002, color: 'rgba(168, 85, 247, 0.16)', width: 160 },
    { x: 0.35, angle: 55, speed: 0.005, color: 'rgba(16, 185, 129, 0.10)', width: 120 }
  ];

  // Drifting ambient particles
  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: Math.random() * 2 + 0.8,
    vx: (Math.random() - 0.5) * 0.0005,
    vy: (Math.random() - 0.5) * 0.0005,
    alpha: Math.random() * 0.5 + 0.2
  }));

  let mouseX = 0.5;
  let mouseY = 0.5;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
  });

  const resize = () => {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  let time = 0;
  const render = () => {
    time += 0.015;
    ctx.clearRect(0, 0, width, height);

    // Draw dynamic radial mesh glow centered on mouse
    const radGrad = ctx.createRadialGradient(
      width * mouseX, height * mouseY, 10,
      width * mouseX, height * mouseY, width * 0.6
    );
    radGrad.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
    radGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.06)');
    radGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw animated light rays (Vengeance UI style)
    rays.forEach((ray, i) => {
      const offsetX = Math.sin(time * ray.speed * 100 + i) * 60;
      const originX = width * ray.x + offsetX;
      const angleRad = (ray.angle + Math.sin(time + i) * 8) * (Math.PI / 180);

      ctx.save();
      ctx.translate(originX, -50);
      ctx.rotate(angleRad);

      const rayGrad = ctx.createLinearGradient(0, 0, 0, height * 1.5);
      rayGrad.addColorStop(0, ray.color);
      rayGrad.addColorStop(0.4, ray.color.replace(/[\d\.]+\)$/, '0.08)'));
      rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = rayGrad;
      ctx.fillRect(-ray.width / 2, 0, ray.width, height * 1.6);
      ctx.restore();
    });

    // Draw cosmic particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(165, 180, 252, ${p.alpha * (0.6 + Math.sin(time * 2 + p.radius) * 0.4)})`;
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(render);
  };

  render();
}

window.initAnimatedRays = initAnimatedRays;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimatedRays);
} else {
  initAnimatedRays();
}
