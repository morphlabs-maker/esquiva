/* =========================================================
   KAIOKEN CLASH 3.0 — MUNDO NUEVO: ÓRBITA DE LA TIERRA
   Justo al borde de la atmósfera: la Tierra curva debajo, el resplandor azul del aire, estrellas, la Luna y el Sol.
   No hay suelo: se pelea flotando. Rocas y restos de satélites flotan alrededor y sirven de cobertura.
   ========================================================= */
function earthTex(night){return canvasTex(1024,(g,S)=>{const rnd=dmgRng(night?91:17);g.fillStyle=night?'#04122a':'#1a4f9a';g.fillRect(0,0,S,S);
 for(let i=0;i<46;i++){const x=rnd()*S,y=rnd()*S,r=40+rnd()*140;g.fillStyle=night?'#0a1a10':['#3d7a3a','#5a8a3a','#a08a55','#4a6a2a'][i%4];g.beginPath();for(let k=0;k<12;k++){const a=k/12*TAU,rr=r*(.55+rnd()*.6);k?g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr*.8):g.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr*.8);}g.fill();
  if(night)for(let k=0;k<60;k++){g.fillStyle=rnd()<.7?'rgba(255,214,120,.9)':'rgba(255,255,220,.8)';g.fillRect(x+(rnd()-.5)*r*1.4,y+(rnd()-.5)*r,2,2);}}
 if(!night)for(let i=0;i<70;i++){const x=rnd()*S,y=rnd()*S;g.fillStyle='rgba(255,255,255,'+(.35+rnd()*.45)+')';g.beginPath();g.ellipse(x,y,30+rnd()*120,8+rnd()*26,rnd()*3,0,TAU);g.fill();}});}
function buildOrbit(v){clearWorld();const night=v===1;
 scene.fog=new THREE.Fog(0x000006,600,4200);wStars(2400,1400,2,0xffffff);
 wLight({h:night?0x6a7ab8:0xcfe0ff,g:night?0x0a1a3a:0x2a5aa8,hi:night?.6:.9,s:night?0xb0c0ff:0xfff6e8,si:night?.6:1.2,p:[260,180,-120]});
 const sunDir=V3(.7,.35,-.45);wSun(sunDir,1300,night?0:40,0xfff2d0,night?0:3.2);
 /* la Tierra: una esfera enorme debajo; el horizonte se curva */
 const R=2600,et=earthTex(night);et.wrapS=et.wrapT=THREE.RepeatWrapping;et.repeat.set(7,4);const earth=new THREE.Mesh(new THREE.SphereGeometry(R,96,64),new THREE.MeshPhongMaterial({map:et,shininess:night?0:18,specular:0x335577,emissive:night?0x0a0a18:0x000000,fog:false}));
 earth.position.set(0,-R-420,0);earth.rotation.set(.3,0,.2);worldGroup.add(earth);
 const atm=new THREE.Mesh(new THREE.SphereGeometry(R*1.035,96,64),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,depthWrite:false,fog:false,blending:THREE.AdditiveBlending,
  uniforms:{uC:{value:new THREE.Color(night?0x2a6aff:0x6ab8ff)}},vertexShader:`varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vP=(modelViewMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform vec3 uC;varying vec3 vN;varying vec3 vP;void main(){float r=1.0-abs(dot(normalize(-vP),vN));float a=pow(r,3.0)*1.4;gl_FragColor=vec4(uC*a,a);}`}));atm.position.copy(earth.position);worldGroup.add(atm);
 const haze=new THREE.Mesh(new THREE.SphereGeometry(R*1.012,96,64),new THREE.MeshBasicMaterial({color:night?0x1a3a8a:0x8ac8ff,transparent:true,opacity:night?.12:.22,fog:false,depthWrite:false}));haze.position.copy(earth.position);worldGroup.add(haze);
 /* la Luna y una estación espacial lejana */
 const moon=new THREE.Mesh(new THREE.SphereGeometry(90,24,16),WM(0xcfcfd8,{fog:false}));moon.position.set(-900,520,-1500);worldGroup.add(moon);
 const st=new THREE.Group();st.position.set(420,120,-560);worldGroup.add(st);st.add(new THREE.Mesh(new THREE.CylinderGeometry(6,6,40,12),WM(0xd8d8e0)));for(const s of[-1,1]){const pnl=new THREE.Mesh(Bx(60,.6,18),WM(0x2a3a8a,{emissive:0x0a1030}));pnl.position.x=s*40;st.add(pnl);}
 /* rocas y restos de satélites flotando: coberturas */
 const rocks=[];for(let i=0;i<22;i++){const a=rand(0,TAU),d=rand(30,160),r=rand(2.5,7),h=r*rand(1.2,2),y=rand(-6,30),x=Math.cos(a)*d,z=Math.sin(a)*d;
  const rk=makeRock(new THREE.DodecahedronGeometry(r,0),x,z,r*.9,h,y,0x6a6470);rk.mesh.scale.set(1,h/(2*r),1);rk.mesh.position.y=y+h/2;rocks.push(rk);}
 for(let i=0;i<6;i++){const a=rand(0,TAU),d=rand(45,140),x=Math.cos(a)*d,z=Math.sin(a)*d,y=rand(4,24);const g=new THREE.Group();g.position.set(x,y+2,z);worldGroup.add(g);
  g.add(new THREE.Mesh(Bx(3,3,3),WM(0xc8a040)));for(const s of[-1,1]){const p=new THREE.Mesh(Bx(7,.2,3),WM(0x1a2a6a,{emissive:0x060a20}));p.position.x=s*5;g.add(p);}g.rotation.set(rand(0,3),rand(0,3),rand(0,3));
  rocks.push({mesh:g,x,z,r:3,h:4,y0:y,alive:true,indestructible:true,top(){return this.y0+this.h;}});}
 const dust=[];for(let i=0;i<14;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:SMOKE,color:night?0x3a5aa8:0xbfdcff,transparent:true,opacity:.18,depthWrite:false}));s.position.set(rand(-300,300),rand(-90,-40),rand(-300,300));s.scale.set(rand(160,300),rand(30,60),1);worldGroup.add(s);dust.push(s);}
 let t=0;
 return{id:'orbit',name:'Órbita de la Tierra',dirt:0x6a6470,rocks,bound:180,maxY:90,minY:-30,spawnY:8,groundY(){return-Infinity;},resetRound(){},
  update(dt){t+=dt;earth.rotation.y+=dt*.004;st.rotation.y+=dt*.05;for(const r of rocks)if(r.mesh&&r.indestructible)r.mesh.rotation.y+=dt*.3;}};}
WORLDS.push({name:'Órbita de la Tierra',desc:'Al borde de la atmósfera, con la Tierra curva debajo. Sin suelo: se pelea flotando entre rocas y satélites.',vars:['Día','Noche'],build:buildOrbit,music:'void'});
