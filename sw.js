// Caja Mati: guarda la app para que abra sin internet. Cambiar VERSION en cada publicación.
const VERSION="caja-mati-v10";
const APP=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(APP)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION&&k!=="fonts").map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET")return;
  if(u.hostname.includes("script.google")||u.hostname.includes("googleusercontent"))return; // la sincronización va siempre a la red
  if(u.hostname.startsWith("fonts.")){e.respondWith(caches.open("fonts").then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n}).catch(()=>r))));return}
  if(u.origin!==location.origin)return;
  // la app: primero la red (para tomar la versión nueva), si no hay, la copia guardada
  e.respondWith(fetch(e.request).then(n=>{const cp=n.clone();caches.open(VERSION).then(c=>c.put(e.request,cp));return n}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))))});
