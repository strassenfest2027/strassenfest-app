window.AdminHelp = (function(){
  const modal = document.getElementById("adminHelpModal");

  function open(){
    if(!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("modalOpen");
  }

  function close(){
    if(!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modalOpen");
  }

  function ensureButton(){
    const results = document.getElementById("adminResults");
    if(!results || document.getElementById("adminHelpButton")) return;

    const btn = document.createElement("button");
    btn.id = "adminHelpButton";
    btn.type = "button";
    btn.className = "adminHelpButton";
    btn.innerHTML = "❓ Anleitung für Administratoren";
    btn.onclick = open;

    results.insertBefore(btn, results.firstChild);
  }

  if(modal){
    modal.addEventListener("click", function(e){
      if(e.target === modal) close();
    });
  }

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && modal && modal.classList.contains("open")) close();
  });

  return {open:open,close:close,ensureButton:ensureButton};
})();