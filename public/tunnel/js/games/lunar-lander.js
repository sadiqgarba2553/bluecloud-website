// Tunnel Arcade - Game 15: Lunar Lander Vector
class LunarLanderGame {
  init(engine) {
    this.engine = engine;
    this.lander = {
      x: 100,
      y: 60,
      vx: 30,
      vy: 0,
      angle: 0, // Radians (0 = upright)
      fuel: 1000,
      thrustPower: 140,
      rotSpeed: 3.2,
      gravity: 38,
      width: 22,
      height: 20,
      alive: true
    };

    this.lives = 3;
    this.isThrusting = false;
    this.generateTerrain();
  }

  generateTerrain() {
    this.terrain = [];
    const pts = [
      { x: 0, y: 480 },
      { x: 90, y: 520 },
      { x: 180, y: 520, pad: true, multiplier: 3 }, // Pad 1 (3X)
      { x: 260, y: 460 },
      { x: 380, y: 550 },
      { x: 460, y: 550, pad: true, multiplier: 2 }, // Pad 2 (2X)
      { x: 540, y: 490 },
      { x: 620, y: 420 },
      { x: 700, y: 420, pad: true, multiplier: 5 }, // Pad 3 (5X - High peak)
      { x: 800, y: 540 }
    ];
    this.terrain = pts;
  }

  update(dt, input) {
    if (!this.lander.alive) return;

    // Rotation controls
    if (input.isDown('left')) {
      this.lander.angle -= this.lander.rotSpeed * dt;
    }
    if (input.isDown('right')) {
      this.lander.angle += this.lander.rotSpeed * dt;
    }

    // Main Engine Thrusters (Up Arrow / Space / Action A)
    this.isThrusting = (input.isDown('up') || input.isDown('actionA') || input.isDown('Space')) && this.lander.fuel > 0;
    if (this.isThrusting) {
      this.lander.fuel -= 140 * dt;
      // Thrust vector (pointing opposite of lander orientation)
      this.lander.vx += Math.sin(this.lander.angle) * this.lander.thrustPower * dt;
      this.lander.vy -= Math.cos(this.lander.angle) * this.lander.thrustPower * dt;

      if (Math.random() < 0.4) {
        this.engine.spawnExplosion(
          this.lander.x - Math.sin(this.lander.angle) * 14,
          this.lander.y + Math.cos(this.lander.angle) * 14,
          '#ffb700',
          2
        );
      }
    }

    // Apply Lunar Gravity
    this.lander.vy += this.lander.gravity * dt;

    // Move lander
    this.lander.x += this.lander.vx * dt;
    this.lander.y += this.lander.vy * dt;

    // Screen wrap X
    this.lander.x = (this.lander.x + 800) % 800;

    // Check Terrain Collision
    this.checkLanding();
  }

  checkLanding() {
    const lx = this.lander.x;
    const ly = this.lander.y + 12;

    for (let i = 0; i < this.terrain.length - 1; i++) {
      const p1 = this.terrain[i];
      const p2 = this.terrain[i + 1];

      if (lx >= p1.x && lx <= p2.x) {
        // Interpolate ground height at lander X
        const t = (lx - p1.x) / (p2.x - p1.x);
        const groundY = p1.y + t * (p2.y - p1.y);

        if (ly >= groundY) {
          // Touchdown! Check safe parameters
          const vertSpeed = Math.abs(this.lander.vy);
          const horizSpeed = Math.abs(this.lander.vx);
          const angleDeg = Math.abs(this.lander.angle * (180 / Math.PI));

          if (p1.pad && vertSpeed < 45 && horizSpeed < 30 && angleDeg < 14) {
            // SUCCESSFUL LANDING!
            const bonus = Math.floor((1000 + this.lander.fuel * 2) * p1.multiplier);
            this.engine.addScore(bonus);
            this.engine.spawnFloatingText(`TOUCHDOWN! +${bonus}`, 400, 200, '#00ff66', 28);
            if (window.tunnelAudio) window.tunnelAudio.play('levelUp');

            this.resetLander(true);
          } else {
            // CRASH!
            this.killLander(vertSpeed >= 45 ? 'Hard Impact Velocity!' : angleDeg >= 14 ? 'Lander Tipped Over!' : 'Off-Pad Terrain Collision!');
          }
          break;
        }
      }
    }
  }

  killLander(reason) {
    this.lives--;
    this.engine.shake(16, 0.4);
    this.engine.spawnExplosion(this.lander.x, this.lander.y, '#ff0055', 40);

    if (this.lives > 0) {
      if (window.tunnelAudio) window.tunnelAudio.play('gameover');
      this.resetLander(false);
      this.engine.spawnFloatingText(`LANDERS: ${this.lives}`, 400, 300, '#ff0055', 22);
    } else {
      this.engine.gameOver(reason);
    }
  }

  resetLander(success) {
    this.lander.x = Math.random() * 400 + 100;
    this.lander.y = 60;
    this.lander.vx = (Math.random() - 0.5) * 30;
    this.lander.vy = 0;
    this.lander.angle = 0;
    if (!success) this.lander.fuel = Math.max(300, this.lander.fuel);
  }

  render(ctx) {
    const w = 800;
    const h = 600;

    // Deep space backdrop
    ctx.fillStyle = '#05060c';
    ctx.fillRect(0, 0, w, h);

    // Vector Lunar Terrain
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;

    ctx.beginPath();
    this.terrain.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // Draw Landing Pads with Multiplier Labels
    this.terrain.forEach((pt, idx) => {
      if (pt.pad) {
        const nextPt = this.terrain[idx + 1];
        ctx.fillStyle = '#00ff66';
        ctx.shadowColor = '#00ff66';
        ctx.fillRect(pt.x, pt.y - 2, nextPt.x - pt.x, 4);

        ctx.font = '700 10px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${pt.multiplier}X`, (pt.x + nextPt.x) / 2, pt.y + 20);
      }
    });

    // Draw Vector Lunar Lander
    ctx.save();
    ctx.translate(this.lander.x, this.lander.y);
    ctx.rotate(this.lander.angle);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;

    // Capsule Body
    ctx.strokeRect(-8, -8, 16, 14);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8, -8, 16, 14);

    // Landing Legs
    ctx.beginPath();
    ctx.moveTo(-8, 6);
    ctx.lineTo(-14, 14);
    ctx.moveTo(8, 6);
    ctx.lineTo(14, 14);
    // Foot pads
    ctx.moveTo(-16, 14);
    ctx.lineTo(-12, 14);
    ctx.moveTo(12, 14);
    ctx.lineTo(16, 14);
    ctx.stroke();

    // Thruster Flame
    if (this.isThrusting) {
      ctx.strokeStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.beginPath();
      ctx.moveTo(-4, 6);
      ctx.lineTo(0, 16 + Math.random() * 8);
      ctx.lineTo(4, 6);
      ctx.stroke();
    }
    ctx.restore();

    // Telemetry HUD
    ctx.fillStyle = '#ff007f';
    ctx.font = '700 11px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`FUEL: ${Math.max(0, Math.floor(this.lander.fuel))}`, 20, 30);
    ctx.fillText(`ALTITUDE: ${Math.max(0, Math.floor(550 - this.lander.y))}`, 20, 50);

    ctx.textAlign = 'right';
    const vSpeed = Math.floor(this.lander.vy);
    ctx.fillStyle = Math.abs(vSpeed) < 45 ? '#00ff66' : '#ff0055';
    ctx.fillText(`V-SPEED: ${vSpeed}`, 780, 30);
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`H-SPEED: ${Math.floor(this.lander.vx)}`, 780, 50);
  }

  destroy() {
    this.terrain = [];
  }
}

window.LunarLanderGame = LunarLanderGame;
