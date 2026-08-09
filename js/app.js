window.App = (function(){
  let data = { households:[], foods:[], dashboard:{} };
  let selectedKey = "";
  let items = {};
  let attendance = "Noch offen";
  let persons = 0;

  async function boot(){
    try{
      const res = await API.call("bootstrap");
      data = res;

      renderHeader();
      renderDashboard(res.dashboard || {});

      window.requestAnimationFrame(function(){
        renderHouses();
        renderFoods();
        resetItems();
        setAttendance("Noch offen");
      });
    }catch(err){
      renderLoadError(err);
    }
  }

  function renderLoadError(err){
    document.getElementById("bringList").innerHTML =
      '<div class="empty">Daten konnten nicht geladen werden. Bitte Seite neu laden.</div>';
    document.getElementById("houseGrid").innerHTML =
      '<div class="empty">Hausnummern konnten nicht geladen werden.</div>';
    document.getElementById("foodList").innerHTML =
      '<div class="empty">Speisen konnten nicht geladen werden.</div>';
    console.error(err);
  }

  function renderHeader(){
    const ev = data.event || {};
    document.getElementById("eventTitle").textContent = ev.title || "3. Straßenfest 2027";
    document.getElementById("eventSubtitle").textContent = ev.subtitle || "Anmeldung & Essensliste";
    document.getElementById("eventSlogan").textContent = ev.slogan || "";
    document.getElementById("mainDate").textContent = H.date(ev.mainDate);
    document.getElementById("backupDate").textContent = H.date(ev.backupDate);
  }

  function renderDashboard(d){
    const s = d.stats || {};
    document.getElementById("statPersons").textContent = s.totalPersons || 0;
    document.getElementById("statDone").textContent = (s.householdsDone || 0)+"/"+(s.householdsTotal || 0);
    document.getElementById("statFood").textContent = s.totalPortions || 0;
    document.getElementById("statBring").textContent = (d.brings || []).length;
    const list = d.brings || [];
    document.getElementById("bringList").innerHTML = list.length
      ? list.map(function(x){ return '<div class="mini"><b>🥗 '+H.esc(x.bring)+'</b><small>'+H.esc(x.key)+' · '+H.esc(x.family||"")+'</small></div>'; }).join("")
      : '<div class="empty">Noch nichts eingetragen.</div>';
  }

  async function refreshDashboard(){
    try{ const r = await API.call("dashboard"); renderDashboard(r.dashboard || {}); }
    catch(err){ alert(err.message); }
  }

  function renderHouses(){
    document.getElementById("houseGrid").innerHTML = (data.households || []).map(function(h){
      return '<button class="house" id="h-'+H.safe(h.key)+'" onclick="App.selectHouse(decodeURIComponent(\''+encodeURIComponent(h.key)+'\'))"><b>🏠 '+H.esc(h.key)+'</b><span>👨‍👩‍👧‍👦 '+H.esc(h.family||"")+'</span></button>';
    }).join("");
  }

  function renderFoods(){
    document.getElementById("foodList").innerHTML = (data.foods || []).map(function(f){
      return '<div class="food"><b>'+H.esc(f)+'</b><div class="qty"><button onclick="App.changeItem(decodeURIComponent(\''+encodeURIComponent(f)+'\'),-1)">−</button><div class="count" id="c-'+H.safe(f)+'">0</div><button onclick="App.changeItem(decodeURIComponent(\''+encodeURIComponent(f)+'\'),1)">+</button></div></div>';
    }).join("");
  }

  function resetItems(){
    items = {};
    (data.foods || []).forEach(function(f){ items[f] = 0; });
    updateItemCounts();
  }

  async function selectHouse(key){
    selectedKey = key;
    document.querySelectorAll(".house").forEach(function(b){ b.classList.remove("active"); });
    const btn = document.getElementById("h-"+H.safe(key)); if(btn) btn.classList.add("active");
    const hh = (data.households || []).find(function(x){ return x.key === key; });
    const box = document.getElementById("selectedBox");
    box.style.display = "block";
    box.textContent = "Ausgewählt: "+key+(hh && hh.family ? " – "+hh.family : "");
    status("Lade Eintrag …");

    try{
      const r = await API.call("entry", {key:key});
      const e = r.entry || {};
      items = e.items || {};
      (data.foods || []).forEach(function(f){ if(typeof items[f] === "undefined") items[f] = 0; });
      attendance = e.attendance || "Noch offen";
      persons = Number(e.persons || 0);
      document.getElementById("bring").value = e.bring || "";
      updateItemCounts(); updateAttendanceButtons(); updatePersons();
      status(e.lastSaved ? "Zuletzt gespeichert: "+e.lastSaved : "");
    }catch(err){ status("❌ "+err.message); }
  }

  function setAttendance(v){
    attendance = v;
    if(v === "Kommt nicht"){ persons = 0; resetItems(); }
    updateAttendanceButtons(); updatePersons();
  }

  function updateAttendanceButtons(){
    [["btnKommt","Kommt"],["btnNein","Kommt nicht"],["btnOffen","Noch offen"]].forEach(function(x){
      document.getElementById(x[0]).classList.toggle("active",attendance === x[1]);
    });
  }

  function changePersons(d){
    if(attendance === "Kommt nicht") return;
    persons = Math.max(0,Math.min(20,persons+d));
    if(persons > 0 && attendance === "Noch offen") attendance = "Kommt";
    updateAttendanceButtons(); updatePersons();
  }

  function updatePersons(){ document.getElementById("persons").textContent = persons; }

  function changeItem(food,d){
    if(!selectedKey){ alert("Bitte zuerst Hausnummer/Familie auswählen."); return; }
    if(attendance === "Kommt nicht"){ alert("Bei Absage bitte keine Essenswünsche eintragen."); return; }
    items[food] = Math.max(0,Math.min(20,Number(items[food]||0)+d));
    if(items[food] > 0 && attendance === "Noch offen") attendance = "Kommt";
    updateAttendanceButtons(); updateItemCounts();
  }

  function updateItemCounts(){
    (data.foods || []).forEach(function(f){
      const el = document.getElementById("c-"+H.safe(f)); if(el) el.textContent = items[f] || 0;
    });
  }

  async function save(){
    if(!selectedKey){ alert("Bitte zuerst Hausnummer/Familie auswählen."); return; }
    status("Speichere …");
    try{
      const payload = {key:selectedKey,attendance:attendance,persons:persons,items:items,bring:document.getElementById("bring").value};
      const r = await API.call("save",{payload:JSON.stringify(payload)});
      status("✅ Gespeichert. Danke!");
      if(r.result && r.result.dashboard) renderDashboard(r.result.dashboard);
      else refreshDashboard();
    }catch(err){ status("❌ Fehler beim Speichern: "+err.message); }
  }

  function status(t){ document.getElementById("status").textContent = t || ""; }

  boot();

  return {refreshDashboard,selectHouse,setAttendance,changePersons,changeItem,save};
})();