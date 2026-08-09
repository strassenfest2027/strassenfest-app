(function () {
  const frame = document.getElementById("appFrame");
  const loader = document.getElementById("loader");
  const loaderNote = document.getElementById("loaderNote");
  const status = document.getElementById("appStatus");
  const reloadBtn = document.getElementById("reloadBtn");

  let loadTimer = null;

  function showLoader(message) {
    loader.classList.remove("is-hidden");
    loaderNote.textContent = message || "Verbindung wird hergestellt.";
    status.textContent = "wird geladen …";
  }

  function hideLoader() {
    loader.classList.add("is-hidden");
    status.textContent = "bereit";

    if (loadTimer) {
      clearTimeout(loadTimer);
      loadTimer = null;
    }
  }

  function loadApp(forceReload) {
    if (!Strassenfest.isConfigured()) {
      showLoader("Die App-Adresse ist nicht konfiguriert.");
      status.textContent = "Konfiguration fehlt";
      return;
    }

    const url = Strassenfest.getAppUrl();
    showLoader(forceReload ? "App wird neu geladen …" : "Verbindung wird hergestellt.");

    frame.onload = function () {
      window.setTimeout(hideLoader, 200);
    };

    frame.src = forceReload ? Strassenfest.withCacheBuster(url) : url;

    loadTimer = window.setTimeout(function () {
      if (!loader.classList.contains("is-hidden")) {
        loaderNote.textContent = "Das Laden dauert etwas länger. Die App kommt gleich.";
      }
    }, 6500);
  }

  reloadBtn.addEventListener("click", function () {
    loadApp(true);
  });

  loadApp(false);
})();
