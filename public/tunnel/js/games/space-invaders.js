// Tunnel Arcade - Game 9: Alien Assault (Space Invaders)
class SpaceInvadersGame {
  init(engine) {
    this.engine = engine;
    this.playerX = 380;
    this.playerY = 540;
    this.playerWidth = 32;
    this.playerHeight = 16;
    this.playerSpeed = 380;
    this.playerLaser = null;

    this.lives = 3;
    this.alienRows = 5;
    this.alienCols = 10;
    this.alienWidth = 28;
    this.alienHeight = 20;
    this.aliens = [];

    this.alienDir = 1;
    this.alienStepTimer = 0;
    this.alienStepInterval = 0.65;
    this.alienDropDistance = 16;
    this.alienLasers = [];

    this.ufo = null;
    this.ufoTimer = 0;

    this.bunkers = [];
    this.initAliens();
    this.initBunkers();
  }

  initAliens() {
    this.aliens = [];
    const colors = ['#ff0055', '#ff007f', '#cc00ff', '#00f0ff', '#00ff66'];
    const points = [40, 30, 20, 10, 10];

    for (let r = 0; r < this.alienRows; r++) {
      for (let c = 0; c < this.alienCols; c++) {
        this.aliens.push({
          x: 100 + c * 55,
          y: 70 + r * 40,
          row: r,
          col: c,
          color: colors[r],
          points: points[r],
          alive: true
        });
      }
    }
  }

  initBunkers() {
    this.bunkers = [];
    for (let i = 0; i < 4; i++) {
      const startX = 110 + i * 165;
      const startY = 460;
      const blocks = [];

      for (let bx = 0; bx < 8; bx++) {
        for (let by = 0; by < 5; by++) {
          // Arch notch cutout
          if (by >= 3 && (bx >= 2 && bx <= 5)) continue;
          blocks.push({
            x: startX + bx * 6,
            y: startY + by * 6,
            w: 6,
            h: 6,
            alive: true
          });
        }
      }
      this.bunkers.push({ blocks });
    }
  }

  update(dt, input) {
    // Player controls
    if (input.isDown('left')) {
      this.playerX -= this.playerSpeed * dt;
    }
    if (input.isDown('right')) {
      this.playerX += this.playerSpeed * dt;
    }
    this.playerX = Math.max(20, Math.min(800 - this.playerWidth - 20, this.playerX));

    // Player shoot
    if ((input.wasPressed('shoot') || input.wasPressed('actionA') || input.wasPressed('Space')) && !this.playerLaser) {
      this.playerLaser = {
        x: this.playerX + this.playerWidth / 2,
        y: this.playerY - 6,
        vy: -700
      };
      if (window.tunnelAudio) window.tunnelAudio.play('laser');
    }

    // Update Player Laser
    if (this.playerLaser) {
      this.playerLaser.y += this.playerLaser.vy * dt;

      // Alien hit check
      for (let a of this.aliens) {
        if (a.alive &&
            this.playerLaser.x >= a.x && this.playerLaser.x <= a.x + this.alienWidth &&
            this.playerLaser.y >= a.y && this.playerLaser.y <= a.y + this.alienHeight) {
          a.alive = false;
          this.engine.addScore(a.points);
          this.engine.spawnFloatingText(`+${a.points}`, a.x, a.y, a.color, 16);
          this.engine.spawnExplosion(a.x + this.alienWidth / 2, a.y + this.alienHeight / 2, a.color, 15);
          if (window.tunnelAudio) window.tunnelAudio.play('explosion');
          this.playerLaser = null;

          // Speed up remaining aliens
          const livingCount = this.aliens.filter(al => al.alive).length;
          this.alienStepInterval = Math.max(0.08, 0.65 * (livingCount / (this.alienRows * this.alienCols)));
          break;
        }
      }

      // UFO hit check
      if (this.playerLaser && this.ufo &&
          this.playerLaser.x >= this.ufo.x && this.playerLaser.x <= this.ufo.x + 40 &&
          this.playerLaser.y >= this.ufo.y && this.playerLaser.y <= this.ufo.y + 16) {
        const bonus = [50, 100, 150, 300][Math.floor(Math.random() * 4)];
        this.engine.addScore(bonus);
        this.engine.spawnFloatingText(`MYSTERY +${bonus}!`, this.ufo.x, this.ufo.y, '#ffb700', 22);
        this.engine.spawnExplosion(this.ufo.x + 20, this.ufo.y + 8, '#ff0055', 25);
        if (window.tunnelAudio) window.tunnelAudio.play('powerup');
        this.ufo = null;
        this.playerLaser = null;
      }

      // Bunker hit check
      if (this.playerLaser) {
        for (let b of this.bunkers) {
          for (let blk of b.blocks) {
            if (blk.alive &&
                this.playerLaser.x >= blk.x && this.playerLaser.x <= blk.x + blk.w &&
                this.playerLaser.y >= blk.y && this.playerLaser.y <= blk.y + blk.h) {
              blk.alive = false;
              this.playerLaser = null;
              break;
            }
          }
          if (!this.playerLaser) break;
        }
      }

      if (this.playerLaser && this.playerLaser.y < 30) {
        this.playerLaser = null;
      }
    }

    // March Aliens
    this.alienStepTimer += dt;
    if (this.alienStepTimer >= this.alienStepInterval) {
      this.alienStepTimer = 0;
      let hitEdge = false;
      const living = this.aliens.filter(a => a.alive);

      living.forEach(a => {
        if ((this.alienDir > 0 && a.x + this.alienWidth >= 770) ||
            (this.alienDir < 0 && a.x <= 30)) {
          hitEdge = true;
        }
      });

      if (hitEdge) {
        this.alienDir = -this.alienDir;
        living.forEach(a => {
          a.y += this.alienDropDistance;
          if (a.y + this.alienHeight >= this.playerY) {
            this.engine.gameOver('Alien Invasion Complete!');
          }
        });
      } else {
        living.forEach(a => {
          a.x += this.alienDir * 14;
        });
      }

      // Alien laser fire
      if (Math.random() < 0.65 && living.length > 0) {
        const shooter = living[Math.floor(Math.random() * living.length)];
        this.alienLasers.push({
          x: shooter.x + this.alienWidth / 2,
          y: shooter.y + this.alienHeight,
          vy: 320
        });
      }
    }

    // Update Alien Lasers
    for (let i = this.alienLasers.length - 1; i >= 0; i--) {
      const l = this.alienLasers[i];
      l.y += l.vy * dt;

      // Hit Player
      if (l.x >= this.playerX && l.x <= this.playerX + this.playerWidth &&
          l.y >= this.playerY && l.y <= this.playerY + this.playerHeight) {
        this.lives--;
        this.engine.shake(15, 0.35);
        this.engine.spawnExplosion(this.playerX + this.playerWidth / 2, this.playerY + 8, '#ff0055', 30);
        this.alienLasers.splice(i, 1);

        if (this.lives > 0) {
          if (window.tunnelAudio) window.tunnelAudio.play('gameover');
          this.playerX = 380;
          this.engine.spawnFloatingText(`CANNONS: ${this.lives}`, 400, 300, '#ff0055', 22);
        } else {
          this.engine.gameOver('Defense Turret Destroyed!');
          return;
        }
        continue;
      }

      // Hit Bunkers
      for (let b of this.bunkers) {
        for (let blk of b.blocks) {
          if (blk.alive &&
              l.x >= blk.x && l.x <= blk.x + blk.w &&
              l.y >= blk.y && l.y <= blk.y + blk.h) {
            blk.alive = false;
            this.alienLasers.splice(i, 1);
            break;
          }
        }
      }

      if (l.y > 600) {
        this.alienLasers.splice(i, 1);
      }
    }

    // Update Mystery UFO
    this.ufoTimer += dt;
    if (this.ufoTimer > 18 && !this.ufo) {
      this.ufoTimer = 0;
      this.ufo = { x: -50, y: 40, vx: 160 };
      if (window.tunnelAudio) window.tunnelAudio.play('rotate');
    }
    if (this.ufo) {
      this.ufo.x += this.ufo.vx * dt;
      if (this.ufo.x > 850) this.ufo = null;
    }

    // Check Wave Cleared
    if (this.aliens.every(a => !a.alive)) {
      this.engine.addScore(1500);
      this.engine.spawnFloatingText('WAVE CLEARED! +1500', 400, 300, '#ffb700', 28);
      if (window.tunnelAudio) window.tunnelAudio.play('levelUp');
      this.initAliens();
      this.alienStepInterval = Math.max(0.3, 0.65 - (this.engine.level * 0.05));
    }
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Dark canvas
    ctx.fillStyle = '#05060c';
    ctx.fillRect(0, 0, w, h);

    // Render Bunkers
    this.bunkers.forEach(b => {
      ctx.fillStyle = '#00ff66';
      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = 4;
      b.blocks.forEach(blk => {
        if (blk.alive) {
          ctx.fillRect(blk.x, blk.y, blk.w, blk.h);
        }
      });
      ctx.shadowBlur = 0;
    });

    // Render Aliens (Authentic Vector Pixel Glyph Art)
    this.aliens.forEach(a => {
      if (!a.alive) return;
      ctx.save();
      ctx.fillStyle = a.color;
      ctx.shadowColor = a.color;
      ctx.shadowBlur = 8;
      
      // Draw pixel alien
      const cx = a.x + a.alienWidth / 2;
      const cy = a.y + a.alienHeight / 2;
      ctx.fillRect(a.x + 6, a.y, 16, 4);
      ctx.fillRect(a.x + 2, a.y + 4, 24, 8);
      ctx.fillRect(a.x, a.y + 12, 6, 8);
      ctx.fillRect(a.x + 22, a.y + 12, 6, 8);
      ctx.fillRect(a.x + 8, a.y + 8, 12, 6);
      
      // Eyes
      ctx.fillStyle = '#05060c';
      ctx.fillRect(a.x + 6, a.y + 6, 3, 3);
      ctx.fillRect(a.x + 19, a.y + 6, 3, 3);
      ctx.restore();
    });

    // Render UFO
    if (this.ufo) {
      ctx.save();
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(this.ufo.x + 20, this.ufo.y + 8, 20, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.ufo.x + 14, this.ufo.y + 2, 12, 4);
      ctx.restore();
    }

    // Render Player Turret
    ctx.save();
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(this.playerX, this.playerY + 8, this.playerWidth, 8);
    ctx.fillRect(this.playerX + 8, this.playerY + 4, 16, 4);
    ctx.fillRect(this.playerX + 14, this.playerY - 2, 4, 6);
    ctx.restore();

    // Render Lasers
    if (this.playerLaser) {
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.fillRect(this.playerLaser.x - 1.5, this.playerLaser.y, 3, 14);
    }

    this.alienLasers.forEach(l => {
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 8;
      ctx.fillRect(l.x - 1.5, l.y, 3, 12);
    });

    // Lives HUD
    ctx.fillStyle = '#ff007f';
    ctx.font = '700 12px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`TURRETS: ${this.lives}`, 20, 30);
  }

  destroy() {
    this.aliens = [];
    this.bunkers = [];
    this.alienLasers = [];
  }
}

window.SpaceInvadersGame = SpaceInvadersGame;
