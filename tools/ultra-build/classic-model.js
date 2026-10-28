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
(()=>{const b=CHARS.find(c=>c.id==='broly');if(b)b.forms.forEach(f=>{if(f.id==='ssj'||f.id==='lssj')f.hair='brolyL';});})();
HAIR.kefla={cap:1,sp:HAIR.ssj.sp.map(s=>[s[0]*1.12,s[1],s[2]*1.1,s[3]*1.15,s[4]*1.2,s[5]*1.3,s[6]*1.1])};
HAIR.gamma1={cap:1,sp:[[0,.15,0,-.45,0,.2,.075],[.1,.12,.02,-.3,-.85,.18,.065],[-.1,.12,.02,-.3,.85,.18,.065],[.05,.12,.12,1.1,-.2,.14,.05],[-.05,.12,.12,1.1,.2,.14,.05]]};
HAIR.gamma2={cap:1,sp:[[0,.16,.07,.75,0,.3,.095],[.07,.15,.05,.55,-.3,.26,.08],[-.07,.15,.05,.55,.3,.26,.08],[0,.1,-.12,-1.6,0,.18,.07],[.12,.06,-.04,-.6,-1.2,.16,.06],[-.12,.06,-.04,-.6,1.2,.16,.06]]};
HAIR.whis={cap:1,sp:[[0,.17,-.03,-.1,0,.62,.1],[0,.15,.05,.2,0,.46,.085],[.05,.15,0,-.05,-.15,.5,.08],[-.05,.15,0,-.05,.15,.5,.08]]};
/* 2.0: peinados de los luchadores del modo historia */
HAIR.raditz={cap:1,sp:HAIR.goku.sp.slice(0,5).concat([[0,.06,-.15,-2.75,0,.95,.11],[.09,.04,-.13,-2.8,-.18,.92,.1],[-.09,.04,-.13,-2.8,.18,.92,.1],[0,-.04,-.15,-2.95,0,.9,.1],[.13,0,-.08,-2.9,-.4,.8,.08],[-.13,0,-.08,-2.9,.4,.8,.08]])};
HAIR.gohanks={cap:1,sp:HAIR.gohan.sp.map(s=>[s[0],s[1],s[2],s[3]*.8,s[4],s[5]*.9,s[6]]).concat([[.06,.1,.15,2.3,-.3,.18,.04]])};
HAIR.granolah={cap:1,sp:[[0,.16,-.02,-.35,0,.3,.08],[.09,.14,0,-.2,-.6,.26,.07],[-.09,.14,0,-.2,.6,.26,.07],[.05,.12,.12,1.6,-.25,.16,.05],[-.05,.12,.12,1.6,.25,.16,.05],[0,.08,-.14,-1.9,0,.24,.07]]};
HAIR.gas={cap:1,sp:[[0,.16,-.02,-.2,0,.34,.09],[.1,.13,0,-.1,-.7,.3,.08],[-.1,.13,0,-.1,.7,.3,.08],[0,.1,-.12,-1.2,0,.3,.08],[.13,.05,-.04,-.4,-1.3,.24,.06],[-.13,.05,-.04,-.4,1.3,.24,.06]]};
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
 if(e==='toppoStache'){for(const sd of[1,-1]){const b=add(new THREE.CylinderGeometry(.03,.012,.15,8),m.ex1,J.head,sd*.07,.055,.155);b.rotation.z=sd*1.25;b.rotation.y=-sd*.3;}add(Sph(.035,10,8),m.ex1,J.head,0,.07,.16).scale.set(1.6,.7,.8);}
 if(e==='cape'){add(Bx(.42,.62,.02),m.ex2,J.torso,0,.12,-.2,.12);}
}
