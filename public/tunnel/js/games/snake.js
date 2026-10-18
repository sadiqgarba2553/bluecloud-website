// Tunnel Arcade - Game 5: Cyber Snake 360
class SnakeGame {
  init(engine) {
    this.engine = engine;
    this.gridSize = 20;
    this.cols = 40;
    this.rows = 30;

    this.snake = [
      { x: 12, y: 15 },
      { x: 11, y: 15 },
      { x: 10, y: 15 }
    ];

    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.moveTimer = 0;
    this.moveInterval = 0.09;

    this.food = this.spawnFood();
    this.powerup = null;
    this.powerupTimer = 0;
    this.powerupActive = null;
    this.powerupDuration = 0;

    this.multiplier = 1;
    this.ghostMode = false;
  }

  spawnFood() {
    let pos;
    while (!pos || this.snake.some(s => s.x === pos.x && s.y === pos.y)) {
      pos = {
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows)
      };
    }
    return pos;
  }

  spawnPowerup() {
    const types = ['GHOST', '2X', 'SLOW', 'SHRINK'];
    const type = types[Math.floor(Math.random() * types.length)];
    let pos;
    while (!pos || this.snake.some(s => s.x === pos.x && s.y === pos.y)) {
      pos = {
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows),
        type,
        color: type === 'GHOST' ? '#cc00ff' : type === '2X' ? '#ffb700' : type === 'SLOW' ? '#00f0ff' : '#ff0055',
        life: 8
      };
    }
    return pos;
  }

  update(dt, input) {
    // Direction Inputs
    if (input.isDown('up') && this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
    else if (input.isDown('down') && this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
    else if (input.isDown('left') && this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
    else if (input.isDown('right') && this.dir.x === 0) this.nextDir = { x: 1, y: 0 };

    // Update active powerups
    if (this.powerupDuration > 0) {
      this.powerupDuration -= dt;
      if (this.powerupDuration <= 0) {
        this.ghostMode = false;
        this.multiplier = 1;
        this.moveInterval = 0.09;
      }
    }

    // Spawn random powerups periodically
    this.powerupTimer += dt;
    if (this.powerupTimer > 12 && !this.powerup) {
      this.powerupTimer = 0;
      this.powerup = this.spawnPowerup();
    }
    if (this.powerup) {
      this.powerup.life -= dt;
      if (this.powerup.life <= 0) this.powerup = null;
    }

    // Move Snake
    this.moveTimer += dt;
    if (this.moveTimer >= this.moveInterval) {
      this.moveTimer = 0;
      this.dir = { ...this.nextDir };

      const head = {
        x: this.snake[0].x + this.dir.x,
        y: this.snake[0].y + this.dir.y
      };

      // Wall wrap / bounds
      if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
        this.engine.shake(12, 0.3);
        this.engine.spawnExplosion(head.x * this.gridSize, head.y * this.gridSize, '#ff0055', 30);
        this.engine.gameOver('Collision with Boundary Wall!');
        return;
      }

      // Self collision
      if (!this.ghostMode && this.snake.some((s, idx) => idx > 0 && s.x === head.x && s.y === head.y)) {
        this.engine.shake(12, 0.3);
        this.engine.spawnExplosion(head.x * this.gridSize, head.y * this.gridSize, '#ff0055', 30);
        this.engine.gameOver('Self Collision!');
        return;
      }

      this.snake.unshift(head);

      // Check Normal Food
      if (head.x === this.food.x && head.y === this.food.y) {
        const points = 100 * this.multiplier;
        this.engine.addScore(points);
        this.engine.spawnFloatingText(`+${points}`, head.x * this.gridSize, head.y * this.gridSize - 10, '#00ff66', 20);
        this.engine.spawnExplosion(head.x * this.gridSize + 10, head.y * this.gridSize + 10, '#00ff66', 15);
        if (window.tunnelAudio) window.tunnelAudio.play('coin');

        this.food = this.spawnFood();
        // Speed up slightly as score grows
        this.moveInterval = Math.max(0.045, 0.09 - this.snake.length * 0.0008);
      } else if (this.powerup && head.x === this.powerup.x && head.y === this.powerup.y) {
        // Collect powerup
        const pType = this.powerup.type;
        if (pType === 'GHOST') {
          this.ghostMode = true;
          this.powerupDuration = 8;
          this.engine.spawnFloatingText('GHOST SHIELD (8s)', 400, 200, '#cc00ff', 24);
        } else if (pType === '2X') {
          this.multiplier = 2;
          this.powerupDuration = 10;
          this.engine.spawnFloatingText('2X MULTIPLIER (10s)', 400, 200, '#ffb700', 24);
        } else if (pType === 'SLOW') {
          this.moveInterval = 0.14;
          this.powerupDuration = 6;
          this.engine.spawnFloatingText('SLOW MOTION (6s)', 400, 200, '#00f0ff', 24);
        } else if (pType === 'SHRINK') {
          const cut = Math.floor(this.snake.length / 2);
          this.snake.splice(this.snake.length - cut);
          this.engine.spawnFloatingText('SNAKE SHRUNK!', 400, 200, '#ff0055', 24);
        }
        if (window.tunnelAudio) window.tunnelAudio.play('powerup');
        this.powerup = null;
      } else {
        this.snake.pop();
      }
    }
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Dark grid background
    ctx.fillStyle = '#06070d';
    ctx.fillRect(0, 0, w, h);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Border Neon Barrier
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.strokeRect(1, 1, w - 2, h - 2);
    ctx.shadowBlur = 0;

    // Render Food
    ctx.save();
    ctx.fillStyle = '#00ff66';
    ctx.shadowColor = '#00ff66';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.food.x * this.gridSize + 10, this.food.y * this.gridSize + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Render Powerup if active
    if (this.powerup) {
      ctx.save();
      ctx.fillStyle = this.powerup.color;
      ctx.shadowColor = this.powerup.color;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(this.powerup.x * this.gridSize + 10, this.powerup.y * this.gridSize + 10, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 10px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.powerup.type, this.powerup.x * this.gridSize + 10, this.powerup.y * this.gridSize + 14);
      ctx.restore();
    }

    // Render Snake Body
    this.snake.forEach((seg, idx) => {
      ctx.save();
      const isHead = idx === 0;
      const baseColor = this.ghostMode ? '#cc00ff' : (this.multiplier > 1 ? '#ffb700' : '#00f0ff');

      ctx.fillStyle = isHead ? '#ffffff' : baseColor;
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = isHead ? 14 : 6;
      ctx.globalAlpha = this.ghostMode ? (idx % 2 === 0 ? 0.9 : 0.4) : (1 - (idx / this.snake.length) * 0.4);

      ctx.beginPath();
      ctx.roundRect(
        seg.x * this.gridSize + 2,
        seg.y * this.gridSize + 2,
        this.gridSize - 4,
        this.gridSize - 4,
        isHead ? 6 : 4
      );
      ctx.fill();

      // Snake eyes on head
      if (isHead) {
        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(seg.x * this.gridSize + 10 + this.dir.x * 4, seg.y * this.gridSize + 10 + this.dir.y * 4, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // Active powerup status badge
    if (this.powerupDuration > 0) {
      ctx.fillStyle = '#ffb700';
      ctx.font = '700 14px "Outfit", sans-serif';
      ctx.fillText(`BUFF TIME: ${this.powerupDuration.toFixed(1)}s`, 20, 30);
    }
  }

  destroy() {
    this.snake = [];
  }
}

window.SnakeGame = SnakeGame;
