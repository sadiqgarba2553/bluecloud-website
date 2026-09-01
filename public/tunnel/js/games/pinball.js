// Tunnel Arcade - Game 16: Neon Pinball
class PinballGame {
  init(engine) {
    this.engine = engine;
    this.ball = {
      x: 620,
      y: 480,
      vx: 0,
      vy: 0,
      radius: 8,
      inPlunger: true
    };

    this.leftFlipper = { x: 260, y: 520, length: 70, angle: 0.35, restAngle: 0.35, activeAngle: -0.45 };
    this.rightFlipper = { x: 440, y: 520, length: 70, angle: Math.PI - 0.35, restAngle: Math.PI - 0.35, activeAngle: Math.PI + 0.45 };

    this.bumpers = [
      { x: 350, y: 180, radius: 24, color: '#ff0055', points: 250 },
      { x: 250, y: 260, radius: 22, color: '#00f0ff', points: 150 },
      { x: 450, y: 260, radius: 22, color: '#ffb700', points: 150 },
      { x: 350, y: 340, radius: 20, color: '#00ff66', points: 300 }
    ];

    this.lives = 3;
    this.multiplier = 1;
    this.plungerCharge = 0;
  }

  update(dt, input) {
    // Plunger charging
    if (this.ball.inPlunger) {
      if (input.isDown('down') || input.isDown('actionA') || input.isDown('Space')) {
        this.plungerCharge = Math.min(1.0, this.plungerCharge + dt * 1.5);
      } else if (this.plungerCharge > 0) {
        // Launch ball!
        this.ball.inPlunger = false;
        this.ball.vy = -600 - (this.plungerCharge * 400);
        this.ball.vx = -40;
        this.plungerCharge = 0;
        if (window.tunnelAudio) window.tunnelAudio.play('jump');
      }
      return;
    }

    // Flipper Controls
    const leftActive = input.isDown('left') || input.isP1Down('left');
    const rightActive = input.isDown('right') || input.isP1Down('right') || input.isDown('actionA');

    this.leftFlipper.angle += ((leftActive ? this.leftFlipper.activeAngle : this.leftFlipper.restAngle) - this.leftFlipper.angle) * 22 * dt;
    this.rightFlipper.angle += ((rightActive ? this.rightFlipper.activeAngle : this.rightFlipper.restAngle) - this.rightFlipper.angle) * 22 * dt;

    if ((input.wasPressed('left') || input.wasPressed('right')) && window.tunnelAudio) {
      window.tunnelAudio.play('move');
    }

    // Apply gravity
    this.ball.vy += 650 * dt;

    // Air friction
    this.ball.vx *= 0.995;
    this.ball.vy *= 0.995;

    this.ball.x += this.ball.vx * dt;
    this.ball.y += this.ball.vy * dt;

    // Table Boundary Collisions (Outer walls: Left 140, Right 640, Top 40)
    if (this.ball.x - this.ball.radius < 140) {
      this.ball.x = 140 + this.ball.radius;
      this.ball.vx = Math.abs(this.ball.vx) * 0.85;
      if (window.tunnelAudio) window.tunnelAudio.play('bounce');
    }
    if (this.ball.x + this.ball.radius > 640) {
      this.ball.x = 640 - this.ball.radius;
      this.ball.vx = -Math.abs(this.ball.vx) * 0.85;
      if (window.tunnelAudio) window.tunnelAudio.play('bounce');
    }
    if (this.ball.y - this.ball.radius < 40) {
      this.ball.y = 40 + this.ball.radius;
      this.ball.vy = Math.abs(this.ball.vy) * 0.85;
      if (window.tunnelAudio) window.tunnelAudio.play('bounce');
    }

    // Bumper Collisions
    this.bumpers.forEach(b => {
      const dist = Math.hypot(this.ball.x - b.x, this.ball.y - b.y);
      if (dist < this.ball.radius + b.radius) {
        // High elastic deflection
        const angle = Math.atan2(this.ball.y - b.y, this.ball.x - b.x);
        this.ball.vx = Math.cos(angle) * 480;
        this.ball.vy = Math.sin(angle) * 480;

        const pts = b.points * this.multiplier;
        this.engine.addScore(pts);
        this.engine.spawnFloatingText(`+${pts}`, b.x, b.y - 15, b.color, 18);
        this.engine.spawnExplosion(b.x, b.y, b.color, 14);
        if (window.tunnelAudio) window.tunnelAudio.play('score');
      }
    });

    // Flipper Collision Check (Left & Right)
    this.checkFlipperCollision(this.leftFlipper, leftActive);
    this.checkFlipperCollision(this.rightFlipper, rightActive);

    // Drain Check (Bottom loss)
    if (this.ball.y > 620) {
      this.lives--;
      this.engine.shake(12, 0.3);

      if (this.lives > 0) {
        if (window.tunnelAudio) window.tunnelAudio.play('gameover');
        this.resetBall();
        this.engine.spawnFloatingText(`BALLS LEFT: ${this.lives}`, 400, 300, '#ff0055', 22);
      } else {
        this.engine.gameOver('All Pinballs Drained!');
      }
    }
  }

  checkFlipperCollision(flipper, isActive) {
    const endX = flipper.x + Math.cos(flipper.angle) * flipper.length;
    const endY = flipper.y + Math.sin(flipper.angle) * flipper.length;

    // Distance to line segment
    const l2 = Math.pow(endX - flipper.x, 2) + Math.pow(endY - flipper.y, 2);
    let t = Math.max(0, Math.min(1, ((this.ball.x - flipper.x) * (endX - flipper.x) + (this.ball.y - flipper.y) * (endY - flipper.y)) / l2));
    const projX = flipper.x + t * (endX - flipper.x);
    const projY = flipper.y + t * (endY - flipper.y);

    const dist = Math.hypot(this.ball.x - projX, this.ball.y - projY);
    if (dist < this.ball.radius + 6) {
      // Deflect up
      const normalAngle = flipper.angle - Math.PI / 2;
      const kick = isActive ? 580 : 260;
      this.ball.vx += Math.cos(normalAngle) * kick * 0.8;
      this.ball.vy = -Math.abs(Math.sin(normalAngle) * kick);
      this.ball.y = projY - this.ball.radius - 2;

      this.engine.addScore(30);
      this.engine.spawnExplosion(projX, projY, '#00f0ff', 6);
      if (window.tunnelAudio) window.tunnelAudio.play('bounce');
    }
  }

  resetBall() {
    this.ball.x = 620;
    this.ball.y = 480;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.inPlunger = true;
    this.plungerCharge = 0;
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Dark table backdrop
    ctx.fillStyle = '#060812';
    ctx.fillRect(0, 0, w, h);

    // Table Frame & Lanes
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;

    // Outer Table Walls
    ctx.beginPath();
    ctx.moveTo(140, 560);
    ctx.lineTo(140, 100);
    ctx.arc(370, 100, 230, Math.PI, 0, false);
    ctx.lineTo(600, 560);
    ctx.stroke();

    // Plunger Lane Barrier
    ctx.beginPath();
    ctx.moveTo(600, 180);
    ctx.lineTo(600, 560);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Bumpers
    this.bumpers.forEach(b => {
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Flippers
    const drawFlipper = (f, color) => {
      const endX = f.x + Math.cos(f.angle) * f.length;
      const endY = f.y + Math.sin(f.angle) * f.length;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();
    };

    drawFlipper(this.leftFlipper, '#00f0ff');
    drawFlipper(this.rightFlipper, '#ff0055');

    // Plunger Spring Indicator
    if (this.ball.inPlunger) {
      ctx.fillStyle = '#ffb700';
      ctx.fillRect(612, 500 + (this.plungerCharge * 40), 16, 40);
      ctx.font = '700 9px "Press Start 2P", monospace';
      ctx.fillText('PULL', 610, 460);
    }

    // Pinball (Chrome Ball)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Lives HUD
    ctx.fillStyle = '#ff007f';
    ctx.font = '700 12px "Press Start 2P", monospace';
    ctx.fillText(`BALLS: ${this.lives}`, 20, 30);
  }

  destroy() {
    this.bumpers = [];
  }
}

window.PinballGame = PinballGame;
