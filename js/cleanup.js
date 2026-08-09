(function () {
  // Entfernt alte PWA-Caches und alte Service Worker aus früheren Versionen.
  if ("caches" in window) {
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key.indexOf("strassenfest-pwa-") === 0) {
          return caches.delete(key);
        }
      }));
    }).catch(function () {});
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (regs) {
      regs.forEach(function (reg) {
        reg.unregister().catch(function () {});
      });
    }).catch(function () {});
  }
})();
