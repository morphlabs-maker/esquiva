/* =========================================================
   MODO HISTORIA «JUNTO A GOKU» · ¿QUÉ PASARÍA SI…? · ESFERAS DEL DRAGÓN · GALERÍA
   Cada arco es un archivo de datos (story/<id>.js) que se descarga la primera vez que se abre y queda guardado
   para jugar sin internet (lo guarda el service worker). El archivo llama a KC_STORY({...}).
   Nodo de mapa: t='cine' (escena), t='fight' (pelea con condiciones) o t='db' (Esfera del Dragón escondida).
   ========================================================= */
const STORY={};window.KC_STORY=d=>{if(d&&typeof d.id==='string')STORY[d.id]=d;};
const storyLoading={};
function loadStory(id,file){if(STORY[id])return Promise.resolve(STORY[id]);if(storyLoading[id])return storyLoading[id];
 return storyLoading[id]=new Promise((ok,no)=>{const s=document.createElement('script');s.src=file;s.onload=()=>{delete storyLoading[id];STORY[id]?ok(STORY[id]):no(new Error('vacío'));};
  s.onerror=()=>{delete storyLoading[id];s.remove();no(new Error('sin conexión'));};document.head.appendChild(s);});}
const arcFile=id=>id==='whatif'?WHATIF_FILE:(ARCS.find(a=>a.id===id)||{}).file;
const cached={};
function checkCached(){if(!window.caches)return;for(const a of ARCS.concat([{id:'whatif',file:WHATIF_FILE}]))caches.match(a.file,{ignoreSearch:true}).then(r=>{const v=!!r;if(cached[a.id]!==v){cached[a.id]=v;if(menuState==='story')renderMenu();}}).catch(()=>{});}
function downloadAll(){const L=ARCS.map(a=>a.file).concat([WHATIF_FILE]);let n=0;storyMsg='Descargando…';renderMenu();
 Promise.all(L.map(f=>fetch(f,{cache:'no-cache'}).then(r=>{if(r.ok)n++;}).catch(()=>{}))).then(()=>{storyMsg=n===L.length?'✔ Todos los arcos guardados: ya puedes jugar sin internet.':'Faltan '+(L.length-n)+' arcos: conéctate a internet y vuelve a intentarlo.';setTimeout(checkCached,600);renderMenu();});}
/* «libro» = un arco del modo historia o una historia ¿Qué pasaría si…? */
let book=null,selNode=null,storyMsg='';
const bookStore=()=>book&&book.kind==='wi'?prog.wi:prog.story.c;
const cineSeen=id=>prog.story.seen.includes(id);
function nodeDone(n){if(n.t==='cine')return cineSeen(n.cine.id);if(n.t==='db')return prog.db.includes(n.n);return(bookStore()[n.id]||0)>0;}
const mainNodes=()=>book.nodes.filter(n=>n.t!=='db');
function nodeOpen(n){const i=book.nodes.indexOf(n);for(let j=i-1;j>=0;j--){const p=book.nodes[j];if(p.t==='db')continue;return nodeDone(p);}return true;}
function bookProgress(b){const s=b.kind==='wi'?prog.wi:prog.story.c,ns=b.nodes.filter(n=>n.t!=='db');return[ns.filter(n=>n.t==='cine'?cineSeen(n.cine.id):(s[n.id]||0)>0).length,ns.length];}
function arcOpen(i){return i===0||arcDone(ARCS[i-1].id);}
function openArc(i){const a=ARCS[i];if(!arcOpen(i)){sfx('back');return;}storyMsg='Cargando '+a.name+'…';renderMenu();
 loadStory(a.id,a.file).then(d=>{book=Object.assign({kind:'arc',color:a.color},d);layoutBook(book);{const nx=nextNode(book);selNode=nx?nx.id:null;}storyMsg='';menuState='smap';sfx('ok');checkCached();renderMenu();})
  .catch(()=>{storyMsg='No se pudo descargar «'+a.name+'». La primera vez necesita internet; después funciona sin conexión.';sfx('back');renderMenu();});}
function openWhatif(i){if(!storyAllDone()){sfx('back');return;}loadStory('whatif',WHATIF_FILE).then(d=>{const s=d.stories[i];if(!s)return;book=Object.assign({kind:'wi'},s);layoutBook(book);{const nx=nextNode(book);selNode=nx?nx.id:null;}menuState='smap';sfx('ok');renderMenu();})
 .catch(()=>{storyMsg='No se pudo descargar «¿Qué pasaría si…?». Conéctate a internet una vez.';renderMenu();});}

/* ---------------- Pantallas: arcos, mapa, galería y deseo ---------------- */
/* Mapas personalizados: cada arco tiene su paisaje, sus colores de marco y su emblema */
const G=(d,f,o='')=>`<path d="${d}" fill="${f}" ${o}/>`,C=(x,y,r,f,o='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${o}/>`;
const MAP_ART={
 sai:{c1:'#5aa8ff',c2:'#e0b070',f1:'#ff8a1e',f2:'#2a5bd7',em:'亀',svg:C(86,16,6,'#fff6c8')+G('M0 58 L6 34 L13 34 L16 58Z M20 58 L27 26 L35 26 L39 58Z M58 58 L63 40 L71 40 L74 58Z M82 58 L86 30 L95 30 L100 58Z','#b8784a')+G('M0 58 H100 V100 H0Z','#d8a868')+G('M30 80 Q40 74 50 80 Q40 86 30 80Z','#9a6a3a','opacity=".6"')+C(8,72,4,'#f0dca0')+G('M5 70 L8 64 L11 70Z','#f4a0b8')},
 nam:{c1:'#7ad89a',c2:'#3fae8a',f1:'#5ad06a',f2:'#2a7a5a',em:'ナ',svg:C(18,14,5,'#fff6c8')+C(26,10,3.5,'#fff0b0')+C(12,18,2.5,'#ffe8a0')+G('M0 62 Q50 56 100 62 V100 H0Z','#2fbf9a')+G('M10 62 V44 H20 V62Z M40 62 V36 H48 V62Z M70 62 V48 H82 V62Z M88 62 V40 H95 V62Z','#d4c06a')+C(15,42,4,'#3fa8c8')+C(44,33,3.5,'#3fa8c8')+C(76,46,4,'#3fa8c8')+G('M54 30 Q62 22 70 30Z','#d8dde8')},
 cel:{c1:'#ffb070',c2:'#c88a5a',f1:'#9aff8a',f2:'#2a6a3a',em:'セ',svg:G('M0 56 L10 40 L16 56Z M78 56 L86 36 L94 56Z','#a66e3e')+G('M0 56 H100 V100 H0Z','#c49a62')+G('M36 66 H64 L68 72 H32Z','#e8e4dc')+G('M66 30 V56 H70 V34Z M72 26 V56 H76 V30Z','#8a8a9a','opacity=".7"')+G('M46 20 L50 12 L54 20Z','#5fae4a','opacity=".8"')},
 buu:{c1:'#ffb0e0',c2:'#c8a070',f1:'#ff8ad8',f2:'#8a3a8a',em:'魔',svg:C(80,20,9,'#ff9ad8','opacity=".7"')+G('M0 60 H100 V100 H0Z','#c8a070')+G('M14 60 Q22 44 30 60Z','#ffd0e8')+C(22,48,1.5,'#3a2a3a')+G('M60 60 V46 H80 V60Z','#f4ece0')+G('M58 46 L70 38 L82 46Z','#c83a2a')},
 god:{c1:'#8a6ad8',c2:'#5aa84a',f1:'#b070ff',f2:'#3a2a6a',em:'破',svg:C(80,16,8,'#e8a0d8')+G('M68 16 Q80 10 92 18','none','stroke="#ffe0f0" stroke-width="1"')+G('M0 62 Q50 54 100 62 V100 H0Z','#5aa84a')+G('M10 62 V54 H30 V62Z M13 54 V48 H27 V54Z M16 48 V42 H24 V48Z','#5a5a8a')+G('M19 42 V24 H21 V42Z','#e8d8c0')+C(20,22,3,'#9a5ad8')+G('M60 30 L66 30 L63 38Z','#7a6a7a')+G('M60 30 H66 V29 H60Z','#6ab84a')+C(80,56,3,'#ffa040')+C(88,54,2.4,'#6ad0a0')},
 tr:{c1:'#6a6a8a',c2:'#5a4a4a',f1:'#8fe0ff',f2:'#3a3a6a',em:'未',svg:G('M0 60 V44 H8 V60Z M10 60 V36 H18 V60Z M22 60 V48 H28 V60Z M70 60 V40 H78 V60Z M82 60 V30 H90 V60Z','#4a4a58')+G('M0 60 H100 V100 H0Z','#6a5a54')+G('M44 30 Q50 22 56 30 Q50 34 44 30Z','#e8e8f0')+G('M46 31 L44 36 M54 31 L56 36','none','stroke="#e8e8f0" stroke-width="1"')},
 tp:{c1:'#1a0e3a',c2:'#3a2a6a',f1:'#c890ff',f2:'#3a6aff',em:'力',svg:G('M0 0 H100 V100 H0Z','url(#tpg)')+'<defs><radialGradient id="tpg"><stop offset="0" stop-color="#5a3aaa"/><stop offset="1" stop-color="#0a0620"/></radialGradient></defs>'+G('M12 68 Q50 54 88 68 Q50 80 12 68Z','#c4bed4')+G('M14 68 V40 H18 V66Z M82 66 V40 H86 V68Z M48 56 V30 H52 V56Z','#e0dae8','opacity=".8"')+C(50,16,5,'#b08aff','opacity=".8"')},
 bro:{c1:'#a8d0f0',c2:'#eef6fc',f1:'#55ff66',f2:'#2a6a8a',em:'伝',svg:G('M0 30 Q25 18 50 28 Q75 16 100 26','none','stroke="#6affb0" stroke-width="2" opacity=".6"')+G('M0 58 L8 40 L14 58Z M30 58 L36 46 L40 58Z M70 58 L78 38 L86 58Z','#9ad4f4')+G('M0 58 H100 V100 H0Z','#f4fbff')+G('M60 54 Q66 48 72 54Z','#d8dde8')},
 mor:{c1:'#1a1a3a',c2:'#5a4a8a',f1:'#c0a0ff',f2:'#4a3a8a',em:'魔',svg:C(78,30,14,'#5a4a7a')+C(78,30,14,'none','stroke="#9a8ad8" stroke-width=".8"')+C(20,20,3,'#3a6aff')+G('M0 70 Q50 62 100 70 V100 H0Z','#3a3a5a')+G('M10 70 V58 H22 V70Z','#6a6a8a')+G('M12 58 H20 V56 H12Z','#ffd23a')},
 gr:{c1:'#2a2830',c2:'#5a4a30',f1:'#c8a0ff',f2:'#1a1a1a',em:'黒',svg:C(50,24,10,'#5a2a7a','opacity=".7"')+G('M0 60 L12 44 L20 60Z M80 60 L90 42 L100 60Z','#4a3a2a')+G('M0 60 H100 V100 H0Z','#6a5a3a')+G('M46 40 Q50 30 54 40 L52 52 H48Z','#1a1a1a')},
 wi:{c1:'#3a2a6a',c2:'#5a3a8a',f1:'#c0a0ff',f2:'#ff8ad8',em:'?',svg:C(50,50,30,'none','stroke="#c0a0ff" stroke-width="1.4" stroke-dasharray="4 3" opacity=".6"')+C(50,50,18,'none','stroke="#ff8ad8" stroke-width="1" opacity=".5"')}};
const artOf=B=>MAP_ART[B.kind==='wi'?'wi':B.id]||MAP_ART.wi;
const artSVG=A=>`<svg class="mapart" viewBox="0 0 100 100" preserveAspectRatio="none">${A.svg}</svg>`;
const BOSS_ICON={oozaru:'🐵',hildegarn:'👹',hydra:'🐉'};
function nodeFace(n){if(n.t==='db')return prog.db.includes(n.n)?'<s>★</s>':'★';if(n.t==='cine')return'🎬';
 if(n.boss){const bi=chIdx(n.boss);return bi>=0?`<img src="${PORTRAITS[bi]}" alt="">`:BOSS_ICON[n.boss]||'👹';}const ci2=chIdx(n.e.c);return ci2>=0?`<img src="${PORTRAITS[ci2]}" alt="">`:'⚔';}
/* los lugares se colocan solos en un camino serpenteante (los datos solo dicen el orden) */
function layoutBook(B){if(B._lay)return;const main=B.nodes.filter(n=>n.t!=='db'),N=main.length;
 main.forEach((n,i)=>{n.x=7+i*(86/Math.max(1,N-1));n.y=clamp(52+30*Math.sin(i*1.25+.4)*(i%2?1:.8),14,84);});
 let prev=main[0];for(const n of B.nodes){if(n.t!=='db'){prev=n;continue;}n.x=clamp(prev.x+5,4,96);n.y=prev.y>50?prev.y-24:prev.y+24;}B._lay=1;}
function nextNode(B){return B.nodes.find(n=>n.t!=='db'&&nodeOpen(n)&&!nodeDone(n))||B.nodes.find(n=>n.t==='db'&&nodeOpen(n)&&!nodeDone(n));}
function bookStars(B){const st=B.kind==='wi'?prog.wi:prog.story.c;let s=0,t=0;for(const n of B.nodes)if(n.t==='fight'){t+=3;s+=st[n.id]||0;}return[s,t];}
function storyHTML(){checkCached();const arcs=ARCS.map((a,i)=>{const open=arcOpen(i),done=arcDone(a.id),d=STORY[a.id],B=d?Object.assign({kind:'arc'},d):null,pr=B?bookProgress(B):null,st=B?bookStars(B):null,A=MAP_ART[a.id];
  return`<div class="arcc${open?'':' lock'}${done?' done':''}" data-act="openArc" data-arg="${i}" style="--ac:${a.color};--mc1:${A.c1};--mc2:${A.c2}">${artSVG(A)}<span class="emb">${A.em}</span><b>${a.n}. ${a.name}</b><span>${!open?'🔒 Termina el arco anterior':done?'✔ COMPLETADO':pr?pr[0]+' / '+pr[1]+' partes':'Toca para jugar'}${st?' · ⭐ '+st[0]+'/'+st[1]:''}</span><em>${cached[a.id]?'✔ sin internet':'⬇ se descarga al abrir'}</em></div>`;}).join('');
 const wi=storyAllDone(),cont=ARCS.findIndex((a,i)=>arcOpen(i)&&!arcDone(a.id));
 return`${backBtn()}<div class="ttl">📖 MODO HISTORIA · JUNTO A GOKU</div><div class="tip">Del manga: desde la llegada de los Saiyajin hasta la aparición de Black Freezer.</div>
  ${cont>=0?`<button class="btn" data-act="sContinue" style="margin:0 0 6px">▶ CONTINUAR: ${ARCS[cont].name.toUpperCase()}</button>`:''}
  <div class="arcgrid">${arcs}</div>
  <div class="mpad" style="margin-top:8px"><button class="btn${wi?'':' off'}" data-act="openWhatifList">${wi?'':'🔒 '}¿QUÉ PASARÍA SI…?</button><button class="btn" data-act="openGallery">🎬 GALERÍA</button><button class="btn" data-act="dlAll">⬇ DESCARGAR TODO</button></div>
  <div class="tip">Esferas del Dragón: ${prog.db.length} / 7 ${'★'.repeat(prog.db.length)} · Dificultad: <span class="diff tap" data-act="sDiff" style="display:inline-block;margin:0;padding:3px 6px">${DIFFS[prog.sdiff].name} ▶</span></div>${storyMsg?`<div class="tip" style="color:var(--yl)">${esc(storyMsg)}</div>`:''}`;}
function whatifListHTML(){const d=STORY.whatif;if(!d)return`${backBtn()}<div class="tip">Cargando…</div>`;const A=MAP_ART.wi;
 return`${backBtn()}<div class="ttl">🌀 ¿QUÉ PASARÍA SI…?</div><div class="arcgrid">${d.stories.map((s,i)=>{const pr=bookProgress(Object.assign({kind:'wi'},s)),done=!!prog.wi['A_'+s.id];return`<div class="arcc${done?' done':''}" data-act="openWhatif" data-arg="${i}" style="--ac:${s.color||'#c0a0ff'};--mc1:${A.c1};--mc2:${A.c2}">${artSVG(A)}<span class="emb">?</span><b>${s.name}</b><span>${s.desc}</span><em>${done?'✔ COMPLETADA':pr[0]+' / '+pr[1]+' partes'}</em></div>`;}).join('')}</div>
  <button class="btn" data-act="toStory">← HISTORIA</button>`;}
const NODE_ICON={cine:'🎬',fight:'⚔',db:'★'};
function smapHTML(){const B=book;layoutBook(B);const A=artOf(B),ns=B.nodes.filter(n=>n.t!=='db'||nodeOpen(n));
 const main=B.nodes.filter(n=>n.t!=='db'),pts=main.map(n=>n.x+','+n.y).join(' '),doneN=main.filter(nodeDone).length,donePts=main.slice(0,Math.max(1,doneN+1)).map(n=>n.x+','+n.y).join(' ');
 const node=n=>{const done=nodeDone(n),open=nodeOpen(n),st=n.t==='fight'?(bookStore()[n.id]||0):0;return`<div class="snode t-${n.t}${n.boss?' boss':''}${done?' done':open?' on':' lock'}${selNode===n.id?' sel':''}" style="left:${n.x}%;top:${n.y}%" data-act="sNode" data-arg="${n.id}">${nodeFace(n)}${n.t==='fight'&&done?`<i>${'★'.repeat(st)}${'☆'.repeat(3-st)}</i>`:''}</div>`;};
 const n=B.nodes.find(x=>x.id===selNode);let info='<div class="tip">Toca un lugar del mapa o pulsa SIGUIENTE.</div>';
 if(n){const open=nodeOpen(n),done=nodeDone(n);
  if(n.t==='cine')info=`<b>${NODE_ICON.cine} ${n.name}</b><br>${n.place||''}<div class="mpad">${open?`<button class="btn sbtn" data-act="sPlay">${done?'VER OTRA VEZ':'▶ VER ESCENA'}</button>`:'🔒 Completa el lugar anterior'}</div>`;
  else if(n.t==='db')info=`<b>★ ${prog.db.includes(n.n)?'Ya tienes la Esfera de '+n.n+' estrellas':'Algo brilla aquí…'}</b><br>${n.hint||''}${n.fight?'<br>Condición: '+goalTxt(n.fight):''}<div class="mpad">${!prog.db.includes(n.n)?`<button class="btn sbtn" data-act="sPlay">${n.fight?'⚔ PELEAR POR ELLA':'🔍 BUSCAR'}</button>`:''}</div>`;
  else{const st=bookStore()[n.id]||0,E=n.boss?(BOSSES.find(b=>b.id===n.boss)||{}).name:charName(n.e.c)+(n.e2?' + '+charName(n.e2.c):''),W=n.world==='bills'?TRAIN_WORLD:WORLDS[n.world|0];
   info=`<b>⚔ ${n.name}</b> <span class="stars">${'★'.repeat(st)}${'☆'.repeat(3-st)}</span><br>📍 ${n.place||W.name} · ${W.name}<br>Tú: ${charName(n.p.c)}${n.ally?' + '+charName(n.ally.c):''} · Rival: ${E}
    <br><span style="color:var(--yl)">★ ${goalTxt(n)}</span>${(n.stars||[]).map(s=>`<br><span style="color:#9fe8ff">★ ${s.txt}</span>`).join('')}<br>Premio: 🪙 ${n.coins||100}${n.unlock&&!prog.unl.includes(n.unlock)?' · 🆓 '+charName(n.unlock):''}
    <div class="mpad">${open?`<button class="btn sbtn" data-act="sPlay">${done?'⚔ REPETIR':'⚔ ¡A PELEAR!'}</button>`:'🔒 Completa el lugar anterior'}${n.cine&&cineSeen(n.cine.id)?'<button class="btn sbtn" data-act="sCine">🎬 ESCENA</button>':''}</div>`;}}
 const[a,b]=bookProgress(B),[sa,sb]=bookStars(B),an=(ARCS.find(x=>x.id===B.id)||{}).n,nx=nextNode(B);
 return`<button class="btn backbtn" data-act="${B.kind==='wi'?'openWhatifList':'toStory'}">← ${B.kind==='wi'?'¿QUÉ PASARÍA SI…?':'ARCOS'}</button>
  <div class="sbanner" style="--ac:${B.color||A.f1};--mf1:${A.f1};--mf2:${A.f2}"><span class="emb">${A.em}</span><div><em>${B.kind==='wi'?'¿QUÉ PASARÍA SI…?':'ARCO '+an}</em><b>${B.name}</b></div><span class="prog">${a}/${b} · ⭐ ${sa}/${sb}</span>${nx?`<button class="btn sbtn" data-act="sNode" data-arg="${nx.id}">SIGUIENTE ▶</button>`:''}</div>
  <div class="smap" style="--mc1:${A.c1};--mc2:${A.c2};--mf1:${A.f1};--mf2:${A.f2}">${artSVG(A)}
   <svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="2.2"/><polyline points="${pts}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width=".8" stroke-dasharray="2 1.4"/><polyline points="${donePts}" fill="none" stroke="${A.f1}" stroke-width="1.4"/></svg>${ns.map(node).join('')}</div>
  <div class="sinfo" style="--mf1:${A.f1}">${info}</div><div class="tip">Dificultad: <span class="diff tap" data-act="sDiff" style="display:inline-block;margin:0;padding:3px 6px">${DIFFS[prog.sdiff].name} ▶</span></div>`;}
const charName=id=>{const i=chIdx(id);return i>=0?CHARS[i].name:id;};
function goalTxt(n){const g=n.goal||{type:'win'};return g.type==='survive'?'Resiste '+g.t+' s':g.type==='timed'?'Gana antes de '+g.t+' s':g.type==='hp'?'Gana con más del '+Math.round(g.v*100)+' % de vida':'Gana la pelea';}
function galleryHTML(){const rows=ARCS.concat([{id:'whatif',name:'¿Qué pasaría si…?'}]).map(a=>{const d=STORY[a.id];if(!d)return`<div class="grow"><span>${a.name}</span><span class="soon">${cached[a.id]?'':'sin descargar'}</span></div>`;
  const nodes=a.id==='whatif'?d.stories.flatMap(s=>s.nodes):d.nodes,cs=nodes.flatMap(n=>[n.intro,n.cine]).filter(Boolean);
  return`<div class="gcol oc" style="margin-top:6px"><h3>${a.name}</h3>${cs.map(c=>cineSeen(c.id)?`<div class="grow"><span>${c.title}</span><button class="btn sbtn" data-act="gPlay" data-arg="${c.id}">▶ VER</button></div>`:`<div class="grow"><span>???</span><span class="soon">🔒</span></div>`).join('')}</div>`;}).join('');
 return`${backBtn()}<div class="ttl">🎬 GALERÍA DE ESCENAS</div><div class="scrollable" style="max-height:70vh;overflow-y:auto">${rows}</div><button class="btn" data-act="toStory">← HISTORIA</button>`;}
function findCine(id){for(const k in STORY){const d=STORY[k],nodes=k==='whatif'?d.stories.flatMap(s=>s.nodes):d.nodes;for(const n of nodes)for(const c of[n.intro,n.cine])if(c&&c.id===id)return c;}return null;}
function wishHTML(){return`<div class="panel"><div class="ttl" style="color:#7aff6a">🐉 SHENLONG: «DI TU DESEO»</div><div class="opts">${WISHES.map(w=>`<div class="opt" data-act="wish" data-arg="${w.id}"><h3>${w.name}</h3>${w.desc}</div>`).join('')}</div></div>`;}
let wishCine=null;
function grantWish(id){let msg='';wishCine=null;
 if(id==='char'){const c=CHARS.find(x=>x.unlock&&!prog.unl.includes(x.id));if(c){unlockChar(c.id,true);msg='¡'+c.name+' se une a tus luchadores!';}else id='coins';}
 if(id==='outfit'){const o=OUTFITS.filter(x=>!x.paid&&!prog.ofOwn.includes(x.id)).sort((a,b)=>b.price-a.price)[0];if(o){grantOutfit(o.id,true);msg='Outfit nuevo: '+o.name+' ('+charName(o.who)+')';}else id='coins';}
 if(id==='forms'){const cs=CHARS.filter(c=>!c.unlock||prog.unl.includes(c.id)).filter(c=>c.forms.some((_,i)=>!owns(c,i)));if(cs.length){const c=cs[Math.random()*cs.length|0];prog.own[c.id]=c.forms.map((_,i)=>i);msg='¡'+c.name+' despierta todas sus formas!';wishCine=[chIdx(c.id),c.forms.length-1];}else id='coins';}
 if(id==='coins'){prog.coins+=2500;prog.earned+=2500;msg='+2500 🪙';}
 prog.db=[];track('wish');saveProg();toast('🐉 DESEO CONCEDIDO',msg+' · Las esferas se dispersan por el universo…');if(wishCine)formCine(wishCine[0],wishCine[1],()=>toMenu('story'));else toMenu('story');}

/* ---------------- Peleas del modo historia ---------------- */
const formIx=(ch,id)=>{const i=ch.forms.findIndex(f=>f.id===id);return i<0?0:i;};
function storyFighter(idx,spec,o){const ci2=chIdx(spec.c),ch=CHARS[ci2];const f=new Fighter(idx,ci2,Object.assign({startForm:formIx(ch,spec.f||(spec.forms?spec.forms[0]:'base')),base:spec.base||ch.base,maxHp:Math.round(MAXHP*(spec.hp||1))},o));
 if(spec.outfit)f.forceOutfit=spec.outfit;if(spec.forms)f.storyForms=spec.forms.map(id=>formIx(ch,id));else f.storyForms=[f.startForm];if(!f.storyForms.includes(f.startForm))f.storyForms.push(f.startForm);return f;}
function storyStart(n){const B=book;for(const f of game.f)f.dispose();game.f=[];clearCombat();clearMenuModels();game.paused=false;$('#pause').style.display='none';
 game.diff=prog.sdiff;const D=DIFFS[game.diff];game.story={n,book:B,combo:0,ult:0,trans:false,left:null,t:0};game.cpu=true;
 const W=n.world==='bills'?TRAIN_WORLD:WORLDS[clamp(n.world|0,0,WORLDS.length-1)];game.storyWorld=W;world=W.build(n.v|0);SUN_DIR.copy(sun.position).normalize();sun.castShadow=true;
 const a=storyFighter(0,n.p,{team:0});a.minHp=1;
 if(n.boss){const Bi=Math.max(0,BOSSES.findIndex(b=>b.id===n.boss)),Bs=BOSSES[Bi];game.bossSel=Bi;game.mode=n.ally?'coopcpu':'boss';const team=[a];
  if(n.ally){const al=storyFighter(1,n.ally,{team:0});al.cpu=true;team.push(al);}
  const boss=new Fighter(2,bossChar(Bs),{role:'boss',team:1,boss:Bs,giant:Bs.giant,maxHp:Math.round(MAXHP*D.bossHp*(Bs.hpK||1)*(n.ally?1:.6)*(n.bossHp||1)),base:(n.bossPow||Bs.pw())*D.bossF});
  team.forEach(p=>p.opp=boss);boss.opp=a;boss.cpu=true;game.f=[...team,boss];}
 else if(n.ally||n.e2){game.mode=n.ally&&!n.e2?'2v1cpu':!n.ally?'1v2':'royale';const all=[a];let idx=1;
  if(n.ally){const al=storyFighter(idx++,n.ally,{team:0});al.cpu=true;all.push(al);}
  for(const e of[n.e,n.e2].filter(Boolean)){const f=storyFighter(idx++,e,{team:1});f.cpu=true;if(D.cap!==Infinity)f.cap=D.cap*(e.cap||1);all.push(f);}
  all.forEach(f=>{f.opp=all.find(x=>x.team!==f.team);});game.f=all;game.squad=[all.filter(f=>f.team===0).map(f=>({c:f.chi})),all.filter(f=>f.team===1).map(f=>({c:f.chi}))];}
 else{game.mode='cpu';const b=storyFighter(1,n.e,{team:1});b.cpu=true;if(D.cap!==Infinity)b.cap=D.cap*(n.e.cap||1);a.opp=b;b.opp=a;game.f=[a,b];}
 game.wins=[0,0];game.round=1;buildHud();$('#hud').style.display='block';$('#pp1').style.display=game.mode==='boss'?'none':'flex';$('#bossbar').style.display=bossMode()?'block':'none';$('#train').style.display='none';
 $('#menu').innerHTML='';menuState=null;playTrack(W.music);startRound();game.timer=999;
 const g=n.goal||{};if(g.type==='survive'||g.type==='timed')game.story.left=g.t;
 showMsg(B.kind==='wi'?'¿QUÉ PASARÍA SI…?':'CAPÍTULO',n.name+' · '+goalTxt(n)+' · '+DIFFS[game.diff].name,1.6);if(n.pre)setTimeout(()=>{if(game.story&&game.story.n===n&&game.phase==='intro')dlgStart(n.pre);},400);}
function storyTick(dt){const S=game.story;S.t+=dt;if(S.left==null)return;S.left-=dt;if(S.left>0)return;S.left=0;const g=S.n.goal;
 if(g.type==='survive'){showMsg('¡RESISTISTE!','',1.4);roundOver(0,'survive');}else{showMsg('¡TIEMPO!','No lo lograste a tiempo',1.4);roundOver(1,'time');}}
function plusOnTrans(f,form){if(!human(f))return;track('trans');if(form&&form.id==='ui')track('ui');if(game.story)game.story.trans=true;}
function plusOnUlt(f){if(!human(f))return;track('ult');if(game.story)game.story.ult++;}
function storyEval(win){const S=game.story,n=S.n,a=game.f[0],al=game.f.find(f=>f!==a&&f.team===0&&f.role==='p');let st=win?1:0;const ok=[];
 if(win&&n.goal&&n.goal.type==='hp'&&a.hp/a.maxHp<n.goal.v)return{st:0,ok,failHp:1};
 if(win)for(const s of n.stars||[]){let m=false;if(s.type==='time')m=S.t<=s.v;else if(s.type==='hp')m=a.hp/a.maxHp>=s.v;else if(s.type==='noTrans')m=!S.trans;else if(s.type==='ult')m=S.ult>=(s.v||1);
  else if(s.type==='combo')m=stat('combo')>=s.v&&S.combo>=s.v;else if(s.type==='ally')m=!!al&&al.state!=='ko';else if(s.type==='perfect')m=(a.minHp??1)>=s.v;if(m){st++;ok.push(s.txt);}}
 return{st,ok};}
function storyEnd(){const S=game.story,n=S.n,B=S.book,win=game.winner===0||(bossMode()&&game.winner===0);game.phase='over';
 const R=storyEval(win),store=B.kind==='wi'?prog.wi:prog.story.c,prev=store[n.id]||0;let coins=0,extra='';
 if(R.st>0&&n.t==='db'){if(!prog.db.includes(n.n)){prog.db.push(n.n);coins+=50;extra+='<br>★ ¡Esfera de '+n.n+' estrellas! ('+prog.db.length+' / 7)';}prog.coins+=coins;prog.earned+=coins;saveProg();}
 else if(R.st>0){if(!prev)coins+=n.coins||100;coins+=Math.max(0,R.st-prev)*25;store[n.id]=Math.max(prev,R.st);if(!prev)track('story');
  if(n.unlock&&unlockChar(n.unlock,true))extra+='<br>🆓 ¡Nuevo luchador: '+charName(n.unlock)+'!';
  prog.coins+=coins;prog.earned+=coins;checkBookDone(B);saveProg();checkAchs();}
 const W=game.f.filter(f=>f.team===(win?0:1)&&f.state!=='ko');W.forEach(f=>f.setState('victory'));game.cine={type:'victory',f:W[0]||game.f[0],t:999,dur:999};
 const stars=n.t==='db'?'':`<span class="stars" style="font-size:18px">${'★'.repeat(R.st)}${'☆'.repeat(3-R.st)}</span><br>`;
 showMsg(win&&R.st?'¡SUPERADO!':'DERROTA',stars+(R.failHp?'Ganaste, pero con muy poca vida. ':'')+(R.ok.length?R.ok.map(x=>'✔ '+x).join('<br>')+'<br>':'')+(coins?`<span style="color:var(--yl)">+${coins} 🪙</span>`:'')+extra+
  `<br><button class="btn" data-act="sNext">${win&&R.st?'CONTINUAR ▶':'MAPA'}</button><button class="btn" data-act="sRetry">REINTENTAR</button>${REC.buf.length>10?'<button class="btn" data-act="replay">REPETICIÓN</button>':''}`,0);}
function checkBookDone(B){const store=B.kind==='wi'?prog.wi:prog.story.c;if(store['A_'+B.id])return;const done=B.nodes.filter(n=>n.t!=='db').every(n=>n.t==='cine'?cineSeen(n.cine.id):(store[n.id]||0)>0);
 if(!done)return;store['A_'+B.id]=1;toast(B.kind==='wi'?'🌀 HISTORIA COMPLETADA':'📖 ARCO COMPLETADO',B.name);if(B.kind==='arc'&&storyAllDone())toast('🌀 ¡DESBLOQUEADO!','Historias «¿Qué pasaría si…?»');checkAchs();}
function storyNext(){const S=game.story,n=S&&S.n,won=n&&nodeDone(n);$('#msg').classList.remove('show');$('#sub').innerHTML='';
 const back=()=>{endStoryFight();if(prog.db.length>=7){shenlong();return;}menuState='smap';renderMenu();};
 if(won&&n.cine&&!cineSeen(n.cine.id)){endStoryFight();cinePlay(n.cine,back);}else back();}
function endStoryFight(){game.phase=null;game.paused=false;for(const f of game.f)f.dispose();game.f=[];clearCombat();game.split=false;game.cine=null;game.story=null;canvas.style.filter='';$('#hud').style.display='none';
 menuState='smap';world=WORLDS[0].build(0);SUN_DIR.copy(sun.position).normalize();playTrack('menu');}
function playNode(n){if(n.t==='cine'){const first=book.kind==='arc'&&book.nodes[0]===n,an=(ARCS.find(x=>x.id===book.id)||{}).n;
 cinePlay(first?Object.assign({},n.cine,{shots:[{who:'nar',say:'',card:book.name.toUpperCase(),sub:'ARCO '+an,cam:'wide'},...n.cine.shots]}):n.cine,()=>{checkBookDone(book);menuState='smap';renderMenu();});return;}
 if(n.t==='db'){if(prog.db.includes(n.n))return;if(n.fight){storyStart(Object.assign({},n.fight,{id:n.id,t:'db',n:n.n,name:n.name||'Esfera de '+n.n+' estrellas'}));return;}
  prog.db.push(n.n);saveProg();cinePlay({id:'db_'+n.n,title:'Esfera de '+n.n+' estrellas',world:n.world||0,cast:[{c:n.who||'goku',x:0,z:0}],shots:[{who:n.who||'goku',say:'¡Mira! ¡La Esfera del Dragón de '+n.n+' estrellas! Ya tengo '+prog.db.length+' de 7.',cam:'close',pose:'victory',fx:'flash'}],noSeen:1},()=>{if(prog.db.length>=7)shenlong();else{menuState='smap';renderMenu();}});return;}
 if(n.intro&&!cineSeen(n.intro.id)){cinePlay(n.intro,()=>storyStart(n));return;}storyStart(n);}
function shenlong(){cinePlay({id:'shenlong',title:'Shenlong',world:0,v:1,cast:[{c:'goku',x:-3,z:2},{c:'shenlong',x:4,z:-6}],shots:[
 {who:'goku',say:'¡Ya tenemos las siete Esferas del Dragón!',cam:'close',pose:'victory'},
 {who:'nar',say:'El cielo se oscurece y una luz verde se eleva hacia las nubes…',cam:'wide',fx:'flash'},
 {who:'shenlong',say:'«Habéis reunido las siete Esferas del Dragón. Os concederé un deseo. Decidlo ya.»',cam:'shen',fx:'shake'}],noSeen:1},()=>{menuState='wish';renderMenu();});}

/* ---------------- Cinemáticas (con motor 3D, subtítulos y opción de saltar) ---------------- */
let CINE=null;
function buildShenlong(sup){const g=new THREE.Group(),mat=toon(sup?0xffc23a:0x3aa84a),bel=toon(sup?0xfff2c0:0xe8d88a),pts=[];for(let i=0;i<14;i++)pts.push(V3(Math.sin(i*.9)*4,i*1.6,Math.cos(i*.7)*3-i*.4));
 const cur=new THREE.CatmullRomCurve3(pts),body=new THREE.Mesh(new THREE.TubeGeometry(cur,120,1.1,10,false),mat);g.add(body);
 const end=pts[pts.length-1],head=new THREE.Group();head.position.copy(end);g.add(head);head.add(new THREE.Mesh(new THREE.BoxGeometry(2.4,1.7,3),mat));
 const jaw=new THREE.Mesh(new THREE.BoxGeometry(2,.6,2.4),bel);jaw.position.set(0,-.9,.6);head.add(jaw);
 for(const s of[1,-1]){const h=new THREE.Mesh(new THREE.ConeGeometry(.25,2.4,6),bel);h.position.set(s*.8,1.6,-.8);h.rotation.x=-.6;head.add(h);const e=new THREE.Mesh(new THREE.SphereGeometry(.28,8,6),new THREE.MeshBasicMaterial({color:0xff2a2a}));e.position.set(s*.75,.3,1.4);head.add(e);
  const wh=new THREE.Mesh(new THREE.CylinderGeometry(.05,.02,3,4),bel);wh.position.set(s*1.1,-.2,1.8);wh.rotation.z=s*1.2;head.add(wh);}
 const gl=new THREE.PointLight(sup?0xffd27a:0x7aff6a,2,40);gl.position.copy(end);g.add(gl);return{root:g,head,shen:1};}
function cinePlay(sc,done){clearMenuModels();for(const f of game.f)f.dispose();game.f=[];clearCombat();game.phase=null;$('#hud').style.display='none';
 const W=sc.world==='bills'?TRAIN_WORLD:sc.world==='tdp'?TDP_WORLD:WORLDS[clamp(sc.world|0,0,WORLDS.length-1)];world=W.build(sc.v|0);SUN_DIR.copy(sun.position).normalize();playTrack(sc.music||W.music);
 const cast={};for(const c of sc.cast||[]){let m,ch=null;if(c.c==='shenlong'||c.c==='sshenlong')m=buildShenlong(c.c==='sshenlong');else{const i=chIdx(c.c);if(i<0&&c.c!=='whis')continue;ch=i<0?WHIS:CHARS[i];m=makeModel(ch);m.outfit=null;applyFormModel(m,ch,ch.forms[formIx(ch,c.f||'base')],0);const au=makeAura();au.setColor(ch.forms[formIx(ch,c.f||'base')].aura);m.root.add(au.group);m.aura=au;}
  const gy=world.groundY(c.x||0,c.z||0);m.root.position.set(c.x||0,(gy>-1e9?gy:world.spawnY)+(c.y||0),c.z||0);m.root.scale.setScalar(c.s||1);scene.add(m.root);cast[c.c]={m,ch,f:c.f||'base',to:null,pose:c.pose||'idle',aura:0};}
 for(const k in cast){const o=cast[k];if(o.m.shen)continue;const other=Object.values(cast).filter(x=>x!==o&&!x.m.shen)[0];if(other){const d=other.m.root.position.clone().sub(o.m.root.position);o.m.root.rotation.y=Math.atan2(d.x,d.z);}}
 CINE={sc,i:-1,t:0,cast,done,typed:0,camP:V3(0,6,18),camL:V3(0,2,0),fx:[],shake:0};menuState='cine';cam.position.set(0,6,18);renderMenu();cineNext();}
function cineNext(){const C=CINE;if(!C)return;const sh=C.sc.shots[C.i];if(sh&&C.typed<(sh.say||'').length){C.typed=1e9;return;}
 C.i++;C.t=0;C.typed=0;if(C.i>=C.sc.shots.length){cineEnd();return;}const s=C.sc.shots[C.i],o=C.cast[s.who];
 if(o&&!o.m.shen){if(s.pose)o.pose=s.pose;if(s.to)o.to=V3(s.to[0],0,s.to[1]);}
 if(s.form){const ft=o&&!o.m.shen?o:C.cast[s.fw]||Object.values(C.cast).find(x=>!x.m.shen);if(ft){ft.pendingF=s.form;ft.pose='transform';ft.aura=1.2;ft.tT=1.1;sfx('transform',1);}}
 if(s.poses)for(const k in s.poses)if(C.cast[k])C.cast[k].pose=s.poses[k];
 if(s.aura)for(const k in s.aura)if(C.cast[k])C.cast[k].aura=s.aura[k];
 const fx=s.fx||'';if(fx.includes('flash'))flashScreen(.7);if(fx.includes('shake'))C.shake=1.2;
 if(fx.startsWith('beam')||fx.startsWith('blast')){const[,tg,col]=fx.split(':'),t=C.cast[tg];if(o&&t){o.pose=fx.startsWith('beam')?'beamFire':'blastR';const c=parseInt(col||'5cc8ff',16);C.fx.push({k:'beam',from:o,to:t,c,t:0});sfx('beamFire');}}
 if(fx.startsWith('hit')){const t=C.cast[fx.split(':')[1]];if(t){if(o&&!o.m.shen)o.pose='punchR';t.pose='hit';const d=o&&!o.m.shen?t.m.root.position.clone().sub(o.m.root.position).normalize():V3(-1,0,0);t.to=t.m.root.position.clone().addScaledVector(d,4);t.to.y=0;sfx('hitH');C.shake=.8;sparks(t.m.root.position.clone().add(V3(0,1,0)),0xffffff,14,14,.4);}}
 if(fx.startsWith('boom')){const t=C.cast[fx.split(':')[1]]||o;if(t){explosion(t.m.root.position.clone().add(V3(0,1,0)),2.5,0xffd080);sfx('boom',1);C.shake=1.4;}}
 renderCineBox();}
function renderCineBox(){const C=CINE,s=C.sc.shots[C.i];if(!s)return;const cd=$('#cinecard');if(cd){cd.style.display=s.card?'flex':'none';if(s.card){cd.querySelector('b').textContent=s.card;cd.querySelector('span').textContent=s.sub||'';cd.style.animation='none';void cd.offsetWidth;cd.style.animation='';}}
 {const bx=$('#cinebox');if(bx)bx.style.visibility=s.say?'':'hidden';}const o=C.cast[s.who],name=s.who==='nar'?'':s.who==='shenlong'?'SHENLONG':s.who==='sshenlong'?'SÚPER SHENLONG':o&&o.ch?o.ch.name.toUpperCase():(s.name||'');
 const box=$('#cinebox');if(!box)return;box.querySelector('b').textContent=name;box.classList.toggle('nar',s.who==='nar');}
function cineFrame(dt,t){const C=CINE,s=C.sc.shots[C.i];if(!s)return;C.t+=dt;const txt=s.say||'';C.typed=Math.min(txt.length,C.typed+dt*42);const el=$('#cinetxt');if(el)el.textContent=txt.slice(0,Math.floor(C.typed));
 if(C.typed>=txt.length&&C.t>Math.max(2.4,txt.length*.055+1.4))cineNext();
 for(const k in C.cast){const o=C.cast[k],m=o.m;if(m.shen){m.root.rotation.y=Math.sin(t*.3)*.2;m.head.rotation.x=Math.sin(t*1.3)*.08;continue;}
  if(o.to){m.root.position.x=lerp(m.root.position.x,o.to.x,1-Math.exp(-3*dt));m.root.position.z=lerp(m.root.position.z,o.to.z,1-Math.exp(-3*dt));}
  if(o.tT!=null){o.tT-=dt;{const fa=o.ch.forms[formIx(o.ch,o.pendingF)];if(Math.random()<dt*45){const an=rand(0,TAU),r=rand(.6,2.4);spawn({pos:m.root.position.clone().add(V3(Math.cos(an)*r,rand(0,.6),Math.sin(an)*r)),vel:V3(0,rand(6,14),0),color:fa.aura,size:rand(.2,.5),life:.6});}C.shake=Math.max(C.shake,.35);}if(o.tT<=0){o.tT=null;const fi=formIx(o.ch,o.pendingF);applyFormModel(m,o.ch,o.ch.forms[fi],0);m.aura.setColor(o.ch.forms[fi].aura);o.aura=.6;o.pose='victory';flashScreen(.5);sparks(m.root.position.clone().add(V3(0,1,0)),o.ch.forms[fi].aura,26,16,.5);ring(m.root.position.clone().add(V3(0,1,0)),0xffffff,5,.4,false);C.shake=1;ring(m.root.position.clone().add(V3(0,.3,0)),o.ch.forms[fi].aura,8,.6,true);sfx('flash');}}
  m.target=o.pose;animateModel(m,dt,false);const lv=o.aura||(o.pose==='charge'||o.pose==='transform'?1:0);m.aura.target=lv;m.aura.update(dt,t,lv>.9);}
 for(let i=C.fx.length-1;i>=0;i--){const e=C.fx[i];e.t+=dt;const a=e.from.m.root.position.clone().add(V3(0,.9,0)),b=e.to.m.root.position.clone().add(V3(0,.9,0)),p=a.clone().lerp(b,Math.min(1,e.t*1.8));
  spawn({pos:p,color:e.c,size:1.1,life:.35});spawn({pos:a.clone().lerp(p,Math.random()),color:0xffffff,size:.5,life:.2});if(e.t*1.8>=1&&!e.hit){e.hit=1;explosion(b,2,e.c);e.to.pose='hit';C.shake=1;sfx('boom',.8);}if(e.t>1.1)C.fx.splice(i,1);}
 const o=C.cast[s.who],live=Object.values(C.cast).filter(x=>!x.m.shen),cen=V3();live.forEach(x=>cen.add(x.m.root.position));if(live.length)cen.multiplyScalar(1/live.length);
 let tp,lk;const mode=s.cam||'two';
 if(mode==='shen'){const sh=Object.values(C.cast).find(x=>x.m.shen);const hp=sh?sh.m.head.getWorldPosition(V3()):V3(0,20,0);tp=hp.clone().add(V3(-6,-6,16));lk=hp;}
 else if(mode==='close'&&o&&!o.m.shen){const p=o.m.root.position,fw=V3(Math.sin(o.m.root.rotation.y),0,Math.cos(o.m.root.rotation.y)),r=V3(-fw.z,0,fw.x),s2=o.m.body.scale.y*(o.m.root.scale.x||1);tp=p.clone().addScaledVector(fw,2.3*s2).addScaledVector(r,.6*s2).add(V3(0,1.25*s2,0));lk=p.clone().add(V3(0,1.1*s2,0));}
 else if(mode==='low'&&o&&!o.m.shen){const p=o.m.root.position,fw=V3(Math.sin(o.m.root.rotation.y),0,Math.cos(o.m.root.rotation.y));tp=p.clone().addScaledVector(fw,3.4).add(V3(.8,.3,0));lk=p.clone().add(V3(0,1.3,0));}
 else if(mode==='wide'){const a=t*.12;tp=cen.clone().add(V3(Math.cos(a)*16,7,Math.sin(a)*16));lk=cen.clone().add(V3(0,1.5,0));}
 else{let ab=V3(1,0,0),sep=4;if(live.length>1){ab=live[1].m.root.position.clone().sub(live[0].m.root.position);ab.y=0;sep=ab.length();ab.normalize();}const n=V3(-ab.z,0,ab.x);tp=cen.clone().addScaledVector(n,5+sep*.8).add(V3(0,1.8,0));lk=cen.clone().add(V3(0,1,0));}
 const gy=world.groundY(tp.x,tp.z);if(gy>-1e9&&tp.y<gy+.8)tp.y=gy+.8;C.camP.lerp(tp,1-Math.exp(-4*dt));C.camL.lerp(lk,1-Math.exp(-4*dt));cam.position.copy(C.camP);
 if(C.shake>0){C.shake-=dt*1.5;const k=Math.max(0,C.shake)*.3;cam.position.add(V3(rand(-k,k),rand(-k,k),rand(-k,k)));}cam.lookAt(C.camL);}
function cineEnd(){const C=CINE;if(!C)return;CINE=null;for(const k in C.cast){const m=C.cast[k].m;scene.remove(m.root);if(!m.shen)disposeModel(m);}
 if(!C.sc.noSeen&&!cineSeen(C.sc.id)){prog.story.seen.push(C.sc.id);saveProg();}menuState=null;$('#menu').innerHTML='';
 world=WORLDS[0].build(0);SUN_DIR.copy(sun.position).normalize();playTrack('menu');if(C.done)C.done();else{menuState='title';renderMenu();}}
function cineHTML(){return`<div class="cinebar t"></div><div class="cinebar b"></div><div class="cinetap" data-act="cineNext"></div><button class="btn cineskip" data-act="cineSkip">SALTAR ▶▶</button>
 <div id="cinecard"><span></span><b></b></div><div id="cinebox" data-act="cineNext"><b></b><span id="cinetxt"></span><em>▶</em></div>`;}

/* ---------------- Cinemática especial al conseguir una forma nueva ---------------- */
const FORM_LINES=['¡Siento un poder que nunca había sentido…!','¡Mi cuerpo arde… algo despierta dentro de mí!','¡Este poder… no tiene límites!','¡Ya no hay vuelta atrás! ¡HAAAAAA!'];
function formCine(ci,fi,done){const ch=CHARS[ci],f=ch.forms[fi];if(!ch||!f){if(done)done();return;}const b=ch.forms[0],W=f.era==='S'?10:f.era==='GT'?3:0,id=ch.id;
 cinePlay({id:'form_'+id+'_'+f.id,title:ch.name+' · '+f.name,world:W,v:1,noSeen:1,cast:[{c:id,x:0,z:0,f:b.id}],shots:[
  {who:'nar',say:'',card:'¡NUEVO PODER!',sub:ch.name.toUpperCase(),cam:'wide',pose:'charge',aura:{[id]:1}},
  {who:id,say:FORM_LINES[Math.random()*FORM_LINES.length|0],cam:'low',pose:'charge',aura:{[id]:1.2},fx:'shake'},
  {who:id,say:'¡'+f.name.toUpperCase()+'!',cam:'close',form:f.id,fx:'flash'},
  {who:'nar',say:'',card:f.name.toUpperCase(),sub:'PODER ×'+String(f.mult>=1000?fmtP(f.mult):Math.round(f.mult*10)/10).replace('.',',')+' · '+fmtP(ch.base*f.mult),cam:'two',pose:'victory',aura:{[id]:.6}}]},done);}
