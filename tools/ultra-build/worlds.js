/* Planeta del Kaio del Norte: un planeta diminuto (el horizonte se curva) con gravedad x10 que cansa el doble */
function buildKaio(v){
 clearWorld();const dusk=v===1,R=70;
 worldGroup.add(makeSky(dusk?0xff7a3a:0x5aa8ff,dusk?0xffd88a:0xfff0b8,0xffe07a));scene.fog=new THREE.Fog(dusk?0xffc890:0xfff2c8,260,1200);
 hemi.color.setHex(dusk?0xffd0a0:0xfff8e8);hemi.groundColor.setHex(0x4a7a3a);hemi.intensity=.95;sun.color.setHex(dusk?0xffa060:0xfffaf0);sun.intensity=1;sun.position.set(60,120,40);
 const pg=new THREE.SphereGeometry(R,128,64),p=pg.attributes.position,col=new Float32Array(p.count*3),c=new THREE.Color();
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);c.setHex(nz(x*2,z*2+y)>.2?0x5cb84a:0x4aa83c);if(dusk)c.multiplyScalar(.85);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
 pg.setAttribute('color',new THREE.BufferAttribute(col,3));const planet=new THREE.Mesh(pg,phong({vertexColors:true}));planet.position.y=-R;planet.receiveShadow=true;worldGroup.add(planet);
 const gY=(x,z)=>{const r2=x*x+z*z;return r2<R*R?Math.sqrt(R*R-r2)-R:-Infinity;};
 const a0=.62,road=new THREE.Mesh(new THREE.TorusGeometry(R*Math.sin(a0),.9,8,120),phong({color:0xd8c89a}));road.rotation.x=Math.PI/2;road.scale.z=.25;road.position.y=R*Math.cos(a0)-R+.15;road.receiveShadow=true;worldGroup.add(road);
 const hx=-20,hz=-16,hg=gY(hx,hz),house=new THREE.Group();
 const dome=new THREE.Mesh(new THREE.SphereGeometry(5,32,16,0,TAU,0,Math.PI/2),phong({color:0xf4f0e8}));dome.castShadow=true;
 const roof=new THREE.Mesh(new THREE.SphereGeometry(5.2,32,10,0,TAU,0,Math.PI*.2),phong({color:0xc83a2a}));
 const door=new THREE.Mesh(Bx(1.6,2.6,.5),phong({color:0x6a3a1a}));door.position.set(0,1.3,4.7);
 for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.CircleGeometry(.7,16),phong({color:0x3a5a8a,roughness:.2}));w.position.set(s*3,2.2,3.4);w.rotation.y=s*.7;house.add(w);}
 const ant=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,3),phong({color:0x888888}));ant.position.y=6.4;
 house.add(dome,roof,door,ant);house.position.set(hx,hg-.3,hz);house.lookAt(0,hg,0);worldGroup.add(house);
 const car=new THREE.Group(),cb=new THREE.Mesh(Bx(4,1.1,2),phong({color:0xd02a2a,roughness:.4}));cb.position.y=.9;const cab=new THREE.Mesh(Bx(2,.9,1.8),phong({color:0xe8e8f0,roughness:.3}));cab.position.set(-.3,1.8,0);car.add(cb,cab);
 for(const[x,z]of[[1.3,1],[1.3,-1],[-1.3,1],[-1.3,-1]]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.3,16),phong({color:0x1a1a1a}));w.rotation.x=Math.PI/2;w.position.set(x,.45,z);car.add(w);}
 car.position.set(-9,gY(-9,-24),-24);car.rotation.y=.6;worldGroup.add(car);
 const tree=new THREE.Group(),tr=new THREE.Mesh(new THREE.CylinderGeometry(.6,1,8,10),phong({color:0x7a5230}));tr.position.y=4;tree.add(tr);
 for(let i=0;i<6;i++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(rand(2.4,3.4),1),phong({color:i%2?0x3a9a3a:0x4aaa44,flatShading:true}));b.position.set(rand(-2.5,2.5),rand(8,11),rand(-2.5,2.5));b.castShadow=true;tree.add(b);}
 tree.position.set(22,gY(22,-14),-14);worldGroup.add(tree);
 for(let i=0;i<40;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:SMOKE,color:dusk?0xffb05a:0xffd860,transparent:true,opacity:.9,depthWrite:false,fog:false}));s.position.set(rand(-900,900),rand(-260,-180),rand(-900,900));s.scale.set(rand(200,380),rand(70,120),1);worldGroup.add(s);}
 const pts=[];for(let i=0;i<14;i++)pts.push(V3(Math.sin(i*.9)*120+i*25-150,-170+Math.sin(i*1.7)*10,Math.cos(i*.7)*140-i*30+120));
 worldGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),300,3,10,false),phong({color:0xd8b040})));
 const rocks=[];for(let i=0;i<10;i++){const a=rand(0,TAU),d=rand(18,48),r=rand(1,2.4),x=Math.cos(a)*d,z=Math.sin(a)*d;const rk=makeRock(new THREE.DodecahedronGeometry(r,1),x,z,r,r*1.6,gY(x,z)-r*.3,0x8a8a7a);rk.mesh.position.y=gY(x,z)+r*.5;rocks.push(rk);}
 return{id:'kaio',name:'Planeta de Kaiosama',dirt:0x5a8a3a,rocks,bound:52,maxY:70,spawnY:0,gravity:1.6,groundY:gY,resetRound(){},update(){}};}
/* Dimensión rota (Dragon Ball Super: Broly): el espacio hecho pedazos por Gogeta y Broly. Sin suelo, se pelea flotando */
function buildBroken(v){
 clearWorld();const coll=v===1;
 const sky=new THREE.Mesh(new THREE.SphereGeometry(1500,48,32),new THREE.ShaderMaterial({uniforms:{uT:{value:0}},side:THREE.BackSide,depthWrite:false,fog:false,
  vertexShader:`varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`uniform float uT;varying vec3 vP;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  void main(){float a=atan(vP.z,vP.x),b=asin(clamp(vP.y,-1.0,1.0));vec2 q=vec2(a*5.0+sin(b*3.0+uT*.2)*.6,b*7.0);vec2 cell=floor(q);float r=h(cell);
   vec3 c=.5+.5*cos(6.2831*(r*.6+vec3(0.0,.33,.67))+uT*.25+b*2.0);float sw=sin(a*3.0+b*6.0-uT*.6+sin(uT*.3+a)*2.0);c=mix(c*.35,c,.5+.5*sw);
   vec2 f=fract(q);float edge=smoothstep(0.0,.035,min(min(f.x,1.0-f.x),min(f.y,1.0-f.y)));c=mix(vec3(1.0),c,edge*.9+.1);gl_FragColor=vec4(c*.85,1.0);}`}));
 sky.renderOrder=-10;worldGroup.add(sky);scene.fog=new THREE.Fog(0x2a1840,240,1000);
 hemi.color.setHex(0xe8d8ff);hemi.groundColor.setHex(0x402060);hemi.intensity=1;sun.color.setHex(0xffffff);sun.intensity=.9;sun.position.set(20,160,30);
 const shards=[],geos=[new THREE.TetrahedronGeometry(1),new THREE.OctahedronGeometry(1),new THREE.BoxGeometry(1.4,.12,1)];
 for(let i=0;i<120;i++){const c=new THREE.Color().setHSL(Math.random(),.8,.6);const m=new THREE.Mesh(geos[i%3],new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.35,metalness:.4,roughness:.15,transparent:true,opacity:.75}));
  const d=rand(30,260),a=rand(0,TAU);m.position.set(Math.cos(a)*d,rand(-60,90),Math.sin(a)*d);m.scale.setScalar(rand(1.5,9));m.rotation.set(rand(0,3),rand(0,3),rand(0,3));worldGroup.add(m);shards.push({m,spin:rndDir().multiplyScalar(rand(.1,.6)),bob:rand(0,TAU)});}
 return{id:'broken',name:'Dimensión rota',dirt:0xc8a8ff,rocks:[],bound:70,maxY:60,minY:-30,spawnY:4,sky,shards,shardT:4,
  groundY(){return -Infinity;},resetRound(){},
  anim(dt){this.sky.material.uniforms.uT.value+=dt;const T=performance.now()/1000;for(const s of this.shards){s.m.rotation.x+=s.spin.x*dt;s.m.rotation.y+=s.spin.y*dt;s.m.position.y+=Math.sin(T+s.bob)*dt*.6;}},
  update(dt){this.anim(dt);if(!coll||game.phase!=='fight')return;this.shardT-=dt;if(this.shardT<=0){this.shardT=rand(4,7);shardStrike();}}};}
function shardStrike(){const ps=game.f.filter(f=>f.state!=='ko'&&f.role!=='boss');const f=ps[Math.random()*ps.length|0];if(!f)return;const from=f.chest().add(rndDir().multiplyScalar(40)),v=f.chest().sub(from).normalize().multiplyScalar(60);
 const mesh=new THREE.Mesh(new THREE.TetrahedronGeometry(1.2),new THREE.MeshBasicMaterial({color:0xf0e0ff}));mesh.position.copy(from);fxGroup.add(mesh);
 projs.push(newProj(null,from,v,{kind:'shard',base:0,color:0xd0b0ff,r:1,homing:0,mesh,target:f}));sfx('shard');}
/* Planeta de Bills: lugar del entrenamiento con Whis */
function buildBills(v){
 clearWorld();const night=v===1;
 worldGroup.add(makeSky(night?0x0a0a2a:0x5a6ad8,night?0x3a2a6a:0xe0b8f0,0x6a4a8a));scene.fog=new THREE.Fog(night?0x2a2050:0xdcc4f0,220,1000);
 hemi.color.setHex(night?0x9a9ad8:0xfff0ff);hemi.groundColor.setHex(0x3a5a3a);hemi.intensity=.95;sun.color.setHex(night?0xb0b8ff:0xfff2e0);sun.intensity=night?.6:1.05;sun.position.set(-80,140,60);
 const g=new THREE.PlaneGeometry(2400,2400,90,90);g.rotateX(-Math.PI/2);const p=g.attributes.position,col=new Float32Array(p.count*3),c=new THREE.Color();
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),r=Math.hypot(x,z);if(r>170)p.setY(i,(nz(x,z)+1)*Math.min(1,(r-170)/140)*22);c.setHex(nz(x*1.6,z*1.4)>0?0x5aa84a:0x4c9a40);if(r>500)c.lerp(new THREE.Color(0x8a6ab0),.35);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
 g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();const gm=new THREE.Mesh(g,phong({vertexColors:true}));gm.receiveShadow=true;worldGroup.add(gm);
 const plat=new THREE.Mesh(new THREE.CylinderGeometry(16,17,.8,48),phong({color:0xcfc6b8}));plat.position.y=.4;plat.receiveShadow=true;worldGroup.add(plat);
 const ring=new THREE.Mesh(new THREE.RingGeometry(14.6,15.2,64),new THREE.MeshBasicMaterial({color:0x9a6aff,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.82;worldGroup.add(ring);
 const pond=new THREE.Mesh(new THREE.CircleGeometry(22,48),phong({color:0x3a7ad0,roughness:.08,metalness:.25}));pond.rotation.x=-Math.PI/2;pond.position.set(60,.06,-40);worldGroup.add(pond);
 const tp=V3(-150,0,-170),mesa=new THREE.Mesh(new THREE.CylinderGeometry(34,42,60,24),phong({color:0x8a7a6a,flatShading:true}));mesa.position.set(tp.x,30,tp.z);worldGroup.add(mesa);
 for(let i=0;i<6;i++){const s=40-6*i,st=new THREE.Mesh(Bx(s,6,s),phong({color:i%2?0xc8b89a:0xb8a88a}));st.position.set(tp.x,63+6*i,tp.z);st.castShadow=true;worldGroup.add(st);}
 const spire=new THREE.Mesh(new THREE.CylinderGeometry(1.5,3.2,40,12),phong({color:0xe8d8b8}));spire.position.set(tp.x,118,tp.z);worldGroup.add(spire);
 const orb=new THREE.Mesh(new THREE.SphereGeometry(4,24,16),new THREE.MeshBasicMaterial({color:0xb070ff}));orb.position.set(tp.x,141,tp.z);worldGroup.add(orb);
 const rocks=[];
 for(let i=0;i<20;i++){const a=rand(0,TAU),d=rand(35,150),x=Math.cos(a)*d,z=Math.sin(a)*d;if(Math.hypot(x-60,z+40)<26)continue;const h=rand(10,22),t=new THREE.Group();
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(.7,1.4,h,10),phong({color:0x8a5a3a}));tr.position.y=h/2;const cap=new THREE.Mesh(new THREE.SphereGeometry(rand(5,8),24,14),phong({color:[0xffa040,0xd06aff,0x6ad0a0][i%3]}));cap.scale.y=.45;cap.position.y=h+1;cap.castShadow=true;t.add(tr,cap);
  for(let k=0;k<4;k++){const fr=new THREE.Mesh(Sph(.6,12,8),phong({color:0xffe04a}));fr.position.set(rand(-4,4),h-1,rand(-4,4));t.add(fr);}t.position.set(x,0,z);worldGroup.add(t);}
 for(let i=0;i<12;i++){const a=rand(0,TAU),d=rand(60,200),r=rand(4,10),fr=new THREE.Mesh(new THREE.DodecahedronGeometry(r,1),phong({color:0x8a7a6a,flatShading:true}));fr.position.set(Math.cos(a)*d,rand(40,90),Math.sin(a)*d);fr.scale.y=.6;const top=new THREE.Mesh(new THREE.CylinderGeometry(r*.9,r*.9,.6,16),phong({color:0x5aa84a}));top.position.y=r*.55;fr.add(top);worldGroup.add(fr);}
 for(let i=0;i<10;i++){const a=rand(0,TAU),d=rand(30,110),r=rand(3,6),h=rand(8,20);rocks.push(makeRock(bandedCylinder(r*.85,r,h,12,{c:[0x9a8aa8,0x8a7a98,0xaa9ab8]}),Math.cos(a)*d,Math.sin(a)*d,r,h));}
 const moon=new THREE.Mesh(new THREE.SphereGeometry(90,32,24),new THREE.MeshBasicMaterial({color:night?0xc8c0ff:0xf0d8ff,fog:false}));moon.position.set(500,420,-900);worldGroup.add(moon);
 return{id:'bills',name:'Planeta de Bills',dirt:0x6a8a4a,rocks,bound:150,maxY:90,spawnY:1,groundY(x,z){return x*x+z*z<256?.8:0;},resetRound(){},update(){}};}
const TRAIN_WORLD={name:'Planeta de Bills',desc:'Entrenamiento con Whis.',vars:['Día','Noche'],build:buildBills,music:'bills'};
