window.Admin = (function(){
  let summary = null;

  function toggle(){
    const p=document.getElementById("adminPanel");
    p.style.display=p.style.display==="block"?"none":"block";
  }

  async function load(){
    const pin=document.getElementById("pin").value;
    document.getElementById("adminStatus").textContent="Lade …";
    try{
      const r=await API.call("summary",{pin:pin});
      summary=r.summary;
      document.getElementById("adminResults").style.display="block";
      document.getElementById("adminStatus").textContent="✅ Geladen";
      renderShopping(); renderOpen(); renderParticipants();
    }catch(err){ document.getElementById("adminStatus").textContent="❌ "+err.message; }
  }

  function renderShopping(){
    const t=summary.totals||{};
    document.getElementById("shoppingList").innerHTML=Object.keys(t).map(function(k){return '<div class="row"><b>'+H.esc(k)+'</b><span style="float:right;font-weight:900">'+H.esc(t[k])+'</span></div>';}).join("");
  }

  function renderOpen(){
    const rows=(summary.entries||[]).filter(function(e){return !e.isDone;});
    document.getElementById("adminOpenList").innerHTML=rows.length?rows.map(function(e){return '<div class="row"><b>⏳ '+H.esc(e.key)+'</b><br><small>'+H.esc(e.family||"")+'</small></div>';}).join(""):'<div class="empty">Alle haben reagiert. ✅</div>';
  }

  function renderParticipants(){
    if(!summary)return;
    const q=String(document.getElementById("search").value||"").toLowerCase();
    const order={"Kommt":1,"Noch offen":2,"Kommt nicht":3};
    const rows=(summary.entries||[]).filter(function(e){return String(e.key+" "+e.family+" "+e.bring).toLowerCase().includes(q);}).sort(function(a,b){return (order[a.attendance]||9)-(order[b.attendance]||9)||String(a.key).localeCompare(String(b.key),"de");});
    document.getElementById("participants").innerHTML=rows.map(function(e){
      const st=e.attendance==="Kommt"?'<span class="statusPill sOk">✅ kommt ('+H.esc(e.persons)+' Pers.)</span>':e.attendance==="Kommt nicht"?'<span class="statusPill sNo">❌ kommt nicht</span>':'<span class="statusPill sOpen">⏳ offen</span>';
      const pills=Object.keys(e.items||{}).filter(function(k){return Number(e.items[k])>0;}).map(function(k){return '<span class="pill">'+H.esc(k)+': '+H.esc(e.items[k])+'</span>';}).join("");
      return '<div class="row"><b>🏠 '+H.esc(e.key)+'</b> '+st+'<br><small>'+H.esc(e.family||"")+'</small><div>'+pills+'</div>'+(e.bring?'<div>🥗 '+H.esc(e.bring)+'</div>':'')+(e.lastSaved?'<small>🕒 '+H.esc(e.lastSaved)+'</small>':'')+'</div>';
    }).join("");
  }

  return {toggle,load,renderParticipants};
})();