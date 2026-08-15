window.Gallery = (function(){
  let images = [];
  let current = 0;
  let startX = 0, startY = 0;

  async function load(){
    const box=document.getElementById("galleryContainer"); const cached=DataCache.get("gallery");
    if(cached&&Array.isArray(cached.value)){images=cached.value;render();}
    else box.innerHTML='<div class="gallerySkeletonGrid"><div class="skeletonImage"></div><div class="skeletonImage"></div><div class="skeletonImage"></div><div class="skeletonImage"></div></div>';
    try{
      const r=await API.read("gallery");
      images=(r.items||[]).slice().sort(function(a,b){const ya=Number(a.year)||0,yb=Number(b.year)||0;if(ya!==yb)return yb-ya;return String(a.title||"").localeCompare(String(b.title||""),"de",{sensitivity:"base",numeric:true});});
      DataCache.set("gallery",images);render();
    }catch(err){if(!cached)box.innerHTML='<div class="empty">Bilder konnten momentan nicht geladen werden. Bitte später erneut versuchen.</div>';}
  }

  function render(){
    const box = document.getElementById("galleryContainer");
    const nav = document.getElementById("galleryYearNav");

    if(!images.length){
      box.innerHTML='<div class="empty">Noch keine Bilder vorhanden.</div>';
      nav.innerHTML="";
      return;
    }

    const groups = {};
    images.forEach(function(item,index){
      const year = item.year || "Rückblick";
      if(!groups[year]) groups[year] = [];
      groups[year].push({item:item,index:index});
    });

    const years = Object.keys(groups).sort(function(a,b){
      return (Number(b)||0)-(Number(a)||0);
    });

    nav.innerHTML = years.map(function(y){
      return '<button type="button" data-year="'+encodeURIComponent(y)+'" class="galleryYearNavBtn">'+H.esc(y)+'</button>';
    }).join("");

    box.innerHTML = years.map(function(y){
      const safeYear = H.safe(y);
      return '<div class="galleryYear" id="gy-'+safeYear+'">' +
        '<button class="galleryYearToggle" type="button" data-year="'+encodeURIComponent(y)+'" aria-expanded="false">' +
          '<span>📸 Straßenfest '+H.esc(y)+'</span>' +
          '<span class="galleryYearCount">'+groups[y].length+' Bilder</span>' +
          '<span class="galleryChevron" id="gy-chevron-'+safeYear+'">⌄</span>' +
        '</button>' +
        '<div class="galleryYearBody" id="gy-body-'+safeYear+'">' +
          '<div class="galleryGrid">' +
            groups[y].map(function(e){
              return '<button class="galleryItem" onclick="Gallery.open('+e.index+')">' +
                '<img src="'+H.esc(e.item.url||"")+'" loading="lazy" alt="'+H.esc(e.item.title||"")+'">' +
                '<div class="galleryCaption"><b>'+H.esc(e.item.title||"")+'</b></div>' +
              '</button>';
            }).join("") +
          '</div>' +
        '</div>' +
      '</div>';
    }).join("");

    nav.querySelectorAll(".galleryYearNavBtn").forEach(function(btn){
      btn.addEventListener("click", function(){
        openYear(decodeURIComponent(btn.getAttribute("data-year") || ""));
      });
    });

    box.querySelectorAll(".galleryYearToggle").forEach(function(btn){
      btn.addEventListener("click", function(){
        toggleYear(decodeURIComponent(btn.getAttribute("data-year") || ""));
      });
    });
  }

  function toggleYear(year){
    const body = document.getElementById("gy-body-"+H.safe(year));
    const section = document.getElementById("gy-"+H.safe(year));
    const chevron = document.getElementById("gy-chevron-"+H.safe(year));
    if(!body || !section) return;

    const isOpen = body.classList.toggle("open");
    section.classList.toggle("open", isOpen);

    const toggle = section.querySelector(".galleryYearToggle");
    if(toggle) toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if(chevron) chevron.textContent = isOpen ? "⌃" : "⌄";
  }

  function openYear(year){
    const body = document.getElementById("gy-body-"+H.safe(year));
    const section = document.getElementById("gy-"+H.safe(year));
    if(!body || !section) return;

    if(!body.classList.contains("open")) toggleYear(year);
    section.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function jump(year){ openYear(year); }
  function open(i){ if(!images.length)return; current=i; show(); document.getElementById("lightbox").classList.add("open"); preload(); }
  function show(){ const x=images[current]; document.getElementById("lbImg").src=x.fullUrl||x.url; document.getElementById("lbText").textContent=x.title||""; document.getElementById("lbCounter").textContent=(current+1)+" / "+images.length; }
  function prev(e){ if(e)e.stopPropagation(); current=(current-1+images.length)%images.length; show(); preload(); }
  function next(e){ if(e)e.stopPropagation(); current=(current+1)%images.length; show(); preload(); }
  function close(){ document.getElementById("lightbox").classList.remove("open"); }
  function preload(){ [images[(current+1)%images.length],images[(current-1+images.length)%images.length]].forEach(function(x){ if(x){const im=new Image();im.src=x.fullUrl||x.url;} }); }

  document.addEventListener("keydown",function(e){ const lb=document.getElementById("lightbox"); if(!lb.classList.contains("open"))return; if(e.key==="Escape")close(); if(e.key==="ArrowLeft")prev(e); if(e.key==="ArrowRight")next(e); });
  const lb=document.getElementById("lightbox");
  lb.addEventListener("click",function(e){ if(e.target===lb)close(); });
  lb.addEventListener("touchstart",function(e){ if(e.changedTouches.length){startX=e.changedTouches[0].screenX;startY=e.changedTouches[0].screenY;} },{passive:true});
  lb.addEventListener("touchend",function(e){ if(!e.changedTouches.length)return; const dx=e.changedTouches[0].screenX-startX,dy=e.changedTouches[0].screenY-startY; if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)){dx<0?next(e):prev(e);}else if(dy>90&&Math.abs(dy)>Math.abs(dx)){close();} },{passive:true});

  window.setTimeout(function(){ load(); }, 650);
  return {load,jump,openYear,toggleYear,open,prev,next,close};
})();