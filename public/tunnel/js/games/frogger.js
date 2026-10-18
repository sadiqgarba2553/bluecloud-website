// Tunnel Arcade - Game 14: Cyber Crossing / Frogger
class FroggerGame {
  init(engine) {
    this.engine = engine;
    this.gridSize = 40;
    this.cols = 20;
    this.rows = 15;

    this.playerGridX = 10;
    this.playerGridY = 14;
    this.lives = 3;
    this.timeLimit = 30;
    this.timer = this.timeLimit;
    this.goals = [false, false, false, false, false];

    this.lanes = [
      // River Lanes (Rows 1 to 5) - Logs / Floating Data Modules
      { y: 1, type: 'log', speed: 90, len: 120, items: [{ x: 40 }, { x: 340 }, { x: 600 }] },
      { y: 2, type: 'log', speed: -120, len: 90, items: [{ x: 100 }, { x: 380 }, { x: 640 }] },
      { y: 3, type: 'log', speed: 140, len: 160, items: [{ x: 50 }, { x: 450 }] },
      { y: 4, type: 'log', speed: -80, len: 100, items: [{ x: 80 }, { x: 320 }, { x: 560 }] },
      { y: 5, type: 'log', speed: 110, len: 130, items: [{ x: 30 }, { x: 350 }, { x: 620 }] },
      // Median Safe Zone (Row 6)
      // Highway Traffic Lanes (Rows 8 to 12) - Cyber Speeders
      { y: 8, type: 'car', speed: -140, len: 50, color: '#ff0055', items: [{ x: 100 }, { x: 380 }, { x: 650 }] },
      { y: 9, type: 'car', speed: 180, len: 60, color: '#ffb700', items: [{ x: 50 }, { x: 350 }, { x: 600 }] },
      { y: 10, type: 'car', speed: -100, len: 80, color: '#cc00ff', items: [{ x: 120 }, { x: 440 }] },
      { y: 11, type: 'car', speed: 220, len: 45, color: '#00f0ff', items: [{ x: 40 }, { x: 300 }, { x: 580 }] },
      { y: 12, type: 'car', speed: -120, len: 55, color: '#ff007f', items: [{ x: 80 }, { x: 360 }, { x: 620 }] }
    ];
  }

  update(dt, input) {
    this.timer -= dt;
    if (this.timer <= 0) {
      this.killPlayer('Time Expired!');
      return;
    }

    // Player Grid Jumps
    if (input.wasPressed('up')) {
      this.playerGridY--;
      this.engine.addScore(10);
      if (window.tunnelAudio) window.tunnelAudio.play('jump');
    } else if (input.wasPressed('down')) {
      if (this.playerGridY < 14) this.playerGridY++;
      if (window.tunnelAudio) window.tunnelAudio.play('jump');
    } else if (input.wasPressed('left')) {
      if (this.playerGridX > 0) this.playerGridX--;
      if (window.tunnelAudio) window.tunnelAudio.play('jump');
    } else if (input.wasPressed('right')) {
      if (this.playerGridX < this.cols - 1) this.playerGridX++;
      if (window.tunnelAudio) window.tunnelAudio.play('jump');
    }

    // Update Lanes
    let onLog = false;
    let logCarrySpeed = 0;
    const px = this.playerGridX * this.gridSize + 20;

    this.lanes.forEach(lane => {
      lane.items.forEach(item => {
        item.x += lane.speed * dt;
        if (lane.speed > 0 && item.x > 800) item.x = -lane.len;
        if (lane.speed < 0 && item.x + lane.len < 0) item.x = 800;

        // Check Highway Car Collision
        if (lane.type === 'car' && this.playerGridY === lane.y) {
          if (px > item.x && px < item.x + lane.len) {
            this.killPlayer('Hit by Cyber Speeder!');
          }
        }

        // Check River Log Standing
        if (lane.type === 'log' && this.playerGridY === lane.y) {
          if (px > item.x && px < item.x + lane.len) {
            onLog = true;
            logCarrySpeed = lane.speed;
          }
        }
      });
    });

    // River Drowning Check
    if (this.playerGridY >= 1 && this.playerGridY <= 5) {
      if (!onLog) {
        this.killPlayer('Fell into Data Stream!');
        return;
      } else {
        // Drift on log
        this.playerGridX += (logCarrySpeed * dt) / this.gridSize;
        if (this.playerGridX < 0 || this.playerGridX >= this.cols) {
          this.killPlayer('Drifted Out of Bounds!');
          return;
        }
      }
    }

    // Goal Bay Reached (Row 0)
    if (this.playerGridY <= 0) {
      const bayIndex = Math.floor((this.playerGridX + 0.5) / 4);
      if (bayIndex >= 0 && bayIndex < 5 && !this.goals[bayIndex]) {
        this.goals[bayIndex] = true;
        const timeBonus = Math.floor(this.timer * 30);
        this.engine.addScore(500 + timeBonus);
        this.engine.spawnFloatingText(`GOAL! +${500 + timeBonus}`, 400, 200, '#00ff66', 24);
        if (window.tunnelAudio) window.tunnelAudio.play('levelUp');

        // Check All Goals Filled
        if (this.goals.every(g => g)) {
          this.engine.addScore(2000);
          this.engine.spawnFloatingText('STAGE CLEARED! +2000', 400, 300, '#ffb700', 30);
          this.goals = [false, false, false, false, false];
        }

        this.resetPlayerPos();
      } else {
        this.killPlayer('Bay Occupied / Blocked!');
      }
    }
  }

  killPlayer(reason) {
    this.lives--;
    this.engine.shake(14, 0.35);
    const px = this.playerGridX * this.gridSize + 20;
    const py = this.playerGridY * this.gridSize + 20;
    this.engine.spawnExplosion(px, py, '#ff0055', 30);

    if (this.lives > 0) {
      if (window.tunnelAudio) window.tunnelAudio.play('gameover');
      this.resetPlayerPos();
      this.engine.spawnFloatingText(`LIVES LEFT: ${this.lives}`, 400, 300, '#ff0055', 22);
    } else {
      this.engine.gameOver(reason);
    }
  }

  resetPlayerPos() {
    this.playerGridX = 10;
    this.playerGridY = 14;
    this.timer = this.timeLimit;
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Background
    ctx.fillStyle = '#06070e';
    ctx.fillRect(0, 0, w, h);

    // River Zone (Rows 1-5)
    ctx.fillStyle = '#0b1633';
    ctx.fillRect(0, 40, w, 200);

    // Highway Zone (Rows 8-12)
    ctx.fillStyle = '#0e111a';
    ctx.fillRect(0, 320, w, 200);

    // Goal Bays at Row 0
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, 40);
    for (let b = 0; b < 5; b++) {
      const bayX = 40 + b * 160;
      ctx.fillStyle = this.goals[b] ? '#00ff66' : '#1e293b';
      ctx.fillRect(bayX, 6, 80, 28);
      ctx.strokeStyle = '#00f0ff';
      ctx.strokeRect(bayX, 6, 80, 28);
    }

    // Safe Median (Row 6) & Starting Sidewalk (Row 13-14)
    ctx.fillStyle = '#141d36';
    ctx.fillRect(0, 240, w, 40);
    ctx.fillRect(0, 520, w, 80);

    // Render Logs & Cars
    this.lanes.forEach(lane => {
      lane.items.forEach(item => {
        const y = lane.y * this.gridSize;
        if (lane.type === 'log') {
          // Data Log Module
          ctx.fillStyle = '#0284c7';
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 1.5;
          ctx.fillRect(item.x, y + 4, lane.len, 32);
          ctx.strokeRect(item.x, y + 4, lane.len, 32);
        } else if (lane.type === 'car') {
          // Cyber Speeder
          ctx.fillStyle = lane.color;
          ctx.shadowColor = lane.color;
          ctx.shadowBlur = 8;
          ctx.fillRect(item.x, y + 6, lane.len, 28);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(item.x + (lane.speed > 0 ? lane.len - 10 : 2), y + 8, 8, 24);
          ctx.shadowBlur = 0;
        }
      });
    });

    // Render Cyber Frog Player
    const px = this.playerGridX * this.gridSize + 6;
    const py = this.playerGridY * this.gridSize + 6;
    ctx.save();
    ctx.fillStyle = '#00ff66';
    ctx.shadowColor = '#00ff66';
    ctx.shadowBlur = 12;
    ctx.fillRect(px, py, 28, 28);
    ctx.fillStyle = '#05070e';
    ctx.fillRect(px + 4, py + 4, 6, 6);
    ctx.fillRect(px + 18, py + 4, 6, 6);
    ctx.restore();

    // Timer & Lives HUD
    ctx.fillStyle = '#ff007f';
    ctx.font = '700 12px "Press Start 2P", monospace';
    ctx.fillText(`LIVES: ${this.lives}`, 20, 580);
    ctx.textAlign = 'right';
    ctx.fillStyle = this.timer < 8 ? '#ff0055' : '#00f0ff';
    ctx.fillText(`TIME: ${Math.ceil(this.timer)}s`, 780, 580);
  }

  destroy() {
    this.lanes = [];
  }
}

window.FroggerGame = FroggerGame;
