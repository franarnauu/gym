const C='gym-v10';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  const fonts=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(u.origin!==location.origin&&!fonts)return;
  if(fonts){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const cp=x.clone();caches.open(C).then(c=>c.put(r,cp));return x})));return}
  e.respondWith(fetch(r).then(x=>{if(x.ok){const cp=x.clone();caches.open(C).then(c=>c.put(r,cp))}return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
