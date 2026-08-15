window.Help = (function(){
  const modal = document.getElementById("helpModal");

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

  if(modal){
    modal.addEventListener("click", function(e){
      if(e.target === modal) close();
    });
  }

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && modal && modal.classList.contains("open")) close();
  });

  return {open:open,close:close};
})();