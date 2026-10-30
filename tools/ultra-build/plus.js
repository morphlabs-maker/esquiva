/* =========================================================
   KAIOKEN CLASH 2.0 — SISTEMAS
   Progreso (estadísticas, desafíos, logros y títulos), tienda (técnicas icónicas y outfits con probador),
   luchadores desbloqueables, fusiones, jefes nuevos, Supervivencia, diálogos de entrada, 2 jugadores en un celular,
   repetición y modo foto. Los datos están en plus-data.js; el modo historia en plus-story.js.
   ========================================================= */
BOSSES.push(...NEW_BOSSES);
const chIdx=id=>CHARS.findIndex(c=>c.id===id);
const human=f=>f&&f.role==='p'&&!f.cpu&&!f.remote;
/* normaliza las claves de los diálogos (pareja ordenada) */
{const D={};for(const k in INTRO_DIALOGS)D[k.split('|').sort().join('|')]=INTRO_DIALOGS[k];for(const k in INTRO_DIALOGS)delete INTRO_DIALOGS[k];Object.assign(INTRO_DIALOGS,D);}

/* ---------------- Avisos (logros, desbloqueos) ---------------- */
function toast(t,sub=''){const box=$('#toasts');if(!box)return;const el=document.createElement('div');el.className='toast';el.innerHTML=`<b>${esc(t)}</b>${sub?'<br>'+esc(sub):''}`;box.appendChild(el);sfx('ok');setTimeout(()=>el.classList.add('out'),3200);setTimeout(()=>el.remove(),3800);}

/* ---------------- Estadísticas, desafíos y logros ---------------- */
let plusSaveT=0;function plusSave(){clearTimeout(plusSaveT);plusSaveT=setTimeout(saveProg,300);}
const stat=k=>prog.stats[k]||0;
function track(ev,n=1,max=false){const s=prog.stats;if(max){if(n<=(s[ev]||0)&&!activeChals().some(c=>c.ev===ev))return;s[ev]=Math.max(s[ev]||0,n);}else s[ev]=(s[ev]||0)+n;
 chalTrack(ev,n,max);checkAchs();plusSave();}
function weekKey(){const d=new Date(),t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())),day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);const y=t.getUTCFullYear();return y+'W'+Math.ceil(((t-Date.UTC(y,0,1))/864e5+1)/7);}
function pickSeeded(pool,n,seed){const a=pool.slice(),out=[];let s=seed>>>0;while(out.length<n&&a.length){s=(Math.imul(s,1103515245)+12345)>>>0;out.push(a.splice(s%a.length,1)[0]);}return out;}
function activeChals(){const C=prog.chal,d=today(),w=weekKey();
 if(C.d!==d){C.d=d;for(const k in C.p)if(k[0]==='d')delete C.p[k];C.cl=C.cl.filter(k=>k[0]!=='d');}
 if(C.w!==w){C.w=w;for(const k in C.p)if(k[0]==='w')delete C.p[k];C.cl=C.cl.filter(k=>k[0]!=='w');}
 return[...pickSeeded(CHAL_POOL,3,parseInt(hash32('d'+d),36)).map(c=>Object.assign({key:'d:'+c.id,daily:1},c)),...pickSeeded(CHAL_WEEK,3,parseInt(hash32('w'+w),36)).map(c=>Object.assign({key:'w:'+c.id},c))];}
function chalTrack(ev,n,max){for(const c of activeChals()){if(c.ev!==ev||prog.chal.cl.includes(c.key))continue;const cur=prog.chal.p[c.key]||0,nv=Math.min(c.n,c.max||max?Math.max(cur,n):cur+n);
  if(nv>=c.n&&cur<c.n)toast('✅ DESAFÍO COMPLETADO',c.txt+' · reclama '+c.c+' 🪙');prog.chal.p[c.key]=nv;}}
const chalDone=c=>(prog.chal.p[c.key]||0)>=c.n;
const chalReady=()=>activeChals().filter(c=>chalDone(c)&&!prog.chal.cl.includes(c.key)).length;
function claimChal(key){const c=activeChals().find(x=>x.key===key);if(!c||!chalDone(c)||prog.chal.cl.includes(key))return false;prog.chal.cl.push(key);prog.coins+=c.c;prog.earned+=c.c;track('chal');saveProg();return true;}
const arcDone=id=>!!prog.story.c['A_'+id];
const whatifDone=()=>Object.keys(prog.wi).filter(k=>k.startsWith('A_')).length>=WHATIF_N;
const storyAllDone=()=>ARCS.every(a=>a.side||arcDone(a.id));
function storyStars(){let n=0;for(const k in prog.story.c)if(!k.startsWith('A_'))n+=prog.story.c[k];return n;}
function achValue(a){return a.st==='sigs'?prog.sig.length:a.st==='outfits'?prog.ofOwn.length:a.st==='unl'?prog.unl.length:a.st==='earned'?prog.earned:a.st==='stars'?storyStars():stat(a.st);}
function achMet(a){if(a.arc)return a.arc==='*'?storyAllDone():arcDone(a.arc);if(a.wi)return whatifDone();return achValue(a)>=a.n;}
function checkAchs(){for(const a of ACHS){if(prog.ach.includes(a.id)||!achMet(a))continue;prog.ach.push(a.id);if(!prog.title)prog.title=a.id;toast('🏆 LOGRO: '+a.name,'Nuevo título: «'+a.title+'»');}}
const titleName=()=>{const a=ACHS.find(x=>x.id===prog.title);return a?a.title:'';};
/* victoria contra la máquina, un jefe u online */
function trackWin(){const D=game.diff;track('win');if(D>=2)track('hard');if(D===3)track('legend');if(bossMode())track('boss');
 const me=game.f.find(human);if(me&&me.minHp!=null&&me.minHp>=.75)track('perfect');}

/* ---------------- Luchadores desbloqueables (modo historia) ---------------- */
const lockedC=i=>{const c=CHARS[i];return!!(c&&c.unlock&&!prog.unl.includes(c.id));};
function unlockChar(id,quiet){if(prog.unl.includes(id))return false;prog.unl.push(id);if(!quiet){const c=CHARS[chIdx(id)];toast('🆓 NUEVO LUCHADOR',c.name+' ya está disponible');}checkAchs();saveProg();return true;}
const LOCK_MSG='Se desbloquea en el modo historia';

/* ---------------- Técnicas icónicas y outfits ---------------- */
const outfitOf=id=>OUTFITS.find(o=>o.id===id);
let tryOutfit=null,outfitConfirm='';
function grantOutfit(id,quiet){const o=outfitOf(id);if(!o||prog.ofOwn.includes(id))return;prog.ofOwn.push(id);prog.ofEq[o.who]=id;if(!quiet)toast('👕 OUTFIT NUEVO',o.name);checkAchs();saveProg();}
function buyOutfit(o){if(o.paid||prog.ofOwn.includes(o.id)||prog.coins<o.price)return false;prog.coins-=o.price;grantOutfit(o.id,true);return true;}
function outfitRows(ch){const list=OUTFITS.filter(o=>o.who===ch.id),eq=prog.ofEq[ch.id]||'';
 const row=(o)=>{const own=!o||prog.ofOwn.includes(o.id),on=o?eq===o.id:!eq,tr=tryOutfit===(o?o.id:'');
  let act;if(on)act='<span class="ok">EQUIPADO</span>';else if(own)act=`<button class="btn sbtn" data-act="eqOutfit" data-arg="${o?o.id:''}">EQUIPAR</button>`;
  else if(o.paid)act=PAYPAL.clientId?`<button class="btn sbtn" data-act="payOutfit" data-arg="${o.id}">💳 PAYPAL $${o.paid.toFixed(2)}</button>`:'<span class="soon">PRÓXIMAMENTE</span>';
  else act=outfitConfirm===o.id?`<button class="btn sbtn" data-act="buyOutfit" data-arg="${o.id}">¿CONFIRMAR? 🪙 ${o.price}</button>`:`<button class="btn sbtn${prog.coins>=o.price?'':' off'}" data-act="buyOutfit" data-arg="${o.id}">🪙 ${o.price}</button>`;
  return`<div class="grow"><span>${own?'':'🔒 '}${o?o.name:'Ropa original'}<em>${o?(o.paid?'★ EXCLUSIVO':o.saga):'De serie'}</em></span><span class="cy" style="gap:4px"><button class="btn sbtn${tr?'':' off'}" data-act="tryOutfit" data-arg="${o?o.id:''}">👁 PROBAR</button>${act}</span></div>`;};
 return row(null)+(list.length?list.map(row).join(''):'<div class="tip" style="margin-top:8px">Este luchador todavía no tiene outfits.</div>');}
/* Probador: render propio pequeño (pixelado), con el luchador girando */
const probR=new THREE.WebGLRenderer({antialias:false,alpha:true});probR.setPixelRatio(1);probR.setSize(120,170);probR.domElement.className='prob';
const probScene=new THREE.Scene();probScene.add(new THREE.HemisphereLight(0xffffff,0x555566,1.1));{const s=new THREE.DirectionalLight(0xffffff,.8);s.position.set(1,2,3);probScene.add(s);}
const probCam=new THREE.PerspectiveCamera(32,120/170,.05,50);let probM=null,probKey='';
function probFrame(dt,t){const slot=document.getElementById('probSlot');if(!slot){return;}if(probR.domElement.parentNode!==slot)slot.appendChild(probR.domElement);
 const ch=CHARS[shopChar],k=ch.id+'|'+(tryOutfit??'');if(probKey!==k){if(probM){probScene.remove(probM.root);disposeModel(probM);}probM=makeModel(ch);probM.outfit=tryOutfit===null?(prog.ofEq[ch.id]||null):tryOutfit||null;applyFormModel(probM,ch,ch.forms[0],0);probScene.add(probM.root);probKey=k;}
 probM.root.rotation.y=t*.9;probM.target='idle';animateModel(probM,dt,false);const s=probM.body.scale.y;probCam.position.set(0,.85*s,3.3*s);probCam.lookAt(0,.72*s,0);probR.render(probScene,probCam);}
function paypalBuy(o){if(!PAYPAL.clientId){toast('Próximamente','Los cosméticos de pago aún no están activos');return;}if(!navigator.onLine){toast('Sin conexión','Para pagar hace falta internet');return;}
 const box=$('#ppbox');const show=()=>{box.style.display='flex';box.innerHTML=`<div class="panel" style="min-width:min(92vw,360px)"><div class="ttl">${esc(o.name)}</div><div class="tip">Cosmético exclusivo · $${o.paid.toFixed(2)}</div><div id="ppb" style="background:#fff;padding:8px;margin:8px 0"></div><button class="btn" data-act="ppClose">CANCELAR</button></div>`;
  try{window.paypal.Buttons({createOrder:(d,a)=>a.order.create({purchase_units:[{description:'Kaioken Clash · '+o.name,amount:{currency_code:PAYPAL.currency,value:o.paid.toFixed(2)}}]}),
   onApprove:(d,a)=>a.order.capture().then(()=>{box.style.display='none';grantOutfit(o.id);renderMenu();}),onError:()=>{toast('Pago no completado','No se ha cobrado nada');}}).render('#ppb');}catch(e){reportError(e);}};
 if(window.paypal)show();else{const s=document.createElement('script');s.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(PAYPAL.clientId)+'&currency='+PAYPAL.currency;s.onload=show;s.onerror=()=>toast('No se pudo conectar con PayPal','Revisa tu conexión');document.head.appendChild(s);}}

/* ---------------- Fusiones (solo parejas válidas, en peleas por equipos o contra jefes) ---------------- */
function fusionFor(f,p){const ids=[f.ch.id,p.ch.id];const m=FUSIONS.filter(x=>(x.a===ids[0]&&x.b===ids[1])||(x.a===ids[1]&&x.b===ids[0]));if(!m.length)return null;return m.find(x=>x.by===f.ch.id)||m[0];}
function fusionPartner(f){if(!game.phase||game.phase!=='fight'||f.state==='ko'||f.fused||game.story&&game.story.noFusion)return null;
 return game.f.find(p=>p!==f&&p.team===f.team&&p.role==='p'&&p.state!=='ko'&&!p.fused&&p.pos.distanceTo(f.pos)<12&&fusionFor(f,p))||null;}
function tryFuse(f){const p=fusionPartner(f);if(!p){const anyAlly=game.f.some(x=>x!==f&&x.team===f.team&&x.role==='p');pop(f,anyAlly?'Sin pareja de fusión válida':'Necesitas un aliado','#aaa');return;}
 const F=fusionFor(f,p),ci2=chIdx(F.r);if(ci2<0)return;const i=game.f.indexOf(f),hpK=clamp((f.hp/f.maxHp+p.hp/p.maxHp)/2*1.25,.3,1);
 const z=new Fighter(f.idx,ci2,{team:f.team,maxHp:Math.max(f.maxHp,p.maxHp),startForm:0});z.cpu=f.cpu;z.fused=true;z.opp=f.opp;
 const mid=f.pos.clone().add(p.pos).multiplyScalar(.5);z.reset(f.idx===0?-1:1,mid);z.hp=z.maxHp*hpK;z.ki=KIMAX;z.face=f.face;
 for(const x of game.f){if(x.opp===f||x.opp===p)x.opp=z;}
 game.f[i]=z;game.f.splice(game.f.indexOf(p),1);f.dispose();p.dispose();
 buildHud();game.f.forEach(x=>hudPortrait(x));flashScreen(.6);ring(z.chest(),0xffe08a,12,.7,true);sparks(z.chest(),0xffe08a,30,20,.6);sfx('flash');game.shake=2;
 showMsg('¡FUSIÓN!',F.how+' → '+z.ch.name,1.4);pop(z,z.ch.name.toUpperCase(),'#ffd23a',true);if(human(z))track('fusion');}
function fusionTick(){const can=[false,false];for(const f of game.f){if(!human(f)||f.state==='ko')continue;const key=f.idx===0?'KeyZ':'KeyN';
  if(justPressed.has(key)||justPressed.has('P'+f.idx+'B8'))tryFuse(f);if(f.idx<2&&fusionPartner(f))can[f.idx]=true;}
 document.body.classList.toggle('canfuse0',can[0]);document.body.classList.toggle('canfuse1',can[1]);}

/* ---------------- Supervivencia: oleadas que dan monedas ---------------- */
function survStart(){const a=new Fighter(0,game.sel[0],{startForm:game.startForm[0]});game.surv={w:1,coins:0,next:-1};a.minHp=1;
 const b=survEnemy(a,1);game.f=[a,b];game.wins=[0,0];game.round=1;buildHud();$('#hud').style.display='block';$('#pp1').style.display='flex';$('#bossbar').style.display='none';$('#train').style.display='none';
 $('#menu').innerHTML='';menuState=null;playTrack(curWorldDef().music);startRound();}
function survEnemy(a,w){const pool=CHARS.map((c,i)=>i).filter(i=>i!==game.sel[0]),i=pool[Math.random()*pool.length|0],ch=CHARS[i],k=.5+.09*w,pw=a.realPower();
 const b=new Fighter(1,i,{startForm:0,maxHp:Math.round(MAXHP*Math.min(1.4,.42+.05*w)),base:Math.max(1,pw*k/ch.forms[0].mult)});b.cpu=true;b.cap=k;b.opp=a;a.opp=b;return b;}
function survKO(def,att){def.hp=0;def.killSpecial();def.setState('ko',99);def.vel.copy(def.pos.clone().sub(att.pos).normalize().multiplyScalar(18)).add(V3(0,6,0));
 const S=game.surv,c=10+S.w*6;S.coins+=c;pop(def,'+'+c+' 🪙','#ffd23a',true);sfx('boom',.8);if(human(att))track('ko');track('surv',S.w,true);S.next=1.8;}
function survTick(dt){const S=game.surv;if(!S||S.next<0)return;S.next-=dt;if(S.next>0)return;S.next=-1;const a=game.f[0];if(a.state==='ko')return;
 S.w++;const old=game.f[1];old.dispose();const b=survEnemy(a,S.w);b.reset(1,a.pos.clone().add(V3(14,2,0)).setY(Math.max(a.pos.y,world.spawnY+2)));game.f[1]=b;
 a.hp=Math.min(a.maxHp,a.hp+a.maxHp*.25);a.addKi(2);hudPortrait(b);buildHud();game.f.forEach(x=>hudPortrait(x));showMsg('OLEADA '+S.w,b.ch.name+' · '+fmtP(b.power())+' · 🪙 '+S.coins,1.2);}
function survOver(){const S=game.surv,a=game.f[0],got=S.coins;game.phase='over';prog.coins+=got;prog.earned+=got;prog.stats.bestSurv=Math.max(stat('bestSurv'),S.w-1);saveProg();checkAchs();
 const b=game.f[1];if(b&&b.state!=='ko')b.setState('victory');game.cine={type:'victory',f:b&&b.state!=='ko'?b:a,t:999,dur:999};
 showMsg('FIN DE LA SUPERVIVENCIA',`Oleadas superadas: <b>${S.w-1}</b> · mejor marca: ${stat('bestSurv')}<br><span style="color:var(--yl)">+${got} 🪙</span>`+overKeys(),0);}

/* ---------------- Diálogos de entrada entre rivales ---------------- */
function dlgStart(lines){if(!lines||!lines.length)return;game.introDlg={lines,i:-1,t:0};dlgNext();}
function dlgNext(){const D=game.introDlg;if(!D)return;D.i++;D.t=0;const box=$('#dlg');
 if(D.i>=D.lines.length){game.introDlg=null;box.style.display='none';if(game.cine&&game.cine.dlg)game.cine=null;return;}
 const[who,txt]=D.lines[D.i],f=game.f.find(x=>x.ch.id===who),name=f?f.ch.name:(CHARS[chIdx(who)]||{name:who}).name;
 box.style.display='block';box.className=f&&f.team===1?'r':'';box.innerHTML=`<b>${esc(name.toUpperCase())}</b><span>${esc(txt)}</span><em data-act="dlgNext">▶</em><i data-act="dlgSkip">SALTAR ▶▶</i>`;
 if(f){game.cine={type:'victory',f,t:3,dur:3,dlg:1};f.setState('idle');}}
function dlgTick(dt){const D=game.introDlg;if(!D)return false;D.t+=dt;if(D.t>3.2)dlgNext();return!!game.introDlg;}
function dlgSkip(){if(!game.introDlg)return;game.introDlg.i=game.introDlg.lines.length-1;dlgNext();}
function introDialog(){if(game.story||teamMode()||bossMode()||game.mode==='train'||game.mode==='surv'||game.online||game.round>1)return;const[a,b]=game.f;if(!a||!b)return;
 const L=INTRO_DIALOGS[[a.ch.id,b.ch.id].sort().join('|')];if(L)dlgStart(L);}

/* ---------------- 2 jugadores en el mismo celular: pantalla dividida, cámaras de lado ---------------- */
const duoPhone=()=>game.mode==='duo';
function duoCams(a,b,k){for(const[f,cm]of[[a,camA],[b,camB]]){const to=f.opp.pos.clone().sub(f.pos);to.y=0;const sep=to.length();if(sep<.01)to.set(1,0,0);to.normalize();
  const fw=V3(to.z,0,-to.x),c=f.pos.clone().addScaledVector(to,Math.min(sep,30)*.38),dist=7+Math.min(sep,40)*.55,tp=c.clone().addScaledVector(fw,-dist).add(V3(0,2.4+Math.min(sep,40)*.06,0));
  const gy=world?world.groundY(tp.x,tp.z):0;if(gy>-1e9&&tp.y<gy+1.2)tp.y=gy+1.2;cm.fov=68;cm.updateProjectionMatrix();cm.position.lerp(tp,k);cm.lookAt(c.add(V3(0,.9,0)));
  if(game.shake>.01){const s=game.shake*.3;cm.position.add(V3(rand(-s,s),rand(-s,s),rand(-s,s)));}}}
/* sin zoom ni gestos de iOS en plena pelea */
document.addEventListener('touchmove',e=>{if(game.phase&&TOUCHM&&!e.target.closest('#menu,#pause,.scrollable'))e.preventDefault();},{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('dblclick',e=>{if(TOUCHM)e.preventDefault();});

/* ---------------- Repetición (los últimos 30 s) ---------------- */
const POSE_IDS=Object.keys(POSES);const REC={buf:[],acc:0};
function recFrame(dt){if(!game.phase||game.paused||game.replay||game.photo)return;REC.acc+=dt;if(REC.acc<1/30)return;REC.acc=0;
 const s={c:[cam.position.x,cam.position.y,cam.position.z,camLook.x,camLook.y,camLook.z],f:game.f.map(f=>{const m=f.model;return[f.pos.x,f.pos.y,f.pos.z,f.face,m.root.rotation.x,POSE_IDS.indexOf(m.target),f.formIdx,m.root.scale.x,f.aura.target,m.root.position.y-f.pos.y];}),p:[],b:[]};
 for(const p of projs)s.p.push([p.pos.x,p.pos.y,p.pos.z,p.r||.3,p.color||0xffffff]);
 for(const f of game.f)if(f.sp&&f.sp.ball){const o=f.sp.ball.position;s.p.push([o.x,o.y,o.z,f.sp.ball.scale.x||1,f.sp.s.color]);}
 for(const b of beams)if(b.alive)s.b.push([b.origin.x,b.origin.y,b.origin.z,b.dir.x,b.dir.y,b.dir.z,b.head,b.w,b.color]);
 REC.buf.push(s);if(REC.buf.length>900)REC.buf.shift();}
const repPool={s:[],b:[]};
function repMesh(kind,i){const P=repPool[kind];if(!P[i]){const m=kind==='s'?new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),new THREE.MeshBasicMaterial({color:0xffffff})):new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,10,1,true),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85,side:THREE.DoubleSide}));fxGroup.add(m);P[i]=m;}return P[i];}
function replayStart(){if(REC.buf.length<10||!game.f.length)return;clearCombat();game.replay={i:0,spd:1,pause:false,acc:0};game.split=false;$('#msg').classList.remove('show');$('#sub').style.visibility='hidden';$('#hud').style.display='none';
 $('#repbar').style.display='flex';renderRepBar();}
function renderRepBar(){const R=game.replay;if(!R)return;$('#repbar').innerHTML=`<span class="rec">REPETICIÓN</span><button class="btn sbtn" data-act="repCtl" data-arg="pause">${R.pause?'SEGUIR':'PAUSA'}</button><button class="btn sbtn" data-act="repCtl" data-arg="spd">VELOCIDAD ×${R.spd}</button><button class="btn sbtn" data-act="repCtl" data-arg="re">DESDE EL INICIO</button><button class="btn sbtn" data-act="repCtl" data-arg="exit">SALIR</button>`;}
function replayFrame(dt,t){const R=game.replay,B=REC.buf;if(!R.pause){R.acc+=dt*30*R.spd;while(R.acc>=1){R.acc--;R.i++;}}if(R.i>=B.length-1){R.i=B.length-1;R.pause=true;renderRepBar();}
 const s=B[R.i];cam.position.set(s.c[0],s.c[1],s.c[2]);camLook.set(s.c[3],s.c[4],s.c[5]);cam.lookAt(camLook);
 s.f.forEach((r,i)=>{const f=game.f[i];if(!f)return;const m=f.model;if(r[6]!==f.formIdx&&r[6]>=0&&r[6]<f.ch.forms.length){f.formIdx=r[6];applyFormModel(m,f.ch,f.form,0);f.aura.setColor(f.form.aura);}
  m.root.position.set(r[0],r[1]+r[9],r[2]);m.root.rotation.y=r[3];m.root.rotation.x=r[4];m.root.scale.setScalar(r[7]);m.target=POSE_IDS[r[5]]||'idle';animateModel(m,R.pause?0:dt*R.spd,false);
  f.aura.target=r[8];f.aura.update(dt,t,false);const g=world?world.groundY(r[0],r[2]):0;f.shadow.position.set(r[0],g+.05,r[2]);});
 repPool.s.forEach(m=>m.visible=false);repPool.b.forEach(m=>m.visible=false);
 s.p.forEach((p,i)=>{const m=repMesh('s',i);m.visible=true;m.position.set(p[0],p[1],p[2]);m.scale.setScalar(Math.max(.2,p[3]*.7));m.material.color.setHex(p[4]);});
 s.b.forEach((b,i)=>{const m=repMesh('b',i),o=V3(b[0],b[1],b[2]),d=V3(b[3],b[4],b[5]).normalize(),L=Math.max(.1,b[6]);m.visible=true;m.material.color.setHex(b[8]);
  m.position.copy(o).addScaledVector(d,L/2);m.quaternion.setFromUnitVectors(V3(0,1,0),d);m.scale.set(b[7]*.5,L,b[7]*.5);});}
function replayExit(){const R=game.replay;if(!R)return;R.i=REC.buf.length-1;replayFrame(0,0);game.replay=null;repPool.s.forEach(m=>m.visible=false);repPool.b.forEach(m=>m.visible=false);
 $('#repbar').style.display='none';$('#sub').style.visibility='';$('#hud').style.display='block';$('#msg').classList.add('show');}

/* ---------------- Modo foto: cámara libre, filtros y guardar imagen ---------------- */
const PH_FILTERS=['NORMAL','MANGA','SEPIA','RETRO VERDE'];
function photoStart(){const f=game.f[0];if(!f)return;const d=cam.position.clone().sub(camLook);game.photo={tgt:camLook.clone(),yaw:Math.atan2(d.x,d.z),pitch:Math.asin(clamp(d.y/Math.max(d.length(),.01),-1,1)),dist:Math.max(3,d.length()),flt:0,shot:false,ui:true};
 $('#pause').style.display='none';$('#hud').style.display='none';$('#dlg').style.visibility='hidden';$('#pops').style.display='none';game.split=false;$('#photobar').style.display='flex';renderPhotoBar();}
function renderPhotoBar(){const P=game.photo;$('#photobar').innerHTML=`<span class="rec">📷 MODO FOTO</span><button class="btn sbtn" data-act="phCtl" data-arg="flt">FILTRO: ${PH_FILTERS[P.flt]}</button><button class="btn sbtn" data-act="phCtl" data-arg="tgt">ENFOCAR: ${game.f[P.ti||0]?game.f[P.ti||0].ch.name.toUpperCase():'-'}</button><button class="btn sbtn" data-act="phCtl" data-arg="shot">📸 GUARDAR</button><button class="btn sbtn" data-act="phCtl" data-arg="exit">SALIR</button><span class="tip">Arrastra para girar · pellizca o usa la rueda para acercar</span>`;
 canvas.style.filter=['','grayscale(1) contrast(1.6)','sepia(.85)','sepia(1) hue-rotate(50deg) saturate(1.8)'][P.flt];}
function photoCam(){const P=game.photo;game.split=false;P.pitch=clamp(P.pitch,-.2,1.35);P.dist=clamp(P.dist,1.5,80);const c=Math.cos(P.pitch);cam.position.set(P.tgt.x+Math.sin(P.yaw)*c*P.dist,P.tgt.y+Math.sin(P.pitch)*P.dist,P.tgt.z+Math.cos(P.yaw)*c*P.dist);cam.lookAt(P.tgt);}
function photoExit(){game.photo=null;canvas.style.filter='';$('#dlg').style.visibility='';$('#pops').style.display='';$('#photobar').style.display='none';$('#hud').style.display='block';togglePause(true);}
function photoCapture(){const P=game.photo,src=renderer.domElement,w=src.width,h=src.height,k=Math.max(1,PIX),c=document.createElement('canvas');c.width=w*k;c.height=h*k;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(src,0,0,w*k,h*k);
 if(P.flt){const im=g.getImageData(0,0,c.width,c.height),d=im.data;for(let i=0;i<d.length;i+=4){const l=.3*d[i]+.59*d[i+1]+.11*d[i+2];
   if(P.flt===1){const v=l>150?255:l>80?150:20;d[i]=d[i+1]=d[i+2]=v;}else if(P.flt===2){d[i]=Math.min(255,l*1.07+30);d[i+1]=Math.min(255,l*.95+12);d[i+2]=l*.75;}else{d[i]=l*.55;d[i+1]=Math.min(255,l*1.1);d[i+2]=l*.45;}}g.putImageData(im,0,0);}
 g.font=Math.round(10*k)+"px 'Press Start 2P',monospace";g.fillStyle='rgba(255,210,58,.9)';g.fillText('KAIOKEN CLASH',10*k,c.height-10*k);
 c.toBlob(b=>{if(!b)return;const file=new File([b],'kaioken-clash-foto.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],title:'Kaioken Clash'}).catch(()=>{});
  else{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='kaioken-clash-foto.png';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);}
  track('photo');toast('📸 FOTO GUARDADA');},'image/png');}
{let drag=null,pinch=0;const cv=canvas;
 cv.addEventListener('pointerdown',e=>{if(!game.photo)return;drag={x:e.clientX,y:e.clientY,id:e.pointerId};});
 cv.addEventListener('pointermove',e=>{const P=game.photo;if(!P||!drag||e.pointerId!==drag.id)return;P.yaw-=(e.clientX-drag.x)*.008;P.pitch+=(e.clientY-drag.y)*.006;drag.x=e.clientX;drag.y=e.clientY;});
 for(const t of['pointerup','pointercancel'])cv.addEventListener(t,()=>{drag=null;});
 cv.addEventListener('wheel',e=>{if(game.photo){game.photo.dist*=Math.exp(e.deltaY*.001);e.preventDefault();}},{passive:false});
 cv.addEventListener('touchmove',e=>{if(!game.photo||e.touches.length<2)return;const[a,b]=e.touches,d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);if(pinch)game.photo.dist*=pinch/d;pinch=d;drag=null;},{passive:true});
 cv.addEventListener('touchend',()=>{pinch=0;},{passive:true});}

/* ---------------- Cada paso de simulación / cada fotograma ---------------- */
function plusStep(dt){if(game.phase==='fight'){fusionTick();if(game.mode==='surv')survTick(dt);if(game.story)storyTick(dt);
  for(const f of game.f)if(human(f)){f.minHp=Math.min(f.minHp??1,f.hp/f.maxHp);if(f.comboHits>stat('combo'))track('combo',f.comboHits,true);}}
 else document.body.classList.remove('canfuse0','canfuse1');}
function plusFrame(dt,t){recFrame(dt);if(menuState==='shop'&&shopTab==='outfit')probFrame(dt,t);}

/* ---------------- Pantallas nuevas: perfil, desafíos y transferencia ---------------- */
let profView='main',xferMsg='';
function profileHTML(){const pct=Math.round(ARCS.filter(a=>arcDone(a.id)).length/ARCS.length*100),S=prog.stats;
 if(profView==='titles')return`${backBtn()}<div class="ttl">🎖 TÍTULOS</div><div class="gcol oc scrollable" style="max-height:62vh;overflow-y:auto">${prog.ach.length?ACHS.filter(a=>prog.ach.includes(a.id)).map(a=>`<div class="grow"><span>${a.title}<em>${a.name}</em></span>${prog.title===a.id?'<span class="ok">EN USO</span>':`<button class="btn sbtn" data-act="setTitle" data-arg="${a.id}">USAR</button>`}</div>`).join(''):'<div class="tip">Consigue logros para ganar títulos.</div>'}</div><button class="btn" data-act="profView" data-arg="main">← PERFIL</button>`;
 if(profView==='ach')return`${backBtn()}<div class="ttl">🏆 LOGROS · ${prog.ach.length}/${ACHS.length}</div><div class="achgrid scrollable">${ACHS.map(a=>{const ok=prog.ach.includes(a.id),v=a.st?Math.min(achValue(a),a.n):0;return`<div class="ach${ok?' on':''}"><b>${ok?'🏆':'🔒'} ${a.name}</b><span>${a.desc}</span><em>${ok?'Título: '+a.title:a.st?v+' / '+a.n:''}</em></div>`;}).join('')}</div><button class="btn" data-act="profView" data-arg="main">← PERFIL</button>`;
 if(profView==='xfer')return`${backBtn()}<div class="panel" style="max-width:min(96vw,640px)"><div class="ttl">🔁 PASAR MI PARTIDA A OTRO DISPOSITIVO</div>
  <div class="tips">1. Toca <b>COPIAR MI CÓDIGO</b> y envíatelo (AirDrop, Notas, WhatsApp…).<br>2. En el otro iPhone abre Kaioken Clash → PERFIL → PASAR PARTIDA, pega el código y toca <b>IMPORTAR</b>.<br>Se fusiona con lo que ya tengas allí: nunca se pierde nada.</div>
  <div class="mpad"><button class="btn" data-act="xfer" data-arg="copy">📋 COPIAR MI CÓDIGO</button>${navigator.share?'<button class="btn" data-act="xfer" data-arg="share">📤 COMPARTIR</button>':''}</div>
  <textarea id="xcode" class="inp" style="width:100%;height:70px;font-size:7px" placeholder="Pega aquí el código KC2-…"></textarea>
  <div class="mpad"><button class="btn" data-act="xfer" data-arg="import">📥 IMPORTAR</button><button class="btn" data-act="profView" data-arg="main">← PERFIL</button></div>${xferMsg?`<div class="tip" style="color:var(--yl)">${esc(xferMsg)}</div>`:''}</div>`;
 return`${backBtn()}<div class="panel" style="max-width:min(96vw,720px)"><div class="ttl">👤 PERFIL</div>
  <div class="gcol oc"><div class="grow"><span>Apodo</span><input id="nick" class="inp" maxlength="14" value="${esc(prog.nick)}" placeholder="Tu nombre" autocomplete="off"></div>
  <div class="grow"><span>Título</span><span class="cy" style="gap:6px"><b style="min-width:0">${titleName()?'«'+esc(titleName())+'»':'—'}</b><button class="btn sbtn" data-act="profView" data-arg="titles">CAMBIAR</button></span></div>
  <div class="grow"><span>Victorias · K.O.</span><span>${prog.wins} · ${stat('ko')}</span></div><div class="grow"><span>🪙 Monedas (ganadas en total)</span><span>${prog.coins} (${prog.earned})</span></div>
  <div class="grow"><span>Modo historia</span><span>${pct} % · ⭐ ${storyStars()}</span></div><div class="grow"><span>Esferas del Dragón</span><span class="dbrow">${[1,2,3,4,5,6,7].map(n=>`<i class="${prog.db.includes(n)?'on':''}">${n}</i>`).join('')}</span></div>
  <div class="grow"><span>Mejor combo · Mejor oleada</span><span>${stat('combo')} · ${stat('bestSurv')}</span></div><div class="grow"><span>Luchadores desbloqueados</span><span>${prog.unl.length} / ${CHARS.filter(c=>c.unlock).length}</span></div>
  <div class="grow"><span>Logros</span><span>${prog.ach.length} / ${ACHS.length}</span></div></div>
  <div class="mpad"><button class="btn" data-act="profView" data-arg="ach">🏆 LOGROS</button><button class="btn" data-act="profView" data-arg="xfer">🔁 PASAR PARTIDA</button></div><div class="tip">${saveWhere()} · guardado v${SAVE_V}</div></div>`;}
function chalHTML(){const L=activeChals(),row=c=>{const v=Math.min(prog.chal.p[c.key]||0,c.n),done=v>=c.n,cl=prog.chal.cl.includes(c.key);
  return`<div class="grow"><span>${c.txt}<em>${v} / ${c.n} · 🪙 ${c.c}</em></span>${cl?'<span class="ok">RECLAMADO</span>':done?`<button class="btn sbtn" data-act="claimChal" data-arg="${c.key}">RECLAMAR 🪙 ${c.c}</button>`:'<span class="soon">EN CURSO</span>'}</div>`;};
 return`${backBtn()}<div class="ttl">🎯 DESAFÍOS · ${coinTag()}</div><div class="gcol oc"><h3>HOY</h3>${L.filter(c=>c.daily).map(row).join('')}</div><div class="gcol oc" style="margin-top:8px"><h3>ESTA SEMANA</h3>${L.filter(c=>!c.daily).map(row).join('')}</div>
  <div class="tip" style="margin-top:6px">Los desafíos diarios cambian cada día y los semanales cada lunes.</div>`;}
function xferAct(a){if(a==='copy'||a==='share'){const c=exportCode();if(a==='share'&&navigator.share){navigator.share({title:'Mi partida de Kaioken Clash',text:c}).catch(()=>{});return;}
  (navigator.clipboard?navigator.clipboard.writeText(c):Promise.reject()).then(()=>{xferMsg='Código copiado ('+c.length+' caracteres).';renderMenu();},()=>{const t=$('#xcode');if(t){t.value=c;t.select();}xferMsg='Selecciona el texto y cópialo.';renderMenu();const t2=$('#xcode');if(t2){t2.value=c;t2.select();}});return;}
 if(a==='import'){const t=$('#xcode'),p=parseCode(t?t.value:'');if(!p){xferMsg='Código no válido. Revisa que esté completo.';renderMenu();return;}
  const m=mergeProg(prog,p);for(const k of Object.keys(prog))delete prog[k];Object.assign(prog,m);saveProg();checkAchs();xferMsg='¡Partida importada y fusionada! 🪙 '+prog.coins;renderMenu();}}
/* aviso único de las monedas devueltas por las técnicas antiguas */
function refundNotice(){if(prog.rfMsg>0){toast('🪙 MONEDAS DEVUELTAS','+'+prog.rfMsg+' por las técnicas antiguas (la tienda ahora tiene técnicas icónicas)');prog.rfMsg=0;saveProg();}}
