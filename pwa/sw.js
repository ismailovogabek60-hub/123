const CACHE_NAME = 'edu-v1';
const ASSETS = [
  '../frontend/index.html',
  '../frontend/dashboard.html',
  '../frontend/css/style.css',
  '../frontend/js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
