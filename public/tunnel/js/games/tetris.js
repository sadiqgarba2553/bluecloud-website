// Tunnel Arcade - Game 2: Neon Tetris
class TetrisGame {
  init(engine) {
    this.engine = engine;
    this.cols = 10;
    this.rows = 20;
    this.blockSize = 24;
    this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));

    this.shapes = {
      I: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
      J: [[1,0,0], [1,1,1], [0,0,0]],
      L: [[0,0,1], [1,1,1], [0,0,0]],
      O: [[1,1], [1,1]],
      S: [[0,1,1], [1,1,0], [0,0,0]],
      T: [[0,1,0], [1,1,1], [0,0,0]],
      Z: [[1,1,0], [0,1,1], [0,0,0]]
    };

    this.colors = {
      I: '#00f0ff',
      J: '#0055ff',
      L: '#ff9900',
      O: '#ffdd00',
      S: '#00ff66',
      T: '#cc00ff',
      Z: '#ff0055'
    };

    this.linesCleared = 0;
    this.dropInterval = 0.8;
    this.dropTimer = 0;
    this.holdPiece = null;
    this.canHold = true;

    this.bag = [];
    this.currentPiece = this.nextPieceFromBag();
    this.nextPiece = this.nextPieceFromBag();
    this.pieceX = Math.floor((this.cols - this.currentPiece.matrix[0].length) / 2);
    this.pieceY = 0;

    this.leftTimer = 0;
    this.rightTimer = 0;
  }

  nextPieceFromBag() {
    if (this.bag.length === 0) {
      this.bag = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'].sort(() => Math.random() - 0.5);
    }
    const type = this.bag.pop();
    return {
      type,
      matrix: this.shapes[type].map(row => [...row]),
      color: this.colors[type]
    };
  }

  update(dt, input) {
    // Hold mechanic
    if (input.wasPressed('hold') || input.wasPressed('actionB')) {
      if (this.canHold) {
        if (window.tunnelAudio) window.tunnelAudio.play('move');
        if (!this.holdPiece) {
          this.holdPiece = this.currentPiece.type;
          this.currentPiece = this.nextPiece;
          this.nextPiece = this.nextPieceFromBag();
        } else {
          const temp = this.holdPiece;
          this.holdPiece = this.currentPiece.type;
          this.currentPiece = {
            type: temp,
            matrix: this.shapes[temp].map(row => [...row]),
            color: this.colors[temp]
          };
        }
        this.pieceX = Math.floor((this.cols - this.currentPiece.matrix[0].length) / 2);
        this.pieceY = 0;
        this.canHold = false;
      }
    }

    // Rotation
    if (input.wasPressed('rotate') || input.wasPressed('up') || input.wasPressed('actionA')) {
      this.rotatePiece();
    }

    // Horizontal Movement
    if (input.wasPressed('left')) {
      if (!this.collide(this.pieceX - 1, this.pieceY, this.currentPiece.matrix)) {
        this.pieceX--;
        if (window.tunnelAudio) window.tunnelAudio.play('move');
      }
    }
    if (input.wasPressed('right')) {
      if (!this.collide(this.pieceX + 1, this.pieceY, this.currentPiece.matrix)) {
        this.pieceX++;
        if (window.tunnelAudio) window.tunnelAudio.play('move');
      }
    }

    // Hard Drop
    if (input.wasPressed('drop') && input.isDown('Space')) {
      let dropDist = 0;
      while (!this.collide(this.pieceX, this.pieceY + 1, this.currentPiece.matrix)) {
        this.pieceY++;
        dropDist++;
      }
      this.engine.addScore(dropDist * 2);
      this.lockPiece();
      return;
    }

    // Soft drop or normal fall
    const isSoftDrop = input.isDown('down');
    const curInterval = isSoftDrop ? 0.05 : this.dropInterval;

    this.dropTimer += dt;
    if (this.dropTimer >= curInterval) {
      this.dropTimer = 0;
      if (!this.collide(this.pieceX, this.pieceY + 1, this.currentPiece.matrix)) {
        this.pieceY++;
        if (isSoftDrop) this.engine.addScore(1);
      } else {
        this.lockPiece();
      }
    }
  }

  rotatePiece() {
    const matrix = this.currentPiece.matrix;
    const N = matrix.length;
    const rotated = matrix.map((row, i) =>
      row.map((val, j) => matrix[N - 1 - j][i])
    );

    // Wall kick check
    let offset = 0;
    if (this.collide(this.pieceX, this.pieceY, rotated)) {
      if (!this.collide(this.pieceX + 1, this.pieceY, rotated)) offset = 1;
      else if (!this.collide(this.pieceX - 1, this.pieceY, rotated)) offset = -1;
      else if (!this.collide(this.pieceX + 2, this.pieceY, rotated)) offset = 2;
      else if (!this.collide(this.pieceX - 2, this.pieceY, rotated)) offset = -2;
      else return; // Rotation blocked
    }

    this.pieceX += offset;
    this.currentPiece.matrix = rotated;
    if (window.tunnelAudio) window.tunnelAudio.play('rotate');
  }

  collide(x, y, matrix) {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 0) {
          const newX = x + c;
          const newY = y + r;
          if (newX < 0 || newX >= this.cols || newY >= this.rows) {
            return true;
          }
          if (newY >= 0 && this.grid[newY][newX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  lockPiece() {
    for (let r = 0; r < this.currentPiece.matrix.length; r++) {
      for (let c = 0; c < this.currentPiece.matrix[r].length; c++) {
        if (this.currentPiece.matrix[r][c] !== 0) {
          const gx = this.pieceX + c;
          const gy = this.pieceY + r;
          if (gy < 0) {
            this.engine.gameOver('Grid Overflow!');
            return;
          }
          this.grid[gy][gx] = this.currentPiece.color;
        }
      }
    }

    if (window.tunnelAudio) window.tunnelAudio.play('hit');
    this.clearLines();
    this.canHold = true;

    this.currentPiece = this.nextPiece;
    this.nextPiece = this.nextPieceFromBag();
    this.pieceX = Math.floor((this.cols - this.currentPiece.matrix[0].length) / 2);
    this.pieceY = 0;

    if (this.collide(this.pieceX, this.pieceY, this.currentPiece.matrix)) {
      this.engine.gameOver('Out of Space!');
    }
  }

  clearLines() {
    let cleared = 0;
    const startX = 280;
    const startY = 60;

    for (let r = this.rows - 1; r >= 0; r--) {
      if (this.grid[r].every(cell => cell !== 0)) {
        this.grid.splice(r, 1);
        this.grid.unshift(Array(this.cols).fill(0));
        cleared++;
        r++; // Recheck same row index

        // Line explosion particles
        this.engine.spawnExplosion(startX + (this.cols * this.blockSize) / 2, startY + (r * this.blockSize), '#00f0ff', 30);
      }
    }

    if (cleared > 0) {
      this.linesCleared += cleared;
      const points = [0, 100, 300, 600, 1200][cleared] || (cleared * 300);
      this.engine.addScore(points);
      this.engine.shake(8, 0.25);
      this.engine.spawnFloatingText(cleared === 4 ? 'TETRIS! +1200' : `+${points}`, 400, 200, '#00f0ff', 24);
      if (window.tunnelAudio) window.tunnelAudio.play(cleared === 4 ? 'levelUp' : 'score');

      // Increase level speed
      const newLvl = Math.floor(this.linesCleared / 10) + 1;
      if (newLvl !== this.engine.level) {
        this.engine.level = newLvl;
        this.dropInterval = Math.max(0.12, 0.8 - (this.engine.level - 1) * 0.07);
        this.engine.updateHUD();
      }
    }
  }

  render(ctx) {
    const w = 800;
    const h = 600;
    ctx.fillStyle = '#06070d';
    ctx.fillRect(0, 0, w, h);

    const startX = 280;
    const startY = 50;

    // Grid Container Frame
    ctx.fillStyle = '#0b0e1b';
    ctx.fillRect(startX - 6, startY - 6, this.cols * this.blockSize + 12, this.rows * this.blockSize + 12);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.strokeRect(startX - 6, startY - 6, this.cols * this.blockSize + 12, this.rows * this.blockSize + 12);
    ctx.shadowBlur = 0;

    // Grid cells
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = startX + c * this.blockSize;
        const y = startY + r * this.blockSize;

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeRect(x, y, this.blockSize, this.blockSize);

        // Locked blocks
        if (this.grid[r][c] !== 0) {
          this.drawBlock(ctx, x, y, this.grid[r][c]);
        }
      }
    }

    // Draw Ghost piece
    let ghostY = this.pieceY;
    while (!this.collide(this.pieceX, ghostY + 1, this.currentPiece.matrix)) {
      ghostY++;
    }
    for (let r = 0; r < this.currentPiece.matrix.length; r++) {
      for (let c = 0; c < this.currentPiece.matrix[r].length; c++) {
        if (this.currentPiece.matrix[r][c] !== 0) {
          const gx = startX + (this.pieceX + c) * this.blockSize;
          const gy = startY + (ghostY + r) * this.blockSize;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.fillRect(gx + 1, gy + 1, this.blockSize - 2, this.blockSize - 2);
        }
      }
    }

    // Draw Active Falling Piece
    for (let r = 0; r < this.currentPiece.matrix.length; r++) {
      for (let c = 0; c < this.currentPiece.matrix[r].length; c++) {
        if (this.currentPiece.matrix[r][c] !== 0) {
          const px = startX + (this.pieceX + c) * this.blockSize;
          const py = startY + (this.pieceY + r) * this.blockSize;
          this.drawBlock(ctx, px, py, this.currentPiece.color);
        }
      }
    }

    // Side Panels (HOLD & NEXT)
    this.drawSidePanel(ctx, 100, 50, 140, 140, 'HOLD (B / Shift)', this.holdPiece ? this.shapes[this.holdPiece] : null, this.holdPiece ? this.colors[this.holdPiece] : null);
    this.drawSidePanel(ctx, 560, 50, 140, 140, 'NEXT PIECE', this.nextPiece.matrix, this.nextPiece.color);

    // Stats Panel
    ctx.fillStyle = '#0f1428';
    ctx.fillRect(560, 220, 140, 180);
    ctx.strokeStyle = '#7000ff';
    ctx.strokeRect(560, 220, 140, 180);

    ctx.fillStyle = '#ff007f';
    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.fillText('LINES CLEARED', 575, 250);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px "Outfit", sans-serif';
    ctx.fillText(this.linesCleared.toString(), 575, 285);

    ctx.fillStyle = '#ff007f';
    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.fillText('DROP SPEED', 575, 335);
    ctx.fillStyle = '#00f0ff';
    ctx.font = '900 20px "Outfit", sans-serif';
    ctx.fillText(`${(1 / this.dropInterval).toFixed(1)} /s`, 575, 370);
  }

  drawSidePanel(ctx, x, y, w, h, title, matrix, color) {
    ctx.fillStyle = '#0f1428';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#00f0ff';
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = '#00f0ff';
    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.fillText(title, x + 15, y + 26);

    if (matrix && color) {
      const bSize = 18;
      const offX = x + (w - matrix[0].length * bSize) / 2;
      const offY = y + 45 + (h - 45 - matrix.length * bSize) / 2;

      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c] !== 0) {
            this.drawBlock(ctx, offX + c * bSize, offY + r * bSize, color, bSize);
          }
        }
      }
    }
  }

  drawBlock(ctx, x, y, color, size = this.blockSize) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillRect(x + 1, y + 1, size - 2, size - 2);

    // Bevel highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(x + 1, y + 1, size - 2, 3);
    ctx.fillRect(x + 1, y + 1, 3, size - 2);
    ctx.restore();
  }

  destroy() {
    this.grid = [];
  }
}

window.TetrisGame = TetrisGame;
