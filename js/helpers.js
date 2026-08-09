window.H = {
  esc: function(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(m){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m];
    });
  },
  attr: function(s){
    return String(s == null ? "" : s).replace(/\\/g,"\\\\").replace(/'/g,"\\'");
  },
  safe: function(s){
    return String(s == null ? "" : s).replace(/[^a-zA-Z0-9]/g,"_");
  },
  date: function(v){
    if(!v) return "";
    const s = String(v);
    if(/^\d{2}\.\d{2}\.\d{4}$/.test(s)) return s;
    const d = new Date(s);
    return isNaN(d) ? s : d.toLocaleDateString("de-DE");
  }
};