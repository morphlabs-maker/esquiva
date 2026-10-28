/* ---------------- Guardado versionado (2.0) ----------------
   Versión 4 del progreso. Nunca se borra nada de versiones anteriores: monedas, formas compradas, victorias y apodo se conservan.
   · Antes de migrar se guarda una copia de seguridad (kc_prog_bak3).
   · Las técnicas genéricas de antes se retiran y se devuelven sus monedas (una sola vez, campo «refunded»).
   · Todo se valida al leer: el almacenamiento se puede manipular. */
const SAVE_V=4;
const idOk=s=>typeof s==='string'&&/^[A-Za-z0-9_]{1,24}$/.test(s);
const idList=(a,ok=()=>true,max=600)=>Array.isArray(a)?[...new Set(a.filter(x=>idOk(x)&&ok(x)))].slice(0,max):[];
const nOk=(v,max)=>Number.isFinite(v)?clamp(Math.floor(v),0,max):0;
const objNum=(o,max,okKey=idOk,maxKeys=400)=>{const r={};if(o&&typeof o==='object'&&!Array.isArray(o)){let n=0;for(const k in o){if(!okKey(k)||n++>maxKeys)continue;const v=nOk(o[k],max);if(v)r[k]=v;}}return r;};
function cleanPlus(p,d){
 d.sv=SAVE_V;
 /* reembolso de las técnicas genéricas compradas antes de la 2.0 */
 d.rfMsg=nOk(p.rfMsg,1e7);
 if(!p.refunded&&Array.isArray(p.tech)){let r=0;for(const id of new Set(p.tech)){const t=OLD_TECHS.find(x=>x.id===id);if(t)r+=t.price;}if(r){d.coins=Math.min(1e7,d.coins+r);d.rfMsg+=r;}}
 d.refunded=1;d.tech=idList(p.tech,id=>OLD_TECHS.some(t=>t.id===id)); /* se conservan para Kaioken Clash Ultra, que comparte el guardado */
 d.sig=idList(p.sig,id=>TECHS.some(t=>t.id===id));
 d.ofOwn=idList(p.ofOwn,id=>OUTFITS.some(o=>o.id===id));
 d.ofEq={};if(p.ofEq&&typeof p.ofEq==='object')for(const k in p.ofEq){const v=p.ofEq[k];if(/^[a-z0-9]{1,16}$/.test(k)&&d.ofOwn.includes(v)&&OUTFITS.find(o=>o.id===v).who===k)d.ofEq[k]=v;}
 d.unl=idList(p.unl,id=>CHARS.some(c=>c.id===id&&c.unlock));
 const st=p.story&&typeof p.story==='object'?p.story:{};
 d.story={c:objNum(st.c,3),seen:idList(st.seen),best:objNum(st.best,99999)};
 d.wi=objNum(p.wi,3);
 d.db=Array.isArray(p.db)?[...new Set(p.db.filter(n=>Number.isInteger(n)&&n>=1&&n<=7))]:[];
 d.ach=idList(p.ach,id=>ACHS.some(a=>a.id===id));
 d.title=idOk(p.title)&&d.ach.includes(p.title)?p.title:'';
 d.stats=objNum(p.stats,1e9);if(!d.stats.win&&d.wins)d.stats.win=d.wins; /* las victorias de antes cuentan para los logros */
 const c=p.chal&&typeof p.chal==='object'?p.chal:{};
 d.chal={d:typeof c.d==='string'?c.d.slice(0,12):'',w:typeof c.w==='string'?c.w.slice(0,12):'',p:objNum(c.p,1e6,k=>/^[dw]:[A-Za-z0-9_]{1,16}$/.test(k)),cl:Array.isArray(c.cl)?c.cl.filter(k=>typeof k==='string'&&/^[dw]:[A-Za-z0-9_]{1,16}$/.test(k)).slice(0,20):[]};
 d.sdiff=Number.isInteger(p.sdiff)&&p.sdiff>=0&&p.sdiff<4?p.sdiff:1;
 return d;}
/* copia de seguridad de la partida anterior a la 2.0 (solo la primera vez) */
(()=>{try{const v=localStorage.getItem('kc_prog');if(v&&!localStorage.getItem('kc_prog_bak3')){const o=JSON.parse(v);if(!o||!o.sv)localStorage.setItem('kc_prog_bak3',v);}}catch(e){}})();
/* Código de transferencia: la partida entera en texto (sin servidor). Se importa en otro iPhone y se fusiona sin perder nada. */
function hash32(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0).toString(36);}
function exportCode(){const j=JSON.stringify(prog),b=btoa(unescape(encodeURIComponent(j)));return'KC2-'+hash32(b)+'-'+b;}
function parseCode(code){const s=String(code||'').replace(/\s+/g,'');const m=/^KC2-([0-9a-z]+)-([A-Za-z0-9+/=]+)$/.exec(s);if(!m||hash32(m[2])!==m[1])return null;
 try{return cleanProg(JSON.parse(decodeURIComponent(escape(atob(m[2])))));}catch(e){return null;}}
/* Fusiona dos partidas quedándose con lo mejor de cada una (nada se pierde) */
function mergeProg(a,b){const u=(x,y)=>[...new Set([...(x||[]),...(y||[])])],mx=(x,y)=>{const r=Object.assign({},x);for(const k in y)r[k]=Math.max(r[k]||0,y[k]);return r;};
 const r=cleanProg(a);r.coins=Math.max(a.coins,b.coins);r.earned=Math.max(a.earned,b.earned,r.coins);r.wins=Math.max(a.wins,b.wins);r.nick=a.nick||b.nick;
 for(const k in b.own)r.own[k]=u(a.own[k],b.own[k]);
 r.sig=u(a.sig,b.sig);r.ofOwn=u(a.ofOwn,b.ofOwn);r.unl=u(a.unl,b.unl);r.ach=u(a.ach,b.ach);r.db=u(a.db,b.db);
 r.story={c:mx(a.story.c,b.story.c),seen:u(a.story.seen,b.story.seen),best:mx(a.story.best,b.story.best)};r.wi=mx(a.wi,b.wi);r.stats=mx(a.stats,b.stats);
 r.eq=Object.assign({},b.eq,a.eq);r.ofEq=Object.assign({},b.ofEq,a.ofEq);r.title=a.title||b.title;return cleanProg(r);}
