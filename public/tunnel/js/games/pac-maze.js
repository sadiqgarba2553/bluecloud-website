// Tunnel Arcade - Game 10: Cyber Maze (Pac-Runner)
class PacMazeGame {
  init(engine) {
    this.engine = engine;
    this.tileSize = 20;
    this.cols = 28;
    this.rows = 28;
    this.startX = (800 - this.cols * this.tileSize) / 2;
    this.startY = (600 - this.rows * this.tileSize) / 2;

    // 0 = Pellet, 1 = Wall, 2 = Power Orb, 3 = Empty/Path, 4 = Ghost Gate
    this.mapLayout = [
      "1111111111111111111111111111",
      "1200000000000110000000000021",
      "1011110111110110111110111101",
      "1011110111110110111110111101",
      "1000000000000000000000000001",
      "1011110110111111110110111101",
      "1000000110000110000110000001",
      "1111110111113113111110111111",
      "3333310113333333333110133333",
      "1111110113111441113110111111",
      "3333330333133333313330333333",
      "1111110113111111113110111111",
      "3333310113333333333110133333",
      "1111110113111111113110111111",
      "1000000000000110000000000001",
      "1011110111110110111110111101",
      "1200110000000330000000110021",
      "1110110110111111110110110111",
      "1000000110000110000110000001",
      "1011111111110110111111111101",
      "1000000000000000000000000001",
      "1111111111111111111111111111"
    ];

    this.rows = this.mapLayout.length;
    this.grid = [];
    this.pelletsRemaining = 0;
    this.initGrid();

    // Player (Cyber Runner)
    this.player = {
      x: 13.5,
      y: 16,
      dir: { x: 0, y: 0 },
      nextDir: { x: 0, y: 0 },
      speed: 5.5,
      angle: 0,
      mouth: 0.2,
      mouthDir: 1
    };

    // Ghosts
    this.ghosts = [
      { x: 13, y: 10, color: '#ff0055', name: 'RED', dir: { x: 1, y: 0 }, frightened: false },
      { x: 14, y: 10, color: '#00f0ff', name: 'CYAN', dir: { x: -1, y: 0 }, frightened: false },
      { x: 13, y: 11, color: '#ff007f', name: 'PINK', dir: { x: 0, y: -1 }, frightened: false },
      { x: 14, y: 11, color: '#ffb700', name: 'ORANGE', dir: { x: 0, y: 1 }, frightened: false }
    ];

    this.frightenedTimer = 0;
    this.lives = 3;
  }

  initGrid() {
    this.grid = [];
    this.pelletsRemaining = 0;
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        const char = this.mapLayout[r][c] || '1';
        const cell = parseInt(char, 10);
        this.grid[r][c] = cell;
        if (cell === 0 || cell === 2) {
          this.pelletsRemaining++;
        }
      }
    }
  }

  update(dt, input) {
    // Player Input
    if (input.isDown('left')) this.player.nextDir = { x: -1, y: 0 };
    else if (input.isDown('right')) this.player.nextDir = { x: 1, y: 0 };
    else if (input.isDown('up')) this.player.nextDir = { x: 0, y: -1 };
    else if (input.isDown('down')) this.player.nextDir = { x: 0, y: 1 };

    // Frightened Timer
    if (this.frightenedTimer > 0) {
      this.frightenedTimer -= dt;
      if (this.frightenedTimer <= 0) {
        this.ghosts.forEach(g => g.frightened = false);
      }
    }

    // Try changing direction if aligned to tile
    const px = this.player.x;
    const py = this.player.y;
    const nearGridX = Math.round(px);
    const nearGridY = Math.round(py);

    if (Math.abs(px - nearGridX) < 0.15 && Math.abs(py - nearGridY) < 0.15) {
      // Check if nextDir is clear
      const targetX = nearGridX + this.player.nextDir.x;
      const targetY = nearGridY + this.player.nextDir.y;
      if (!this.isWall(targetX, targetY)) {
        this.player.dir = { ...this.player.nextDir };
        this.player.x = nearGridX;
        this.player.y = nearGridY;
      }
    }

    // Move player
    const nextX = this.player.x + this.player.dir.x * this.player.speed * dt;
    const nextY = this.player.y + this.player.dir.y * this.player.speed * dt;

    if (!this.isWall(Math.floor(nextX + (this.player.dir.x > 0 ? 0.45 : -0.45)), Math.floor(nextY + (this.player.dir.y > 0 ? 0.45 : -0.45)))) {
      this.player.x = nextX;
      this.player.y = nextY;
    }

    // Tunnel wrap
    if (this.player.x < 0) this.player.x = this.cols - 1;
    else if (this.player.x >= this.cols) this.player.x = 0;

    // Mouth animation
    this.player.mouth += this.player.mouthDir * dt * 4;
    if (this.player.mouth > 0.35 || this.player.mouth < 0.05) {
      this.player.mouthDir *= -1;
    }

    // Eat pellets
    const curR = Math.floor(this.player.y + 0.5);
    const curC = Math.floor(this.player.x + 0.5);
    if (curR >= 0 && curR < this.rows && curC >= 0 && curC < this.cols) {
      const item = this.grid[curR][curC];
      if (item === 0) {
        // Normal pellet
        this.grid[curR][curC] = 3;
        this.engine.addScore(10);
        this.pelletsRemaining--;
        if (window.tunnelAudio) window.tunnelAudio.play('move');
      } else if (item === 2) {
        // Power energizer
        this.grid[curR][curC] = 3;
        this.engine.addScore(50);
        this.pelletsRemaining--;
        this.frightenedTimer = 8;
        this.ghosts.forEach(g => g.frightened = true);
        this.engine.spawnFloatingText('POWER SURGE (8s)', 400, 200, '#00f0ff', 24);
        if (window.tunnelAudio) window.tunnelAudio.play('powerup');
      }
    }

    // Update Ghosts AI
    this.ghosts.forEach(g => {
      const gSpeed = g.frightened ? 2.5 : 4.0;
      g.x += g.dir.x * gSpeed * dt;
      g.y += g.dir.y * gSpeed * dt;

      // Tunnel wrap
      if (g.x < 0) g.x = this.cols - 1;
      else if (g.x >= this.cols) g.x = 0;

      const gx = Math.round(g.x);
      const gy = Math.round(g.y);
      if (Math.abs(g.x - gx) < 0.1 && Math.abs(g.y - gy) < 0.1) {
        g.x = gx;
        g.y = gy;
        // Pick random valid direction
        const dirs = [
          { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }
        ].filter(d => !(d.x === -g.dir.x && d.y === -g.dir.y) && !this.isWall(gx + d.x, gy + d.y));

        if (dirs.length > 0) {
          g.dir = dirs[Math.floor(Math.random() * dirs.length)];
        }
      }

      // Check collision with player
      if (Math.hypot(g.x - this.player.x, g.y - this.player.y) < 0.75) {
        if (g.frightened) {
          // Eat ghost
          g.x = 13.5;
          g.y = 10;
          g.frightened = false;
          this.engine.addScore(200);
          this.engine.spawnFloatingText('+200 GHOST', this.startX + g.x * this.tileSize, this.startY + g.y * this.tileSize, '#00f0ff', 20);
          if (window.tunnelAudio) window.tunnelAudio.play('coin');
        } else {
          // Player hit
          this.lives--;
          this.engine.shake(15, 0.35);
          this.engine.spawnExplosion(this.startX + this.player.x * this.tileSize, this.startY + this.player.y * this.tileSize, '#ff0055', 30);

          if (this.lives > 0) {
            if (window.tunnelAudio) window.tunnelAudio.play('gameover');
            this.player.x = 13.5;
            this.player.y = 16;
            this.player.dir = { x: 0, y: 0 };
            this.engine.spawnFloatingText(`LIVES LEFT: ${this.lives}`, 400, 300, '#ff0055', 22);
          } else {
            this.engine.gameOver('Captured by Sentinel!');
            return;
          }
        }
      }
    });

    // Check maze cleared
    if (this.pelletsRemaining <= 0) {
      this.engine.addScore(2000);
      this.engine.spawnFloatingText('MAZE PURGED! +2000', 400, 300, '#ffb700', 28);
      if (window.tunnelAudio) window.tunnelAudio.play('levelUp');
      this.initGrid();
      this.player.x = 13.5;
      this.player.y = 16;
    }
  }

  isWall(x, y) {
    if (y < 0 || y >= this.rows || x < 0 || x >= this.cols) return false;
    return this.grid[y][x] === 1;
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Dark backdrop
    ctx.fillStyle = '#06070d';
    ctx.fillRect(0, 0, w, h);

    // Draw Grid Walls & Pellets
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const val = this.grid[r][c];
        const x = this.startX + c * this.tileSize;
        const y = this.startY + r * this.tileSize;

        if (val === 1) {
          // Neon Blue Wall
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x, y, this.tileSize, this.tileSize);
          ctx.strokeStyle = '#0055ff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, this.tileSize, this.tileSize);
        } else if (val === 0) {
          // Pellet
          ctx.fillStyle = '#ffddaa';
          ctx.beginPath();
          ctx.arc(x + this.tileSize / 2, y + this.tileSize / 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (val === 2) {
          // Power Orb
          ctx.fillStyle = '#00f0ff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(x + this.tileSize / 2, y + this.tileSize / 2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Draw Player (Pac-Runner)
    ctx.save();
    const px = this.startX + this.player.x * this.tileSize + this.tileSize / 2;
    const py = this.startY + this.player.y * this.tileSize + this.tileSize / 2;
    ctx.translate(px, py);

    // Determine angle from direction
    let rot = 0;
    if (this.player.dir.x === 1) rot = 0;
    else if (this.player.dir.x === -1) rot = Math.PI;
    else if (this.player.dir.y === 1) rot = Math.PI / 2;
    else if (this.player.dir.y === -1) rot = -Math.PI / 2;
    ctx.rotate(rot);

    ctx.fillStyle = '#ffdd00';
    ctx.shadowColor = '#ffdd00';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 9, this.player.mouth * Math.PI, (2 - this.player.mouth) * Math.PI);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw Ghosts
    this.ghosts.forEach(g => {
      ctx.save();
      const gx = this.startX + g.x * this.tileSize + this.tileSize / 2;
      const gy = this.startY + g.y * this.tileSize + this.tileSize / 2;
      ctx.translate(gx, gy);

      const gColor = g.frightened ? '#00f0ff' : g.color;
      ctx.fillStyle = gColor;
      ctx.shadowColor = gColor;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.arc(0, -2, 8, Math.PI, 0);
      ctx.lineTo(8, 7);
      ctx.lineTo(4, 5);
      ctx.lineTo(0, 7);
      ctx.lineTo(-4, 5);
      ctx.lineTo(-8, 7);
      ctx.closePath();
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-3, -2, 2.5, 0, Math.PI * 2);
      ctx.arc(3, -2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-3 + g.dir.x * 1, -2 + g.dir.y * 1, 1.2, 0, Math.PI * 2);
      ctx.arc(3 + g.dir.x * 1, -2 + g.dir.y * 1, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Lives HUD
    ctx.fillStyle = '#ff007f';
    ctx.font = '700 12px "Press Start 2P", monospace';
    ctx.fillText(`RUNNERS: ${this.lives}`, 20, 30);
  }

  destroy() {
    this.grid = [];
    this.ghosts = [];
  }
}

window.PacMazeGame = PacMazeGame;
