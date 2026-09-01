// Tunnel Arcade - Main Application Controller (Nostalgic Retro Arcade Edition)
class TunnelApp {
  constructor() {
    this.currentCategory = 'ALL';
    this.searchQuery = '';
    this.crtActive = localStorage.getItem('tunnel_crt') === 'true' || localStorage.getItem('tunnel_crt') === null; // Default CRT ON for nostalgic vibes!

    this.initDOM();
    this.bindEvents();
    this.renderCategories();
    this.renderGames();
    this.renderFeatured();
    this.updateAudioToggles();
    this.updateProfileBadge();
    this.applyCRTState();
  }

  initDOM() {
    this.gameGrid = document.getElementById('game-grid');
    this.categoryList = document.getElementById('category-pills');
    this.searchInput = document.getElementById('search-input');
    this.featuredContainer = document.getElementById('featured-banner');
    this.toastContainer = document.getElementById('toast-container');
    
    // Header buttons
    this.sfxToggleBtn = document.getElementById('toggle-sfx-btn');
    this.musicToggleBtn = document.getElementById('toggle-music-btn');
    this.crtToggleBtn = document.getElementById('toggle-crt-btn');
    this.profileBtn = document.getElementById('profile-btn');
    
    // Modal arena
    this.arenaModal = document.getElementById('game-arena-modal');
    this.closeArenaBtn = document.getElementById('close-arena-btn');
    this.pauseBtn = document.getElementById('arena-pause-btn');
    this.resumeBtn = document.getElementById('pause-resume-btn');
    this.restartBtn = document.getElementById('pause-restart-btn');
    this.quitBtn = document.getElementById('pause-quit-btn');
    this.gameoverRestartBtn = document.getElementById('gameover-restart-btn');
    this.gameoverQuitBtn = document.getElementById('gameover-quit-btn');
    this.fullscreenBtn = document.getElementById('arena-fullscreen-btn');

    // Profile modal
    this.profileModal = document.getElementById('profile-modal');
    this.closeProfileBtn = document.getElementById('close-profile-btn');

    // Leaderboard modal
    this.leaderboardBtn = document.getElementById('leaderboard-btn');
    this.leaderboardModal = document.getElementById('leaderboard-modal');
    this.closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');
    this.leaderboardSelect = document.getElementById('leaderboard-game-select');

    // Jukebox modal
    this.jukeboxBtn = document.getElementById('jukebox-btn');
    this.jukeboxModal = document.getElementById('jukebox-modal');
    this.closeJukeboxBtn = document.getElementById('close-jukebox-btn');
    this.jukeboxBgmToggle = document.getElementById('jukebox-bgm-toggle');
  }

  bindEvents() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderGames();
      });
    }

    // Header controls
    if (this.sfxToggleBtn) {
      this.sfxToggleBtn.addEventListener('click', () => {
        const active = window.tunnelAudio.toggleSFX();
        this.updateAudioToggles();
        this.showToast(active ? 'SFX AUDIO ENABLED' : 'SFX AUDIO MUTED');
      });
    }

    if (this.musicToggleBtn) {
      this.musicToggleBtn.addEventListener('click', () => {
        const active = window.tunnelAudio.toggleMusic();
        this.updateAudioToggles();
        this.showToast(active ? 'SYNTH BGM ENABLED' : 'SYNTH BGM MUTED');
      });
    }

    if (this.crtToggleBtn) {
      this.crtToggleBtn.addEventListener('click', () => {
        this.crtActive = !this.crtActive;
        localStorage.setItem('tunnel_crt', this.crtActive);
        this.applyCRTState();
        this.showToast(this.crtActive ? 'CRT SCANLINES: ON' : 'CRT SCANLINES: OFF');
      });
    }

    // Profile
    if (this.profileBtn) {
      this.profileBtn.addEventListener('click', () => this.openProfile());
    }
    if (this.closeProfileBtn) {
      this.closeProfileBtn.addEventListener('click', () => this.closeProfile());
    }

    // Leaderboard
    if (this.leaderboardBtn) {
      this.leaderboardBtn.addEventListener('click', () => this.openLeaderboard());
    }
    if (this.closeLeaderboardBtn) {
      this.closeLeaderboardBtn.addEventListener('click', () => this.closeLeaderboard());
    }
    if (this.leaderboardSelect) {
      this.leaderboardSelect.addEventListener('change', (e) => this.renderLeaderboardTable(e.target.value));
    }

    // Jukebox
    if (this.jukeboxBtn) {
      this.jukeboxBtn.addEventListener('click', () => this.openJukebox());
    }
    if (this.closeJukeboxBtn) {
      this.closeJukeboxBtn.addEventListener('click', () => this.closeJukebox());
    }
    if (this.jukeboxBgmToggle) {
      this.jukeboxBgmToggle.addEventListener('click', () => {
        const active = window.tunnelAudio.toggleMusic();
        this.updateAudioToggles();
        this.showToast(active ? 'SYNTH BGM: PLAYING' : 'SYNTH BGM: STOPPED');
      });
    }

    // Arena Modal controls
    if (this.closeArenaBtn) {
      this.closeArenaBtn.addEventListener('click', () => window.tunnelEngine.closeArena());
    }
    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => window.tunnelEngine.pause());
    }
    if (this.resumeBtn) {
      this.resumeBtn.addEventListener('click', () => window.tunnelEngine.pause());
    }
    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => window.tunnelEngine.restart());
    }
    if (this.quitBtn) {
      this.quitBtn.addEventListener('click', () => window.tunnelEngine.closeArena());
    }
    if (this.gameoverRestartBtn) {
      this.gameoverRestartBtn.addEventListener('click', () => window.tunnelEngine.restart());
    }
    if (this.gameoverQuitBtn) {
      this.gameoverQuitBtn.addEventListener('click', () => window.tunnelEngine.closeArena());
    }

    // Toggle virtual touch controls
    const vControlsToggle = document.getElementById('arena-controls-toggle-btn');
    const vControlsEl = document.querySelector('.virtual-controls');
    if (vControlsToggle && vControlsEl) {
      vControlsToggle.addEventListener('click', () => {
        vControlsEl.classList.toggle('force-show');
        const isActive = vControlsEl.classList.contains('force-show');
        vControlsToggle.classList.toggle('active', isActive);
        if (window.tunnelAudio) window.tunnelAudio.play('move');
        this.showToast(isActive ? 'VIRTUAL CONTROLS [ON]' : 'VIRTUAL CONTROLS [OFF]');
      });
    }

    // Fullscreen toggle
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          this.fullscreenBtn.textContent = '[ FULLSCREEN ]';
        } else {
          document.exitFullscreen().catch(() => {});
          this.fullscreenBtn.textContent = '[ WINDOWED ]';
        }
      });
    }
  }

  applyCRTState() {
    if (this.crtActive) {
      document.body.classList.add('crt-active');
      if (this.crtToggleBtn) this.crtToggleBtn.classList.add('active');
    } else {
      document.body.classList.remove('crt-active');
      if (this.crtToggleBtn) this.crtToggleBtn.classList.remove('active');
    }
  }

  updateAudioToggles() {
    if (this.sfxToggleBtn) {
      const muted = window.tunnelAudio.sfxMuted;
      this.sfxToggleBtn.innerHTML = muted ? 'SFX: OFF' : 'SFX: ON';
      this.sfxToggleBtn.classList.toggle('active', !muted);
    }
    if (this.musicToggleBtn) {
      const muted = window.tunnelAudio.musicMuted;
      this.musicToggleBtn.innerHTML = muted ? 'BGM: OFF' : 'BGM: ON';
      this.musicToggleBtn.classList.toggle('active', !muted);
    }
  }

  renderCategories() {
    if (!this.categoryList) return;
    const cats = ['ALL', 'FAVORITES', 'ACTION', 'PUZZLE', 'RETRO', 'CLASSIC'];
    this.categoryList.innerHTML = '';

    cats.forEach(cat => {
      const pill = document.createElement('button');
      pill.className = `category-pill ${this.currentCategory === cat ? 'active' : ''}`;
      pill.textContent = cat;
      pill.addEventListener('click', () => {
        this.currentCategory = cat;
        if (window.tunnelAudio) window.tunnelAudio.play('click');
        this.renderCategories();
        this.renderGames();
      });
      this.categoryList.appendChild(pill);
    });
  }

  renderFeatured() {
    if (!this.featuredContainer) return;
    const flagship = window.tunnelRegistry.getById('tunnel-runner');
    if (!flagship) return;

    const highScore = localStorage.getItem(`tunnel_hs_${flagship.id}`) || 0;
    const iconSvg = window.tunnelRegistry.getGameSvgIcon(flagship.iconType, flagship.accentColor);

    this.featuredContainer.innerHTML = `
      <div class="featured-card">
        <div class="featured-badge">[ FEATURED CABINET ]</div>
        <div class="featured-content">
          <div class="featured-icon-box">${iconSvg}</div>
          <div class="featured-info">
            <h2 class="featured-title">${flagship.title.toUpperCase()}</h2>
            <p class="featured-desc">${flagship.description}</p>
            <div class="featured-meta">
              <span class="meta-tag">HI-SCORE: ${parseInt(highScore).toLocaleString()}</span>
              <span class="meta-tag">ENGINE: 3D VECTOR WARP</span>
              <span class="meta-tag">FPS: 60 UNLOCKED</span>
            </div>
            <div class="featured-actions">
              <button class="btn btn-primary" onclick="window.tunnelApp.launchGame('${flagship.id}')">
                <span>INSERT COIN / PLAY</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderGames() {
    if (!this.gameGrid) return;
    const games = window.tunnelRegistry.filter(this.currentCategory, this.searchQuery);
    this.gameGrid.innerHTML = '';

    if (games.length === 0) {
      this.gameGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-title">[ NO CARTRIDGES FOUND ]</div>
          <p>Adjust query or select another arcade category.</p>
        </div>
      `;
      return;
    }

    games.forEach(g => {
      const highScore = parseInt(localStorage.getItem(`tunnel_hs_${g.id}`) || '0', 10);
      const isFav = window.tunnelRegistry.isFavorite(g.id);
      const iconSvg = window.tunnelRegistry.getGameSvgIcon(g.iconType, g.accentColor);

      const card = document.createElement('div');
      card.className = 'game-card';
      card.innerHTML = `
        <div class="card-header">
          <span class="card-badge" style="border-color: ${g.accentColor}; color: ${g.accentColor};">[ ${g.badge} ]</span>
          <button class="fav-btn ${isFav ? 'active' : ''}" onclick="window.tunnelApp.toggleFav('${g.id}', event)" title="Bookmark Cartridge">
            ${isFav ? '[SAVED]' : '[SAVE]'}
          </button>
        </div>
        <div class="card-hero" style="background: radial-gradient(circle at center, ${g.accentColor}22 0%, #0a0e1c 70%);">
          <div class="card-icon-wrap">${iconSvg}</div>
        </div>
        <div class="card-body">
          <h3 class="card-title">${g.title.toUpperCase()}</h3>
          <p class="card-desc">${g.description}</p>
          <div class="card-tags">
            ${g.tags.map(t => `<span class="tag">${t.toUpperCase()}</span>`).join('')}
          </div>
        </div>
        <div class="card-footer">
          <div class="card-score">
            <span class="score-label">HI-SCORE</span>
            <span class="score-value">${highScore.toLocaleString()}</span>
          </div>
          <button class="btn btn-play" onclick="window.tunnelApp.launchGame('${g.id}')">
            <span>START</span>
          </button>
        </div>
      `;
      this.gameGrid.appendChild(card);
    });
  }

  toggleFav(id, event) {
    if (event) event.stopPropagation();
    const isFav = window.tunnelRegistry.toggleFavorite(id);
    if (window.tunnelAudio) window.tunnelAudio.play('coin');
    this.showToast(isFav ? 'BOOKMARKED TO FAVORITES' : 'REMOVED FROM FAVORITES');
    this.renderGames();
  }

  launchGame(gameId) {
    const meta = window.tunnelRegistry.getById(gameId);
    if (!meta) return;

    if (window.tunnelAudio) window.tunnelAudio.play('coin');

    // Create fresh instance of game class
    const GameConstructor = window[meta.gameClass];
    if (!GameConstructor) {
      alert(`Game class ${meta.gameClass} not found.`);
      return;
    }

    const gameInstance = new GameConstructor();

    // Populate game instruction box in modal
    const ctrlDesktopEl = document.getElementById('arena-ctrl-desktop');
    const ctrlMobileEl = document.getElementById('arena-ctrl-mobile');
    if (ctrlDesktopEl) ctrlDesktopEl.textContent = meta.controls.desktop;
    if (ctrlMobileEl) ctrlMobileEl.textContent = meta.controls.mobile;

    window.tunnelEngine.loadGame(gameInstance, gameId, meta);
  }

  openProfile() {
    if (!this.profileModal) return;
    this.profileModal.classList.remove('hidden');

    const xp = window.tunnelEngine.xp;
    const lvl = Math.floor(Math.sqrt(xp / 100)) + 1;
    const nextLvlXp = Math.pow(lvl, 2) * 100;
    const prevLvlXp = Math.pow(lvl - 1, 2) * 100;
    const progressPct = Math.min(100, Math.max(0, ((xp - prevLvlXp) / (nextLvlXp - prevLvlXp)) * 100));

    // Stats
    const totalScore = window.tunnelRegistry.getAll().reduce((sum, g) => {
      return sum + parseInt(localStorage.getItem(`tunnel_hs_${g.id}`) || '0', 10);
    }, 0);

    const totalPlays = window.tunnelRegistry.getAll().reduce((sum, g) => {
      return sum + parseInt(localStorage.getItem(`tunnel_plays_${g.id}`) || '0', 10);
    }, 0);

    document.getElementById('profile-level-val').textContent = lvl;
    document.getElementById('profile-xp-val').textContent = `${xp.toLocaleString()} / ${nextLvlXp.toLocaleString()} PTS`;
    document.getElementById('profile-xp-bar').style.width = `${progressPct}%`;
    document.getElementById('profile-total-score').textContent = totalScore.toLocaleString();
    document.getElementById('profile-total-plays').textContent = totalPlays.toLocaleString();

    // Achievements list
    const achievementsContainer = document.getElementById('profile-achievements-list');
    if (achievementsContainer) {
      const achievements = [
        { id: 'first_play', code: '[01]', title: 'ARCADE CADET', desc: 'Initialize your first session on Tunnel', unlocked: totalPlays >= 1 },
        { id: 'score_1k', code: '[02]', title: 'HIGH SCORER', desc: 'Surpass 1,000 pts in any single game', unlocked: totalScore >= 1000 },
        { id: 'arcade_veteran', code: '[03]', title: 'CABINET VETERAN', desc: 'Log 10 or more arcade game sessions', unlocked: totalPlays >= 10 },
        { id: 'level_5', code: '[04]', title: 'GRAND MASTER', desc: 'Attain Pilot Rank Level 5', unlocked: lvl >= 5 }
      ];

      achievementsContainer.innerHTML = achievements.map(a => `
        <div class="achievement-item ${a.unlocked ? 'unlocked' : 'locked'}">
          <div class="ach-code">${a.code}</div>
          <div class="ach-details">
            <div class="ach-title">${a.title} ${a.unlocked ? '[UNLOCKED]' : '[LOCKED]'}</div>
            <div class="ach-desc">${a.desc}</div>
          </div>
        </div>
      `).join('');
    }
  }

  closeProfile() {
    if (this.profileModal) this.profileModal.classList.add('hidden');
    if (window.tunnelAudio) window.tunnelAudio.play('click');
  }

  openLeaderboard() {
    if (!this.leaderboardModal) return;
    this.leaderboardModal.classList.remove('hidden');
    if (window.tunnelAudio) window.tunnelAudio.play('click');

    // Populate select
    if (this.leaderboardSelect) {
      const games = window.tunnelRegistry.getAll();
      this.leaderboardSelect.innerHTML = games.map(g => `<option value="${g.id}">${g.title}</option>`).join('');
      this.renderLeaderboardTable(games[0].id);
    }
  }

  closeLeaderboard() {
    if (this.leaderboardModal) this.leaderboardModal.classList.add('hidden');
    if (window.tunnelAudio) window.tunnelAudio.play('click');
  }

  renderLeaderboardTable(gameId) {
    const tbody = document.getElementById('leaderboard-tbody');
    if (!tbody) return;

    const userHigh = parseInt(localStorage.getItem(`tunnel_hs_${gameId}`) || '0', 10);
    
    // Seed authentic arcade champions + User Rank
    const pilots = [
      { name: 'SAQ', score: Math.max(12400, userHigh + 4000) },
      { name: 'ACE', score: Math.max(9800, userHigh + 2200) },
      { name: 'YOU (P1)', score: userHigh, isUser: true },
      { name: 'NEO', score: 6200 },
      { name: 'VIP', score: 4500 },
      { name: 'MAX', score: 3200 },
      { name: 'ZOD', score: 2100 }
    ].sort((a, b) => b.score - a.score);

    tbody.innerHTML = pilots.map((p, idx) => `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); ${p.isUser ? 'color: var(--neon-gold); font-weight: bold;' : ''}">
        <td style="padding: 8px;">#0${idx + 1}</td>
        <td style="padding: 8px;">${p.name}</td>
        <td style="padding: 8px; text-align: right;">${p.score.toLocaleString()}</td>
      </tr>
    `).join('');
  }

  openJukebox() {
    if (!this.jukeboxModal) return;
    this.jukeboxModal.classList.remove('hidden');
    if (window.tunnelAudio) window.tunnelAudio.play('click');
  }

  closeJukebox() {
    if (this.jukeboxModal) this.jukeboxModal.classList.add('hidden');
    if (window.tunnelAudio) window.tunnelAudio.play('click');
  }

  updateProfileBadge() {
    const xp = parseInt(localStorage.getItem('tunnel_xp') || '0', 10);
    const lvl = Math.floor(Math.sqrt(xp / 100)) + 1;
    const badge = document.getElementById('header-level-badge');
    if (badge) badge.textContent = `P1: LVL ${lvl}`;
  }

  showToast(msg) {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.tunnelApp = new TunnelApp();
});
