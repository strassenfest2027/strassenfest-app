const CACHE_NAME = "strassenfest-v10-4";

const CORE = [
  "./",
  "./index.html",
  "./config.js",
  "./manifest.json",
  "./css/app.css",
  "./js/api.js",
  "./js/helpers.js",
  "./js/cache.js",
  "./js/app.js",
  "./js/gallery.js",
  "./js/admin.js",
  "./js/help.js",
  "./js/admin-help.js",
  "./js/pwa.js",
  "./assets/icons/app-icon.svg"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache){ return cache.addAll(CORE); })
      .catch(function(){})
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(key){ return key !== CACHE_NAME; })
            .map(function(key){ return caches.delete(key); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(event){
  const req = event.request;
  const url = new URL(req.url);

  if(url.origin !== self.location.origin) return;
  if(req.method !== "GET") return;

  const isCodeOrHtml =
    req.destination === "document" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith("config.js");

  if(isCodeOrHtml){
    event.respondWith(
      fetch(req)
        .then(function(res){
          const copy = res.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(req, copy); });
          return res;
        })
        .catch(function(){ return caches.match(req); })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(function(cached){
      if(cached) return cached;
      return fetch(req).then(function(res){
        const copy = res.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(req, copy); });
        return res;
      });
    })
  );
});
