// Tunnel Arcade - Game 11: Neon Pong / Cyber Table Tennis
class PongGame {
  init(engine) {
    this.engine = engine;
    this.paddleHeight = 85;
    this.paddleWidth = 12;
    this.playerSpeed = 480;

    this.playerY = (600 - this.paddleHeight) / 2;
    this.aiY = (600 - this.paddleHeight) / 2;
    this.aiSpeed = 380;

    this.ball = {
      x: 400,
      y: 300,
      vx: 320 * (Math.random() > 0.5 ? 1 : -1),
      vy: (Math.random() - 0.5) * 200,
      radius: 6,
      speedMultiplier: 1.0
    };

    this.playerScore = 0;
    this.aiScore = 0;
    this.rally = 0;
    this.targetScore = 7;
  }

  resetBall(servingToPlayer) {
    this.ball.x = 400;
    this.ball.y = 300;
    this.ball.speedMultiplier = 1.0;
    this.ball.vx = (servingToPlayer ? -320 : 320);
    this.ball.vy = (Math.random() - 0.5) * 220;
    this.rally = 0;
  }

  update(dt, input) {
    // Player Paddle Movement (Up / Down)
    if (input.isDown('up')) {
      this.playerY -= this.playerSpeed * dt;
    }
    if (input.isDown('down')) {
      this.playerY += this.playerSpeed * dt;
    }
    this.playerY = Math.max(10, Math.min(600 - this.paddleHeight - 10, this.playerY));

    // AI Paddle Tracking
    const aiCenter = this.aiY + this.paddleHeight / 2;
    const targetY = this.ball.y;
    if (Math.abs(aiCenter - targetY) > 10) {
      if (aiCenter < targetY) {
        this.aiY += this.aiSpeed * dt;
      } else {
        this.aiY -= this.aiSpeed * dt;
      }
    }
    this.aiY = Math.max(10, Math.min(600 - this.paddleHeight - 10, this.aiY));

    // Ball movement
    this.ball.x += this.ball.vx * this.ball.speedMultiplier * dt;
    this.ball.y += this.ball.vy * this.ball.speedMultiplier * dt;

    // Top / Bottom Wall Collision
    if (this.ball.y - this.ball.radius <= 10) {
      this.ball.y = 10 + this.ball.radius;
      this.ball.vy = Math.abs(this.ball.vy);
      if (window.tunnelAudio) window.tunnelAudio.play('bounce');
    } else if (this.ball.y + this.ball.radius >= 590) {
      this.ball.y = 590 - this.ball.radius;
      this.ball.vy = -Math.abs(this.ball.vy);
      if (window.tunnelAudio) window.tunnelAudio.play('bounce');
    }

    // Player Paddle Collision (Left side x = 40)
    const playerPaddleX = 40;
    if (
      this.ball.x - this.ball.radius <= playerPaddleX + this.paddleWidth &&
      this.ball.x + this.ball.radius >= playerPaddleX &&
      this.ball.y >= this.playerY &&
      this.ball.y <= this.playerY + this.paddleHeight &&
      this.ball.vx < 0
    ) {
      this.ball.x = playerPaddleX + this.paddleWidth + this.ball.radius;
      const hitOffset = (this.ball.y - (this.playerY + this.paddleHeight / 2)) / (this.paddleHeight / 2);
      this.ball.vx = Math.abs(this.ball.vx);
      this.ball.vy = hitOffset * 320;
      this.ball.speedMultiplier = Math.min(1.8, this.ball.speedMultiplier + 0.05);
      this.rally++;

      this.engine.addScore(50 * this.rally);
      this.engine.spawnExplosion(this.ball.x, this.ball.y, '#00f0ff', 8);
      if (window.tunnelAudio) window.tunnelAudio.play('bounce');
    }

    // AI Paddle Collision (Right side x = 750)
    const aiPaddleX = 750;
    if (
      this.ball.x + this.ball.radius >= aiPaddleX &&
      this.ball.x - this.ball.radius <= aiPaddleX + this.paddleWidth &&
      this.ball.y >= this.aiY &&
      this.ball.y <= this.aiY + this.paddleHeight &&
      this.ball.vx > 0
    ) {
      this.ball.x = aiPaddleX - this.ball.radius;
      const hitOffset = (this.ball.y - (this.aiY + this.paddleHeight / 2)) / (this.paddleHeight / 2);
      this.ball.vx = -Math.abs(this.ball.vx);
      this.ball.vy = hitOffset * 320;
      this.ball.speedMultiplier = Math.min(1.8, this.ball.speedMultiplier + 0.05);

      this.engine.spawnExplosion(this.ball.x, this.ball.y, '#ff0055', 8);
      if (window.tunnelAudio) window.tunnelAudio.play('bounce');
    }

    // Goal Scoring
    if (this.ball.x < 0) {
      // AI scores
      this.aiScore++;
      this.engine.shake(8, 0.2);
      if (window.tunnelAudio) window.tunnelAudio.play('gameover');
      if (this.aiScore >= this.targetScore) {
        this.engine.gameOver('Cyber AI Won the Match!');
      } else {
        this.resetBall(true);
      }
    } else if (this.ball.x > 800) {
      // Player scores
      this.playerScore++;
      const bonus = 500 + this.rally * 100;
      this.engine.addScore(bonus);
      this.engine.spawnFloatingText(`GOAL! +${bonus}`, 400, 200, '#00ff66', 24);
      if (window.tunnelAudio) window.tunnelAudio.play('levelUp');

      if (this.playerScore >= this.targetScore) {
        this.engine.addScore(3000);
        this.engine.spawnFloatingText('MATCH WON! +3000', 400, 300, '#ffb700', 32);
        this.engine.gameOver('Victory! You Defeated the Cyber AI!');
      } else {
        this.resetBall(false);
      }
    }
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Dark backdrop
    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, w, h);

    // Court Boundary Lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(w, 10);
    ctx.moveTo(0, h - 10);
    ctx.lineTo(w, h - 10);
    ctx.stroke();

    // Midcourt dashed line
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.moveTo(w / 2, 10);
    ctx.lineTo(w / 2, h - 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Score Board
    ctx.fillStyle = '#00f0ff';
    ctx.font = '700 36px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.playerScore.toString(), w / 2 - 80, 70);
    ctx.fillStyle = '#ff0055';
    ctx.fillText(this.aiScore.toString(), w / 2 + 80, 70);

    // Player Paddle (Left)
    ctx.save();
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.fillRect(40, this.playerY, this.paddleWidth, this.paddleHeight);
    ctx.restore();

    // AI Paddle (Right)
    ctx.save();
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 12;
    ctx.fillRect(750, this.aiY, this.paddleWidth, this.paddleHeight);
    ctx.restore();

    // Neon Ball
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Rally Multiplier HUD
    if (this.rally > 1) {
      ctx.fillStyle = '#ffb700';
      ctx.font = '700 12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`RALLY: x${this.rally}`, w / 2, h - 30);
    }
  }

  destroy() {}
}

window.PongGame = PongGame;
