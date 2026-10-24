import sys
import os;D=os.path.dirname(os.path.abspath(__file__))+'/'
src=open(D+'stage18.js',encoding='utf8').read()
def rep(old,new,cnt=1):
    global src
    n=src.count(old)
    if n!=cnt: sys.exit('COUNT %d!=%d for: %s'%(n,cnt,old[:100]))
    src=src.replace(old,new)
# ---- mundos
rep("rocks.push(makeRock(bandedCylinder(r*.82,r,h,7,bands)","rocks.push(makeRock(bandedCylinder(r*.82,r,h,12,bands)")
rep("tex.magFilter=THREE.NearestFilter;","")
rep("const WORLDS=[{name:'Tierra'",open(D+'worlds.js',encoding='utf8').read()+"const WORLDS=[{name:'Tierra'")
rep("vars:['Torneo intacto','Arena en ruinas'],build:buildVoid,music:'void'}];","""vars:['Torneo intacto','Arena en ruinas'],build:buildVoid,music:'void'},
 {name:'Planeta de Kaiosama',desc:'El diminuto planeta del Kaio del Norte: el horizonte se curva bajo tus pies y su gravedad x10 cansa el doble.',vars:['Día','Atardecer dorado'],build:buildKaio,music:'kaio'},
 {name:'Dimensión rota',desc:'El espacio que Gogeta y Broly hicieron pedazos. No hay suelo: se pelea flotando entre fragmentos de realidad.',vars:['Fractura','Colapso (fragmentos que golpean)'],build:buildBroken,music:'broken'}];
const curWorldDef=()=>game.mode==='train'?TRAIN_WORLD:WORLDS[game.world];""")
# ---- móvil: entrenamiento
rep("const TOUCH_MODES=['cpu','boss','coopcpu','2v1cpu','2v1amigo','1v2','royale'];","const TOUCH_MODES=['cpu','boss','coopcpu','2v1cpu','2v1amigo','1v2','royale','train'];")
# ---- progreso: técnicas
rep("const d={coins:0,own:{},day:'',wins:0,earned:0,nick:''};","const d={coins:0,own:{},day:'',wins:0,earned:0,nick:'',tech:[],eq:{}};")
rep("d.own[k]=[...new Set(p.own[k].filter(n=>Number.isInteger(n)&&n>=0&&n<40))];return d;}","""d.own[k]=[...new Set(p.own[k].filter(n=>Number.isInteger(n)&&n>=0&&n<40))];
 if(Array.isArray(p.tech))d.tech=[...new Set(p.tech.filter(id=>typeof id==='string'&&TECHS.some(t=>t.id===id)))];
 if(p.eq&&typeof p.eq==='object')for(const k in p.eq){const e=p.eq[k];if(!/^[a-z0-9]{1,16}$/.test(k)||!e||typeof e!=='object')continue;const o={};for(const s of['s1','ult'])if(typeof e[s]==='string'&&d.tech.includes(e[s]))o[s]=e[s];d.eq[k]=o;}
 return d;}""")
rep("const body={coins:prog.coins,own:prog.own,day:prog.day,wins:prog.wins,earned:prog.earned,nick:prog.nick,t:Date.now()};","const body={coins:prog.coins,own:prog.own,day:prog.day,wins:prog.wins,earned:prog.earned,nick:prog.nick,tech:prog.tech,eq:prog.eq,t:Date.now()};")
rep("function buyForm(ch,i){","""const ownsTech=id=>prog.tech.includes(id);
function buyTech(t){if(ownsTech(t.id)||prog.coins<t.price)return false;prog.coins-=t.price;prog.tech.push(t.id);const cid=CHARS[shopChar].id;if(t.who.includes(cid))(prog.eq[cid]=prog.eq[cid]||{})[t.slot]=t.id;saveProg();return true;}
function buyForm(ch,i){""")
rep("let lockMsg='',shopChar=0,shopConfirm=-1;","let lockMsg='',shopChar=0,shopConfirm=-1,shopTab='forms';")
# ---- material fantasma del Gigante de Luz
rep("/* ---------------- Luchadores ---------------- */","""/* Gigante de Luz: avatar de aura celeste translúcido (fresnel + ki que fluye hacia arriba) */
const GHOST_MAT=new THREE.ShaderMaterial({uniforms:{uT:{value:0},uC:{value:new THREE.Color(0x7fe0ff)}},
 vertexShader:`varying vec3 vN;varying vec3 vV;varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vec4 mv=viewMatrix*w;vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
 fragmentShader:`uniform float uT;uniform vec3 uC;varying vec3 vN;varying vec3 vV;varying vec3 vW;void main(){float f=1.0-abs(dot(normalize(vN),normalize(vV)));float flow=.5+.5*sin(vW.y*1.3-uT*6.0+sin(vW.x*.7+uT)*2.0);float a=.07+pow(f,2.2)*.6+flow*.06;vec3 c=mix(uC,vec3(1.0),pow(f,3.0)*.6+flow*.1);gl_FragColor=vec4(c*a,1.0);}`,
 transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
/* ---------------- Luchadores ---------------- */""")
# ---- Fighter
rep('this.maxHp=o.maxHp||MAXHP;','this.maxHp=this.baseMaxHp=o.maxHp||MAXHP;this.avatar=null;this.fatigue=0;this.drained=0;this.absorbMul=1;this.collapseT=0;')
rep('dispose(){scene.remove(this.model.root);','dispose(){this.dropAvatar();scene.remove(this.model.root);')
rep('this.falling=false;this.fightT=0;this.applyForm();this.model.root.scale.setScalar(this.giant);}','this.falling=false;this.fightT=0;this.fatigue=0;this.drained=0;this.absorbMul=1;this.collapseT=0;this.applyForm();this.hp=this.maxHp;this.model.root.scale.setScalar(this.form.lightGiant?1:this.giant);}')
rep('applyForm(){this.giant=this.giant0*(this.form.giant||1);applyFormModel(this.model,this.ch,this.form,this.torn);this.aura.setColor(this.form.aura);if(game.phase)hudPortrait(this);}',
"""applyForm(){const f=this.form;applyFormModel(this.model,this.ch,f,this.torn);this.aura.setColor(f.aura);
  const nm=this.baseMaxHp*(f.hpMax||1);if(nm!==this.maxHp){this.hp=this.hp*nm/this.maxHp;this.maxHp=nm;}
  this.giant=this.giant0*(f.giant||1);if(f.lightGiant)this.makeAvatar();else this.dropAvatar();
  if(game.phase)hudPortrait(this);}
 makeAvatar(){if(this.avatar)return;const m=buildModel(this.ch);applyFormModel(m,this.ch,this.form,0);m.root.traverse(o=>{if(o.isMesh){if(o.material===OUTLINE)o.visible=false;else{o.material=GHOST_MAT;o.castShadow=false;}}});m.root.scale.copy(this.model.root.scale);scene.add(m.root);this.avatar=m;}
 dropAvatar(){if(!this.avatar)return;scene.remove(this.avatar.root);disposeModel(this.avatar);this.avatar=null;}
 tire(v){if(this.role==='p')this.fatigue=Math.min(1,this.fatigue+v*(world&&world.gravity||1));}
 /* Técnica equipada en la tienda (solo jugadores locales; online y CPU usan las de serie) */
 tech(which){const def=which==='ult'?this.ch.ult:this.ch.s1;if(this.role!=='p'||this.cpu||this.remote||game.online)return def;const id=(prog.eq[this.ch.id]||{})[which],t=id&&TECHS.find(x=>x.id===id);return t&&t.who.includes(this.ch.id)&&ownsTech(t.id)?t:def;}""")
rep('if(this.ch.brolyPassive&&this.role!==\'boss\')m*=1+this.brolyK()*.4;return this.base*m;}','if(this.ch.brolyPassive&&this.role!==\'boss\')m*=1+this.brolyK()*.4;if(f.collapse)m*=Math.max(.45,1-this.collapseT*.012);return this.base*m*(this.absorbMul||1);}')
rep('chest(){return this.pos.clone().add(V3(0,.85*this.sy(),0));}','chest(){return this.pos.clone().add(V3(0,1.3*this.sy(),0));}')
rep('return this.pos.clone().add(V3(0,.85*s.y,0)).addScaledVector(f,.5*s.z).addScaledVector(r,side*.2*s.x);}','return this.pos.clone().add(V3(0,1.3*s.y,0)).addScaledVector(f,.48*s.z).addScaledVector(r,side*.24*s.x);}')
rep('spd(){return clamp(Math.pow(this.power()/this.opp.power(),.25),.6,2.5);}','spd(){return clamp(Math.pow(this.power()/this.opp.power(),.25),.6,2.5)*(1-.3*this.fatigue)*(1-.45*this.drained);}')
rep("sfx('transform',this.transDur);","sfx('transform',this.transDur);vox(this,'scream',Math.max(.7,this.transDur+.2));this.tire(.1);")
rep("""doSpecial(which){const s=which==='ult'?this.ch.ult:this.ch.s1;const cost=which==='ult'?4:s.type==='barrage'?1:2;""","""doSpecial(which){const s=this.tech(which);const cost=s.ki??(which==='ult'?4:s.type==='barrage'?1:2);""")
rep("""this.sp={s,type:s.type,isU,full,t:0,phase:'charge',dur:s.type==='beam'?(isU?1.2:.55):s.type==='ball'?(isU?1.4:.6):.9,fired:0};
  this.setState('special');pop(this,s.name+'!',hex(s.color),isU);""","""this.sp={s,type:s.type,isU,full,t:0,phase:'charge',dur:s.type==='beam'?(isU?1.2:.55):s.type==='ball'?(isU?1.4:.6)*((s.size||0)>3?1.4:1):s.type==='absorb'?1.9:s.type==='rush'?.3:.9,fired:0};
  this.setState('special');pop(this,s.name+'!',hex(s.color),isU);this.tire(isU?.14:.07);if(s.type!=='barrage')say(this,s.name);""")
rep("""   if(f.dur){this.formT-=dt;if(this.formT<=0)this.dropForm('Fin del Ultra Instinto');}""","""   if(f.dur){this.formT-=dt;if(this.formT<=0)this.dropForm('Fin del Ultra Instinto');}
   if(f.collapse)this.collapseT+=dt;
   /* cansancio: sube al atacar y esquivar, baja al respirar (quieto o en guardia) */
   if(this.role==='p'){const busy=['attack','heavy','rush','special','dodge','transform'].includes(this.state),rec=this.state==='charge'?.04:busy?0:.11;
    this.fatigue=clamp(this.fatigue-rec*dt+(this.ki<.5?.03*dt:0),0,1);
    if(this.fatigue>.6&&game.phase==='fight'){this.pantT=(this.pantT||0)-dt;if(this.pantT<=0){this.pantT=rand(1.1,1.6);vox(this,'pant');}if(!this.tiredShown){this.tiredShown=true;pop(this,'CANSADO','#ffb070');}}else if(this.fatigue<.4)this.tiredShown=false;}
   if(this.drained>0)this.drained=Math.max(0,this.drained-.012*dt);
   /* Moro: cuanto más drena al rival, más se acerca a su poder */
   if(this.ch.moro&&op){const own=this.base*f.mult,rp=op.realPower();this.absorbMul=lerp(1,rp>own?rp*1.05/own:1.4,op.drained);}""")
rep("this.chargeSnd-=dt;if(this.chargeSnd<=0){this.chargeSnd=.28;sfx('charge');}","this.chargeSnd-=dt;if(this.chargeSnd<=0){this.chargeSnd=.3;sfx('charge');}this.screamT=(this.screamT||0)-dt;if(this.screamT<=0){this.screamT=1.6;vox(this,'scream',1.3);}")
rep("this.model.smear=1/12;this.model.smearSide=a.pose==='punchL'?'L':'R';sfx('swing');","sfx('swing');")
rep("this.model.smear=1/12;this.model.smearSide='R';sfx('swing');","sfx('swing');vox(this,'heavy');this.tire(.05);")
rep("  case'hit':pose='hit';","  case'dodge':pose=this.dodgePose||'dodgeL';this.vel.multiplyScalar(Math.max(0,1-5*dt));if(this.stT<=0)this.setState('idle');break;\n  case'hit':pose='hit';")
rep("if(this.state!=='knock'&&this.state!=='ko'&&this.state!=='hit'){this.vel.lerp(wantVel,1-Math.exp(-10*dt));}","if(this.state!=='knock'&&this.state!=='ko'&&this.state!=='hit'&&this.state!=='dodge'){this.vel.lerp(wantVel,1-Math.exp(-10*dt));}")
rep("if(this.pos.y>world.maxY){this.pos.y=world.maxY;this.vel.y=Math.min(0,this.vel.y);}","if(this.pos.y>world.maxY){this.pos.y=world.maxY;this.vel.y=Math.min(0,this.vel.y);}\n  if(world.minY!=null&&this.pos.y<world.minY){this.pos.y=world.minY;this.vel.y=Math.max(0,this.vel.y);}")
rep("  this.model.target=pose;}","""  const st=game.struggle;this.model.effort=this.state==='charge'||this.state==='transform'||(st&&(st.a===this||st.b===this))?1:this.state==='special'&&this.sp&&this.sp.phase!=='charge'?.6:0;
  this.model.fatigue=this.fatigue;this.model.slump=this.form.slump||0;
  if(pose==='idle'&&this.fatigue>.82&&game.phase==='fight'&&this.state==='idle')pose='tired';
  this.model.target=pose;}""")
rep("startAttack(step){const poses=['punchR','punchL','kick','punchR','uppercut'];this.atk={step,t:0,dur:step===5?.38:.25,hitAt:step===5?.12:.07,pose:poses[step-1],done:false,queued:false};this.setState('attack');animateModel(this.model,0,true);}",
 "startAttack(step){const poses=['punchL','punchR','kick','kickHigh','uppercut'],sl=1+this.fatigue*.45;this.atk={step,t:0,dur:(step===5?.38:.25)*sl,hitAt:(step===5?.12:.07)*sl,pose:poses[step-1],done:false,queued:false};this.setState('attack');this.tire(.035);if(Math.random()<.55||step===5)vox(this,step===5?'heavy':'kiai');}")
rep("""  this.vanishW=.12;if(this.ki>=.25){this.ki-=.25;const inp=this.inp;let d=fwd.clone().multiplyScalar(inp.mx);if(inp.up||inp.down)d.y=inp.up?1:-1;if(d.lengthSq()<.01)d.copy(right).multiplyScalar(Math.random()<.5?1:-1);d.normalize();
   afterimage(this);this.pos.addScaledVector(d,5);sfx('tele');}}""","""  /* esquiva real: paso lateral, inclinación hacia atrás o agacharse; hacia el rival se teletransporta */
  this.vanishW=.12;const inp=this.inp;let d=fwd.clone().multiplyScalar(inp.mx),side;if(inp.up||inp.down)d.y=inp.up?1:-1;
  if(d.lengthSq()<.01){side=Math.random()<.5?1:-1;d.copy(right).multiplyScalar(side);}else side=d.dot(right)>=0?1:-1;d.normalize();
  if(this.ki>=.25&&inp.mx>.3){this.ki-=.25;afterimage(this);this.pos.addScaledVector(d,5);sfx('tele');return;}
  this.startDodge(d,inp.mx<-.3?'sway':inp.down?'duck':side>0?'dodgeL':'dodgeR',20);}
 startDodge(dir,pose,speed=16){this.setState('dodge',.24);this.dodgePose=pose;this.vel.copy(dir).multiplyScalar(speed*clamp(this.spd(),.7,1.6));this.invuln=Math.max(this.invuln,.16);this.tire(.1);sfx('dodge');vox(this,'dodge');}""")
# especiales
rep("const origin=this.hand(0),dir=this.opp.chest().sub(origin).normalize();const w=s.thin?.22:sp.isU?1.15:.55;",
 "if(s.tele){const op=this.opp,fw=op.fwd(),r=V3(-fw.z,0,fw.x);afterimage(this);this.pos.copy(op.pos).addScaledVector(r,(Math.random()<.5?1:-1)*7).addScaledVector(fw,3);sfx('tele');}vox(this,'shout');\n     const origin=this.hand(0),dir=this.opp.chest().sub(origin).normalize();const w=s.w??(s.thin?.22:sp.isU?1.15:.55);")
rep("base:sp.isU?2800:s.thin?1100:1400,","base:s.pow??(sp.isU?2800:s.thin?1100:1400),")
rep("const R=sp.isU?3.6:.9;","const R=s.size??(sp.isU?3.6:.9);")
rep("v=this.opp.chest().sub(from).normalize().multiplyScalar(sp.isU?24:32);","v=this.opp.chest().sub(from).normalize().multiplyScalar((sp.isU?24:32)*(s.spd||1));vox(this,'shout');")
rep("base:sp.isU?2700:1300,","base:s.pow??(sp.isU?2700:1300),")
rep("else{sp.pose=(Math.floor(sp.t*10)%2)?'blastR':'blastL';","else if(s.type==='rush')this.updateRush(dt,sp,s);\n  else if(s.type==='absorb')this.updateAbsorb(dt,sp,s);\n  else{sp.pose=(Math.floor(sp.t*10)%2)?'blastR':'blastL';")
rep("this.fireBlast(s.color,sp.fired%2?1:-1,{base:110,homing:.8,speed:52});","this.fireBlast(s.color,sp.fired%2?1:-1,{base:s.pow??110,homing:.8,speed:52});")
rep(" render(dt,t){const m=this.model;",""" /* Técnicas de golpes (Puño del Dragón, Meteor Explosion…): carga, embestida y ráfaga de golpes */
 updateRush(dt,sp,s){const op=this.opp;
  if(sp.phase==='charge'){sp.pose='windup';if(Math.random()<.8)spawn({pos:this.chest(),vel:rndDir().multiplyScalar(3),color:s.color,size:.8,life:.25});if(sp.t>=sp.dur){sp.phase='dash';sp.t=0;sfx('tele');vox(this,'shout');}return;}
  if(sp.phase==='dash'){sp.pose='fly';const to=op.chest().sub(this.chest()),d=to.length();this.pos.addScaledVector(to.normalize(),Math.min(d,75*dt));
   spawn({pos:this.chest(),color:s.color,size:s.dragon?3.2:1.4,life:s.dragon?.5:.22,op:.8});if(s.dragon&&Math.random()<.6)spawn({pos:this.chest().add(rndDir().multiplyScalar(1.2)),color:0xfff2a0,size:1.2,life:.4});
   if(d<2.4+this.reach()){sp.phase='hits';sp.t=0;sp.n=0;}else if(sp.t>.9)this.sp=null;return;}
  const N=s.hits||5,gap=.085;sp.pose=['punchR','punchL','kick','kickHigh','uppercut'][sp.n%5];
  if(sp.n<N&&sp.t>=gap*(sp.n+1)){sp.n++;const fin=sp.n===N,P=s.pow||2000,base=fin?P*.45:P*.55/Math.max(1,N-1);sfx('swing');
   applyHit(this,op,{base,kind:sp.isU?'ult':'special',knock:fin?30:0,up:fin?.6:.05,stun:.3,full:sp.full});sparks(op.chest(),s.color,8,10,.4);
   if(fin){explosion(op.chest(),s.dragon?3:1.8,s.color);if(s.dragon)for(let i=0;i<24;i++){const a=i/24*TAU*2;spawn({pos:op.chest().add(V3(Math.cos(a)*2,i*.35,Math.sin(a)*2)),color:0xffd040,size:2.2,life:.9});}vox(this,'heavy');}}
  if(sp.n>=N&&sp.t>gap*N+.3)this.sp=null;}
 /* Moro: absorbe vida y ki del rival a distancia */
 updateAbsorb(dt,sp,s){const op=this.opp,d=this.pos.distanceTo(op.pos);sp.pose='blastR';sp.tick=(sp.tick??.25)-dt;
  if(d<24+this.reach()&&op.state!=='ko'&&sp.t>.2){const from=op.chest().add(rndDir().multiplyScalar(.6)),dir=this.hand(1).sub(from);for(let i=0;i<2;i++)spawn({pos:from.clone().addScaledVector(dir,Math.random()*.3),vel:dir.clone().multiplyScalar(2.2),color:Math.random()<.5?s.color:0xd8a0ff,size:rand(.3,.6),life:.45});
   if(sp.tick<=0){sp.tick=.2;absorbTick(this,op);sfx('absorb');}}
  if(sp.t>=sp.dur)this.sp=null;}
 render(dt,t){const m=this.model;""")
rep("{const cs=m.root.scale.x;if(Math.abs(cs-this.giant)>.002)m.root.scale.setScalar(lerp(cs,this.giant,1-Math.exp(-3.5*dt)));}","{const gT=this.form.lightGiant?1:this.giant,cs=m.root.scale.x;if(Math.abs(cs-gT)>.002)m.root.scale.setScalar(lerp(cs,gT,1-Math.exp(-3.5*dt)));}")
rep("m.speed=this.vel.length();animateModel(m,dt*(game.phase?game.timescale:1),false);\n","""m.speed=this.vel.length();animateModel(m,dt*(game.phase?game.timescale:1),false);
  const av=this.avatar;if(av){GHOST_MAT.uniforms.uT.value=t;{const cs=av.root.scale.x;av.root.scale.setScalar(lerp(cs,this.giant,1-Math.exp(-3.5*dt)));}av.speed=m.speed;av.root.position.copy(this.pos);av.root.rotation.y=this.face;av.root.rotation.x=m.root.rotation.x;av.target=m.target;av.effort=m.effort;animateModel(av,dt*(game.phase?game.timescale:1),false);
   m.root.position.copy(this.pos).add(V3(0,1.1*this.giant-1,0)).addScaledVector(this.fwd(),.1*this.giant);
   if(Math.random()<.4)spawn({pos:this.pos.clone().add(V3(rand(-1,1)*this.giant*.4,rand(0,1.9)*this.giant,rand(-1,1)*this.giant*.3)),vel:V3(0,rand(2,6),0),color:0x9fe8ff,size:rand(.6,1.6),life:.6,op:.6});}
""")
rep("function afterimage(f){","""function absorbTick(m,op){if(game.phase!=='fight'||op.invuln>0||op.state==='transform'||op.state==='ko')return;const g=op.state==='guard'?.4:1,amt=op.maxHp*.018*g;
 op.hp=Math.max(game.mode==='train'?1:0,op.hp-amt);op.noHitT=0;op.ki=Math.max(0,op.ki-.22*g);m.hp=Math.min(m.maxHp,m.hp+amt*.6);op.drained=Math.min(1,op.drained+.045*g);
 if(Math.random()<.25){pop(op,'−ENERGÍA','#b0ff8a');vox(op,'effort');}if(op.hp<=0)ko(op,m);else checkThresholds(op);}
function afterimage(f){""")
# ---- daño
rep("if(dodge&&kind!=='ult'&&!game.struggle&&Math.random()<dodge){afterimage(def);const r=V3(-def.fwd().z,0,def.fwd().x);def.pos.addScaledVector(r,Math.random()<.5?2.5:-2.5);pop(def,'¡ESQUIVA!','#e8f0ff');sfx('tele');return false;}",
 """if(dodge&&kind!=='ult'&&!game.struggle&&Math.random()<dodge&&def.state!=='special'){const fw=def.fwd(),r=V3(-fw.z,0,fw.x),side=Math.random()<.5?1:-1,mode=Math.random(),ft=def.fatigue;
  for(let i=0;i<3;i++)spawn({pos:def.chest().add(V3(rand(-.2,.2),rand(-.5,.4),rand(-.2,.2))),color:0xdfe8ff,size:.7,life:.25,op:.5});
  if(mode<.35)def.startDodge(fw.clone().multiplyScalar(-1),'sway',12);else if(mode<.55&&kind!=='blast')def.startDodge(V3(0,-1,0).addScaledVector(fw,-.3).normalize(),'duck',8);else{def.pos.addScaledVector(r,side*1.2);def.startDodge(r.multiplyScalar(side),side>0?'dodgeL':'dodgeR',16);}
  def.fatigue=ft;pop(def,def.ch.id==='whis'?WHIS_QUIPS[Math.random()*WHIS_QUIPS.length|0]:'¡ESQUIVA!','#e8f0ff');return false;}""")
rep("const R=att.power()/def.power();let dmg;","const R=def.role==='dummy'?1:att.power()/def.power();let dmg;")
rep("const cp=def.chest(),big=kind!=='light';","const cp=def.chest(),big=kind!=='light';if(Math.random()<(big?.9:.45))vox(def,big?'hurtBig':'hurt');def.tire(.02);")
rep("function ko(def,att){if(isGuest()){def.hp=Math.max(1,def.hp);return;}def.hp=0;","function ko(def,att){if(isGuest()){def.hp=Math.max(1,def.hp);return;}def.hp=0;vox(def,'ko');")
# ---- proyectiles y rayos
rep("const tgt=p.owner?p.owner.opp:null;","const tgt=p.target||(p.owner?p.owner.opp:null);")
rep("p.pos.addScaledVector(p.vel,dt);p.mesh.position.copy(p.pos);","p.pos.addScaledVector(p.vel,dt);p.mesh.position.copy(p.pos);\n  if(p.kind==='shard'){p.mesh.rotation.x+=dt*8;if(tgt&&tgt.state!=='ko'&&p.pos.distanceTo(tgt.chest())<1.4*tgt.giant+.4){envDamage(tgt,280,'¡FRAGMENTO!');sparks(p.pos,0xe0c8ff,12,12,.4);sfx('tink');fxGroup.remove(p.mesh);projs.splice(i,1);continue;}}")
rep("S.t+=dt;const A=S.a,B=S.b;","S.t+=dt;const A=S.a,B=S.b;if(Math.random()<dt*1.3)vox(Math.random()<.5?A:B,'shout');")
# ---- cámara
rep("tp=f.pos.clone().addScaledVector(fw,-3).addScaledVector(rt,-1.5).add(V3(0,1.6*f.sy(),0));","tp=f.pos.clone().addScaledVector(fw,-3.4*f.giant).addScaledVector(rt,-1.6*f.giant).add(V3(0,1.6*f.sy(),0));")
rep("if(bossMode())mid.y+=b.giant*.5;","if(bossMode())mid.y+=b.giant*.5;else{const g=Math.max(a.giant,b.giant);if(g>1)mid.y+=g*.6;}")
rep("const tp=mid.clone().addScaledVector(n,dist).add(V3(0,1.9+sep*.12,0));","const tp=mid.clone().addScaledVector(n,dist).add(V3(0,2.2+sep*.12,0));")
rep("camLook.lerp(mid.add(V3(0,.9,0)),k);}","camLook.lerp(mid.add(V3(0,1.25,0)),k);}")
rep("""if(bossMode()&&bossF()){const B=bossF(),bc=B.chest(),min=B.giant*4.5,dd=cam.position.distanceTo(bc);
  if(dd<min){let dir=cam.position.clone().sub(bc);if(dir.lengthSq()<1e-4){const [pa]=camAnchors();dir=pa.pos.clone().sub(bc);dir.y=Math.max(dir.y,0)+1;}dir.normalize();cam.position.copy(bc).addScaledVector(dir,min);}}""",
 """for(const B of game.f){if(B.giant<2)continue;const bc=B.chest(),min=B.giant*4.5,dd=cam.position.distanceTo(bc);
  if(dd<min){let dir=cam.position.clone().sub(bc);if(dir.lengthSq()<1e-4){const [pa]=camAnchors();dir=pa.pos.clone().sub(bc);dir.y=Math.max(dir.y,0)+1;}dir.normalize();cam.position.copy(bc).addScaledVector(dir,min);}}""")
# ---- HUD
rep("const i=f.idx,fr=Math.max(0,f.hp/f.maxHp);$('#hc'+i).style.width=(fr*100)+'%';$('#hc'+i).classList.toggle('low',fr<.25);$('#hl'+i).style.width=(fr*100)+'%';",
 "const i=f.idx,fr=Math.max(0,f.hp/f.maxHp),wr=Math.max(0,f.hp/Math.max(f.maxHp,f.baseMaxHp));$('#hc'+i).style.width=(wr*100)+'%';$('#hc'+i).classList.toggle('low',fr<.25);$('#hl'+i).style.width=(wr*100)+'%';")
rep("+(f.state==='ko'?' · FUERA':'');","+(f.fatigue>.6?(f.fatigue>.85?' · AGOTADO':' · CANSADO'):'')+(f.drained>.05?' · DRENADO '+Math.round(f.drained*100)+' %':'')+(f.state==='ko'?' · FUERA':'');")
rep("(f.role==='dummy'?' (MUÑECO)':","(f.role==='dummy'?' (MAESTRO)':")
rep("de daño · <b>${a.comboHits}</b> golpes<br>El muñeco se recupera solo y tu ki se recarga solo`;","de daño · <b>${a.comboHits}</b> golpes<br><b>Whis:</b> «${WHIS_TIPS[Math.floor(game.roundT/7)%WHIS_TIPS.length]}»`;")
rep("porRenderer.setSize(96,96);","porRenderer.setSize(128,128);")
rep("const s=m.body.scale.y*CHIBI*HEADK,hs=(ch.head?ch.head[1]:1);\n porCam.position.set(hp.x+.2*s,hp.y+.02*s,hp.z+.82*s*hs);porCam.lookAt(hp.x,hp.y-.03*s,hp.z);",
 "const s=m.body.scale.y*.68,hs=(ch.head?ch.head[1]:1);\n porCam.position.set(hp.x+.2*s,hp.y+.02*s,hp.z+.88*s*hs);porCam.lookAt(hp.x,hp.y-.06*s,hp.z);")
rep("g.drawImage(renderPortrait(f.ch,f.formIdx),0,0);","g.drawImage(renderPortrait(f.ch,f.formIdx),0,0,96,96);")
# ---- partida
rep("world=WORLDS[game.world].build(game.variant);SUN_DIR.copy(sun.position).normalize();\n const M=game.mode,D=DIFFS[game.diff];","const M=game.mode,D=DIFFS[game.diff];world=curWorldDef().build(M==='train'?0:game.variant);SUN_DIR.copy(sun.position).normalize();")
rep("playTrack(WORLDS[game.world].music);startRound();}","playTrack(curWorldDef().music);startRound();}",2)
rep("const W=WORLDS[game.world].name;","const W=curWorldDef().name;")
rep("showMsg('ENTRENAMIENTO',game.f[0].ch.name+' vs muñeco: '+game.f[1].ch.name,1.1);","showMsg('ENTRENAMIENTO',game.f[0].ch.name+' entrena con Whis · Planeta de Bills',1.4);")
# ---- bucle: zumbido del aura
rep("followSun(camLook);drawFx2d(rdt);musicTick();","followSun(camLook);drawFx2d(rdt);musicTick();setHum(game.phase?Math.max(0,...game.f.map(f=>f.aura.level)):0);")
# ---- menús
rep("const p2Label=(short)=>game.mode==='train'?(short?'MUÑ':'MUÑECO'):","const p2Label=(short)=>game.mode==='train'?'WHIS':")
rep("['Teletransporte / esquiva','Y','O','Num6']","['Esquiva (de lado, atrás o abajo) · hacia el rival: teletransporte','Y','O','Num6']")
rep("['💨','Teletransporte / esquiva']","['💨','Esquiva de lado o hacia atrás; hacia el rival te teletransportas']")
rep("<button class=\"btn\" ${NOFOCUS} data-act=\"toState\" data-arg=\"world\">← VOLVER</button>`","<button class=\"btn\" ${NOFOCUS} data-act=\"toState\" data-arg=\"${game.mode==='train'?'chars':'world'}\">← VOLVER</button>`")
rep("'<br>6. Entrenamiento: el muñeco no ataca, se recupera solo y tu ki se recarga solo.'","'<br>6. Entrenamiento: Whis no ataca, esquiva como el Ultra Instinto dominado y tu ki se recarga solo.'")
rep("5. Con menos del 25 % de vida llega la Ira: tu siguiente especial atraviesa el muro de poder.${extra}","5. Con menos del 25 % de vida llega la Ira: tu siguiente especial atraviesa el muro de poder.<br>· Cansancio: atacar y esquivar sin parar te vuelve lento. Quédate quieto para respirar.${extra}")
rep("<div class=\"logo\">KAIOKEN<br>CLASH<small>","<div class=\"logo\">KAIOKEN<br>CLASH<span class=\"ul\">ULTRA</span><small>")
rep('<span class="k">F2</span> pixelado · <span class="k">F3</span> filtro CRT · <span class="k">M</span> música','<span class="k">F2</span> calidad · <span class="k">V</span> voces · <span class="k">M</span> música',2)
rep("""${TOUCHM?'<button class="btn" data-act="toggleMusic" style="font-size:15px">MÚSICA</button>':''}</div>""","""<button class="btn" data-act="toggleMusic" style="font-size:15px">MÚSICA</button><button class="btn" data-act="toggleVoices" style="font-size:15px">VOCES: ${voicesOn?'SÍ':'NO'}</button></div>""")
rep("""${TOUCHM?'<button class="btn" data-act="toggleMusic">MÚSICA</button>':''}<button class="btn" ${NOFOCUS} data-act="toMainMenu">""","""${TOUCHM?'<button class="btn" data-act="toggleMusic">MÚSICA</button><button class="btn" data-act="toggleVoices">VOCES</button>':''}<button class="btn" ${NOFOCUS} data-act="toMainMenu">""")
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
rep("cam.position.set(0,world.spawnY+1.5,6.6);cam.lookAt(0,world.spawnY+1.75,0);","cam.position.set(0,world.spawnY+1.45,6.4);cam.lookAt(0,world.spawnY+1.2,0);")
rep("cam.position.set(0,world.spawnY+.9*g+.5,3.4+3.6*g);cam.lookAt(0,world.spawnY+.55*g,0);","cam.position.set(0,world.spawnY+1.1*g+.5,3.4+3.8*g);cam.lookAt(0,world.spawnY+.8*g,0);")
rep("if(world&&world.wmat)world.wmat.uniforms.uT.value+=dt;","if(world&&world.wmat)world.wmat.uniforms.uT.value+=dt;if(world&&world.anim)world.anim(dt);")
rep("""if(code==='F2'){PIX=PIX>=3?1:PIX+1;store.set('kc_pix',PIX);resize();return;}
 if(code==='F3'){$('#crt').classList.toggle('off');return;}""","""if(code==='F2'){QUAL=QUALS[(QUALS.indexOf(QUAL)+1)%QUALS.length];store.set('kc_q',QUAL);applyQual();resize();return;}
 if(code==='KeyV'&&(menuState||game.paused||!game.phase)){voicesOn=!voicesOn;store.set('kc_voices',voicesOn);if(menuState==='title')renderMenu();return;}""")
rep("if(musBus)musBus.gain.value=musicOn?.28:0;","if(musBus)musBus.gain.value=musicOn?.3:0;")
rep("toState:a=>{if(a==='world'||a==='title'){menuState=a;renderMenu();}}","toState:a=>{if(a==='world'||a==='title'){menuState=a;renderMenu();}else if(a==='chars'){menuState='chars';pst=['form','ready'];renderMenu();}}")
rep("toggleMusic:()=>onKey('KeyM'),","""toggleMusic:()=>onKey('KeyM'),toggleVoices:()=>onKey('KeyV'),
 shopTab:a=>{if(a==='forms'||a==='tech'){shopTab=a;shopConfirm=-1;sfx('sel');renderMenu();}},
 buyTech:a=>{const t=TECHS.find(x=>x.id===a);if(!t||ownsTech(t.id))return;if(prog.coins<t.price){shopConfirm=-1;sfx('back');renderMenu();return;}if(shopConfirm!==t.id){shopConfirm=t.id;sfx('sel');renderMenu();return;}shopConfirm=-1;if(buyTech(t))sfx('ok');renderMenu();},
 equipTech:a=>{const[slot,id]=String(a).split(':');if(slot!=='s1'&&slot!=='ult')return;const cid=CHARS[shopChar].id,e=prog.eq[cid]=prog.eq[cid]||{};if(!id)delete e[slot];else{const t=TECHS.find(x=>x.id===id);if(!t||!ownsTech(id)||!t.who.includes(cid)||t.slot!==slot)return;e[slot]=id;}saveProg();sfx('ok');renderMenu();},""")
# tienda
a=src.index(" else if(menuState==='shop'){const ch=CHARS[shopChar];")
b=src.index("function refreshMenuModels(){")
src=src[:a]+""" else if(menuState==='shop'){const ch=CHARS[shopChar],isT=shopTab==='tech';let rows;
  if(!isT)rows=ch.forms.map((f,i)=>{const own=owns(ch,i),pr=formPrice(ch,i),can=prog.coins>=pr;
   const act=own?`<span class="ok">${isFree(ch,i)?'GRATIS':'TUYA'}</span>`:shopConfirm===i?`<button class="btn sbtn" data-act="buy" data-arg="${i}">¿CONFIRMAR? 🪙 ${pr}</button>`:`<button class="btn sbtn${can?'':' off'}" data-act="buy" data-arg="${i}">🪙 ${pr}</button>`;
   return`<div class="grow"><span>${own?'':'🔒 '}${f.name}<em>${fmtP(ch.base*f.mult)}</em></span>${act}</div>`;}).join('');
  else{const list=TECHS.filter(t=>t.who.includes(ch.id)),eq=prog.eq[ch.id]||{},slotL=s=>s==='ult'?'DEFINITIVO · E+H':'ESPECIAL · E';
   const defRow=slot=>{const d=slot==='ult'?ch.ult:ch.s1;return`<div class="grow"><span>${d.name}<em>${slotL(slot)} · de serie</em></span>${!eq[slot]?'<span class="ok">EQUIPADA</span>':`<button class="btn sbtn" data-act="equipTech" data-arg="${slot}:">EQUIPAR</button>`}</div>`;};
   rows=defRow('s1')+defRow('ult')+(list.length?list.map(t=>{const own=ownsTech(t.id),on=eq[t.slot]===t.id,can=prog.coins>=t.price;
    const act=on?'<span class="ok">EQUIPADA</span>':own?`<button class="btn sbtn" data-act="equipTech" data-arg="${t.slot}:${t.id}">EQUIPAR</button>`:shopConfirm===t.id?`<button class="btn sbtn" data-act="buyTech" data-arg="${t.id}">¿CONFIRMAR? 🪙 ${t.price}</button>`:`<button class="btn sbtn${can?'':' off'}" data-act="buyTech" data-arg="${t.id}">🪙 ${t.price}</button>`;
    return`<div class="grow"><span>${own?'':'🔒 '}${t.name}<em>${slotL(t.slot)} · ${TYPE_LABEL[t.type]} · <span class="stars">${techStars(t)}</span></em></span>${act}</div>`;}).join(''):'<div class="tip" style="margin-top:8px">Este luchador no tiene técnicas extra en la tienda.</div>');}
  m.innerHTML=`${backBtn()}<div class="ttl">TIENDA · ${coinTag()}</div>
  <div class="tabs"><button class="btn sbtn${isT?' off':''}" data-act="shopTab" data-arg="forms">FORMAS</button><button class="btn sbtn${isT?'':' off'}" data-act="shopTab" data-arg="tech">TÉCNICAS</button></div>
  <div class="grid">${CHARS.map((c,i)=>{const n=isT?TECHS.filter(t=>t.who.includes(c.id)&&!ownsTech(t.id)).length:c.forms.filter((_,j)=>!owns(c,j)).length;return`<div class="cell" data-act="shopPick" data-arg="${i}"><img src="${PORTRAITS[i]}" alt="">${c.name}<br><span style="color:${n?'#c8cce0':'#7dff7a'}">${n?n+' 🔒':'✔ todo'}</span>${i===shopChar?'<div class="cur"></div>':''}</div>`;}).join('')}</div>
  <div class="gcol shop" style="margin-top:10px;width:min(96vw,680px);flex:none">${rows}</div>
  <div class="hint keep" style="margin-top:8px">${isT?'Las técnicas compradas sustituyen al especial (E) o al definitivo (E+H) de ese luchador, con los mismos botones. Las ★ indican su fuerza.':'Ganas monedas al vencer a la CPU o a un jefe (más en difícil y contra jefes; +50 con la primera victoria del día). Entrenamiento y Versus 2P no dan monedas.'}</div>`;
  m.style.justifyContent='flex-start';}}
"""+src[b:]
out=D+'stage18b.js'
open(out,'w',encoding='utf8').write(src)
print('ok',len(src))
