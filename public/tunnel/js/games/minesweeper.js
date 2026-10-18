// Tunnel Arcade - Game 12: Minesweeper Protocol
class MinesweeperGame {
  init(engine) {
    this.engine = engine;
    this.cols = 16;
    this.rows = 12;
    this.totalMines = 28;
    this.tileSize = 34;

    this.startX = (800 - this.cols * this.tileSize) / 2;
    this.startY = (600 - this.rows * this.tileSize) / 2;

    this.grid = [];
    this.firstClick = true;
    this.gameOver = false;
    this.flagMode = false; // Toggle for touch devices
    this.flagsPlaced = 0;
    this.revealedCount = 0;

    this.initGrid();
    this.bindEvents();
  }

  initGrid() {
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = {
          mine: false,
          revealed: false,
          flagged: false,
          adjacent: 0
        };
      }
    }
  }

  plantMines(safeR, safeC) {
    let planted = 0;
    while (planted < this.totalMines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);

      // Keep first click & neighbors safe
      if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;

      if (!this.grid[r][c].mine) {
        this.grid[r][c].mine = true;
        planted++;
      }
    }

    // Calculate adjacencies
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].mine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.grid[nr][nc].mine) {
              count++;
            }
          }
        }
        this.grid[r][c].adjacent = count;
      }
    }
  }

  bindEvents() {
    this.canvas = this.engine.canvas;
    this.handleClick = this.onCanvasClick.bind(this);
    this.handleContext = (e) => {
      e.preventDefault();
      this.onCanvasRightClick(e);
    };

    this.canvas.addEventListener('click', this.handleClick);
    this.canvas.addEventListener('contextmenu', this.handleContext);
  }

  getGridCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const c = Math.floor((x - this.startX) / this.tileSize);
    const r = Math.floor((y - this.startY) / this.tileSize);
    return { r, c, inBounds: r >= 0 && r < this.rows && c >= 0 && c < this.cols };
  }

  onCanvasClick(e) {
    if (this.gameOver) return;
    const { r, c, inBounds } = this.getGridCoords(e);
    if (!inBounds) return;

    if (this.flagMode) {
      this.toggleFlag(r, c);
    } else {
      this.revealCell(r, c);
    }
  }

  onCanvasRightClick(e) {
    if (this.gameOver) return;
    const { r, c, inBounds } = this.getGridCoords(e);
    if (!inBounds) return;
    this.toggleFlag(r, c);
  }

  toggleFlag(r, c) {
    const cell = this.grid[r][c];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    this.flagsPlaced += cell.flagged ? 1 : -1;
    if (window.tunnelAudio) window.tunnelAudio.play('move');
  }

  revealCell(r, c) {
    const cell = this.grid[r][c];
    if (cell.revealed || cell.flagged) return;

    if (this.firstClick) {
      this.firstClick = false;
      this.plantMines(r, c);
    }

    cell.revealed = true;
    this.revealedCount++;

    if (cell.mine) {
      // Detonate!
      this.gameOver = true;
      this.engine.shake(16, 0.4);
      this.revealAllMines();
      this.engine.gameOver('Minefield Protocol Breached!');
      return;
    }

    this.engine.addScore(20);
    if (window.tunnelAudio) window.tunnelAudio.play('score');

    // Auto reveal neighbors if 0 adjacent mines
    if (cell.adjacent === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            this.revealCell(nr, nc);
          }
        }
      }
    }

    // Check Win
    const nonMineTotal = this.rows * this.cols - this.totalMines;
    if (this.revealedCount === nonMineTotal) {
      this.gameOver = true;
      this.engine.addScore(5000);
      this.engine.spawnFloatingText('SECTOR DEFUSED! +5000', 400, 300, '#ffb700', 30);
      if (window.tunnelAudio) window.tunnelAudio.play('levelUp');
      this.engine.gameOver('Victory! Entire Sector Defused!');
    }
  }

  revealAllMines() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].mine) {
          this.grid[r][c].revealed = true;
          this.engine.spawnExplosion(this.startX + c * this.tileSize + 17, this.startY + r * this.tileSize + 17, '#ff0055', 8);
        }
      }
    }
  }

  update(dt, input) {
    // Action B toggles Flag Mode for mobile touch
    if (input.wasPressed('actionB') || input.wasPressed('hold')) {
      this.flagMode = !this.flagMode;
      this.engine.spawnFloatingText(this.flagMode ? 'FLAG MODE [ON]' : 'DIG MODE [ON]', 400, 100, '#00f0ff', 20);
      if (window.tunnelAudio) window.tunnelAudio.play('rotate');
    }
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Dark backdrop
    ctx.fillStyle = '#06070d';
    ctx.fillRect(0, 0, w, h);

    const numColors = ['', '#00f0ff', '#00ff66', '#ff0055', '#cc00ff', '#ffb700', '#ff007f', '#ffffff', '#7000ff'];

    // Draw Minesweeper Grid
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        const x = this.startX + c * this.tileSize;
        const y = this.startY + r * this.tileSize;

        if (cell.revealed) {
          if (cell.mine) {
            // Mine cell
            ctx.fillStyle = '#ff0055';
            ctx.fillRect(x + 1, y + 1, this.tileSize - 2, this.tileSize - 2);
            ctx.fillStyle = '#ffffff';
            ctx.font = '700 14px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('*', x + this.tileSize / 2, y + this.tileSize / 2 + 3);
          } else {
            // Empty revealed
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(x + 1, y + 1, this.tileSize - 2, this.tileSize - 2);

            if (cell.adjacent > 0) {
              ctx.fillStyle = numColors[cell.adjacent] || '#00f0ff';
              ctx.font = '700 13px "Press Start 2P", monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(cell.adjacent.toString(), x + this.tileSize / 2, y + this.tileSize / 2 + 2);
            }
          }
        } else {
          // Unrevealed tile
          ctx.fillStyle = '#162038';
          ctx.fillRect(x + 1, y + 1, this.tileSize - 2, this.tileSize - 2);

          // Bevel edges
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fillRect(x + 1, y + 1, this.tileSize - 2, 2);
          ctx.fillRect(x + 1, y + 1, 2, this.tileSize - 2);

          // Flag marker
          if (cell.flagged) {
            ctx.fillStyle = '#ffb700';
            ctx.font = '700 13px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('P', x + this.tileSize / 2, y + this.tileSize / 2 + 2);
          }
        }

        // Grid lines
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.strokeRect(x, y, this.tileSize, this.tileSize);
      }
    }

    // Top HUD
    ctx.fillStyle = '#00f0ff';
    ctx.font = '700 12px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`MINES: ${this.totalMines - this.flagsPlaced}`, 24, 35);
    ctx.textAlign = 'right';
    ctx.fillStyle = this.flagMode ? '#ffb700' : '#00ff66';
    ctx.fillText(`MODE: ${this.flagMode ? '[FLAG]' : '[DIG]'} (B to switch)`, 776, 35);
  }

  destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('click', this.handleClick);
      this.canvas.removeEventListener('contextmenu', this.handleContext);
    }
  }
}

window.MinesweeperGame = MinesweeperGame;
