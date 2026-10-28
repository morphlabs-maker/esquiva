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
 loadStory(a.id,a.file).then(d=>{book=Object.assign({kind:'arc',color:a.color},d);selNode=null;storyMsg='';menuState='smap';sfx('ok');checkCached();renderMenu();})
  .catch(()=>{storyMsg='No se pudo descargar «'+a.name+'». La primera vez necesita internet; después funciona sin conexión.';sfx('back');renderMenu();});}
function openWhatif(i){if(!storyAllDone()){sfx('back');return;}loadStory('whatif',WHATIF_FILE).then(d=>{const s=d.stories[i];if(!s)return;book=Object.assign({kind:'wi'},s);selNode=null;menuState='smap';sfx('ok');renderMenu();})
 .catch(()=>{storyMsg='No se pudo descargar «¿Qué pasaría si…?». Conéctate a internet una vez.';renderMenu();});}

/* ---------------- Pantallas: arcos, mapa, galería y deseo ---------------- */
function storyHTML(){checkCached();const arcs=ARCS.map((a,i)=>{const open=arcOpen(i),done=arcDone(a.id),d=STORY[a.id],pr=d?bookProgress(Object.assign({kind:'arc'},d)):null;
  return`<div class="arcc${open?'':' lock'}${done?' done':''}" data-act="openArc" data-arg="${i}" style="--ac:${a.color}"><b>${a.n}. ${a.name}</b><span>${!open?'🔒 Termina el arco anterior':done?'✔ COMPLETADO':pr?pr[0]+' / '+pr[1]+' partes':'Toca para jugar'}</span><em>${cached[a.id]?'✔ sin internet':'⬇ se descarga al abrir'}</em></div>`;}).join('');
 const wi=storyAllDone();
 return`${backBtn()}<div class="ttl">📖 MODO HISTORIA · JUNTO A GOKU</div><div class="tip">Del manga: desde la llegada de los Saiyajin hasta la aparición de Black Freezer.</div>
  <div class="arcgrid">${arcs}</div>
  <div class="mpad" style="margin-top:8px"><button class="btn${wi?'':' off'}" data-act="openWhatifList">${wi?'':'🔒 '}¿QUÉ PASARÍA SI…?</button><button class="btn" data-act="openGallery">🎬 GALERÍA</button><button class="btn" data-act="dlAll">⬇ DESCARGAR TODO</button></div>
  <div class="tip">Esferas del Dragón: ${prog.db.length} / 7 ${'★'.repeat(prog.db.length)} · Dificultad: <span class="diff tap" data-act="sDiff" style="display:inline-block;margin:0;padding:3px 6px">${DIFFS[prog.sdiff].name} ▶</span></div>${storyMsg?`<div class="tip" style="color:var(--yl)">${esc(storyMsg)}</div>`:''}`;}
function whatifListHTML(){const d=STORY.whatif;if(!d)return`${backBtn()}<div class="tip">Cargando…</div>`;
 return`${backBtn()}<div class="ttl">🌀 ¿QUÉ PASARÍA SI…?</div><div class="arcgrid">${d.stories.map((s,i)=>{const pr=bookProgress(Object.assign({kind:'wi'},s)),done=!!prog.wi['A_'+s.id];return`<div class="arcc${done?' done':''}" data-act="openWhatif" data-arg="${i}" style="--ac:${s.color||'#c0a0ff'}"><b>${s.name}</b><span>${s.desc}</span><em>${done?'✔ COMPLETADA':pr[0]+' / '+pr[1]+' partes'}</em></div>`;}).join('')}</div>
  <button class="btn" data-act="toStory">← HISTORIA</button>`;}
const NODE_ICON={cine:'🎬',fight:'⚔',db:'★'};
function smapHTML(){const B=book,ns=B.nodes.filter(n=>n.t!=='db'||nodeOpen(n));
 const pts=B.nodes.filter(n=>n.t!=='db').map(n=>n.x+','+n.y).join(' ');
 const node=n=>{const done=nodeDone(n),open=nodeOpen(n),st=n.t==='fight'?(bookStore()[n.id]||0):0;return`<div class="snode t-${n.t}${done?' done':open?' on':' lock'}${selNode===n.id?' sel':''}" style="left:${n.x}%;top:${n.y}%" data-act="sNode" data-arg="${n.id}">${n.t==='db'?(prog.db.includes(n.n)?'<s>★</s>':'★'):NODE_ICON[n.t]}${n.t==='fight'&&done?`<i>${'★'.repeat(st)}${'☆'.repeat(3-st)}</i>`:''}</div>`;};
 const n=B.nodes.find(x=>x.id===selNode);let info='<div class="tip">Toca un lugar del mapa.</div>';
 if(n){const open=nodeOpen(n),done=nodeDone(n);
  if(n.t==='cine')info=`<b>${NODE_ICON.cine} ${n.name}</b><br>${n.place||''}<div class="mpad">${open?`<button class="btn sbtn" data-act="sPlay">${done?'VER OTRA VEZ':'▶ VER ESCENA'}</button>`:'🔒 Completa el lugar anterior'}</div>`;
  else if(n.t==='db')info=`<b>★ ${prog.db.includes(n.n)?'Ya tienes la Esfera de '+n.n+' estrellas':'Algo brilla aquí…'}</b><br>${n.hint||''}${n.fight?'<br>Condición: '+goalTxt(n.fight):''}<div class="mpad">${!prog.db.includes(n.n)?`<button class="btn sbtn" data-act="sPlay">${n.fight?'⚔ PELEAR POR ELLA':'🔍 BUSCAR'}</button>`:''}</div>`;
  else{const st=bookStore()[n.id]||0,E=n.boss?(BOSSES.find(b=>b.id===n.boss)||{}).name:charName(n.e.c)+(n.e2?' + '+charName(n.e2.c):'');
   info=`<b>⚔ ${n.name}</b> <span class="stars">${'★'.repeat(st)}${'☆'.repeat(3-st)}</span><br>${n.place||''}<br>Tú: ${charName(n.p.c)}${n.ally?' + '+charName(n.ally.c):''} · Rival: ${E}
    <br><span style="color:var(--yl)">★ ${goalTxt(n)}</span>${(n.stars||[]).map(s=>`<br><span style="color:#9fe8ff">★ ${s.txt}</span>`).join('')}<br>Premio: 🪙 ${n.coins||100}${n.unlock&&!prog.unl.includes(n.unlock)?' · 🆓 '+charName(n.unlock):''}
    <div class="mpad">${open?`<button class="btn sbtn" data-act="sPlay">${done?'⚔ REPETIR':'⚔ ¡A PELEAR!'}</button>`:'🔒 Completa el lugar anterior'}${n.cine&&cineSeen(n.cine.id)?'<button class="btn sbtn" data-act="sCine">🎬 ESCENA</button>':''}</div>`;}}
 const[a,b]=bookProgress(B);
 return`<button class="btn backbtn" data-act="${B.kind==='wi'?'openWhatifList':'toStory'}">← ${B.kind==='wi'?'¿QUÉ PASARÍA SI…?':'ARCOS'}</button><div class="ttl" style="margin-bottom:4px">${B.kind==='wi'?'🌀':'📖 '+(ARCS.find(x=>x.id===B.id)||{n:''}).n+'.'} ${B.name} · ${a}/${b}</div>
  <div class="smap" style="--mc1:${(B.map||{}).c1||'#2a4a8a'};--mc2:${(B.map||{}).c2||'#3a6a2a'}">${((B.map||{}).deco||[]).map(d=>`<span class="deco" style="left:${d[1]}%;top:${d[2]}%;font-size:${d[3]||22}px">${d[0]}</span>`).join('')}
   <svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width=".8" stroke-dasharray="2 1.4"/></svg>${ns.map(node).join('')}</div>
  <div class="sinfo">${info}</div><div class="tip">Dificultad: <span class="diff tap" data-act="sDiff" style="display:inline-block;margin:0;padding:3px 6px">${DIFFS[prog.sdiff].name} ▶</span></div>`;}
const charName=id=>{const i=chIdx(id);return i>=0?CHARS[i].name:id;};
function goalTxt(n){const g=n.goal||{type:'win'};return g.type==='survive'?'Resiste '+g.t+' s':g.type==='timed'?'Gana antes de '+g.t+' s':g.type==='hp'?'Gana con más del '+Math.round(g.v*100)+' % de vida':'Gana la pelea';}
function galleryHTML(){const rows=ARCS.concat([{id:'whatif',name:'¿Qué pasaría si…?'}]).map(a=>{const d=STORY[a.id];if(!d)return`<div class="grow"><span>${a.name}</span><span class="soon">${cached[a.id]?'':'sin descargar'}</span></div>`;
  const nodes=a.id==='whatif'?d.stories.flatMap(s=>s.nodes):d.nodes,cs=nodes.filter(n=>n.cine).map(n=>n.cine);
  return`<div class="gcol oc" style="margin-top:6px"><h3>${a.name}</h3>${cs.map(c=>cineSeen(c.id)?`<div class="grow"><span>${c.title}</span><button class="btn sbtn" data-act="gPlay" data-arg="${c.id}">▶ VER</button></div>`:`<div class="grow"><span>???</span><span class="soon">🔒</span></div>`).join('')}</div>`;}).join('');
 return`${backBtn()}<div class="ttl">🎬 GALERÍA DE ESCENAS</div><div class="scrollable" style="max-height:70vh;overflow-y:auto">${rows}</div><button class="btn" data-act="toStory">← HISTORIA</button>`;}
function findCine(id){for(const k in STORY){const d=STORY[k],nodes=k==='whatif'?d.stories.flatMap(s=>s.nodes):d.nodes;for(const n of nodes)if(n.cine&&n.cine.id===id)return n.cine;}return null;}
function wishHTML(){return`<div class="panel"><div class="ttl" style="color:#7aff6a">🐉 SHENLONG: «DI TU DESEO»</div><div class="opts">${WISHES.map(w=>`<div class="opt" data-act="wish" data-arg="${w.id}"><h3>${w.name}</h3>${w.desc}</div>`).join('')}</div></div>`;}
function grantWish(id){let msg='';
 if(id==='char'){const c=CHARS.find(x=>x.unlock&&!prog.unl.includes(x.id));if(c){unlockChar(c.id,true);msg='¡'+c.name+' se une a tus luchadores!';}else id='coins';}
 if(id==='outfit'){const o=OUTFITS.filter(x=>!x.paid&&!prog.ofOwn.includes(x.id)).sort((a,b)=>b.price-a.price)[0];if(o){grantOutfit(o.id,true);msg='Outfit nuevo: '+o.name+' ('+charName(o.who)+')';}else id='coins';}
 if(id==='forms'){const cs=CHARS.filter(c=>!c.unlock||prog.unl.includes(c.id)).filter(c=>c.forms.some((_,i)=>!owns(c,i)));if(cs.length){const c=cs[Math.random()*cs.length|0];prog.own[c.id]=c.forms.map((_,i)=>i);msg='¡'+c.name+' despierta todas sus formas!';}else id='coins';}
 if(id==='coins'){prog.coins+=2500;prog.earned+=2500;msg='+2500 🪙';}
 prog.db=[];track('wish');saveProg();toast('🐉 DESEO CONCEDIDO',msg+' · Las esferas se dispersan por el universo…');toMenu('story');}

/* ---------------- Peleas del modo historia ---------------- */
const formIx=(ch,id)=>{const i=ch.forms.findIndex(f=>f.id===id);return i<0?0:i;};
function storyFighter(idx,spec,o){const ci2=chIdx(spec.c),ch=CHARS[ci2];const f=new Fighter(idx,ci2,Object.assign({startForm:formIx(ch,spec.f||(spec.forms?spec.forms[0]:'base')),base:spec.base||ch.base,maxHp:Math.round(MAXHP*(spec.hp||1))},o));
 if(spec.forms)f.storyForms=spec.forms.map(id=>formIx(ch,id));else f.storyForms=[f.startForm];if(!f.storyForms.includes(f.startForm))f.storyForms.push(f.startForm);return f;}
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
function playNode(n){if(n.t==='cine'){cinePlay(n.cine,()=>{checkBookDone(book);menuState='smap';renderMenu();});return;}
 if(n.t==='db'){if(prog.db.includes(n.n))return;if(n.fight){storyStart(Object.assign({},n.fight,{id:n.id,t:'db',n:n.n,name:n.name||'Esfera de '+n.n+' estrellas'}));return;}
  prog.db.push(n.n);saveProg();cinePlay({id:'db_'+n.n,title:'Esfera de '+n.n+' estrellas',world:n.world||0,cast:[{c:n.who||'goku',x:0,z:0}],shots:[{who:n.who||'goku',say:'¡Mira! ¡La Esfera del Dragón de '+n.n+' estrellas! Ya tengo '+prog.db.length+' de 7.',cam:'close',pose:'victory',fx:'flash'}],noSeen:1},()=>{if(prog.db.length>=7)shenlong();else{menuState='smap';renderMenu();}});return;}
 if(n.intro&&!cineSeen(n.intro.id)){cinePlay(n.intro,()=>storyStart(n));return;}storyStart(n);}
function shenlong(){cinePlay({id:'shenlong',title:'Shenlong',world:0,v:1,cast:[{c:'goku',x:-3,z:2},{c:'shenlong',x:4,z:-6}],shots:[
 {who:'goku',say:'¡Ya tenemos las siete Esferas del Dragón!',cam:'close',pose:'victory'},
 {who:'nar',say:'El cielo se oscurece y una luz verde se eleva hacia las nubes…',cam:'wide',fx:'flash'},
 {who:'shenlong',say:'«Habéis reunido las siete Esferas del Dragón. Os concederé un deseo. Decidlo ya.»',cam:'shen',fx:'shake'}],noSeen:1},()=>{menuState='wish';renderMenu();});}

/* ---------------- Cinemáticas (con motor 3D, subtítulos y opción de saltar) ---------------- */
let CINE=null;
function buildShenlong(){const g=new THREE.Group(),mat=toon(0x3aa84a),bel=toon(0xe8d88a),pts=[];for(let i=0;i<14;i++)pts.push(V3(Math.sin(i*.9)*4,i*1.6,Math.cos(i*.7)*3-i*.4));
 const cur=new THREE.CatmullRomCurve3(pts),body=new THREE.Mesh(new THREE.TubeGeometry(cur,120,1.1,10,false),mat);g.add(body);
 const end=pts[pts.length-1],head=new THREE.Group();head.position.copy(end);g.add(head);head.add(new THREE.Mesh(new THREE.BoxGeometry(2.4,1.7,3),mat));
 const jaw=new THREE.Mesh(new THREE.BoxGeometry(2,.6,2.4),bel);jaw.position.set(0,-.9,.6);head.add(jaw);
 for(const s of[1,-1]){const h=new THREE.Mesh(new THREE.ConeGeometry(.25,2.4,6),bel);h.position.set(s*.8,1.6,-.8);h.rotation.x=-.6;head.add(h);const e=new THREE.Mesh(new THREE.SphereGeometry(.28,8,6),new THREE.MeshBasicMaterial({color:0xff2a2a}));e.position.set(s*.75,.3,1.4);head.add(e);
  const wh=new THREE.Mesh(new THREE.CylinderGeometry(.05,.02,3,4),bel);wh.position.set(s*1.1,-.2,1.8);wh.rotation.z=s*1.2;head.add(wh);}
 const gl=new THREE.PointLight(0x7aff6a,2,40);gl.position.copy(end);g.add(gl);return{root:g,head,shen:1};}
function cinePlay(sc,done){clearMenuModels();for(const f of game.f)f.dispose();game.f=[];clearCombat();game.phase=null;$('#hud').style.display='none';
 const W=sc.world==='bills'?TRAIN_WORLD:WORLDS[clamp(sc.world|0,0,WORLDS.length-1)];world=W.build(sc.v|0);SUN_DIR.copy(sun.position).normalize();playTrack(sc.music||W.music);
 const cast={};for(const c of sc.cast||[]){let m,ch=null;if(c.c==='shenlong')m=buildShenlong();else{const i=chIdx(c.c);if(i<0&&c.c!=='whis')continue;ch=i<0?WHIS:CHARS[i];m=makeModel(ch);m.outfit=null;applyFormModel(m,ch,ch.forms[formIx(ch,c.f||'base')],0);const au=makeAura();au.setColor(ch.forms[formIx(ch,c.f||'base')].aura);m.root.add(au.group);m.aura=au;}
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
function renderCineBox(){const C=CINE,s=C.sc.shots[C.i];if(!s)return;const o=C.cast[s.who],name=s.who==='nar'?'':s.who==='shenlong'?'SHENLONG':o&&o.ch?o.ch.name.toUpperCase():(s.name||'');
 const box=$('#cinebox');if(!box)return;box.querySelector('b').textContent=name;box.classList.toggle('nar',s.who==='nar');}
function cineFrame(dt,t){const C=CINE,s=C.sc.shots[C.i];if(!s)return;C.t+=dt;const txt=s.say||'';C.typed=Math.min(txt.length,C.typed+dt*42);const el=$('#cinetxt');if(el)el.textContent=txt.slice(0,Math.floor(C.typed));
 if(C.typed>=txt.length&&C.t>Math.max(2.4,txt.length*.055+1.4))cineNext();
 for(const k in C.cast){const o=C.cast[k],m=o.m;if(m.shen){m.root.rotation.y=Math.sin(t*.3)*.2;m.head.rotation.x=Math.sin(t*1.3)*.08;continue;}
  if(o.to){m.root.position.x=lerp(m.root.position.x,o.to.x,1-Math.exp(-3*dt));m.root.position.z=lerp(m.root.position.z,o.to.z,1-Math.exp(-3*dt));}
  if(o.tT!=null){o.tT-=dt;if(o.tT<=0){o.tT=null;const fi=formIx(o.ch,o.pendingF);applyFormModel(m,o.ch,o.ch.forms[fi],0);m.aura.setColor(o.ch.forms[fi].aura);o.aura=.6;o.pose='victory';flashScreen(.4);ring(m.root.position.clone().add(V3(0,.3,0)),o.ch.forms[fi].aura,8,.6,true);sfx('flash');}}
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
 <div id="cinebox" data-act="cineNext"><b></b><span id="cinetxt"></span><em>▶</em></div>`;}
