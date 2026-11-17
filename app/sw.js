// RON TRACK — modo sin conexión. Red primero; si no hay red, la copia guardada.
const CACHE = 'rontrack-v1';
const CORE = [
  './', './index.html', './styles.css', './app.js', './icons.js', './manifest.webmanifest',
  '../brand/_source/ron.mjs', '../brand/_source/poses.mjs', '../brand/_source/wordmark.mjs',
  '../brand/app-icons/favicon.svg', '../brand/app-icons/icon-192.png', '../brand/app-icons/icon-512.png', '../brand/app-icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return res; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('./index.html'))),
  );
});
