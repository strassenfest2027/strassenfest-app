window.API = (function(){
  let seq = 0;

  function call(action, params){
    params = params || {};
    return new Promise(function(resolve, reject){
      const cb = "__sf_cb_" + Date.now() + "_" + (++seq);
      const script = document.createElement("script");
      const base = window.STRASSENFEST_CONFIG.API_URL;
      const query = new URLSearchParams(Object.assign({}, params, {
        v9api: "1",
        action: action,
        callback: cb,
        _: Date.now()
      }));

      window[cb] = function(data){
        cleanup();
        if(data && data.ok !== false) resolve(data);
        else reject(new Error((data && data.error) || "Unbekannter Serverfehler"));
      };

      function cleanup(){
        try{ delete window[cb]; }catch(e){ window[cb] = undefined; }
        if(script.parentNode) script.parentNode.removeChild(script);
      }

      script.onerror = function(){
        cleanup();
        reject(new Error("Verbindung zum Datenserver fehlgeschlagen."));
      };

      script.src = base + (base.indexOf("?") >= 0 ? "&" : "?") + query.toString();
      document.head.appendChild(script);

      setTimeout(function(){
        if(window[cb]){
          cleanup();
          reject(new Error("Zeitüberschreitung beim Laden."));
        }
      }, 20000);
    });
  }

  return { call: call };
})();