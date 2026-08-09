window.Strassenfest = window.Strassenfest || {};

Strassenfest.getConfig = function () {
  return window.STRASSENFEST_CONFIG || {};
};

Strassenfest.getAppUrl = function () {
  return String(Strassenfest.getConfig().APP_URL || "").trim();
};

Strassenfest.isConfigured = function () {
  const url = Strassenfest.getAppUrl();
  return /^https:\/\//i.test(url);
};

Strassenfest.withCacheBuster = function (url) {
  return url + (url.includes("?") ? "&" : "?") + "pwaReload=" + Date.now();
};
