/* Kaioken Clash clásico: piezas chibi de los luchadores nuevos de Ultra (Kefla, Gamma 1 y 2, Moro, Whis) y de los extras añadidos */
/* 2.2: peinados Saiyajin más fieles al anime (puntas afiladas, flequillos propios de cada forma, melenas que caen por la espalda) */
const HM=(...a)=>a.flatMap(s=>s[0]?[s,[-s[0],s[1],s[2],s[3],-s[4],s[5],s[6]]]:[s]);
const HS=(l,k,r=1)=>l.map(s=>[s[0],s[1],s[2],s[3],s[4],s[5]*k,s[6]*r]);
const GOKU_C=HM([0,.15,-.04,-.55,0,.3,.08],[.09,.13,-.02,-.2,-.85,.28,.075],[.14,.05,-.04,-.3,-1.45,.26,.07],[0,.07,-.14,-1.7,0,.27,.075],[.08,.03,-.13,-1.9,-.6,.24,.065],[.05,.14,-.09,-.9,-.4,.27,.07]);
const GOKU_B=[[.06,.13,.12,1.25,-.55,.18,.05],[-.05,.13,.12,1.7,.45,.17,.045],[0,.14,.12,2.1,.1,.14,.045]];
const SSJ_C=HM([0,.15,-.03,-.25,0,.44,.085],[.07,.14,-.01,-.08,-.42,.42,.078],[.12,.1,-.02,-.05,-.85,.36,.072],[.15,.04,-.03,-.1,-1.25,.28,.065],[.05,.12,-.1,-.65,-.25,.38,.075],[0,.07,-.14,-1.35,0,.32,.075],[.09,.03,-.12,-1.7,-.55,.26,.065]);
const SSJ_B=[[.055,.14,.135,2.45,-.4,.15,.045],[-.06,.14,.135,2.4,.45,.14,.042],[0,.15,.13,2.3,-.05,.12,.04]];
const MANE=(k)=>HM([0,.05,-.14,-2.92,0,.55*k,.115],[.08,.04,-.12,-2.9,-.18,.52*k,.105],[.13,.01,-.06,-2.95,-.3,.45*k,.09],[0,-.04,-.15,-3.0,0,.5*k,.1]);
HAIR.goku={cap:1,tip:.12,sp:GOKU_C.concat(GOKU_B)};
HAIR.ssj={cap:1,tip:.1,sp:SSJ_C.concat(SSJ_B)};
HAIR.ssj2={cap:1,tip:.08,sp:SSJ_C.map(s=>[s[0],s[1],s[2],s[3]*.9,s[4]*.85,s[5]*1.1,s[6]]).concat([[-.05,.14,.135,2.5,.35,.18,.042]])};
HAIR.ssj3={cap:1,tip:.12,sp:HS(SSJ_C.slice(0,7),.75).concat(MANE(1),[[-.05,.14,.135,2.55,.3,.21,.042]])};
HAIR.ssj4={cap:1,tip:.12,sp:HS(GOKU_C,1.2,1.1).concat(MANE(.72),GOKU_B,[[.02,.13,.13,2.3,-.1,.17,.04]])};
HAIR.gohan={cap:1,tip:.14,sp:HS(GOKU_C,.8).concat([[.0,.13,.13,2.0,.1,.18,.045]])};
HAIR.vegeta={cap:1,tip:.1,sp:HM([0,.17,-.03,-.12,0,.5,.09],[.07,.16,-.02,-.1,-.3,.46,.08],[.12,.12,-.03,-.1,-.6,.4,.075],[.15,.06,-.03,-.1,-.95,.3,.065],[0,.13,-.1,-.5,0,.44,.08],[.07,.12,-.1,-.45,-.3,.4,.075]).concat([[0,.15,.115,2.75,0,.07,.05]])};
HAIR.broly={cap:1,tip:.14,sp:HM([0,.15,-.03,-.4,0,.3,.085],[.1,.12,0,-.1,-.75,.28,.075],[.15,.04,-.03,-.2,-1.3,.24,.065],[0,.04,-.14,-2.6,0,.38,.105],[.09,.02,-.12,-2.65,-.3,.34,.095],[.14,-.02,-.04,-2.8,-.55,.28,.08]).concat([[.05,.12,.13,1.9,-.3,.16,.045],[-.05,.12,.13,2.1,.35,.15,.04]])};
HAIR.brolyL={cap:1,tip:.1,sp:HM([0,.15,-.04,-.45,0,.5,.1],[.08,.14,-.02,-.3,-.5,.46,.09],[.13,.09,-.03,-.3,-.95,.4,.085],[.15,.02,-.05,-.5,-1.35,.32,.075],[0,.08,-.14,-1.3,0,.42,.09],[.08,.05,-.12,-1.5,-.45,.38,.085],[0,-.02,-.15,-2.2,0,.3,.08]).concat([[.04,.12,.13,2.0,-.3,.17,.045],[-.05,.12,.13,2.2,.4,.15,.04]])};
HAIR.beast={cap:1,tip:.08,sp:[[0,.16,-.04,-.25,0,.7,.105],[.08,.13,-.03,-.2,-.35,.52,.08],[-.08,.13,-.03,-.2,.35,.52,.08],[.12,.08,-.04,-.25,-.75,.36,.07],[-.12,.08,-.04,-.25,.75,.36,.07],[0,.1,-.12,-.9,0,.46,.08],[.04,.1,.14,2.1,-.2,.2,.04]]};
HAIR.vegetto={cap:1,tip:.12,sp:GOKU_C.concat([[.06,.1,.15,2.0,-.3,.2,.04]])};
HAIR.vegettoSS={cap:1,tip:.1,sp:HS(SSJ_C,1.08).concat([[.06,.1,.15,2.0,-.3,.22,.04]])};
HAIR.gogeta={cap:1,tip:.12,sp:GOKU_C.concat([[.05,.1,.15,2.1,-.35,.2,.045],[-.06,.1,.15,2.1,.4,.18,.04]])};
HAIR.gogetaSS={cap:1,tip:.1,sp:SSJ_C.concat([[.05,.1,.15,2.2,-.35,.22,.045],[-.06,.1,.15,2.2,.4,.2,.04]])};
HAIR.gogeta4={cap:1,tip:.12,sp:HAIR.ssj4.sp.concat([[.05,.1,.15,2.1,-.35,.22,.045],[-.06,.1,.15,2.1,.4,.2,.04]])};
/* 3.1: melenas de Super Saiyajin 4 (Daima) y de Vegeta Super Saiyajin 3 */
HAIR.ssj4d={cap:1,tip:.1,sp:HS(GOKU_C,1.4,1.25).concat(MANE(1.05),HM([.15,.0,-.1,-2.7,-.55,.5,.1]),GOKU_B,[[.02,.13,.13,2.3,-.1,.18,.045]])};
HAIR.vegeta4d={cap:1,tip:.1,sp:HS(HAIR.vegeta.sp,.85,1.05).concat(MANE(.55))};
HAIR.vegeta3={cap:1,tip:.1,sp:HS(HAIR.vegeta.sp.slice(0,11),.8).concat(MANE(1.05))};
(()=>{const b=CHARS.find(c=>c.id==='broly');if(b)b.forms.forEach(f=>{if(f.id==='ssj'||f.id==='lssj')f.hair='brolyL';});})();
HAIR.kefla={cap:1,sp:HAIR.ssj.sp.map(s=>[s[0]*1.12,s[1],s[2]*1.1,s[3]*1.15,s[4]*1.2,s[5]*1.3,s[6]*1.1])};
HAIR.gamma1={cap:1,sp:[[0,.15,0,-.45,0,.2,.075],[.1,.12,.02,-.3,-.85,.18,.065],[-.1,.12,.02,-.3,.85,.18,.065],[.05,.12,.12,1.1,-.2,.14,.05],[-.05,.12,.12,1.1,.2,.14,.05]]};
HAIR.gamma2={cap:1,sp:[[0,.16,.07,.75,0,.3,.095],[.07,.15,.05,.55,-.3,.26,.08],[-.07,.15,.05,.55,.3,.26,.08],[0,.1,-.12,-1.6,0,.18,.07],[.12,.06,-.04,-.6,-1.2,.16,.06],[-.12,.06,-.04,-.6,1.2,.16,.06]]};
HAIR.whis={cap:1,sp:[[0,.17,-.03,-.1,0,.62,.1],[0,.15,.05,.2,0,.46,.085],[.05,.15,0,-.05,-.15,.5,.08],[-.05,.15,0,-.05,.15,.5,.08]]};
/* 2.0: peinados de los luchadores del modo historia */
HAIR.raditz={cap:1,sp:HAIR.goku.sp.slice(0,5).concat([[0,.06,-.15,-2.75,0,.95,.11],[.09,.04,-.13,-2.8,-.18,.92,.1],[-.09,.04,-.13,-2.8,.18,.92,.1],[0,-.04,-.15,-2.95,0,.9,.1],[.13,0,-.08,-2.9,-.4,.8,.08],[-.13,0,-.08,-2.9,.4,.8,.08]])};
HAIR.gohanks={cap:1,sp:HAIR.gohan.sp.map(s=>[s[0],s[1],s[2],s[3]*.8,s[4],s[5]*.9,s[6]]).concat([[.06,.1,.15,2.3,-.3,.18,.04]])};
HAIR.granolah={cap:1,sp:[[0,.16,-.02,-.35,0,.3,.08],[.09,.14,0,-.2,-.6,.26,.07],[-.09,.14,0,-.2,.6,.26,.07],[.05,.12,.12,1.6,-.25,.16,.05],[-.05,.12,.12,1.6,.25,.16,.05],[0,.08,-.14,-1.9,0,.24,.07]]};
/* 3.2: Gas (manga): melena larga echada hacia atrás hasta la espalda; con el deseo envejece y la melena crece; más allá del límite se eriza */
HAIR.gas={cap:1,tip:.1,sp:HM([0,.16,-.03,-1.15,0,.3,.09],[.08,.14,-.03,-1.3,-.25,.29,.085],[.13,.09,-.05,-1.6,-.5,.27,.075],[.15,.02,-.07,-2.1,-.7,.25,.065]).concat(MANE(.85))};
HAIR.gasW={cap:1,tip:.08,sp:HM([0,.16,-.03,-1.1,0,.36,.095],[.08,.14,-.03,-1.3,-.25,.35,.09],[.13,.09,-.05,-1.65,-.5,.33,.08],[.15,.01,-.07,-2.3,-.6,.4,.07]).concat(MANE(1.25))};
HAIR.gasL={cap:1,tip:.08,sp:HM([0,.17,-.02,-.75,0,.4,.1],[.09,.15,-.02,-.95,-.4,.38,.09],[.14,.1,-.04,-1.3,-.75,.34,.08],[.16,.02,-.06,-2,-.8,.36,.07]).concat(MANE(1.3))};
const NUMTEX={};
function numTex(n){const k=n.t+n.c;return NUMTEX[k]||(NUMTEX[k]=canvasTex(64,g=>{g.fillStyle=n.c;g.font='bold 56px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(n.t,32,36);}));}
function chibiExtras(model,e,add,cone){const J=model.J,m=model.mats;
 if(e==='ramHorns'||e==='ramHornsBig'){const k=e==='ramHornsBig'?1.3:1;for(const s of[1,-1])add(new THREE.TorusGeometry(.055*k,.022*k,8,16,Math.PI*1.5),m.ex1,J.head,s*.16,.22,-.02,0,s*Math.PI/2,s*.6);}
 if(e==='beard'){add(new THREE.ConeGeometry(.07,.26,10),m.ex1,J.head,0,-.08,.1,Math.PI+.3);}
 if(e==='beardShort'){add(new THREE.ConeGeometry(.055,.12,10),m.ex1,J.head,0,-.02,.12,Math.PI+.4);}
 if(e==='robe'){add(new THREE.CylinderGeometry(.2,.3,.4,20,1,true),m.ex2,J.hips,0,-.17,0);add(new THREE.CylinderGeometry(.13,.2,.1,20,1,true),m.ex2,J.torso,0,.44,0);}
 if(e==='gem'){add(new THREE.OctahedronGeometry(.03),new THREE.MeshBasicMaterial({color:0xff3a6a}),J.head,0,.24,.15).scale.set(1,1.4,.6);}
 if(e==='rocky'){for(let i=0;i<9;i++){const a=i/9*TAU;add(new THREE.DodecahedronGeometry(.05+.025*Math.random(),0),m.top,J.torso,Math.cos(a)*.24,.18+Math.random()*.25,Math.sin(a)*.17);}}
 if(e==='halo'){add(new THREE.TorusGeometry(.12,.022,8,24),m.ex2,J.torso,0,.47,-.02,Math.PI/2);}
 if(e==='staff'){add(new THREE.CylinderGeometry(.012,.012,1.1,8),m.ex1,J.elR,0,-.12,.03);add(Sph(.04,12,8),m.ex2,J.elR,0,.44,.03);}
 if(e==='namekPatches'){for(const L of['L','R']){const s=L==='L'?1:-1;add(Sph(.032,10,8),m.ex1,J['sh'+L],s*.05,-.08,.02).scale.set(.8,1.3,1);add(Sph(.028,10,8),m.ex1,J['el'+L],s*.04,-.06,.02).scale.set(.8,1.4,1);}}
 if(e==='furTail'||e==='catTail'){const cat=e==='catTail',mt=cat?m.skin:m.top;let parent=J.hips;const segs=[];
  for(let i=0;i<5;i++){const g=new THREE.CylinderGeometry(cat?.022:.035,(cat?.028:.055)-.004*i,.26,10);g.translate(0,.13,0);const p=add(g,mt,parent,0,i===0?-.02:.26,i===0?-.12:0,i===0?2.2:.35);segs.push(p);parent=p;}model.tail=segs;}
 if(e==='egyptGold'){for(const L of['L','R']){add(new THREE.CylinderGeometry(.07,.07,.04,14),m.ex1,J['el'+L],0,-.12,0);add(new THREE.CylinderGeometry(.078,.078,.04,14),m.ex1,J['kn'+L],0,-.1,0);}}
 if(e==='gammaHead1'||e==='gammaHead2'){for(const s of[1,-1])add(Sph(.032,10,8),m.ex1,J.head,s*.168,.13,0).scale.set(.6,1,1);}
 if(e==='gammaCoat'){add(new THREE.CylinderGeometry(.2,.26,.3,20,1,true),m.top,J.hips,0,-.12,0);add(new THREE.CylinderGeometry(.07,.085,.08,14),m.top,J.torso,0,.45,0);}
 if(e==='tallBoots'){for(const L of['L','R'])add(new THREE.CylinderGeometry(.078,.07,.16,14),m.boots,J['kn'+L],0,-.1,0);}
 if(e==='apeMuzzle'){add(Sph(.11,16,12),m.ex1,J.head,0,.07,.12).scale.set(1.2,.85,1);for(const s of[1,-1])add(Sph(.016,8,6),m.mouth,J.head,s*.04,.1,.225);}
 if(e==='apeEars'){for(const s of[1,-1])add(Sph(.05,12,8),m.ex1,J.head,s*.18,.16,-.01).scale.set(.5,1,.9);}
 if(e==='mustache'){for(const s of[1,-1]){const b=add(Bx(.09,.025,.02),m.hair,J.head,s*.04,.06,.16);b.rotation.z=-s*.35;}}
 if(e==='scarfRed'){add(new THREE.TorusGeometry(.1,.035,8,18),m.ex1,J.torso,0,.44,0,Math.PI/2);add(Bx(.07,.22,.025),m.ex1,J.torso,-.08,.32,-.16,-.2,0,.25);}
 if(e==='hildCrest'){for(let i=0;i<4;i++)add(cone(.035,.16,6),m.ex1,J.head,0,.27-i*.05,-.06-i*.05,-.6-i*.35);for(const s of[1,-1])add(cone(.05,.2,6),m.ex1,J['sh'+(s>0?'L':'R')],0,.05,0,0,0,-s*.6);}
 /* 3.0: piezas de los trajes (cada outfit cambia la forma, no solo el color) */
 if(e==='giCollar'){for(const sd of[1,-1])add(Bx(.032,.21,.02),m.belt,J.torso,sd*.055,.35,.172,0,0,sd*.42);add(new THREE.TorusGeometry(.085,.022,6,16),m.belt,J.torso,0,.44,.01,Math.PI/2);}
 if(e==='tunic'){add(new THREE.CylinderGeometry(.25,.31,.38,20,1,true),m.ex1,J.torso,0,.13,0).scale.set(1.12,1,.95);add(new THREE.CylinderGeometry(.27,.27,.04,20),m.ex2,J.torso,0,-.04,0).scale.set(1.12,1,.95);}
 if(e==='bigCollar'){const c=add(new THREE.TorusGeometry(.14,.055,8,22),m.ex1,J.torso,0,.44,0,Math.PI/2);c.scale.set(1.25,1.25,1);}
 if(e==='jacket'){for(const sd of[1,-1]){add(Bx(.13,.36,.035),m.ex1,J.torso,sd*.13,.25,.175,0,sd*.25,0);add(Bx(.08,.1,.03),m.ex1,J.torso,sd*.09,.43,.15,-.5,sd*.3,sd*.3);}add(Bx(.46,.38,.03),m.ex1,J.torso,0,.25,-.18);}
 if(e==='ccLogo'){const g=new THREE.Mesh(new THREE.PlaneGeometry(.09,.09),new THREE.MeshBasicMaterial({map:canvasTex(64,(c,S)=>{c.fillStyle='#fff';c.beginPath();c.arc(32,32,30,0,TAU);c.fill();c.fillStyle='#2a5ad8';c.font='bold 30px monospace';c.textAlign='center';c.textBaseline='middle';c.fillText('CC',32,34);}),transparent:true}));g.position.set(-.13,.34,.2);g.rotation.y=-.25;J.torso.add(g);model.extras.push(g);}
 if(e==='strawHat'){const hm=toon(0xe0c070);add(new THREE.CylinderGeometry(.34,.34,.025,22),hm,J.head,0,.31,-.01,-.12);add(new THREE.CylinderGeometry(.15,.17,.13,18),hm,J.head,0,.37,-.02,-.12);add(new THREE.CylinderGeometry(.172,.172,.03,18),m.ex2,J.head,0,.33,-.02,-.12);}
 if(e==='patrolVest'){add(new THREE.CylinderGeometry(.25,.25,.3,20,1,true),m.ex1,J.torso,0,.3,0).scale.set(1.15,1,.95);for(const L of['L','R'])add(Sph(.095,14,10),m.ex2,J['sh'+L],0,.03,0).scale.set(1,.6,1.1);}
 if(e==='saiyaman'){add(new THREE.CylinderGeometry(.18,.18,.07,20),m.ex1,J.head,0,.21,0);add(Bx(.17,.035,.02),new THREE.MeshBasicMaterial({color:0x111111}),J.head,0,.16,.165);add(Bx(.42,.62,.02),m.ex2,J.torso,0,.12,-.2,.12);}
 if(e==='turban'){add(new THREE.SphereGeometry(.2,18,12,0,TAU,0,Math.PI*.5),m.ex1,J.head,0,.17,-.01).scale.set(1.06,1.1,1.06);}
 if(e==='policeCap'){add(new THREE.CylinderGeometry(.17,.18,.09,18),m.ex1,J.head,0,.3,0);add(Bx(.2,.02,.1),m.ex2,J.head,0,.26,.15,.2);}
 if(e==='mechaPlates'){const pm=toon(0xa8b4c4);add(Bx(.09,.06,.02),pm,J.head,.07,.1,.16);add(Bx(.18,.14,.03),pm,J.torso,.06,.3,.19,0,.2,0);for(const L of['L','R'])add(new THREE.CylinderGeometry(.065,.065,.12,10),pm,J['el'+L],0,-.08,0);}
 if(e==='nightcap'){const c=add(new THREE.ConeGeometry(.14,.34,12),m.ex1,J.head,.04,.36,-.04,-.5,0,-.4);add(Sph(.04,8,6),m.ex2,c,0,.17,0);}
 if(e==='longCoat'){add(new THREE.CylinderGeometry(.25,.35,.56,20,1,true),m.ex1,J.hips,0,-.15,0).scale.set(1.05,1,.95);add(new THREE.TorusGeometry(.12,.04,8,18),m.ex1,J.torso,0,.44,0,Math.PI/2);}
 if(e==='sash'){add(new THREE.CylinderGeometry(.205,.205,.07,20),m.ex1,J.hips,0,.075,0).scale.set(1.06,1,.9);add(Bx(.06,.18,.02),m.ex1,J.hips,.12,-.04,.15,0,0,.2);}
 if(e==='gtVest'){for(const sd of[1,-1])add(Bx(.15,.36,.035),m.top,J.torso,sd*.12,.27,.177,0,sd*.2,0);add(Bx(.46,.4,.03),m.top,J.torso,0,.27,-.18);}
 if(e==='headband'){add(new THREE.TorusGeometry(.172,.018,6,24),m.ex1,J.head,0,.21,0,Math.PI/2);}
 if(e==='furChest'){add(Sph(.2,20,14),m.skin,J.torso,0,.27,.05).scale.set(1.02,1,.82);for(const sd of[1,-1])add(Bx(.004,.11,.004),m.mouth,J.torso,sd*.03,.2,.215);}
 if(e==='redRims'){const rm=new THREE.MeshBasicMaterial({color:0xd01a2a});for(const sd of[1,-1])add(Bx(.09,.016,.01),rm,J.head,sd*.067,.168,.158,0,0,sd*.18);}
 if(e==='toppoStache'){for(const sd of[1,-1]){const b=add(new THREE.CylinderGeometry(.03,.012,.15,8),m.ex1,J.head,sd*.07,.055,.155);b.rotation.z=sd*1.25;b.rotation.y=-sd*.3;}add(Sph(.035,10,8),m.ex1,J.head,0,.07,.16).scale.set(1.6,.7,.8);}
 if(e==='cape'){add(Bx(.42,.62,.02),m.ex2,J.torso,0,.12,-.2,.12);}
 /* 3.2: guardianes de las esferas del Reino Demoníaco (Daima): cabeza de metal con ojos rojos, hombreras con púas, esfera en el pecho y arma */
 if(e==='tamaHead'||e==='tamaHead3'){const big=e==='tamaHead3',red=new THREE.MeshBasicMaterial({color:0xe0242a}),hi=new THREE.MeshBasicMaterial({color:0xff9a9a});
  add(Sph(.186,24,18),m.skin,J.head,0,.14,0).scale.set(1,big?.9:1.02,1);
  for(const sd of[1,-1]){const ey=add(Sph(.048,16,12),red,J.head,sd*.068,big?.17:.16,.158,0,0,sd*.55);ey.scale.set(.82,1.12,.42);add(Sph(.012,8,6),hi,J.head,sd*.06,big?.19:.18,.18);
   const hn=add(cone(.04,.15,8),m.ex2,J.head,sd*.115,.27,-.02,0,0,-sd*.35);if(big)hn.scale.setScalar(.8);}
  if(!big){add(Bx(.05,.022,.02),toon(0x7ac8e8),J.head,0,.075,.172);add(cone(.05,.12,8),m.ex2,J.head,0,.3,-.04,-.25);}
  else add(Bx(.08,.016,.02),toon(0x3a3a3a),J.head,0,.09,.17);}
 if(e==='tamaPads'){for(const L of['L','R']){const sd=L==='L'?1:-1;add(Sph(.13,18,12),m.ex2,J['sh'+L],sd*.02,.04,0).scale.set(1.05,.85,1.05);add(cone(.04,.17,8),m.ex2,J['sh'+L],sd*.08,.1,0,0,0,-sd*.9);}}
 if(e==='tamaChest'){add(Bx(.26,.12,.05),m.ex1,J.torso,0,.2,.17);const orb=add(Sph(.05,16,12),toon(0xf08a1a),J.torso,0,.24,.2);orb.material=orb.material.clone();
  for(const k of[-1,1])add(Sph(.009,6,4),new THREE.MeshBasicMaterial({color:0xc01a1a}),J.torso,k*.016,.245,.247);
  add(new THREE.CylinderGeometry(.21,.21,.06,20),m.belt,J.hips,0,.09,0).scale.set(1.05,1,.9);for(const L of['L','R'])add(Sph(.085,14,10),m.ex1,J.hips,(L==='L'?1:-1)*.11,-.04,.02).scale.set(1,.8,1);}
 if(e==='tamaSword'){const g=new THREE.Group();J.wrR.add(g);g.position.set(0,-.07,.02);model.extras.push(g);const sil=toon(0xe8ecf0);
  add(new THREE.CylinderGeometry(.018,.018,.16,8),m.ex1,g,0,0,0);add(new THREE.TorusGeometry(.04,.012,6,12),m.ex1,g,0,-.08,0,0,Math.PI/2,0);
  /* hoja ancha y curva con dientes en el lomo, como la de la imagen */
  const sh=new THREE.Shape();sh.moveTo(-.05,.1);sh.quadraticCurveTo(.05,.7,.55,1.25);sh.quadraticCurveTo(.3,.75,.16,.55);
  for(let i=0;i<5;i++){const y=.5-i*.08,x=.13-i*.012;sh.lineTo(x+.05,y);sh.lineTo(x,y-.04);}sh.lineTo(.07,.1);sh.lineTo(-.05,.1);
  add(new THREE.ExtrudeGeometry(sh,{depth:.02,bevelEnabled:false}),sil,g,0,0,-.01);}
 if(e==='tamaTrident'){const g=new THREE.Group();J.wrR.add(g);g.position.set(0,-.06,.02);g.rotation.x=Math.PI;model.extras.push(g);const sil=toon(0xd0d6de);
  add(new THREE.CylinderGeometry(.014,.014,1.7,8),sil,g,0,.2,0);add(new THREE.CylinderGeometry(.02,.02,.24,8),m.ex1,g,0,-.62,0);
  add(Bx(.22,.03,.03),m.ex1,g,0,1.06,0);add(cone(.03,.32,6),m.ex1,g,0,1.06,0);for(const sd of[1,-1])add(cone(.022,.22,6),m.ex1,g,sd*.11,1.06,0,0,0,-sd*.18);add(cone(.025,.12,6),m.ex1,g,0,-.74,0,Math.PI);}
 if(e==='tamaHammer'){const g=new THREE.Group();J.wrR.add(g);g.position.set(0,-.06,.02);model.extras.push(g);
  add(new THREE.CylinderGeometry(.028,.028,.8,10),m.ex1,g,0,-.2,0);add(Bx(.3,.26,.44),toon(0x9a9aa4),g,0,-.62,0);add(Bx(.32,.05,.46),toon(0x7a7a84),g,0,-.5,0);}
 /* 3.2: armadura de los Heeter (Gas): traje oscuro, hombreras blancas y peto */
 if(e==='heeterArmor'){const w=m.ex1;add(new THREE.SphereGeometry(.25,20,14,0,TAU,0,Math.PI*.55),w,J.torso,0,.22,0).scale.set(1.1,.95,.9);
  for(const L of['L','R']){const sd=L==='L'?1:-1;add(Sph(.12,16,10),w,J['sh'+L],sd*.02,.03,0).scale.set(1.15,.62,1.1);add(Bx(.14,.03,.2),m.ex2,J['sh'+L],sd*.04,.08,0,0,0,-sd*.25);}
  add(new THREE.TorusGeometry(.11,.035,8,18),w,J.torso,0,.45,0,Math.PI/2);}
 if(e==='gasLines'){const ln=new THREE.MeshBasicMaterial({color:0x4a3a5a});for(const sd of[1,-1]){add(Bx(.004,.05,.004),ln,J.head,sd*.11,.11,.14,0,0,sd*.2);add(Bx(.04,.004,.004),ln,J.head,sd*.065,.11,.165);}}
 if(e==='blankEyes'){if(model.eyes)model.eyes.forEach((o,i)=>{if(i%2)o.visible=false;});}
 /* 3.3: Ultra Instinto Verdadero: contorno plateado en el pelo */
 if(e==='silverHair'){const mat=new THREE.MeshBasicMaterial({color:0xd8e2f0,side:THREE.BackSide}),ha=(model.M||model).hairAnchor;if(ha)ha.traverse(o=>{if(o.isMesh&&o.material===OUTLINE){o.userData.o0=o.material;o.userData.s0=o.scale.clone();o.scale.multiplyScalar(1.07);o.material=mat;}});}
 if(e==='blackEyes'){if(model.eyes)model.eyes.forEach((o,i)=>{if(!(i%2)){o.userData.m0=o.material;o.material=o.material.clone();o.material.color.setHex(0x14101c);}});}
 /* 3.2b: Gas según el manga: rastas moradas (o negras) largas, diadema dorada con colmillos de marfil, tabardo rojo con ribete amarillo y cuello en V */
 if(e==='dreads'||e==='dreadsWild'||e==='dreadsLong'){const wild=e==='dreadsWild',long=e==='dreadsLong';add(new THREE.SphereGeometry(.182,20,12,0,TAU,0,Math.PI*.52),m.hair,J.head,0,.15,-.012,-.18);
  for(let i=0;i<17;i++){const a=(i/16-.5)*Math.PI*1.25,x=Math.sin(a)*.15,z=-Math.cos(a)*.13-.02,L=(long?.7:.52)+(i%3)*.06;
   const g=new THREE.CylinderGeometry(.024,.019,L,6);g.translate(0,-L/2,0);
   const d=add(g,m.hair,J.head,x,.25-Math.abs(Math.sin(a))*.04,z,wild?.45+((i*37)%10)/10*.6:.22+(i%2)*.08,0,Math.sin(a)*(wild?.6:.28));d.userData.dread=1;}}
 if(e==='gasCrown'||e==='gasTusksBig'){const big=e==='gasTusksBig',iv=toon(0xf0e2b4),au=toon(0xe0b84a);add(new THREE.TorusGeometry(.178,.012,6,26),au,J.head,0,.2,0,Math.PI/2+.12);
  for(const sd of[1,-1]){const t=add(new THREE.ConeGeometry(.026*(big?1.25:1),.15*(big?1.35:1),8),iv,J.head,sd*.075,.13-(big?.045:.025),.168,Math.PI+.12,0,sd*.18);t.scale.z=.6;}}
 if(e==='tabard'||e==='tabardLong'||e==='tabardTorn'){const R=toon(0xb81a1e),Y=toon(0xf0d870),Lg=e==='tabardLong',T=e==='tabardTorn',h=Lg?.95:.62;
  for(const z of[.176,-.176]){const pnl=add(Bx(.3,h,.025),R,J.torso,0,.4-h/2,z);if(T)pnl.scale.set(.85,.55,1);add(Bx(.025,h*(T?.55:1),.03),Y,J.torso,0,.4-h*(T?.275:.5),z*1.03);}
  if(!T)for(const sd of[1,-1]){add(Bx(.36,.03,.12),R,J.torso,sd*.2,.42,0,0,0,-sd*.32);add(Bx(.36,.012,.125),Y,J.torso,sd*.2,.405,0,0,0,-sd*.32);}
  add(new THREE.CylinderGeometry(.04,.04,.015,14),Y,J.torso,0,.36,.19,Math.PI/2);}
 if(e==='rags'){const w=toon(0xe6e2ea);const sk=add(new THREE.CylinderGeometry(.21,.3,.36,12,1,true),w,J.hips,0,-.16,0);sk.material=w;w.side=THREE.DoubleSide;
  for(let i=0;i<8;i++){const a=i/8*TAU;add(cone(.04,.14,4),w,J.hips,Math.sin(a)*.27,-.4,Math.cos(a)*.27,Math.PI);}}
 if(e==='bootBuckle'){const au=toon(0xe0b84a);for(const L of['L','R'])add(Bx(.11,.02,.06),au,J['kn'+L],0,-.36,.06);}
 /* Granolah: visor de francotirador sobre el ojo derecho, bufanda blanca, chaleco con botones y tirantes en su forma del deseo */
 if(e==='scope'){const au=toon(0xd8a83a),lens=new THREE.MeshBasicMaterial({color:0x7ae8ff});add(new THREE.TorusGeometry(.045,.014,8,18),au,J.head,-.066,.14,.165);add(new THREE.CircleGeometry(.04,16),lens,J.head,-.066,.14,.17);
  add(new THREE.TorusGeometry(.178,.014,6,26),toon(0x5a3a1a),J.head,0,.16,0,Math.PI/2);}
 if(e==='vestButtons'){const b=toon(0xd8b040);for(let i=0;i<4;i++)for(const sd of[1,-1])add(Sph(.014,8,6),b,J.torso,sd*.05,.36-i*.08,.19);}
 if(e==='suspenders'){const g=toon(0x9a9aa4);for(const sd of[1,-1]){add(Bx(.045,.4,.02),g,J.torso,sd*.08,.24,.19);add(Bx(.045,.4,.02),g,J.torso,sd*.08,.24,-.19);add(Bx(.06,.05,.025),toon(0xd0d0d8),J.torso,sd*.08,.36,.2);}}
 /* Cell Max: placas rojas con manchas, alas negras grandes, boca abierta y cola con maza */
 if(e==='maxPlates'){for(const L of['L','R']){add(Sph(.13,16,12),m.top,J['sh'+L],0,.03,0).scale.set(1.1,.9,1.05);add(new THREE.CylinderGeometry(.075,.07,.12,12),m.top,J['el'+L],0,-.09,0);add(new THREE.CylinderGeometry(.085,.075,.2,12),m.boots,J['kn'+L],0,-.13,.01);add(Sph(.075,12,8),m.top,J['kn'+L],0,0,.03);}
  add(new THREE.SphereGeometry(.25,20,12,0,TAU,0,Math.PI*.5),m.top,J.torso,0,.18,.02).scale.set(1.1,1.2,.92);}
 if(e==='maxWings'){const wm=toon(0x34343a);for(const sd of[1,-1]){const w=add(Sph(.3,18,12),wm,J.torso,sd*.24,.42,-.24,.2,sd*.25,-sd*.65);w.scale.set(1.25,.48,.12);}}
 if(e==='maxMouth'){add(new THREE.SphereGeometry(.19,20,12,0,TAU,0,Math.PI*.55),m.top,J.head,0,.15,-.03,-.5);add(Sph(.05,12,8),new THREE.MeshBasicMaterial({color:0x2a1020}),J.head,0,.06,.16).scale.set(1,1.2,.5);add(Bx(.06,.012,.01),new THREE.MeshBasicMaterial({color:0xf4f4f4}),J.head,0,.1,.18);add(Sph(.022,8,6),toon(0x7ab0ff),J.head,0,.04,.17);}
 if(e==='maxMace'&&model.tail){model.tail.forEach(sg=>sg.material=m.top);const end=model.tail[model.tail.length-1],k=toon(0x2a2a2e);add(Sph(.1,12,10),k,end,0,.32,0);for(let i=0;i<8;i++){const a=i/8*TAU;add(cone(.022,.07,5),k,end,Math.cos(a)*.09,.32+(i%2?.04:-.04),Math.sin(a)*.09,0,0,0).lookAt(end.localToWorld(V3(Math.cos(a),0,Math.sin(a))));}}
 /* Zamasu fusionado: abrigo de Kaioshin gris con forro rojo, faja roja, cuello alto; su forma corrupta tiene el brazo derecho morado y enorme */
 if(e==='kaioCoat'){const red=toon(0xb01a1a);red.side=THREE.BackSide;add(new THREE.CylinderGeometry(.22,.3,.56,22,1,true,Math.PI*.4,Math.PI*1.2),m.top,J.hips,0,-.2,-.01);add(new THREE.CylinderGeometry(.215,.295,.56,22,1,true,Math.PI*.4,Math.PI*1.2),red,J.hips,0,-.2,-.01);
  add(new THREE.CylinderGeometry(.11,.13,.1,18,1,true),red,J.torso,0,.46,0);add(new THREE.TorusGeometry(.2,.04,8,22),toon(0xc0201e),J.hips,0,.1,0,Math.PI/2).scale.set(1.05,.9,1);}
 if(e==='purpleArm'){const pm=toon(0x8a5ac0);for(let i=0;i<9;i++){const r=.08+Math.random()*.05;add(Sph(r,12,10),pm,i<4?J.shR:i<7?J.elR:J.wrR,(Math.random()-.5)*.08,-.04-i%4*.05,(Math.random()-.5)*.06).scale.setScalar(1.6);}}
}

HAIR.granolahW={cap:1,tip:.08,sp:HS(SSJ_C,1.05,1.05).concat([[0,.12,-.13,-1.6,0,.4,.08],[.1,.08,-.12,-1.8,-.5,.36,.07],[-.1,.08,-.12,-1.8,.5,.36,.07]])};
HAIR.granolah={cap:1,tip:.1,sp:HM([0,.17,-.02,-.9,0,.36,.09],[.08,.15,-.01,-1.0,-.35,.34,.085],[.13,.1,-.03,-1.2,-.75,.3,.075],[.15,.03,-.05,-1.6,-1.0,.26,.065]).concat([[0,.12,-.13,-1.9,0,.3,.075],[.05,.16,.1,.6,-.2,.16,.05]])};
