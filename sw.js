const CACHE_PREFIX = 'gridshift-shell-';
const CACHE_NAME = `${CACHE_PREFIX}v8`;
const CORE_FILES = [
  './',
  './index.html',
  './styles.css',
  './core.js',
  './app.js',
  './manifest.webmanifest',
  './icon.svg'
];
const OPTIONAL_FILES = [
  './icons/gridshift-192.png',
  './icons/gridshift-512.png',
  './icons/gridshift-maskable-512.png',
  './assets/gridshift-mark.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(async cache => {
    const cacheFile = async file => {
      const response = await fetch(new Request(file, { cache: 'reload' }));
      if (!response.ok) throw new Error(`Could not cache ${file}: ${response.status}`);
      await cache.put(file, response);
    };
    await Promise.all(CORE_FILES.map(cacheFile));
    await Promise.allSettled(OPTIONAL_FILES.map(cacheFile));
  }));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(caches.match('./index.html').then(cached => cached || fetch(request).catch(() => Response.error())));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
