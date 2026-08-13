window.DataCache = (function(){
  const PREFIX="strassenfest_v10_1_";
  function k(name){return PREFIX+name;}
  function set(name,value){try{localStorage.setItem(k(name),JSON.stringify({savedAt:Date.now(),value:value}));}catch(e){}}
  function get(name){try{const raw=localStorage.getItem(k(name));return raw?JSON.parse(raw):null;}catch(e){return null;}}
  function remove(name){try{localStorage.removeItem(k(name));}catch(e){}}
  return {set:set,get:get,remove:remove};
})();