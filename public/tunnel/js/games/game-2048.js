// Tunnel Arcade - Game 7: 2048 Cyber Grid
class Game2048 {
  init(engine) {
    this.engine = engine;
    this.size = 4;
    this.tileSize = 100;
    this.gap = 14;
    this.gridStartX = (800 - (this.size * this.tileSize + (this.size - 1) * this.gap)) / 2;
    this.gridStartY = (600 - (this.size * this.tileSize + (this.size - 1) * this.gap)) / 2;

    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.previousState = null;
    this.won = false;
    this.hasContinued = false;

    this.tileColors = {
      2: { bg: '#162038', text: '#00f0ff', glow: '#00f0ff' },
      4: { bg: '#1c2847', text: '#00f0ff', glow: '#00f0ff' },
      8: { bg: '#233259', text: '#ff9900', glow: '#ff9900' },
      16: { bg: '#2b214a', text: '#ff5500', glow: '#ff5500' },
      32: { bg: '#3b1d4a', text: '#ff0055', glow: '#ff0055' },
      64: { bg: '#4a1740', text: '#ff007f', glow: '#ff007f' },
      128: { bg: '#401754', text: '#cc00ff', glow: '#cc00ff' },
      256: { bg: '#281754', text: '#7000ff', glow: '#7000ff' },
      512: { bg: '#122554', text: '#00ff66', glow: '#00ff66' },
      1024: { bg: '#473d0a', text: '#ffdd00', glow: '#ffdd00' },
      2048: { bg: '#543c08', text: '#ffb700', glow: '#ffb700' },
      4096: { bg: '#5c102a', text: '#ffffff', glow: '#ff0055' }
    };

    this.spawnTile();
    this.spawnTile();
  }

  spawnTile() {
    const emptyCells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }
    if (emptyCells.length > 0) {
      const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.board[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  saveState() {
    this.previousState = {
      board: this.board.map(r => [...r]),
      score: this.engine.score
    };
  }

  undo() {
    if (this.previousState) {
      this.board = this.previousState.board.map(r => [...r]);
      this.engine.score = this.previousState.score;
      this.engine.updateHUD();
      this.previousState = null;
      if (window.tunnelAudio) window.tunnelAudio.play('move');
    }
  }

  update(dt, input) {
    if (input.wasPressed('actionB') || input.wasPressed('hold')) {
      this.undo();
      return;
    }

    let moved = false;
    if (input.wasPressed('left')) {
      moved = this.moveLeft();
    } else if (input.wasPressed('right')) {
      moved = this.moveRight();
    } else if (input.wasPressed('up')) {
      moved = this.moveUp();
    } else if (input.wasPressed('down')) {
      moved = this.moveDown();
    }

    if (moved) {
      this.spawnTile();
      if (window.tunnelAudio) window.tunnelAudio.play('move');
      this.checkWinCondition();
      this.checkGameOver();
    }
  }

  slideArray(arr) {
    let filtered = arr.filter(val => val !== 0);
    let scoreGained = 0;
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        scoreGained += filtered[i];
        filtered.splice(i + 1, 1);
      }
    }
    while (filtered.length < this.size) {
      filtered.push(0);
    }
    return { result: filtered, scoreGained };
  }

  moveLeft() {
    this.saveState();
    let moved = false;
    let totalScore = 0;

    for (let r = 0; r < this.size; r++) {
      const { result, scoreGained } = this.slideArray(this.board[r]);
      if (result.some((val, idx) => val !== this.board[r][idx])) {
        moved = true;
      }
      this.board[r] = result;
      totalScore += scoreGained;
    }

    if (totalScore > 0) {
      this.engine.addScore(totalScore);
      this.engine.spawnFloatingText(`+${totalScore}`, 400, 100, '#ffb700', 22);
      if (window.tunnelAudio) window.tunnelAudio.play('score');
    }
    return moved;
  }

  moveRight() {
    this.saveState();
    let moved = false;
    let totalScore = 0;

    for (let r = 0; r < this.size; r++) {
      const reversed = [...this.board[r]].reverse();
      const { result, scoreGained } = this.slideArray(reversed);
      const normal = result.reverse();
      if (normal.some((val, idx) => val !== this.board[r][idx])) {
        moved = true;
      }
      this.board[r] = normal;
      totalScore += scoreGained;
    }

    if (totalScore > 0) {
      this.engine.addScore(totalScore);
      this.engine.spawnFloatingText(`+${totalScore}`, 400, 100, '#ffb700', 22);
      if (window.tunnelAudio) window.tunnelAudio.play('score');
    }
    return moved;
  }

  moveUp() {
    this.saveState();
    let moved = false;
    let totalScore = 0;

    for (let c = 0; c < this.size; c++) {
      const col = [this.board[0][c], this.board[1][c], this.board[2][c], this.board[3][c]];
      const { result, scoreGained } = this.slideArray(col);
      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== result[r]) moved = true;
        this.board[r][c] = result[r];
      }
      totalScore += scoreGained;
    }

    if (totalScore > 0) {
      this.engine.addScore(totalScore);
      this.engine.spawnFloatingText(`+${totalScore}`, 400, 100, '#ffb700', 22);
      if (window.tunnelAudio) window.tunnelAudio.play('score');
    }
    return moved;
  }

  moveDown() {
    this.saveState();
    let moved = false;
    let totalScore = 0;

    for (let c = 0; c < this.size; c++) {
      const col = [this.board[3][c], this.board[2][c], this.board[1][c], this.board[0][c]];
      const { result, scoreGained } = this.slideArray(col);
      const normal = result.reverse();
      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== normal[r]) moved = true;
        this.board[r][c] = normal[r];
      }
      totalScore += scoreGained;
    }

    if (totalScore > 0) {
      this.engine.addScore(totalScore);
      this.engine.spawnFloatingText(`+${totalScore}`, 400, 100, '#ffb700', 22);
      if (window.tunnelAudio) window.tunnelAudio.play('score');
    }
    return moved;
  }

  checkWinCondition() {
    if (!this.won && !this.hasContinued) {
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.board[r][c] === 2048) {
            this.won = true;
            this.hasContinued = true;
            this.engine.spawnFloatingText('2048 CYBER UNLOCKED!', 400, 300, '#ffb700', 32);
            if (window.tunnelAudio) window.tunnelAudio.play('levelUp');
          }
        }
      }
    }
  }

  checkGameOver() {
    // Check if any empty cell exists
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) return;
      }
    }

    // Check if adjacent matches are possible
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];
        if (r < this.size - 1 && this.board[r + 1][c] === val) return;
        if (c < this.size - 1 && this.board[r][c + 1] === val) return;
      }
    }

    this.engine.gameOver('No More Valid Merges!');
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Dark grid background
    ctx.fillStyle = '#06070d';
    ctx.fillRect(0, 0, w, h);

    const totalGridWidth = this.size * this.tileSize + (this.size - 1) * this.gap;
    const totalGridHeight = totalGridWidth;

    // Board Frame
    ctx.fillStyle = '#0f1426';
    ctx.fillRect(this.gridStartX - 10, this.gridStartY - 10, totalGridWidth + 20, totalGridHeight + 20);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.strokeRect(this.gridStartX - 10, this.gridStartY - 10, totalGridWidth + 20, totalGridHeight + 20);
    ctx.shadowBlur = 0;

    // Render cells
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];
        const x = this.gridStartX + c * (this.tileSize + this.gap);
        const y = this.gridStartY + r * (this.tileSize + this.gap);

        // Empty slot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fillRect(x, y, this.tileSize, this.tileSize);

        if (val > 0) {
          const style = this.tileColors[val] || { bg: '#5c102a', text: '#ffffff', glow: '#ff0055' };

          ctx.save();
          ctx.fillStyle = style.bg;
          ctx.shadowColor = style.glow;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.roundRect(x, y, this.tileSize, this.tileSize, 8);
          ctx.fill();

          ctx.strokeStyle = style.glow;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Value text
          ctx.fillStyle = style.text;
          const fontSize = val >= 1024 ? 26 : (val >= 128 ? 32 : 38);
          ctx.font = `900 ${fontSize}px "Outfit", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val.toString(), x + this.tileSize / 2, y + this.tileSize / 2);
          ctx.restore();
        }
      }
    }

    // Helper text
    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.font = '600 14px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Swipe or use Arrow Keys to Slide • Press B or Undo to revert move', w / 2, h - 30);
  }

  destroy() {
    this.board = [];
  }
}

window.Game2048 = Game2048;
