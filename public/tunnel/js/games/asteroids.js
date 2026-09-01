// Tunnel Arcade - Game 8: Space Asteroids Vector
class AsteroidsGame {
  init(engine) {
    this.engine = engine;
    this.ship = {
      x: 400,
      y: 300,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      rotSpeed: 4.5,
      thrust: 320,
      radius: 12,
      alive: true
    };

    this.lasers = [];
    this.asteroids = [];
    this.lives = 3;
    this.wave = 1;
    this.isThrusting = false;

    this.spawnAsteroids(4);
  }

  spawnAsteroids(count) {
    for (let i = 0; i < count; i++) {
      let x, y;
      do {
        x = Math.random() * 800;
        y = Math.random() * 600;
      } while (Math.hypot(x - this.ship.x, y - this.ship.y) < 160);

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 60 + 30;

      this.asteroids.push(this.createAsteroid(x, y, 3, angle, speed));
    }
  }

  createAsteroid(x, y, tier, angle, speed) {
    const radius = tier === 3 ? 42 : tier === 2 ? 24 : 14;
    const numVerts = Math.floor(Math.random() * 4) + 8;
    const offsets = [];
    for (let i = 0; i < numVerts; i++) {
      offsets.push(0.75 + Math.random() * 0.5);
    }

    return {
      x,
      y,
      tier,
      radius,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: 0,
      rotSpeed: (Math.random() - 0.5) * 2,
      numVerts,
      offsets
    };
  }

  update(dt, input) {
    if (!this.ship.alive) return;

    // Rotation
    if (input.isDown('left')) {
      this.ship.angle -= this.ship.rotSpeed * dt;
    }
    if (input.isDown('right')) {
      this.ship.angle += this.ship.rotSpeed * dt;
    }

    // Thrust
    this.isThrusting = input.isDown('up');
    if (this.isThrusting) {
      this.ship.vx += Math.cos(this.ship.angle) * this.ship.thrust * dt;
      this.ship.vy += Math.sin(this.ship.angle) * this.ship.thrust * dt;
      if (Math.random() < 0.4) {
        this.engine.spawnExplosion(
          this.ship.x - Math.cos(this.ship.angle) * 14,
          this.ship.y - Math.sin(this.ship.angle) * 14,
          '#ff0055',
          2
        );
      }
    }

    // Space friction / drag
    this.ship.vx *= 0.985;
    this.ship.vy *= 0.985;

    this.ship.x += this.ship.vx * dt;
    this.ship.y += this.ship.vy * dt;

    // Wrap around screen
    this.ship.x = (this.ship.x + 800) % 800;
    this.ship.y = (this.ship.y + 600) % 600;

    // Shoot Lasers
    if (input.wasPressed('shoot') || input.wasPressed('actionA') || input.wasPressed('Space')) {
      if (this.lasers.length < 8) {
        this.lasers.push({
          x: this.ship.x + Math.cos(this.ship.angle) * 16,
          y: this.ship.y + Math.sin(this.ship.angle) * 16,
          vx: Math.cos(this.ship.angle) * 550 + this.ship.vx * 0.5,
          vy: Math.sin(this.ship.angle) * 550 + this.ship.vy * 0.5,
          life: 1.1
        });
        if (window.tunnelAudio) window.tunnelAudio.play('laser');
      }
    }

    // Hyperspace Jump (Action B)
    if (input.wasPressed('actionB') || input.wasPressed('hold')) {
      this.ship.x = Math.random() * 700 + 50;
      this.ship.y = Math.random() * 500 + 50;
      this.ship.vx = 0;
      this.ship.vy = 0;
      this.engine.spawnExplosion(this.ship.x, this.ship.y, '#cc00ff', 20);
      if (window.tunnelAudio) window.tunnelAudio.play('powerup');
    }

    // Update Lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.x += l.vx * dt;
      l.y += l.vy * dt;
      l.x = (l.x + 800) % 800;
      l.y = (l.y + 600) % 600;
      l.life -= dt;

      // Laser - Asteroid collision
      for (let aIdx = this.asteroids.length - 1; aIdx >= 0; aIdx--) {
        const a = this.asteroids[aIdx];
        if (Math.hypot(l.x - a.x, l.y - a.y) < a.radius) {
          this.splitAsteroid(aIdx);
          this.lasers.splice(i, 1);
          break;
        }
      }

      if (l.life <= 0) {
        this.lasers.splice(i, 1);
      }
    }

    // Update Asteroids
    for (let a of this.asteroids) {
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.x = (a.x + 800) % 800;
      a.y = (a.y + 600) % 600;
      a.rot += a.rotSpeed * dt;

      // Ship Collision
      if (Math.hypot(this.ship.x - a.x, this.ship.y - a.y) < this.ship.radius + a.radius) {
        this.lives--;
        this.engine.shake(16, 0.4);
        this.engine.spawnExplosion(this.ship.x, this.ship.y, '#ff0055', 40);

        if (this.lives > 0) {
          if (window.tunnelAudio) window.tunnelAudio.play('gameover');
          this.ship.x = 400;
          this.ship.y = 300;
          this.ship.vx = 0;
          this.ship.vy = 0;
          this.engine.spawnFloatingText(`LIVES LEFT: ${this.lives}`, 400, 300, '#ff0055', 24);
        } else {
          this.engine.gameOver('Ship Vaporized by Asteroid!');
          return;
        }
      }
    }

    // Wave Progression
    if (this.asteroids.length === 0) {
      this.wave++;
      this.engine.addScore(1000);
      this.engine.spawnFloatingText(`WAVE ${this.wave} INCOMING! +1000`, 400, 300, '#ffb700', 30);
      if (window.tunnelAudio) window.tunnelAudio.play('levelUp');
      this.spawnAsteroids(3 + this.wave);
    }
  }

  splitAsteroid(idx) {
    const a = this.asteroids[idx];
    this.asteroids.splice(idx, 1);

    const points = a.tier === 3 ? 50 : a.tier === 2 ? 100 : 200;
    this.engine.addScore(points);
    this.engine.spawnFloatingText(`+${points}`, a.x, a.y, '#00f0ff', 18);
    this.engine.spawnExplosion(a.x, a.y, '#00f0ff', 20);
    if (window.tunnelAudio) window.tunnelAudio.play('explosion');

    if (a.tier > 1) {
      for (let i = 0; i < 2; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 80 + 40;
        this.asteroids.push(this.createAsteroid(a.x, a.y, a.tier - 1, ang, spd));
      }
    }
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Deep space backdrop
    ctx.fillStyle = '#05060b';
    ctx.fillRect(0, 0, w, h);

    // Render Asteroids (Vector glowing wireframe)
    this.asteroids.forEach(a => {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rot);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      for (let i = 0; i < a.numVerts; i++) {
        const ang = (i / a.numVerts) * Math.PI * 2;
        const rad = a.radius * a.offsets[i];
        const px = Math.cos(ang) * rad;
        const py = Math.sin(ang) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });

    // Render Lasers
    this.lasers.forEach(l => {
      ctx.save();
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(l.x, l.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Render Player Ship
    if (this.ship.alive) {
      ctx.save();
      ctx.translate(this.ship.x, this.ship.y);
      ctx.rotate(this.ship.angle);

      ctx.strokeStyle = '#ffffff';
      ctx.fillStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-14, 11);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-14, -11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Thruster flame
      if (this.isThrusting) {
        ctx.strokeStyle = '#ff0055';
        ctx.shadowColor = '#ff0055';
        ctx.beginPath();
        ctx.moveTo(-10, -5);
        ctx.lineTo(-22 - Math.random() * 8, 0);
        ctx.lineTo(-10, 5);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Lives & Wave HUD (Retro Arcade Vector Style)
    ctx.fillStyle = '#ff007f';
    ctx.font = '700 13px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SHIPS: ${this.lives}`, 24, 35);

    for (let i = 0; i < this.lives; i++) {
      ctx.save();
      ctx.translate(30 + i * 20, 52);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(6, 6);
      ctx.lineTo(0, 3);
      ctx.lineTo(-6, 6);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    ctx.textAlign = 'right';
    ctx.fillText(`SECTOR: ${this.wave}`, 780, 35);
  }

  destroy() {
    this.lasers = [];
    this.asteroids = [];
  }
}

window.AsteroidsGame = AsteroidsGame;
