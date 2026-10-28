/* =========================================================
   KAIOKEN CLASH 3.0 — PASEO LIBRE POR EL PLANETA DE BILLS
   Sin objetivo fijo: exploras el planeta y te acercas a Vegeta, Broly, Whis, Cheelai, Goku o Bills.
   Con cada uno puedes saludar, comer juntos en la mesa o pedir un combate de entrenamiento (con Cheelai no se pelea).
   Si eliges a uno de ellos como luchador, en su lugar aparece otro compañero (Gohan).
   ========================================================= */
const CHEELAI={id:'cheelai',name:'Cheelai',era:'S',base:1e3,h:.82,hair:'a18',hairColor:0xf4f4f4,extras:['earrings'],ears:false,
 colors:{skin:0x7ad08a,top:0xf0f0f4,sleeve:0x7ad08a,pants:0x3a2a5a,belt:0x3a2a5a,boots:0xf0f0f4,glove:0x7ad08a,wrist:0x3a2a5a,ex1:0xffd23a,eye:0xffffff,pupil:0x6a3aa8},
 s1:{name:'—',type:'beam',color:0xffffff},ult:{name:'—',type:'ball',color:0xffffff},forms:[F('base','Base',1)]};
const ROAM_SPOTS={vegeta:[-22,12],broly:[-34,-24],cheelai:[-29,-19],whis:[10,-10],goku:[22,-22],bills:[33,9],gohan:[22,-22]};
const ROAM_TABLE=[30,16];
const ROAM_TALK={
 vegeta:{hi:['Hmph. ¿Vienes a entrenar o a perder el tiempo?','No te creas que me alegro de verte.'],eat:['Bulma dice que como más que Kakaroto. Mentira.','Esta carne está bien… para ser cocina de Whis.'],fight:'¿Un combate? Por fin dices algo sensato.',
  as:{goku:{hi:['Kakaroto. Esta vez no te dejaré ganar ni en el entrenamiento.']}}},
 broly:{hi:['…Hola.','Cheelai dice que debo saludar. Hola.'],eat:['Esto sabe mejor que los bichos del planeta Vampa.','…Más, por favor.'],fight:'Pelear… sí. Pero sin hacer daño, ¿verdad?'},
 cheelai:{hi:['¡Hola! Broly está aprendiendo a controlarse, ¿a que sí?','Este planeta es precioso, aunque el dios sea un gruñón.'],eat:['¡Hasta que por fin comemos algo decente!','Broly, no te lo comas todo de un bocado.'],fight:null},
 whis:{hi:['Ho, ho, ho. Llegas justo a tiempo para la merienda.','Tu postura ha mejorado. Un poco.'],eat:['Este pastel es de la Tierra. ¡Delicioso!','Comer bien también es entrenar, ¿lo sabías?'],fight:'Muy bien. Intenta tocarme, aunque sea una vez.'},
 goku:{hi:['¡Eh! ¿Te apuntas a entrenar?','¡Qué hambre tengo! ¿Comemos algo?'],eat:['¡Mmm! ¡Whis cocina de maravilla!','Una ración más y me pongo a entrenar, ¡lo prometo!'],fight:'¡Genial! ¡Vamos con todo!',
  as:{vegeta:{hi:['¡Vegeta! ¿Echamos un combate antes de comer?']}}},
 gohan:{hi:['Hola. Papá anda por aquí entrenando… como siempre.'],eat:['Videl me ha enseñado algunas recetas.'],fight:'Vale, pero no me pidas que me contenga.'},
 bills:{hi:['¿Qué quieres? Estaba durmiendo… otra vez.','Si me despiertas, que sea para comer.'],eat:['¡Pudin! ¡Por fin alguien con buen gusto!','Si se acaba el postre, destruyo algo.'],fight:'¿Pelear conmigo? Qué divertido. No te prometo nada.'}};
const ROAM={npcs:[],init:false,near:null,mode:null,lines:[],li:0,eatT:0,seat:null};
function roamCh(id){return id==='whis'?WHIS:id==='cheelai'?CHEELAI:CHARS[chIdx(id)];}
function freeRoamInit(){const p=game.f[0],b=game.f[1];ROAM.npcs=[];ROAM.init=true;ROAM.mode=null;lock3=false;syncLockBtn();document.body.classList.add('roam');
 const ids=['vegeta','broly','cheelai','whis','goku','bills'].map(id=>id===p.ch.id?(id==='goku'?'gohan':null):id).filter(Boolean);
 for(const id of ids){const ch=roamCh(id);if(!ch)continue;const m=makeModel(ch);applyFormModel(m,ch,ch.forms[0],0);const[x,z]=ROAM_SPOTS[id],g=world.groundY(x,z);m.root.position.set(x,g>-1e9?g:0,z);m.root.rotation.y=Math.atan2(-x,-z);m.target='idle';worldGroup.add(m.root);
  ROAM.npcs.push({id,ch,m,home:m.root.position.clone(),pose:'idle',t:rand(0,5)});}
 /* mesa baja con comida y cojines */
 const[tx,tz]=ROAM_TABLE,ty=world.groundY(tx,tz),T=new THREE.Group();T.position.set(tx,ty>-1e9?ty:0,tz);worldGroup.add(T);
 const top=new THREE.Mesh(new THREE.BoxGeometry(4.2,.18,2.2),WM(0xb07a4a));top.position.y=.62;T.add(top);for(const sx of[-1.8,1.8])for(const sz of[-.9,.9]){const l=new THREE.Mesh(new THREE.BoxGeometry(.16,.6,.16),WM(0x7a4a2a));l.position.set(sx,.3,sz);T.add(l);}
 const food=[[0xf0f0f0,.38,'plate'],[0xc0602a,.3,'meat'],[0xffd23a,.24,'pudding'],[0xff7aa0,.22,'cake'],[0xf0f0f0,.38,'plate'],[0x9ad04a,.26,'veg']];
 food.forEach(([c,r,k],i)=>{const x=-1.5+i*.6,z=i%2?.4:-.4;if(k==='plate'){const pl=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.9,.05,16),WM(c));pl.position.set(x,.74,z);T.add(pl);}else{const f=new THREE.Mesh(k==='pudding'?new THREE.CylinderGeometry(r*.8,r,r*1.2,12):new THREE.SphereGeometry(r,10,8),WM(c));f.position.set(x,.8+r*.5,z);T.add(f);}});
 for(const sx of[-1.2,1.2])for(const sz of[-1.7,1.7]){const cu=new THREE.Mesh(new THREE.BoxGeometry(.9,.42,.9),WM(sz<0?0xa04ad8:0xd06a3a));cu.position.set(sx,.21,sz);T.add(cu);}
 ROAM.table=T;ROAM.seats=[[-1.2,-1.7],[1.2,-1.7],[-1.2,1.7],[1.2,1.7]].map(([x,z])=>T.position.clone().add(V3(x,.42,z)));
 b.model.root.visible=false;b.invuln=1e9;
 roamUI('Pasea con <span class="k">WASD</span>/joystick · gira la cámara arrastrando · acércate a alguien para hablar');}
function roamUI(html,btns){let el=$('#roam');if(!el){el=document.createElement('div');el.id='roam';$('#hud').appendChild(el);}el.style.display=html?'block':'none';
 el.innerHTML=html?`<div class="rtxt">${html}</div>${btns?'<div class="rbtn">'+btns.map(([a,t])=>`<button class="btn sbtn" data-act="roamAct" data-arg="${a}">${t}</button>`).join('')+'</div>':''}`:'';}
function roamLines(n,kind){const T=ROAM_TALK[n.id]||{},me=game.f[0].ch.id,sp=T.as&&T.as[me]&&T.as[me][kind];return(sp||T[kind]||['…']).slice();}
function roamSay(n,lines,then){ROAM.mode='talk';ROAM.lines=lines;ROAM.li=0;ROAM.then=then;ROAM.talker=n;roamShowLine();}
function roamShowLine(){const n=ROAM.talker,l=ROAM.lines[ROAM.li];roamUI(`<b>${esc(n.ch.name.toUpperCase())}</b><br>${esc(l)}`,[['next','▶']]);}
function freeRoamStep(dt){if(!ROAM.init)freeRoamInit();const p=game.f[0],b=game.f[1];if(!p)return;
 b.pos.set(140,40,0);b.vel.set(0,0,0);b.model.root.visible=false;b.shadow.visible=false;
 for(const n of ROAM.npcs){n.t+=dt;const m=n.m,d=m.root.position.distanceTo(p.pos);
  if(ROAM.mode==='eat'&&ROAM.talker===n){}else{const near=d<9;if(near){const want=Math.atan2(p.pos.x-m.root.position.x,p.pos.z-m.root.position.z);m.root.rotation.y=angLerp(m.root.rotation.y,want,1-Math.exp(-5*dt));}
   n.pose=n.id==='bills'&&!near?'sit':near?(Math.floor(n.t/2.5)%3===2?'crossArms':'idle'):(Math.floor(n.t/4)%2?'stance':'idle');}
  m.target=n.pose;animateModel(m,dt,false);}
 if(ROAM.mode==='eat'){ROAM.eatT-=dt;const n=ROAM.talker,s=ROAM.seats;p.pos.copy(s[0]);p.vel.set(0,0,0);p.face=0;p.model.target=Math.floor(ROAM.eatT*1.6)%2?'eat':'eatB';
  n.m.root.position.copy(s[1]);n.m.root.rotation.y=0;n.pose=Math.floor(ROAM.eatT*1.6+1)%2?'eat':'eatB';
  if(ROAM.eatT<=0&&ROAM.li>=ROAM.lines.length-1){ROAM.mode=null;n.m.root.position.copy(n.home);roamUI('¡Qué bien sienta comer! (+5 🪙)');prog.coins+=5;prog.earned+=5;saveProg();}return;}
 if(ROAM.mode==='talk'){if(justPressed.has('Enter')||justPressed.has('KeyF'))ACTIONS.roamAct('next');return;}
 if(ROAM.mode==='menu'){if(justPressed.has('Escape'))ACTIONS.roamAct('bye');return;}
 const near=ROAM.npcs.filter(n=>n.m.root.position.distanceTo(p.pos)<4.2).sort((x,y)=>x.m.root.position.distanceTo(p.pos)-y.m.root.position.distanceTo(p.pos))[0]||null;
 if(near!==ROAM.near){ROAM.near=near;if(near)roamUI(`🗨 ${esc(near.ch.name)} · pulsa <span class="k">Enter</span> o toca HABLAR`,[['talk','🗨 HABLAR']]);else roamUI('');}
 if(near&&justPressed.has('Enter'))ACTIONS.roamAct('talk');}
Object.assign(ACTIONS,{roamAct:a=>{const n=ROAM.near||ROAM.talker;if(!n&&a!=='bye')return;
 if(a==='talk'){ROAM.mode='menu';ROAM.talker=n;const T=ROAM_TALK[n.id]||{};roamUI(`<b>${esc(n.ch.name.toUpperCase())}</b>`,[['hi','👋 SALUDAR'],['eat','🍖 COMER JUNTOS'],...(T.fight?[['fight','⚔ COMBATE']]:[]),['bye','✖ ADIÓS']]);n.pose='wave';sfx('sel');return;}
 if(a==='hi'){n.pose='wave';game.f[0].model.target='wave';roamSay(n,[roamLines(n,'hi')[Math.random()*roamLines(n,'hi').length|0]],()=>{ROAM.mode=null;ROAM.near=null;});return;}
 if(a==='eat'){const L=roamLines(n,'eat');ROAM.mode='eat';ROAM.talker=n;ROAM.lines=L;ROAM.li=0;ROAM.eatT=6;roamShowLine();sfx('ok');return;}
 if(a==='fight'){const T=ROAM_TALK[n.id];roamSay(n,[T.fight],()=>{game.crew='spar';game.sparId=n.id;roamEnd();$('#msg').classList.remove('show');startMatch();});return;}
 if(a==='next'){if(ROAM.li<ROAM.lines.length-1){ROAM.li++;roamShowLine();}else if(ROAM.mode==='eat'){roamUI('');}else{const t=ROAM.then;ROAM.mode=null;ROAM.near=null;roamUI('');if(t)t();}return;}
 if(a==='bye'){ROAM.mode=null;ROAM.near=null;roamUI('');}}});
function roamEnd(){ROAM.init=false;ROAM.npcs=[];ROAM.mode=null;ROAM.near=null;document.body.classList.remove('roam');roamUI('');}
/* combate pedido durante el paseo: con Whis o Bills solo esquivan y empujan; con los demás, sparring parejo */
function sparSetup(a,b){const id=game.sparId;if(id==='whis')return;const D=DIFFS[game.diff];
 if(id==='bills'){const B=new Fighter(1,Object.assign({},CHARS[chIdx('bills')],{evade:.72}),{role:'dummy',team:1});B.pushy=1.4;b.dispose();game.f[1]=B;a.opp=B;B.opp=a;return;}
 const v=new Fighter(1,chIdx(id),{role:'p',team:1,base:a.realPower()});v.cpu=true;v.cap=1.12;b.dispose();game.f[1]=v;a.opp=v;v.opp=a;}
