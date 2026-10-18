// Tunnel Arcade - Game 6: Neon Breakout / Brick Buster
class BrickBreakerGame {
  init(engine) {
    this.engine = engine;
    this.paddleWidth = 110;
    this.paddleHeight = 14;
    this.paddleX = (800 - this.paddleWidth) / 2;
    this.paddleY = 540;
    this.paddleSpeed = 650;

    this.balls = [
      { x: 400, y: 500, vx: 260, vy: -360, radius: 7 }
    ];

    this.bricks = [];
    this.brickRows = 6;
    this.brickCols = 10;
    this.brickWidth = 68;
    this.brickHeight = 22;
    this.brickPadding = 8;
    this.brickOffsetTop = 60;
    this.brickOffsetLeft = 24;

    this.powerups = [];
    this.lasers = [];
    this.laserActiveTimer = 0;
    this.lives = 3;

    this.initBricks();
  }

  initBricks() {
    this.bricks = [];
    const colors = ['#ff0055', '#ff007f', '#cc00ff', '#7000ff', '#00f0ff', '#00ff66'];
    const points = [60, 50, 40, 30, 20, 10];

    for (let r = 0; r < this.brickRows; r++) {
      for (let c = 0; c < this.brickCols; c++) {
        const x = this.brickOffsetLeft + c * (this.brickWidth + this.brickPadding);
        const y = this.brickOffsetTop + r * (this.brickHeight + this.brickPadding);
        const isExplosive = Math.random() < 0.08;
        const hp = r === 0 ? 2 : 1;

        this.bricks.push({
          x,
          y,
          r,
          c,
          hp,
          maxHp: hp,
          color: colors[r],
          points: points[r],
          isExplosive,
          alive: true
        });
      }
    }
  }

  update(dt, input) {
    // Paddle movement
    if (input.isDown('left')) {
      this.paddleX -= this.paddleSpeed * dt;
    }
    if (input.isDown('right')) {
      this.paddleX += this.paddleSpeed * dt;
    }
    this.paddleX = Math.max(10, Math.min(800 - this.paddleWidth - 10, this.paddleX));

    // Laser Cannon firing
    if (this.laserActiveTimer > 0) {
      this.laserActiveTimer -= dt;
      if (input.wasPressed('actionA') || input.wasPressed('shoot') || input.wasPressed('up')) {
        this.lasers.push({ x: this.paddleX + 10, y: this.paddleY, vy: -600 });
        this.lasers.push({ x: this.paddleX + this.paddleWidth - 10, y: this.paddleY, vy: -600 });
        if (window.tunnelAudio) window.tunnelAudio.play('laser');
      }
    }

    // Update Lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.y += l.vy * dt;

      // Laser brick collision
      for (let b of this.bricks) {
        if (b.alive && l.x >= b.x && l.x <= b.x + this.brickWidth && l.y >= b.y && l.y <= b.y + this.brickHeight) {
          this.hitBrick(b);
          this.lasers.splice(i, 1);
          break;
        }
      }

      if (l.y < 0) {
        this.lasers.splice(i, 1);
      }
    }

    // Update Falling Powerups
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.y += 180 * dt;

      // Paddle catch
      if (
        p.y >= this.paddleY &&
        p.y <= this.paddleY + this.paddleHeight &&
        p.x >= this.paddleX &&
        p.x <= this.paddleX + this.paddleWidth
      ) {
        this.applyPowerup(p.type);
        this.powerups.splice(i, 1);
        continue;
      }

      if (p.y > 600) {
        this.powerups.splice(i, 1);
      }
    }

    // Update Balls
    for (let bIdx = this.balls.length - 1; bIdx >= 0; bIdx--) {
      const b = this.balls[bIdx];
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Wall bounds
      if (b.x - b.radius <= 0) {
        b.x = b.radius;
        b.vx = Math.abs(b.vx);
        if (window.tunnelAudio) window.tunnelAudio.play('bounce');
      } else if (b.x + b.radius >= 800) {
        b.x = 800 - b.radius;
        b.vx = -Math.abs(b.vx);
        if (window.tunnelAudio) window.tunnelAudio.play('bounce');
      }

      if (b.y - b.radius <= 0) {
        b.y = b.radius;
        b.vy = Math.abs(b.vy);
        if (window.tunnelAudio) window.tunnelAudio.play('bounce');
      }

      // Paddle Collision
      if (
        b.y + b.radius >= this.paddleY &&
        b.y - b.radius <= this.paddleY + this.paddleHeight &&
        b.x >= this.paddleX &&
        b.x <= this.paddleX + this.paddleWidth
      ) {
        b.y = this.paddleY - b.radius;
        // Calculate deflection angle based on hit position relative to center
        const hitOffset = (b.x - (this.paddleX + this.paddleWidth / 2)) / (this.paddleWidth / 2);
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy) * 1.01;
        b.vx = hitOffset * speed * 0.85;
        b.vy = -Math.sqrt(Math.max(10000, speed * speed - b.vx * b.vx));

        this.engine.spawnExplosion(b.x, b.y, '#00f0ff', 6);
        if (window.tunnelAudio) window.tunnelAudio.play('bounce');
      }

      // Brick Collisions
      for (let br of this.bricks) {
        if (!br.alive) continue;

        if (
          b.x + b.radius > br.x &&
          b.x - b.radius < br.x + this.brickWidth &&
          b.y + b.radius > br.y &&
          b.y - b.radius < br.y + this.brickHeight
        ) {
          // Determine collision face
          const prevX = b.x - b.vx * dt;
          if (prevX + b.radius <= br.x || prevX - b.radius >= br.x + this.brickWidth) {
            b.vx = -b.vx;
          } else {
            b.vy = -b.vy;
          }

          this.hitBrick(br);
          break;
        }
      }

      // Bottom death
      if (b.y - b.radius > 600) {
        this.balls.splice(bIdx, 1);
      }
    }

    // Check life loss
    if (this.balls.length === 0) {
      this.lives--;
      if (this.lives > 0) {
        this.engine.shake(10, 0.2);
        this.engine.spawnFloatingText(`LIVES LEFT: ${this.lives}`, 400, 300, '#ff0055', 24);
        if (window.tunnelAudio) window.tunnelAudio.play('gameover');
        this.balls.push({
          x: this.paddleX + this.paddleWidth / 2,
          y: 500,
          vx: 260 * (Math.random() > 0.5 ? 1 : -1),
          vy: -360,
          radius: 7
        });
      } else {
        this.engine.gameOver('All Balls Lost!');
      }
    }

    // Check Level Clear
    const remaining = this.bricks.filter(b => b.alive).length;
    if (remaining === 0) {
      this.engine.addScore(1500);
      this.engine.spawnFloatingText('STAGE CLEARED! +1500', 400, 300, '#ffb700', 32);
      if (window.tunnelAudio) window.tunnelAudio.play('levelUp');
      this.initBricks();
      this.balls.forEach(b => {
        b.vx *= 1.1;
        b.vy *= 1.1;
      });
    }
  }

  hitBrick(br) {
    br.hp--;
    if (br.hp <= 0) {
      br.alive = false;
      this.engine.addScore(br.points);
      this.engine.spawnFloatingText(`+${br.points}`, br.x + this.brickWidth / 2, br.y, br.color, 18);
      this.engine.spawnExplosion(br.x + this.brickWidth / 2, br.y + this.brickHeight / 2, br.color, 16);
      if (window.tunnelAudio) window.tunnelAudio.play('hit');

      // Explosive brick chain reaction
      if (br.isExplosive) {
        this.engine.shake(12, 0.25);
        this.bricks.forEach(other => {
          if (other.alive && Math.hypot(other.x - br.x, other.y - br.y) < 100) {
            this.hitBrick(other);
          }
        });
      }

      // Random Powerup drop (20% chance)
      if (Math.random() < 0.22) {
        const types = ['MULTIBALL', 'LASER', 'EXPAND', 'LIFE'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.powerups.push({
          x: br.x + this.brickWidth / 2,
          y: br.y,
          type,
          color: type === 'MULTIBALL' ? '#ffb700' : type === 'LASER' ? '#ff0055' : type === 'EXPAND' ? '#00f0ff' : '#00ff66'
        });
      }
    } else {
      if (window.tunnelAudio) window.tunnelAudio.play('bounce');
    }
  }

  applyPowerup(type) {
    if (window.tunnelAudio) window.tunnelAudio.play('powerup');
    if (type === 'MULTIBALL') {
      const newBalls = [];
      this.balls.forEach(b => {
        newBalls.push({ x: b.x, y: b.y, vx: b.vx * 0.8 - 150, vy: b.vy, radius: b.radius });
        newBalls.push({ x: b.x, y: b.y, vx: b.vx * 0.8 + 150, vy: b.vy, radius: b.radius });
      });
      this.balls.push(...newBalls);
      this.engine.spawnFloatingText('MULTI-BALL ACTIVATED!', 400, 300, '#ffb700', 22);
    } else if (type === 'LASER') {
      this.laserActiveTimer = 10;
      this.engine.spawnFloatingText('LASER CANNONS (10s)!', 400, 300, '#ff0055', 22);
    } else if (type === 'EXPAND') {
      this.paddleWidth = Math.min(220, this.paddleWidth + 40);
      this.engine.spawnFloatingText('WIDE PADDLE!', 400, 300, '#00f0ff', 22);
    } else if (type === 'LIFE') {
      this.lives++;
      this.engine.spawnFloatingText('+1 LIFE', 400, 300, '#00ff66', 22);
    }
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Dark grid backdrop
    ctx.fillStyle = '#06070d';
    ctx.fillRect(0, 0, w, h);

    // Bricks
    this.bricks.forEach(b => {
      if (!b.alive) return;
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = b.isExplosive ? 14 : 6;
      ctx.fillRect(b.x, b.y, this.brickWidth, this.brickHeight);

      if (b.isExplosive) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(b.x + 2, b.y + 2, this.brickWidth - 4, this.brickHeight - 4);
      }
      ctx.restore();
    });

    // Lasers
    this.lasers.forEach(l => {
      ctx.save();
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 10;
      ctx.fillRect(l.x - 2, l.y, 4, 16);
      ctx.restore();
    });

    // Powerups
    this.powerups.forEach(p => {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.fillRect(p.x - 14, p.y - 8, 28, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 9px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.type.substring(0, 4), p.x, p.y + 4);
      ctx.restore();
    });

    // Paddle
    ctx.save();
    ctx.fillStyle = this.laserActiveTimer > 0 ? '#ff0055' : '#00f0ff';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(this.paddleX, this.paddleY, this.paddleWidth, this.paddleHeight, 6);
    ctx.fill();

    // Laser guns on edges if active
    if (this.laserActiveTimer > 0) {
      ctx.fillStyle = '#ffb700';
      ctx.fillRect(this.paddleX + 6, this.paddleY - 8, 6, 8);
      ctx.fillRect(this.paddleX + this.paddleWidth - 12, this.paddleY - 8, 6, 8);
    }
    ctx.restore();

    // Balls
    this.balls.forEach(b => {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Lives HUD (Retro Arcade Vector Style)
    ctx.fillStyle = '#ff007f';
    ctx.font = '700 14px "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`LIVES: ${this.lives}`, 780, 35);

    for (let i = 0; i < this.lives; i++) {
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(780 - (this.lives - i) * 22, 45, 16, 4);
    }
  }

  destroy() {
    this.bricks = [];
    this.balls = [];
    this.powerups = [];
    this.lasers = [];
  }
}

window.BrickBreakerGame = BrickBreakerGame;
