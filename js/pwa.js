window.PWA = (function(){
  function register(){
    if(!("serviceWorker" in navigator)) return;

    window.addEventListener("load", function(){
      navigator.serviceWorker.register("./sw.js", {updateViaCache:"none"})
        .then(function(reg){
          reg.update().catch(function(){});
        })
        .catch(function(err){
          console.warn("Service Worker konnte nicht registriert werden:", err);
        });
    });
  }

  register();
  return {};
})();