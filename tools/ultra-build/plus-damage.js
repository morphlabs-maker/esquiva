/* 2.2: daño visible. Sangre y ropa rasgada al llegar a vida crítica; huecos, grietas y escombros en el escenario */
const DMG_PURPLE=['piccolo','freezer','cell','dende','nail','cooler','kefla'].reduce((o,k)=>(o[k]=1,o),{}),DMG_NOBLOOD={gamma1:1,gamma2:1,buu:1,oozaru:1};
function dmgBloodCol(ch){return DMG_PURPLE[ch.id]?0x5a1a78:0x8a0a12;}
/* Formas irregulares (jirones, salpicaduras, regueros) generadas una vez y compartidas */
function dmgRng(seed){let s=seed>>>0||1;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296);}
function dmgJag(rnd,n,rough,sx=1,sy=1){const sh=new THREE.Shape();for(let i=0;i<n;i++){const a=i/n*TAU,r=1-rough*rnd()*(i%2?1:.35);const x=Math.cos(a)*r*sx,y=Math.sin(a)*r*sy;i?sh.lineTo(x,y):sh.moveTo(x,y);}return new THREE.ShapeGeometry(sh);}
function dmgStreak(rnd,len){const sh=new THREE.Shape(),w=.32;sh.moveTo(-w,.25);sh.quadraticCurveTo(0,.45,w,.25);
 const k=4;for(let i=1;i<=k;i++){const t=i/k;sh.lineTo(w*(1-t*.7)+(rnd()-.5)*.08,.25-t*len);}sh.quadraticCurveTo(0,-len-.12,-w*.3,.25-len);
 for(let i=k-1;i>=1;i--){const t=i/k;sh.lineTo(-w*(1-t*.7)+(rnd()-.5)*.08,.25-t*len);}return new THREE.ShapeGeometry(sh);}
const DMG_GEO=(()=>{const r=dmgRng(77);return{tear:[0,1,2].map(()=>dmgJag(r,16,.55,1,.8)),splat:[0,1,2].map(()=>dmgJag(r,14,.45)),streak:[dmgStreak(r,1.2),dmgStreak(r,1.8),dmgStreak(r,2.4)]};})();
const DMG_Z=new THREE.Vector3(0,0,1);
/* Coloca una pieza plana sobre un elipsoide (centro c, radios R) en la dirección (θ alrededor de Y, φ de elevación) */
function dmgOnEll(parent,geo,mat,c,R,th,ph,size,spin,lift=1.02){const d=V3(Math.sin(th)*Math.cos(ph),Math.sin(ph),Math.cos(th)*Math.cos(ph));
 const m=new THREE.Mesh(geo,mat);m.position.set(c[0]+d.x*R[0]*lift,c[1]+d.y*R[1]*lift,c[2]+d.z*R[2]*lift);
 const n=V3(d.x/R[0],d.y/R[1],d.z/R[2]).normalize();m.quaternion.setFromUnitVectors(DMG_Z,n);if(spin)m.rotateZ(spin);m.scale.setScalar(size);parent.add(m);return m;}
function dmgOnCyl(parent,geo,mat,c,r,th,y,size,spin){const m=new THREE.Mesh(geo,mat),d=V3(Math.sin(th),0,Math.cos(th));m.position.set(c[0]+d.x*r*1.03,c[1]+y,c[2]+d.z*r*1.03);m.quaternion.setFromUnitVectors(DMG_Z,d);if(spin)m.rotateZ(spin);m.scale.setScalar(size);parent.add(m);return m;}
function dmgMat(model,k,make){const M=model.dmgMats||(model.dmgMats={});return M[k]||(M[k]=make());}
function dmgLook(model,ch,f,torn){
 if(!model.J||!model.M||!model.M.headG)return;
 const key=torn>=2?[torn,ch.id,f.id,model.outfit||''].join('|'):'';if(model.dmgKey===key)return;model.dmgKey=key;
 if(model.dmgParts)for(const m of model.dmgParts)m.parent&&m.parent.remove(m);model.dmgParts=[];if(!key)return;
 const J=model.J,M=model.M,P=model.dmgParts,rnd=dmgRng([...ch.id].reduce((a,c)=>a*31+c.charCodeAt(0),7)+torn),heavy=torn>=3;
 const c=Object.assign({},ch.colors,model.outfit&&outfitOf(model.outfit)?outfitOf(model.outfit).colors:{},f.colors||{});
 const skin=c.skin,ex=f.extras||ch.extras||[],armor=ex.includes('armor');
 const off=m=>{m.polygonOffset=true;m.polygonOffsetFactor=-2;m.polygonOffsetUnits=-2;return m;};
 const skinM=dmgMat(model,'skin',()=>off(toon(0xffffff)));skinM.color.setHex(skin);
 const darkSkin=dmgMat(model,'bruise',()=>off(toon(0xffffff)));darkSkin.color.setHex(skin).multiply(new THREE.Color(0x9a6a8a));
 /* Ropa rasgada: jirones con borde deshilachado más oscuro que dejan ver la piel */
 const tearOn=(col,place)=>{if(col==null||col===skin)return;const edge=dmgMat(model,'edge'+col,()=>off(toon(0xffffff)));edge.color.setHex(col).multiplyScalar(.5);
  const g=DMG_GEO.tear[rnd()*3|0],sp=rnd()*TAU;P.push(place(g,edge,1.25,sp,1.012),place(g,skinM,1,sp,1.022));};
 const topCol=model.mats.top.color.getHex(),pantsCol=c.pants;
 const torsoC=[0,.29,0],torsoR=armor?[.273,.221,.2]:[.26,.21,.184];
 const nTop=heavy?6:3,nPants=heavy?4:2;
 for(let i=0;i<nTop;i++){const th=(i%2?1:-1)*(.2+rnd()*1.1)+(i>3?Math.PI:0),ph=-.45+rnd()*.8,sz=.035+rnd()*.03;
  tearOn(armor?c.ex1:(topCol===skin?null:topCol),(g,m,k,sp,l)=>dmgOnEll(J.torso,g,m,torsoC,torsoR,th,ph,sz*k,sp,l));}
 for(let i=0;i<nPants;i++){const L=i%2?'L':'R',hp=J['hip'+L];if(!hp)continue;const th=(rnd()-.5)*1.6,y=-.04-rnd()*.1,sz=.028+rnd()*.02;
  tearOn(pantsCol,(g,m,k,sp,l)=>dmgOnCyl(hp,g,m,[0,-.09,0],.08*(l>1.015?1.02:1),th,y,sz*k,sp));}
 if(heavy&&c.sleeve!=null&&c.sleeve!==skin&&M.arms.L)for(const L of['L','R'])tearOn(model.mats.sleeve.color.getHex(),(g,m,k,sp,l)=>dmgOnCyl(J['sh'+L],g,m,[0,-.1,0],.066*(l>1.015?1.02:1),(L==='L'?1:-1)*.5+rnd()*.6,-.02,.03*k,sp));
 /* Moratón en la mejilla y sangre (en los androides puros y en Buu no hay sangre) */
 P.push(dmgOnEll(M.headG,DMG_GEO.splat[0],darkSkin,[0,0,0],[.17,.177,.167],-.55,-.15,.03,0,1.012));
 if(!DMG_NOBLOOD[ch.id]){const bl=dmgMat(model,'blood',()=>off(new THREE.MeshBasicMaterial({color:0x8a0a12})));bl.color.setHex(dmgBloodCol(ch));
  const H=[0,0,0],HR=[.17,.177,.167];
  P.push(dmgOnEll(M.headG,DMG_GEO.streak[heavy?2:1],bl,H,HR,.42,.42,.034,0,1.03));
  P.push(dmgOnEll(J.torso,DMG_GEO.splat[1],bl,torsoC,torsoR,.5,.1,.035,rnd()*TAU,1.03));
  if(M.arms.L)P.push(dmgOnCyl(J.elL,DMG_GEO.streak[0],bl,[0,-.08,0],.058,.4,.02,.03,0));
  if(heavy){P.push(dmgOnEll(M.headG,DMG_GEO.streak[1],bl,H,HR,.2,-.5,.018,0,1.03));
   P.push(dmgOnEll(M.headG,DMG_GEO.streak[0],bl,H,HR,-.85,.3,.02,0,1.03));
   P.push(dmgOnEll(J.torso,DMG_GEO.streak[2],bl,torsoC,torsoR,-.35,.35,.03,0,1.03));
   P.push(dmgOnEll(J.torso,DMG_GEO.splat[2],bl,torsoC,torsoR,2.6,0,.045,rnd()*TAU,1.03));
   if(M.arms.R)P.push(dmgOnCyl(J.elR,DMG_GEO.splat[0],bl,[0,-.08,0],.058,-.3,-.03,.03,rnd()*TAU));
   if(J.hipL)P.push(dmgOnCyl(J.hipL,DMG_GEO.streak[1],bl,[0,-.09,0],.085,.3,.02,.03,0));}}
}
/* Gotas de sangre al recibir golpes fuertes en estado crítico, y manchas en el suelo */
const bloodSpots=[];
function bleedHit(def,big){if(def.torn<2||DMG_NOBLOOD[def.ch.id]||def.model.dragon||!world)return;if(!big&&Math.random()<.65)return;
 const col=dmgBloodCol(def.ch),cp=def.chest(),n=def.torn>=3?7:3,k=def.ch.giant?2:1;
 for(let i=0;i<n;i++)spawn({pos:cp.clone().add(V3(rand(-.2,.2),rand(-.1,.3),rand(-.2,.2))),vel:rndDir().multiplyScalar(rand(2,5)).add(V3(0,3,0)),color:col,size:rand(.07,.14)*k,life:rand(.45,.8),grav:16,smoke:true,op:.95});
 if(def.torn>=3&&big){const g=world.groundY(def.pos.x,def.pos.z);if(g>-1e9&&!world.void){const m=new THREE.Mesh(DMG_GEO.splat[Math.random()*3|0],new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.8,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3}));
  m.rotation.set(-Math.PI/2,0,Math.random()*TAU);m.scale.setScalar(rand(.18,.32)*k);m.position.set(def.pos.x+rand(-.4,.4),g+.035,def.pos.z+rand(-.4,.4));worldGroup.add(m);bloodSpots.push(m);
  if(bloodSpots.length>24){const o=bloodSpots.shift();o.parent&&o.parent.remove(o);o.material.dispose();}}}}
/* Huecos con borde, grietas radiales y escombros (sustituye a la mancha plana de antes) */
const CRACK_TEX=[0,1,2].map(v=>canvasTex(256,(g,S)=>{const rnd=dmgRng(311+v*97),C=S/2;
 const hole=g.createRadialGradient(C,C,0,C,C,S*.2);hole.addColorStop(0,'rgba(8,5,4,.95)');hole.addColorStop(.55,'rgba(25,16,10,.85)');hole.addColorStop(.85,'rgba(60,44,30,.55)');hole.addColorStop(1,'rgba(0,0,0,0)');
 g.fillStyle=hole;g.beginPath();for(let i=0;i<=18;i++){const a=i/18*TAU,r=S*(.17+rnd()*.04);i?g.lineTo(C+Math.cos(a)*r,C+Math.sin(a)*r):g.moveTo(C+Math.cos(a)*r,C+Math.sin(a)*r);}g.fill();
 g.strokeStyle='rgba(235,220,200,.35)';g.lineWidth=3;g.beginPath();g.arc(C,C,S*.2,0,TAU);g.stroke();
 g.lineCap='round';g.lineJoin='round';const segs=[];const br=(x,y,a,len,w,d)=>{const pts=[[x,y]];let px=x,py=y;
  for(let s=0;s<5;s++){a+=(rnd()-.5)*.55;px+=Math.cos(a)*len/5;py+=Math.sin(a)*len/5;pts.push([px,py]);if(d<1&&rnd()<.35)br(px,py,a+(rnd()<.5?-1:1)*(.5+rnd()*.4),len*.5,w*.6,d+1);}segs.push([pts,w]);};
 const n=7+(rnd()*4|0);for(let i=0;i<n;i++){const a=i/n*TAU+rnd()*.4,r0=S*.17;br(C+Math.cos(a)*r0,C+Math.sin(a)*r0,a,S*(.16+rnd()*.14),6+rnd()*3,0);}
 const draw=(col,k,dx,dy)=>{g.strokeStyle=col;for(const[pts,w]of segs)for(let i=1;i<pts.length;i++){g.lineWidth=Math.max(1,w*k*(1-i/pts.length*.8));g.beginPath();g.moveTo(pts[i-1][0]+dx,pts[i-1][1]+dy);g.lineTo(pts[i][0]+dx,pts[i][1]+dy);g.stroke();}};
 draw('rgba(255,245,225,.35)',1.1,2,2);draw('rgba(14,9,6,.9)',.75,0,0);}));
const CRACK_GEO=new THREE.PlaneGeometry(1,1),RUBBLE_GEO=new THREE.DodecahedronGeometry(1,0),rubbleMats={};
function crater2(pos,r){if(!world)return;const g=world.groundY(pos.x,pos.z);if(g<-1e9)return;if(world.onImpact&&world.onImpact(pos,r))return;
 const G=new THREE.Group();G.position.set(pos.x,g+.03+craters.length*.0004,pos.z);
 const m=new THREE.Mesh(CRACK_GEO,new THREE.MeshBasicMaterial({map:CRACK_TEX[Math.random()*3|0],transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));
 m.rotation.set(-Math.PI/2,0,Math.random()*TAU);m.scale.setScalar(r*2.9);G.add(m);
 if(r>=.9){const col=world.dirt||0x8a6a4a,mat=rubbleMats[col]||(rubbleMats[col]=toon(col)),n=Math.min(9,3+r*1.6|0);
  for(let i=0;i<n;i++){const a=Math.random()*TAU,d=r*(.62+Math.random()*.3),s=r*rand(.05,.11),b=new THREE.Mesh(RUBBLE_GEO,mat);b.position.set(Math.cos(a)*d,s*.25,Math.sin(a)*d);b.scale.set(s*rand(.8,1.4),s*rand(.5,.9),s*rand(.8,1.4));b.rotation.set(rand(0,3),rand(0,3),rand(0,3));G.add(b);}}
 worldGroup.add(G);craters.push(G);
 if(craters.length>36){const o=craters.shift();o.parent&&o.parent.remove(o);o.children[0].material.dispose();}}
function dmgClear(){bloodSpots.length=0;}
