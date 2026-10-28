/* =========================================================
   KAIOKEN CLASH 2.1 — ENTORNOS
   Namek, Torneo del Poder, Dimensión rota y Planeta de Bills rehechos; Tierra con más biomas
   (Kame House, Capital del Oeste, Montaña Paoz, Torneo de las Artes Marciales, Habitación del Tiempo) y la Antártida.
   Estilo del clásico: polígonos planos, colores por vértice y pixelado. Todo instanciado para que el celular vaya fluido.
   ========================================================= */
const WM=(c,o)=>new THREE.MeshPhongMaterial(Object.assign({color:c,flatShading:true,shininess:0},o||{}));
const BASIC=(c,o)=>new THREE.MeshBasicMaterial(Object.assign({color:c},o||{}));
function wAdd(geo,mat,x,y,z,o){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.ry!=null)m.rotation.y=o.ry;if(o.rx!=null)m.rotation.x=o.rx;if(o.rz!=null)m.rotation.z=o.rz;if(o.s)m.scale.set(o.s[0],o.s[1],o.s[2]);if(o.cast)m.castShadow=true;if(o.recv)m.receiveShadow=true;}(o&&o.parent||worldGroup).add(m);return m;}
/* terreno con alturas y colores por vértice */
function wTerrain(size,seg,hf,cf,flat=true){const g=new THREE.PlaneGeometry(size,size,seg,seg);g.rotateX(-Math.PI/2);const p=g.attributes.position,col=new Float32Array(p.count*3),c=new THREE.Color();
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),y=hf(x,z);p.setY(i,y);cf(c,x,z,y);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
 g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();const m=new THREE.Mesh(g,new THREE.MeshPhongMaterial({vertexColors:true,flatShading:flat,shininess:0}));m.receiveShadow=true;worldGroup.add(m);return m;}
/* muchos objetos iguales en una sola llamada de dibujo */
function wInst(geo,mat,list,shadow){const im=new THREE.InstancedMesh(geo,mat,list.length),M=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),col=new THREE.Color();
 list.forEach((o,i)=>{e.set(o.rx||0,o.ry||0,o.rz||0);q.setFromEuler(e);M.compose(V3(o.x,o.y,o.z),q,V3(o.sx??o.s??1,o.sy??o.s??1,o.sz??o.s??1));im.setMatrixAt(i,M);if(o.c!=null)im.setColorAt(i,col.setHex(o.c));});
 if(shadow)im.castShadow=true;worldGroup.add(im);return im;}
function wClouds(n,col,y0,y1,op=.9,R=900){for(let i=0;i<n;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:SMOKE,color:col,transparent:true,opacity:op,depthWrite:false,fog:false}));s.position.set(rand(-R,R),rand(y0,y1),rand(-R,R));s.scale.set(rand(160,320),rand(60,110),1);worldGroup.add(s);}}
function wStars(n,R=1300,size=2,col=0xffffff){const sp=[];for(let i=0;i<n;i++){const d=rndDir();if(d.y<-.15)d.y=-d.y;d.multiplyScalar(R);sp.push(d.x,d.y,d.z);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));const pts=new THREE.Points(g,new THREE.PointsMaterial({color:col,size,sizeAttenuation:false,fog:false,transparent:true,opacity:.9}));worldGroup.add(pts);return pts;}
function wSun(dir,dist,r,col,glow=3){const s=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),BASIC(col,{fog:false}));s.position.copy(dir.clone().normalize().multiplyScalar(dist));worldGroup.add(s);
 const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:col,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,fog:false}));gl.scale.setScalar(r*glow*2);gl.position.copy(s.position);worldGroup.add(gl);return s;}
function wLight(o){hemi.color.setHex(o.h);hemi.groundColor.setHex(o.g);hemi.intensity=o.hi??.95;sun.color.setHex(o.s);sun.intensity=o.si??1;sun.position.set(...(o.p||[-100,140,60]));}
/* árbol de copa redonda (pino si cone) */
function treeList(n,area,yf,ok){const L=[];let k=0;while(L.length<n&&k++<n*8){const x=rand(-area,area),z=rand(-area,area);if(ok&&!ok(x,z))continue;L.push({x,z,y:yf(x,z),s:rand(.7,1.4)});}return L;}
/* 3.0: los troncos son coberturas (tapan disparos y la vista de la CPU) */
let COVER=[];
function wTrees(L,trunkC,crownC,kind='round'){for(const t of L)COVER.push({x:t.x,z:t.z,r:.6*t.s,h:7*t.s,y0:t.y,alive:true,indestructible:true,cover:1,top(){return this.y0+this.h;}});const tr=L.map(t=>({x:t.x,y:t.y+2*t.s,z:t.z,sx:t.s,sy:t.s,sz:t.s}));wInst(new THREE.CylinderGeometry(.35,.55,4,5),WM(trunkC),tr,true);
 const cr=L.map(t=>({x:t.x,y:t.y+(kind==='pine'?5.4:5.2)*t.s,z:t.z,s:t.s,ry:t.x}));wInst(kind==='pine'?new THREE.ConeGeometry(2.2,6,6):new THREE.IcosahedronGeometry(2.4,0),WM(crownC),cr,true);}
/* casa redonda (Namek, Goku, Corporación Cápsula) */
function domeHouse(x,y,z,r,col,o={}){const g=new THREE.Group();g.position.set(x,y,z);worldGroup.add(g);
 const d=new THREE.Mesh(new THREE.SphereGeometry(r,14,8,0,TAU,0,Math.PI/2),WM(col));d.castShadow=true;g.add(d);if(o.squash)d.scale.y=o.squash;
 const win=BASIC(o.win??0x23324a);for(let i=0;i<(o.nw??3);i++){const a=(i/(o.nw??3))*TAU+.4,w=new THREE.Mesh(new THREE.CircleGeometry(r*.16,10),win);w.position.set(Math.cos(a)*r*.9,r*.42*(o.squash||1),Math.sin(a)*r*.9);w.lookAt(Math.cos(a)*r*3,r*.42,Math.sin(a)*r*3);g.add(w);}
 if(o.door){const dr=new THREE.Mesh(Bx(r*.36,r*.5,.3),WM(o.door));dr.position.set(0,r*.25,r*.94);g.add(dr);}
 if(o.chimney){const c=new THREE.Mesh(new THREE.CylinderGeometry(r*.12,r*.12,r*.5,8),WM(o.chimney));c.position.set(r*.4,r*(o.squash||1)*.9,0);g.add(c);}
 if(o.antenna){const a=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,r*.8,4),WM(0x8a8a8a));a.position.y=r*(o.squash||1)+r*.35;g.add(a);const b=new THREE.Mesh(Sph(r*.1,8,6),WM(0xd83a2a));b.position.y=r*(o.squash||1)+r*.75;g.add(b);}
 return g;}
function textTex(txt,fg,bg,w=256,h=64,font='bold 34px monospace'){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');if(bg){g.fillStyle=bg;g.fillRect(0,0,w,h);}g.fillStyle=fg;g.font=font;g.textAlign='center';g.textBaseline='middle';g.fillText(txt,w/2,h/2+2);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;return t;}
/* agua o lava animada (mismo sombreado de bandas que el original) */
function waterMat(c1,c2,speed=1){return new THREE.ShaderMaterial({uniforms:{uT:{value:0},uC:{value:new THREE.Color(c1)},uC2:{value:new THREE.Color(c2)}},
 vertexShader:`varying vec2 vW;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xz;gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`uniform float uT;uniform vec3 uC;uniform vec3 uC2;varying vec2 vW;void main(){float s=sin(vW.x*.12+uT*${(1.7*speed).toFixed(2)})*sin(vW.y*.1-uT*${(1.3*speed).toFixed(2)})+.3*sin((vW.x+vW.y)*.31+uT*2.0);float k=smoothstep(.55,.95,s);vec3 c=mix(uC,uC2,k);c=floor(c*16.0)/16.0;gl_FragColor=vec4(c,1.0);}`});}
/* copos de nieve, ceniza o motas que caen alrededor de la cámara */
function wFall(n,col,size,spd,area=120,h=70){const pos=new Float32Array(n*3);for(let i=0;i<n;i++){pos[i*3]=rand(-area,area);pos[i*3+1]=rand(0,h);pos[i*3+2]=rand(-area,area);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));const P=new THREE.Points(g,new THREE.PointsMaterial({color:col,size,sizeAttenuation:false,transparent:true,opacity:.9,depthWrite:false}));worldGroup.add(P);
 return dt=>{const a=g.attributes.position.array,cx=camLook.x,cz=camLook.z;for(let i=0;i<n;i++){a[i*3+1]-=spd*dt*(.6+.4*((i*7)%5)/4);a[i*3]+=Math.sin(i+a[i*3+1]*.05)*dt*2;
  if(a[i*3+1]<-2){a[i*3+1]=h;a[i*3]=cx+rand(-area,area);a[i*3+2]=cz+rand(-area,area);}}g.attributes.position.needsUpdate=true;};}

/* ---------------- NAMEK: islas, casas namekianas, árboles Ajissa, tres soles. Se pelea sobre la isla central o flotando sobre el mar ---------------- */
function buildNamek2(v){
 clearWorld();const fire=v===1;
 worldGroup.add(makeSky(fire?0x2a0606:0x5ad08a,fire?0xff5a22:0xdcffd0,fire?0x400a00:0x4aa878));scene.fog=new THREE.Fog(fire?0xc04020:0xb8f0c0,220,1000);
 wLight({h:fire?0xffa080:0xeaffea,g:fire?0x501000:0x2a6a50,s:fire?0xff8a5a:0xffffff,p:[80,140,-60]});
 if(!fire){wSun(V3(-.6,.32,-.7),1100,26,0xfff6c8);wSun(V3(-.4,.42,-.8),1100,18,0xfff0b0);wSun(V3(-.75,.24,-.6),1100,14,0xffe8a0);wClouds(16,0xeaffe8,150,260,.7);}
 else{wClouds(22,0x3a1008,120,240,.85);for(let i=0;i<6;i++){const a=rand(0,TAU),d=rand(380,600),h=rand(60,140);wAdd(new THREE.ConeGeometry(h*.7,h,7),WM(0x3a1a12),Math.cos(a)*d,h/2-8,Math.sin(a)*d);}}
 const wmat=waterMat(fire?0xff4a1a:0x2fbf9a,fire?0xffd04a:0x8affd8,fire?.6:1);
 const water=new THREE.Mesh(new THREE.PlaneGeometry(3200,3200),wmat);water.rotation.x=-Math.PI/2;water.position.y=-1;worldGroup.add(water);
 const rocks=[];const bands={top:fire?0x5a4a2a:0x7fcf4a,c:fire?[0x8a5a3a,0x6a4a30,0x9a6a48]:[0xd4c06a,0xc0a858,0xe0cf80]};
 /* isla central: aquí empieza la pelea */
 const cen=makeRock(bandedCylinder(19,22,14,16,bands),0,0,19,14,-12.5);cen.base=-12.5;cen.island=true;cen.central=true;cen.indestructible=true;rocks.push(cen);
 const islands=[];for(let i=0;i<22;i++){const a=rand(0,TAU),d=rand(34,170),r=rand(6,14),h=rand(14,40);const rk=makeRock(bandedCylinder(r*.85,r,h,9,bands),Math.cos(a)*d,Math.sin(a)*d,r,h,-12);rk.base=-12;rk.island=true;rocks.push(rk);islands.push(rk);}
 /* árboles Ajissa (copa redonda azul verdosa) sobre las islas */
 const tL=[];for(const r of[cen,...islands]){const n=r===cen?5:1+(Math.random()*3|0);for(let k=0;k<n;k++){const a=rand(0,TAU),d=rand(.2,.8)*r.r;if(r===cen&&(d<13||Math.abs(Math.sin(a))<.5))continue;tL.push({x:r.x+Math.cos(a)*d,z:r.z+Math.sin(a)*d,y:r.top(),s:rand(.8,1.3),rock:r});}}
 const trunks=wInst(new THREE.CylinderGeometry(.22,.38,6,5),WM(0xa88a58),tL.map(t=>({x:t.x,y:t.y+3*t.s,z:t.z,s:t.s})),true);
 const crowns=wInst(new THREE.IcosahedronGeometry(2.2,1),WM(fire?0x6a3a20:0x3fa8c8),tL.map(t=>({x:t.x,y:t.y+6.8*t.s,z:t.z,sx:t.s,sy:t.s*.8,sz:t.s})),true);
 /* casas namekianas en la isla central y en algunas cercanas */
 const houses=[domeHouse(-9,cen.top(),-14,3.4,0xe8f0e0,{squash:.9,nw:4,chimney:0xd8e0d0,win:0x2a4a3a}),domeHouse(10,cen.top(),-14,2.6,0xe8f0e0,{squash:.9,chimney:0xd8e0d0,win:0x2a4a3a})];
 for(const r of islands.filter(r=>r.r>10).slice(0,4))houses.push(domeHouse(r.x,r.top(),r.z,2.8,0xe8f0e0,{squash:.9,chimney:0xd8e0d0,win:0x2a4a3a}));
 houses.forEach(h=>h.userData.rock=h.position.distanceTo(V3(0,h.position.y,0))<20?cen:rocks.reduce((a,b)=>Math.hypot(b.x-h.position.x,b.z-h.position.z)<Math.hypot(a.x-h.position.x,a.z-h.position.z)?b:a));
 /* nave de Freezer */
 const ship=new THREE.Group();const dome=new THREE.Mesh(new THREE.SphereGeometry(10,14,8),WM(0xd8dde8));dome.scale.y=.55;const ringS=new THREE.Mesh(new THREE.TorusGeometry(10.4,.9,6,24),WM(0x8a9098));ringS.rotation.x=Math.PI/2;
 for(let i=0;i<10;i++){const w=new THREE.Mesh(new THREE.SphereGeometry(.8,6,4),BASIC(0xffe060));const a=i/10*TAU;w.position.set(Math.cos(a)*10.3,.6,Math.sin(a)*10.3);ship.add(w);}
 for(let i=0;i<4;i++){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.4,.6,6,5),WM(0x8a9098));const a=i/4*TAU+.4;leg.position.set(Math.cos(a)*6,-4,Math.sin(a)*6);ship.add(leg);}
 ship.add(dome,ringS);ship.position.set(110,5,-90);worldGroup.add(ship);
 const wall=new THREE.Mesh(new THREE.CylinderGeometry(1,1,90,48,1,true),BASIC(0xff3a3a,{transparent:true,opacity:.1,side:THREE.DoubleSide,depthWrite:false}));wall.position.y=35;worldGroup.add(wall);
 const fall=fire?wFall(160,0xff8a3a,2,6):null;
 const W={id:'namek',name:'Namek',dirt:0xc8b060,rocks,bound:140,maxY:90,spawnY:cen.top(),level:-1,lava:fire,water,wmat,wall,
  groundY(x,z){let g=this.level+.35;for(const r of this.rocks)if(r.alive&&r.island&&(x-r.x)**2+(z-r.z)**2<r.r*r.r*.85)g=Math.max(g,r.top());return g;},
  resetRound(){this.level=-1;this.water.position.y=-1;this.bound=140;for(const r of this.rocks)if(r.island){r.y0=r.base;r.mesh.position.y=r.y0+r.h/2;}this.syncDeco();},
  syncDeco(){const M=new THREE.Matrix4(),p=V3(),q=new THREE.Quaternion(),s=V3();tL.forEach((t,i)=>{for(const im of[trunks,crowns]){im.getMatrixAt(i,M);M.decompose(p,q,s);p.y+=t.rock.top()-t.y;M.compose(p,q,s);im.setMatrixAt(i,M);}t.y=t.rock.top();});
   trunks.instanceMatrix.needsUpdate=crowns.instanceMatrix.needsUpdate=true;for(const h of houses)h.position.y=h.userData.rock.top();},
  anim(dt){this.wmat.uniforms.uT.value+=dt;if(fall)fall(dt);ship.rotation.y+=dt*.02;},
  update(dt){this.anim(dt);const t=Math.min(99,game.roundT);this.level=-1+t/99*(fire?7:5);this.water.position.y=this.level;
   const target=140*Math.pow(.85,Math.floor(t/33));this.bound=lerp(this.bound,target,1-Math.exp(-2*dt));this.wall.scale.set(this.bound,1,this.bound);
   for(const r of this.rocks)if(r.island){r.y0=r.base-t*(r.central?.025:.06);r.mesh.position.y=r.y0+r.h/2;}this.syncDeco();
   if(fire&&game.phase==='fight')for(const f of game.f)if(f.pos.y<this.level+.7&&f.state!=='ko'){f.lavaT=(f.lavaT||0)-dt;if(f.lavaT<=0){f.lavaT=.25;envDamage(f,50,null);spawn({pos:f.pos.clone(),vel:V3(0,6,0),color:0xff7a2a,size:1.2,life:.4});}}}};
 return W;}

/* ---------------- TORNEO DEL PODER: arena enorme de losas, columnas, gradas de los 8 universos y el palco de Zeno ---------------- */
function buildVoid2(v){
 clearWorld();const ruins=v===1;
 const sky=new THREE.Mesh(new THREE.SphereGeometry(1500,40,24),new THREE.ShaderMaterial({uniforms:{uT:{value:0}},side:THREE.BackSide,depthWrite:false,fog:false,
  vertexShader:`varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`uniform float uT;varying vec3 vP;void main(){float a=atan(vP.z,vP.x),y=vP.y;float sw=.5+.5*sin(a*3.0+y*5.0+uT*.05+sin(a*2.0-uT*.03)*2.0);
   vec3 c=mix(vec3(.02,.01,.06),vec3(.16,.05,.3),sw*smoothstep(-.3,.6,y));c+=vec3(.05,.12,.3)*pow(.5+.5*sin(a*5.0-y*3.0+uT*.04),6.0);c=floor(c*24.0)/24.0;gl_FragColor=vec4(c,1.0);}`}));
 sky.renderOrder=-10;worldGroup.add(sky);scene.fog=new THREE.Fog(0x140828,320,1400);wStars(2600,1200,2);
 wLight({h:0xd8c8ff,g:0x201040,hi:.85,s:0xffffff,si:1.05,p:[10,200,10]});
 for(let i=0;i<12;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:SMOKE,color:[0x7a2aff,0xff3a9a,0x2a6aff,0x2affd0][i%4],transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));const d=rndDir().multiplyScalar(950);s.position.copy(d);s.scale.setScalar(rand(320,700));worldGroup.add(s);}
 /* losas: un disco grande con dibujo de baldosas y un círculo central */
 const T=4,R=62,cells=[];for(let i=-17;i<17;i++)for(let j=-17;j<17;j++){const cx=(i+.5)*T,cz=(j+.5)*T;if(Math.hypot(cx,cz)<R)cells.push([i,j,cx,cz]);}
 const tiles=new THREE.InstancedMesh(Bx(3.88,3,3.88),new THREE.MeshToonMaterial({color:0xffffff,gradientMap:TOON}),cells.length);const map=new Map(),alive=[];const mtx=new THREE.Matrix4(),col=new THREE.Color();
 cells.forEach((c,k)=>{mtx.makeTranslation(c[2],-1.5,c[3]);tiles.setMatrixAt(k,mtx);const d=Math.hypot(c[2],c[3]),ring=Math.abs(d-14)<2||Math.abs(d-40)<2;col.setHex(ring?0x9a92b8:(c[0]+c[1])%2?0xd4cee0:0xc4bed4).multiplyScalar(rand(.92,1.04));tiles.setColorAt(k,col);map.set(c[0]+','+c[1],k);alive.push(true);});
 tiles.receiveShadow=true;worldGroup.add(tiles);
 const rim=new THREE.Mesh(new THREE.CylinderGeometry(R+.5,R-6,10,64,1,true),WM(0x8a84a0,{side:THREE.DoubleSide}));rim.position.y=-6;worldGroup.add(rim);
 const under=new THREE.Mesh(new THREE.ConeGeometry(R-4,60,24),WM(0x6a648a));under.rotation.x=Math.PI;under.position.y=-38;worldGroup.add(under);
 /* columnas alrededor */
 const cols=[];for(let i=0;i<16;i++){const a=i/16*TAU;cols.push({x:Math.cos(a)*(R+8),y:-10,z:Math.sin(a)*(R+8)});}
 wInst(new THREE.CylinderGeometry(2.6,3,70,10),WM(0xe0dae8),cols.map(c=>({x:c.x,y:c.y+35,z:c.z})));wInst(Bx(7,3,7),WM(0xc8a8ff),cols.map(c=>({x:c.x,y:c.y+71,z:c.z})));
 /* gradas flotantes de los 8 universos y palco de Zeno con el Gran Sacerdote */
 const UC=[0x3a8aff,0xff4a4a,0x4aff8a,0xffd23a,0xc06aff,0xff8a3a,0x4ae0ff,0xff6ad0];
 for(let i=0;i<8;i++){const a=i/8*TAU+.2,d=R+60,st=new THREE.Group();st.position.set(Math.cos(a)*d,28+(i%2)*10,Math.sin(a)*d);st.lookAt(0,st.position.y,0);worldGroup.add(st);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(9,6,4,8),WM(0x5a5478));st.add(base);const top=new THREE.Mesh(new THREE.CylinderGeometry(9.2,9.2,.8,8),WM(UC[i]));top.position.y=2.4;st.add(top);
  const num=new THREE.Mesh(new THREE.PlaneGeometry(6,3),BASIC(0xffffff,{map:textTex('U'+[1,2,3,4,6,7,9,11][i],'#fff',hex(UC[i]),128,64),transparent:true}));num.position.set(0,-1,6.2);st.add(num);}
 const zeno=new THREE.Group();zeno.position.set(0,60,-(R+70));worldGroup.add(zeno);zeno.add(new THREE.Mesh(new THREE.CylinderGeometry(14,10,6,12),WM(0x6a5a9a)));
 const box=new THREE.Mesh(Bx(18,10,10),WM(0xe8e0f8));box.position.y=8;zeno.add(box);const win=new THREE.Mesh(new THREE.PlaneGeometry(14,6),BASIC(0x8ad0ff));win.position.set(0,8,5.1);zeno.add(win);
 const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:0xb08aff,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));gl.scale.setScalar(80);gl.position.y=6;zeno.add(gl);
 const orbs=[];for(let i=0;i<10;i++){const o=new THREE.Mesh(new THREE.SphereGeometry(rand(8,22),16,12),BASIC([0x6a3aff,0xff4ab0,0x3ab0ff][i%3],{transparent:true,opacity:.35}));const d=rndDir().multiplyScalar(rand(300,600));if(d.y<0)d.y*=-.5;o.position.copy(d);worldGroup.add(o);orbs.push(o);}
 const barMat=BASIC(0xa060ff,{transparent:true,opacity:.07,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
 const bar=new THREE.Mesh(new THREE.CylinderGeometry(R-2.4,R-2.4,60,64,1,true),barMat);bar.position.y=28;worldGroup.add(bar);
 const barBase=new THREE.Mesh(new THREE.RingGeometry(R-3,R-2,64),BASIC(0xc890ff,{transparent:true,opacity:.6,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));barBase.rotation.x=-Math.PI/2;barBase.position.y=.15;worldGroup.add(barBase);
 const W={id:'void',name:'Mundo del Vacío',dirt:0xb8b2c8,rocks:[],bound:R-3,barrier:true,maxY:34,spawnY:1,tiles,map,alive,cells,void:true,
  killTile(k){if(!this.alive[k])return;this.alive[k]=false;mtx.makeScale(0,0,0);this.tiles.setMatrixAt(k,mtx);this.tiles.instanceMatrix.needsUpdate=true;const c=this.cells[k];spawnDebris(V3(c[2],-.5,c[3]),0xb8b2c8,2,8,1.2);},
  groundY(x,z){const k=this.map.get(Math.floor(x/T)+','+Math.floor(z/T));return k!=null&&this.alive[k]?0:-Infinity;},
  onImpact(pos,r){if(pos.y>2)return true;for(let k=0;k<this.cells.length;k++){const c=this.cells[k];if(this.alive[k]&&Math.hypot(c[2]-pos.x,c[3]-pos.z)<r*.9&&Math.hypot(c[2],c[3])>8)this.killTile(k);}return true;},
  anim(dt){sky.material.uniforms.uT.value+=dt;orbs.forEach((o,i)=>o.position.y+=Math.sin(performance.now()/1000*.3+i)*dt*2);},resetRound(){},update(dt){this.anim(dt);}};
 if(ruins){cells.forEach((c,k)=>{if(Math.hypot(c[2],c[3])>9&&Math.random()<.35){W.alive[k]=false;mtx.makeScale(0,0,0);tiles.setMatrixAt(k,mtx);}});tiles.instanceMatrix.needsUpdate=true;
  wInst(Bx(3.8,1.5,3.8),WM(0xb8b2c8),Array.from({length:60},()=>{const a=rand(0,TAU),d=rand(70,140);return{x:Math.cos(a)*d,y:rand(-40,25),z:Math.sin(a)*d,rx:rand(-1,1),ry:rand(0,3),rz:rand(-1,1)};}));}
 return W;}

/* ---------------- DIMENSIÓN ROTA: el espacio hecho añicos. Mucho más grande, con galaxias, grietas entre dimensiones y trozos de otros mundos ---------------- */
function buildBroken2(v){
 clearWorld();const coll=v===1;
 const sky=new THREE.Mesh(new THREE.SphereGeometry(1500,48,32),new THREE.ShaderMaterial({uniforms:{uT:{value:0}},side:THREE.BackSide,depthWrite:false,fog:false,
  vertexShader:`varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`uniform float uT;varying vec3 vP;
   float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
   float fbm(vec2 p){float s=0.0,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
   vec3 vor(vec2 p){vec2 i=floor(p),f=fract(p);float d1=8.0,d2=8.0,id=0.0;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(x,y),o=vec2(h(i+g),h(i+g+7.3));float d=length(g+o-f);if(d<d1){d2=d1;d1=d;id=h(i+g+3.1);}else if(d<d2)d2=d;}return vec3(d1,d2,id);}
   void main(){float a=atan(vP.z,vP.x),b=asin(clamp(vP.y,-1.0,1.0));vec2 uv=vec2(a*2.2,b*2.6);
    float neb=fbm(uv*1.4+vec2(uT*.02,0.0));vec3 space=mix(vec3(.01,.01,.04),vec3(.22,.05,.38),neb*neb*1.6);space+=vec3(.04,.22,.42)*pow(fbm(uv*2.6-uT*.03),3.0)*2.4;space+=vec3(.5,.2,.1)*pow(fbm(uv*1.1+3.0),5.0)*3.0;
    vec3 v=vor(uv*1.5+vec2(sin(uT*.04)*.3,0.0));float edge=1.0-smoothstep(0.0,.025,v.y-v.x);
    vec3 other=.5+.5*cos(6.2831*(v.z+vec3(0.0,.33,.67))+uT*.15);float win=step(.82,v.z)*smoothstep(.02,.12,v.y-v.x);
    vec3 c=mix(space,other*.45+space*.5,win*.55);c+=edge*vec3(.75,.95,1.0)*(.55+.45*sin(uT*1.5+v.z*30.0));
    float st=step(.993,h(floor(uv*110.0)));c+=st*vec3(.9);c=floor(c*28.0)/28.0;gl_FragColor=vec4(c,1.0);}`}));
 sky.renderOrder=-10;worldGroup.add(sky);scene.fog=new THREE.Fog(0x1a0e30,400,1500);
 wLight({h:0xe8d8ff,g:0x402060,hi:1,s:0xffffff,si:.9,p:[20,160,30]});
 /* galaxias en espiral */
 const gals=[];for(const[pos,c1,c2]of[[V3(-420,180,-600),0xffd0a0,0x6a8aff],[V3(520,-60,-300),0xff8ad8,0x8affd8]]){const N=1600,arr=new Float32Array(N*3),cl=new Float32Array(N*3),cc=new THREE.Color();
  for(let i=0;i<N;i++){const arm=i%3,r=Math.pow(Math.random(),.6)*130,ang=r*.05+arm*TAU/3+rand(-.35,.35);arr[i*3]=Math.cos(ang)*r;arr[i*3+1]=rand(-4,4)*(1-r/130);arr[i*3+2]=Math.sin(ang)*r;cc.setHex(c1).lerp(new THREE.Color(c2),r/130);cl[i*3]=cc.r;cl[i*3+1]=cc.g;cl[i*3+2]=cc.b;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(arr,3));g.setAttribute('color',new THREE.BufferAttribute(cl,3));
  const P=new THREE.Points(g,new THREE.PointsMaterial({size:2,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:.9,depthWrite:false,fog:false}));P.position.copy(pos);P.rotation.set(rand(-1,1),0,rand(-1,1));worldGroup.add(P);gals.push(P);}
 /* tres capas de cristales a distintas distancias (profundidad) con bordes que brillan */
 const shards=[],geos=[new THREE.TetrahedronGeometry(1),new THREE.OctahedronGeometry(1),new THREE.BoxGeometry(1.6,.1,1.1),new THREE.IcosahedronGeometry(1,0)];
 for(const[n,d0,d1,s0,s1]of[[70,40,160,1.5,7],[60,200,420,6,22],[30,520,900,20,60]])for(let i=0;i<n;i++){const c=new THREE.Color().setHSL(Math.random(),.75,.62),g=geos[i%4];
  const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.35,metalness:.4,roughness:.15,transparent:true,opacity:.62,flatShading:true}));
  const e=new THREE.LineSegments(new THREE.EdgesGeometry(g),BASIC(0xffffff,{transparent:true,opacity:.75}));m.add(e);
  const d=rand(d0,d1),a=rand(0,TAU),el=rand(-.6,.8);m.position.set(Math.cos(a)*Math.cos(el)*d,Math.sin(el)*d,Math.sin(a)*Math.cos(el)*d);m.scale.setScalar(rand(s0,s1));m.rotation.set(rand(0,3),rand(0,3),rand(0,3));worldGroup.add(m);shards.push({m,spin:rndDir().multiplyScalar(rand(.05,.5)),bob:rand(0,TAU)});}
 /* grietas entre dimensiones: anillos y planos de luz */
 const rifts=[];for(let i=0;i<6;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(rand(40,120),rand(.6,1.4),6,64),BASIC([0x9affff,0xff8aff,0xfff08a][i%3],{transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));r.position.set(rand(-200,200),rand(-60,140),rand(-200,200));r.rotation.set(rand(0,3),rand(0,3),0);worldGroup.add(r);rifts.push(r);}
 /* trozos de otros mundos flotando: Tierra, Namek, el planeta de Kaiosama */
 const chunk=(x,y,z,s,top,side,deco)=>{const g=new THREE.Group();g.position.set(x,y,z);worldGroup.add(g);const b=new THREE.Mesh(new THREE.ConeGeometry(s,s*1.5,7),WM(side));b.rotation.x=Math.PI;b.position.y=-s*.75;g.add(b);
  const t=new THREE.Mesh(new THREE.CylinderGeometry(s,s,.6,7),WM(top));g.add(t);deco(g,s);shards.push({m:g,spin:V3(0,rand(.02,.08),0),bob:rand(0,TAU)});return g;};
 chunk(-90,30,-60,14,0xc49a62,0x8a6040,(g,s)=>{const m=new THREE.Mesh(bandedCylinder(4,5,12,7,{c:[0xc08a52,0xa66e3e]}),WM(0xffffff,{vertexColors:true}));m.position.set(3,6,0);g.add(m);});
 chunk(110,-20,40,12,0x7fcf4a,0xd4c06a,(g,s)=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.3,.4,5,5),WM(0xa88a58));t.position.y=2.5;g.add(t);const c=new THREE.Mesh(new THREE.IcosahedronGeometry(2,1),WM(0x3fa8c8));c.position.y=5.5;g.add(c);const hz=new THREE.Mesh(new THREE.SphereGeometry(2.2,10,6,0,TAU,0,Math.PI/2),WM(0xe8f0e0));hz.position.set(-4,0,2);g.add(hz);});
 chunk(-40,-50,130,9,0x5cb84a,0x4a3a2a,(g,s)=>{const h=new THREE.Mesh(new THREE.SphereGeometry(3,12,6,0,TAU,0,Math.PI/2),WM(0xf4f0e8));g.add(h);const r=new THREE.Mesh(new THREE.SphereGeometry(3.1,12,4,0,TAU,0,Math.PI*.2),WM(0xc83a2a));g.add(r);});
 /* plataforma de cristal en el centro, a modo de referencia (no es suelo) */
 const W={id:'broken',name:'Dimensión rota',dirt:0xc8a8ff,rocks:[],bound:150,maxY:110,minY:-90,spawnY:8,sky,shards,shardT:4,
  groundY(){return -Infinity;},resetRound(){},
  anim(dt){this.sky.material.uniforms.uT.value+=dt;const T=performance.now()/1000;for(const s of this.shards){s.m.rotation.x+=s.spin.x*dt;s.m.rotation.y+=s.spin.y*dt;s.m.position.y+=Math.sin(T+s.bob)*dt*.6;}
   gals.forEach((g,i)=>g.rotation.y+=dt*(.02+i*.01));rifts.forEach((r,i)=>{r.rotation.z+=dt*.1*(i%2?1:-1);r.material.opacity=.35+.25*Math.sin(T*2+i);});},
  update(dt){this.anim(dt);if(!coll||game.phase!=='fight')return;this.shardT-=dt;if(this.shardT<=0){this.shardT=rand(3,6);shardStrike();}}};
 return W;}

/* ---------------- PLANETA DE BILLS: planeta pequeño de horizonte curvo, el palacio-torre, rocas flotantes con árboles, el estanque del pez oráculo ---------------- */
function buildBills2(v){
 clearWorld();const night=v===1,R=340;
 worldGroup.add(makeSky(night?0x0a0820:0x6a5ad8,night?0x5a2a7a:0xf0b8e0,0x4a2a6a));scene.fog=new THREE.Fog(night?0x2a1a4a:0xe0c0ec,260,1100);
 wLight({h:night?0x9a9ad8:0xfff0ff,g:0x3a5a3a,s:night?0xb0b8ff:0xfff2e0,si:night?.65:1.05,p:[-80,140,60]});
 wStars(night?1600:500,1300,2,night?0xffffff:0xfff0ff);
 /* planeta anillado y lunas en el cielo */
 const big=new THREE.Mesh(new THREE.SphereGeometry(150,24,16),WM(night?0x8a6ad8:0xe8a0d8,{fog:false}));big.position.set(-700,520,-1000);worldGroup.add(big);
 const rg=new THREE.Mesh(new THREE.RingGeometry(190,250,48),BASIC(0xffe0f0,{fog:false,transparent:true,opacity:.55,side:THREE.DoubleSide}));rg.position.copy(big.position);rg.rotation.set(1.2,.3,0);worldGroup.add(rg);
 wSun(V3(.6,.5,-.7),1150,30,night?0xd8d0ff:0xfff8e0,2.2);
 /* suelo: casquete de planeta (el horizonte se curva) */
 const gY=(x,z)=>{const r2=x*x+z*z;return r2<R*R?Math.sqrt(R*R-r2)-R:-Infinity;};
 const pg=new THREE.SphereGeometry(R,96,48,0,TAU,0,Math.PI*.45),pp=pg.attributes.position,pc=new Float32Array(pp.count*3),c=new THREE.Color();
 for(let i=0;i<pp.count;i++){const x=pp.getX(i),z=pp.getZ(i),r=Math.hypot(x,z);c.setHex(r<17?0xd8cfc0:nz(x*1.5,z*1.3)>.1?0x6ab84a:0x58a840);if(nz(x*.4+40,z*.4)>.75)c.setHex(0xb07ad8);if(night)c.multiplyScalar(.7);pc[i*3]=c.r;pc[i*3+1]=c.g;pc[i*3+2]=c.b;}
 pg.setAttribute('color',new THREE.BufferAttribute(pc,3));const planet=new THREE.Mesh(pg,new THREE.MeshPhongMaterial({vertexColors:true,flatShading:true,shininess:0}));planet.position.y=-R;planet.receiveShadow=true;worldGroup.add(planet);
 /* plaza de entrenamiento de Whis */
 const plat=wAdd(new THREE.CylinderGeometry(16,17,.8,40),WM(0xcfc6b8),0,.2,0,{recv:true});
 const ring=new THREE.Mesh(new THREE.RingGeometry(14.6,15.2,64),BASIC(0x9a6aff,{side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.62;worldGroup.add(ring);
 /* palacio de Bills: pirámide escalonada, torre fina y cúpula de bulbo */
 const px=-120,pz=-150,py=gY(px,pz),pal=new THREE.Group();pal.position.set(px,py,pz);worldGroup.add(pal);
 for(let i=0;i<7;i++){const s=70-9*i,st=new THREE.Mesh(Bx(s,7,s),WM(i%2?0x5a5a8a:0x4a4a78));st.position.y=3.5+7*i;st.castShadow=true;pal.add(st);const tr=new THREE.Mesh(Bx(s+.6,.8,s+.6),WM(0xc8a0ff));tr.position.y=7*i+7;pal.add(tr);}
 const tower=new THREE.Mesh(new THREE.CylinderGeometry(3,5.5,70,10),WM(0xe8d8c0));tower.position.y=49+35;pal.add(tower);
 const bulb=new THREE.Mesh(new THREE.SphereGeometry(10,16,12),WM(0x9a5ad8));bulb.scale.y=1.25;bulb.position.y=49+70+8;pal.add(bulb);
 const tip=new THREE.Mesh(new THREE.ConeGeometry(2,12,8),WM(0xffd23a));tip.position.y=49+70+24;pal.add(tip);
 for(const s of[-1,1]){const t2=new THREE.Mesh(new THREE.CylinderGeometry(2,3,40,8),WM(0xe8d8c0));t2.position.set(s*22,49+20,0);pal.add(t2);const b2=new THREE.Mesh(new THREE.SphereGeometry(5,12,8),WM(0x7a4ab8));b2.position.set(s*22,49+44,0);pal.add(b2);}
 const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:0xc08aff,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));glow.scale.setScalar(60);glow.position.y=49+78;pal.add(glow);
 /* árboles de bulbo (naranjas, morados y turquesa) */
 const tl=treeList(46,150,gY,(x,z)=>Math.hypot(x,z)>22&&Math.hypot(x-px,z-pz)>48&&Math.hypot(x-55,z+35)>24);
 wInst(new THREE.CylinderGeometry(.5,1.1,9,6),WM(0x8a5a3a),tl.map(t=>({x:t.x,y:t.y+4.5*t.s,z:t.z,s:t.s,rz:rand(-.15,.15)})),true);
 const bc=[0xffa040,0xd06aff,0x6ad0a0,0xff6a9a];wInst(new THREE.SphereGeometry(3.8,12,8),WM(0xffffff),tl.map((t,i)=>({x:t.x,y:t.y+10.5*t.s,z:t.z,sx:t.s*1.2,sy:t.s*.8,sz:t.s*1.2,c:bc[i%4]})),true);
 wInst(new THREE.SphereGeometry(1.3,8,6),WM(0xffe04a),tl.flatMap(t=>[0,1,2].map(k=>({x:t.x+Math.cos(k*2.1)*2.8*t.s,y:t.y+8.2*t.s,z:t.z+Math.sin(k*2.1)*2.8*t.s,s:t.s}))));
 /* estanque con el pez oráculo */
 const pond=wAdd(new THREE.CircleGeometry(20,40),WM(0x3a7ad0,{shininess:60,flatShading:false}),55,gY(55,-35)+.25,-35,{rx:-Math.PI/2});
 const fish=new THREE.Group();fish.position.set(55,gY(55,-35)+.6,-35);worldGroup.add(fish);const fb=new THREE.Mesh(new THREE.SphereGeometry(2,12,8),WM(0xff8a3a));fb.scale.set(1.8,1,1);fish.add(fb);
 const ft=new THREE.Mesh(new THREE.ConeGeometry(1.2,2,6),WM(0xffb06a));ft.rotation.z=Math.PI/2;ft.position.x=-4.2;fish.add(ft);for(const s of[-1,1]){const e=new THREE.Mesh(Sph(.35,8,6),BASIC(0x111111));e.position.set(2.6,.6,s*1);fish.add(e);}
 /* rocas flotantes con césped y árboles (alrededor del planeta) */
 const floats=[];for(let i=0;i<24;i++){const a=rand(0,TAU),d=rand(70,320),r=rand(4,14),y=rand(35,140),g=new THREE.Group();g.position.set(Math.cos(a)*d,y,Math.sin(a)*d);worldGroup.add(g);
  const rk=new THREE.Mesh(new THREE.ConeGeometry(r,r*1.8,7),WM(0x7a6a7a));rk.rotation.x=Math.PI;rk.position.y=-r*.9;g.add(rk);const top=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.95,1,7),WM(0x6ab84a));g.add(top);
  if(r>7){const t=new THREE.Mesh(new THREE.CylinderGeometry(.4,.7,6,5),WM(0x8a5a3a));t.position.y=3;g.add(t);const b=new THREE.Mesh(new THREE.SphereGeometry(2.6,10,6),WM(bc[i%4]));b.position.y=6.5;g.add(b);}floats.push({g,b:rand(0,TAU)});}
 const rocks=[];for(let i=0;i<10;i++){const a=rand(0,TAU),d=rand(32,110),r=rand(3,6),h=rand(8,18),x=Math.cos(a)*d,z=Math.sin(a)*d;rocks.push(makeRock(bandedCylinder(r*.85,r,h,9,{c:[0x9a8aa8,0x8a7a98,0xaa9ab8]}),x,z,r,h,gY(x,z)-1));}
 const motes=wFall(120,night?0xc8b0ff:0xfff0a0,2,-3,110,60);
 return{id:'bills',name:'Planeta de Bills',dirt:0x6a8a4a,rocks,bound:150,maxY:95,spawnY:1,groundY(x,z){return x*x+z*z<256?.6:gY(x,z);},resetRound(){},
  anim(dt){const T=performance.now()/1000;floats.forEach(f=>f.g.position.y+=Math.sin(T*.6+f.b)*dt*.8);fish.position.y=gY(55,-35)+.6+Math.sin(T*1.4)*.4;fish.rotation.y=Math.sin(T*.5)*.6;rg.rotation.z+=dt*.01;motes(dt);},
  update(dt){this.anim(dt);}};}

/* ---------------- ANTÁRTIDA: hielo, glaciares, icebergs, aurora austral y nieve (Dragon Ball Super: Broly) ---------------- */
function buildAntarctic(v){
 clearWorld();const storm=v===1;
 worldGroup.add(makeSky(storm?0x3a4a5a:0x1a3a7a,storm?0x8a9aa8:0xa8d0f0,0xdde8f0));scene.fog=new THREE.Fog(storm?0xa8b4c0:0xc8e0f0,storm?60:220,storm?520:1100);
 wLight({h:storm?0xc0c8d8:0xe8f4ff,g:0x8aa0c0,hi:1,s:storm?0xc8d0e0:0xfff8f0,si:storm?.55:1,p:[120,90,-80]});
 if(!storm){wSun(V3(.55,.18,-.8),1150,20,0xfff6e0,2.5);wStars(300,1300,1.5);}
 /* aurora: cintas de luz que ondulan */
 const auroras=[];if(!storm)for(let i=0;i<3;i++){const g=new THREE.PlaneGeometry(900,160,60,1),m=new THREE.ShaderMaterial({uniforms:{uT:{value:0},uC:{value:new THREE.Color(i===1?0xff6ad8:0x6affb0)}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false,
   vertexShader:`uniform float uT;varying vec2 vU;void main(){vU=uv;vec3 p=position;p.z+=sin(p.x*.01+uT*.4)*60.0;p.y+=sin(p.x*.02-uT*.3)*20.0;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
   fragmentShader:`uniform float uT;uniform vec3 uC;varying vec2 vU;void main(){float a=smoothstep(0.0,.4,vU.y)*(1.0-vU.y)*(.5+.5*sin(vU.x*40.0+uT*1.5));gl_FragColor=vec4(uC*a*.8,1.0);}`});
  const a=new THREE.Mesh(g,m);a.position.set(rand(-200,200),300+i*40,-700+i*60);a.rotation.y=rand(-.3,.3);worldGroup.add(a);auroras.push(m);}
 /* nieve con dunas y grietas azules */
 wTerrain(2600,100,(x,z)=>{const r=Math.hypot(x,z);return r<90?0:(nz(x*.8,z*.8)+1)*Math.min(1,(r-90)/150)*12;},(c,x,z,y)=>{c.setHex(nz(x*2.3,z*2.1)>.55?0xb8d4ec:y>8?0xffffff:0xeef6fc);if(storm)c.multiplyScalar(.85);});
 /* glaciares y agujas de hielo */
 const ice=WM(0x9ad4f4,{transparent:true,opacity:.92,shininess:60,flatShading:true}),ice2=WM(0xd8f0ff,{shininess:40});
 const rocks=[];for(let i=0;i<26;i++){const a=rand(0,TAU),d=rand(45,170),r=rand(3,9),h=rand(10,34),x=Math.cos(a)*d,z=Math.sin(a)*d;const rk=makeRock(new THREE.CylinderGeometry(r*.3,r,h,6),x,z,r,h,0,0x9ad4f4);rk.mesh.material=i%3?ice:ice2;rocks.push(rk);}
 wInst(new THREE.IcosahedronGeometry(1,0),ice,Array.from({length:60},()=>{const a=rand(0,TAU),d=rand(25,200);return{x:Math.cos(a)*d,y:0,z:Math.sin(a)*d,sx:rand(1,4),sy:rand(1,5),sz:rand(1,4),ry:rand(0,3)};}));
 /* acantilados de hielo y mar helado con icebergs a lo lejos */
 for(let i=0;i<30;i++){const a=i/30*TAU,d=rand(420,520),w=rand(40,90),h=rand(40,110);wAdd(Bx(w,h,30),WM(i%2?0xe8f6ff:0xc8e4f8),Math.cos(a)*d,h/2-5,Math.sin(a)*d,{ry:-a});}
 const sea=wAdd(new THREE.PlaneGeometry(3000,3000),WM(0x1a3a5a),0,-8,0,{rx:-Math.PI/2});
 wInst(new THREE.BoxGeometry(1,1,1),WM(0xf4fbff),Array.from({length:30},()=>{const a=rand(0,TAU),d=rand(600,1000);return{x:Math.cos(a)*d,y:-4,z:Math.sin(a)*d,sx:rand(20,60),sy:rand(6,30),sz:rand(20,60),ry:rand(0,3)};}));
 /* nave de Freezer aterrizada */
 const ship=new THREE.Group();const dome=new THREE.Mesh(new THREE.SphereGeometry(12,14,8),WM(0xd8dde8));dome.scale.y=.55;ship.add(dome);const rs=new THREE.Mesh(new THREE.TorusGeometry(12.4,1,6,24),WM(0x8a9098));rs.rotation.x=Math.PI/2;ship.add(rs);
 for(let i=0;i<10;i++){const w=new THREE.Mesh(Sph(.9,6,4),BASIC(0xffe060));const a=i/10*TAU;w.position.set(Math.cos(a)*12.3,.6,Math.sin(a)*12.3);ship.add(w);}ship.position.set(130,4,90);worldGroup.add(ship);
 const snow=wFall(storm?900:380,0xffffff,storm?3:2,storm?22:7,storm?90:120,60);
 return{id:'ice',name:'Antártida',dirt:0xe8f4ff,rocks,bound:170,maxY:90,spawnY:1,groundY(x,z){const r=Math.hypot(x,z);return r<90?0:(nz(x*.8,z*.8)+1)*Math.min(1,(r-90)/150)*12;},resetRound(){},
  anim(dt){snow(dt);for(const m of auroras)m.uniforms.uT.value+=dt;},
  update(dt){this.anim(dt);if(storm&&game.phase==='fight')for(const f of game.f)if(f.state!=='ko'&&f.role!=='boss'&&f.pos.y<3)f.vel.x+=dt*4;}};}

/* ---------------- KAME HOUSE: la isla del Maestro Roshi en mitad del mar ---------------- */
function buildKame(v){
 clearWorld();const dusk=v===1;
 worldGroup.add(makeSky(dusk?0x4a3a8a:0x3a9aff,dusk?0xff9a5a:0xd8f4ff,0x2a6aa8));scene.fog=new THREE.Fog(dusk?0xffa070:0xd0ecff,260,1100);
 wLight({h:dusk?0xffc8a0:0xffffff,g:0x2a6a8a,s:dusk?0xff9a60:0xfffaf0,p:[-60,dusk?50:150,80]});wSun(V3(-.6,dusk?.08:.6,.7),1150,dusk?34:22,dusk?0xff8a3a:0xfffae0,2.5);wClouds(22,dusk?0xffc0a0:0xffffff,140,260,.8);
 const wm=waterMat(dusk?0x2a4a8a:0x1a8ad8,dusk?0xff9a6a:0x8ae4ff,.8);const sea=new THREE.Mesh(new THREE.PlaneGeometry(3200,3200),wm);sea.rotation.x=-Math.PI/2;sea.position.y=-.4;worldGroup.add(sea);
 const isl=wAdd(new THREE.CylinderGeometry(20,24,4,24),WM(0xf0dca0),0,-1.2,0,{recv:true});wAdd(new THREE.CylinderGeometry(9,10,.4,20),WM(0x7ac85a),-6,.85,-6);
 /* la casa: rosa, tejado rojo y el letrero KAME HOUSE */
 const h=new THREE.Group();h.position.set(-5,.8,-13);h.rotation.y=.25;worldGroup.add(h);const body=new THREE.Mesh(Bx(9,6,7),WM(0xf4a0b8));body.position.y=3;body.castShadow=true;h.add(body);
 const roof=new THREE.Mesh(new THREE.ConeGeometry(7.4,4,4),WM(0xd83a2a));roof.rotation.y=Math.PI/4;roof.position.y=8;roof.scale.set(1.15,1,.95);h.add(roof);
 const sign=new THREE.Mesh(new THREE.PlaneGeometry(6,1.4),BASIC(0xffffff,{map:textTex('KAME HOUSE','#d83a2a','#ffffff',256,64)}));sign.position.set(0,5.2,3.52);h.add(sign);
 const door=new THREE.Mesh(Bx(1.6,2.8,.2),WM(0x6a3a1a));door.position.set(0,1.4,3.52);h.add(door);for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4),BASIC(0x3a6aa8));w.position.set(s*2.8,3.2,3.52);h.add(w);}
 /* palmeras */
 const palms=[[13,10],[14,-9],[-15,9],[2,16],[-16,-4]];for(const[x,z]of palms){const g=new THREE.Group();g.position.set(x,.8,z);worldGroup.add(g);for(let k=0;k<5;k++){const s=new THREE.Mesh(new THREE.CylinderGeometry(.35,.45,2.2,6),WM(0xa07a4a));s.position.set(k*.25,1.1+k*2,0);s.rotation.z=-.08*k;g.add(s);}
  for(let k=0;k<6;k++){const l=new THREE.Mesh(new THREE.ConeGeometry(.8,5,4),WM(0x3aa84a));l.position.set(1.2,10.6,0);l.rotation.set(0,k/6*TAU,1.5);l.translateY(2.4);g.add(l);}}
 /* islas lejanas */
 wInst(new THREE.ConeGeometry(1,1,7),WM(0x5aa84a),Array.from({length:10},()=>{const a=rand(0,TAU),d=rand(300,700);return{x:Math.cos(a)*d,y:0,z:Math.sin(a)*d,sx:rand(20,50),sy:rand(15,40),sz:rand(20,50)};}));
 return{id:'kame',name:'Kame House',dirt:0xf0dca0,rocks:[],bound:150,maxY:90,spawnY:.8,groundY(x,z){return x*x+z*z<400?.8:-.1;},resetRound(){},anim(dt){wm.uniforms.uT.value+=dt;},update(dt){this.anim(dt);}};}

/* ---------------- CAPITAL DEL OESTE: la Corporación Cápsula y la ciudad (o la ciudad en ruinas del futuro) ---------------- */
function buildCity(v){
 clearWorld();const ruin=v===1;
 worldGroup.add(makeSky(ruin?0x2a2a34:0x4a8ae8,ruin?0x8a6a5a:0xe8f4ff,0x5a5a6a));scene.fog=new THREE.Fog(ruin?0x6a5a54:0xd8e8f8,200,900);
 wLight({h:ruin?0xb0a090:0xffffff,g:0x5a5a6a,s:ruin?0xffb080:0xfffaf0,si:ruin?.6:1,p:[-90,150,70]});if(!ruin)wClouds(18,0xffffff,150,260,.8);else wClouds(26,0x3a3030,90,220,.8);
 wTerrain(2400,60,()=>0,(c,x,z)=>{const road=Math.abs(x%60)<6||Math.abs(z%60)<6;c.setHex(Math.hypot(x,z)<30?0xc8c8c0:road?0x4a4a50:0x8ab86a);if(ruin)c.multiplyScalar(.6);});
 const plaza=wAdd(new THREE.CylinderGeometry(30,30,.3,40),WM(ruin?0x7a7470:0xd8d4c8),0,.05,0,{recv:true});
 /* Corporación Cápsula */
 const cc=domeHouse(-55,0,-60,26,ruin?0xa8a49a:0xf4f2ea,{nw:8,win:0x2a4a7a,door:0x4a6a9a});cc.rotation.y=.7;
 const logo=new THREE.Mesh(new THREE.PlaneGeometry(22,5),BASIC(0xffffff,{map:textTex('CAPSULE CORP.','#2a5ad8',null,256,64),transparent:true}));logo.position.set(0,16,23.5);logo.rotation.x=-.5;cc.add(logo);
 const ann=domeHouse(-20,0,-85,12,ruin?0x9a968c:0xf4f2ea,{nw:5,win:0x2a4a7a});
 /* edificios redondeados (destructibles) */
 const rocks=[],BC=ruin?[0x7a706a,0x6a625c,0x8a7a70]:[0xf0e8d8,0xd8e4f0,0xf4d8c8,0xe0f0e0];
 for(let i=0;i<38;i++){const a=rand(0,TAU),d=rand(55,190),r=rand(4,9),h=ruin?rand(6,26):rand(14,46),x=Math.cos(a)*d,z=Math.sin(a)*d;if(Math.hypot(x+55,z+60)<34||Math.hypot(x+20,z+85)<18)continue;
  const g=i%3===0?new THREE.CylinderGeometry(r,r,h,10):new THREE.BoxGeometry(r*1.6,h,r*1.6);const rk=makeRock(g,x,z,r,h,0,BC[i%BC.length]);if(ruin){rk.mesh.rotation.z=rand(-.15,.15);}
  if(!ruin&&i%3===0){const top=new THREE.Mesh(new THREE.SphereGeometry(r,10,6,0,TAU,0,Math.PI/2),WM(0x8ac0f0));top.position.y=h/2;rk.mesh.add(top);}rocks.push(rk);}
 /* árboles y coches */
 const tl=treeList(40,180,()=>0,(x,z)=>Math.hypot(x,z)>34&&Math.abs(x%60)>8&&Math.abs(z%60)>8);wTrees(tl,ruin?0x4a3a2a:0x7a5230,ruin?0x4a4a3a:0x4aa84a);
 wInst(Bx(4,1.4,2),WM(0xffffff),Array.from({length:16},(_,i)=>({x:(i%2?rand(-150,150):(i%4<2?-3:3)+60*(1+(Math.random()*2|0))*(i%8<4?1:-1)),y:.7,z:(i%2?(i%4<2?-3:3)+60*(1+(Math.random()*2|0))*(i%8<4?-1:1):rand(-150,150)),ry:i%2?0:Math.PI/2,c:[0xd83a2a,0x2a6ad8,0xf0d040,0x3ab04a][i%4]})));
 const ash=ruin?wFall(200,0x5a5048,2,4):null;
 if(ruin)for(let i=0;i<8;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:SMOKE,color:0x2a2420,transparent:true,opacity:.7,depthWrite:false}));const a=rand(0,TAU),d=rand(60,200);s.position.set(Math.cos(a)*d,rand(20,50),Math.sin(a)*d);s.scale.set(rand(30,60),rand(60,120),1);worldGroup.add(s);}
 return{id:'city',name:'Capital del Oeste',dirt:ruin?0x6a625c:0xa8a49a,rocks,bound:180,maxY:95,spawnY:.2,groundY(x,z){return x*x+z*z<900?.2:0;},resetRound(){},anim(dt){if(ash)ash(dt);},update(dt){this.anim(dt);}};}

/* ---------------- MONTAÑA PAOZ: bosque, picos de roca, río, cascada y la casa de Goku ---------------- */
function buildPaoz(v){
 clearWorld();const dusk=v===1;
 worldGroup.add(makeSky(dusk?0x2a2a6a:0x5aa8ff,dusk?0xffa06a:0xe8f8ff,0x3a6a3a));scene.fog=new THREE.Fog(dusk?0xe0a080:0xd8ecf0,180,950);
 wLight({h:dusk?0xffc8a0:0xffffff,g:0x2a5a2a,s:dusk?0xffa060:0xfffaf0,p:[-80,dusk?60:150,90]});wClouds(18,dusk?0xffb090:0xffffff,130,240,.8);
 const river=x=>Math.sin(x*.012)*30-60;
 wTerrain(2600,110,(x,z)=>{const r=Math.hypot(x,z);const base=r<70?0:(nz(x,z)+1)*Math.min(1,(r-70)/180)*30;const dr=Math.abs(z-river(x));return dr<10?Math.min(base,-1.5):base;},
  (c,x,z,y)=>{const dr=Math.abs(z-river(x));c.setHex(dr<10?0x3a8ad8:y>18?0x8a8a7a:nz(x*2,z*2)>.2?0x5ab84a:0x4aa83a);if(dusk)c.multiplyScalar(.82);});
 /* picos de roca con árboles en la cima (montañas chinas) */
 const rocks=[];for(let i=0;i<22;i++){const a=rand(0,TAU),d=rand(80,200),r=rand(5,12),h=rand(30,80),x=Math.cos(a)*d,z=Math.sin(a)*d;if(Math.abs(z-river(x))<16)continue;
  const rk=makeRock(bandedCylinder(r*.7,r,h,8,{top:0x4aa83a,c:[0x8a8a7a,0x7a7a6a,0x9a9a8a]}),x,z,r,h,-2);rocks.push(rk);const t=new THREE.Mesh(new THREE.ConeGeometry(2.4,6,6),WM(0x2a7a3a));t.position.y=h/2+3;rk.mesh.add(t);}
 const tl=treeList(90,200,(x,z)=>0,(x,z)=>Math.hypot(x,z)>26&&Math.hypot(x,z)<70&&Math.abs(z-river(x))>13);wTrees(tl,0x6a4a2a,dusk?0x2a6a3a:0x2a8a3a,'pine');
 const tl2=treeList(40,60,()=>0,(x,z)=>Math.hypot(x,z)>22&&Math.abs(z-river(x))>13);wTrees(tl2,0x7a5230,0x4aa84a);
 /* casa de Goku */
 const hs=domeHouse(22,0,-28,5,0xf4f0e8,{nw:3,door:0x8a5a2a,chimney:0xc8b8a0});hs.rotation.y=-.6;const hs2=domeHouse(30,0,-24,3.2,0xf4f0e8,{nw:2});
 const roof=new THREE.Mesh(new THREE.SphereGeometry(5.1,14,4,0,TAU,0,Math.PI*.18),WM(0xd8742a));roof.position.y=.05;hs.add(roof);
 /* cascada */
 const fall=wAdd(new THREE.PlaneGeometry(14,60),new THREE.MeshBasicMaterial({color:0xcfefff,transparent:true,opacity:.75}),-180,28,river(-180)-4,{ry:Math.PI/2});
 const fm=fall.material;
 return{id:'paoz',name:'Montaña Paoz',dirt:0x6a5a3a,rocks,bound:170,maxY:95,spawnY:0,groundY(x,z){const r=Math.hypot(x,z);const base=r<70?0:(nz(x,z)+1)*Math.min(1,(r-70)/180)*30;const dr=Math.abs(z-river(x));return dr<10?Math.min(base,-1.5):base;},
  resetRound(){},anim(dt){fm.opacity=.65+.1*Math.sin(performance.now()/180);},update(dt){this.anim(dt);}};}

/* ---------------- TORNEO DE LAS ARTES MARCIALES: el ring de piedra, el templo, gradas con público y palmeras ---------------- */
function buildBudokai(v){
 clearWorld();const night=v===1;
 worldGroup.add(makeSky(night?0x0a1030:0x4a9aff,night?0x3a2a6a:0xeaf6ff,0x3a5a2a));scene.fog=new THREE.Fog(night?0x2a2050:0xd8ecff,220,1000);
 wLight({h:night?0x8a8ac8:0xffffff,g:0x4a6a3a,s:night?0xc0c8ff:0xfffaf0,si:night?.6:1,p:[-60,150,90]});if(night)wStars(800);else wClouds(16,0xffffff,150,260,.8);
 wTerrain(2400,50,()=>0,(c,x,z)=>{c.setHex(Math.abs(x)<40&&Math.abs(z)<40?0xd8c8a0:nz(x*2,z*2)>.1?0x5ab84a:0x4aa83a);});
 /* ring de baldosas elevado */
 const tex=canvasTex(128,(g,s)=>{g.fillStyle='#e8e0d0';g.fillRect(0,0,s,s);g.strokeStyle='#a89a88';g.lineWidth=3;for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*32,0);g.lineTo(i*32,s);g.stroke();g.beginPath();g.moveTo(0,i*32);g.lineTo(s,i*32);g.stroke();}});tex.magFilter=THREE.NearestFilter;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(6,6);
 const ring=new THREE.Mesh(Bx(36,1.6,36),new THREE.MeshToonMaterial({map:tex,gradientMap:TOON}));ring.position.y=.8;ring.receiveShadow=true;worldGroup.add(ring);
 for(const s of[-1,1])for(const t of[-1,1]){wAdd(new THREE.CylinderGeometry(.5,.5,5,8),WM(0xc8b8a0),s*18.5,2.5,t*18.5);}
 /* templo (tejados curvos rojos) */
 const temple=(x,z,w,ry)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;worldGroup.add(g);const b=new THREE.Mesh(Bx(w,12,w*.6),WM(0xf4ece0));b.position.y=6;b.castShadow=true;g.add(b);
  for(let k=0;k<2;k++){const r=new THREE.Mesh(new THREE.ConeGeometry(w*.75,5,4),WM(0xc83a2a));r.rotation.y=Math.PI/4;r.scale.set(1,1,.65);r.position.y=14+k*7;g.add(r);if(k===0){const b2=new THREE.Mesh(Bx(w*.6,5,w*.36),WM(0xf4ece0));b2.position.y=18;g.add(b2);}}
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(w*.7,2.4),BASIC(0xffffff,{map:textTex('天下一武道会','#ffd23a','#a01a1a',256,64,'bold 40px serif')}));sign.position.set(0,9,w*.31);g.add(sign);};
 temple(0,-60,30,0);temple(-55,-40,18,.6);temple(55,-40,18,-.6);
 /* gradas con público */
 const crowd=[];for(const side of[[1,0],[-1,0],[0,1]]){for(let row=0;row<4;row++)for(let k=-12;k<=12;k++){const d=34+row*3,y=1+row*2.2;crowd.push({x:side[0]?side[0]*d:k*2.6,y:y+1,z:side[1]?side[1]*d:k*2.6,c:[0xd83a2a,0x2a6ad8,0xf0d040,0x3ab04a,0xffffff,0xff8ad8][(k*7+row*3+side[0]*5)%6+0|0]||0xffffff});}
  wAdd(Bx(side[0]?12:70,8,side[1]?12:70),WM(0x9a8a78),side[0]*40,2,side[1]*40);}
 wInst(Bx(1.2,2,1.2),WM(0xffffff),crowd);
 wInst(new THREE.CylinderGeometry(.35,.45,10,6),WM(0xa07a4a),[[-70,40],[70,40],[-75,-20],[75,-20],[0,80]].map(([x,z])=>({x,y:5,z})));
 wInst(new THREE.IcosahedronGeometry(3.4,0),WM(0x3aa84a),[[-70,40],[70,40],[-75,-20],[75,-20],[0,80]].map(([x,z])=>({x,y:11,z,sy:.5})));
 const lan=night?[]:null;if(night)for(let i=0;i<16;i++){const a=i/16*TAU,l=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:0xffb04a,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));l.scale.setScalar(5);l.position.set(Math.cos(a)*30,9,Math.sin(a)*30);worldGroup.add(l);}
 return{id:'budokai',name:'Torneo de las Artes Marciales',dirt:0xd8c8a0,rocks:[],bound:150,maxY:90,spawnY:1.6,ringDef:true,
  groundY(x,z){return Math.abs(x)<18&&Math.abs(z)<18?1.6:0;},inRing(f){return Math.abs(f.pos.x)<18&&Math.abs(f.pos.z)<18&&f.pos.y<4;},resetRound(){},update(){}};}

/* ---------------- HABITACIÓN DEL ESPÍRITU Y EL TIEMPO: blanco infinito, gravedad x10 y el edificio de la entrada ---------------- */
function buildRoom(v){
 clearWorld();const hot=v===1;
 worldGroup.add(makeSky(hot?0xffe8c8:0xffffff,hot?0xfff4e8:0xf4f6ff,0xffffff));scene.fog=new THREE.Fog(hot?0xfff0e0:0xf8faff,60,520);
 wLight({h:0xffffff,g:0xe0e4f0,hi:1.05,s:0xffffff,si:.6,p:[0,200,0]});
 wTerrain(2400,40,()=>0,(c,x,z)=>c.setHex(nz(x*3,z*3)>.6?0xf0f2f8:0xffffff));
 const b=new THREE.Group();b.position.set(0,0,-60);worldGroup.add(b);const base=new THREE.Mesh(Bx(40,12,20),WM(0xf4f0e8));base.position.y=6;b.add(base);
 for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.CylinderGeometry(4,4,26,10),WM(0xf4f0e8));p.position.set(s*16,13,0);b.add(p);const t=new THREE.Mesh(new THREE.ConeGeometry(5,7,10),WM(0xd8742a));t.position.set(s*16,29.5,0);b.add(t);}
 const door=new THREE.Mesh(Bx(4,7,.4),WM(0x6a4a2a));door.position.set(0,3.5,10.2);b.add(door);
 const heat=hot?wFall(150,0xffd8a0,2,-4,120,40):null;
 return{id:'room',name:'Habitación del Tiempo',dirt:0xe8e8f0,rocks:[],bound:160,maxY:90,spawnY:0,gravity:1.6,groundY(){return 0;},resetRound(){},anim(dt){if(heat)heat(dt);},update(dt){this.anim(dt);}};}

/* ---------------- TIERRA (yermo): más vida, cactus, montañas lejanas y aves ---------------- */
function earthExtras(W,storm){wInst(new THREE.CylinderGeometry(.6,.7,1,6),WM(storm?0x3a5a3a:0x4a8a3a),Array.from({length:36},()=>{const a=rand(0,TAU),d=rand(30,170),h=rand(3,7);return{x:Math.cos(a)*d,y:h/2,z:Math.sin(a)*d,sy:h};}));
 wInst(new THREE.ConeGeometry(1,1,6),WM(storm?0x4a4a5a:0xc8a07a),Array.from({length:14},(_,i)=>{const a=i/14*TAU,d=rand(800,950);return{x:Math.cos(a)*d,y:60,z:Math.sin(a)*d,sx:rand(120,220),sy:rand(120,260),sz:rand(120,220)};}));
 if(!storm){const birds=wInst(Bx(1.4,.1,.4),BASIC(0x2a2a2a),Array.from({length:10},()=>({x:rand(-80,80),y:rand(50,80),z:rand(-80,80)})));let t=0;const base=W.update.bind(W);
  W.anim=dt=>{t+=dt;const M=new THREE.Matrix4();for(let i=0;i<10;i++){M.makeTranslation(Math.cos(t*.2+i)*90,60+Math.sin(t+i)*5,Math.sin(t*.2+i)*90);birds.setMatrixAt(i,M);}birds.instanceMatrix.needsUpdate=true;};W.update=dt=>{W.anim(dt);base(dt);};}}
function buildEarth2(v){const W=buildEarth(v);earthExtras(W,v===1);return W;}

TRACKS.ice={bpm:96,bass:TRACKS.namek.bass.map(n=>n&&n-2),lead:TRACKS.void.lead.map(n=>n&&n+5)};
TRACKS.kame={bpm:126,bass:TRACKS.menu.bass.map(n=>n&&n+5),lead:TRACKS.menu.lead.map(n=>n&&n+5)};
TRACKS.city={bpm:140,bass:TRACKS.earth.bass.map(n=>n+7),lead:TRACKS.earth.lead.map(n=>n&&n+7)};
TRACKS.paoz={bpm:110,bass:TRACKS.namek.bass.map(n=>n&&n+5),lead:TRACKS.menu.lead.map(n=>n&&n-2)};
TRACKS.budokai={bpm:150,bass:TRACKS.menu.bass.map(n=>n&&n+2),lead:TRACKS.earth.lead.map(n=>n&&n+2)};
TRACKS.room={bpm:84,bass:TRACKS.void.bass.map(n=>n-5),lead:TRACKS.void.lead.map(n=>n&&n-5)};

/* 2.1: entornos rehechos y nuevos (los índices 0-4 se mantienen para el online y las partidas guardadas) */
function plusWorlds(){setTimeout(()=>{for(const w of[...WORLDS,TRAIN_WORLD]){const b=w.build;if(b.cov)continue;w.build=v=>{COVER=[];const W=b(v);if(COVER.length&&W&&W.rocks)W.rocks.push(...COVER);COVER=[];return W;};w.build.cov=1;}},0);
 Object.assign(WORLDS[0],{name:'Tierra · Yermo',build:buildEarth2});
 Object.assign(WORLDS[1],{build:buildNamek2,desc:'El planeta verde de los tres soles. Se pelea en la isla central o flotando sobre el mar, que sube; la arena se encoge un 15 % cada 33 s.'});
 Object.assign(WORLDS[2],{name:'Torneo del Poder',build:buildVoid2,desc:'La arena del Mundo del Vacío, con las gradas de los 8 universos y el palco de Zeno. Una barrera rodea la plataforma.'});
 Object.assign(WORLDS[4],{build:buildBroken2,desc:'El espacio hecho añicos por Gogeta y Broly: galaxias, grietas entre dimensiones y trozos de otros mundos. Enorme y sin suelo.'});
 TRAIN_WORLD.build=buildBills2;
 WORLDS.push(
  {name:'Antártida',desc:'Hielo, glaciares y aurora austral: aquí pelearon Goku, Vegeta y Broly. En la ventisca el viento te empuja.',vars:['Día polar','Ventisca'],build:buildAntarctic,music:'ice'},
  {name:'Kame House',desc:'La isla del Maestro Roshi en mitad del mar. Fuera de la isla se pelea flotando sobre el agua.',vars:['Mediodía','Atardecer'],build:buildKame,music:'kame'},
  {name:'Capital del Oeste',desc:'La ciudad de la Corporación Cápsula. Los edificios se derrumban con los golpes.',vars:['Ciudad','Futuro en ruinas'],build:buildCity,music:'city'},
  {name:'Montaña Paoz',desc:'El hogar de Goku: bosque, picos de roca, el río y la cascada.',vars:['Día','Atardecer'],build:buildPaoz,music:'paoz'},
  {name:'Torneo de las Artes Marciales',desc:'El ring de piedra del Tenkaichi Budokai, con el templo y el público. El ring da un 10 % de defensa.',vars:['Final de día','Final de noche'],build:buildBudokai,music:'budokai'},
  {name:'Planeta de Bills',desc:'El planeta del dios de la destrucción: su palacio, rocas flotantes, árboles de bulbo y el pez oráculo.',vars:['Día','Noche'],build:buildBills2,music:'bills'},
  {name:'Habitación del Tiempo',desc:'Blanco infinito y gravedad x10: cansa el doble.',vars:['Normal','Calor extremo'],build:buildRoom,music:'room'});}
