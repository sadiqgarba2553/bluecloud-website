// Tunnel Arcade - Game 13: Cyber Galaga / Space Wing
class GalagaGame {
  init(engine) {
    this.engine = engine;
    this.playerX = 380;
    this.playerY = 540;
    this.playerSpeed = 420;
    this.hasDualShip = false;
    this.lives = 3;

    this.lasers = [];
    this.aliens = [];
    this.alienLasers = [];
    this.stars = [];

    this.initStars();
    this.spawnFormation();
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 45; i++) {
      this.stars.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        speed: Math.random() * 120 + 40,
        size: Math.random() * 1.5 + 1
      });
    }
  }

  spawnFormation() {
    this.aliens = [];
    const rows = 4;
    const cols = 10;
    const types = ['BOSS', 'BUTTERFLY', 'BEE', 'BEE'];
    const colors = ['#00f0ff', '#ff0055', '#ffb700', '#ffb700'];
    const points = [150, 100, 50, 50];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.aliens.push({
          homeX: 110 + c * 60,
          homeY: 70 + r * 45,
          x: 110 + c * 60,
          y: 70 + r * 45,
          type: types[r],
          color: colors[r],
          points: points[r],
          alive: true,
          hp: types[r] === 'BOSS' ? 2 : 1,
          isDiving: false,
          diveAngle: 0,
          diveSpeed: 200,
          diveTimer: Math.random() * 8 + 2
        });
      }
    }
  }

  update(dt, input) {
    // Update Warp Stars
    this.stars.forEach(s => {
      s.y += s.speed * dt;
      if (s.y > 600) {
        s.y = 0;
        s.x = Math.random() * 800;
      }
    });

    // Player Movement
    if (input.isDown('left')) {
      this.playerX -= this.playerSpeed * dt;
    }
    if (input.isDown('right')) {
      this.playerX += this.playerSpeed * dt;
    }
    const width = this.hasDualShip ? 48 : 28;
    this.playerX = Math.max(20, Math.min(800 - width - 20, this.playerX));

    // Player Shooting
    if (input.wasPressed('shoot') || input.wasPressed('actionA') || input.wasPressed('Space')) {
      if (this.lasers.length < 6) {
        if (this.hasDualShip) {
          this.lasers.push({ x: this.playerX + 6, y: this.playerY - 4, vy: -750 });
          this.lasers.push({ x: this.playerX + width - 6, y: this.playerY - 4, vy: -750 });
        } else {
          this.lasers.push({ x: this.playerX + width / 2, y: this.playerY - 4, vy: -750 });
        }
        if (window.tunnelAudio) window.tunnelAudio.play('laser');
      }
    }

    // Update Lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.y += l.vy * dt;

      // Alien Hit Check
      for (let a of this.aliens) {
        if (a.alive && Math.hypot(l.x - a.x, l.y - a.y) < 18) {
          a.hp--;
          this.lasers.splice(i, 1);

          if (a.hp <= 0) {
            a.alive = false;
            const pts = a.isDiving ? a.points * 2 : a.points;
            this.engine.addScore(pts);
            this.engine.spawnFloatingText(`+${pts}`, a.x, a.y, a.color, 16);
            this.engine.spawnExplosion(a.x, a.y, a.color, 16);
            if (window.tunnelAudio) window.tunnelAudio.play('explosion');
          } else {
            if (window.tunnelAudio) window.tunnelAudio.play('hit');
          }
          break;
        }
      }

      if (l.y < 20) {
        this.lasers.splice(i, 1);
      }
    }

    // Update Aliens Formation & Diving Runs
    const time = performance.now() * 0.002;
    this.aliens.forEach(a => {
      if (!a.alive) return;

      if (!a.isDiving) {
        // Floating formation sway
        a.x = a.homeX + Math.sin(time + a.homeY) * 20;
        a.y = a.homeY + Math.cos(time) * 6;

        a.diveTimer -= dt;
        if (a.diveTimer <= 0) {
          a.isDiving = true;
          a.diveAngle = Math.atan2(this.playerY - a.y, this.playerX - a.x);
          a.diveSpeed = Math.random() * 120 + 200;
        }
      } else {
        // Diving loop maneuver
        a.x += Math.cos(a.diveAngle) * a.diveSpeed * dt;
        a.y += Math.sin(a.diveAngle) * a.diveSpeed * dt;

        // Occasional bomb drop
        if (Math.random() < 0.015 && this.alienLasers.length < 8) {
          this.alienLasers.push({ x: a.x, y: a.y, vy: 340 });
        }

        // Return to formation if offscreen
        if (a.y > 620) {
          a.y = -20;
          a.x = a.homeX;
          a.isDiving = false;
          a.diveTimer = Math.random() * 8 + 3;
        }

        // Player Collision
        if (Math.hypot(a.x - (this.playerX + width / 2), a.y - (this.playerY + 10)) < 22) {
          a.alive = false;
          this.hitPlayer();
        }
      }
    });

    // Update Alien Lasers
    for (let i = this.alienLasers.length - 1; i >= 0; i--) {
      const al = this.alienLasers[i];
      al.y += al.vy * dt;

      if (al.x >= this.playerX && al.x <= this.playerX + width &&
          al.y >= this.playerY && al.y <= this.playerY + 20) {
        this.alienLasers.splice(i, 1);
        this.hitPlayer();
        continue;
      }

      if (al.y > 600) {
        this.alienLasers.splice(i, 1);
      }
    }

    // Wave Cleared Check
    if (this.aliens.every(a => !a.alive)) {
      this.engine.addScore(2500);
      this.engine.spawnFloatingText('FLEET CLEARED! +2500', 400, 300, '#ffb700', 30);
      if (window.tunnelAudio) window.tunnelAudio.play('levelUp');
      this.spawnFormation();
    }
  }

  hitPlayer() {
    this.engine.shake(16, 0.4);
    this.engine.spawnExplosion(this.playerX + 15, this.playerY + 10, '#ff0055', 35);

    if (this.hasDualShip) {
      this.hasDualShip = false;
      this.engine.spawnFloatingText('DUAL SHIP DAMAGED!', 400, 300, '#ff0055', 20);
      if (window.tunnelAudio) window.tunnelAudio.play('hit');
      return;
    }

    this.lives--;
    if (this.lives > 0) {
      this.playerX = 380;
      this.engine.spawnFloatingText(`FIGHTERS: ${this.lives}`, 400, 300, '#ff0055', 22);
      if (window.tunnelAudio) window.tunnelAudio.play('gameover');
    } else {
      this.engine.gameOver('Fleet Destroyed by Galaga Swarm!');
    }
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Deep space backdrop
    ctx.fillStyle = '#05060d';
    ctx.fillRect(0, 0, w, h);

    // Stars
    ctx.fillStyle = '#ffffff';
    this.stars.forEach(s => {
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    // Aliens
    this.aliens.forEach(a => {
      if (!a.alive) return;
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.fillStyle = a.color;
      ctx.shadowColor = a.color;
      ctx.shadowBlur = 8;

      if (a.type === 'BOSS') {
        // Boss Galaga shape
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(12, 0);
        ctx.lineTo(8, 12);
        ctx.lineTo(-8, 12);
        ctx.lineTo(-12, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, -4, 6, 6);
      } else {
        // Winged insect shape
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-12, -4, 4, 10);
        ctx.fillRect(8, -4, 4, 10);
      }
      ctx.restore();
    });

    // Lasers
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    this.lasers.forEach(l => {
      ctx.fillRect(l.x - 1.5, l.y, 3, 14);
    });

    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    this.alienLasers.forEach(al => {
      ctx.fillRect(al.x - 1.5, al.y, 3, 10);
    });

    // Player Ship (Vector Fighter)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;

    const drawSingleFighter = (x, y) => {
      ctx.beginPath();
      ctx.moveTo(x + 12, y);
      ctx.lineTo(x + 24, y + 20);
      ctx.lineTo(x + 12, y + 14);
      ctx.lineTo(x, y + 20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    if (this.hasDualShip) {
      drawSingleFighter(this.playerX, this.playerY);
      drawSingleFighter(this.playerX + 24, this.playerY);
    } else {
      drawSingleFighter(this.playerX, this.playerY);
    }
    ctx.restore();

    // Lives HUD
    ctx.fillStyle = '#ff007f';
    ctx.font = '700 12px "Press Start 2P", monospace';
    ctx.fillText(`FIGHTERS: ${this.lives}`, 20, 30);
  }

  destroy() {
    this.aliens = [];
    this.lasers = [];
    this.alienLasers = [];
  }
}

window.GalagaGame = GalagaGame;
