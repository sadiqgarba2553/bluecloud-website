// Tunnel Arcade - 3D Perspective Warp Tunnel Background Visualizer
class TunnelBackground {
  constructor(canvasId = 'bg-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.rings = [];
    this.numRings = 24;
    this.segments = 8; // Octagonal tunnel
    this.speed = 0.003;
    this.rotation = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.resize();
    this.initRings();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.cx = this.width / 2;
    this.cy = this.height / 2;
  }

  initRings() {
    this.rings = [];
    for (let i = 0; i < this.numRings; i++) {
      this.rings.push({
        z: (i / this.numRings),
        rot: (i * 0.15)
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX - this.cx) / this.cx;
      this.targetMouseY = (e.clientY - this.cy) / this.cy;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth camera inertia
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.rotation += 0.005;

    // Clear with dark subtle fade
    this.ctx.fillStyle = '#07080f';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const fov = Math.min(this.width, this.height) * 0.8;
    const maxRadius = Math.max(this.width, this.height) * 0.75;
    const centerX = this.cx + this.mouseX * 80;
    const centerY = this.cy + this.mouseY * 80;

    // Sort rings from furthest (z=1) to closest (z=0)
    const pointsRing = [];

    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      ring.z -= this.speed;
      if (ring.z <= 0) {
        ring.z += 1;
      }

      // Exponential depth curve
      const depth = Math.pow(ring.z, 2.2);
      const radius = maxRadius * (1 - depth * 0.95);
      const alpha = Math.min(1, Math.max(0.05, (1 - ring.z) * 0.8));
      
      const pts = [];
      const currentRot = this.rotation + ring.z * 2;

      for (let s = 0; s < this.segments; s++) {
        const angle = currentRot + (s / this.segments) * Math.PI * 2;
        const px = centerX + Math.cos(angle) * radius;
        const py = centerY + Math.sin(angle) * radius * 0.85; // slightly elliptical
        pts.push({ x: px, y: py });
      }

      pointsRing.push({ pts, z: ring.z, alpha, radius });
    }

    // Sort furthest first
    pointsRing.sort((a, b) => b.z - a.z);

    // Draw connecting tunnel lines (depth ribs)
    if (pointsRing.length > 1) {
      for (let s = 0; s < this.segments; s++) {
        this.ctx.beginPath();
        for (let r = 0; r < pointsRing.length; r++) {
          const pt = pointsRing[r].pts[s];
          if (r === 0) this.ctx.moveTo(pt.x, pt.y);
          else this.ctx.lineTo(pt.x, pt.y);
        }
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
      }
    }

    // Draw octagonal rings
    pointsRing.forEach((rObj) => {
      this.ctx.beginPath();
      for (let s = 0; s < this.segments; s++) {
        const pt = rObj.pts[s];
        if (s === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      }
      this.ctx.closePath();

      // Dynamic neon gradient stroke
      const hue = (rObj.z * 180 + 190) % 360;
      this.ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${rObj.alpha * 0.5})`;
      this.ctx.lineWidth = (1 - rObj.z) * 3 + 0.8;
      this.ctx.stroke();

      // Subtle fill in the deep center
      if (rObj.z > 0.85) {
        this.ctx.fillStyle = `rgba(112, 0, 255, ${0.1 * (1 - rObj.z)})`;
        this.ctx.fill();
      }
    });

    // Glowing core star at center
    const coreGlow = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 150);
    coreGlow.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
    coreGlow.addColorStop(0.3, 'rgba(112, 0, 255, 0.2)');
    coreGlow.addColorStop(1, 'rgba(7, 8, 15, 0)');
    this.ctx.fillStyle = coreGlow;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.tunnelBg = new TunnelBackground('bg-canvas');
});
