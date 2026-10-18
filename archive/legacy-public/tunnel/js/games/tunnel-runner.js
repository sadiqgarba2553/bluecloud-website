// Tunnel Arcade - Game 1: Tunnel Rush 3D Speed Runner
class TunnelRunnerGame {
  init(engine) {
    this.engine = engine;
    this.playerAngle = 0; // 0 to 2*PI around tunnel wall
    this.playerSpeed = 0;
    this.speed = 1.0;
    this.distance = 0;
    this.segments = 8;
    this.obstacles = [];
    this.coins = [];
    this.spawnTimer = 0;
    this.invulnerableTimer = 0;
    this.scoreMultiplier = 1;
    this.tunnelColors = ['#00f0ff', '#ff007f', '#7000ff', '#ffb700', '#00ff66'];
    this.colorIdx = 0;
  }

  update(dt, input) {
    // Player angular movement
    const turnSpeed = 4.8;
    if (input.isDown('left')) {
      this.playerAngle -= turnSpeed * dt;
    }
    if (input.isDown('right')) {
      this.playerAngle += turnSpeed * dt;
    }

    // Wrap angle
    this.playerAngle = (this.playerAngle + Math.PI * 2) % (Math.PI * 2);

    // Speed progression
    this.speed += dt * 0.04;
    this.distance += this.speed * dt * 100;
    this.engine.addScore(Math.floor(this.speed * dt * 35));

    // Color shift as speed builds
    this.colorIdx = Math.floor(this.distance / 1500) % this.tunnelColors.length;

    // Spawn obstacles & coins
    this.spawnTimer -= dt * this.speed;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = Math.max(0.4, 1.2 - (this.speed * 0.05));
      this.spawnWave();
    }

    // Update Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.z -= this.speed * dt * 0.8;

      // Check collision when obstacle is close to player plane (z ~ 0.15)
      if (obs.z < 0.22 && obs.z > 0.05 && this.invulnerableTimer <= 0) {
        let diff = Math.abs(this.playerAngle - obs.angle);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;

        if (diff < obs.arcSize / 2 + 0.18) {
          // Crash!
          this.engine.shake(15, 0.4);
          this.engine.spawnExplosion(400, 300, '#ff0055', 40);
          this.engine.gameOver('Crushed in the Warp Tunnel!');
          return;
        }
      }

      if (obs.z <= 0) {
        this.obstacles.splice(i, 1);
        if (window.tunnelAudio) window.tunnelAudio.play('score');
      }
    }

    // Update Coins
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.z -= this.speed * dt * 0.8;

      if (c.z < 0.25 && c.z > 0.05) {
        let diff = Math.abs(this.playerAngle - c.angle);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;

        if (diff < 0.35) {
          // Collected coin!
          this.engine.addScore(250);
          this.engine.spawnFloatingText('+250', 400, 260, '#ffb700', 24);
          if (window.tunnelAudio) window.tunnelAudio.play('coin');
          this.coins.splice(i, 1);
          continue;
        }
      }

      if (c.z <= 0) {
        this.coins.splice(i, 1);
      }
    }
  }

  spawnWave() {
    // Random obstacle pattern
    const pattern = Math.random();
    const baseAngle = Math.random() * Math.PI * 2;

    if (pattern < 0.5) {
      // Single large wedge barrier
      this.obstacles.push({
        z: 1.0,
        angle: baseAngle,
        arcSize: Math.PI * 0.85,
        color: '#ff0055'
      });
    } else if (pattern < 0.8) {
      // Opposing dual gates
      this.obstacles.push({
        z: 1.0,
        angle: baseAngle,
        arcSize: Math.PI * 0.6,
        color: '#ff007f'
      });
      this.obstacles.push({
        z: 1.0,
        angle: (baseAngle + Math.PI) % (Math.PI * 2),
        arcSize: Math.PI * 0.6,
        color: '#ff007f'
      });
    } else {
      // Tri-spoke hazard
      for (let s = 0; s < 3; s++) {
        this.obstacles.push({
          z: 1.0,
          angle: (baseAngle + (s * Math.PI * 2 / 3)) % (Math.PI * 2),
          arcSize: Math.PI * 0.45,
          color: '#ffb700'
        });
      }
    }

    // Spawn bonus orbs in gaps
    if (Math.random() < 0.65) {
      this.coins.push({
        z: 1.0,
        angle: (baseAngle + Math.PI * 0.5) % (Math.PI * 2)
      });
    }
  }

  render(ctx) {
    const w = 800;
    const h = 600;
    const cx = w / 2;
    const cy = h / 2;

    // Dark backdrop
    ctx.fillStyle = '#06070d';
    ctx.fillRect(0, 0, w, h);

    const themeColor = this.tunnelColors[this.colorIdx];

    // Render tunnel depth rings
    const numRings = 14;
    for (let i = numRings; i >= 1; i--) {
      const z = (i / numRings);
      const radius = 260 * (1 - Math.pow(z, 2) * 0.9);

      ctx.beginPath();
      for (let s = 0; s < this.segments; s++) {
        const ang = (s / this.segments) * Math.PI * 2;
        const px = cx + Math.cos(ang) * radius;
        const py = cy + Math.sin(ang) * radius;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 + (1 - z) * 0.35})`;
      ctx.lineWidth = (1 - z) * 3 + 1;
      ctx.stroke();
    }

    // Longitudinal tunnel lines
    for (let s = 0; s < this.segments; s++) {
      const ang = (s / this.segments) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * 20, cy + Math.sin(ang) * 20);
      ctx.lineTo(cx + Math.cos(ang) * 260, cy + Math.sin(ang) * 260);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Render Obstacles (Furthest to closest)
    const sortedObs = [...this.obstacles].sort((a, b) => b.z - a.z);
    sortedObs.forEach((obs) => {
      const radius = 260 * (1 - Math.pow(obs.z, 2) * 0.9);
      const innerRadius = radius * 0.7;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, obs.angle - obs.arcSize / 2, obs.angle + obs.arcSize / 2);
      ctx.arc(cx, cy, innerRadius, obs.angle + obs.arcSize / 2, obs.angle - obs.arcSize / 2, true);
      ctx.closePath();

      ctx.fillStyle = obs.color;
      ctx.shadowColor = obs.color;
      ctx.shadowBlur = (1 - obs.z) * 15;
      ctx.globalAlpha = Math.min(1, Math.max(0.2, (1 - obs.z) * 1.2));
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    });

    // Render Coins
    this.coins.forEach((c) => {
      const radius = 260 * (1 - Math.pow(c.z, 2) * 0.9) * 0.85;
      const px = cx + Math.cos(c.angle) * radius;
      const py = cy + Math.sin(c.angle) * radius;
      const size = Math.max(3, (1 - c.z) * 14);

      ctx.save();
      ctx.fillStyle = '#ffb700';
      ctx.shadowColor = '#ffb700';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Render Player Craft on tunnel perimeter
    const playerRadius = 245;
    const shipX = cx + Math.cos(this.playerAngle) * playerRadius;
    const shipY = cy + Math.sin(this.playerAngle) * playerRadius;

    ctx.save();
    ctx.translate(shipX, shipY);
    ctx.rotate(this.playerAngle + Math.PI / 2);

    // Neon Ship Silhouette
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(14, 14);
    ctx.lineTo(0, 6);
    ctx.lineTo(-14, 14);
    ctx.closePath();
    ctx.fill();

    // Jet flame
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-6, 8);
    ctx.lineTo(0, 18 + Math.random() * 8);
    ctx.lineTo(6, 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Speed HUD
    ctx.fillStyle = '#00f0ff';
    ctx.font = '700 16px "Outfit", sans-serif';
    ctx.fillText(`WARP SPEED: ${this.speed.toFixed(1)}x`, 24, 40);
    ctx.fillText(`DISTANCE: ${Math.floor(this.distance)}m`, 24, 65);
  }

  destroy() {
    this.obstacles = [];
    this.coins = [];
  }
}

window.TunnelRunnerGame = TunnelRunnerGame;
