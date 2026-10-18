// Retire the previous website cache so clients receive the product website.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
  await Promise.all((await caches.keys()).map(key => caches.delete(key)));
  await self.registration.unregister();
  await self.clients.claim();
})()));
