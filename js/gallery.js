window.Gallery = (function(){
  let images = [];
  let current = 0;
  let startX = 0, startY = 0;

  async function load(){
    const box = document.getElementById("galleryContainer");
    box.innerHTML = '<div class="skeleton">Bilder werden geladen …</div>';
    try{
      const r = await API.call("gallery");
      images = (r.items || []).slice().sort(function(a,b){
        const ya = Number(a.year)||0, yb = Number(b.year)||0;
        if(ya !== yb) return yb - ya;
        return String(a.title||"").localeCompare(String(b.title||""),"de",{sensitivity:"base",numeric:true});
      });
      render();
    }catch(err){
      box.innerHTML = '<div class="empty">Bilder konnten nicht geladen werden: '+H.esc(err.message)+'</div>';
    }
  }

  function render(){
    const box = document.getElementById("galleryContainer");
    const nav = document.getElementById("galleryYearNav");
    if(!images.length){ box.innerHTML='<div class="empty">Noch keine Bilder vorhanden.</div>'; nav.innerHTML=""; return; }

    const groups = {};
    images.forEach(function(item,index){
      const year = item.year || "Rückblick";
      if(!groups[year]) groups[year] = [];
      groups[year].push({item,index});
    });
    const years = Object.keys(groups).sort(function(a,b){ return (Number(b)||0)-(Number(a)||0); });
    nav.innerHTML = years.map(function(y){ return '<button onclick="Gallery.jump(decodeURIComponent(\''+encodeURIComponent(y)+'\'))">'+H.esc(y)+'</button>'; }).join("");
    box.innerHTML = years.map(function(y){
      return '<div class="galleryYear" id="gy-'+H.safe(y)+'"><div class="galleryYearHead"><h3>📸 Straßenfest '+H.esc(y)+'</h3></div><div class="galleryGrid">'+groups[y].map(function(e){
        return '<button class="galleryItem" onclick="Gallery.open('+e.index+')"><img src="'+H.esc(e.item.url||"")+'" loading="lazy" alt="'+H.esc(e.item.title||"")+'"><div class="galleryCaption"><b>'+H.esc(e.item.title||"")+'</b></div></button>';
      }).join("")+'</div></div>';
    }).join("");
  }

  function jump(year){ const el=document.getElementById("gy-"+H.safe(year)); if(el)el.scrollIntoView({behavior:"smooth",block:"start"}); }
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
  return {load,jump,open,prev,next,close};
})();