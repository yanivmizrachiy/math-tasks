(function(){
  const ts=document.getElementById("ts");
  if(ts){ ts.textContent = new Date().toLocaleString("he-IL"); }
  const btn=document.getElementById("themeBtn");
  const LSKEY="theme";
  function apply(t){ document.documentElement.dataset.theme=t; if(t==="dark"){document.documentElement.style.setProperty("--bg","#0b0e11");document.documentElement.style.setProperty("--fg","#e6e6e6");document.documentElement.style.setProperty("--card","#11161b")} else {document.documentElement.style.removeProperty("--bg");document.documentElement.style.removeProperty("--fg");document.documentElement.style.removeProperty("--card")}}
  const saved=localStorage.getItem(LSKEY);
  if(saved){ apply(saved); }
  if(btn){ btn.onclick=()=>{ const next=(document.documentElement.dataset.theme==="dark"?"light":"dark"); localStorage.setItem(LSKEY,next); apply(next); }; }
  if("serviceWorker" in navigator){ navigator.serviceWorker.register("./sw.js").catch(()=>{}); }
})();
