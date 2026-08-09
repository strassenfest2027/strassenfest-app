(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js").catch(function () {
      // Die App funktioniert auch ohne Service Worker.
    });
  });
})();
