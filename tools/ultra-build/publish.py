# Prepara el repo: los dos juegos como apps instalables que se actualizan solas
import json,os,time,sys;D=os.path.dirname(os.path.abspath(__file__))+'/'
from PIL import Image,ImageDraw
R=D+'../../';K=D+'out/'
V=time.strftime('%Y%m%d%H%M%S')
OLD_SW="<script>if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));</script>"
UPD=("<script>/* Actualización automática: el service worker busca la versión nueva en cada apertura; si cambió y no estás en plena pelea, se recarga sola */\n"
"(function(){const V='"+V+"',ok='serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1');if(!ok)return;\n"
"let reg=null,pend=false;const busy=()=>{try{return typeof game!=='undefined'&&!!game.phase&&game.phase!=='over'&&typeof menuState!=='undefined'&&!menuState;}catch(e){return false;}};\n"
"const go=()=>{try{if(sessionStorage.getItem('kc_upd')===V+'>'+pend)return;sessionStorage.setItem('kc_upd',V+'>'+pend);}catch(e){}location.reload();};\n"
"const chk=()=>{if(reg)reg.update().catch(()=>{});fetch('version.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(j=>{if(j&&j.v&&j.v!==V){pend=j.v;if(!busy())go();}}).catch(()=>{});};\n"
"addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').then(r=>{reg=r;}).catch(()=>{});setTimeout(chk,2500);});\n"
"document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')chk();});setInterval(()=>{if(pend&&!busy())go();else chk();},60000);})();</script>")
def must(s,a,n=1):
    if s.count(a)!=n: sys.exit('COUNT %d for %s'%(s.count(a),a[:80]))
# --- Ultra
u=open(K+'ultra.html',encoding='utf8').read()
must(u,OLD_SW);u=u.replace(OLD_SW,UPD)
must(u,'<link rel="manifest" href="manifest.json">');u=u.replace('<link rel="manifest" href="manifest.json">','<link rel="manifest" href="manifest-ultra.json">')
must(u,'<link rel="apple-touch-icon" href="icon-180.png">');u=u.replace('<link rel="apple-touch-icon" href="icon-180.png">','<link rel="apple-touch-icon" href="icon-ultra-180.png">')
open(R+'ultra.html','w',encoding='utf8').write(u)
# --- Clásico: cámara más cerca y actualización automática
c=open(K+'index.html',encoding='utf8').read()  # generado por classic.py desde la v1.8
if OLD_SW in c: c=c.replace(OLD_SW,UPD)
else:
    i=c.index("<script>/* Actualización automática");j=c.index('</script>',i)+9;c=c[:i]+UPD+c[j:]
a="const dy=Math.abs(a.pos.y-b.pos.y),dist=5.5+sep*.7+dy*.4;const tp=mid.clone().addScaledVector(n,dist).add(V3(0,1.9+sep*.12,0));"
if a in c: c=c.replace(a,"const CZ=coarse?.72:.84,dy=Math.abs(a.pos.y-b.pos.y),dist=(3.6+sep*.52+dy*.3)*CZ;const tp=mid.clone().addScaledVector(n,dist).add(V3(0,1.5+sep*.09,0));")
a="addScaledVector(to,-7*a.giant).addScaledVector(r,-1.8).add(V3(0,2.8*a.giant,0));"
if a in c: c=c.replace(a,"addScaledVector(to,-5.2*a.giant).addScaledVector(r,-1.5).add(V3(0,2.2*a.giant,0));")
open(R+'index.html','w',encoding='utf8').write(c)
# --- iconos de Ultra (retrato de Goku con marco naranja)
im=Image.open(R+'portraits/goku.webp').convert('RGB');w,h=im.size;s=min(w,h);im=im.crop(((w-s)//2,0,(w-s)//2+s,s))
for n in (180,192,512):
    t=im.resize((n,n),Image.LANCZOS);d=ImageDraw.Draw(t);b=max(4,n//24);d.rectangle([0,0,n-1,n-1],outline=(255,138,30),width=b);t.save(R+'icon-ultra-%d.png'%n)
json.dump({"name":"Kaioken Clash Ultra","short_name":"Kaioken Ultra","id":"ultra.html","start_url":"ultra.html","scope":"./","display":"fullscreen","orientation":"landscape","background_color":"#03050b","theme_color":"#03050b",
 "icons":[{"src":"icon-ultra-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-ultra-512.png","sizes":"512x512","type":"image/png"}]},open(R+'manifest-ultra.json','w'),indent=1,ensure_ascii=False)
m=json.load(open(R+'manifest.json'));m['id']='./';json.dump(m,open(R+'manifest.json','w'),indent=1,ensure_ascii=False)
json.dump({"v":V},open(R+'version.json','w'))
# --- service worker: red primero (siempre la última versión con internet), caché sin internet
files=['./','index.html','ultra.html','manifest.json','manifest-ultra.json','icon-180.png','icon-192.png','icon-512.png','icon-ultra-180.png','icon-ultra-192.png','icon-ultra-512.png',
 'vendor/three.min.js','vendor/peerjs.min.js']+['fonts/'+f for f in sorted(os.listdir(R+'fonts'))]+['portraits/'+f for f in sorted(os.listdir(R+'portraits'))]
sw="""/* Kaioken Clash y Kaioken Clash Ultra: con internet siempre se carga la última versión publicada; sin internet se juega con la copia guardada. */
const C='kaioken-%s';
const F=%s;
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>fetch(u,{cache:'reload'}).then(r=>{if(r.ok)return c.put(u,r);}).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k.startsWith('kaioken')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
const timeout=(p,ms)=>new Promise((ok,no)=>{const t=setTimeout(()=>no(new Error('timeout')),ms);p.then(r=>{clearTimeout(t);ok(r);},e=>{clearTimeout(t);no(e);});});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);if(u.origin!==location.origin)return;
 if(u.pathname.endsWith('version.json'))return;
 e.respondWith(timeout(fetch(q,{cache:'no-cache'}),6000).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(q,cp));}return r;})
  .catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||(q.mode==='navigate'?caches.match(u.pathname.endsWith('ultra.html')?'ultra.html':'index.html'):undefined)).then(r=>r||Response.error())));});
"""%(V,json.dumps(files))
open(R+'sw.js','w',encoding='utf8').write(sw)
print('publish ok',V)
