/* =========================================================
   KAIOKEN CLASH 2.2 — EVENTO: TORNEO DEL PODER (cada hora)
   Se abre los primeros 20 minutos de cada hora (hora del celular). Unirse es opcional.
   Eliges universo (equipos del anime o uno propio con tus luchadores) y peleas un battle royale entre universos.
   K.O. o caer fuera de la plataforma = eliminado: pasas a la grada de tu universo.
   El último universo en pie gana las Súper Esferas del Dragón (un deseo de Súper Shenlong por hora).
   ========================================================= */
const TDP_WIN=20,TDP_TIME=300,TDP_R=46;
const TDP_UNIS=[
 {id:'u7',n:7,short:'U7',name:'Universo 7',col:0x3a8aff,god:'Bills',roster:['goku','vegeta','gohan','piccolo','freezer','a17','a18','krilin'],def:['goku','vegeta','a17','freezer'],max:4,desc:'Goku, Vegeta, Gohan, Piccolo, Freezer, los androides 17 y 18 y Krilin.'},
 {id:'u6',n:6,short:'U6',name:'Universo 6',col:0xff4a4a,god:'Champa',roster:['hit','kefla'],def:['hit','kefla'],max:2,desc:'Hit, el asesino legendario, y Kefla, la fusión de Kale y Caulifla.'},
 {id:'u11',n:11,short:'U11',name:'Universo 11',col:0x4ae0c0,god:'Belmod',roster:['jiren','toppo'],def:['jiren','toppo'],max:2,desc:'Jiren y Toppo, de las Tropas del Orgullo. Toppo puede despertar como Dios de la Destrucción.'},
 {id:'u10',n:10,short:'U10',name:'Universo 10',col:0x9aff4a,god:'Rumsshi',roster:['zamasuk','black'],def:['zamasuk','black'],max:2,desc:'Zamasu, aprendiz de Kaioshin del Universo 10, y Goku Black.'}];
const TDP_OWN={id:'own',n:0,short:'U★',name:'Tu universo',col:0xffd23a,god:'Tú',roster:null,def:[],max:4,desc:'Crea tu propio universo con hasta 4 luchadores que tengas.'};
const TDP_FILL=[{short:'U2',col:0xff6ad0},{short:'U3',col:0xc06aff},{short:'U4',col:0xff8a3a},{short:'U9',col:0x6a7aff}];
const tdpUni=id=>id==='own'?TDP_OWN:TDP_UNIS.find(u=>u.id===id)||TDP_UNIS[0];
/* horario: abierto los minutos 0-19 de cada hora */
function tdpClock(){const d=new Date(),s=d.getMinutes()*60+d.getSeconds(),open=s<TDP_WIN*60;return{open,left:open?TDP_WIN*60-s:3600-s};}
const tdpOpen=()=>tdpClock().open;
const mmss=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
function tdpHour(){const d=new Date(),p=n=>String(n).padStart(2,'0');return''+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+p(d.getHours());}
function tdpBadge(){const c=tdpClock();return c.open?' · ¡EN CURSO! '+mmss(c.left):' · en '+mmss(c.left);}
function tdpStatus(){const c=tdpClock(),won=prog.tdp.last===tdpHour();
 return c.open?`<b style="color:#7dff7a">¡EL TORNEO ESTÁ EN CURSO!</b> Cierra en ${mmss(c.left)}${won?' · <span style="color:#ffd23a">Ya ganaste las Súper Esferas esta hora</span>':''}`:`<b style="color:#ff9a5a">CERRADO</b> · El próximo torneo empieza en ${mmss(c.left)} (a la hora en punto)`;}
/* selección guardada */
const tdpSelTeam=()=>{const u=tdpUni(prog.tdp.uni);let L=(u.id==='own'?prog.tdp.cus:prog.tdp.team).filter(id=>chIdx(id)>=0&&!lockedC(chIdx(id))&&(!u.roster||u.roster.includes(id)));
 if(!L.length)L=(u.id==='own'?[CHARS[cur[0]]&&!lockedC(cur[0])?CHARS[cur[0]].id:'goku']:u.def.filter(id=>chIdx(id)>=0&&!lockedC(chIdx(id))));return L.slice(0,u.max);};
function tdpSetSel(L){const u=tdpUni(prog.tdp.uni);if(u.id==='own')prog.tdp.cus=L;else prog.tdp.team=L;saveProg();}
let tdpMsg='';
function tdpHTML(){const u=tdpUni(prog.tdp.uni),team=tdpSelTeam(),c=tdpClock(),pool=u.roster?u.roster:CHARS.map(x=>x.id);
 const card=x=>`<div class="tdpu${x.id===u.id?' on':''}" style="--uc:${hex(x.col)}" data-act="tdpUni" data-arg="${x.id}"><b>${x.short}</b><span>${x.name}</span><em>${x.desc}</em></div>`;
 return`${backBtn()}<div class="ttl">🏟 TORNEO DEL PODER · ${coinTag()}</div><div class="tdpst" id="tdpst">${tdpStatus()}</div>
 ${prog.tdp.wish?'<button class="btn" data-act="tdpWish">🐉 TIENES UN DESEO PENDIENTE DE SÚPER SHENLONG</button>':''}
 <div class="tip">Battle royale entre universos en la arena del Mundo del Vacío. Si te dejan K.O. o caes fuera de la plataforma, quedas eliminado y pasas a la grada de tu universo. El último universo en pie gana las <b>Súper Esferas del Dragón</b>. Vale fusionarse si la pareja está en tu equipo (<span class="k">Z</span> / 🤝). Dura ${TDP_TIME/60} minutos: al acabar el tiempo gana el universo con más guerreros en pie.</div>
 <div class="tdpunis">${TDP_UNIS.map(card).join('')}${card(TDP_OWN)}</div>
 <div class="gcol oc" style="margin-top:6px"><h3>TU EQUIPO · ${u.name.toUpperCase()} (${team.length}/${u.max}) · toca un retrato para elegir a quién controlas</h3><div class="sqrow">${team.map((id,i)=>{const ci=chIdx(id);return`<div class="sqs t0${i===0?' on':''}" data-act="tdpLead" data-arg="${id}"><img src="${PORTRAITS[ci]}" alt=""><span>${CHARS[ci].name}</span><em>${i?'CPU':'TÚ'}</em></div>`;}).join('')}</div></div>
 <div class="grid tdpgrid">${pool.map(id=>{const i=chIdx(id);if(i<0)return'';const L=lockedC(i),on=team.includes(id);return`<div class="cell${L?' lock':''}${on?' tdpon':''}" data-act="tdpPick" data-arg="${id}"><img src="${PORTRAITS[i]}" alt="">${L?'🔒 ':''}${CHARS[i].name}${on?'<div class="cur"></div>':''}</div>`;}).join('')}</div>
 ${tdpMsg?`<div style="color:#ff9a5a;margin-top:4px">${tdpMsg}</div>`:''}
 <div class="mid" style="margin-top:8px"><button class="btn" data-act="cycleDiff">DIFICULTAD: ${DIFFS[game.diff].name.toUpperCase()}</button><button class="btn${c.open?'':' off'}" data-act="tdpGo">${c.open?'¡ENTRAR AL TORNEO! ▶':'CERRADO · vuelve en '+mmss(c.left)}</button></div>
 <div class="hint">Victorias en el torneo: ${prog.stats.tdpwin||0} · Participaciones: ${prog.stats.tdp||0}</div>`;}
/* participantes: tu universo primero (equipo 0) y el resto de universos del anime */
function tdpBuildTeams(){const me=tdpUni(prog.tdp.uni),team=tdpSelTeam(),pick=(L,n)=>{const a=L.filter(id=>chIdx(id)>=0);for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,n);};
 const unis=[{u:me,m:team.map((id,i)=>({c:chIdx(id),human:i===0}))}];
 for(const u of TDP_UNIS){if(u===me)continue;let ids=u.id==='u7'?pick(u.roster,me.id==='own'?3:4):u.def.slice();
  /* no repetir luchadores de tu equipo propio */
  if(me.id==='own'){ids=ids.filter(id=>!team.includes(id));if(u.id==='u7'&&ids.length<3)ids=pick(u.roster.filter(id=>!team.includes(id)),3);}
  if(ids.length)unis.push({u,m:ids.map(id=>({c:chIdx(id),human:false}))});}
 return unis;}
/* poder en el torneo: relativo al pico de cada luchador y comprimido, para que sea parejo y transformarse siga contando (tu pico cuenta solo las formas que tienes) */
const TDP_REF=1e9;
const tdpPow=f=>TDP_REF*Math.pow(f.realPower()/(f.base*(f.tdpPk||1)),.2);
function tdpPeak(ch,human){let m=1;ch.forms.forEach((f,i)=>{if(ERA[f.era]>game.techo)return;if(human&&!owns(ch,i))return;m=Math.max(m,f.mult||1);});return ch.base*m;}
function tdpStartMatch(D){const T=game.tdp;let idx=0;const all=[];
 const avg=T.unis.reduce((s,x)=>s+x.m.length,0)/T.unis.length;
 T.unis.forEach((x,t)=>{const hpK=clamp(Math.pow(avg/x.m.length,.6),.8,2.2);x.m.forEach(m=>{const ch=CHARS[m.c];
  const f=new Fighter(idx++,m.c,{startForm:0,team:t,maxHp:Math.round(MAXHP*hpK),noLight:true});f.tdpPk=tdpPeak(ch,m.human)/ch.base;f.cpu=!m.human;if(f.cpu&&D.cap!==Infinity)f.cap=D.cap;f.benched=false;all.push(f);});});
 game.f=all;all.forEach(f=>{f.opp=all.find(x=>x.team!==f.team);});
 T.t=TDP_TIME;T.kills=0;T.seatN={};T.win=null;T.feed=[];T.boardT=0;
 game.wins=T.unis.map(()=>0);game.round=1;buildHud();$('#hud').style.display='block';$('#pp1').style.display='flex';$('#bossbar').style.display='none';$('#train').style.display='none';
 if(!$('#tdpfeed')){const d=document.createElement('div');d.id='tdpfeed';$('#hud').appendChild(d);}$('#tdpfeed').innerHTML='';$('#tdpfeed').style.display='block';
 $('#menu').innerHTML='';menuState=null;playTrack('arc_tp');track('tdp');startRound();}
function tdpPlace(sy){const T=game.tdp,n=T.unis.length,Rp=TDP_R*.64;
 T.unis.forEach((x,t)=>{const a=Math.PI/2+t/n*TAU,c=V3(Math.cos(a)*Rp,sy,Math.sin(a)*Rp),tg=V3(-Math.sin(a),0,Math.cos(a)),m=game.f.filter(f=>f.team===t);
  m.forEach((f,i)=>{f.reset(1,c.clone().addScaledVector(tg,(i-(m.length-1)/2)*4.5));f.face=Math.atan2(-c.x,-c.z);f.benched=false;f.tdpFall=0;f.seat=null;f.opp=null;f.retT=0;f.model.root.visible=true;});});
 game.f.forEach(retarget);}
const tdpSub=()=>{const T=game.tdp;return`${T.unis.length} universos · ${game.f.length} guerreros · ${DIFFS[game.diff].name} · ¡El último en pie gana las Súper Esferas!`;};
function tdpHud(){const T=game.tdp,me=game.f.filter(f=>f.team===0),rest=game.f.filter(f=>f.team!==0);
 for(let i=0;i<2;i++)$('#pp'+i).classList.add('team','roy');
 $('#pp0').innerHTML=me.map(f=>memHud(f.idx,false,f.idx!==0?' sm':'')).join('');
 $('#pp1').innerHTML=`<div id="tdpb"></div><div style="display:none">${rest.map(f=>memHud(f.idx,false,' sm')).join('')}</div>`;tdpBoard();}
function tdpBoard(){const el=$('#tdpb'),T=game.tdp;if(!el||!T)return;
 el.innerHTML=T.unis.map((x,t)=>{const m=game.f.filter(f=>f.team===t),al=m.filter(f=>!f.benched&&f.state!=='ko').length;
  return`<div class="tdpr${t===0?' me':''}${al?'':' gone'}" style="--uc:${hex(x.u.col)}"><b>${x.u.short}</b>${m.map(f=>`<i class="${f.benched?'x':''}">${f.benched?'✖':''}</i>`).join('')}<span>${al?al+' en pie':'BORRADO'}</span></div>`;}).join('');}
function tdpFeed(txt){const T=game.tdp,el=$('#tdpfeed');if(!el)return;T.feed.push(txt);if(T.feed.length>4)T.feed.shift();el.innerHTML=T.feed.map(s=>`<div>${s}</div>`).join('');}
function tdpKO(def,att){if(human(att))track('ko');def.hp=0;tdpElim(def,'ko',att);}
function tdpElim(f,how,att){const T=game.tdp;if(!T||f.benched||game.phase!=='fight')return;f.benched=true;f.hp=0;f.killSpecial();f.setState('ko',99);
 const by=att||f.lastAtt;if(by&&by.team===0&&by.team!==f.team)T.kills++;
 sparks(f.chest(),0xd8b0ff,18,14,.5);ring(f.chest(),0xd8b0ff,4,.45,false,.2);sfx('flash');
 const U=T.unis[f.team].u;tdpFeed(`<b style="color:${hex(U.col)}">${U.short}</b> ${esc(f.ch.name)} ${how==='out'?'cae de la arena':'queda K.O.'}${by&&by.team!==f.team?' · '+esc(by.ch.name):''}`);
 pop(f,'¡ELIMINADO!','#ff7a7a',true);
 const k=T.seatN[f.team]=(T.seatN[f.team]||0)+1;f.seat=world.seat?world.seat(f.team,k-1):null;if(f.seat){f.pos.copy(f.seat);f.vel.set(0,0,0);spawn({pos:f.seat.clone().add(V3(0,1,0)),color:0xd8b0ff,size:4,life:.5});}
 if(human(f))showMsg('¡ELIMINADO!','Sigue la pelea desde la grada de tu universo',1.4);
 tdpBoard();tdpCheck();}
function tdpAlive(){return[...new Set(game.f.filter(x=>!x.benched&&x.state!=='ko').map(x=>x.team))];}
/* ¿quién va ganando? más guerreros en pie y, si empatan, más vida */
function tdpLeader(teams){let best=teams[0],bv=-1;for(const t of teams){const m=game.f.filter(f=>f.team===t&&!f.benched&&f.state!=='ko'),v=m.length*10+m.reduce((s,f)=>s+f.hp/f.maxHp,0);if(v>bv){bv=v;best=t;}}return best;}
function tdpCheck(){const al=tdpAlive();if(al.length<=1)tdpEnd(al.length?al[0]:0);else if(!al.includes(0))tdpEnd(tdpLeader(al));}
function tdpEnd(wi){const T=game.tdp;if(T.win!=null)return;T.win=wi;game.timescale=.3;negT=.08;sfx('boom',1);const U=T.unis[wi].u;
 showMsg(wi===0?'¡ÚLTIMO EN PIE!':'¡FIN DEL TORNEO!',U.name+' gana el Torneo del Poder',2);game.lastKO=game.f.find(f=>f.team===wi)||game.f[0];roundOver(wi,'tdp');}
function tdpStep(dt){const T=game.tdp,W=world;if(!T||!W||!W.tdp)return;
 for(const f of game.f){if(f.benched){if(f.seat){f.pos.copy(f.seat);f.vel.set(0,0,0);}f.face=Math.atan2(-f.pos.x,-f.pos.z);f.model.target='idle';continue;}
  if(f.state==='ko'||game.phase!=='fight')continue;
  const r=Math.hypot(f.pos.x,f.pos.z),off=r>W.R+.6||(f.pos.y<.6&&W.groundY(f.pos.x,f.pos.z)<-1e9);
  if(off){f.tdpFall=(f.tdpFall||0)+34*dt;f.pos.y-=f.tdpFall*dt;if(f.pos.y<-7||r>W.R+16)tdpElim(f,'out');}else f.tdpFall=0;}
 /* la CPU también se fusiona si tiene a su pareja cerca y va perdiendo */
 if(game.phase==='fight'&&Math.random()<dt*.15){const c=game.f.find(f=>f.cpu&&!f.benched&&f.state!=='ko'&&f.hp<f.maxHp*.55&&fusionPartner(f));if(c)tryFuse(c);}
 if(game.phase==='fight'){T.t-=dt;if(T.t<=0){T.t=0;tdpEnd(tdpLeader(tdpAlive()));}}
 T.boardT-=dt;if(T.boardT<=0){T.boardT=.5;tdpBoard();}}
function tdpOver(){const T=game.tdp,wi=T.win??0,win=wi===0,U=T.unis[wi].u;game.phase='over';
 const W=game.f.filter(f=>f.team===wi&&!f.benched);W.forEach(f=>f.setState('victory'));game.cine={type:'victory',f:W[0]||game.f.find(f=>f.team===wi)||game.f[0],t:999,dur:999};
 const hour=tdpHour(),sdb=win&&prog.tdp.last!==hour,coins=80+T.kills*40+(win?400:0);
 if(win){track('tdpwin');if(sdb){prog.tdp.last=hour;prog.tdp.wish=1;}}
 prog.coins+=coins;prog.earned+=coins;saveProg();
 const btn=(sdb?'<button class="btn" data-act="tdpWish">🐉 INVOCAR A SÚPER SHENLONG</button>':'')+'<button class="btn" data-act="tdpBack">VOLVER AL TORNEO</button><button class="btn" data-act="toMainMenu">MENÚ</button>';
 showMsg(win?'¡TU UNIVERSO GANA!':'¡TU UNIVERSO HA SIDO BORRADO!',`Último en pie: <b style="color:${hex(U.col)}">${U.name}</b> · <span style="color:var(--yl)">+${coins} 🪙</span> · ${T.kills} eliminaciones tuyas`+
  (win&&!sdb?'<br><span class="tip">Las Súper Esferas ya se usaron esta hora: vuelve en el próximo torneo.</span>':win?'<br>¡Has ganado las <b>Súper Esferas del Dragón</b>!':'')+'<br>'+btn,0);
 $('#tdpfeed').style.display='none';}
function tdpCanStart(){return tdpOpen()&&game.tdp&&game.tdp.unis&&game.tdp.unis[0].m.length>0;}
/* ---- Súper Shenlong ---- */
const SUPER_WISHES=[
 {id:'scoins',name:'Riqueza de un dios',desc:'+6000 monedas.'},
 {id:'sforms',name:'El poder de los dioses',desc:'Todas las formas de dos luchadores al azar que aún no las tengan.'},
 {id:'schars',name:'Revivir a los guerreros',desc:'Desbloquea todos los luchadores del modo historia que te falten.'},
 {id:'souts',name:'Armario divino',desc:'Los dos outfits de monedas más caros que aún no tengas.'}];
function swishHTML(){return`<div class="panel"><div class="ttl" style="color:#ffd23a">🐉 SÚPER SHENLONG: «PIDE TU DESEO, EL QUE SEA»</div><div class="opts">${SUPER_WISHES.map(w=>`<div class="opt" data-act="swish" data-arg="${w.id}"><h3>${w.name}</h3>${w.desc}</div>`).join('')}</div></div>`;}
function grantSuperWish(id){let msg='',fc=null;
 if(id==='schars'){const L=CHARS.filter(c=>c.unlock&&!prog.unl.includes(c.id));L.forEach(c=>unlockChar(c.id,true));if(L.length)msg=L.map(c=>c.name).join(', ')+' se unen a tus luchadores';else id='scoins';}
 if(id==='souts'){const L=OUTFITS.filter(o=>!o.paid&&!prog.ofOwn.includes(o.id)).sort((a,b)=>b.price-a.price).slice(0,2);L.forEach(o=>grantOutfit(o.id,true));if(L.length)msg='Outfits nuevos: '+L.map(o=>o.name).join(' y ');else id='scoins';}
 if(id==='sforms'){const cs=CHARS.filter(c=>!c.unlock||prog.unl.includes(c.id)).filter(c=>c.forms.some((_,i)=>!owns(c,i)));if(cs.length){const L=[];for(let k=0;k<2&&cs.length;k++)L.push(cs.splice(Math.random()*cs.length|0,1)[0]);L.forEach(c=>prog.own[c.id]=c.forms.map((_,i)=>i));msg=L.map(c=>c.name).join(' y ')+' despiertan todas sus formas';fc=[chIdx(L[0].id),L[0].forms.length-1];}else id='scoins';}
 if(id==='scoins'){prog.coins+=6000;prog.earned+=6000;msg='+6000 🪙';}
 prog.tdp.wish=0;track('swish');saveProg();toast('🐉 DESEO CONCEDIDO',msg+' · Las Súper Esferas se convierten en piedra…');
 if(fc)formCine(fc[0],fc[1],()=>toMenu('tdp'));else toMenu('tdp');}
function superShenlong(){if(!prog.tdp.wish)return;const lead=(game.tdp&&game.tdp.unis?CHARS[game.tdp.unis[0].m[0].c].id:tdpSelTeam()[0])||'goku';$('#msg').classList.remove('show');$('#sub').innerHTML='';const fd=$('#tdpfeed');if(fd)fd.style.display='none';game.phase=null;
 cinePlay({id:'sshen',title:'Súper Shenlong',world:'tdp',cast:[{c:lead,x:-2,z:24},{c:'sshenlong',x:0,z:-30,s:2.6,hidden:1}],shots:[
  {who:'nar',say:'Las siete Súper Esferas del Dragón, grandes como planetas, se reúnen sobre el Mundo del Vacío.',cam:'sky',balls:'super'},
  {who:'nar',say:'Su luz se vuelve cegadora…',cam:'sky',fx:'shake'},
  {who:'sshenlong',say:'«Yo soy el dragón divino, Súper Shenlong. Os concederé un deseo, el que sea. Decidlo ya.»',cam:'shen',fx:'shake',ballsOff:1,show:'sshenlong'},
  {who:lead,say:'¡Ya sé lo que quiero pedir!',cam:'close',pose:'victory'}],noSeen:1},()=>{menuState='swish';renderMenu();});}
/* ---- arena del anime: plataforma de losas, escalones centrales, pilares, gradas flotantes de cada universo y palco de Zeno ---- */
function tdpFigure(parent,x,y,z,body,head,h=1,o={}){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
 const b=new THREE.Mesh(new THREE.CylinderGeometry(.32*h,.45*h,1.3*h,8),WM(body));b.position.y=.65*h;g.add(b);
 const hd=new THREE.Mesh(new THREE.SphereGeometry((o.big?.62:.36)*h,12,10),WM(head));hd.position.y=(o.big?1.75:1.6)*h;g.add(hd);
 if(o.big)for(const s of[1,-1]){const e=new THREE.Mesh(new THREE.SphereGeometry(.17*h,8,6),BASIC(0x16101e));e.position.set(s*.22*h,1.8*h,.5*h);e.scale.set(.8,1.3,.4);g.add(e);}
 if(o.hair){const hr=new THREE.Mesh(new THREE.ConeGeometry(.22*h,.8*h,6),WM(o.hair));hr.position.y=2.15*h;g.add(hr);}
 if(o.halo){const r=new THREE.Mesh(new THREE.TorusGeometry(.5*h,.06*h,6,20),BASIC(0x9ae8ff));r.rotation.x=Math.PI/2;r.position.set(0,1.4*h,-.35*h);g.add(r);}
 return g;}
function buildTdP(v,event){
 clearWorld();const ruins=v===1,R=event?TDP_R:62,T=4;
 const sky=new THREE.Mesh(new THREE.SphereGeometry(1500,40,24),new THREE.ShaderMaterial({uniforms:{uT:{value:0}},side:THREE.BackSide,depthWrite:false,fog:false,
  vertexShader:`varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`uniform float uT;varying vec3 vP;void main(){float a=atan(vP.z,vP.x),y=vP.y;float sw=.5+.5*sin(a*3.0+y*4.0+uT*.05+sin(a*2.0-uT*.03)*2.0);
   vec3 c=mix(vec3(.05,.03,.16),vec3(.32,.16,.52),smoothstep(-.4,.7,y));c=mix(c,vec3(.55,.35,.75),sw*.25*smoothstep(0.,.8,y));
   c+=vec3(.25,.45,.85)*pow(.5+.5*sin(a*7.0-y*6.0+uT*.04),12.0)*.35;c+=vec3(1.0,.9,1.0)*smoothstep(.985,1.0,sin(a*40.0)*sin(y*37.0))*.6;c=floor(c*24.0)/24.0;gl_FragColor=vec4(c,1.0);}`}));
 sky.renderOrder=-10;worldGroup.add(sky);scene.fog=new THREE.Fog(0x2a1a48,260,1400);wStars(1800,1200,2,0xe8e0ff);
 wLight({h:0xe8e0ff,g:0x2a1a50,hi:.9,s:0xffffff,si:1.1,p:[30,220,60]});
 /* nubes de luz y esferas de colores del Mundo del Vacío */
 for(let i=0;i<10;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:SMOKE,color:[0xb07aff,0x7ab0ff,0xff9ad8][i%3],transparent:true,opacity:.28,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));const d=rndDir().multiplyScalar(900);if(d.y<0)d.y*=-.4;s.position.copy(d);s.scale.setScalar(rand(300,650));worldGroup.add(s);}
 /* losas de la plataforma: gris lila con líneas de anillos y radios */
 const cells=[];const N=Math.ceil(R/T)+1;for(let i=-N;i<N;i++)for(let j=-N;j<N;j++){const cx=(i+.5)*T,cz=(j+.5)*T;if(Math.hypot(cx,cz)<R)cells.push([i,j,cx,cz]);}
 const tiles=new THREE.InstancedMesh(Bx(3.9,3,3.9),new THREE.MeshToonMaterial({color:0xffffff,gradientMap:TOON}),cells.length);const map=new Map(),alive=[];const mtx=new THREE.Matrix4(),col=new THREE.Color();
 cells.forEach((c,k)=>{mtx.makeTranslation(c[2],-1.5,c[3]);tiles.setMatrixAt(k,mtx);const d=Math.hypot(c[2],c[3]),a=Math.atan2(c[3],c[2]),spoke=Math.abs(Math.sin(a*4))*d<2.2&&d>12;
  const ring=Math.abs(d-12)<2||Math.abs(d-R*.66)<2||d>R-2.5;col.setHex(ring?0x8e86ae:spoke?0xa8a0c4:(c[0]+c[1])%2?0xdcd6e8:0xccc6dc).multiplyScalar(rand(.94,1.03));tiles.setColorAt(k,col);map.set(c[0]+','+c[1],k);alive.push(true);});
 tiles.receiveShadow=true;worldGroup.add(tiles);
 const rim=new THREE.Mesh(new THREE.CylinderGeometry(R+.6,R-5,8,64,1,true),WM(0x7a72a0,{side:THREE.DoubleSide}));rim.position.y=-4.2;worldGroup.add(rim);
 const under=new THREE.Mesh(new THREE.ConeGeometry(R-5,70,10),WM(0x5a527e));under.rotation.x=Math.PI;under.position.y=-43;worldGroup.add(under);
 const crys=[];for(let i=0;i<14;i++){const a=i/14*TAU,d=R*rand(.35,.85);crys.push({x:Math.cos(a)*d,y:-14-rand(0,30),z:Math.sin(a)*d,s:rand(2,5),sy:rand(5,12),ry:a});}
 wInst(new THREE.OctahedronGeometry(1,0),WM(0x8a7ac8),crys.map(c=>({x:c.x,y:c.y,z:c.z,sx:c.s,sy:c.sy,sz:c.s,ry:c.ry})));
 /* escalones centrales y pilares de distintas alturas, como en el anime */
 const rocks=[];const stone=0xd8d2e6;
 [[9,1.3],[6.2,1.3],[3.6,1.3]].forEach(([r,h],i)=>{const rk=makeRock(new THREE.CylinderGeometry(r,r+.3,h,8),0,0,r,h,i*1.3,[0xc4bcd8,0xd0c8e2,0xdcd6ec][i]);rk.mesh.rotation.y=Math.PI/8;rk.indestructible=true;rocks.push(rk);});
 const Rp=R*.64;for(let i=0;i<14;i++){let x,z,k=0;do{const a=rand(0,TAU),d=rand(13,R-5);x=Math.cos(a)*d;z=Math.sin(a)*d;k++;}while(k<30&&(Math.abs(Math.hypot(x,z)-Rp)<6||rocks.some(r=>Math.hypot(r.x-x,r.z-z)<r.r+5)));
  const r=rand(1.2,2.6),h=rand(5,20),rk=makeRock(bandedCylinder(r,r*1.08,h,4,{c:[stone,0xc0b8d4]}),x,z,r*1.2,h,0);rk.mesh.rotation.y=Math.PI/4+rand(-.2,.2);rocks.push(rk);}
 /* gradas flotantes: una por universo (los participantes primero) y el palco de Zeno con el Gran Sacerdote */
 const P=event&&game.tdp&&game.tdp.unis?game.tdp.unis.map(x=>({short:x.u.short,col:x.u.col})):[];const S=P.concat(TDP_FILL.concat(TDP_UNIS.map(u=>({short:u.short,col:u.col}))).filter(f=>!P.some(p=>p.short===f.short))).slice(0,Math.max(8,P.length));
 const RB=R+30,balc=[];
 S.forEach((u,i)=>{const a=Math.PI/2+i/S.length*TAU,y=10+(i%2)*3,c=V3(Math.cos(a)*RB,y,Math.sin(a)*RB),st=new THREE.Group();st.position.copy(c);st.lookAt(0,y,0);worldGroup.add(st);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(8,4.5,3,10),WM(0x5a5482));base.position.y=-1.5;st.add(base);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(8.2,8.2,.5,10),WM(0xe8e2f4));top.position.y=.25;st.add(top);
  const edge=new THREE.Mesh(new THREE.TorusGeometry(8.1,.18,6,30,Math.PI),BASIC(u.col));edge.rotation.x=-Math.PI/2;edge.rotation.z=Math.PI;edge.position.set(0,1.3,0);st.add(edge);
  const back=new THREE.Mesh(new THREE.CylinderGeometry(8.2,8.2,5,10,1,true,Math.PI*.6,Math.PI*.8),WM(0x6a62a0,{side:THREE.DoubleSide}));back.position.y=2.7;st.add(back);
  const num=new THREE.Mesh(new THREE.PlaneGeometry(5,2.5),BASIC(0xffffff,{map:textTex(u.short,'#fff',hex(u.col),128,64),transparent:true}));num.position.set(0,6,-7.4);st.add(num);
  const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:u.col,blending:THREE.AdditiveBlending,transparent:true,opacity:.5,depthWrite:false}));gl.scale.setScalar(16);gl.position.y=-2;st.add(gl);
  /* dios, Kaioshin y ángel al fondo de cada grada */
  tdpFigure(st,-2.6,.5,-5.4,0x3a2a5a,0x8a6ab0,1.1,{});tdpFigure(st,0,.5,-5.8,0x2a5aa8,0x9ad0ff,1.3,{hair:0xe8f0ff,halo:1});tdpFigure(st,2.6,.5,-5.4,0xd8c870,0xf0c8a0,1,{hair:0xf4f4f4});
  balc.push({c,a,y:c.y+.5});});
 const zeno=new THREE.Group();zeno.position.set(0,44,-(R+56));worldGroup.add(zeno);
 const zp=new THREE.Mesh(new THREE.CylinderGeometry(13,7,5,12),WM(0x5a4a92));zeno.add(zp);const zt=new THREE.Mesh(new THREE.CylinderGeometry(13.2,13.2,.6,12),WM(0xf0eaff));zt.position.y=2.8;zeno.add(zt);
 for(const s of[1,-1]){const th=new THREE.Mesh(Bx(3.2,4.5,2.4),WM(0xd8a8ff));th.position.set(s*2.4,5.3,-1.6);zeno.add(th);tdpFigure(zeno,s*2.4,3.1,0,0xc84aa8,0xbfe2f4,1.25,{big:1});}
 tdpFigure(zeno,6.6,3.1,.6,0x1e1a3a,0x5aa0e0,1.6,{hair:0xffffff,halo:1});
 const zgl=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:0xd0a0ff,blending:THREE.AdditiveBlending,transparent:true,opacity:.6,depthWrite:false}));zgl.scale.setScalar(70);zgl.position.y=4;zeno.add(zgl);
 const orbs=[];for(let i=0;i<9;i++){const o=new THREE.Mesh(new THREE.SphereGeometry(rand(10,24),16,12),BASIC([0x8a5aff,0xff7ad0,0x5ab0ff][i%3],{transparent:true,opacity:.3}));const d=rndDir().multiplyScalar(rand(320,620));if(d.y<0)d.y*=-.5;o.position.copy(d);worldGroup.add(o);orbs.push(o);}
 let bar=null;if(!event){const barMat=BASIC(0xa060ff,{transparent:true,opacity:.07,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
  bar=new THREE.Mesh(new THREE.CylinderGeometry(R-2.4,R-2.4,60,64,1,true),barMat);bar.position.y=28;worldGroup.add(bar);}
 const W={id:'void',name:'Mundo del Vacío',dirt:0xc8c2d8,rocks,bound:event?R+60:R-3,barrier:!event,maxY:event?40:34,spawnY:1,tiles,map,alive,cells,void:!event,tdp:event,R,
  killTile(k){if(!this.alive[k])return;this.alive[k]=false;mtx.makeScale(0,0,0);this.tiles.setMatrixAt(k,mtx);this.tiles.instanceMatrix.needsUpdate=true;const c=this.cells[k];spawnDebris(V3(c[2],-.5,c[3]),0xc8c2d8,2,8,1.2);},
  groundY(x,z){const k=this.map.get(Math.floor(x/T)+','+Math.floor(z/T));if(k!=null&&this.alive[k])return 0;
   if(event)for(const b of balc)if(Math.hypot(x-b.c.x,z-b.c.z)<7.6)return b.y;return-Infinity;},
  /* golpes fuertes rompen losas (huecos); los demás dejan grietas */
  onImpact(pos,r){if(pos.y>2)return true;if(r<2.2)return false;for(let k=0;k<this.cells.length;k++){const c=this.cells[k];if(this.alive[k]&&Math.hypot(c[2]-pos.x,c[3]-pos.z)<r*.8&&Math.hypot(c[2],c[3])>10)this.killTile(k);}return false;},
  seat(t,k){const b=balc[t%balc.length],tg=V3(-Math.sin(b.a),0,Math.cos(b.a)),inw=V3(-Math.cos(b.a),0,-Math.sin(b.a));return b.c.clone().addScaledVector(tg,((k%4)-1.5)*2.4).addScaledVector(inw,2.5-Math.floor(k/4)*2.6).setY(b.y);},
  anim(dt){sky.material.uniforms.uT.value+=dt;const t=performance.now()/1000;orbs.forEach((o,i)=>o.position.y+=Math.sin(t*.3+i)*dt*2);zgl.material.opacity=.5+Math.sin(t*1.5)*.15;},resetRound(){},update(dt){this.anim(dt);}};
 if(ruins){cells.forEach((c,k)=>{if(Math.hypot(c[2],c[3])>10&&Math.random()<.3){W.alive[k]=false;mtx.makeScale(0,0,0);tiles.setMatrixAt(k,mtx);}});tiles.instanceMatrix.needsUpdate=true;
  wInst(Bx(3.8,1.5,3.8),WM(0xc8c2d8),Array.from({length:60},()=>{const a=rand(0,TAU),d=rand(R+8,R+80);return{x:Math.cos(a)*d,y:rand(-40,25),z:Math.sin(a)*d,rx:rand(-1,1),ry:rand(0,3),rz:rand(-1,1)};}));}
 return W;}
const TDP_WORLD={name:'Torneo del Poder',desc:'Evento cada hora.',vars:['Arena'],build:v=>buildTdP(0,true),music:'void'};
Object.assign(WORLDS[2],{build:v=>buildTdP(v,false),desc:'La arena del Torneo del Poder como en el anime: losas, escalones centrales, pilares, las gradas de los universos y el palco de Zeno. Una barrera rodea la plataforma.'});
/* acciones */
Object.assign(ACTIONS,{
 openTdp:()=>{initAudio();sfx('ok');tdpMsg='';if(!music.track)playTrack('menu');menuState='tdp';renderMenu();},
 tdpUni:a=>{if(a!=='own'&&!TDP_UNIS.some(u=>u.id===a))return;prog.tdp.uni=a;tdpMsg='';saveProg();sfx('sel');renderMenu();},
 tdpPick:a=>{const u=tdpUni(prog.tdp.uni),i=chIdx(String(a));if(i<0||(u.roster&&!u.roster.includes(a)))return;if(lockedC(i)){tdpMsg=LOCK_MSG;sfx('back');renderMenu();return;}
  let L=tdpSelTeam();if(L.includes(a)){if(L.length>1)L=L.filter(x=>x!==a);}else if(L.length<u.max)L.push(a);else{tdpMsg='Tu equipo ya está completo ('+u.max+'). Quita a alguien antes.';sfx('back');renderMenu();return;}
  tdpMsg='';tdpSetSel(L);sfx('sel');renderMenu();},
 tdpLead:a=>{const L=tdpSelTeam();if(!L.includes(a))return;tdpSetSel([a,...L.filter(x=>x!==a)]);sfx('sel');renderMenu();},
 tdpGo:()=>{if(!tdpOpen()){tdpMsg='El torneo está cerrado. Vuelve a la hora en punto.';sfx('back');renderMenu();return;}
  const L=tdpSelTeam();if(!L.length)return;game.mode='tdp';game.online=false;game.tdp={unis:tdpBuildTeams()};game.variant=0;sfx('ok');startMatch();},
 tdpBack:()=>{$('#msg').classList.remove('show');toMenu('tdp');},
 tdpWish:()=>superShenlong(),
 swish:a=>{if(prog.tdp.wish&&SUPER_WISHES.some(w=>w.id===a))grantSuperWish(a);}});
/* aviso cuando empieza el torneo y reloj en el menú */
let tdpWas=tdpOpen();
setInterval(()=>{const o=tdpOpen();if(o&&!tdpWas&&!game.phase)toast('🏟 ¡EMPIEZA EL TORNEO DEL PODER!','Únete desde el menú principal · '+TDP_WIN+' minutos');tdpWas=o;
 if(menuState==='title'){const el=$('#tdpclk');if(el)el.textContent=tdpBadge();}if(menuState==='tdp'){const el=$('#tdpst');if(el)el.innerHTML=tdpStatus();}},1000);
