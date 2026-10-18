// Tunnel Arcade - Core Game Runtime & Engine
class ArcadeEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.currentGame = null;
    this.currentGameId = null;
    this.isRunning = false;
    this.isPaused = false;
    this.lastTime = 0;
    this.animationFrameId = null;

    // Game stats
    this.score = 0;
    this.highScore = 0;
    this.level = 1;
    this.linesOrLives = 0;

    // Particle FX
    this.particles = [];
    this.floatingTexts = [];
    this.shakeIntensity = 0;
    this.shakeDuration = 0;

    // Achievements & XP
    this.xp = parseInt(localStorage.getItem('tunnel_xp') || '0', 10);
    this.unlockedAchievements = JSON.parse(localStorage.getItem('tunnel_achievements') || '[]');

    this.initHUD();
  }

  initHUD() {
    this.scoreEl = document.getElementById('hud-score');
    this.highScoreEl = document.getElementById('hud-highscore');
    this.levelEl = document.getElementById('hud-level');
    this.extraEl = document.getElementById('hud-extra');
    this.gameTitleEl = document.getElementById('arena-game-title');
    this.arenaModal = document.getElementById('game-arena-modal');
    this.pauseOverlay = document.getElementById('pause-overlay');
    this.gameoverOverlay = document.getElementById('gameover-overlay');

    window.addEventListener('resize', () => {
      if (this.isRunning && this.metadata) {
        this.resizeCanvas(this.metadata.canvasWidth || 800, this.metadata.canvasHeight || 600);
      }
    });

    this.bindSwipeGestures();
  }

  bindSwipeGestures() {
    if (!this.canvas) return;
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = performance.now();
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1 && window.tunnelInput) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = endX - startX;
        const diffY = endY - startY;
        const elapsed = performance.now() - startTime;

        // Minimum swipe threshold
        if (elapsed < 500 && (Math.abs(diffX) > 30 || Math.abs(diffY) > 30)) {
          if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
              window.tunnelInput.virtualKeys.right = true;
              setTimeout(() => { if (window.tunnelInput) window.tunnelInput.virtualKeys.right = false; }, 80);
            } else {
              window.tunnelInput.virtualKeys.left = true;
              setTimeout(() => { if (window.tunnelInput) window.tunnelInput.virtualKeys.left = false; }, 80);
            }
          } else {
            if (diffY > 0) {
              window.tunnelInput.virtualKeys.down = true;
              setTimeout(() => { if (window.tunnelInput) window.tunnelInput.virtualKeys.down = false; }, 80);
            } else {
              window.tunnelInput.virtualKeys.up = true;
              setTimeout(() => { if (window.tunnelInput) window.tunnelInput.virtualKeys.up = false; }, 80);
            }
          }
        }
      }
    }, { passive: true });
  }

  resizeCanvas(customWidth = 800, customHeight = 600) {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
    
    this.width = customWidth;
    this.height = customHeight;
    
    this.canvas.width = customWidth * dpr;
    this.canvas.height = customHeight * dpr;
    this.canvas.style.aspectRatio = `${customWidth} / ${customHeight}`;
    
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  }

  loadGame(gameInstance, gameId, metadata) {
    this.stop();
    this.currentGame = gameInstance;
    this.currentGameId = gameId;
    this.metadata = metadata;

    if (this.gameTitleEl) {
      this.gameTitleEl.textContent = metadata.title;
    }

    // High Score lookup
    this.highScore = parseInt(localStorage.getItem(`tunnel_hs_${gameId}`) || '0', 10);
    this.score = 0;
    this.level = 1;
    this.updateHUD();

    // Reset FX
    this.particles = [];
    this.floatingTexts = [];
    this.shakeDuration = 0;

    // Open Arena modal
    if (this.arenaModal) {
      this.arenaModal.classList.remove('hidden');
      document.body.classList.add('in-game');
    }

    if (this.pauseOverlay) this.pauseOverlay.classList.add('hidden');
    if (this.gameoverOverlay) this.gameoverOverlay.classList.add('hidden');

    // Initialize the game
    this.resizeCanvas(metadata.canvasWidth || 800, metadata.canvasHeight || 600);
    if (this.currentGame.init) {
      this.currentGame.init(this);
    }

    // Increment play count & award XP
    this.addXP(25);
    const plays = parseInt(localStorage.getItem(`tunnel_plays_${gameId}`) || '0', 10) + 1;
    localStorage.setItem(`tunnel_plays_${gameId}`, plays);

    this.start();
  }

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    if (window.tunnelInput) window.tunnelInput.reset();
    
    cancelAnimationFrame(this.animationFrameId);
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  pause() {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;
    if (this.pauseOverlay) {
      this.pauseOverlay.classList.toggle('hidden', !this.isPaused);
    }
    if (window.tunnelAudio) {
      window.tunnelAudio.play('move');
    }
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    cancelAnimationFrame(this.animationFrameId);
    if (this.currentGame && this.currentGame.destroy) {
      this.currentGame.destroy();
    }
    this.currentGame = null;
  }

  closeArena() {
    this.stop();
    if (this.arenaModal) {
      this.arenaModal.classList.add('hidden');
      document.body.classList.remove('in-game');
    }
    if (window.tunnelAudio) {
      window.tunnelAudio.play('click');
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1); // Cap delta time
    this.lastTime = timestamp;

    if (window.tunnelInput) {
      window.tunnelInput.update();
      if (window.tunnelInput.wasPressed('pause')) {
        this.pause();
      }
    }

    if (!this.isPaused) {
      // Update Game Logic
      if (this.currentGame && this.currentGame.update) {
        this.currentGame.update(dt, window.tunnelInput);
      }
      this.updateFX(dt);
    }

    // Render Canvas
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  render() {
    if (!this.ctx) return;

    this.ctx.save();

    // Apply screen shake
    if (this.shakeDuration > 0) {
      const offsetX = (Math.random() - 0.5) * this.shakeIntensity;
      const offsetY = (Math.random() - 0.5) * this.shakeIntensity;
      this.ctx.translate(offsetX, offsetY);
    }

    // Draw game canvas
    if (this.currentGame && this.currentGame.render) {
      this.currentGame.render(this.ctx);
    }

    // Draw particle FX & floating scores overlay
    this.renderFX(this.ctx);

    this.ctx.restore();
  }

  updateHUD() {
    if (this.scoreEl) this.scoreEl.textContent = this.score.toLocaleString();
    if (this.highScoreEl) this.highScoreEl.textContent = this.highScore.toLocaleString();
    if (this.levelEl) this.levelEl.textContent = this.level;
  }

  addScore(points) {
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(`tunnel_hs_${this.currentGameId}`, this.highScore);
    }
    this.updateHUD();
    this.addXP(Math.max(1, Math.floor(points / 10)));
  }

  gameOver(customMsg) {
    this.isRunning = false;
    if (window.tunnelAudio) window.tunnelAudio.play('gameover');
    if (this.gameoverOverlay) {
      this.gameoverOverlay.classList.remove('hidden');
      const finalScoreEl = document.getElementById('gameover-final-score');
      const bestScoreEl = document.getElementById('gameover-best-score');
      const msgEl = document.getElementById('gameover-msg');
      if (finalScoreEl) finalScoreEl.textContent = this.score.toLocaleString();
      if (bestScoreEl) bestScoreEl.textContent = this.highScore.toLocaleString();
      if (msgEl && customMsg) msgEl.textContent = customMsg;
    }
  }

  restart() {
    if (this.gameoverOverlay) this.gameoverOverlay.classList.add('hidden');
    if (this.pauseOverlay) this.pauseOverlay.classList.add('hidden');
    if (this.currentGame && this.metadata) {
      this.loadGame(this.currentGame, this.currentGameId, this.metadata);
    }
  }

  // Visual FX Helpers
  shake(intensity = 10, duration = 0.3) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  spawnExplosion(x, y, color = '#00f0ff', count = 25) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 200 + 50;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 4 + 2,
        alpha: 1,
        life: Math.random() * 0.4 + 0.3,
        decay: 1 / (Math.random() * 0.4 + 0.3)
      });
    }
  }

  spawnFloatingText(text, x, y, color = '#ffb700', size = 20) {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -60,
      color,
      size,
      alpha: 1,
      life: 0.8
    });
  }

  updateFX(dt) {
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha -= p.decay * dt;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.life -= dt;
      ft.alpha = Math.max(0, ft.life / 0.8);
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  renderFX(ctx) {
    // Render particles
    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Render floating texts
    this.floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 10;
      ctx.font = `900 ${ft.size}px 'Outfit', 'Segoe UI', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });
  }

  addXP(amount) {
    this.xp += amount;
    localStorage.setItem('tunnel_xp', this.xp);
    const newLevel = Math.floor(Math.sqrt(this.xp / 100)) + 1;
    const currentProfileLevel = parseInt(localStorage.getItem('tunnel_profile_level') || '1', 10);
    if (newLevel > currentProfileLevel) {
      localStorage.setItem('tunnel_profile_level', newLevel);
      if (window.tunnelAudio) window.tunnelAudio.play('levelUp');
      if (window.tunnelApp) window.tunnelApp.showToast(`[ LEVEL UP ] PROMOTED TO RANK ${newLevel}`);
    }
    if (window.tunnelApp) window.tunnelApp.updateProfileBadge();
  }
}

window.tunnelEngine = new ArcadeEngine();
