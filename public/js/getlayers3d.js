/**
 * MargDarshak AI - GetLayers 3D WebGL Scene & Fluid Motion Gradients
 * Cinematic interactive canvas featuring dynamic WebGL chromatic waves,
 * floating 3D career crossroads geometry, and cursor-following depth.
 */

(function initGetLayers3D() {
  let container = document.getElementById('getlayersContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'getlayersContainer';
    document.body.prepend(container);
  }
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '0';
  container.style.overflow = 'hidden';
  container.style.opacity = '0.85';

  // Fallback 2D fluid mesh gradient renderer if Three.js is not loaded
  function init2DCanvasFallback() {
    const canvas = document.createElement('canvas');
    canvas.id = 'getlayersCanvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = 0.5, mouseY = 0.5;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    });

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let t = 0;
    function draw() {
      t += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Deep celestial base
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, width, height);

      // Fluid Gradient Orb 1 (Indigo/Violet)
      const x1 = width * (0.3 + Math.sin(t) * 0.15) + (mouseX - 0.5) * 60;
      const y1 = height * (0.3 + Math.cos(t * 0.8) * 0.15) + (mouseY - 0.5) * 60;
      const grad1 = ctx.createRadialGradient(x1, y1, 10, x1, y1, width * 0.55);
      grad1.addColorStop(0, 'rgba(79, 70, 229, 0.22)');
      grad1.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
      grad1.addColorStop(1, 'rgba(6, 9, 19, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Fluid Gradient Orb 2 (Cyan/Teal)
      const x2 = width * (0.75 + Math.cos(t * 0.9) * 0.15) - (mouseX - 0.5) * 80;
      const y2 = height * (0.65 + Math.sin(t * 1.1) * 0.15) - (mouseY - 0.5) * 80;
      const grad2 = ctx.createRadialGradient(x2, y2, 20, x2, y2, width * 0.5);
      grad2.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
      grad2.addColorStop(0.6, 'rgba(14, 165, 233, 0.05)');
      grad2.addColorStop(1, 'rgba(6, 9, 19, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Fluid Gradient Orb 3 (Emerald - Career Growth)
      const x3 = width * (0.5 + Math.sin(t * 1.3) * 0.2);
      const y3 = height * (0.85 + Math.cos(t * 0.7) * 0.1);
      const grad3 = ctx.createRadialGradient(x3, y3, 10, x3, y3, width * 0.45);
      grad3.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
      grad3.addColorStop(1, 'rgba(6, 9, 19, 0)');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(draw);
    }
    draw();
  }

  // Check for Three.js
  if (typeof THREE === 'undefined') {
    init2DCanvasFallback();
    return;
  }

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Floating 3D Geometric "Crossroads & Pathways" Nodes
    const group = new THREE.Group();
    scene.add(group);

    // Geometry 1: Icosahedron Wireframe (Decision Core)
    const icoGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(12, 4, -4);
    group.add(icosahedron);

    // Geometry 2: Torus (Infinite Milestone Loop)
    const torusGeo = new THREE.TorusGeometry(3.5, 0.8, 16, 64);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-14, -6, -2);
    group.add(torus);

    // Geometry 3: Octahedron (Academic Prudence)
    const octGeo = new THREE.OctahedronGeometry(2.8, 0);
    const octMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const octahedron = new THREE.Mesh(octGeo, octMat);
    octahedron.position.set(-8, 8, -6);
    group.add(octahedron);

    // 3D Particle Cloud
    const particleCount = 120;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x818cf8,
      transparent: true,
      opacity: 0.45
    });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    group.add(particleMesh);

    // Mouse Tracking Parallax
    let targetX = 0;
    let targetY = 0;
    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.001;
      targetY = (e.clientY - window.innerHeight / 2) * 0.001;
    });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Subtle rotations
      icosahedron.rotation.x += 0.003;
      icosahedron.rotation.y += 0.005;

      torus.rotation.x += 0.004;
      torus.rotation.y += 0.003;

      octahedron.rotation.y += 0.006;
      octahedron.rotation.z += 0.004;

      // Mouse Parallax Glide
      group.rotation.y += (targetX - group.rotation.y) * 0.05;
      group.rotation.x += (targetY - group.rotation.x) * 0.05;

      // Floating undulation
      icosahedron.position.y = 4 + Math.sin(time * 0.8) * 0.8;
      torus.position.y = -6 + Math.cos(time * 0.7) * 0.6;
      octahedron.position.y = 8 + Math.sin(time * 1.1) * 0.7;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  } catch (err) {
    console.warn('[GetLayers 3D fallback to 2D canvas]', err);
    init2DCanvasFallback();
  }
})();
