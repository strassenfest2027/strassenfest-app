const CACHE_NAME = "strassenfest-pwa-v8-1";
const CORE = [
  "./",
  "./index.html",
  "./config.js",
  "./css/app.css",
  "./js/helpers.js",
  "./js/app.js",
  "./js/pwa.js",
  "./manifest.json",
  "./assets/icon.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(CORE);
  }));
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);

  // Nur Dateien der GitHub-Pages-PWA cachen.
  // Die Google-Apps-Script-App selbst bleibt immer aktuell.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});
