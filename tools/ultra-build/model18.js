HAIR.kefla={cap:1,sp:HAIR.ssj.sp.map(s=>[s[0]*1.12,s[1],s[2]*1.1,s[3]*1.15,s[4]*1.2,s[5]*1.3,s[6]*1.1])};
HAIR.gamma1={cap:1,sp:[[0,.15,0,-.45,0,.2,.075],[.1,.12,.02,-.3,-.85,.18,.065],[-.1,.12,.02,-.3,.85,.18,.065],[.05,.12,.12,1.1,-.2,.14,.05],[-.05,.12,.12,1.1,.2,.14,.05]]};
HAIR.gamma2={cap:1,sp:[[0,.16,.07,.75,0,.3,.095],[.07,.15,.05,.55,-.3,.26,.08],[-.07,.15,.05,.55,.3,.26,.08],[0,.1,-.12,-1.6,0,.18,.07],[.12,.06,-.04,-.6,-1.2,.16,.06],[-.12,.06,-.04,-.6,1.2,.16,.06]]};
/* SSJ4: pelo de Goku más largo arriba y una melena que cae por la espalda hasta la cintura */
HAIR.ssj4={cap:1,sp:HAIR.goku.sp.map(s=>[s[0]*1.05,s[1],s[2],s[3],s[4],s[5]*1.35,s[6]*1.12]).concat([[-.04,.1,.14,2.2,.3,.22,.035],
 [0,.02,-.15,-2.75,0,1.25,.1],[.07,.03,-.14,-2.7,-.18,1.15,.09],[-.07,.03,-.14,-2.7,.18,1.15,.09],[.13,.03,-.09,-2.8,-.45,1.0,.08],[-.13,.03,-.09,-2.8,.45,1.0,.08],[.04,-.06,-.15,-2.95,-.08,1.05,.08],[-.04,-.06,-.15,-2.95,.08,1.05,.08],[.15,-.02,-.02,-2.95,-.7,.7,.07],[-.15,-.02,-.02,-2.95,.7,.7,.07]])};
HAIR.gogeta4={cap:1,sp:HAIR.ssj4.sp.concat([[.05,.1,.15,2.1,-.35,.22,.045],[-.06,.1,.15,2.1,.4,.2,.04]])};
HAIR.whis={cap:1,sp:[[0,.17,-.03,-.1,0,.62,.1],[0,.15,.05,.2,0,.46,.085],[.05,.15,0,-.05,-.15,.5,.08],[-.05,.15,0,-.05,.15,.5,.08]]};

/* Proporciones de figura de anime adulta (como las figuras oficiales): ≈1,9 m, cabeza de 1/8 de la altura, hombros anchos,
   pecho en V, cintura estrecha, faja ancha, pantalón abombado que se recoge en la bota y bota grande.
   Los peinados y accesorios de cabeza se diseñaron para una cabeza de radio .17 y se escalan con HX. */
const CHIBI=1,HEADK=1,HX=.6;
function addPart(geo,mat,parent,x,y,z,outline=true,ol=1.035){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);if(outline){const o=new THREE.Mesh(geo,OUTLINE);o.scale.setScalar(ol);m.add(o);}return m;}
const Bx=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
const Sph=(r,ws=24,hs=16)=>new THREE.SphereGeometry(r,ws,hs);
/* Cápsula suave con extremos redondeados (radio superior e inferior distintos): cubre las articulaciones, sin huecos */
function capsule(rTop,rBot,len,seg=20){const pts=[],n=8;
 for(let i=0;i<=n;i++){const a=-Math.PI/2+i/n*Math.PI/2;pts.push(new THREE.Vector2(Math.max(1e-4,Math.cos(a)*rBot),Math.sin(a)*rBot-len/2));}
 for(let i=0;i<=n;i++){const a=i/n*Math.PI/2;pts.push(new THREE.Vector2(Math.max(1e-4,Math.cos(a)*rTop),Math.sin(a)*rTop+len/2));}
 return new THREE.LatheGeometry(pts,seg);}
/* Pernera de pantalón de gi: perfil torneado (rodilla → abombado → recogido en el tobillo) */
function pantLeg(rTop,rMid,rBot,len){const pts=[];for(let i=0;i<=14;i++){const k=i/14,y=-k*len,bulge=Math.sin(Math.min(1,k/.8)*Math.PI);let r=lerp(rTop,rBot,k)+(rMid-Math.max(rTop,rBot)*.9)*bulge;if(k>.9)r=lerp(r,rBot*.92,(k-.9)/.1);pts.push(new THREE.Vector2(Math.max(1e-3,r),y));}
 pts.unshift(new THREE.Vector2(1e-3,0));pts.push(new THREE.Vector2(1e-3,-len));return new THREE.LatheGeometry(pts.reverse(),20);}
const EMBLEMS={};
function emblemTex(ch){if(EMBLEMS[ch])return EMBLEMS[ch];return EMBLEMS[ch]=canvasTex(128,(g)=>{g.fillStyle='#fff';g.beginPath();g.arc(64,64,58,0,TAU);g.fill();g.lineWidth=6;g.strokeStyle='#151515';g.stroke();g.fillStyle='#151515';g.font='bold 76px serif';g.textAlign='center';g.textBaseline='middle';g.fillText(ch,64,68);});}
const BUILDS={ssj4:{fore:1.4,hand:1.45,upper:1.2,chest:1.08},ssg:{fore:.86,hand:.95,upper:.84,chest:.9},ssj3:{noBrow:1},sv:{fore:1.2,upper:1.28,chest:1.1},st:{fore:1.3,upper:1.4,chest:1.15},
 ssbe:{fore:1.15,upper:1.2,chest:1.08},ue:{fore:1.15,upper:1.22,chest:1.1},ui:{fore:.94,upper:.94},uio:{fore:.96,upper:.96},lssj:{fore:1.25,hand:1.2,upper:1.3,chest:1.12},wrath:{fore:1.1,upper:1.12},
 f100:{fore:1.3,upper:1.4,chest:1.15},max:{fore:1.2,hand:1.35},orangeG:{fore:1.2,upper:1.2},full:{fore:1.08,upper:1.1},limit:{fore:1.12,upper:1.15},young:{fore:1.1,upper:1.1},earth:{fore:1.3,hand:1.4,upper:1.3}};
const GI=new Set(['goku','gohan','piccolo','krilin','gotenks']);
function buildModel(ch){
 const mats={};['skin','top','inner','shoulder','pants','belt','boots','sleeve','glove','wrist','eye','pupil','hair','ex1','ex2'].forEach(k=>mats[k]=toon(0xffffff));
 mats.mouth=new THREE.MeshBasicMaterial({color:0x2a1010});mats.shine=new THREE.MeshBasicMaterial({color:0xffffff});
 const fem=!!ch.fem||ch.id==='a18',SW=fem?.2:.26,gi=GI.has(ch.id);
 const root=new THREE.Group(),chibi=new THREE.Group(),body=new THREE.Group();root.add(chibi);chibi.add(body);
 const J={},M={arms:{}};
 J.hips=new THREE.Group();J.hips.position.y=.98;body.add(J.hips);
 addPart(Sph(.15,24,16),mats.pants,J.hips,0,0,0).scale.set(fem?1.2:1.12,.85,.86);
 /* faja ancha (gi) o cinturón */
 addPart(new THREE.CylinderGeometry(.158,.152,gi?.1:.07,28),mats.belt,J.hips,0,.075,0).scale.set(fem?.9:1,1,.8);
 if(gi){const kn=addPart(Sph(.032,12,8),mats.belt,J.hips,.04,.07,.125);kn.scale.set(1.2,.9,.7);for(const s of[0,1])addPart(Bx(.04,.16,.014),mats.belt,J.hips,.035+s*.03,-.03,.13,true,1.02).rotation.z=.1+s*.16;}
 J.torso=new THREE.Group();J.torso.position.y=.11;J.hips.add(J.torso);
 /* cintura estrecha y abdominales */
 addPart(capsule(.12,.108,.12),mats.inner,J.torso,0,.1,0).scale.set(fem?.86:1.02,1,.74);
 if(!fem)for(let r=0;r<3;r++)for(const s of[1,-1])addPart(Sph(.03,12,8),mats.inner,J.torso,s*.034,.23-r*.058,.08,false).scale.set(1,.8,.5);
 /* pecho en V */
 M.chestG=new THREE.Group();J.torso.add(M.chestG);
 addPart(Sph(.2,32,24),mats.top,M.chestG,0,.34,0).scale.set(fem?1.02:1.36,1.04,.74);
 for(const s of[1,-1]){const p=addPart(Sph(fem?.07:.092,20,14),mats.top,M.chestG,s*.086,fem?.33:.37,fem?.1:.082,true,1.025);p.scale.set(1.15,fem?1:.78,fem?.95:.6);}
 const vn=addPart(Sph(.065,16,12),mats.inner,J.torso,0,.43,.12,false);vn.scale.set(.8,1.25,.4);
 addPart(Sph(.1,18,12),mats.top,J.torso,0,.5,-.02).scale.set(fem?1.4:2.0,.55,.85);
 if(ch.emblem){const e=new THREE.Mesh(new THREE.CircleGeometry(.04,24),new THREE.MeshBasicMaterial({map:emblemTex(ch.emblem),transparent:true}));e.position.set(.1,.41,.143);e.rotation.set(-.2,.36,0);J.torso.add(e);M.emblem=e;}
 if(ch.chestNum){const t=canvasTex(128,g=>{g.fillStyle=ch.chestNum.c;g.font='bold 110px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(ch.chestNum.t,64,70);});const e=new THREE.Mesh(new THREE.PlaneGeometry(.11,.11),new THREE.MeshBasicMaterial({map:t,transparent:true}));e.position.set(-.01,.4,.152);e.rotation.x=-.12;J.torso.add(e);}
 J.neck=new THREE.Group();J.neck.position.y=.54;J.torso.add(J.neck);
 addPart(new THREE.CylinderGeometry(fem?.046:.058,fem?.056:.07,.12,16),mats.skin,J.neck,0,.035,0);
 J.head=new THREE.Group();J.head.position.y=.085;J.neck.add(J.head);
 M.headG=new THREE.Group();M.headG.position.y=.095;J.head.add(M.headG);
 M.head=addPart(Sph(.104,32,24),mats.skin,M.headG,0,0,0,true,1.03);M.head.scale.set(.92,1.08,1);
 addPart(Sph(.073,24,16),mats.skin,M.headG,0,-.054,.028,true,1.03).scale.set(fem?.88:1.04,.86,1);
 M.eyes=[];
 for(const s of[1,-1]){
  /* cara de anime adulto: ojo afilado, pupila pequeña, párpado marcado y ceja gruesa en ceño */
  const w=addPart(Sph(.022,18,12),mats.eye,M.headG,s*.037,.004,.089,false);w.scale.set(1.4,fem?.78:.62,.4);w.rotation.z=s*.18;
  const p=addPart(Sph(.011,14,10),mats.pupil,M.headG,s*.034,.001,.097,false);p.scale.set(.8,1.2,.4);
  addPart(Sph(.0048,10,8),mats.mouth,M.headG,s*.034,.001,.1,false).scale.set(.8,1.2,.4);
  addPart(Sph(.0028,8,6),mats.shine,M.headG,s*.031,.007,.102,false);
  /* línea superior gruesa que sube hacia fuera (rasgo típico de Toriyama) y línea inferior fina */
  const lid=addPart(Bx(.054,.009,.008),mats.mouth,M.headG,s*.039,.015,.097,false);lid.rotation.z=s*.24;
  const lw=addPart(Bx(.03,.004,.006),mats.mouth,M.headG,s*.041,-.009,.096,false);lw.rotation.z=-s*.12;
  const b=addPart(Bx(.05,fem?.008:.015,.014),mats.hair,M.headG,s*.04,.038,.094,false);b.rotation.z=s*(fem?.12:.36);
  const b2=addPart(Bx(.018,fem?.006:.012,.012),mats.hair,M.headG,s*.016,.03,.098,false);b2.rotation.z=-s*.5;
  (M.brows=M.brows||[]).push(b,b2);M.eyes.push(w,p);
  if(ch.ears!==false)addPart(Sph(.02,12,10),mats.skin,M.headG,s*.093,-.005,-.005,true,1.06).scale.set(.45,1,.75);}
 const nose=addPart(new THREE.ConeGeometry(.011,.03,6),mats.skin,M.headG,0,-.022,.101,false);nose.rotation.x=Math.PI/2+.45;
 /* pómulos y mentón anguloso */
 for(const s of[1,-1])addPart(Sph(.03,12,8),mats.skin,M.headG,s*.055,-.03,.06,false).scale.set(1,.7,1);
 addPart(new THREE.ConeGeometry(.04,.05,10),mats.skin,M.headG,0,-.108,.05,false).rotation.x=Math.PI;
 M.mouth=addPart(Bx(.03,.005,.006),mats.mouth,M.headG,0,-.067,.099,false);
 M.mouthO=addPart(Sph(.015,12,8),mats.mouth,M.headG,0,-.069,.093,false);M.mouthO.scale.set(1.3,.9,.4);M.mouthO.visible=false;
 M.headX=new THREE.Group();M.headX.scale.setScalar(HX);M.headX.position.y=M.headG.position.y-.14*HX;J.head.add(M.headX);
 M.hairAnchor=new THREE.Group();M.hairAnchor.position.y=.14;M.headX.add(M.hairAnchor);
 for(const s of[1,-1]){const L=s>0?'L':'R';
  const sh=new THREE.Group();sh.position.set(s*SW,.47,0);J.torso.add(sh);J['sh'+L]=sh;
  addPart(Sph(fem?.058:.084,18,14),mats.shoulder,sh,0,-.01,0).scale.set(1,1.05,.95);
  const ug=new THREE.Group();sh.add(ug);(M.upper=M.upper||[]).push(ug);
  const up=addPart(capsule(fem?.046:.064,fem?.04:.052,.2),mats.sleeve,ug,0,-.15,0);
  if(!fem)addPart(Sph(.054,14,10),mats.sleeve,ug,0,-.13,.027,false).scale.set(1,1.5,1);
  const el=new THREE.Group();el.position.y=-.3;sh.add(el);J['el'+L]=el;
  /* antebrazo musculoso que se ensancha hacia el codo */
  const fg=new THREE.Group();el.add(fg);(M.fore=M.fore||[]).push(fg);
  const fo=addPart(capsule(fem?.04:.058,fem?.033:.042,.18),mats.skin,fg,0,-.12,0);
  addPart(new THREE.CylinderGeometry(fem?.04:.052,fem?.038:.049,.09,16),mats.wrist,fg,0,-.215,0);
  const hg=new THREE.Group();hg.position.y=-.27;el.add(hg);(M.hands=M.hands||[]).push(hg);
  addPart(Sph(fem?.04:.05,16,12),mats.glove,hg,0,-.018,.01).scale.set(.9,1.05,1.15);
  addPart(Sph(.02,10,8),mats.glove,hg,-s*.032,-.002,.036,false);
  M.arms[L]=[up,fo];
  const hp=new THREE.Group();hp.position.set(s*(fem?.085:.09),-.04,0);J.hips.add(hp);J['hip'+L]=hp;
  addPart(pantLeg(fem?.085:.095,fem?.1:.125,fem?.068:.078,.46),mats.pants,hp,0,0,0);
  const kn=new THREE.Group();kn.position.y=-.45;hp.add(kn);J['kn'+L]=kn;
  /* pernera abombada que se recoge dentro de la bota */
  addPart(pantLeg(fem?.068:.08,ch.slimPants?.072:fem?.09:.125,fem?.05:.058,.3),mats.pants,kn,0,.02,0);
  addPart(new THREE.CylinderGeometry(.066,.058,.18,18),mats.boots,kn,0,-.35,0);
  addPart(new THREE.CylinderGeometry(.074,.07,.035,18),mats.boots,kn,0,-.265,0);
  addPart(Sph(.062,18,14),mats.boots,kn,0,-.445,.05).scale.set(1,.58,1.9);}
 const model={root,body,J,M,mats,hairStyle:null,extras:[],extrasKey:'',cur:{},target:'idle',tail:null,cape:null,t:Math.random()*10,fatigue:0,effort:0,yell:0,slump:0};
 for(const k of JOINTS)model.cur[k]=[0,0,0];
 return model;
}
/* El dragón de tres cabezas tiene su propio esqueleto; el resto usa el modelo humanoide */
function makeModel(ch){return ch.model==='dragon'?buildDragonModel(ch):buildModel(ch);}
/* Mechón de pelo estilo Dragon Ball: base ancha y redondeada, cuerpo con volumen y punta roma */
function hairLock(r,len){const pts=[],rt=r*.16;
 for(let i=0;i<=6;i++){const a=-Math.PI/2+i/6*Math.PI/2;pts.push(new THREE.Vector2(Math.max(1e-4,Math.cos(a)*r),Math.sin(a)*r*.5));}
 for(let i=1;i<=8;i++){const k=i/8;pts.push(new THREE.Vector2((r*(1-k)+rt*k)*(1+.18*Math.sin(k*Math.PI)),k*(len-rt)));}
 for(let i=1;i<=6;i++){const a=i/6*Math.PI/2;pts.push(new THREE.Vector2(Math.max(1e-4,Math.cos(a)*rt),len-rt+Math.sin(a)*rt));}
 return new THREE.LatheGeometry(pts,14);}
function setHair(model,style){
 if(model.hairStyle===style)return;model.hairStyle=style;
 const a=model.M.hairAnchor;while(a.children.length)a.remove(a.children[0]);
 const H=HAIR[style]||HAIR.none,mat=model.mats.hair;
 if(H.cap){const g=new THREE.SphereGeometry(H.cap===2?.212:.19,32,16,0,TAU,0,Math.PI*(H.cap===2?.6:.52));const m=addPart(g,mat,a,0,H.cap===2?-.005:.008,H.cap===2?-.012:-.018);m.rotation.x=H.cap===2?-.15:-.32;}
 model.locks=[];for(const s of H.sp){const m=addPart(hairLock(s[6]*1.42,s[5]),mat,a,s[0],s[1],s[2]);m.rotation.set(s[3],0,s[4]);m.scale.set(1,1,.74);model.locks.push({m,rx:s[3],rz:s[4],k:clamp(s[5]/.35,.5,3.5),ph:Math.random()*TAU});}
}
function setExtras(model,list){
 const key=list.join(',');if(model.extrasKey===key)return;model.extrasKey=key;
 for(const e of model.extras)e.parent&&e.parent.remove(e);model.extras=[];model.tail=null;model.cape=null;
 const J=model.J,H=model.M.headX,m=model.mats,add=(geo,mat,parent,x,y,z,rx=0,ry=0,rz=0)=>{const p=addPart(geo,mat,parent,x,y,z);p.rotation.set(rx,ry,rz);model.extras.push(p);return p;};
 const cone=(r,h,s=10)=>{const g=new THREE.ConeGeometry(r,h,s);g.translate(0,h/2,0);return g;};
 for(const e of list){
  if(e==='horns'||e==='hornsBig'){const k=e==='hornsBig'?1.6:1;for(const s of[1,-1])add(cone(.045*k,.22*k),m.ex2,H,s*.13,.22,0,0,0,-s*.7);}
  if(e==='longHead'){add(cone(.15,.55,16),m.skin,H,0,.22,-.08,-1.9);add(Sph(.12,18,12),m.ex1,H,0,.32,-.32);}
  if(e==='dome'){const g=new THREE.SphereGeometry(.178,28,10,0,TAU,0,Math.PI*.45);add(g,m.ex1,H,0,.15,-.01,-.25);}
  if(e==='fshoulders'){for(const L of['L','R'])add(Sph(.085,18,12),m.ex1,J['sh'+L],0,.02,0);add(Sph(.04,14,10),m.ex1,J.torso,0,.42,.15);}
  if(e==='tail'){let parent=J.hips;const segs=[];for(let i=0;i<5;i++){const g=new THREE.CylinderGeometry(.035,.055-.005*i,.3,12);g.translate(0,.15,0);const p=add(g,m.skin,parent,0,i===0?-.02:.3,i===0?-.12:0,i===0?-2.2:-.35);segs.push(p);parent=p;}model.tail=segs;}
  /* cola de pelaje (SSJ4) y cola fina de gato (Bills) */
  if(e==='furTail'||e==='catTail'){const cat=e==='catTail',mt=cat?m.skin:m.top;let parent=J.hips;const segs=[];const L=cat?.17:.18,bend=cat?[-2.15,-.3,-.2,.12,.25,.35,.4]:[-2.05,-.42,-.32,.25,.4,.45];for(let i=0;i<bend.length;i++){const r0=cat?.022-.0015*i:.052-.005*i,g=new THREE.CylinderGeometry(r0*.85,r0,L,10);g.translate(0,L/2,0);
    const p=add(g,mt,parent,0,i===0?-.04:L,i===0?-.12:0,bend[i]);segs.push(p);parent=p;}if(cat){add(Sph(.026,10,8),m.ex2,parent,0,L,0);}model.tail=segs;}
  if(e==='gammaHead1'||e==='gammaHead2'){const dk=m.boots;add(new THREE.SphereGeometry(.188,32,16,0,TAU,0,Math.PI*.56),dk,H,0,.155,-.012,-.3);
   for(const s of[1,-1]){add(new THREE.CylinderGeometry(.062,.062,.045,20),dk,H,s*.166,.13,-.01,0,0,Math.PI/2);add(Bx(.012,.09,.008),m.mouth,H,s*.07,.06,.158,0,0,s*.08);}
   if(e==='gammaHead1'){add(new THREE.CylinderGeometry(.2,.2,.035,28,1,false,0,Math.PI),m.hair,H,0,.2,-.04,-.25,0,Math.PI/2).scale.set(1,1,1.15);}
   else for(const s of[1,-1])add(new THREE.ConeGeometry(.016,.42,8),m.hair,H,s*.06,.42,.03,-.15,0,-s*.42);}
  if(e==='gammaCoat'){add(new THREE.CylinderGeometry(.19,.235,.32,26,1,true),m.top,J.hips,0,-.13,0);add(new THREE.CylinderGeometry(.068,.08,.09,18),m.top,J.torso,0,.57,0);
   for(const s of[1,-1]){for(let i=0;i<4;i++)add(Sph(.019,12,8),m.ex1,J.torso,s*.105,.47-i*.075,.142-i*.004).scale.set(1,.8,.6);add(Sph(.016,10,8),m.ex1,J['el'+(s>0?'L':'R')],s*.045,-.2,.02);}
   add(new THREE.CylinderGeometry(.035,.035,.012,20),m.ex1,J.hips,0,.075,.13,Math.PI/2);
   const hol=add(Bx(.05,.16,.07),m.ex2,J.hips,-.17,-.04,.05,0,0,.12);
   for(const L of['L','R'])add(Sph(.098,18,12),m.ex2,J['sh'+L],0,.035,0).scale.set(1.1,.55,1.1);
   add(new THREE.CylinderGeometry(.068,.068,.06,16),m.ex2,J.shL,0,-.12,0);}
  if(e==='tallBoots'){for(const L of['L','R'])add(new THREE.CylinderGeometry(.078,.068,.34,18),m.boots,J['kn'+L],0,-.2,0);}
  if(e==='egyptGold'){for(const L of['L','R']){add(new THREE.CylinderGeometry(.062,.062,.05,16),m.ex1,J['sh'+L],0,-.18,0);add(new THREE.CylinderGeometry(.072,.072,.05,16),m.ex1,J['kn'+L],0,-.27,0);}
   add(new THREE.CylinderGeometry(.16,.25,.08,28),m.ex1,J.torso,0,.5,0);}
  if(e==='wings'){for(const s of[1,-1])add(Bx(.035,.6,.3),m.ex2,J.torso,s*.12,.44,-.17,.35,0,-s*.45);}
  if(e==='cellcrown'){for(const s of[1,-1]){const c=add(cone(.07,.36,6),m.top,H,s*.07,.25,-.02,-.75,0,-s*.32);c.scale.z=.45;}add(Bx(.08,.05,.03),m.ex1,H,0,.23,.15,-.3);}
  if(e==='antennae'){for(const s of[1,-1]){const a=add(new THREE.CylinderGeometry(.012,.014,.2,8),m.skin,H,s*.05,.34,.06,.5,0,-s*.25);const tip=new THREE.Mesh(Sph(.018,10,8),m.skin);tip.position.y=.1;a.add(tip);}}
  if(e==='krilinDots'){for(const[x,y]of[[-.05,.25],[0,.26],[.05,.25],[-.05,.21],[0,.22],[.05,.21]])add(Sph(.011,8,6),m.mouth,H,x,y,.14);}
  if(e==='scarf'){add(new THREE.TorusGeometry(.085,.03,8,18),m.ex1,J.torso,0,.55,0,Math.PI/2);add(Bx(.06,.2,.02),m.ex1,J.torso,.07,.43,.15,.15,0,-.2);}
  if(e==='hitHorns'){for(const s of[1,-1])add(cone(.03,.13,8),m.ex2,H,s*.06,.29,-.06,-.5,0,-s*.2);}
  if(e==='hitCoat'){add(new THREE.CylinderGeometry(.13,.19,.09,20,1,true),m.ex1,J.torso,0,.55,0);add(Bx(.4,.62,.035),m.top,J.torso,0,.12,-.16,.12);for(const s of[1,-1])add(Bx(.12,.56,.035),m.top,J.torso,s*.14,.12,.15,-.1,0,s*.06);}
  if(e==='fusionVest'){add(new THREE.TorusGeometry(.13,.024,6,20),m.ex1,J.torso,0,.53,.02,Math.PI/2);
   add(new THREE.SphereGeometry(.208,32,20,Math.PI*.74,Math.PI*1.52,0,Math.PI*.72),m.ex2,J.torso,0,.34,0).scale.set(1.38,1.05,.78);
   for(const L of['L','R'])add(Sph(.105,18,12),m.ex1,J['sh'+L],0,.03,0).scale.set(1.08,.66,1.08);}
  if(e==='cellBeak'){const b=add(cone(.03,.09,6),m.ex1,H,0,.06,.155);b.rotation.x=Math.PI/2;}
  if(e==='cellLips'){const lip=new THREE.MeshBasicMaterial({color:0x7a3a9a});add(Bx(.07,.016,.012),lip,H,0,.058,.165);}
  if(e==='cellCheeks'){const pm=new THREE.MeshBasicMaterial({color:0x8a3aa8});for(const s of[1,-1])add(Bx(.012,.07,.01),pm,H,s*.075,.1,.152,0,0,s*.25);}
  if(e==='cellMaxSpikes'){for(const s of[1,-1]){add(cone(.05,.2,6),m.ex1,J['sh'+(s>0?'L':'R')],0,.06,-.02,0,0,-s*.5);for(let i=0;i<3;i++)add(cone(.04,.16,6),m.ex1,J.torso,s*.08,.5-i*.12,-.15,-.9);}}
  if(e==='brolyGear'){add(new THREE.CylinderGeometry(.2,.22,.12,20),m.ex1,J.hips,0,.03,0).scale.set(1.06,1,.92);for(const L of['L','R'])add(new THREE.CylinderGeometry(.068,.068,.06,14),m.wrist,J['el'+L],0,-.13,0);add(Sph(.02,8,6),m.ex2,H,.16,.06,0);}
  if(e==='mask'){add(Bx(.17,.06,.03),m.ex1,H,0,.085,.16);}
  if(e==='ears'||e==='pointyEars'){for(const s of[1,-1])add(cone(.04,.13,8),m.skin,H,s*.16,.15,0,0,0,-s*1.35);}
  if(e==='buuAntenna'){add(cone(.05,.36,12),m.skin,H,0,.27,-.05,-.9);}
  if(e==='earrings'){for(const s of[1,-1])add(Sph(.028,12,8),m.ex1,H,s*.16,.08,0);}
  if(e==='earringL'){add(Sph(.028,12,8),m.ex1,H,.16,.08,0);}
  if(e==='sword'){add(Bx(.035,.85,.07),m.ex2,J.torso,.08,.42,-.2,0,0,.5);add(Bx(.14,.035,.06),m.belt,J.torso,-.08,.72,-.2,0,0,.5);}
  if(e==='armor'){add(Sph(.205,28,20),m.ex1,J.torso,0,.35,0).scale.set(1.4,1.07,.82);for(const s of[1,-1])add(Sph(.09,18,12),m.ex2,J.torso,s*.26,.52,0).scale.set(1,.45,1.1);}
  if(e==='catEars'){for(const s of[1,-1])add(cone(.075,.28,10),m.skin,H,s*.11,.24,-.01,0,0,-s*.35);}
  if(e==='collar'){add(new THREE.CylinderGeometry(.13,.2,.06,24),m.ex1,J.torso,0,.53,0);}
  if(e==='pads'){for(const L of['L','R'])add(Sph(.115,18,12),m.ex1,J['sh'+L],0,.04,0).scale.set(1,.58,1);}
  /* Piccolo: manchas de músculo rosado de los namekianos en brazos */
  if(e==='namekPatches'){for(const L of['L','R']){const s=L==='L'?1:-1;add(Sph(.05,14,10),m.ex1,J['sh'+L],s*.035,-.05,0).scale.set(.75,1.3,1.1);add(Sph(.045,14,10),m.ex1,J['sh'+L],s*.03,-.17,.02).scale.set(.8,1.5,1);add(Sph(.04,14,10),m.ex1,J['el'+L],s*.025,-.09,.018).scale.set(.8,1.6,1);}}
  /* capa de 3 tramos con muelle: ondea con el movimiento y el viento */
  if(e==='cape'){let par=J.torso;const segs=[];for(let i=0;i<3;i++){const piv=new THREE.Group();piv.position.set(0,i?-.33:.5,i?0:-.15);par.add(piv);if(!i)model.extras.push(piv);addPart(Bx(.5+i*.04,.39,.02),m.ex2,piv,0,-.17,0);segs.push(piv);par=piv;}model.cape=segs;
   add(new THREE.CylinderGeometry(.03,.03,.52,8),m.ex1,J.torso,0,.5,-.12,0,0,Math.PI/2);}
  if(e==='ramHorns'||e==='ramHornsBig'){const k=e==='ramHornsBig'?1.35:1;for(const s of[1,-1])add(new THREE.TorusGeometry(.085*k,.032*k,10,24,Math.PI*1.5),m.ex1,H,s*.15,.2,-.03,0,s*Math.PI/2,s*.6);}
  if(e==='beard'){add(new THREE.ConeGeometry(.1,.42,14),m.ex1,H,0,-.24,.14,Math.PI+.25);}
  if(e==='beardShort'){add(new THREE.ConeGeometry(.075,.2,12),m.ex1,H,0,-.14,.15,Math.PI+.35);}
  if(e==='robe'){add(new THREE.CylinderGeometry(.18,.3,.62,26,1,true),m.ex2,J.hips,0,-.3,0);add(new THREE.CylinderGeometry(.14,.2,.12,24,1,true),m.ex2,J.torso,0,.56,-.01);}
  if(e==='gem'){add(new THREE.OctahedronGeometry(.045),new THREE.MeshBasicMaterial({color:0xff3a6a}),H,0,.22,.16).scale.set(1,1.4,.6);}
  if(e==='rocky'){for(let i=0;i<9;i++){const a=i/9*TAU;add(new THREE.DodecahedronGeometry(.06+.03*Math.random(),0),m.top,J.torso,Math.cos(a)*.25,.25+Math.random()*.3,Math.sin(a)*.16);}}
  if(e==='halo'){add(new THREE.TorusGeometry(.15,.03,12,36),m.ex2,J.torso,0,.6,-.02,Math.PI/2);}
  if(e==='staff'){add(new THREE.CylinderGeometry(.012,.012,1.6,8),m.ex1,J.elR,0,-.28,.03);add(Sph(.05,14,10),m.ex2,J.elR,0,.52,.03);}
 }
}
function applyFormModel(model,ch,f,torn){
 if(model.dragon){const c=ch.colors,m=model.mats;m.skin.color.setHex(c.skin);m.top.color.setHex(c.top);m.ex1.color.setHex(c.ex1);m.ex1.emissive.setHex(0x1a6a70);m.ex2.color.setHex(c.ex2);m.hair.color.setHex(ch.hairColor);return;}
 const c=Object.assign({},ch.colors,f.colors||{}),m=model.mats;
 const tear=(ch.saiyan||ch.id==='piccolo')&&ch.id!=='broly'&&!ch.fem,bare=torn>=3&&tear;
 m.skin.color.setHex(c.skin);
 m.top.color.setHex(bare?c.skin:c.top);if(torn===2&&tear)m.top.color.multiplyScalar(.75);
 m.inner.color.setHex(bare?c.skin:(c.inner??c.top));
 m.shoulder.color.setHex(bare?c.skin:(c.sleeve??c.inner??c.skin));
 m.pants.color.setHex(c.pants);m.belt.color.setHex(c.belt??c.pants);m.boots.color.setHex(c.boots??c.pants);
 m.sleeve.color.setHex(bare?c.skin:(c.sleeve??c.skin));m.glove.color.setHex(c.glove??c.skin);m.wrist.color.setHex(c.wrist??(c.glove??c.skin));
 m.eye.color.setHex(f.eye??c.eye??0xffffff);m.pupil.color.setHex(f.pupil??c.pupil??0x151515);
 /* manchas del caparazón (Cell): textura en torso, mangas y piernas; el color del material las tiñe */
 const sp=(f.spots??ch.spots)?SPOTS:null;for(const k of['top','inner','shoulder','sleeve','pants'])if(m[k].map!==sp){m[k].map=sp;m[k].needsUpdate=true;}
 m.ex1.color.setHex(c.ex1??0xffffff);m.ex2.color.setHex(c.ex2??0x222222);
 m.hair.color.setHex((f.hairColor??ch.hairColor)||0x1a1a1a);
 m.skin.emissive.setHex(f.kk?0x661010:0x000000);
 if(model.M.emblem)model.M.emblem.visible=!bare&&!(f.colors&&f.colors.top);
 setHair(model,f.hair||ch.hair);setExtras(model,f.extras||ch.extras||[]);
 /* altura canónica del personaje (ch.h, Goku = 1) por la escala de la forma */
 const s=f.scale||ch.scale||[1,1,1],Hh=ch.h||1;model.body.scale.set(s[0]*Hh,s[1]*Hh,s[2]*Hh);
 /* complexión de cada forma: SSJ4 manos y antebrazos grandes, Dios delgado, Super Vegeta y Legendario muy musculosos… */
 const B=Object.assign({},BUILDS[f.id]||{},ch.build||{},f.build||{}),M=model.M;
 if(M.fore){M.fore.forEach(g=>g.scale.set(B.fore||1,1,B.fore||1));M.hands.forEach(g=>g.scale.setScalar(B.hand||1));M.upper.forEach(g=>g.scale.set(B.upper||1,1,B.upper||1));M.chestG.scale.set(B.chest||1,1,B.chest||1);}
 if(M.brows)M.brows.forEach(b=>b.visible=!B.noBrow);
 const h=f.head||ch.head||[1,1,1];model.M.headG.scale.set(h[0],h[1],h[2]);model.M.headX.scale.set(HX*h[0],HX*h[1],HX*h[2]);
}
function disposeModel(model){model.root.traverse(o=>{if(o.geometry&&o.geometry!==BEAM_GEO)o.geometry.dispose();});}

