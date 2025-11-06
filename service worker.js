const CACHE_NAME = 'rfid-monitor-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
];

// install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
