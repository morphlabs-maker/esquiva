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
/* 3.2c: el rival (CPU o 2P) tiene su propia versión (prog.ver2); por defecto, la más cercana al arco de tu luchador */
function verOfSide(chId,side){if(!side)return verOf(chId);const L=verList(chId);if(!L.length)return null;const v=prog.ver2&&prog.ver2[chId];if(L.includes(v))return v;
 const me=typeof cur!=='undefined'&&CHARS[cur[0]]?verOf(CHARS[cur[0]].id):null;const n=verNear(chId,me);return L.includes(n)?n:L[L.length-1];}
/* 3.2c: la versión se nota en el combate: los arcos antiguos son más lentos, cargan menos ki, sus ataques son más pequeños y empujan menos;
   en la Saga Saiyajin no hay teletransporte. Sin versión (online, jefes…) todo queda igual (×1). */
const verTArc=arc=>{const i=ARCS.findIndex(a=>a.id===arc);return i<0?null:i/(ARCS.length-1);};
const vtLerp=(t,a,b)=>t==null?1:a+(b-a)*t;
function verT(f){if(!f)return null;if(f._vtK!==undefined)return f._vtK;let arc=f.ver;if(!arc){const B=game.story&&game.story.book;if(B&&B.kind==='arc')arc=B.id;}return f._vtK=arc?verTArc(arc):null;}
const vtk=(f,a,b)=>vtLerp(verT(f),a,b);
/* tope de la dificultad: si el rival es de un arco más fuerte, la diferencia de versión no se recorta */
const verGap=f=>f&&f.opp&&f.verCap&&f.opp.verCap?Math.max(1,f.verCap/f.opp.verCap):1;
function verNear(chId,arc){const L=verArcs(chId);if(!L.length)return null;if(!arc)return L[L.length-1];const order=ARCS.map(a=>a.id),ai=order.indexOf(arc);let best=null;for(const v of L)if(order.indexOf(v)<=ai)best=v;return best||L[0];}
/* 3.2: poder base de la versión (el de la historia, que sigue creciendo con el arco), sus formas y el tope de poder del arco.
   Las formas que no salen en ninguna versión (compradas o de otros modos) solo están en la última versión del luchador. */
const VER_CACHE={};
/* 3.3b: cada forma vale su poder de la historia en el arco donde aparece (o en el arco que fijó el jugador, VER_PIN) y desde ahí crece con cada arco (VER_K):
   así la misma transformación es más fuerte en los arcos posteriores y los números del jugador se cumplen en su arco. VER_FIX = poder fijo por forma */
(()=>{const ord=ARCS.map(a=>a.id);for(const c in VER_FIX){const L=VER_DATA[c]=(VER_DATA[c]||[]).slice();
 for(const e of VER_FIX[c]){const forms=Object.keys(e.pw),d={arc:e.arc,base:e.pw.base||Math.min(...Object.values(e.pw)),forms,pw:e.pw,fix:1},i=L.findIndex(v=>v.arc===e.arc);if(i>=0)L[i]=d;else L.push(d);}
 L.sort((x,y)=>ord.indexOf(x.arc)-ord.indexOf(y.arc));}})();
function verInfo(chId,arc){const ck=chId+'|'+arc;if(VER_CACHE[ck])return VER_CACHE[ck];const L=VER_DATA[chId]||[],d=L.find(v=>v.arc===arc);if(!d)return null;
 const ch=CHARS[chIdx(chId)];if(!ch)return null;const ok=id=>ch.forms.some(f=>f.id===id&&!f.hidden);
 let forms=d.forms.filter(ok);if(!d.fix&&d===L[L.length-1]&&!VER_FIX[chId]){const seen=new Set(L.flatMap(v=>v.forms));forms=forms.concat(ch.forms.filter(f=>!f.hidden&&!seen.has(f.id)).map(f=>f.id));}
 if(!forms.length)forms=[ch.forms[0].id];
 const base0=d.base||ch.base,pw=d.fix?fixPw(ch,d,base0):growPw(ch,L,d),base=d.fix?base0:pw[ch.forms[0].id],top=Math.max(...forms.map(id=>pw[id]));
 return VER_CACHE[ck]={base,forms,cap:top*1.36,pw,fix:!!d.fix};}
/* poder de cada forma en una versión: el fijo si lo hay; si no, base × multiplicador. En versiones fijas, una forma sin valor toma el de la forma listada más cercana por debajo */
function fixPw(ch,d,base){const pw={};for(const f of ch.forms)pw[f.id]=base*f.mult;if(!d.pw)return pw;
 const listed=ch.forms.filter(f=>d.pw[f.id]!=null).sort((a,b)=>a.mult-b.mult);
 for(const f of ch.forms){if(d.pw[f.id]!=null){pw[f.id]=d.pw[f.id];continue;}let near=null;for(const l of listed)if(l.mult<=f.mult)near=l;pw[f.id]=near?d.pw[near.id]:(listed[0]?d.pw[listed[0].id]:base);}return pw;}
const VER_PIN={goku:{uio:'gr',ui:'gr',tui:'gr'},vegeta:{ue:'gr'},freezer:{black:'gr'}};
function growPw(ch,L,d){const ord=ARCS.map(a=>a.id),ai=ord.indexOf(d.arc),K=a=>VER_K[a]||1,pin=VER_PIN[ch.id]||{},pw={};
 const real=L.filter(v=>!v.fix),idx=real.indexOf(d);let seg=0;for(let i=1;i<=idx;i++)if((real[i].base||ch.base)!==(real[i-1].base||ch.base))seg=i;
 const b=real[seg]?(real[seg].base||ch.base):(d.base||ch.base);
 for(const f of ch.forms){let anc;if(pin[f.id])anc=pin[f.id];else{const first=real.slice(seg).find(v=>v.forms.includes(f.id));anc=first&&ord.indexOf(first.arc)<=ai?first.arc:real[seg]?real[seg].arc:d.arc;}
  pw[f.id]=b*f.mult*K(d.arc)/K(anc);}return pw;}
const verMultOf=(ch,d)=>ch.forms.map(fm=>d.pw[fm.id]/d.base);
/* Kaioken encima de una transformación: desde el Universo 6 (Blue + Kaioken). Antes, solo sobre el estado base y hasta el nivel que tuviera en su arco */
const kkStackArc=arc=>!arc||ARCS.findIndex(a=>a.id===arc)>=ARCS.findIndex(a=>a.id==='tr');
function kkArcOf(f){if(f.ver)return f.ver;const B=game.story&&game.story.book;if(B&&B.kind==='arc'&&!game.story.free)return B.id;return null;}
/* 3.2b: el botón KK funciona siempre (petición del jugador); se deja la lógica por arco por si se quiere volver a limitar */
const KK_FREE=true;
const KK_FUS=['gogeta','vegetto'],isFusKK=f=>KK_FUS.includes(f.ch.id);
/* multiplicador real del Kaioken: literal en Goku; efectivo en las fusiones (x20 = ×1,8, x50 = ×2) */
const kkMul=f=>!f.kkL?1:isFusKK(f)?(KK_FUSION[f.kkL]||1):f.kkL;
function kkLevels(f){if(KK_FREE)return isFusKK(f)?[3,10,20,50]:[3,10,20];const arc=kkArcOf(f);if(kkStackArc(arc))return[3,10,20];if(f.form.mult>1)return[];
 const v=VER_DATA[f.ch.id]?verNear(f.ch.id,arc):null,d=v&&verInfo(f.ch.id,v);if(!d)return[];return[3,10,20].filter(n=>d.forms.includes('kk'+n));}
const verAllows=(f,i)=>!f.verIdx||f.verIdx.includes(i);
let G_VER=null;
function verApply(f,v,own){const d=verInfo(f.ch.id,v);if(!d)return;f.ver=v;f.base=d.base;f.verCap=d.cap;f.verMult=verMultOf(f.ch,d);f.verFix=d.fix;
 let idx=d.forms.map(id=>f.ch.forms.findIndex(x=>x.id===id)).filter(i=>i>=0);if(own)idx=idx.filter(i=>owns(f.ch,i));if(!idx.length)idx=[0];
 f.verIdx=idx;f.storyForms=idx;if(!idx.includes(f.startForm))f.startForm=idx[0];}
function verInit(f,o){f.ver=null;if(o.base||o.role==='boss'||o.role==='dummy'||game.story||game.online||game.mode==='tdp'||f.ch.model==='dragon'||!VER_DATA[f.ch.id])return;
 const mine=f.idx===0||(f.idx===1&&local2P());let v=null;if(f.idx===0){v=verOf(f.ch.id);G_VER=v;}else if(f.idx===1)v=verOfSide(f.ch.id,1);else v=verNear(f.ch.id,G_VER);
 /* 3.2: la forma elegida en la selección manda: si la versión no la tiene, se usa la primera versión que sí (antes empezaba en base) */
 const want=f.ch.forms[f.startForm]&&f.ch.forms[f.startForm].id;
 if(v&&want&&!verInfo(f.ch.id,v).forms.includes(want)){const L=verArcs(f.ch.id),ok=L.filter(a=>verInfo(f.ch.id,a).forms.includes(want)),order=ARCS.map(a=>a.id);
  if(ok.length)v=ok.sort((a,b)=>Math.abs(order.indexOf(a)-order.indexOf(v))-Math.abs(order.indexOf(b)-order.indexOf(v)))[0];}
 if(v)verApply(f,v,mine);}
/* ¿esta forma existe en la versión elegida? (para la selección de personaje) */
function verFormOk(ch,i,side=0){const v=verOfSide(ch.id,side);if(!v)return true;const d=verInfo(ch.id,v);return!d||d.forms.includes(ch.forms[i].id);}
const verFormPow=(ch,i,side=0)=>{const v=verOfSide(ch.id,side),d=v&&verInfo(ch.id,v);return d?d.pw[ch.forms[i].id]:ch.base*ch.forms[i].mult;};
const verBase=(ch,side=0)=>{const v=verOfSide(ch.id,side),d=v&&verInfo(ch.id,v);return d?d.base:ch.base;};
/* maestría: guardada en décimas (0-1000) por luchador y forma */
const mKey=(c,fm)=>c+'.'+fm;
const mastPct=f=>((prog.mast||{})[mKey(f.ch.id,f.form.id)]||0)/10;
function mastOf(f){return mastFormK(f,f.form);}
/* maestría de una forma concreta (0-1): la tuya (si eres humano) + la que trae la versión del arco */
function mastFormK(f,fm){if(!f||!fm||fm.mult<=1)return 0;const own=human(f)&&!game.online?((prog.mast||{})[mKey(f.ch.id,fm.id)]||0)/10:0;return clamp((own+(f.verFix?0:(VER_M[f.ver]||0)))/100,0,1);}
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
 verPick:a=>{const [ci,d,sd]=String(a).split(':'),ch=CHARS[+ci],side=+sd||0;if(!ch)return;const L=verList(ch.id);if(!L.length)return;const i=L.indexOf(verOfSide(ch.id,side)),k=side?'ver2':'ver';prog[k]=prog[k]||{};prog[k][ch.id]=L[(i+(+d||1)+L.length)%L.length];saveProg();sfx('sel');renderMenu();}});

/* 3.3 · Modo historia: (1) formas de forma cronológica: el jugador tiene todas las que su personaje ya consiguió hasta esa pelea;
   (2) versiones fijas (fusiones, Bills, Zamasu) también en la historia; (3) en Extremo y Legendario el rival no supera tu tope ×1,6 / ×2,2 */
function storyChronoForms(f,n){const B=book;if(!B||B.kind!=='arc')return;const ord=ARCS.map(a=>a.id),ai=ord.indexOf(B.id),ids=new Set();
 const prev=(VER_DATA[f.ch.id]||[]).filter(v=>ord.indexOf(v.arc)<ai&&!v.fix).pop();if(prev)prev.forms.forEach(x=>ids.add(x));
 for(const m of B.nodes){const N=m.fight||m;for(const k of['p','ally','e','e2']){const sp=N[k];if(sp&&sp.c===f.ch.id){(sp.forms||[]).forEach(x=>ids.add(x));if(sp.f)ids.add(sp.f);}}if(m===n)break;}
 for(const id of ids){const i=f.ch.forms.findIndex(x=>x.id===id&&!x.hidden);if(i>=0&&!f.storyForms.includes(i))f.storyForms.push(i);}
 f.storyForms.sort((a,b)=>f.ch.forms[a].mult-f.ch.forms[b].mult);}
function storyFix(f){const B=book;if(!B||B.kind!=='arc'||!VER_FIX[f.ch.id])return;const ord=ARCS.map(a=>a.id),ai=ord.indexOf(B.id);
 const e=VER_FIX[f.ch.id].filter(x=>ord.indexOf(x.arc)<=ai).pop();if(!e)return;const d=verInfo(f.ch.id,e.arc);if(!d)return;f.base=d.base;f.verMult=verMultOf(f.ch,d);}
const formPow=(f,i)=>f.base*((f.verMult&&f.verMult[i])||f.ch.forms[i].mult);
function storyPost(n){if(!game.story)return;const free=game.story.free;
 /* modo libre: tu luchador usa su versión de ese arco (poder de cada forma y tope) */
 if(free&&game.f[0]&&book&&book.kind==='arc'){const a=game.f[0],v=VER_DATA[a.ch.id]?verNear(a.ch.id,book.id):null,d=v&&verInfo(a.ch.id,v);if(d){a.base=d.base;a.verMult=verMultOf(a.ch,d);a.verCap=d.cap;a.verFix=d.fix;}}
 for(const f of game.f){if(f.role==='boss')continue;if(!(free&&f===game.f[0]))storyFix(f);if(f.team===0&&!free&&f.storyForms)storyChronoForms(f,n);}
 const a=game.f[0];if(!a||game.diff<2)return;const peak=Math.max(...(a.storyForms||[a.formIdx]).map(i=>formPow(a,i)))*(1+.35*mastFormK(a,a.ch.forms[(a.storyForms||[a.formIdx]).slice(-1)[0]]));
 const K=game.diff===2?1.6:2.2;for(const f of game.f)if(f.team===1)f.storyCap=peak*K*((n.e&&n.e.cap)||1);}

/* orden de las formas para listas y selección: el de transformación (ch.order), sin las ocultas */
const formOrder=ch=>(ch.order||ch.forms.map((_,i)=>i)).filter(i=>ch.forms[i]&&!ch.forms[i].hidden);
