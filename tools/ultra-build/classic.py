# Kaioken Clash clásico (index.html): la v1.8 con todo el contenido de Ultra (luchadores, técnicas y tienda, mundos, habilidades),
# manteniendo el estilo chibi, el pixelado retro, la interfaz y la música chiptune. Sale en out/index.html; publish.py lo copia al repo.
import sys,re,os
D=os.path.dirname(os.path.abspath(__file__))+'/'
src=open(D+'base-1.8.html',encoding='utf8').read()
def rep(old,new,cnt=1):
    global src
    n=src.count(old)
    if n!=cnt: sys.exit('COUNT %d!=%d for: %s'%(n,cnt,old[:110]))
    src=src.replace(old,new)
rd=lambda f:open(D+f,encoding='utf8').read()
# ---- cabecera y versión
rep('KAIOKEN CLASH — prototipo jugable (fase 1)\n   1v1 local · 3 mundos · 13 luchadores · poder realista','KAIOKEN CLASH 3.0 — versión retro (chibi), 3D libre\n   Modo historia «Junto a Goku» · 33 luchadores · 5 mundos + planeta de Bills')
rep('const APP=Object.freeze({version:"1.8.0",build:"2026-10-18",updateUrl:"",storeUrl:""});','const APP=Object.freeze({version:"3.0.0",build:"2026-10-28",updateUrl:"",storeUrl:""});')
# ---- luchadores, formas y técnicas (los mismos datos que Ultra)
src,n=re.subn(r"(F\('ui','Ultra Instinto dominado',300000,\{era:'S',cost:7,)dur:25,hpReq:\.3,",r"\1",src);assert n==3,n
rep("forms:[F('base','Base',1,{era:'S',aura:0xb070ff}),F('god','Poder divino',3,{era:'S',cost:4,drain:.012,aura:0x9a50ff,auraOn:1}),\n  F('serious','Destrucción total',5,{era:'S',cost:6,drain:.02,aura:0x7a30ff,auraOn:1,bolt:1})]},\n];",
 "forms:[F('base','Base',1,{era:'S',aura:0xb070ff}),F('god','Poder divino',3,{era:'S',cost:4,drain:.012,aura:0x9a50ff,auraOn:1}),\n  F('serious','Destrucción total',5,{era:'S',cost:6,drain:.02,aura:0x7a30ff,auraOn:1,bolt:1})]},\n];\n"+rd('chars18.js').replace('const TECHS=[','const OLD_TECHS=[ /* técnicas genéricas anteriores a la 2.0: solo para devolver sus monedas */')
 +"\n/* clásico: los Gamma con su peinado chibi */\nCHARS.find(c=>c.id==='gamma1').hair='gamma1';CHARS.find(c=>c.id==='gamma2').hair='gamma2';\n"+rd('plus-data.js')+rd('plus-data3.js'))
rep("{id:'train',name:'Entrenamiento',desc:'El rival se queda quieto. Practica combos, formas y especiales.'}","{id:'train',name:'Entrenamiento',desc:'En el planeta de Bills, con Whis de maestro. Él no ataca y esquiva como el Ultra Instinto dominado.'}")
# ---- modelo chibi: piezas nuevas, número en el pecho y altura canónica
rep("function setExtras(model,list){",rd('classic-model.js')+"function setExtras(model,list){")
# 2.2: puntas de pelo afiladas por peinado (HAIR[x].tip)
rep("function hairLock(r,len){const pts=[],rt=r*.32;","function hairLock(r,len,tk){const pts=[],rt=r*(tk||.32);")
rep("addPart(hairLock(s[6]*1.35,s[5]),mat","addPart(hairLock(s[6]*1.35,s[5],H.tip),mat")
rep("for(const e of list){","for(const e of list){\n  chibiExtras(model,e,add,cone);")
rep("const model={root,body,J,M,mats,hairStyle:null","if(ch.chestNum){const e=new THREE.Mesh(new THREE.PlaneGeometry(.1,.1),new THREE.MeshBasicMaterial({map:numTex(ch.chestNum),transparent:true}));e.position.set(.1,.33,.19);e.rotation.y=.3;J.torso.add(e);}\n const model={root,body,J,M,mats,hairStyle:null")
rep("const s=f.scale||ch.scale||[1,1,1];model.body.scale.set(s[0],s[1],s[2]);","const s=f.scale||ch.scale||[1,1,1],Hh=ch.h||1;model.body.scale.set(s[0]*Hh,s[1]*Hh,s[2]*Hh);")
# ---- poses de esquiva, patada alta y cansancio
rep("POSES.punchL=mirrorPose(POSES.punchR);POSES.blastL=mirrorPose(POSES.blastR);","""POSES.punchL=mirrorPose(POSES.punchR);POSES.blastL=mirrorPose(POSES.blastR);
Object.assign(POSES,{
 kickHigh:{torso:[-.2,.4,-.35],head:[.1,-.3,.2],shL:[-.6,0,.8],elL:[-1.2,0,0],shR:[-1.2,0,-.5],elR:[-1.8,0,0],hipL:[-1.5,0,.9],knL:[.2,0,0],hipR:[.1,0,-.05],knR:[.25,0,0]},
 dodgeL:{torso:[.1,0,.45],head:[0,0,-.25],shL:[-1.2,0,.6],elL:[-1.8,0,0],shR:[-1.3,0,-.2],elR:[-1.9,0,0],hipL:[-.2,0,.35],knL:[.6,0,0],hipR:[-.1,0,.1],knR:[.4,0,0]},
 sway:{torso:[-.5,0,0],head:[.35,0,0],shL:[-1.3,0,.45],elL:[-1.9,0,0],shR:[-1.2,0,-.45],elR:[-1.9,0,0],hipL:[.15,0,.08],knL:[.6,0,0],hipR:[-.35,0,-.08],knR:[.5,0,0]},
 duck:{torso:[.75,0,0],head:[-.6,0,0],shL:[-1.6,0,.3],elL:[-1.8,0,0],shR:[-1.5,0,-.3],elR:[-1.9,0,0],hipL:[-1.3,0,.12],knL:[1.9,0,0],hipR:[-.5,0,-.12],knR:[1.6,0,0]},
 tired:{torso:[.55,0,0],head:[-.35,0,0],shL:[-.5,0,.18],elL:[-.5,0,0],shR:[-.5,0,-.18],elR:[-.5,0,0],hipL:[-.55,0,.1],knL:[.8,0,0],hipR:[-.25,0,-.1],knR:[.6,0,0]}});
POSES.dodgeR=mirrorPose(POSES.dodgeL);""")
rep("const SNAPPY=new Set(['punchR','punchL','kick','uppercut','blastR','blastL','beamFire','throw','hit','knock','windup']);","const SNAPPY=new Set(['punchR','punchL','kick','kickHigh','uppercut','blastR','blastL','beamFire','throw','hit','knock','windup','dodgeL','dodgeR','sway','duck']);")
rep("model.t+=dt;const P=POSES[model.target]||POSES.idle,br=Math.sin(model.t*2.2)*.035;","model.t+=dt;const P=POSES[model.target]||POSES.idle,fat=model.fatigue||0,br=Math.sin(model.t*(2.2+fat*3.4))*(.03+fat*.06),sl=(model.slump||0)+fat*.22;")
rep("model.J[j].rotation.set(c[0]+(j==='torso'?br:j==='head'?-br*.6:(j==='shL'||j==='shR')?br*.8:0),c[1],c[2]);}",
    "model.J[j].rotation.set(c[0]+(j==='torso'?br+sl*.55:j==='head'?-br*.6-sl*.3:(j==='shL'||j==='shR')?br*.8+sl*.4:0),c[1],c[2]);}")
# ---- audio chiptune: sonidos y pistas de los mundos nuevos (sin voces: el clásico no habla)
rep(" case'back':tone('square',500,300,.08,.12);break;\n}}"," case'back':tone('square',500,300,.08,.12);break;\n case'dodge':noise(.18,.22,'bandpass',2000,450,0,null,1.2);break;\n case'absorb':noise(.25,.18,'bandpass',600,1800,0,null,5);tone('square',300,900,.25,.05);break;\n case'shard':tone('triangle',3200,1800,.25,.18);noise(.3,.3,'highpass',5000,3000);break;\n}}\nfunction vox(){}function setHum(){}")
rep("const music={track:null,step:0,next:0,intense:false};","""TRACKS.kaio={bpm:118,bass:TRACKS.earth.bass.map(n=>n+2),lead:TRACKS.menu.lead.map(n=>n&&n+2)};
TRACKS.broken={bpm:172,bass:TRACKS.void.bass.map(n=>n+1),lead:TRACKS.void.lead.map(n=>n&&n+1)};
TRACKS.bills={bpm:100,bass:TRACKS.namek.bass.map(n=>n+3),lead:TRACKS.namek.lead.map(n=>n&&n+3)};
const music={track:null,step:0,next:0,intense:false};""")
# ---- mundos nuevos: Planeta de Kaiosama, Dimensión rota y Planeta de Bills (entrenamiento); materiales planos de estilo retro
rep("const WORLDS=[{name:'Tierra'","function phong(o){const p=Object.assign({shininess:0},o);delete p.roughness;delete p.metalness;return new THREE.MeshPhongMaterial(p);}\n"+rd('worlds.js')+"const WORLDS=[{name:'Tierra'")
rep("vars:['Torneo intacto','Arena en ruinas'],build:buildVoid,music:'void'}];","""vars:['Torneo intacto','Arena en ruinas'],build:buildVoid,music:'void'},
 {name:'Planeta de Kaiosama',desc:'El diminuto planeta del Kaio del Norte: el horizonte se curva bajo tus pies y su gravedad x10 cansa el doble.',vars:['Día','Atardecer dorado'],build:buildKaio,music:'kaio'},
 {name:'Dimensión rota',desc:'El espacio que Gogeta y Broly hicieron pedazos. No hay suelo: se pelea flotando entre fragmentos de realidad.',vars:['Fractura','Colapso (fragmentos que golpean)'],build:buildBroken,music:'broken'}];
const curWorldDef=()=>game.mode==='train'?TRAIN_WORLD:WORLDS[game.world];""")
rep("const TOUCH_MODES=['cpu','boss','coopcpu','2v1cpu','2v1amigo','1v2','royale'];","const TOUCH_MODES=['cpu','boss','coopcpu','2v1cpu','2v1amigo','1v2','royale','train'];")
# ---- progreso: técnicas compradas y equipadas
rep("const d={coins:0,own:{},day:'',wins:0,earned:0,nick:''};","const d={coins:0,own:{},day:'',wins:0,earned:0,nick:'',tech:[],eq:{}};")
rep("d.own[k]=[...new Set(p.own[k].filter(n=>Number.isInteger(n)&&n>=0&&n<40))];return d;}","""d.own[k]=[...new Set(p.own[k].filter(n=>Number.isInteger(n)&&n>=0&&n<40))];
 cleanPlus(p,d);
 if(p.eq&&typeof p.eq==='object')for(const k in p.eq){const e=p.eq[k];if(!/^[a-z0-9]{1,16}$/.test(k)||!e||typeof e!=='object')continue;const o={};for(const s of['s1','ult'])if(typeof e[s]==='string'&&(d.sig.includes(e[s])||d.tech.includes(e[s])))o[s]=e[s];d.eq[k]=o;}
 return d;}""")
rep("const body={coins:prog.coins,own:prog.own,day:prog.day,wins:prog.wins,earned:prog.earned,nick:prog.nick,t:Date.now()};","const body=Object.assign({},prog,{t:Date.now()}); /* 2.0: la partida completa */")
rep("function buyForm(ch,i){","""const ownsTech=id=>prog.sig.includes(id);
function buyTech(t){if(ownsTech(t.id)||prog.coins<t.price)return false;prog.coins-=t.price;prog.sig.push(t.id);checkAchs();const cid=CHARS[shopChar].id;if(t.who.includes(cid))(prog.eq[cid]=prog.eq[cid]||{})[t.slot]=t.id;saveProg();return true;}
function buyForm(ch,i){""")
rep("let lockMsg='',shopChar=0,shopConfirm=-1;","let lockMsg='',shopChar=0,shopConfirm=-1,shopTab='forms';")
# ---- Gigante de Luz: avatar de aura translúcido
rep("/* ---------------- Luchadores ---------------- */","""/* Gigante de Luz: avatar de aura celeste translúcido (fresnel + ki que fluye hacia arriba) */
const GHOST_MAT=new THREE.ShaderMaterial({uniforms:{uT:{value:0},uC:{value:new THREE.Color(0x7fe0ff)}},
 vertexShader:`varying vec3 vN;varying vec3 vV;varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vec4 mv=viewMatrix*w;vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
 fragmentShader:`uniform float uT;uniform vec3 uC;varying vec3 vN;varying vec3 vV;varying vec3 vW;void main(){float f=1.0-abs(dot(normalize(vN),normalize(vV)));float flow=.5+.5*sin(vW.y*1.3-uT*6.0+sin(vW.x*.7+uT)*2.0);float a=.07+pow(f,2.2)*.6+flow*.06;vec3 c=mix(uC,vec3(1.0),pow(f,3.0)*.6+flow*.1);gl_FragColor=vec4(c*a,1.0);}`,
 transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
/* ---------------- Luchadores ---------------- */""")
# ---- Fighter: vida por forma, cansancio, drenaje, técnicas equipadas, esquivas reales, golpes en ráfaga y absorción
rep('this.maxHp=o.maxHp||MAXHP;','this.maxHp=this.baseMaxHp=o.maxHp||MAXHP;this.avatar=null;this.fatigue=0;this.drained=0;this.absorbMul=1;this.collapseT=0;')
rep('dispose(){scene.remove(this.model.root);','dispose(){this.dropAvatar();scene.remove(this.model.root);')
rep('this.falling=false;this.fightT=0;this.applyForm();this.model.root.scale.setScalar(this.giant);}','this.falling=false;this.fightT=0;this.fatigue=0;this.drained=0;this.absorbMul=1;this.collapseT=0;this.applyForm();this.hp=this.maxHp;this.model.root.scale.setScalar(this.form.lightGiant?1:this.giant);}')
rep('applyForm(){this.giant=this.giant0*(this.form.giant||1);applyFormModel(this.model,this.ch,this.form,this.torn);this.aura.setColor(this.form.aura);if(game.phase)hudPortrait(this);}',
"""applyForm(){const f=this.form;applyFormModel(this.model,this.ch,f,this.torn);this.aura.setColor(f.aura);
  const nm=this.baseMaxHp*(f.hpMax||1);if(nm!==this.maxHp){this.hp=this.hp*nm/this.maxHp;this.maxHp=nm;}
  this.giant=this.giant0*(f.giant||1);if(f.lightGiant)this.makeAvatar();else this.dropAvatar();
  if(game.phase)hudPortrait(this);}
 makeAvatar(){if(this.avatar)return;const m=makeModel(this.ch);applyFormModel(m,this.ch,this.form,0);m.root.traverse(o=>{if(o.isMesh){if(o.material===OUTLINE)o.visible=false;else{o.material=GHOST_MAT;o.castShadow=false;}}});m.root.scale.copy(this.model.root.scale);scene.add(m.root);this.avatar=m;}
 dropAvatar(){if(!this.avatar)return;scene.remove(this.avatar.root);disposeModel(this.avatar);this.avatar=null;}
 tire(v){if(this.role==='p'&&!this.ch.android)this.fatigue=Math.min(1,this.fatigue+v*(world&&world.gravity||1));}
 /* Técnica equipada en la tienda (solo jugadores locales; online y CPU usan las de serie) */
 tech(which){const def=which==='ult'?this.ch.ult:this.ch.s1;if(this.role!=='p'||this.cpu||this.remote||game.online)return def;const id=(prog.eq[this.ch.id]||{})[which],t=id&&TECHS.find(x=>x.id===id);return t&&t.who.includes(this.ch.id)&&ownsTech(t.id)?t:def;}""")
rep("if(this.ch.brolyPassive&&this.role!=='boss')m*=1+this.brolyK()*.4;return this.base*m;}","if(this.ch.brolyPassive&&this.role!=='boss')m*=1+this.brolyK()*.4;if(f.collapse)m*=Math.max(.45,1-this.collapseT*.012);return this.base*m*(this.absorbMul||1);}")
rep('spd(){return clamp(Math.pow(this.power()/this.opp.power(),.25),.6,2.5);}','spd(){return clamp(Math.pow(this.power()/this.opp.power(),.25),.6,2.5)*(1-.3*this.fatigue)*(1-.3*this.drained);}')
rep("sfx('transform',this.transDur);","sfx('transform',this.transDur);this.tire(.1);")
rep("doSpecial(which){const s=which==='ult'?this.ch.ult:this.ch.s1;const cost=which==='ult'?4:s.type==='barrage'?1:2;","doSpecial(which){const s=this.tech(which);const cost=s.ki??(which==='ult'?4:s.type==='barrage'?1:2);")
rep("""this.sp={s,type:s.type,isU,full,t:0,phase:'charge',dur:s.type==='beam'?(isU?1.2:.55):s.type==='ball'?(isU?1.4:.6):.9,fired:0};
  this.setState('special');pop(this,s.name+'!',hex(s.color),isU);""","""this.sp={s,type:s.type,isU,full,t:0,phase:'charge',dur:s.type==='beam'?(isU?1.2:.55):s.type==='ball'?(isU?1.4:.6)*((s.size||0)>3?1.4:1):s.type==='absorb'?1.5:s.type==='rush'?.3:.9,fired:0};
  this.setState('special');pop(this,s.name+'!',hex(s.color),isU);this.tire(isU?.14:.07);""")
rep("""   if(f.dur){this.formT-=dt;if(this.formT<=0)this.dropForm('Fin del Ultra Instinto');}""","""   if(f.dur){this.formT-=dt;if(this.formT<=0)this.dropForm('Fin del Ultra Instinto');}
   if(f.collapse)this.collapseT+=dt;
   /* cansancio: sube al atacar y esquivar, baja al respirar (quieto o en guardia). Los androides no se cansan */
   if(this.role==='p'&&!this.ch.android){const busy=['attack','heavy','rush','special','dodge','transform'].includes(this.state),rec=this.state==='charge'?.04:busy?0:.11;
    this.fatigue=clamp(this.fatigue-rec*dt+(this.ki<.5?.03*dt:0),0,1);
    if(this.fatigue>.6&&game.phase==='fight'){if(!this.tiredShown){this.tiredShown=true;pop(this,'CANSADO','#ffb070');}}else if(this.fatigue<.4)this.tiredShown=false;}
   if(this.drained>0)this.drained=Math.max(0,this.drained-.03*dt);
   /* Moro: cuanto más drena al rival, más se acerca a su poder */
   if(this.ch.moro&&op){const own=this.base*f.mult,rp=op.realPower();this.absorbMul=lerp(1,rp>own?rp*.85/own:1.25,op.drained);}""")
rep("this.model.smear=1/12;this.model.smearSide='R';sfx('swing');","this.model.smear=1/12;this.model.smearSide='R';sfx('swing');this.tire(.05);")
rep("  case'hit':pose='hit';","  case'dodge':pose=this.dodgePose||'dodgeL';this.vel.multiplyScalar(Math.max(0,1-5*dt));if(this.stT<=0)this.setState('idle');break;\n  case'hit':pose='hit';")
rep("if(this.state!=='knock'&&this.state!=='ko'&&this.state!=='hit'){this.vel.lerp(wantVel,1-Math.exp(-10*dt));}","if(this.state!=='knock'&&this.state!=='ko'&&this.state!=='hit'&&this.state!=='dodge'){this.vel.lerp(wantVel,1-Math.exp(-10*dt));}")
rep("if(this.pos.y>world.maxY){this.pos.y=world.maxY;this.vel.y=Math.min(0,this.vel.y);}","if(this.pos.y>world.maxY){this.pos.y=world.maxY;this.vel.y=Math.min(0,this.vel.y);}\n  if(world.minY!=null&&this.pos.y<world.minY){this.pos.y=world.minY;this.vel.y=Math.max(0,this.vel.y);}")
rep("  this.model.target=pose;}","""  this.model.fatigue=this.fatigue;this.model.slump=this.form.slump||0;
  if(pose==='idle'&&this.fatigue>.82&&game.phase==='fight'&&this.state==='idle')pose='tired';
  this.model.target=pose;}""")
rep("startAttack(step){const poses=['punchR','punchL','kick','punchR','uppercut'];this.atk={step,t:0,dur:step===5?.38:.25,hitAt:step===5?.12:.07,pose:poses[step-1],done:false,queued:false};",
    "startAttack(step){const poses=['punchL','punchR','kick','kickHigh','uppercut'],sl=1+this.fatigue*.45;this.atk={step,t:0,dur:(step===5?.38:.25)*sl,hitAt:(step===5?.12:.07)*sl,pose:poses[step-1],done:false,queued:false};this.tire(.035);")
rep("""  this.vanishW=.12;if(this.ki>=.25){this.ki-=.25;const inp=this.inp;let d=fwd.clone().multiplyScalar(inp.mx);if(inp.up||inp.down)d.y=inp.up?1:-1;if(d.lengthSq()<.01)d.copy(right).multiplyScalar(Math.random()<.5?1:-1);d.normalize();
   afterimage(this);this.pos.addScaledVector(d,5);sfx('tele');}}""","""  /* esquiva real: paso lateral, inclinación hacia atrás o agacharse; hacia el rival se teletransporta */
  this.vanishW=.12;const inp=this.inp;let d=fwd.clone().multiplyScalar(inp.mx),side;if(inp.up||inp.down)d.y=inp.up?1:-1;
  if(d.lengthSq()<.01){side=Math.random()<.5?1:-1;d.copy(right).multiplyScalar(side);}else side=d.dot(right)>=0?1:-1;d.normalize();
  if(this.ki>=.25&&inp.mx>.3){this.ki-=.25;afterimage(this);this.pos.addScaledVector(d,5);sfx('tele');return;}
  this.startDodge(d,inp.mx<-.3?'sway':inp.down?'duck':side>0?'dodgeL':'dodgeR',20);}
 startDodge(dir,pose,speed=16){this.setState('dodge',.24);this.dodgePose=pose;this.vel.copy(dir).multiplyScalar(speed*clamp(this.spd(),.7,1.6));this.invuln=Math.max(this.invuln,.16);this.tire(.1);sfx('dodge');}""")
# especiales: parámetros de las técnicas de la tienda
rep("const origin=this.hand(0),dir=this.opp.chest().sub(origin).normalize();const w=s.thin?.22:sp.isU?1.15:.55;",
 "if(s.tele){const op=this.opp,fw=op.fwd(),r=V3(-fw.z,0,fw.x);afterimage(this);this.pos.copy(op.pos).addScaledVector(r,(Math.random()<.5?1:-1)*7).addScaledVector(fw,3);sfx('tele');}\n     const origin=this.hand(0),dir=this.opp.chest().sub(origin).normalize();const w=s.w??(s.thin?.22:sp.isU?1.15:.55);")
rep("base:sp.isU?2800:s.thin?1100:1400,","base:s.pow??(sp.isU?2800:s.thin?1100:1400),")
rep("const R=sp.isU?3.6:.9;","const R=s.size??(sp.isU?3.6:.9);")
rep("v=this.opp.chest().sub(from).normalize().multiplyScalar(sp.isU?24:32);","v=this.opp.chest().sub(from).normalize().multiplyScalar((sp.isU?24:32)*(s.spd||1));")
rep("base:sp.isU?2700:1300,","base:s.pow??(sp.isU?2700:1300),")
rep("else{sp.pose=(Math.floor(sp.t*10)%2)?'blastR':'blastL';","else if(s.type==='rush')this.updateRush(dt,sp,s);\n  else if(s.type==='absorb')this.updateAbsorb(dt,sp,s);\n  else{sp.pose=(Math.floor(sp.t*10)%2)?'blastR':'blastL';")
rep("this.fireBlast(s.color,sp.fired%2?1:-1,{base:110,homing:.8,speed:52});","this.fireBlast(s.color,sp.fired%2?1:-1,{base:s.pow??110,homing:.8,speed:52});")
rep(" render(dt,t){const m=this.model;",""" /* Técnicas de golpes (Puño del Dragón, Meteor Explosion…): carga, embestida y ráfaga de golpes */
 updateRush(dt,sp,s){const op=this.opp;
  if(sp.phase==='charge'){sp.pose='windup';if(Math.random()<.8)spawn({pos:this.chest(),vel:rndDir().multiplyScalar(3),color:s.color,size:.8,life:.25});if(sp.t>=sp.dur){sp.phase='dash';sp.t=0;sfx('tele');}return;}
  if(sp.phase==='dash'){sp.pose='fly';const to=op.chest().sub(this.chest()),d=to.length();this.pos.addScaledVector(to.normalize(),Math.min(d,75*dt));
   spawn({pos:this.chest(),color:s.color,size:s.dragon?3.2:1.4,life:s.dragon?.5:.22,op:.8});if(s.dragon&&Math.random()<.6)spawn({pos:this.chest().add(rndDir().multiplyScalar(1.2)),color:0xfff2a0,size:1.2,life:.4});
   if(d<2.4+this.reach()){sp.phase='hits';sp.t=0;sp.n=0;}else if(sp.t>.9)this.sp=null;return;}
  const N=s.hits||5,gap=.085;sp.pose=['punchR','punchL','kick','kickHigh','uppercut'][sp.n%5];
  if(sp.n<N&&sp.t>=gap*(sp.n+1)){sp.n++;const fin=sp.n===N,P=s.pow||2000,base=fin?P*.45:P*.55/Math.max(1,N-1);sfx('swing');
   applyHit(this,op,{base,kind:sp.isU?'ult':'special',knock:fin?30:0,up:fin?.6:.05,stun:.3,full:sp.full});sparks(op.chest(),s.color,8,10,.4);
   if(fin){explosion(op.chest(),s.dragon?3:1.8,s.color);if(s.dragon)for(let i=0;i<24;i++){const a=i/24*TAU*2;spawn({pos:op.chest().add(V3(Math.cos(a)*2,i*.35,Math.sin(a)*2)),color:0xffd040,size:2.2,life:.9});}}}
  if(sp.n>=N&&sp.t>gap*N+.3)this.sp=null;}
 /* Moro: absorbe vida y ki del rival a distancia */
 updateAbsorb(dt,sp,s){const op=this.opp,d=this.pos.distanceTo(op.pos);sp.pose='blastR';sp.tick=(sp.tick??.25)-dt;
  if(d<16+this.reach()&&op.state!=='ko'&&sp.t>.2){const from=op.chest().add(rndDir().multiplyScalar(.6)),dir=this.hand(1).sub(from);for(let i=0;i<2;i++)spawn({pos:from.clone().addScaledVector(dir,Math.random()*.3),vel:dir.clone().multiplyScalar(2.2),color:Math.random()<.5?s.color:0xd8a0ff,size:rand(.3,.6),life:.45});
   if(sp.tick<=0){sp.tick=.2;absorbTick(this,op);sfx('absorb');}}
  if(sp.t>=sp.dur)this.sp=null;}
 render(dt,t){const m=this.model;""")
rep("{const cs=m.root.scale.x;if(Math.abs(cs-this.giant)>.002)m.root.scale.setScalar(lerp(cs,this.giant,1-Math.exp(-3.5*dt)));}","{const gT=this.form.lightGiant?1:this.giant,cs=m.root.scale.x;if(Math.abs(cs-gT)>.002)m.root.scale.setScalar(lerp(cs,gT,1-Math.exp(-3.5*dt)));}")
rep("m.speed=this.vel.length();animateModel(m,dt*(game.phase?game.timescale:1),false);\n","""m.speed=this.vel.length();animateModel(m,dt*(game.phase?game.timescale:1),false);
  const av=this.avatar;if(av){GHOST_MAT.uniforms.uT.value=t;{const cs=av.root.scale.x;av.root.scale.setScalar(lerp(cs,this.giant,1-Math.exp(-3.5*dt)));}av.speed=m.speed;av.root.position.copy(this.pos);av.root.rotation.y=this.face;av.root.rotation.x=m.root.rotation.x;av.target=m.target;animateModel(av,dt*(game.phase?game.timescale:1),false);
   m.root.position.copy(this.pos).add(V3(0,.8*this.giant-.7,0)).addScaledVector(this.fwd(),.1*this.giant);
   if(Math.random()<.4)spawn({pos:this.pos.clone().add(V3(rand(-1,1)*this.giant*.4,rand(0,1.4)*this.giant,rand(-1,1)*this.giant*.3)),vel:V3(0,rand(2,6),0),color:0x9fe8ff,size:rand(.6,1.6),life:.6,op:.6});}
""")
rep("function afterimage(f){","""function absorbTick(m,op){if(game.phase!=='fight'||op.invuln>0||op.state==='transform'||op.state==='ko')return;const g=op.state==='guard'?.4:1,amt=op.maxHp*.009*g;
 op.hp=Math.max(game.mode==='train'?1:0,op.hp-amt);op.noHitT=0;op.ki=Math.max(0,op.ki-.12*g);m.hp=Math.min(m.maxHp,m.hp+amt*.4);op.drained=Math.min(1,op.drained+.025*g);
 if(Math.random()<.25)pop(op,'−ENERGÍA','#b0ff8a');if(op.hp<=0)ko(op,m);else checkThresholds(op);}
function afterimage(f){""")
# ---- daño: esquiva del Ultra Instinto con movimiento real; Whis suelta sus frases
rep("if(dodge&&kind!=='ult'&&!game.struggle&&Math.random()<dodge){afterimage(def);const r=V3(-def.fwd().z,0,def.fwd().x);def.pos.addScaledVector(r,Math.random()<.5?2.5:-2.5);pop(def,'¡ESQUIVA!','#e8f0ff');sfx('tele');return false;}",
 """if(dodge&&kind!=='ult'&&!game.struggle&&Math.random()<dodge&&def.state!=='special'){const fw=def.fwd(),r=V3(-fw.z,0,fw.x),side=Math.random()<.5?1:-1,mode=Math.random(),ft=def.fatigue;
  afterimage(def);
  if(mode<.35)def.startDodge(fw.clone().multiplyScalar(-1),'sway',12);else if(mode<.55&&kind!=='blast')def.startDodge(V3(0,-1,0).addScaledVector(fw,-.3).normalize(),'duck',8);else{def.pos.addScaledVector(r,side*1.2);def.startDodge(r.multiplyScalar(side),side>0?'dodgeL':'dodgeR',16);}
  def.fatigue=ft;pop(def,def.ch.id==='whis'?WHIS_QUIPS[Math.random()*WHIS_QUIPS.length|0]:'¡ESQUIVA!','#e8f0ff');return false;}""")
rep("const R=att.power()/def.power();let dmg;","const R=def.role==='dummy'?1:att.power()/def.power();let dmg;")
rep("const cp=def.chest(),big=kind!=='light';","const cp=def.chest(),big=kind!=='light';def.tire(.02);")
# ---- proyectiles: fragmentos de la Dimensión rota
rep("const tgt=p.owner?p.owner.opp:null;","const tgt=p.target||(p.owner?p.owner.opp:null);")
rep("p.pos.addScaledVector(p.vel,dt);p.mesh.position.copy(p.pos);","p.pos.addScaledVector(p.vel,dt);p.mesh.position.copy(p.pos);\n  if(p.kind==='shard'){p.mesh.rotation.x+=dt*8;if(tgt&&tgt.state!=='ko'&&p.pos.distanceTo(tgt.chest())<1.4*tgt.giant+.4){envDamage(tgt,280,'¡FRAGMENTO!');sparks(p.pos,0xe0c8ff,12,12,.4);sfx('tink');fxGroup.remove(p.mesh);projs.splice(i,1);continue;}}")
# ---- cámara: luchadores gigantes (Moro terrestre, Gigante de Luz) en cualquier modo
rep("tp=f.pos.clone().addScaledVector(fw,-3).addScaledVector(rt,-1.5).add(V3(0,1.6*f.sy(),0));","tp=f.pos.clone().addScaledVector(fw,-3*f.giant).addScaledVector(rt,-1.5*f.giant).add(V3(0,1.6*f.sy(),0));")
rep("if(bossMode())mid.y+=b.giant*.5;","if(bossMode())mid.y+=b.giant*.5;else{const g=Math.max(a.giant,b.giant);if(g>1)mid.y+=g*.5;}")
rep("""if(bossMode()&&bossF()){const B=bossF(),bc=B.chest(),min=B.giant*4.5,dd=cam.position.distanceTo(bc);
  if(dd<min){let dir=cam.position.clone().sub(bc);if(dir.lengthSq()<1e-4){const [pa]=camAnchors();dir=pa.pos.clone().sub(bc);dir.y=Math.max(dir.y,0)+1;}dir.normalize();cam.position.copy(bc).addScaledVector(dir,min);}}""",
 """for(const B of game.f){if(B.giant<2)continue;const bc=B.chest(),min=B.giant*4.5,dd=cam.position.distanceTo(bc);
  if(dd<min){let dir=cam.position.clone().sub(bc);if(dir.lengthSq()<1e-4){const [pa]=camAnchors();dir=pa.pos.clone().sub(bc);dir.y=Math.max(dir.y,0)+1;}dir.normalize();cam.position.copy(bc).addScaledVector(dir,min);}}""")
# ---- aura proporcional al cuerpo (personajes grandes)
rep("const s=(.8+this.level*.5)*.8;this.group.scale.set(s,(.85+this.level*.35)*.75,s);",
    "const s=(.8+this.level*.5)*.8,bs=this.body?this.body.scale:null,bx=bs?Math.max(.6,(bs.x+bs.z)/2):1,by=bs?Math.max(.6,bs.y):1;this.group.scale.set(s*bx,(.85+this.level*.35)*.75*by,s*bx);this.bolts.scale.set(bx,by,bx);")
rep("this.aura.target=lv;","this.aura.body=this.model.body;this.aura.target=lv;")
# ---- HUD
rep("const i=f.idx,fr=Math.max(0,f.hp/f.maxHp);$('#hc'+i).style.width=(fr*100)+'%';$('#hc'+i).classList.toggle('low',fr<.25);$('#hl'+i).style.width=(fr*100)+'%';",
 "const i=f.idx,fr=Math.max(0,f.hp/f.maxHp),wr=Math.max(0,f.hp/Math.max(f.maxHp,f.baseMaxHp));$('#hc'+i).style.width=(wr*100)+'%';$('#hc'+i).classList.toggle('low',fr<.25);$('#hl'+i).style.width=(wr*100)+'%';")
rep("+(f.state==='ko'?' · FUERA':'');","+(f.fatigue>.6?(f.fatigue>.85?' · AGOTADO':' · CANSADO'):'')+(f.drained>.05?' · DRENADO '+Math.round(f.drained*100)+' %':'')+(f.state==='ko'?' · FUERA':'');")
rep("(f.role==='dummy'?' (MUÑECO)':","(f.role==='dummy'?' (MAESTRO)':")
rep("de daño · <b>${a.comboHits}</b> golpes<br>El muñeco se recupera solo y tu ki se recarga solo`;","de daño · <b>${a.comboHits}</b> golpes<br><b>Whis:</b> «${WHIS_TIPS[Math.floor(game.roundT/7)%WHIS_TIPS.length]}»`;")
# ---- partida
rep("world=WORLDS[game.world].build(game.variant);SUN_DIR.copy(sun.position).normalize();\n const M=game.mode,D=DIFFS[game.diff];","const M=game.mode,D=DIFFS[game.diff];world=curWorldDef().build(M==='train'?0:game.variant);SUN_DIR.copy(sun.position).normalize();")
rep("playTrack(WORLDS[game.world].music);startRound();}","playTrack(curWorldDef().music);startRound();}",2)
rep("const W=WORLDS[game.world].name;","const W=curWorldDef().name;")
rep("showMsg('ENTRENAMIENTO',game.f[0].ch.name+' vs muñeco: '+game.f[1].ch.name,1.1);","showMsg('ENTRENAMIENTO',game.f[0].ch.name+' entrena con Whis · Planeta de Bills',1.4);")
# ---- menús (mismos textos y botones del clásico; solo lo necesario para Whis, las esquivas y la tienda de técnicas)
rep("const p2Label=(short)=>game.mode==='train'?(short?'MUÑ':'MUÑECO'):","const p2Label=(short)=>game.mode==='train'?'WHIS':")
rep("['Teletransporte / esquiva','Y','O','Num6']","['Esquiva (de lado, atrás o abajo) · hacia el rival: teletransporte','Y','O','Num6']")
rep("['💨','Teletransporte / esquiva']","['💨','Esquiva de lado o hacia atrás; hacia el rival te teletransportas']")
rep("<button class=\"btn\" ${NOFOCUS} data-act=\"toState\" data-arg=\"world\">← VOLVER</button>`","<button class=\"btn\" ${NOFOCUS} data-act=\"toState\" data-arg=\"${game.mode==='train'?'chars':'world'}\">← VOLVER</button>`")
rep("'<br>6. Entrenamiento: el muñeco no ataca, se recupera solo y tu ki se recarga solo.'","'<br>6. Entrenamiento: Whis no ataca, esquiva como el Ultra Instinto dominado y tu ki se recarga solo.'")
rep("5. Con menos del 25 % de vida llega la Ira: tu siguiente especial atraviesa el muro de poder.${extra}","5. Con menos del 25 % de vida llega la Ira: tu siguiente especial atraviesa el muro de poder.<br>· Cansancio: atacar y esquivar sin parar te vuelve lento. Quédate quieto para respirar.${extra}")
rep("${cur[1]===i&&game.mode!=='boss'?","${cur[1]===i&&game.mode!=='boss'&&game.mode!=='train'?")
rep("const side=p=>{if(p&&game.mode==='boss')return'<b>JEFE</b><br>Lo eliges después de tu luchador.';","const side=p=>{if(p&&game.mode==='boss')return'<b>JEFE</b><br>Lo eliges después de tu luchador.';if(p&&game.mode==='train')return'<b>MAESTRO · WHIS</b><br>Poder 50 B. No ataca y esquiva como el Ultra Instinto dominado. Mide tus combos y te da consejos.';")
rep("const hint2=game.mode==='boss'?'':","const hint2=(game.mode==='boss'||game.mode==='train')?'':")
rep("pst=['char',game.mode==='boss'?'ready':'char'];","pst=['char',(game.mode==='boss'||game.mode==='train')?'ready':'char'];")
rep("if(pst[0]==='ready'&&pst[1]==='ready'){clearMenuModels();menuState=bossMode()?'boss':'world';}","if(pst[0]==='ready'&&pst[1]==='ready'){clearMenuModels();if(game.mode==='train'){openGuide('match');return;}menuState=bossMode()?'boss':'world';}")
rep("if(p&&game.mode==='boss'){if(mm)","if(p&&(game.mode==='boss'||game.mode==='train')){if(mm)")
rep("if(BACK.includes(code)){menuState='world';sfx('back');renderMenu();return;}","if(BACK.includes(code)){if(game.mode==='train'){menuState='chars';pst=['form','ready'];}else menuState='world';sfx('back');renderMenu();return;}")
rep("game.sel=[cur[0],cur[1]];game.startForm","game.sel=[cur[0],game.mode==='train'?WHIS:cur[1]];game.startForm")
rep("wsel=(wsel+2)%3;","wsel=(wsel+WORLDS.length-1)%WORLDS.length;")
rep("wsel=(wsel+1)%3;","wsel=(wsel+1)%WORLDS.length;")
rep("if(world&&world.wmat)world.wmat.uniforms.uT.value+=dt;","if(world&&world.wmat)world.wmat.uniforms.uT.value+=dt;if(world&&world.anim)world.anim(dt);")
rep("toState:a=>{if(a==='world'||a==='title'){menuState=a;renderMenu();}}","toState:a=>{if(a==='world'||a==='title'){menuState=a;renderMenu();}else if(a==='chars'){menuState='chars';pst=['form','ready'];renderMenu();}}")
rep("toggleMusic:()=>onKey('KeyM'),","""toggleMusic:()=>onKey('KeyM'),
 shopTab:a=>{if(a==='forms'||a==='tech'||a==='outfit'){shopTab=a;shopConfirm=-1;tryOutfit=null;outfitConfirm='';sfx('sel');renderMenu();}},
 buyTech:a=>{const t=TECHS.find(x=>x.id===a);if(!t||ownsTech(t.id))return;if(prog.coins<t.price){shopConfirm=-1;sfx('back');renderMenu();return;}if(shopConfirm!==t.id){shopConfirm=t.id;sfx('sel');renderMenu();return;}shopConfirm=-1;if(buyTech(t))sfx('ok');renderMenu();},
 equipTech:a=>{const[slot,id]=String(a).split(':');if(slot!=='s1'&&slot!=='ult')return;const cid=CHARS[shopChar].id,e=prog.eq[cid]=prog.eq[cid]||{};if(!id)delete e[slot];else{const t=TECHS.find(x=>x.id===id);if(!t||!ownsTech(id)||!t.who.includes(cid)||t.slot!==slot)return;e[slot]=id;}saveProg();sfx('ok');renderMenu();},""")
# ---- jefes: Bills con cola y joyas
rep("function bossChar(b){if(b.ch)return b.ch;","function bossChar(b){if(b.id==='bills'&&!b.ch.h){const bl=CHARS.find(c=>c.id==='bills');Object.assign(b.ch,{extras:bl.extras,h:bl.h});}if(b.ch)return b.ch;")
# ---- tienda: pestañas FORMAS y TÉCNICAS (mismo estilo de botones y filas del clásico)
rep(".grow{",".tabs{display:flex;gap:6px;justify-content:center;margin-bottom:6px}.stars{color:#ffd23a;letter-spacing:1px}\n.grow{")
a=src.index(" else if(menuState==='shop'){const ch=CHARS[shopChar];");b=src.index("function refreshMenuModels(){")
src=src[:a]+""" else if(menuState==='shop'){const ch=CHARS[shopChar],isT=shopTab==='tech',isO=shopTab==='outfit';let rows;
  if(isO)rows=outfitRows(ch);
  else if(!isT)rows=ch.forms.map((f,i)=>{const own=owns(ch,i),pr=formPrice(ch,i),can=prog.coins>=pr;
   const act=own?`<span class="ok">${isFree(ch,i)?'GRATIS':'TUYA'}</span>`:shopConfirm===i?`<button class="btn sbtn" data-act="buy" data-arg="${i}">¿CONFIRMAR? 🪙 ${pr}</button>`:`<button class="btn sbtn${can?'':' off'}" data-act="buy" data-arg="${i}">🪙 ${pr}</button>`;
   return`<div class="grow"><span>${own?'':'🔒 '}${f.name}<em>${fmtP(ch.base*f.mult)}</em></span>${act}</div>`;}).join('');
  else{const list=TECHS.filter(t=>t.who.includes(ch.id)),eq=prog.eq[ch.id]||{},slotL=s=>s==='ult'?'DEFINITIVO · E+H':'ESPECIAL · E';
   const defRow=slot=>{const d=slot==='ult'?ch.ult:ch.s1;return`<div class="grow"><span>${d.name}<em>${slotL(slot)} · de serie</em></span>${!eq[slot]?'<span class="ok">EQUIPADA</span>':`<button class="btn sbtn" data-act="equipTech" data-arg="${slot}:">EQUIPAR</button>`}</div>`;};
   rows=defRow('s1')+defRow('ult')+(list.length?list.map(t=>{const own=ownsTech(t.id),on=eq[t.slot]===t.id,can=prog.coins>=t.price;
    const act=on?'<span class="ok">EQUIPADA</span>':own?`<button class="btn sbtn" data-act="equipTech" data-arg="${t.slot}:${t.id}">EQUIPAR</button>`:shopConfirm===t.id?`<button class="btn sbtn" data-act="buyTech" data-arg="${t.id}">¿CONFIRMAR? 🪙 ${t.price}</button>`:`<button class="btn sbtn${can?'':' off'}" data-act="buyTech" data-arg="${t.id}">🪙 ${t.price}</button>`;
    return`<div class="grow"><span>${own?'':'🔒 '}${t.name}<em>${SIG_KIND[t.kind]} · ${slotL(t.slot)} · <span class="stars">${techStars(t)}</span></em></span>${act}</div>`;}).join(''):'<div class="tip" style="margin-top:8px">Las técnicas icónicas son para 14 luchadores: Goku, Vegeta, Gohan, Trunks, Piccolo, Krilin, Gogeta, Vegito, Freezer, Cell, Broly, Jiren, Goku Black y Bills.</div>');}
  const cnt=c=>isO?OUTFITS.filter(o=>o.who===c.id&&!prog.ofOwn.includes(o.id)).length:isT?TECHS.filter(t=>t.who.includes(c.id)&&!ownsTech(t.id)).length:c.forms.filter((_,j)=>!owns(c,j)).length;
  m.innerHTML=`${backBtn()}<div class="ttl">TIENDA · ${coinTag()}</div>
  <div class="tabs"><button class="btn sbtn${!isT&&!isO?'':' off'}" data-act="shopTab" data-arg="forms">FORMAS</button><button class="btn sbtn${isT?'':' off'}" data-act="shopTab" data-arg="tech">TÉCNICAS</button><button class="btn sbtn${isO?'':' off'}" data-act="shopTab" data-arg="outfit">OUTFITS</button></div>
  <div class="grid">${CHARS.map((c,i)=>{const n=cnt(c);return`<div class="cell${lockedC(i)?' lock':''}" data-act="shopPick" data-arg="${i}"><img src="${PORTRAITS[i]}" alt="">${c.name}<br><span style="color:${n?'#c8cce0':'#7dff7a'}">${n?n+' 🔒':'✔ todo'}</span>${i===shopChar?'<div class="cur"></div>':''}</div>`;}).join('')}</div>
  <div class="shopwrap" style="margin-top:10px">${isO?'<div id="probSlot"><div class="tip" style="margin:4px 0 0">PROBADOR</div></div>':''}<div class="gcol shop" style="width:min(96vw,640px);flex:none">${rows}</div></div>
  <div class="hint keep" style="margin-top:8px">${isO?'Los outfits solo cambian la ropa: no dan poder. Pruébalos antes de comprar. Los ★ EXCLUSIVOS son de pago.':isT?'Cada luchador tiene 4 técnicas icónicas: ráfaga, rayo y cuerpo a cuerpo van al Especial (E · 🌀); la definitiva al Definitivo (E+H · ☄️). Las ★ indican su fuerza.':'Ganas monedas al vencer a la CPU o a un jefe, en el modo historia, en Supervivencia y con los desafíos. Entrenamiento y los 2 jugadores no dan monedas.'}</div>`;
  m.style.justifyContent='flex-start';}}
"""+src[b:]
# =================== 2.0: modo historia, tienda nueva, outfits, fusiones, Supervivencia, 2P en un celular, repetición y foto ===================
rep("const PROG_KEY='kc_prog';",rd('plus-save.js')+"const PROG_KEY='kc_prog';")
rep("if(!p||typeof p!=='object')return d;","if(!p||typeof p!=='object')p={};")
rep("if(v&&v.length<20000)","if(v&&v.length<400000)")
rep("allowed(i){return ERA","allowed(i){if(this.storyForms)return this.storyForms.includes(i);return ERA")
rep("applyForm(){const f=this.form;applyFormModel(this.model","applyForm(){const f=this.form;this.model.outfit=this.forceOutfit||(human(this)&&!game.online?prog.ofEq[this.ch.id]||null:null);applyFormModel(this.model")
rep("const c=Object.assign({},ch.colors,f.colors||{}),m=model.mats;","const c=Object.assign({},ch.colors,model.outfit&&outfitOf(model.outfit)?outfitOf(model.outfit).colors:{},f.colors||{}),m=model.mats;")
rep("const ch=CHARS[want],model=buildModel(ch),fi=pst[p]==='char'?0:fsel[p];","const ch=CHARS[want],model=buildModel(ch),fi=pst[p]==='char'?0:fsel[p];if(p===0)model.outfit=prog.ofEq[ch.id]||null;")
# luchadores bloqueados hasta el modo historia
rep('<div class="cell" data-act="pickChar" data-arg="${i}"><img src="${PORTRAITS[i]}" alt="">${ch.name}','<div class="cell${lockedC(i)?\' lock\':\'\'}" data-act="pickChar" data-arg="${i}"><img src="${PORTRAITS[i]}" alt="">${lockedC(i)?\'🔒 \':\'\'}${ch.name}')
rep("const ok=p=>{if(pst[p]==='char'){pst[p]='form';","const ok=p=>{if(pst[p]==='char'){if(humanSide(p)&&lockedC(cur[p])){lockMsg=LOCK_MSG;sfx('back');return;}pst[p]='form';")
rep("const forms=st==='char'?`<div>${ch.forms.length} formas","const forms=st==='char'?`${lockedC(cur[p])?'<div style=\"color:#ff9a5a\">🔒 '+LOCK_MSG+'</div>':''}<div>${ch.forms.length} formas")
rep("const bad=sq.list.findIndex(x=>x.human&&!owns(CHARS[x.c],x.f));if(bad>=0){sq.slot=bad;lockMsg='Forma bloqueada: cómprala en la TIENDA';","const bad=sq.list.findIndex(x=>x.human&&(lockedC(x.c)||!owns(CHARS[x.c],x.f)));if(bad>=0){sq.slot=bad;lockMsg=lockedC(sq.list[bad].c)?LOCK_MSG:'Forma bloqueada: cómprala en la TIENDA';")
rep('<div class="cell" data-act="sqPick" data-arg="${i}"><img','<div class="cell${lockedC(i)?\' lock\':\'\'}" data-act="sqPick" data-arg="${i}"><img')
rep("cur[0]=(cur[0]+d+CHARS.length)%CHARS.length;fsel[0]=0;","do{cur[0]=(cur[0]+d+CHARS.length)%CHARS.length;}while(lockedC(cur[0]));fsel[0]=0;")
# dificultad Legendario
rep("transFirst:[7,10]}];","transFirst:[7,10]},\n {name:'Legendario',desc:'Lee tus ataques, esquiva casi todo y castiga cada error. Solo para maestros.',react:.13,atk:[.1,.18],guard:.55,vanish:.65,vanCool:2,escape:.5,trans:.6,special:.7,combo:5,cap:Infinity,dmg:1.15,tele:.65,bossF:1.25,bossHp:5,bossCool:.75,transCool:10,transFirst:[5,8]}];")
rep("[20,35,50][game.diff]","[20,35,50,70][game.diff]");rep("[4,7,10][game.diff]","[4,7,10,13][game.diff]");rep("[.55,.75,.9][game.diff]","[.55,.75,.9,.95][game.diff]");rep("[3,6,9][game.diff]","[3,6,9,12][game.diff]")
rep("game.diff=(game.diff+(U.includes(code)?1:2))%3","game.diff=(game.diff+(U.includes(code)?1:DIFFS.length-1))%DIFFS.length")
rep("cycleDiff:()=>{game.diff=(game.diff+1)%3","cycleDiff:()=>{game.diff=(game.diff+1)%DIFFS.length")
rep("else if(a==='d')C.d=(C.d+1)%3","else if(a==='d')C.d=(C.d+1)%DIFFS.length")
rep("d=DIFFS[clamp(C.d|0,0,2)]","d=DIFFS[clamp(C.d|0,0,DIFFS.length-1)]")
# modos nuevos: Supervivencia y 2 jugadores en el mismo celular
rep("{id:'cpu',name:'Contra la CPU',desc:'Tú contra la máquina, con tres dificultades.'","{id:'cpu',name:'Contra la CPU',desc:'Tú contra la máquina, de Fácil a Legendario.'")
rep("{id:'royale',name:'Battle Royale'","{id:'surv',name:'Supervivencia',desc:'Oleadas de rivales cada vez más fuertes. Cada K.O. da monedas; recuperas algo de vida entre oleadas.',diff:1},\n {id:'duo',name:'2 jugadores · mismo celular',desc:'Pantalla dividida por mitades: cada uno con su cámara, sus controles fijos y su HUD.',team:[1,1]},\n {id:'royale',name:'Battle Royale'")
rep("const TOUCH_MODES=['cpu','boss','coopcpu','2v1cpu','2v1amigo','1v2','royale','train'];","const TOUCH_MODES=['cpu','boss','coopcpu','surv','duo','2v1cpu','2v1amigo','1v2','royale','train'];")
rep("const solo=()=>['cpu','coopcpu','train','boss','2v1cpu','1v2','royale'].includes(game.mode);","const solo=()=>['cpu','coopcpu','train','boss','surv','2v1cpu','1v2','royale'].includes(game.mode);")
rep("game.cpu=['cpu','coopcpu','2v1cpu','1v2','royale'].includes(game.mode);","game.cpu=['cpu','coopcpu','surv','2v1cpu','1v2','royale'].includes(game.mode);")
rep("${cur[1]===i&&game.mode!=='boss'&&game.mode!=='train'?","${cur[1]===i&&!['boss','train','surv'].includes(game.mode)?")
rep("if(p&&game.mode==='train')return'<b>MAESTRO","if(p&&game.mode==='surv')return'<b>SUPERVIVENCIA</b><br>Rivales al azar, cada oleada más fuerte. Cada K.O. da monedas.';if(p&&game.mode==='train')return'<b>MAESTRO")
rep("const hint2=(game.mode==='boss'||game.mode==='train')?''","const hint2=['boss','train','surv'].includes(game.mode)?''")
rep("pst=['char',(game.mode==='boss'||game.mode==='train')?'ready':'char'];","pst=['char',['boss','train','surv'].includes(game.mode)?'ready':'char'];")
rep("if(p&&(game.mode==='boss'||game.mode==='train')){if(mm)","if(p&&['boss','train','surv'].includes(game.mode)){if(mm)")
rep("if(teamMode()){squadInit();sfx('ok');menuState='squad';renderMenu();return;}","if(teamMode()||game.mode==='duo'){squadInit();sfx('ok');menuState='squad';renderMenu();return;}")
rep("human=i===0||(game.mode==='2v1amigo'&&i===1)","human=i===0||((game.mode==='2v1amigo'||game.mode==='duo')&&i===1)")
rep("game.squad=[0,1].map(t=>sq.list.filter(x=>x.t===t).map(x=>({c:x.c,f:x.f,human:x.human})));clearMenuModels();menuState='world';","game.squad=[0,1].map(t=>sq.list.filter(x=>x.t===t).map(x=>({c:x.c,f:x.f,human:x.human})));if(game.mode==='duo'){cur=[sq.list[0].c,sq.list[1].c];fsel=[sq.list[0].f,sq.list[1].f];}clearMenuModels();menuState='world';")
rep("if(state==='chars'&&teamMode())state='squad';","if(state==='chars'&&(teamMode()||game.mode==='duo'))state='squad';")
rep("if(teamMode())menuState='squad';else if(bossMode())","if(teamMode()||game.mode==='duo')menuState='squad';else if(bossMode())")
rep("if(teamMode()){startTeamMatch(D);return;}","if(teamMode()){startTeamMatch(D);return;}\n if(M==='surv'){survStart();return;}")
rep("function ko(def,att){if(isGuest()){def.hp=Math.max(1,def.hp);return;}","function ko(def,att){if(isGuest()){def.hp=Math.max(1,def.hp);return;}if(game.mode==='surv'&&def.idx!==0){survKO(def,att);return;}if(human(att))track('ko');")
rep("function afterRound(){game.timescale=1;","function afterRound(){game.timescale=1;if(game.story){storyEnd();return;}if(game.mode==='surv'){survOver();return;}")
rep("const timed=game.mode==='vs'||game.mode==='cpu'","const timed=game.mode==='vs'||game.mode==='cpu'||game.mode==='duo'",2)
rep("$('#timer').textContent=(game.mode==='vs'||game.mode==='cpu')?Math.max(0,Math.ceil(game.timer)):'∞';","$('#timer').textContent=game.story?(game.story.left!=null?Math.ceil(game.story.left):'∞'):game.mode==='surv'&&game.surv?'🌊'+game.surv.w:(game.mode==='vs'||game.mode==='cpu'||game.mode==='duo')?Math.max(0,Math.ceil(game.timer)):'∞';")
rep("function awardCoins(){const M=game.mode;if(M==='train'||(M==='vs'&&!game.online))return 0;","function awardCoins(){const M=game.mode;if(game.story)return 0;if(M==='train'||M==='duo'||(M==='vs'&&!game.online))return 0;")
rep("prog.wins++;saveProg();return n+bonus;}","prog.wins++;saveProg();trackWin();return n+bonus;}")
rep("const got=(game.mode==='cpu'&&game.winner===0)","if(game.mode==='duo')track('duo');const got=(game.mode==='cpu'&&game.winner===0)")
# seguimiento: transformaciones y definitivos
rep("this.applyForm();\n  if(up&&this.transDur>=.6)","this.applyForm();if(up)plusOnTrans(this,this.form);\n  if(up&&this.transDur>=.6)")
rep("if(isU)game.cine={type:'ult'","if(isU)plusOnUlt(this);if(isU)game.cine={type:'ult'")
# diálogos de entrada y pasos 2.0
rep("if(game.phase==='intro'){game.introT+=dt;","if(game.phase==='intro'){if(!dlgTick(dt))game.introT+=dt;")
rep("updateProjs(dt);updateStruggle(dt,performance.now()/1000);world.update(dt);}","updateProjs(dt);updateStruggle(dt,performance.now()/1000);world.update(dt);plusStep(dt);}")
rep("+' · '+W,1.1);}","+' · '+W,1.1);game.introDlg=null;$('#dlg').style.display='none';introDialog();}")
# teclas: diálogo, repetición, foto, historia
rep("if(game.phase){\n  if(game.phase==='over'&&game.online)","if(game.replay){if(code==='Escape'||code==='KeyR')replayExit();else if(code==='Space'||code==='KeyF'){game.replay.pause=!game.replay.pause;renderRepBar();}return;}\n if(game.photo){if(code==='Escape')photoExit();else if(code==='Enter'||code==='KeyP')game.photo.shot=true;return;}\n if(game.phase){\n  if(game.phase==='intro'&&game.introDlg){if(code==='Escape')dlgSkip();else dlgNext();return;}\n  if(game.phase==='over'&&game.story){if(code==='KeyF'||code==='Enter'||code==='Escape'||code==='P0B0')storyNext();else if(code==='KeyG')ACTIONS.sRetry();else if(code==='KeyR')replayStart();return;}\n  if(game.phase==='over'&&code==='KeyR'&&!game.online){replayStart();return;}\n  if(game.phase==='over'&&game.online)")
# bucle: repetición, cámara de foto y captura
rep("if(game.phase&&(!game.paused||game.online)){","if(game.replay){replayFrame(rdt,t);updateParts(rdt);updateRings(rdt);}\n else if(game.phase&&(!game.paused||game.online)){")
rep(" const W=Math.ceil(innerWidth/PIX),H=Math.ceil(innerHeight/PIX);"," if(game.photo)photoCam();plusFrame(rdt,t);\n const W=Math.ceil(innerWidth/PIX),H=Math.ceil(innerHeight/PIX);")
rep("else{renderer.setViewport(0,0,W,H);renderer.render(scene,cam);}}","else{renderer.setViewport(0,0,W,H);renderer.render(scene,cam);}\n if(game.photo&&game.photo.shot){game.photo.shot=false;photoCapture();}}")
# 2 jugadores en un celular: pantalla dividida siempre, cámaras de lado
rep("function updateCamera(dt){if(game.f.length<2)return;","function updateCamera(dt){if(game.f.length<2)return;\n if(duoPhone()&&game.phase!=='over'&&game.f.length===2){if(game.cine&&!game.cine.dlg)game.cine=null;game.split=true;duoCams(game.f[0],game.f[1],1-Math.exp(-6*dt));cam.position.copy(camA.position);cam.quaternion.copy(camA.quaternion);return;}")
rep("screenSign(){if(!game.split){","screenSign(){if(duoPhone())return 1;if(!game.split){")
rep("const duoMode=()=>TOUCHM&&game.mode==='2v1amigo';","const duoMode=()=>TOUCHM&&(game.mode==='2v1amigo'||game.mode==='duo');")
rep("['formUp','⚡',['KeyQ','KeyW'],['KeyW']]]}","['formUp','⚡',['KeyQ','KeyW'],['KeyW']],['fuse','🤝',['KeyZ']]]}")
rep("['formUp','⚡',['KeyP','ArrowUp'],['ArrowUp']]]}","['formUp','⚡',['KeyP','ArrowUp'],['ArrowUp']],['fuse','🤝',['KeyN']]]}")
rep("const BTN={light:{k:['KeyF']},","const BTN={fuse:{k:['KeyZ']},light:{k:['KeyF']},")
# pausa: modo foto y volver al mapa
rep('<button class="btn" ${NOFOCUS} data-act="toMainMenu">MENÚ PRINCIPAL','<button class="btn" data-act="photo">📷 MODO FOTO</button>${game.story?\'<button class="btn" data-act="sMapQuit">🗺 VOLVER AL MAPA</button>\':\'\'}<button class="btn" ${NOFOCUS} data-act="toMainMenu">MENÚ PRINCIPAL')
rep("function toMenu(state){","function toMenu(state){if(game.replay)replayExit();if(game.photo){game.photo=null;canvas.style.filter='';$('#photobar').style.display='none';}game.story=null;game.surv=null;game.introDlg=null;$('#dlg').style.display='none';document.body.classList.remove('canfuse0','canfuse1');")
rep("OVER_KEYS_KB='<br><span class=\"k\">F</span>/<span class=\"k\">Enter</span> revancha","OVER_KEYS_KB='<br><span class=\"k\">R</span> repetición &nbsp; <span class=\"k\">F</span>/<span class=\"k\">Enter</span> revancha")
rep("'<br><button class=\"btn\" data-act=\"rematch\">REVANCHA</button>","'<br><button class=\"btn\" data-act=\"replay\">REPETICIÓN</button><button class=\"btn\" data-act=\"rematch\">REVANCHA</button>")
# pantalla de título: historia, perfil y desafíos
rep('data-act="goPlay">JUGAR</button>','data-act="goPlay">JUGAR</button><button class="btn" data-act="openStory">📖 HISTORIA</button>')
rep("<button class=\"btn\" data-act=\"openRank\">🏆 RANKING</button>'}</div>","<button class=\"btn\" data-act=\"openRank\">🏆 RANKING</button>'}<button class=\"btn\" data-act=\"openProfile\">👤 PERFIL${titleName()?' · '+esc(titleName()):''}</button><button class=\"btn\" data-act=\"openChal\">🎯 DESAFÍOS${chalReady()?' ('+chalReady()+')':''}</button></div>")
rep("setTimeout(checkUpdate,800);}","setTimeout(checkUpdate,800);setTimeout(refundNotice,700);}")
rep(" else if(menuState==='shop'){",""" else if(menuState==='story'){m.innerHTML=storyHTML();m.style.justifyContent='flex-start';}
 else if(menuState==='whatif'){m.innerHTML=whatifListHTML();m.style.justifyContent='flex-start';}
 else if(menuState==='smap'){m.innerHTML=smapHTML();m.style.justifyContent='flex-start';}
 else if(menuState==='gallery'){m.innerHTML=galleryHTML();m.style.justifyContent='flex-start';}
 else if(menuState==='wish'){m.innerHTML=wishHTML();}
 else if(menuState==='cine'){m.innerHTML=cineHTML();renderCineBox();}
 else if(menuState==='profile'){m.innerHTML=profileHTML();m.style.justifyContent='flex-start';}
 else if(menuState==='chal'){m.innerHTML=chalHTML();m.style.justifyContent='flex-start';}
 else if(menuState==='shop'){""")
rep("if(menuState==='title'){if(code==='KeyC')openGuide('title');else goPlay();return;}","""if(menuState==='title'){if(code==='KeyC')openGuide('title');else if(code==='KeyH')ACTIONS.openStory();else goPlay();return;}
 if(menuState==='cine'){if(code==='Escape')cineEnd();else cineNext();return;}
 if(menuState==='wish')return;
 if(['story','profile','chal'].includes(menuState)){if(BACK.includes(code)){if(menuState==='profile'&&profView!=='main'){profView='main';renderMenu();return;}toMainMenu();}return;}
 if(['smap','gallery','whatif'].includes(menuState)){if(BACK.includes(code)){if(menuState==='smap'&&book&&book.kind==='wi')menuState='whatif';else menuState='story';sfx('back');renderMenu();}return;}""")
rep(" if(menuState==='chars'){refreshMenuModels();"," if(menuState==='cine'&&CINE)cineFrame(dt,t);\n else if(menuState==='chars'){refreshMenuModels();")
# sistemas 2.0 (al final, antes de arrancar)
rep("initCloud();\napplyTouch();",rd('plus.js')+rd('plus-story.js')+rd('plus-actions.js')+"initCloud();\napplyTouch();")
# 2.1: entornos rehechos y nuevos
rep("const WORLDS=[{name:'Tierra'",rd('plus-worlds.js')+"const WORLDS=[{name:'Tierra'")
rep("const curWorldDef=()=>game.mode==='train'?TRAIN_WORLD:WORLDS[game.world];","const curWorldDef=()=>game.mode==='train'?TRAIN_WORLD:WORLDS[game.world];\nplusWorlds();")
rep("function destroyRock(r,pos){if(!r.alive)return;","function destroyRock(r,pos){if(!r.alive||r.indestructible)return;")
rep("applyTouch();world=buildEarth(0);","applyTouch();world=buildEarth2(0);")
# 2.2: sangre, ropa rasgada y daños del escenario
rep("function explosion(pos,radius,color,quiet){",rd('plus-damage.js')+"function explosion(pos,radius,color,quiet){")
rep("function crater(pos,r){if(!world)return;","function crater(pos,r){return crater2(pos,r);if(!world)return;")
rep("const h=f.head||ch.head||[1,1,1];model.M.headG.scale.set(h[0],h[1],h[2]);","const h=f.head||ch.head||[1,1,1];model.M.headG.scale.set(h[0],h[1],h[2]);dmgLook(model,ch,f,torn|0);")
rep("if(R>=4&&big)pop(def,","bleedHit(def,big);if(R>=4&&big)pop(def,")
rep("craters.length=0;","craters.length=0;dmgClear();")
# 2.2: evento Torneo del Poder (cada hora)
rep("const TEAM_MODES=['2v1cpu','2v1amigo','1v2','royale'];","const TEAM_MODES=['2v1cpu','2v1amigo','1v2','royale','tdp'];")
rep("const isRoyale=()=>game.mode==='royale';","const isRoyale=()=>game.mode==='royale'||game.mode==='tdp';")
rep("const curWorldDef=()=>game.mode==='train'?TRAIN_WORLD:WORLDS[game.world];","const curWorldDef=()=>game.mode==='tdp'?TDP_WORLD:game.mode==='train'?TRAIN_WORLD:WORLDS[game.world];")
rep("function startMatch(){","function startMatch(){if(game.mode==='tdp'&&!tdpCanStart()){toMenu('tdp');return;}")
rep("if(teamMode()){startTeamMatch(D);return;}\n if(M==='surv')","if(M==='tdp'){tdpStartMatch(D);return;}\n if(teamMode()){startTeamMatch(D);return;}\n if(M==='surv')")
rep("function ko(def,att){if(isGuest()){def.hp=Math.max(1,def.hp);return;}","function ko(def,att){if(isGuest()){def.hp=Math.max(1,def.hp);return;}if(game.mode==='tdp'){tdpKO(def,att);return;}")
rep("function afterRound(){game.timescale=1;","function afterRound(){game.timescale=1;if(game.mode==='tdp'){tdpOver();return;}")
rep("if(teamMode()){const R=isRoyale(),dx=","if(game.mode==='tdp')tdpPlace(sy);else if(teamMode()){const R=isRoyale(),dx=")
rep("if(isRoyale())showMsg('BATTLE ROYALE'","if(game.mode==='tdp')showMsg('TORNEO DEL PODER',tdpSub(),1.6);else if(isRoyale())showMsg('BATTLE ROYALE'")
rep("world.update(dt);plusStep(dt);}","world.update(dt);plusStep(dt);if(game.mode==='tdp')tdpStep(dt);}")
rep("if(teamMode()){const R=isRoyale();for(let t=0;t<2;t++){const el=$('#pp'+t);","if(game.mode==='tdp'){tdpHud();return;}if(teamMode()){const R=isRoyale();for(let t=0;t<2;t++){const el=$('#pp'+t);")
rep("$('#timer').textContent=game.story?","$('#timer').textContent=game.mode==='tdp'&&game.tdp&&game.tdp.t!=null?mmss(Math.ceil(game.tdp.t)):game.story?")
rep(" power(){const p=this.realPower();return this.cap&&this.opp?Math.min(p,this.opp.realPower()*this.cap):p;}"," power(){const T=game.mode==='tdp',p=T?tdpPow(this):this.realPower();return this.cap&&this.opp?Math.min(p,(T?tdpPow(this.opp):this.opp.realPower())*this.cap):p;}")
rep("const down=this.state==='down'||this.state==='ko';","const down=(this.state==='down'||this.state==='ko')&&!this.benched;")
rep("else if(code==='KeyG'||code==='P0B1'){$('#msg').classList.remove('show');toMenu('chars');}","else if(code==='KeyG'||code==='P0B1'){$('#msg').classList.remove('show');toMenu(game.mode==='tdp'?'tdp':'chars');}")
rep("toChars:()=>{$('#msg').classList.remove('show');toMenu('chars');}","toChars:()=>{$('#msg').classList.remove('show');toMenu(game.mode==='tdp'?'tdp':'chars');}")
rep(" else if(menuState==='shop'){"," else if(menuState==='tdp'){m.innerHTML=tdpHTML();m.style.justifyContent='flex-start';}\n else if(menuState==='swish'){m.innerHTML=swishHTML();}\n else if(menuState==='shop'){")
rep("if(menuState==='wish')return;","if(menuState==='wish'||menuState==='swish')return;")
rep("if(['story','profile','chal'].includes(menuState)){","if(['story','profile','chal','tdp'].includes(menuState)){")
rep('<button class="btn" data-act="openStory">📖 HISTORIA</button>','<button class="btn" data-act="openStory">📖 HISTORIA</button><button class="btn tdpbtn" data-act="openTdp">🏟 TORNEO DEL PODER<span id="tdpclk">${tdpBadge()}</span></button>')
rep("initCloud();\napplyTouch();",rd('plus-tdp.js')+"initCloud();\napplyTouch();")
rep("const JOINTS=['torso','head','shL','elL','shR','elR','hipL','knL','hipR','knR'];","const JOINTS=['torso','head','shL','elL','shR','elR','hipL','knL','hipR','knR','hips','wrL','wrR','anL','anR'];")
rep("addPart(Sph(.078,18,14),mats.glove,el,0,-.215,.005).scale.set(1,1.05,1.1);","const wr=new THREE.Group();wr.position.set(0,-.17,0);el.add(wr);J['wr'+L]=wr;addPart(Sph(.078,18,14),mats.glove,wr,0,-.045,.005).scale.set(1,1.05,1.1);")
rep("addPart(Sph(.08,18,14),mats.boots,kn,0,-.2,.045).scale.set(1,.75,1.55);","const an=new THREE.Group();an.position.set(0,-.17,0);kn.add(an);J['an'+L]=an;addPart(Sph(.08,18,14),mats.boots,an,0,-.03,.045).scale.set(1,.75,1.55);")
rep("for(const j of JOINTS){const p=POSES.idle[j];m.J[j].rotation.set(p[0],p[1],p[2]);}","for(const j of JOINTS){const p=POSES.idle[j]||[0,0,0];m.J[j].rotation.set(p[0],p[1],p[2]);}")
rep("POSES.dodgeR=mirrorPose(POSES.dodgeL);","POSES.dodgeR=mirrorPose(POSES.dodgeL);\n"+rd('plus-anim.js'))
rep("function playTrack(n){",rd('plus-music.js')+"function playTrack(n){")
rep("const s=music.step%32,d=music.next-AC.currentTime;","const s=music.step%(tr.lead.length||32),d=music.next-AC.currentTime;")
rep("<div>${ch.forms.length} formas · poder base","<div class=\"csdet\">${ch.forms.length} formas · poder base")
rep("setHair(model,f.hair||ch.hair);setExtras(model,f.extras||ch.extras||[]);","setHair(model,f.hair||ch.hair);setExtras(model,outfitExtras(model,f.extras||ch.extras||[]));")
rep('<div class="hint" style="margin-top:10px"><span class="k">F2</span> pixelado','<div class="hint" style="margin-top:10px">3D: <span class="k">WASD</span> moverse · <span class="k">Space</span>/<span class="k">C</span> subir/bajar · <span class="k">L</span> fijar objetivo · ratón o <span class="k ar">←</span><span class="k ar">→</span> cámara · <span class="k">K</span> Kaioken · <span class="k">X</span> especial 2<br><span class="k">F2</span> pixelado')
# 3.0: selección de personaje nueva (cuadrícula a la derecha, vista previa grande con guardia y gestos) y versiones por arco
rep("""<div class="grid">${CHARS.map((c,i)=>cell(i)).join('')}</div>
  <div class="sides" style="margin-top:auto"><div>${side(0)}<div class="hint">${hint1}</div></div>""","""<div class="cs"><div class="csr"><div class="grid">${CHARS.map((c,i)=>cell(i)).join('')}</div></div><div class="csl"><div class="csinfo">${side(0)}${verRow(cur[0])}<div class="hint">${hint1}</div></div>""")
rep("""<div class="r">${side(1)}<div class="hint">${hint2}</div></div></div>`;
  m.style.justifyContent='flex-start';""","""<div class="csinfo r">${side(1)}<div class="hint">${hint2}</div></div></div></div>`;
  m.style.justifyContent='flex-start';""")
rep("mm.model.root.position.set(p?2:-2,world.spawnY,0);mm.model.root.rotation.y=(p?-.5:.5)+Math.sin(t*.6)*.15;","mm.model.root.position.set(csX(p),world.spawnY,p?-.6:0);mm.model.root.scale.setScalar(p?1:1.12);mm.model.root.rotation.y=(p?-.35:.45)+Math.sin(t*.6)*.12;")
rep("mm.model.target=pst[p]==='ready'?'transform':'idle';","mm.model.target=pst[p]==='ready'?'transform':csPose(p,t,f);")
rep("function refreshMenuModels(){",rd('plus-select.js')+"function refreshMenuModels(){")
# =================== 3.0: 3D de verdad (cámara detrás del luchador, movimiento libre), Kaioken combinable y más ===================
rep("if(fight&&f.role==='p'&&!f.cpu&&!f.remote)f.inp.mx=((f.inp.right?1:0)-(f.inp.left?1:0))*f.screenSign();","if(fight&&f.role==='p'&&!f.cpu&&!f.remote){if(f.idx===0&&justPressed.has('KeyX')){f.inp.p.special=true;f.inp.s2k=true;}if(f.idx===0&&on3D())input3D(f);else f.inp.mx=((f.inp.right?1:0)-(f.inp.left?1:0))*f.screenSign();}")
rep("if(freeMove){const mx=inp.trans?0:clamp(inp.mx,-1,1),vy=inp.trans?0:(inp.up?1:0)-(inp.down?1:0);let mv=fwd.clone().multiplyScalar(mx);","if(freeMove){const mx=inp.trans?0:clamp(inp.mx,-1,1),vy=inp.trans?0:(inp.up?1:0)-(inp.down?1:0);let mv=inp.v3&&!inp.trans?V3(inp.v3.x,0,inp.v3.z):fwd.clone().multiplyScalar(mx);if(inp.sx&&!inp.v3)mv.addScaledVector(right,inp.sx*.7);")
rep("if(dist<1.5+reach&&mx>0)mv.set(0,0,0);","{const tw=mv.dot(fwd);if(dist<1.5+reach&&tw>0)mv.addScaledVector(fwd,-tw);}")
rep("pose=mx>.3?'fly':mx<-.3?'back':'idle';","{const ml=mv.length();pose=ml>.3?(mv.dot(this.fwd())<-.3*ml?'back':'fly'):'idle';}")
rep("const facingLock=!['knock','down','ko'].includes(this.state);\n  if(facingLock){const ta=Math.atan2(fwd.x,fwd.z);","const facingLock=!['knock','down','ko'].includes(this.state),freeFace=inp.free&&inp.v3&&(Math.abs(inp.v3.x)+Math.abs(inp.v3.z)>.2)&&dist>7&&this.state==='idle';\n  if(facingLock){const ta=freeFace?Math.atan2(inp.v3.x,inp.v3.z):Math.atan2(fwd.x,fwd.z);")
rep("let d=fwd.clone().multiplyScalar(inp.mx),side;","let d=inp.v3&&(Math.abs(inp.v3.x)+Math.abs(inp.v3.z)>.2)?V3(inp.v3.x,0,inp.v3.z):fwd.clone().multiplyScalar(inp.mx),side;")
rep(" else if(royaleChase(a,b,k)){"," else if(on3D()&&cam3D(dt)){if(c)game.cine=null;game.split=false;}\n else if(royaleChase(a,b,k)){")
rep("case'wait':o.mx=d<4?-1:0;break;","case'wait':o.mx=d<4?-1:0;cpuStrafe(f,o);break;")
rep("case'blast':if(ai.tick<=0){ai.tick=D.atk[1]+.1;o.p.ki=true;}o.mx=d<12?-1:0;break;","case'blast':if(ai.tick<=0){ai.tick=D.atk[1]+.1;if(!losBlocked(f,op))o.p.ki=true;}o.mx=d<12?-1:0;cpuStrafe(f,o);break;")
rep("else if(d>9)ai.plan=","else if(d>9&&losBlocked(f,op))ai.plan='approach';else if(d>9)ai.plan=")
rep("introDialog();}","introDialog();cam3DReset();}")
rep("lock:{k:['KeyV']}};","lock:{k:['KeyV']},up3:{k:['Space']},dn3:{k:['KeyC']},lk3:{k:['KeyL']},kk:{k:['KeyK']},s2:{k:['KeyX']}};")
rep('<div id="tbtns">','<div id="camZone"></div><div id="b3d"><div class="tb b-up3" data-k="up3" aria-label="Subir">⤒</div><div class="tb b-dn3" data-k="dn3" aria-label="Bajar">⤓</div><div class="tb b-lk3" id="b3dlock" data-k="lk3" aria-label="Fijar objetivo">🎯</div><div class="tb b-kk" data-k="kk" aria-label="Kaioken">KK</div></div><div class="tb b-s2" data-k="s2" aria-label="Especial 2">🌟</div><div id="tbtns">')
rep('data-act="photo">📷 MODO FOTO</button>${game.story?','data-act="photo">📷 MODO FOTO</button><button class="btn" data-act="cam3d">🎥 CÁMARA: ${CAM3D?\'3D (DETRÁS)\':\'CLÁSICA (DE LADO)\'}</button>${game.story?')
rep("return this.base*m*(this.absorbMul||1);}","return this.base*m*(this.absorbMul||1)*(this.kkL||1);}")
rep("for(const f of game.f)f.update(dt);","for(const f of game.f){f.update(dt);kkTick(f,dt);}")
rep(" reset(side,at){"," reset(side,at){this.kkL=0;")
rep("else if(f.auraOn??(f.mult>=40||f.kk))lv=.42;","else if(this.kkL||(f.auraOn??(f.mult>=40||f.kk)))lv=.42;")
rep("$('#fm'+i).textContent=f.form.name+","$('#fm'+i).textContent=f.form.name+(f.kkL?' + KAIOKEN x'+f.kkL:'')+")
rep("else if(s.type==='absorb')this.updateAbsorb(dt,sp,s);","else if(s.type==='absorb')this.updateAbsorb(dt,sp,s);\n  else if(MOVE3[s.type])MOVE3[s.type](this,dt,sp,s,fwd);")
rep("updateProjs(dt);updateStruggle(dt,","updateProjs(dt);moveFxStep(dt);updateStruggle(dt,")
rep("if(P.special){if(inp.ki)P.ult=true;else this.specBuf=.1;}","if(P.special){if(inp.ki)P.ult=true;else if(inp.s2k)P.s2=true;else this.specBuf=.1;}")
rep("if(P.s1||P.ult){this.doSpecial(P.ult?'ult':'s1');break;}","if(P.s1||P.ult||P.s2){this.doSpecial(P.ult?'ult':P.s2?'s2':'s1');break;}")
rep("const def=which==='ult'?this.ch.ult:this.ch.s1;","const def=which==='ult'?this.ch.ult:which==='s2'?(this.ch.s2||this.ch.s1):this.ch.s1;")
rep("case'special':o.p.special=true;","case'special':o.p.special=true;o.s2k=Math.random()<.45;")
rep("this.pos=V3();this.vel=V3();this.face=0;this.inp=blankInput();this.cpu=false;this.formIdx=0;this.torn=0;}","this.pos=V3();this.vel=V3();this.face=0;this.inp=blankInput();this.cpu=false;this.formIdx=0;this.torn=0;verInit(this,o);}")
rep("applyForm(){const f=this.form;","applyForm(){const f=this.form;this.mastK=mastOf(this);")
rep("const dr=drainOf(f);if(dr&&this.state!=='transform')this.ki=Math.max(0,this.ki-dr*KIMAX*dt);","const dr=drainOf(f);if(dr&&this.state!=='transform')this.ki=Math.max(0,this.ki-dr*KIMAX*dt*(1-.6*(this.mastK||0)));")
rep("if(att.ch.dmgMult)dmg*=att.ch.dmgMult;","dmg*=1+.35*(att.mastK||0);if(att.ch.dmgMult)dmg*=att.ch.dmgMult;")
rep("b.cpu=M==='cpu';if(M==='cpu'&&D.cap!==Infinity)b.cap=D.cap;game.f=[a,b];}","b.cpu=M==='cpu';if(M==='cpu'&&D.cap!==Infinity)b.cap=D.cap;game.f=[a,b];if(M==='train')trainCrewSetup(a,b);}")
rep("game.wins=[0,0];game.round=1;buildHud();$('#hud').style.display='block';$('#pp1').style.display=M==='boss'?","game.wins=[0,0];game.round=1;buildHud();if(M==='train')trainHudExtra();$('#hud').style.display='block';$('#pp1').style.display=M==='boss'?")
rep("else{game.f[0].reset(-1);game.f[1].reset(1);}","else{game.f[0].reset(-1);game.f[1].reset(1);for(let i=2;i<game.f.length;i++)game.f[i].reset(-1,V3(-7,world.spawnY+2,4*(i-1)));}")
rep("function startFromGuide(){","function startFromGuide(){if(game.mode==='train'&&!game.crewPicked){game.world=wsel;game.variant=vsel;clearMenuModels();menuState='trainsel';renderMenu();return;}game.crewPicked=false;")
rep(" else if(menuState==='tdp'){"," else if(menuState==='trainsel'){m.innerHTML=trainSelHTML();m.style.justifyContent='flex-start';}\n else if(menuState==='tdp'){")
rep("if(['story','profile','chal','tdp'].includes(menuState)){","if(menuState==='trainsel'){if(BACK.includes(code)){menuState='chars';pst=['form','ready'];sfx('back');renderMenu();}return;}\n if(['story','profile','chal','tdp'].includes(menuState)){")
rep("{f.update(dt);kkTick(f,dt);}","{f.update(dt);kkTick(f,dt);mastTick(f,dt);}")
rep("if(game.mode==='tdp')tdpStep(dt);}","if(game.mode==='tdp')tdpStep(dt);trainStep(dt);}")
rep("function toMenu(state){","function toMenu(state){if(ROAM.init)roamEnd();")
rep("$('#fm'+i).textContent=f.form.name+(f.kkL?' + KAIOKEN x'+f.kkL:'')+","$('#fm'+i).textContent=f.form.name+(f.kkL?' + KAIOKEN x'+f.kkL:'')+(f.form.mult>1&&human(f)&&!game.online&&mastPct(f)>=1?' · '+Math.floor(mastPct(f))+' %':'')+")
rep("initCloud();\napplyTouch();",rd('plus-3d.js')+rd('plus-moves.js')+rd('plus-mastery.js')+rd('plus-free.js')+rd('plus-world3.js')+"initCloud();\napplyTouch();")
# HTML y CSS nuevos
rep('<div id="duo"></div>','<div id="duo"></div>\n<div id="dlg"></div><div id="toasts"></div><div id="repbar"></div><div id="photobar"></div><div id="ppbox"></div>')
rep('<div id="rbtns">','<div id="fbtn"><div class="tb b-fuse" data-k="fuse" aria-label="Fusión">🤝</div></div><div id="rbtns">')
rep(".grow{",rd('plus.css')+"\n.grow{")
os.makedirs(D+'out',exist_ok=True)
open(D+'out/index.html','w',encoding='utf8').write(src)
i=src.index("<script>\n'use strict';");j=src.index('</script>',i);open(D+'gc.js','w').write(src[i+8:j])
print('classic ok',len(src))
