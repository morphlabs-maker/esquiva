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
 loadStory(a.id,a.file).then(d=>{book=Object.assign({kind:'arc',color:a.color},d);layoutBook(book);{const nx=nextNode(book);selNode=nx?nx.id:null;}storyMsg='';menuState='smap';sfx('ok');playTrack(arcTrack(book.id)||'menu');checkCached();renderMenu();})
  .catch(()=>{storyMsg='No se pudo descargar «'+a.name+'». La primera vez necesita internet; después funciona sin conexión.';sfx('back');renderMenu();});}
function openWhatif(i){if(!storyAllDone()){sfx('back');return;}loadStory('whatif',WHATIF_FILE).then(d=>{const s=d.stories[i];if(!s)return;book=Object.assign({kind:'wi'},s);layoutBook(book);{const nx=nextNode(book);selNode=nx?nx.id:null;}menuState='smap';sfx('ok');playTrack('arc_whatif');renderMenu();})
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
    ${freeRow(n)}<div class="mpad">${open?`<button class="btn sbtn" data-act="sPlay">${done?'⚔ REPETIR':'⚔ ¡A PELEAR!'}</button>`:'🔒 Completa el lugar anterior'}${n.cine&&cineSeen(n.cine.id)?'<button class="btn sbtn" data-act="sCine">🎬 ESCENA</button>':''}</div>`;}}
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
 const a=storyFighter(0,freeSpec(n),{team:0});a.minHp=1;game.story.free=freeOn(n);
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
 $('#menu').innerHTML='';menuState=null;playTrack(arcTrack(B&&B.id)||W.music);startRound();game.timer=999;
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
 menuState='smap';world=WORLDS[0].build(0);SUN_DIR.copy(sun.position).normalize();playTrack(arcTrack(book&&book.id)||'menu');}
function playNode(n){if(n.t==='cine'){const first=book.kind==='arc'&&book.nodes[0]===n,an=(ARCS.find(x=>x.id===book.id)||{}).n;
 cinePlay(first?Object.assign({},n.cine,{shots:[{who:'nar',say:'',card:book.name.toUpperCase(),sub:'ARCO '+an,cam:'wide'},...n.cine.shots]}):n.cine,()=>{checkBookDone(book);menuState='smap';renderMenu();});return;}
 if(n.t==='db'){if(prog.db.includes(n.n))return;if(n.fight){storyStart(Object.assign({},n.fight,{id:n.id,t:'db',n:n.n,name:n.name||'Esfera de '+n.n+' estrellas'}));return;}
  prog.db.push(n.n);saveProg();cinePlay({id:'db_'+n.n,title:'Esfera de '+n.n+' estrellas',world:n.world||0,cast:[{c:n.who||'goku',x:0,z:0}],shots:[{who:n.who||'goku',say:'¡Mira! ¡La Esfera del Dragón de '+n.n+' estrellas! Ya tengo '+prog.db.length+' de 7.',cam:'close',pose:'victory',fx:'flash'}],noSeen:1},()=>{if(prog.db.length>=7)shenlong();else{menuState='smap';renderMenu();}});return;}
 if(n.intro&&!cineSeen(n.intro.id)){cinePlay(n.intro,()=>storyStart(n));return;}storyStart(n);}
function shenlong(){cinePlay({id:'shenlong',title:'Shenlong',world:0,v:1,cast:[{c:'goku',x:-3,z:2},{c:'shenlong',x:4,z:-6,hidden:1}],shots:[
 {who:'goku',say:'¡Ya tenemos las siete Esferas del Dragón!',cam:'close',pose:'victory',balls:'normal'},
 {who:'nar',say:'El cielo se oscurece y una luz verde se eleva hacia las nubes…',cam:'wide',fx:'flash'},
 {who:'shenlong',say:'«Habéis reunido las siete Esferas del Dragón. Os concederé un deseo. Decidlo ya.»',cam:'shen',fx:'shake',ballsOff:1,show:'shenlong'}],noSeen:1},()=>{menuState='wish';renderMenu();});}

/* ---------------- Cinemáticas (con motor 3D, subtítulos y opción de saltar) ---------------- */
let CINE=null;
/* 3.0: Shenlong y Súper Shenlong de verdad: cuerpo de serpiente que se estrecha hacia la cola, escamas, aletas dorsales,
   cuatro brazos con garras, cabeza alargada con cuernos, bigotes y melena; Súper Shenlong es dorado, enorme y con alas */
function buildShenlong(sup){const g=new THREE.Group(),bodyC=sup?0xffc23a:0x3aa84a,bellyC=sup?0xff8a2a:0xe8d88a,mat=toon(bodyC),bel=toon(bellyC),horn=toon(sup?0xfff2c0:0xf0e0b0);
 const pts=[];for(let i=0;i<18;i++){const k=i/17;pts.push(V3(Math.sin(k*7.5)*(5-k*2)*(sup?1.3:1),k*26,Math.cos(k*5.2)*3.5-k*6));}
 const cur=new THREE.CatmullRomCurve3(pts),TS=180,RS=12,geo=new THREE.TubeGeometry(cur,TS,1,RS,false),P=geo.attributes.position,col=new Float32Array(P.count*3),cA=new THREE.Color(bodyC),cB=new THREE.Color(bellyC),cC=new THREE.Color(bodyC).multiplyScalar(.88);
 for(let i=0;i<=TS;i++){const k=i/TS,r=(.35+1.25*Math.pow(k,.6))*(sup?1.25:1),c=cur.getPointAt(k);for(let j=0;j<=RS;j++){const vi=i*(RS+1)+j;const v=V3(P.getX(vi),P.getY(vi),P.getZ(vi)).sub(c).multiplyScalar(r).add(c);P.setXYZ(vi,v.x,v.y,v.z);
  const cc=j>RS*.55&&j<RS*.95?cB:(i%6<2?cC:cA);col[vi*3]=cc.r;col[vi*3+1]=cc.g;col[vi*3+2]=cc.b;}}
 geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.computeVertexNormals();g.add(new THREE.Mesh(geo,new THREE.MeshToonMaterial({vertexColors:true,gradientMap:TOON})));
 /* aletas dorsales y brazos */
 for(let i=2;i<17;i++){const k=i/17,p=cur.getPointAt(k),tg=cur.getTangentAt(k),r=(.35+1.25*Math.pow(k,.6))*(sup?1.25:1);const fin=new THREE.Mesh(new THREE.ConeGeometry(.35*r,1.3*r,4),sup?toon(0xff6a2a):horn);fin.position.copy(p).add(V3(0,r*.95,0));fin.lookAt(p.clone().add(tg));fin.rotateX(-1.2);g.add(fin);}
 for(const[k,sd] of[[.55,1],[.6,-1],[.82,1],[.86,-1]]){const p=cur.getPointAt(k),r=(.35+1.25*Math.pow(k,.6))*(sup?1.25:1),arm=new THREE.Group();arm.position.copy(p).add(V3(sd*r*.9,-r*.2,0));g.add(arm);
  const up=new THREE.Mesh(new THREE.CylinderGeometry(.28*r,.22*r,2.2*r,8),mat);up.rotation.z=sd*1.1;up.position.x=sd*.9*r;arm.add(up);
  for(let c=0;c<3;c++){const cl=new THREE.Mesh(new THREE.ConeGeometry(.08*r,.6*r,5),horn);cl.position.set(sd*1.85*r,-.55*r,(c-1)*.22*r);cl.rotation.z=Math.PI;arm.add(cl);}}
 /* cabeza */
 const end=cur.getPointAt(1),tE=cur.getTangentAt(1),head=new THREE.Group(),HS=sup?2.3:1.75;head.position.copy(end);head.scale.setScalar(HS);g.add(head);
 const skull=new THREE.Mesh(new THREE.SphereGeometry(1.15,16,12),mat);skull.scale.set(1,.78,1.15);head.add(skull);
 const snout=new THREE.Mesh(new THREE.CylinderGeometry(.62,.95,2.6,10),mat);snout.rotation.x=Math.PI/2;snout.scale.set(1,1,.72);snout.position.set(0,-.12,1.95);head.add(snout);
 const nose=new THREE.Mesh(new THREE.SphereGeometry(.7,12,8),mat);nose.scale.set(1.15,.62,.7);nose.position.set(0,.02,3.2);head.add(nose);
 for(const s of[1,-1]){const n=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),new THREE.MeshBasicMaterial({color:0x1a1010}));n.position.set(s*.32,.2,3.62);head.add(n);}
 const jaw=new THREE.Mesh(new THREE.CylinderGeometry(.45,.75,2.4,10),bel);jaw.rotation.x=Math.PI/2+.18;jaw.scale.set(1,1,.45);jaw.position.set(0,-.72,1.75);head.add(jaw);
 for(let i=0;i<5;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(.09,.35,4),new THREE.MeshBasicMaterial({color:0xffffff}));t.position.set(-.55+i*.27,-.5,2.6);t.rotation.x=Math.PI;head.add(t);}
 for(const s of[1,-1]){const e=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),new THREE.MeshBasicMaterial({color:0xff1a1a}));e.position.set(s*.72,.35,1.05);e.scale.set(1,.7,.6);head.add(e);
  const br=new THREE.Mesh(new THREE.BoxGeometry(.7,.18,.3),bel);br.position.set(s*.72,.66,1.0);br.rotation.z=-s*.3;head.add(br);
  const hr=new THREE.Mesh(new THREE.ConeGeometry(.22,3.4,6),horn);hr.position.set(s*.7,1.5,-1.1);hr.rotation.set(-1.0,0,-s*.35);head.add(hr);
  const hr2=new THREE.Mesh(new THREE.ConeGeometry(.12,1.2,5),horn);hr2.position.set(s*.85,2.1,-1.6);hr2.rotation.set(-.3,0,-s*.9);head.add(hr2);
  const wc=new THREE.CatmullRomCurve3([V3(s*.8,-.1,2.8),V3(s*2.2,.1,3.6),V3(s*3.6,-.6,3.2),V3(s*4.6,-1.6,2.2)]);head.add(new THREE.Mesh(new THREE.TubeGeometry(wc,16,.05,4,false),horn));
  for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(.25,1.4,5),sup?toon(0xff8a2a):bel);m.position.set(s*(.6+i*.18),.1-i*.25,-1.2-i*.1);m.rotation.set(-1.3,0,-s*(.8+i*.25));head.add(m);}}
 for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.ConeGeometry(.16,1.1,5),bel);b.position.set(-.3+i*.2,-1.3,1.0-i*.25);b.rotation.x=Math.PI+.4;head.add(b);}
 head.lookAt(end.clone().add(V3(0,-2,10)));
 /* alas de Súper Shenlong */
 if(sup){for(const s of[1,-1])for(let w=0;w<2;w++){const k=w?.62:.78,p=cur.getPointAt(k),r=(.35+1.25*Math.pow(k,.6))*1.25,wing=new THREE.Group();wing.position.copy(p).add(V3(s*r,r*.4,0));g.add(wing);
  const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(9,3);sh.lineTo(16,-1);sh.lineTo(12.5,-3.2);sh.lineTo(10,-1.6);sh.lineTo(8,-4.5);sh.lineTo(5.5,-2.4);sh.lineTo(3.5,-4.8);sh.lineTo(1.5,-2);sh.lineTo(0,0);
  const mem=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshBasicMaterial({color:w?0xffb02a:0xffd23a,transparent:true,opacity:.85,side:THREE.DoubleSide}));mem.scale.set(s*(w?.8:1)*1.2,(w?.8:1)*1.2,1);mem.rotation.set(0,s*.35,w?-.25:.35);wing.add(mem);
  const bone=new THREE.Mesh(new THREE.CylinderGeometry(.14,.2,11,6),horn);bone.rotation.z=-s*1.25;bone.position.set(s*5,1.6,0);wing.add(bone);}
  const halo=glowSprite(0xffd27a,70);halo.position.copy(end).add(V3(0,-6,0));g.add(halo);}
 const gl=new THREE.PointLight(sup?0xffd27a:0x7aff6a,2.2,90);gl.position.copy(end);g.add(gl);if(sup)g.scale.setScalar(1.25);
 return{root:g,head,shen:1,sup:!!sup};}
/* 3.0: actor de cinemática (también los que nacen de una fusión a mitad de escena) */
function mkCineCast(c,cast){let m,ch=null;if(c.c==='shenlong'||c.c==='sshenlong')m=buildShenlong(c.c==='sshenlong');else{const i=chIdx(c.c);if(i<0&&c.c!=='whis')return null;ch=i<0?WHIS:CHARS[i];m=makeModel(ch);m.outfit=null;applyFormModel(m,ch,ch.forms[formIx(ch,c.f||'base')],0);const au=makeAura();au.setColor(ch.forms[formIx(ch,c.f||'base')].aura);m.root.add(au.group);m.aura=au;}
 const gy=cineGround(c.x||0,c.z||0),g0=(gy>-1e9?gy:world.spawnY)+(c.y||0);m.root.position.set(c.x||0,g0,c.z||0);m.root.scale.setScalar(c.s||1);scene.add(m.root);
 const o=cast[c.c]={m,ch,f:c.f||'base',to:null,pose:c.pose||'idle',aura:0,g0};if(c.under){m.root.position.y=g0-6;m.root.visible=false;}if(c.hidden)m.root.visible=false;return o;}
function cinePlay(sc,done){clearMenuModels();for(const f of game.f)f.dispose();game.f=[];clearCombat();game.phase=null;$('#hud').style.display='none';
 const W=sc.world==='bills'?TRAIN_WORLD:sc.world==='tdp'?TDP_WORLD:WORLDS[clamp(sc.world|0,0,WORLDS.length-1)];world=W.build(sc.v|0);SUN_DIR.copy(sun.position).normalize();playTrack(sc.music||(typeof book!=='undefined'&&book&&menuState!=='gallery'&&arcTrack(book.id))||W.music);
 const cast={};for(const c of sc.cast||[])mkCineCast(c,cast);
 for(const k in cast){const o=cast[k];if(o.m.shen)continue;const other=Object.values(cast).filter(x=>x!==o&&!x.m.shen)[0];if(other){const d=other.m.root.position.clone().sub(o.m.root.position);o.m.root.rotation.y=Math.atan2(d.x,d.z);}}
 CINE={sc,i:-1,t:0,cast,done,typed:0,camP:V3(0,6,18),camL:V3(0,2,0),fx:[],shake:0};menuState='cine';cam.position.set(0,6,18);renderMenu();cineNext();}
function cineNext(){const C=CINE;if(!C)return;const sh=C.sc.shots[C.i];if(sh&&C.typed<(sh.say||'').length){C.typed=1e9;return;}
 C.i++;C.t=0;C.typed=0;if(C.i>=C.sc.shots.length){cineEnd();return;}const s=C.sc.shots[C.i],o=C.cast[s.who];cinePickCam(C,s);
 if(o&&!o.m.shen){if(s.pose)o.pose=s.pose;if(s.to)o.to=V3(s.to[0],0,s.to[1]);}
 if(s.form){const ft=o&&!o.m.shen?o:C.cast[s.fw]||Object.values(C.cast).find(x=>!x.m.shen);if(ft){ft.pendingF=s.form;ft.pose='transform';ft.aura=1.2;ft.tT=1.1;sfx('transform',1);}}
 if(s.poses)for(const k in s.poses)if(C.cast[k])C.cast[k].pose=s.poses[k];
 if(s.aura)for(const k in s.aura)if(C.cast[k])C.cast[k].aura=s.aura[k];
 cineActs(C,s,o);
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
  cineAnim(C,o,m,dt,t);m.target=o.pose;animateModel(m,dt,false);const lv=o.aura||(o.pose==='charge'||o.pose==='transform'?1:0);m.aura.target=lv;m.aura.update(dt,t,lv>.9);}
 cineFxFrame(C,dt,t);
 for(let i=C.fx.length-1;i>=0;i--){const e=C.fx[i];e.t+=dt;const a=e.from.m.root.position.clone().add(V3(0,.9,0)),b=e.to.m.root.position.clone().add(V3(0,.9,0)),p=a.clone().lerp(b,Math.min(1,e.t*1.8));
  spawn({pos:p,color:e.c,size:1.1,life:.35});spawn({pos:a.clone().lerp(p,Math.random()),color:0xffffff,size:.5,life:.2});if(e.t*1.8>=1&&!e.hit){e.hit=1;explosion(b,2,e.c);e.to.pose='hit';C.shake=1;sfx('boom',.8);}if(e.t>1.1)C.fx.splice(i,1);}
 const o=C.cast[s.who],live=Object.values(C.cast).filter(x=>!x.m.shen),cen=V3();live.forEach(x=>cen.add(x.m.root.position));if(live.length)cen.multiplyScalar(1/live.length);
 let tp,lk;const mode=C.camMode||s.cam||'two';
 if(mode==='shen'){const sh=Object.values(C.cast).find(x=>x.m.shen);const hp=sh?sh.m.head.getWorldPosition(V3()):V3(0,20,0),k=sh?Math.max(1,sh.m.root.scale.x*(sh.m.sup?1.25:1)*.75):1;tp=hp.clone().add(V3(-6,-7,17).multiplyScalar(k));lk=hp.clone().add(V3(0,-2*k,0));}
 else if(mode==='close'&&o&&!o.m.shen){const p=o.m.root.position,fw=V3(Math.sin(o.m.root.rotation.y),0,Math.cos(o.m.root.rotation.y)),r=V3(-fw.z,0,fw.x),s2=o.m.body.scale.y*(o.m.root.scale.x||1);tp=p.clone().addScaledVector(fw,2.3*s2).addScaledVector(r,.6*s2).add(V3(0,1.25*s2,0));lk=p.clone().add(V3(0,1.1*s2,0));}
 else if(mode==='low'&&o&&!o.m.shen){const p=o.m.root.position,fw=V3(Math.sin(o.m.root.rotation.y),0,Math.cos(o.m.root.rotation.y));tp=p.clone().addScaledVector(fw,3.4).add(V3(.8,.3,0));lk=p.clone().add(V3(0,1.3,0));}
 else if(mode==='sky'){tp=cen.clone().add(V3(0,2.5,20));lk=cen.clone().add(V3(0,9,0));}
 else if(mode==='wide'){const a=t*.12;tp=cen.clone().add(V3(Math.cos(a)*16,7,Math.sin(a)*16));lk=cen.clone().add(V3(0,1.5,0));}
 else{let ab=V3(1,0,0),sep=4;if(live.length>1){ab=live[1].m.root.position.clone().sub(live[0].m.root.position);ab.y=0;sep=ab.length();ab.normalize();}const n=V3(-ab.z,0,ab.x);tp=cen.clone().addScaledVector(n,5+sep*.8).add(V3(0,1.8,0));lk=cen.clone().add(V3(0,1,0));}
 cineMove(C,mode,o,tp,lk,live);const gy=world.groundY(tp.x,tp.z);if(gy>-1e9&&tp.y<gy+.8)tp.y=gy+.8;if(C.cut){C.cut=false;C.camP.copy(tp);C.camL.copy(lk);}else{C.camP.lerp(tp,1-Math.exp(-4*dt));C.camL.lerp(lk,1-Math.exp(-4*dt));}cam.position.copy(C.camP);
 if(C.shake>0){C.shake-=dt*1.5;const k=Math.max(0,C.shake)*.3;cam.position.add(V3(rand(-k,k),rand(-k,k),rand(-k,k)));}cam.lookAt(C.camL);}
function cineEnd(){const C=CINE;if(!C)return;CINE=null;if(C.balls){for(const b of C.balls.list)scene.remove(b);C.balls=null;}for(const k in C.cast){const m=C.cast[k].m;scene.remove(m.root);if(!m.shen)disposeModel(m);}
 if(!C.sc.noSeen&&!cineSeen(C.sc.id)){prog.story.seen.push(C.sc.id);saveProg();}menuState=null;$('#menu').innerHTML='';
 world=WORLDS[0].build(0);SUN_DIR.copy(sun.position).normalize();playTrack('menu');if(C.done)C.done();else{menuState='title';renderMenu();}}
function cineHTML(){return`<div class="cinebar t"></div><div class="cinebar b"></div><div class="cinetap" data-act="cineNext"></div><button class="btn cineskip" data-act="cineSkip">SALTAR ▶▶</button><div id="cinefade"></div><div class="cinegrain"></div>
 <div id="cinecard"><span></span><b></b></div><div id="cinebox" data-act="cineNext"><b></b><span id="cinetxt"></span><em>▶</em></div>`;}

/* ---------------- Cinemática especial al conseguir una forma nueva ---------------- */
const FORM_LINES=['¡Siento un poder que nunca había sentido…!','¡Mi cuerpo arde… algo despierta dentro de mí!','¡Este poder… no tiene límites!','¡Ya no hay vuelta atrás! ¡HAAAAAA!'];
function formCine(ci,fi,done){const ch=CHARS[ci],f=ch.forms[fi];if(!ch||!f){if(done)done();return;}const b=ch.forms[0],W=f.era==='S'?10:f.era==='GT'?3:0,id=ch.id;
 cinePlay({id:'form_'+id+'_'+f.id,title:ch.name+' · '+f.name,world:W,v:1,noSeen:1,cast:[{c:id,x:0,z:0,f:b.id}],shots:[
  {who:'nar',say:'',card:'¡NUEVO PODER!',sub:ch.name.toUpperCase(),cam:'wide',pose:'charge',aura:{[id]:1}},
  {who:id,say:FORM_LINES[Math.random()*FORM_LINES.length|0],cam:'low',pose:'charge',aura:{[id]:1.2},fx:'shake'},
  {who:id,say:'¡'+f.name.toUpperCase()+'!',cam:'close',form:f.id,fx:'flash'},
  {who:'nar',say:'',card:f.name.toUpperCase(),sub:'PODER ×'+String(f.mult>=1000?fmtP(f.mult):Math.round(f.mult*10)/10).replace('.',',')+' · '+fmtP(ch.base*f.mult),cam:'two',pose:'victory',aura:{[id]:.6}}]},done);}

/* ---- 3.0: momentos icónicos en las cinemáticas ----
   rise:[ids]  salen de debajo del suelo (Torneo del Poder)      lift:id  telequinesis: lo levanta en el aire
   explode:id  estalla y desaparece (Krilin)                      dance:[a,b]  danza de la fusión «¡Fu-sión-ha!»
   merge:{from:[a,b],into:id,f}  nace la fusión entre los dos     uiwake:id  despertar del Ultra Instinto (destellos plateados)
   hide:id / show:id                                              orbit:true  cámara girando alrededor */
function cineActs(C,s,o){const A=k=>C.cast[k];
 if(s.rise)for(const k of s.rise){const a=A(k);if(!a)continue;a.m.root.visible=true;a.rise={t:0};}if(s.rise){sfx('boom',.7);C.shake=Math.max(C.shake,1);}
 if(s.lift){const a=A(s.lift);if(a){a.lift={t:0};a.pose='hit';sfx('beamCharge',1);}}
 if(s.explode){const a=A(s.explode);if(a){const p=a.m.root.position.clone().add(V3(0,1,0));explosion(p,3.2,0xffd080);flashScreen(.8);sfx('boom',1);C.shake=1.6;a.m.root.visible=false;a.gone=1;}}
 if(s.dance){const[a,b]=s.dance.map(A);if(a&&b){const L=a.m.root.position.x<=b.m.root.position.x?a:b,Rr=L===a?b:a,mid=L.m.root.position.clone().add(Rr.m.root.position).multiplyScalar(.5);
  C.dance={L,R:Rr,t:0,mid,z:mid.z};L.to=V3(mid.x-3.2,0,mid.z);Rr.to=V3(mid.x+3.2,0,mid.z);L.m.root.rotation.y=0;Rr.m.root.rotation.y=0;}}
 if(s.merge){const ids=s.merge.from||[],ps=ids.map(A).filter(Boolean);if(ps.length){const mid=V3();ps.forEach(x=>{mid.add(x.m.root.position);x.m.root.visible=false;x.gone=1;});mid.multiplyScalar(1/ps.length);
  C.dance=null;const n=mkCineCast({c:s.merge.into,f:s.merge.f||'base',x:mid.x,z:mid.z},C.cast);if(n){n.aura=1.3;n.pose='powerup';n.born=1.2;}flashScreen(1);sfx('flash');C.shake=1.4;
  for(let i=0;i<40;i++)spawn({pos:mid.clone().add(V3(0,1,0)),vel:rndDir().multiplyScalar(rand(6,16)),color:0xfff2a0,size:rand(.3,.7),life:.7});ring(mid.clone().add(V3(0,1,0)),0xfff2a0,8,.6,false,.2);}}
 if(s.uiwake){const a=A(s.uiwake);if(a){C.ui={a,t:0};flashScreen(.6,'#e8f0ff');}}
 if(s.balls)cineBalls(C,s.balls);if(s.ballsOff&&C.balls){for(const b of C.balls.list)scene.remove(b);C.balls=null;flashScreen(1);sfx('flash');}
 if(s.hide){const a=A(s.hide);if(a)a.m.root.visible=false;}if(s.show){const a=A(s.show);if(a)a.m.root.visible=true;}}
function cineAnim(C,o,m,dt,t){
 if(o.rise){o.rise.t+=dt;const k=Math.min(1,o.rise.t/1.6),e=1-Math.pow(1-k,3);m.root.position.y=o.g0-6+6*e;if(k<1&&Math.random()<dt*30)spawn({pos:m.root.position.clone().setY(o.g0+.2).add(V3(rand(-1.2,1.2),0,rand(-1.2,1.2))),vel:V3(rand(-2,2),rand(2,5),rand(-2,2)),color:0xc8c0d8,size:rand(.5,1.1),life:.8,smoke:true,op:.7});if(k>=1)o.rise=null;}
 if(o.lift){o.lift.t+=dt;const k=Math.min(1,o.lift.t/1.4);m.root.position.y=o.g0+4.2*k+Math.sin(t*9)*.08*k;m.root.rotation.z=Math.sin(t*7)*.15*k;if(Math.random()<dt*25)spawn({pos:m.root.position.clone().add(V3(rand(-.6,.6),rand(0,1.6),rand(-.6,.6))),color:0xc070ff,size:rand(.3,.6),life:.3});}
 if(o.born!=null){o.born-=dt;if(Math.random()<dt*40)spawn({pos:m.root.position.clone().add(V3(rand(-1,1),rand(0,2),rand(-1,1))),vel:V3(0,rand(3,7),0),color:0xfff2a0,size:rand(.3,.6),life:.5});if(o.born<=0){o.born=null;o.pose='victory';}}
 const D=C.dance;if(D&&(o===D.L||o===D.R)){const ph=D.t<.95?'A':D.t<1.9?'B':'C',M=o===D.L?'M':'';o.pose='fuse'+ph+M;
  if(ph==='B'){o.to=V3(D.mid.x+(o===D.L?-1.9:1.9),0,D.z);}if(ph==='C'){o.to=V3(D.mid.x+(o===D.L?-1.05:1.05),0,D.z);}
  m.root.rotation.y=0;}}
function cineFxFrame(C,dt,t){if(C.balls){const B=C.balls;B.t+=dt;B.list.forEach((b,i)=>{const a=i/7*TAU+B.t*.25,r=B.r*(1-Math.min(.55,B.t*.08));b.position.set(B.c.x+Math.cos(a)*r,B.c.y+B.t*(B.sup?1.6:.25)+Math.sin(B.t*2+i)*.3*B.s,B.c.z+Math.sin(a)*r);b.rotation.y+=dt*.6;});if(Math.random()<dt*12){const b=B.list[Math.random()*7|0];spawn({pos:b.position.clone().add(rndDir().multiplyScalar(B.s)),color:0xffb03a,size:B.s*.6,life:.4});}}
if(C.dance){const D=C.dance,p=D.t;D.t+=dt;if((p<.95&&D.t>=.95)||(p<1.9&&D.t>=1.9))sfx('sel');if(p<1.9&&D.t>=1.9){flashScreen(.35,'#fff2a0');}
  if(D.t>1.9&&Math.random()<dt*30)spawn({pos:D.mid.clone().add(V3(rand(-.3,.3),1.3+rand(-.2,.2),0)),color:0xfff2a0,size:.4,life:.3});}
 if(C.ui){const U=C.ui,m=U.a.m;U.t+=dt;const c=m.root.position;for(let i=0;i<3;i++){const a=t*4+i*2.1,r=1.1+Math.sin(t*3+i)*.3;spawn({pos:c.clone().add(V3(Math.cos(a)*r,.3+((t*1.5+i*.33)%1)*2.2,Math.sin(a)*r)),color:i?0xdde8ff:0x9ab8ff,size:rand(.15,.35),life:.5});}
  if(Math.random()<dt*2){const g=m.root.clone();g.traverse(x=>{if(x.material){x.material=x.material.clone();x.material.transparent=true;x.material.opacity=.35;}});g.position.x+=rand(-1,1);g.position.z+=rand(-1,1);scene.add(g);setTimeout(()=>scene.remove(g),220);}}}

/* las 7 Esferas del Dragón (o las Súper Esferas, del tamaño de planetas) que brillan y giran antes de que aparezca el dragón */
const BALL_TEX=[];
function ballTex(n){return BALL_TEX[n]||(BALL_TEX[n]=canvasTex(128,(g,S)=>{const gr=g.createRadialGradient(S*.38,S*.34,4,S/2,S/2,S*.56);gr.addColorStop(0,'#fff6c0');gr.addColorStop(.35,'#ffb030');gr.addColorStop(1,'#d05a10');g.fillStyle=gr;g.fillRect(0,0,S,S);
 const P=[[64,64],[46,50],[82,50],[46,80],[82,80],[64,40],[64,88]].slice(0,n),star=(x,y,r)=>{g.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr=k%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}g.closePath();g.fill();};
 g.fillStyle='#e01a1a';const L=n===1?[[64,64]]:n===2?[[50,64],[78,64]]:n===3?[[64,48],[50,76],[78,76]]:P;for(const[x,y]of L)star(x,y,n<4?13:10);}));}
function cineBalls(C,kind){const sup=kind==='super',s=sup?3.2:.42,R=sup?13:2.4,list=[];const live=Object.values(C.cast).filter(x=>!x.m.shen),c=V3();live.forEach(x=>c.add(x.m.root.position));if(live.length)c.multiplyScalar(1/live.length);
 const cen=c.clone().add(sup?V3(0,11,0):V3(0,.45,0));
 for(let i=0;i<7;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(s,24,16),new THREE.MeshBasicMaterial({map:ballTex(i+1),fog:false}));const gl=glowSprite(0xffa030,s*4);b.add(gl);scene.add(b);list.push(b);}
 C.balls={list,c:cen,r:R,s,t:0,sup};sfx('beamCharge',1.2);}
/* 3.0: modo libre al terminar la historia: repite cualquier pelea con el luchador que quieras y todas las formas y técnicas que hayas ganado */
const freeOn=n=>storyAllDone()&&nodeDone(n)&&!!store.get('kc_sfree',false);
function freeChar(n){const id=store.get('kc_sfc','');const i=chIdx(id);return i>=0&&!lockedC(i)?id:n.p.c;}
function freeSpec(n){if(!freeOn(n))return n.p;const id=freeChar(n),ch=CHARS[chIdx(id)],v=VER_DATA[id]?verNear(id,book&&book.id):null,d=v?verInfo(id,v):null;
 /* 3.1: al repetir una pelea, tu luchador usa su versión de ese arco (poder y formas de entonces) */
 let forms=ch.forms.map((f,i)=>owns(ch,i)&&(!d||d.forms.includes(f.id))?f.id:null).filter(Boolean);if(!forms.length)forms=['base'];
 return{c:id,f:forms[0],forms,base:d?d.base:Math.max(ch.base,id===n.p.c?(n.p.base||0):0)};}
function freeRow(n){if(!storyAllDone()||!nodeDone(n))return'';const on=!!store.get('kc_sfree',false);
 return`<div class="mpad" style="align-items:center">🔓 Modo libre: <button class="btn sbtn" data-act="sFree">${on?'SÍ':'NO'}</button>${on?`<button class="btn sbtn" data-act="sFc" data-arg="-1">◀</button><b>${esc(charName(freeChar(n)))}</b><button class="btn sbtn" data-act="sFc" data-arg="1">▶</button>`:''}</div>${on?'<div class="tip">Con tus formas, técnicas y versión. El rival es el de la historia.</div>':''}`;}
Object.assign(ACTIONS,{sFree:()=>{store.set('kc_sfree',!store.get('kc_sfree',false));sfx('sel');renderMenu();},
 sFc:a=>{const n=nodeById(selNode);if(!n)return;const L=CHARS.map((c,i)=>i).filter(i=>!lockedC(i)),cur0=chIdx(freeChar(n)),k=L.indexOf(cur0);store.set('kc_sfc',CHARS[L[(k+(+a||1)+L.length)%L.length]].id);sfx('sel');renderMenu();}});
/* 3.1: el suelo de las cinemáticas cuenta también las rocas y plataformas (antes los actores salían hundidos en los escalones del Torneo) */
function cineGround(x,z){let g=world.groundY(x,z);for(const r of world.rocks||[])if(r.alive&&!r.cover&&Math.hypot(x-r.x,z-r.z)<r.r+.3)g=Math.max(g,r.top());return g;}
/* 3.1: cinemáticas de película: cortes secos con fundido, plano por encima del hombro del que escucha,
   acercamiento lento en los primeros planos, travelling lateral en los planos de dos y grúa en los generales */
function cinePickCam(C,s){const prev=C.camMode,want=s.cam||'two',o=C.cast[s.who];let m=want;
 if(want==='close'&&o&&!o.m.shen&&cineListener(C,o)&&((C.i*7+s.who.length)%3===1))m='over';
 if(want==='two'&&!s.cam&&C.i%4===3)m='over';
 C.camMode=m;if(prev&&prev!==m||(s.cam==='close'&&C.lastWho!==s.who)){C.cut=true;const f=$('#cinefade');if(f){f.classList.add('on');setTimeout(()=>f.classList.remove('on'),110);}}C.lastWho=s.who;}
function cineListener(C,o){const live=Object.values(C.cast).filter(x=>x!==o&&!x.m.shen&&x.m.root.visible);if(!live.length)return null;
 return live.sort((a,b)=>a.m.root.position.distanceTo(o.m.root.position)-b.m.root.position.distanceTo(o.m.root.position))[0];}
function cineMove(C,mode,o,tp,lk,live){const t=C.t;
 if(mode==='over'&&o&&!o.m.shen){const L=cineListener(C,o);if(L){const sp=o.m.root.position,lp=L.m.root.position,d=sp.clone().sub(lp);d.y=0;const dl=d.length()||1;d.multiplyScalar(1/dl);const side=V3(-d.z,0,d.x),k=(L.m.body.scale.y||1)*(L.m.root.scale.x||1);
  tp.copy(lp).addScaledVector(d,-1.6*k).addScaledVector(side,.75*k).add(V3(0,1.45*k,0));lk.copy(sp).add(V3(0,1.15*(o.m.body.scale.y||1),0));tp.lerp(lk,clamp(t/6,0,.18));return;}}
 if(mode==='close')tp.lerp(lk,clamp(t/5,0,1)*.32);
 else if(mode==='two'){const d=tp.clone().sub(lk);d.y=0;const n=V3(-d.z,0,d.x).normalize();tp.addScaledVector(n,(clamp(t/5,0,1)-.5)*2.4);}
 else if(mode==='wide')tp.y+=clamp(t/5,0,1)*3.5;
 else if(mode==='low')tp.y+=clamp(t/4,0,1)*.6;}
