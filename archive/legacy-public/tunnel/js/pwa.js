// Tunnel Arcade - PWA & Install Manager
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.installBtn = document.getElementById('install-pwa-btn');
    this.installBanner = document.getElementById('install-banner');
    this.installBannerBtn = document.getElementById('banner-install-btn');
    this.dismissBannerBtn = document.getElementById('dismiss-banner-btn');
    this.onlineBadge = document.getElementById('online-status-badge');

    this.initServiceWorker();
    this.initInstallPrompts();
    this.initNetworkMonitor();
  }

  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => {
            console.log('[Tunnel PWA] Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.log('[Tunnel PWA] Service Worker registration failed:', err);
          });
      });
    }
  }

  initInstallPrompts() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent automatic browser mini-infobar
      e.preventDefault();
      this.deferredPrompt = e;

      // Show custom install buttons
      if (this.installBtn) {
        this.installBtn.classList.remove('hidden');
        this.installBtn.addEventListener('click', () => this.promptInstall());
      }
      if (this.installBanner && !localStorage.getItem('tunnel_install_dismissed')) {
        this.installBanner.classList.remove('hidden');
      }
    });

    if (this.installBannerBtn) {
      this.installBannerBtn.addEventListener('click', () => this.promptInstall());
    }

    if (this.dismissBannerBtn) {
      this.dismissBannerBtn.addEventListener('click', () => {
        if (this.installBanner) {
          this.installBanner.classList.add('hidden');
          localStorage.setItem('tunnel_install_dismissed', 'true');
        }
      });
    }

    window.addEventListener('appinstalled', () => {
      console.log('[Tunnel PWA] App successfully installed!');
      this.deferredPrompt = null;
      if (this.installBtn) this.installBtn.classList.add('hidden');
      if (this.installBanner) this.installBanner.classList.add('hidden');
      if (window.tunnelAudio) window.tunnelAudio.play('levelUp');
      if (window.tunnelApp) window.tunnelApp.showToast('[ SYSTEM ] TUNNEL ARCADE INSTALLED');
    });

    // Check if already in standalone display mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      if (this.installBtn) this.installBtn.classList.add('hidden');
      if (this.installBanner) this.installBanner.classList.add('hidden');
    }
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      // Fallback instructions if native prompt is not active
      alert('To install Tunnel Arcade:\n- Chrome / Edge: Click the install icon in the address bar.\n- iOS Safari: Tap Share -> Add to Home Screen.\n- Android: Tap menu -> Install app.');
      return;
    }
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    console.log(`[Tunnel PWA] User response to install: ${outcome}`);
    this.deferredPrompt = null;
    if (outcome === 'accepted') {
      if (this.installBtn) this.installBtn.classList.add('hidden');
      if (this.installBanner) this.installBanner.classList.add('hidden');
    }
  }

  initNetworkMonitor() {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      if (this.onlineBadge) {
        if (isOnline) {
          this.onlineBadge.textContent = '[ ONLINE ]';
          this.onlineBadge.className = 'status-badge online';
        } else {
          this.onlineBadge.textContent = '[ OFFLINE ]';
          this.onlineBadge.className = 'status-badge offline';
          if (window.tunnelApp) {
            window.tunnelApp.showToast('[ SYSTEM ] OFFLINE MODE // ROMS READY');
          }
        }
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.tunnelPWA = new PWAManager();
});
