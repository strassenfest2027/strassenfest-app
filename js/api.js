window.API = (function(){
  let seq = 0;
  function sleep(ms){ return new Promise(function(resolve){ setTimeout(resolve, ms); }); }
  function singleCall(action, params, timeoutMs){
    params = params || {}; timeoutMs = timeoutMs || 15000;
    return new Promise(function(resolve, reject){
      const cb = "__sf_cb_" + Date.now() + "_" + (++seq);
      const script = document.createElement("script");
      const base = window.STRASSENFEST_CONFIG.API_URL;
      const query = new URLSearchParams(Object.assign({}, params, {v9api:"1",action:action,callback:cb,_:Date.now()}));
      let finished=false;
      const timer=setTimeout(function(){ if(finished)return; finished=true; cleanup(); reject(new Error("Zeitüberschreitung beim Laden.")); }, timeoutMs);
      window[cb]=function(data){ if(finished)return; finished=true; clearTimeout(timer); cleanup(); if(data&&data.ok!==false)resolve(data); else reject(new Error((data&&data.error)||"Unbekannter Serverfehler")); };
      function cleanup(){ try{delete window[cb];}catch(e){window[cb]=undefined;} if(script.parentNode)script.parentNode.removeChild(script); }
      script.onerror=function(){ if(finished)return; finished=true; clearTimeout(timer); cleanup(); reject(new Error("Verbindung zum Datenserver fehlgeschlagen.")); };
      script.src=base+(base.indexOf("?")>=0?"&":"?")+query.toString(); document.head.appendChild(script);
    });
  }
  async function call(action, params, options){
    options=options||{}; const retries=typeof options.retries==='number'?options.retries:0; const timeoutMs=options.timeoutMs||15000; const delays=options.delays||[1000,2000,4000]; let lastError;
    for(let attempt=0; attempt<=retries; attempt++){
      try{return await singleCall(action,params,timeoutMs);}catch(err){lastError=err;if(attempt>=retries)break;await sleep(delays[Math.min(attempt,delays.length-1)]||1000);}
    }
    throw lastError||new Error("Daten konnten nicht geladen werden.");
  }
  return {
    call:call,
    read:function(action,params){return call(action,params,{retries:3,timeoutMs:12000,delays:[1000,2000,4000]});},
    write:function(action,params){return call(action,params,{retries:0,timeoutMs:18000});}
  };
})();