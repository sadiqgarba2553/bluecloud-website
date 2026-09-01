// Tunnel Arcade Service Worker - Offline Caching (16-Game Master Suite)
const CACHE_NAME = 'tunnel-arcade-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/games.css',
  './js/app.js',
  './js/audio.js',
  './js/input.js',
  './js/engine.js',
  './js/tunnel-bg.js',
  './js/games-registry.js',
  './js/pwa.js',
  './js/games/tunnel-runner.js',
  './js/games/space-invaders.js',
  './js/games/tetris.js',
  './js/games/pac-maze.js',
  './js/games/flappy.js',
  './js/games/solitaire.js',
  './js/games/snake.js',
  './js/games/brick-breaker.js',
  './js/games/pong.js',
  './js/games/game-2048.js',
  './js/games/minesweeper.js',
  './js/games/asteroids.js',
  './js/games/galaga.js',
  './js/games/frogger.js',
  './js/games/lunar-lander.js',
  './js/games/pinball.js',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching all 16 arcade game modules');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[ServiceWorker] Pre-cache non-fatal warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Purging old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
