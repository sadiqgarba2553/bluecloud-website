// Tunnel Arcade - Game 3: Cyber Flappy Bird / Tunnel Flyer
class FlappyBirdGame {
  init(engine) {
    this.engine = engine;
    this.birdX = 160;
    this.birdY = 280;
    this.velocity = 0;
    this.gravity = 980;
    this.jumpForce = -360;
    this.birdAngle = 0;
    this.birdRadius = 16;

    this.pipes = [];
    this.spawnTimer = 0;
    this.gameSpeed = 220;
    this.gapSize = 150;
    this.pipeWidth = 64;

    this.sparks = [];
    this.buildings = [];
    this.initBuildings();
  }

  initBuildings() {
    this.buildings = [];
    let curX = 0;
    while (curX < 1000) {
      const w = Math.random() * 60 + 40;
      const h = Math.random() * 200 + 100;
      this.buildings.push({ x: curX, w, h });
      curX += w + Math.random() * 20;
    }
  }

  update(dt, input) {
    // Jump Action
    if (input.wasPressed('jump') || input.wasPressed('up') || input.wasPressed('actionA')) {
      this.velocity = this.jumpForce;
      if (window.tunnelAudio) window.tunnelAudio.play('jump');
      this.engine.spawnExplosion(this.birdX - 10, this.birdY, '#00f0ff', 6);
    }

    // Apply gravity
    this.velocity += this.gravity * dt;
    this.birdY += this.velocity * dt;

    // Bird angle tilt based on velocity
    this.birdAngle = Math.min(Math.PI / 4, Math.max(-Math.PI / 5, this.velocity * 0.002));

    // Floor / Ceiling check
    if (this.birdY + this.birdRadius >= 540) {
      this.engine.shake(12, 0.3);
      this.engine.spawnExplosion(this.birdX, this.birdY, '#ff0055', 30);
      this.engine.gameOver('Impact with Energy Grid!');
      return;
    }
    if (this.birdY - this.birdRadius <= 0) {
      this.birdY = this.birdRadius;
      this.velocity = 0;
    }

    // Update Background Parallax Buildings
    this.buildings.forEach(b => {
      b.x -= this.gameSpeed * 0.3 * dt;
    });
    if (this.buildings.length && this.buildings[0].x + this.buildings[0].w < 0) {
      const old = this.buildings.shift();
      const lastX = this.buildings[this.buildings.length - 1].x + this.buildings[this.buildings.length - 1].w;
      old.x = lastX + Math.random() * 20;
      this.buildings.push(old);
    }

    // Spawn Pipes
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = 1.7;
      const minTop = 60;
      const maxTop = 540 - this.gapSize - minTop;
      const topHeight = Math.random() * (maxTop - minTop) + minTop;

      const pipe = {
        x: 850,
        top: topHeight,
        bottom: topHeight + this.gapSize,
        passed: false,
        hasSpark: Math.random() < 0.6
      };
      this.pipes.push(pipe);
    }

    // Update Pipes & Collisions
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const p = this.pipes[i];
      p.x -= this.gameSpeed * dt;

      // Check Gate Passing & Score
      if (!p.passed && p.x + this.pipeWidth < this.birdX) {
        p.passed = true;
        this.engine.addScore(1);
        this.engine.spawnFloatingText('+1 GATE', this.birdX + 30, this.birdY - 20, '#00ff66', 20);
        if (window.tunnelAudio) window.tunnelAudio.play('score');
      }

      // Spark item collection
      if (p.hasSpark && Math.abs(p.x + this.pipeWidth / 2 - this.birdX) < 25) {
        const sparkY = p.top + this.gapSize / 2;
        if (Math.abs(this.birdY - sparkY) < 30) {
          p.hasSpark = false;
          this.engine.addScore(5);
          this.engine.spawnFloatingText('+5 BONUS', this.birdX, this.birdY - 30, '#ffb700', 22);
          if (window.tunnelAudio) window.tunnelAudio.play('coin');
        }
      }

      // Collision detection with top & bottom pipes
      if (
        this.birdX + this.birdRadius > p.x &&
        this.birdX - this.birdRadius < p.x + this.pipeWidth
      ) {
        if (
          this.birdY - this.birdRadius < p.top ||
          this.birdY + this.birdRadius > p.bottom
        ) {
          this.engine.shake(14, 0.35);
          this.engine.spawnExplosion(this.birdX, this.birdY, '#ff0055', 35);
          this.engine.gameOver('Collision with Cyber Gate!');
          return;
        }
      }

      // Remove off-screen pipes
      if (p.x + this.pipeWidth < -50) {
        this.pipes.splice(i, 1);
      }
    }
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Background Gradient (Cyber Sky)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#070914');
    skyGrad.addColorStop(0.7, '#131b38');
    skyGrad.addColorStop(1, '#05070e');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Distant City Skyline
    ctx.fillStyle = '#0a0f22';
    this.buildings.forEach(b => {
      ctx.fillRect(b.x, 540 - b.h, b.w, b.h);
      // Window lights
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      for (let wy = 540 - b.h + 15; wy < 520; wy += 20) {
        for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 12) {
          ctx.fillRect(wx, wy, 5, 8);
        }
      }
      ctx.fillStyle = '#0a0f22';
    });

    // Floor Grid Line
    ctx.fillStyle = '#080a14';
    ctx.fillRect(0, 540, w, 60);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, 540);
    ctx.lineTo(w, 540);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Pipes / Cyber Gates
    this.pipes.forEach(p => {
      // Top Pipe
      this.drawPylon(ctx, p.x, 0, this.pipeWidth, p.top, true);
      // Bottom Pipe
      this.drawPylon(ctx, p.x, p.bottom, this.pipeWidth, 540 - p.bottom, false);

      // Energy beam between gap edges
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(p.x + this.pipeWidth / 2, p.top);
      ctx.lineTo(p.x + this.pipeWidth / 2, p.bottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Bonus Spark
      if (p.hasSpark) {
        const sy = p.top + this.gapSize / 2;
        ctx.save();
        ctx.fillStyle = '#ffb700';
        ctx.shadowColor = '#ffb700';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(p.x + this.pipeWidth / 2, sy, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x + this.pipeWidth / 2, sy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    // Draw Cyber Bird (Neon Drone Craft)
    ctx.save();
    ctx.translate(this.birdX, this.birdY);
    ctx.rotate(this.birdAngle);

    // Drone Body
    ctx.fillStyle = '#ff007f';
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Visor eye
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.beginPath();
    ctx.arc(8, -2, 5, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-4, 2, 8, 4, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Thruster trail
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(-16, -4);
    ctx.lineTo(-26 - Math.random() * 8, 0);
    ctx.lineTo(-16, 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  drawPylon(ctx, x, y, w, h, isTop) {
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, y, w, h);

    // Glowing Neon Pylon Edges
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 8;
    ctx.strokeRect(x, y, w, h);

    // Cap at the entrance of the gate
    const capHeight = 16;
    const capY = isTop ? y + h - capHeight : y;
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.fillRect(x - 4, capY, w + 8, capHeight);
    ctx.restore();
  }

  destroy() {
    this.pipes = [];
    this.buildings = [];
  }
}

window.FlappyBirdGame = FlappyBirdGame;
