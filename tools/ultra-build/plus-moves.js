/* =========================================================
   KAIOKEN CLASH 3.0 — TÉCNICAS CON FORMA PROPIA
   hakai (esfera de destrucción con anillos), disc (Kienzan / disco), spiral (Makankosappo con aros),
   sword (espada de ki en la mano, golpe rápido), rain (lluvia de ki multidireccional que converge),
   hellzone (Hellzone Grenade: esferas que rodean al rival y se cierran), genki (Genkidama),
   glare (Mirada de Jiren: explosión sin proyectil), barrier (barrera explosiva), meteors (lluvia de meteoros)
   ========================================================= */
const TECH_TYPES={'Hakai':'hakai','Esfera de Destrucción':'hakai','Esferas de Destrucción':'hakai','Hakai de Toppo':'hakai',
 'Kienzan':'disc','Kienzan Gigante':'disc','Disco de Energía':'disc','Lluvia de Kienzan':'disc','Donut Galáctico':'disc',
 'Makankosappo':'spiral','Hellzone Grenade':'hellzone','Espada Espiritual':'sword','Shining Sword Attack':'sword','Espada Brave':'sword','Guadaña Divina':'sword','Hoz Divina':'sword',
 'Ráfaga Meteoro':'rain','Ráfaga Fusionada':'rain','Lluvia de Masenko':'rain','Lluvia de Balas de Ki':'rain','Lanzas Divinas':'rain','Lluvia de Espadas':'rain','Ráfaga Final':'rain','Justice Flash':'rain',
 'Genkidama':'genki','Soul Punisher':'soul','Quebrantador de Espíritu':'soul','Mirada del Poder':'glare','Barrera Explosiva':'barrier','Lluvia de Meteoros':'meteors'};
const TECH_EXTRA={'Lluvia de Kienzan':{n:4},'Kienzan Gigante':{size:2.4},'Death Beam':{thin:1},'Rayo Mortal':{thin:1},'Esfera de Destrucción':{size:.7},'Esferas de Destrucción':{n:3,size:.6},'Guadaña Divina':{scythe:1},'Hoz Divina':{scythe:1},'Final Flash':{w:1.5},'Espada Brave':{steel:1},'Shining Sword Attack':{steel:1}};
function retypeTechs(){const fix=t=>{if(!t)return;const ty=TECH_TYPES[t.name];if(ty)t.type=ty;Object.assign(t,TECH_EXTRA[t.name]||{});};
 for(const c of CHARS){fix(c.s1);fix(c.s2);fix(c.ult);}for(const t of TECHS)fix(t);}
const MV_SPIN=[];
function glowSprite(col,s){const g=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:col,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));g.scale.setScalar(s);return g;}
function hakaiMesh(col){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.SphereGeometry(1,20,14),new THREE.MeshBasicMaterial({color:0x14001e})));
 const sh=new THREE.Mesh(new THREE.SphereGeometry(1.08,20,14),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(sh);g.add(glowSprite(col,4.2));
 for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1.35+i*.12,.025,6,40),new THREE.MeshBasicMaterial({color:i?0x3a0050:0xd080ff,transparent:true,opacity:.8}));r.rotation.set(rand(0,3),rand(0,3),0);g.add(r);}
 MV_SPIN.push({m:g,ax:'y',s:2.5});return g;}
function discMesh(col){const g=new THREE.Group();const d=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.06,32),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(d);
 const e=new THREE.Mesh(new THREE.TorusGeometry(1,.06,6,40),new THREE.MeshBasicMaterial({color:0xffffff}));e.rotation.x=Math.PI/2;g.add(e);g.add(glowSprite(col,3));MV_SPIN.push({m:g,ax:'y',s:22});return g;}
function orbMesh(col,r){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(r*.55,1),new THREE.MeshBasicMaterial({color:0xffffff})));g.add(glowSprite(col,r*3.2));return g;}
function rockMesh(){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.DodecahedronGeometry(.9,0),new THREE.MeshLambertMaterial({color:0x5a3a2a,emissive:0x401000})));g.add(glowSprite(0xff7a2a,3.4));MV_SPIN.push({m:g,ax:'x',s:3});return g;}
const tgtOf=f=>f.opp&&f.opp.state!=='ko'?f.opp:null;
const MOVE3={
 hakai(f,dt,sp,s,fwd){const R=s.size??(sp.isU?2.2:1.3);
  if(sp.phase==='charge'){sp.pose='blastR';if(!sp.m){sp.m=hakaiMesh(s.color);fxGroup.add(sp.m);}const k=Math.min(1,sp.t/.7);sp.m.position.copy(f.hand(1)).addScaledVector(fwd,.6);sp.m.scale.setScalar(R*k+.05);
   if(Math.random()<.6){const p=sp.m.position.clone().add(rndDir().multiplyScalar(2.5));spawn({pos:p,vel:sp.m.position.clone().sub(p).multiplyScalar(3),color:0x8a2aff,size:.35,life:.3});}
   if(sp.t>=.7){const n=s.n||1;for(let i=0;i<n;i++){const m=i?hakaiMesh(s.color):sp.m;if(i){m.scale.setScalar(R);fxGroup.add(m);}const from=sp.m.position.clone().add(V3(rand(-1,1),rand(-.5,1),rand(-1,1)).multiplyScalar(i?1.5:0)),t=tgtOf(f),v=(t?t.chest():from.clone().addScaledVector(fwd,10)).sub(from).normalize().multiplyScalar(sp.isU?20:26);
    projs.push(newProj(f,from,v,{kind:'ball',base:(s.pow??(sp.isU?2900:1400))/n,color:0xb040ff,r:R,homing:1.3,isU:sp.isU,full:sp.full,mesh:m}));}sp.m=null;sp.phase='throw';sp.t=0;sfx('beamFire');}}
  else{sp.pose='throw';if(sp.t>.3)f.sp=null;}},
 disc(f,dt,sp,s,fwd){const R=s.size??(sp.isU?2.2:1.1),n=s.n||1;
  if(sp.phase==='charge'){sp.pose='raise';if(!sp.m){sp.m=discMesh(s.color);fxGroup.add(sp.m);sfx('beamCharge',.6);}const k=Math.min(1,sp.t/.6);sp.m.position.copy(f.pos).add(V3(0,(2.1+R*.3)*f.sy(),0));sp.m.scale.set(R*k+.05,1,R*k+.05);
   if(sp.t>=.6){for(let i=0;i<n;i++){const m=i?discMesh(s.color):sp.m;if(i){m.scale.set(R,1,R);fxGroup.add(m);}const t=tgtOf(f),from=sp.m.position.clone().add(V3((i-(n-1)/2)*1.8,0,0)),v=(t?t.chest():from.clone().addScaledVector(fwd,10)).sub(from).normalize().multiplyScalar(46);
    projs.push(newProj(f,from,v,{kind:'disc',base:(s.pow??(sp.isU?2600:1300))/Math.sqrt(n),color:s.color,r:R*.8,homing:1.6,isU:sp.isU,full:sp.full,mesh:m}));}sp.m=null;sp.phase='throw';sp.t=0;sfx('blast');}}
  else{sp.pose='throw';if(sp.t>.3)f.sp=null;}},
 spiral(f,dt,sp,s){sp.s=Object.assign({},s,{type:'beam',thin:1,w:.3,spiral:1});sp.dur=sp.isU?1.3:.8;sp.t=0;sp.pose='beamCharge';},
 sword(f,dt,sp,s,fwd){const t=tgtOf(f);
  if(!sp.m){const col=s.steel?0xdfe8f0:s.color;const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(.06,s.scythe?.7:1.05,.12),new THREE.MeshBasicMaterial({color:s.steel?0xe8f0f8:0xffffff}));b.position.y=-.55;g.add(b);
   if(!s.steel){const gl=new THREE.Mesh(new THREE.BoxGeometry(.16,s.scythe?.8:1.2,.22),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));gl.position.y=-.58;g.add(gl);}
   if(s.scythe){const h=new THREE.Mesh(new THREE.TorusGeometry(.4,.05,6,16,Math.PI*.8),new THREE.MeshBasicMaterial({color:col}));h.position.y=-.9;h.rotation.z=Math.PI*.6;g.add(h);}
   g.position.y=-.22;f.model.J.elR.add(g);sp.m=g;sp.phase='dash';sp.t=0;sfx('tele');}
  if(sp.phase==='dash'){sp.pose='fly';if(!t){sp.phase='end';sp.t=0;return;}const to=t.chest().sub(f.chest()),d=to.length();f.pos.addScaledVector(to.normalize(),Math.min(d,70*dt));spawn({pos:f.hand(1),color:s.color,size:.7,life:.2});
   if(d<2.2+f.reach()){sp.phase='slash';sp.t=0;sp.n=0;}else if(sp.t>.7){sp.phase='end';sp.t=0;}return;}
  if(sp.phase==='slash'){sp.pose=['punchR','uppercut','punchR'][sp.n]||'punchR';const hits=sp.isU?4:3;
   if(sp.t>=.12&&sp.n<hits){sp.t=0;sp.n++;if(t&&t.pos.distanceTo(f.pos)<4.5+f.reach()){applyHit(f,t,{kind:sp.isU?'ult':'special',base:(s.pow??(sp.isU?2600:1300))/hits,knock:sp.n===hits?24:0,up:.25,stun:.3,full:sp.full});
     const c=t.chest();for(let i=0;i<10;i++)spawn({pos:c.clone().add(rndDir().multiplyScalar(.4)),vel:rndDir().multiplyScalar(10),color:s.color,size:.35,life:.25});ring(c,s.color,2.2,.2,false,.12);}}
   if(sp.n>=hits&&sp.t>.15){sp.phase='end';sp.t=0;}return;}
  sp.pose='idle';if(sp.t>.15){f.model.J.elR.remove(sp.m);f.sp=null;}},
 rain(f,dt,sp,s,fwd){const N=sp.isU?40:26,D=1.1;sp.pose=sp.t<.2?'raise':(Math.floor(sp.t*12)%2?'blastR':'blastL');const n=Math.min(N,Math.floor(sp.t/D*N));
  const r=V3(-fwd.z,0,fwd.x);while(sp.fired<n){sp.fired++;const yaw=rand(-1.3,1.3),pitch=rand(.25,1.2),dir=fwd.clone().multiplyScalar(Math.cos(yaw)*Math.cos(pitch)).addScaledVector(r,Math.sin(yaw)*Math.cos(pitch)).add(V3(0,Math.sin(pitch),0)).normalize();
   const from=f.hand(sp.fired%2?1:-1);projs.push(newProj(f,from,dir.multiplyScalar(rand(34,42)),{kind:'blast',base:(s.pow??(sp.isU?110:80)),color:s.color,r:.6,homing:9,hd:.28}));if(sp.fired%3===0)sfx('blast');}
  if(sp.t>=D+.15)f.sp=null;},
 hellzone(f,dt,sp,s){const t=tgtOf(f),N=sp.isU?16:10;if(!sp.orbs)sp.orbs=[];
  if(sp.phase==='charge'){sp.pose=Math.floor(sp.t*10)%2?'blastR':'blastL';const n=Math.min(N,Math.floor(sp.t/1.1*N));
   while(sp.orbs.length<n&&t){const a=sp.orbs.length/N*TAU*1.6,y=rand(-1,2.5),m=orbMesh(s.color,.45);m.position.copy(t.chest()).add(V3(Math.cos(a)*6,y,Math.sin(a)*6));fxGroup.add(m);sp.orbs.push(m);sfx('blast');}
   if(sp.t>=1.25){for(const m of sp.orbs){const tt=tgtOf(f),v=(tt?tt.chest():m.position.clone()).sub(m.position).normalize().multiplyScalar(36);projs.push(newProj(f,m.position.clone(),v,{kind:'blast',base:(s.pow??(sp.isU?240:150)),color:s.color,r:.45,homing:4,mesh:m}));}
    sp.orbs=[];sp.phase='go';sp.t=0;pop(f,'¡HELLZONE!','#'+s.color.toString(16).padStart(6,'0'));}}
  else{sp.pose='raise';if(sp.t>.4)f.sp=null;}},
 genki(f,dt,sp,s){const R=sp.isU?6:3;
  if(sp.phase==='charge'){sp.pose='raise';if(!sp.m){sp.m=orbMesh(0xbfe8ff,R);sp.m.children[1].material.color.setHex(0x7ac8ff);fxGroup.add(sp.m);sfx('beamCharge',2);}const k=Math.min(1,sp.t/2);
   sp.m.position.copy(f.pos).add(V3(0,(2.5+R)*f.sy(),0));sp.m.scale.setScalar(k+.05);
   for(let i=0;i<3;i++){const p=sp.m.position.clone().add(rndDir().multiplyScalar(rand(20,45)));p.y=Math.max(p.y,sp.m.position.y-5);spawn({pos:p,vel:sp.m.position.clone().sub(p).multiplyScalar(1.6),color:0x9fe0ff,size:.35,life:.6});}
   if(sp.t>=2){const t=tgtOf(f),from=sp.m.position.clone(),v=(t?t.chest():from.clone().add(V3(0,0,10))).sub(from).normalize().multiplyScalar(15);sp.m.scale.setScalar(1);
    projs.push(newProj(f,from,v,{kind:'ball',base:(s.pow??3600),color:0x7ac8ff,r:R,homing:.8,isU:sp.isU,full:sp.full,mesh:sp.m}));sp.m=null;sp.phase='throw';sp.t=0;sfx('beamFire');game.shake=1;}}
  else{sp.pose='throw';if(sp.t>.4)f.sp=null;}},
 glare(f,dt,sp,s){const t=tgtOf(f);if(!sp.mark&&t){sp.mark=t.chest();ring(sp.mark,s.color,3,.45,false,.15);sfx('beamCharge',.45);}sp.pose='charge';
  if(sp.t>=.45&&!sp.done){sp.done=1;if(sp.mark){explosion(sp.mark,sp.isU?2.4:1.4,s.color,false);if(t&&t.chest().distanceTo(sp.mark)<3.5)applyHit(f,t,{kind:sp.isU?'ult':'special',base:s.pow??(sp.isU?2600:1300),knock:20,up:.4,stun:.3,full:sp.full});}}
  if(sp.t>=.65)f.sp=null;},
 barrier(f,dt,sp,s){const R=sp.isU?7:5;sp.pose='charge';if(!sp.m){sp.m=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),new THREE.MeshBasicMaterial({color:s.color,transparent:true,opacity:.4,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));fxGroup.add(sp.m);sfx('beamFire');}
  const k=Math.min(1,sp.t/.35);sp.m.position.copy(f.chest());sp.m.scale.setScalar(R*k+.1);sp.m.material.opacity=.45*(1-Math.max(0,sp.t-.35)/.4);
  if(sp.t>=.3&&!sp.done){sp.done=1;for(const e of enemiesOf(f))if(e.chest().distanceTo(f.chest())<R+1)applyHit(f,e,{kind:sp.isU?'ult':'special',base:s.pow??1200,knock:30,up:.3,stun:.3,full:sp.full});}
  if(sp.t>=.75){fxGroup.remove(sp.m);f.sp=null;}},
 /* 3.2: Quebrantador de Espíritu (Gogeta): esfera pequeña, multicolor y brillante, que estalla en arcoíris */
 soul(f,dt,sp,s,fwd){const R=sp.isU?.85:.6;
  if(sp.phase==='charge'){sp.pose='raise';if(!sp.m){sp.m=orbMesh(0xffffff,R);sp.m.userData.rainbow=1;fxGroup.add(sp.m);sfx('beamCharge',.8);}sp.m.position.copy(f.hand(1)).addScaledVector(fwd,.5).add(V3(0,.25,0));
   const k=Math.min(1,sp.t/.8);sp.m.scale.setScalar(.3+.7*k);soulTint(sp.m,sp.t);if(Math.random()<.7){const p=sp.m.position.clone().add(rndDir().multiplyScalar(1.6));spawn({pos:p,vel:sp.m.position.clone().sub(p).multiplyScalar(3),color:new THREE.Color().setHSL(Math.random(),1,.6).getHex(),size:.25,life:.3});}
   if(sp.t>=.8){const t=tgtOf(f),from=sp.m.position.clone(),v=(t?t.chest():from.clone().addScaledVector(fwd,10)).sub(from).normalize().multiplyScalar(30);
    projs.push(newProj(f,from,v,{kind:'ball',base:(s.pow??(sp.isU?3000:1500)),color:0xffffff,r:R,homing:2.5,isU:sp.isU,full:sp.full,mesh:sp.m,rainbow:1}));sp.m=null;sp.phase='throw';sp.t=0;sfx('beamFire');}}
  else{sp.pose='throw';if(sp.t>.35)f.sp=null;}},
 meteors(f,dt,sp,s){const t=tgtOf(f),N=sp.isU?12:7;sp.pose='raise';const n=Math.min(N,Math.floor(sp.t/1.2*N));
  while((sp.fired||0)<n&&t){sp.fired=(sp.fired||0)+1;const from=t.pos.clone().add(V3(rand(-9,9),rand(26,34),rand(-9,9))),v=t.chest().sub(from).normalize().multiplyScalar(34);projs.push(newProj(f,from,v,{kind:'ball',base:(s.pow??(sp.isU?3000:1400))/N*1.6,color:0xff7a2a,r:.9,homing:.5,mesh:(()=>{const m=rockMesh();fxGroup.add(m);return m;})()}));}
  if(sp.t>=1.4)f.sp=null;}};
function soulTint(m,t){const c=new THREE.Color().setHSL((t*1.6)%1,1,.62);if(m.children[1])m.children[1].material.color.copy(c);if(m.children[0])m.children[0].material.color.copy(c).lerp(new THREE.Color(0xffffff),.55);}
/* aros del Makankosappo y giro de discos y esferas */
let mvT=0;
function moveFxStep(dt){mvT+=dt;for(const p of projs)if(p.rainbow){soulTint(p.mesh,mvT+p.life);if(Math.random()<.8)spawn({pos:p.pos.clone().add(rndDir().multiplyScalar(p.r)),color:new THREE.Color().setHSL(Math.random(),1,.6).getHex(),size:.3,life:.25});}for(let i=MV_SPIN.length-1;i>=0;i--){const o=MV_SPIN[i];if(!o.m.parent&&o.seen){MV_SPIN.splice(i,1);continue;}if(o.m.parent)o.seen=1;o.m.rotation[o.ax]+=o.s*dt;}
 for(const b of beams){const sp=b.owner&&b.owner.sp;if(!b.alive||!sp||!sp.s||!sp.s.spiral||!b.head)continue;
  const n=V3(0,1,0);if(Math.abs(b.dir.y)>.9)n.set(1,0,0);const u=n.clone().cross(b.dir).normalize(),w=b.dir.clone().cross(u);
  for(let k=0;k<4;k++){const d=Math.random()*b.head,a=mvT*18+d*.9,p=b.origin.clone().addScaledVector(b.dir,d).addScaledVector(u,Math.cos(a)*.7).addScaledVector(w,Math.sin(a)*.7);spawn({pos:p,color:0xfff6a0,size:.35,life:.18});}
  if(Math.random()<dt*14){const m=new THREE.Mesh(new THREE.TorusGeometry(.75,.06,6,24),new THREE.MeshBasicMaterial({color:0xfff2a0,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));
   m.position.copy(b.origin).addScaledVector(b.dir,Math.random()*b.head);m.lookAt(m.position.clone().add(b.dir));fxGroup.add(m);rings.push({m,t:0,dur:.35,radius:1.3});}}}
/* 3.2: si un especial se corta (te golpean, acaba la pelea, cambias de mapa) sus esferas y cargas se borran: antes las del Hellzone se quedaban flotando para siempre */
function spMeshes(sp){const L=[];if(!sp)return L;for(const k in sp){const v=sp[k];if(v&&v.isObject3D)L.push(v);else if(Array.isArray(v))for(const x of v)if(x&&x.isObject3D)L.push(x);}return L;}
function cleanSp(sp){for(const m of spMeshes(sp))if(m.parent&&!projs.some(p=>p.mesh===m))m.parent.remove(m);}
function spWatch(f){if(f._spPrev&&f._spPrev!==f.sp)cleanSp(f._spPrev);f._spPrev=f.sp;}
retypeTechs();
