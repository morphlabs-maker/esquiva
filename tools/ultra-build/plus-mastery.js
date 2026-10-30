/* =========================================================
   KAIOKEN CLASH 3.0 — VERSIONES POR ARCO, MAESTRÍA Y EQUIPOS DE ENTRENAMIENTO
   · Versión: el mismo luchador en cada arco (Goku de la Saga Saiyajin, de Namek, de Cell…). La del primer arco es la de siempre;
     las siguientes son más fuertes (×) y empiezan con más maestría. Se desbloquean al abrir cada arco del modo historia.
   · Maestría (0-100 % por forma): menos gasto de ki y más daño con esa forma. Se gana usándola, sobre todo entrenando.
   · Entrenamiento: con Whis, sparring parejo con Vegeta, o tú y Vegeta contra Whis o contra Bills (solo esquivan y empujan;
     nadie puede caer en el entrenamiento). También se puede explorar libremente el planeta de Bills.
   ========================================================= */
/* 3.1: cada versión sale del modo historia (plus-verdata.js): poder base y formas que tiene el luchador en ese arco.
   Fuera de la historia el poder base sigue creciendo con el arco (VER_K) aunque la historia repita el mismo número. */
const VER_K={sai:1,nam:1.35,cel:1.8,buu:2.3,dai:2.6,god:3,tr:3.8,tp:5,bro:5.6,mor:6.5,gr:7.5},VER_M={sai:0,nam:5,cel:12,buu:18,dai:22,god:26,tr:32,tp:42,bro:46,mor:52,gr:60};
const arcName=id=>(ARCS.find(a=>a.id===id)||{}).name||id;
const verOpen=id=>{const i=ARCS.findIndex(a=>a.id===id);return i<=0||arcOpen(i);};
const verArcs=chId=>(VER_DATA[chId]||[]).map(v=>v.arc);
function verList(chId){return verArcs(chId).filter(verOpen);}
/* por defecto, la versión más reciente que tengas abierta */
function verOf(chId){const L=verList(chId);if(!L.length)return null;const v=prog.ver&&prog.ver[chId];return L.includes(v)?v:L[L.length-1];}
function verNear(chId,arc){const L=verArcs(chId);if(!L.length)return null;if(!arc)return L[L.length-1];const order=ARCS.map(a=>a.id),ai=order.indexOf(arc);let best=null;for(const v of L)if(order.indexOf(v)<=ai)best=v;return best||L[0];}
/* 3.2: poder base de la versión (el de la historia, que sigue creciendo con el arco), sus formas y el tope de poder del arco.
   Las formas que no salen en ninguna versión (compradas o de otros modos) solo están en la última versión del luchador. */
const VER_CACHE={};
function verInfo(chId,arc){const ck=chId+'|'+arc;if(VER_CACHE[ck])return VER_CACHE[ck];const L=VER_DATA[chId]||[],d=L.find(v=>v.arc===arc);if(!d)return null;
 const ch=CHARS[chIdx(chId)];if(!ch)return null;const b0=v=>v.base||ch.base,first=L.find(v=>b0(v)===b0(d))||d;
 let forms=d.forms.filter(id=>ch.forms.some(f=>f.id===id));if(d===L[L.length-1]){const seen=new Set(L.flatMap(v=>v.forms));forms=forms.concat(ch.forms.map(f=>f.id).filter(id=>!seen.has(id)));}
 if(!forms.length)forms=[ch.forms[0].id];
 const base=b0(d)*(VER_K[arc]||1)/(VER_K[first.arc]||1),top=Math.max(...forms.map(id=>(ch.forms.find(f=>f.id===id)||{mult:1}).mult));
 return VER_CACHE[ck]={base,forms,cap:base*top*1.36*(kkStackArc(arc)?10:1)};}
/* Kaioken encima de una transformación: desde el Universo 6 (Blue + Kaioken). Antes, solo sobre el estado base y hasta el nivel que tuviera en su arco */
const kkStackArc=arc=>!arc||ARCS.findIndex(a=>a.id===arc)>=ARCS.findIndex(a=>a.id==='tr');
function kkArcOf(f){if(f.ver)return f.ver;const B=game.story&&game.story.book;if(B&&B.kind==='arc'&&!game.story.free)return B.id;return null;}
function kkLevels(f){const arc=kkArcOf(f);if(kkStackArc(arc))return[3,10,20];if(f.form.mult>1)return[];
 const v=VER_DATA[f.ch.id]?verNear(f.ch.id,arc):null,d=v&&verInfo(f.ch.id,v);if(!d)return[];return[3,10,20].filter(n=>d.forms.includes('kk'+n));}
const verAllows=(f,i)=>!f.verIdx||f.verIdx.includes(i);
let G_VER=null;
function verApply(f,v,own){const d=verInfo(f.ch.id,v);if(!d)return;f.ver=v;f.base=d.base;f.verCap=d.cap;
 let idx=d.forms.map(id=>f.ch.forms.findIndex(x=>x.id===id)).filter(i=>i>=0);if(own)idx=idx.filter(i=>owns(f.ch,i));if(!idx.length)idx=[0];
 f.verIdx=idx;f.storyForms=idx;if(!idx.includes(f.startForm))f.startForm=idx[0];}
function verInit(f,o){f.ver=null;if(o.base||o.role==='boss'||o.role==='dummy'||game.story||game.online||game.mode==='tdp'||f.ch.model==='dragon'||!VER_DATA[f.ch.id])return;
 const mine=f.idx===0||(f.idx===1&&local2P());let v=null;if(mine){v=verOf(f.ch.id);if(f.idx===0)G_VER=v;}else v=verNear(f.ch.id,G_VER);
 /* 3.2: la forma elegida en la selección manda: si la versión no la tiene, se usa la primera versión que sí (antes empezaba en base) */
 const want=f.ch.forms[f.startForm]&&f.ch.forms[f.startForm].id;
 if(v&&want&&!verInfo(f.ch.id,v).forms.includes(want)){const L=verArcs(f.ch.id),ok=L.filter(a=>verInfo(f.ch.id,a).forms.includes(want)),order=ARCS.map(a=>a.id);
  if(ok.length)v=ok.sort((a,b)=>Math.abs(order.indexOf(a)-order.indexOf(v))-Math.abs(order.indexOf(b)-order.indexOf(v)))[0];}
 if(v)verApply(f,v,mine);}
/* ¿esta forma existe en la versión elegida? (para la selección de personaje) */
function verFormOk(ch,i){const v=verOf(ch.id);if(!v)return true;const d=verInfo(ch.id,v);return!d||d.forms.includes(ch.forms[i].id);}
const verBase=ch=>{const v=verOf(ch.id),d=v&&verInfo(ch.id,v);return d?d.base:ch.base;};
/* maestría: guardada en décimas (0-1000) por luchador y forma */
const mKey=(c,fm)=>c+'.'+fm;
const mastPct=f=>((prog.mast||{})[mKey(f.ch.id,f.form.id)]||0)/10;
function mastOf(f){return mastFormK(f,f.form);}
/* maestría de una forma concreta (0-1): la tuya (si eres humano) + la que trae la versión del arco */
function mastFormK(f,fm){if(!f||!fm||fm.mult<=1)return 0;const own=human(f)&&!game.online?((prog.mast||{})[mKey(f.ch.id,fm.id)]||0)/10:0;return clamp((own+(VER_M[f.ver]||0))/100,0,1);}
let mastSaveT=0;
function mastTick(f,dt){if(game.phase!=='fight'||!human(f)||game.online||f.state==='ko'||!f.form||f.form.mult<=1)return;
 const crew=game.mode==='train'?(TRAIN_CREWS[game.crew||'whis']||TRAIN_CREWS.whis).k:0,rate=game.mode==='train'?3*crew:.8,k=mKey(f.ch.id,f.form.id);
 prog.mast=prog.mast||{};const before=prog.mast[k]||0;prog.mast[k]=Math.min(1000,before+rate*dt*(f.state==='attack'||f.state==='special'?1.6:1));
 if(Math.floor(before/100)!==Math.floor(prog.mast[k]/100))pop(f,'MAESTRÍA '+Math.floor(prog.mast[k]/10)+' %','#9fffb0');
 f.mastK=mastOf(f);mastSaveT+=dt;if(mastSaveT>15){mastSaveT=0;saveProg();}}
/* equipos de entrenamiento */
const TRAIN_CREWS={
 whis:{name:'Con Whis',desc:'Whis de maestro: no ataca y esquiva como el Ultra Instinto. Ideal para practicar combos.',k:1},
 vegeta:{name:'Sparring con Vegeta',desc:'Pelea pareja contra Vegeta: su poder se ajusta al tuyo. Gana maestría más rápido.',k:1.4},
 duoWhis:{name:'Tú y Vegeta contra Whis',desc:'Atacad juntos a Whis. Solo esquiva y os aparta con empujones suaves.',k:1.25},
 duoBills:{name:'Tú y Vegeta contra Bills',desc:'Bills esquiva casi todo y empuja más fuerte, pero nunca os deja K.O.',k:1.3},
 free:{name:'Explorar el planeta de Bills',desc:'Sin objetivo fijo: pasea, saluda, come con ellos en la mesa o pide un combate.',k:.6}};
function trainSelHTML(){return`${backBtn()}<div class="ttl">🏋 ENTRENAMIENTO · PLANETA DE BILLS</div><div class="tip">Cuanta más maestría tenga una forma, menos ki gasta y más daño hace. Entrenar es la forma más rápida de subirla.</div>
 <div class="opts">${Object.entries(TRAIN_CREWS).map(([id,c])=>`<div class="opt" data-act="crew" data-arg="${id}"><h3>${c.name}</h3>${c.desc}</div>`).join('')}</div>
 <div class="gcol oc" style="margin-top:8px"><h3>MAESTRÍA DE ${esc(CHARS[cur[0]].name.toUpperCase())}${verOf(CHARS[cur[0]].id)?' · VERSIÓN '+esc(arcName(verOf(CHARS[cur[0]].id)).toUpperCase()):''}</h3>${CHARS[cur[0]].forms.filter(fm=>fm.mult>1).map(fm=>{const p=((prog.mast||{})[mKey(CHARS[cur[0]].id,fm.id)]||0)/10;return`<div class="grow"><span>${esc(fm.name)}</span><span class="mbar"><i style="width:${p}%"></i></span><b>${Math.floor(p)} %</b></div>`;}).join('')||'<div class="tip">Este luchador no tiene transformaciones.</div>'}</div>`;}
function trainCrewSetup(a,b){const crew=game.crew||'whis';game.crewNow=crew;if(crew==='whis'||crew==='free')return;if(crew==='spar'){sparSetup(a,b);return;}
 const vi=chIdx('vegeta');
 if(crew==='vegeta'){const v=new Fighter(1,a.ch.id==='vegeta'?chIdx('goku'):vi,{role:'p',team:1,base:a.realPower()});v.cpu=true;v.cap=1.12;b.dispose();game.f[1]=v;a.opp=v;v.opp=a;return;}
 const master=crew==='duoBills'?new Fighter(1,Object.assign({},CHARS[chIdx('bills')],{evade:.72}),{role:'dummy',team:1}):b;
 if(master!==b){b.dispose();game.f[1]=master;}master.pushy=crew==='duoBills'?1.6:1;
 const al=new Fighter(2,a.ch.id==='vegeta'?chIdx('goku'):vi,{role:'p',team:0,base:a.realPower()});al.cpu=true;al.opp=master;a.opp=master;master.opp=a;game.f.push(al);}
function trainHudExtra(){if(game.f.length<3)return;const el=$('#pp0');if(!el||$('#hc2'))return;el.insertAdjacentHTML('beforeend',`<div style="display:none">${memHud(2,false,' sm')}</div>`);
 const tag=document.createElement('div');tag.className='trainally';tag.id='tally';el.appendChild(tag);}
/* el maestro (Whis o Bills) solo esquiva y empuja: quita muy poca vida y nunca deja K.O. */
function trainStep(dt){if(game.mode!=='train'||game.phase!=='fight')return;const M=game.f.find(f=>f.role==='dummy');
 if(M&&M.pushy){M.pushT=(M.pushT??2)-dt;if(M.pushT<=0){M.pushT=rand(2.2,3.8)/M.pushy;const near=game.f.filter(f=>f.team!==M.team&&f.state!=='ko'&&f.pos.distanceTo(M.pos)<5.5).sort((x,y)=>x.pos.distanceTo(M.pos)-y.pos.distanceTo(M.pos))[0];
  if(near){M.face=Math.atan2(near.pos.x-M.pos.x,near.pos.z-M.pos.z);M.model.target='punchR';const hp=near.hp;applyHit(M,near,{kind:'heavy',base:20,knock:14*M.pushy,up:.25,stun:.25});near.hp=Math.max(1,Math.max(near.hp,hp-near.maxHp*.02*M.pushy));pop(M,M.ch.id==='bills'?'«Demasiado lento»':'«Ho ho ho»','#e8f0ff');}}}
 const al=game.f[2],t=$('#tally');if(al&&t)t.textContent=al.ch.name.toUpperCase()+' (ALIADO) '+Math.round(al.hp/al.maxHp*100)+' %';
 if(game.crewNow==='free')freeRoamStep(dt);}
Object.assign(ACTIONS,{crew:a=>{if(!TRAIN_CREWS[a])return;game.crew=a;game.crewPicked=true;sfx('ok');startFromGuide();},
 verPick:a=>{const [ci,d]=String(a).split(':'),ch=CHARS[+ci];if(!ch)return;const L=verList(ch.id);if(!L.length)return;const i=L.indexOf(verOf(ch.id));prog.ver=prog.ver||{};prog.ver[ch.id]=L[(i+(+d||1)+L.length)%L.length];saveProg();sfx('sel');renderMenu();}});
