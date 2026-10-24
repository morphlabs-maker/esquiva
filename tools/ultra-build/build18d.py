import sys
import os;D=os.path.dirname(os.path.abspath(__file__))+'/'
src=open(D+'stage18b.js',encoding='utf8').read()
def rep(old,new,cnt=1):
    global src
    n=src.count(old)
    if n!=cnt: sys.exit('COUNT %d!=%d for: %s'%(n,cnt,old[:110]))
    src=src.replace(old,new)
# ---- sombreado anime: sombras teñidas (como en el anime, no grises), luz de contorno y brillo en el pelo
a=src.index("const RIM_CODE=");b=src.index("/* Escenarios: materiales físicos y rugosos */")
src=src[:a]+r"""const TOON_FX=sheen=>'float lumO=dot(gl_FragColor.rgb,vec3(.299,.587,.114)),lumB=max(.001,dot(diffuseColor.rgb,vec3(.299,.587,.114)));float shd=1.0-smoothstep(.55,.8,lumO/lumB);'+
 'gl_FragColor.rgb=mix(gl_FragColor.rgb,gl_FragColor.rgb*vec3(.84,.8,1.06),shd*.6);'+
 'float rimK=1.0-max(dot(normalize(normal),normalize(vViewPosition)),0.0);gl_FragColor.rgb+=vec3(.92,.96,1.0)*smoothstep(.62,.95,rimK)*.24;'+
 (sheen?'float shn=pow(max(dot(normalize(normal),normalize(vec3(.25,.72,.64))),0.0),14.0);gl_FragColor.rgb+=(diffuseColor.rgb*.45+vec3(.07))*step(.5,shn);':'')+'\n#include <dithering_fragment>';
const toon=(c,sheen)=>{const m=new THREE.MeshToonMaterial({color:c,gradientMap:TOON}),code=TOON_FX(!!sheen);m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <dithering_fragment>',code);};m.customProgramCacheKey=()=>'kt'+(sheen?1:0);return m;};
"""+src[b:]
rep("['skin','top','inner','shoulder','pants','belt','boots','sleeve','glove','wrist','eye','pupil','hair','ex1','ex2'].forEach(k=>mats[k]=toon(0xffffff));",
    "['skin','top','inner','shoulder','pants','belt','boots','sleeve','glove','wrist','eye','pupil','hair','ex1','ex2'].forEach(k=>mats[k]=toon(0xffffff,k==='hair'));")
# ---- texturas: estrella de impacto, llama de aura y detalle de suelo/roca
rep("const SMOKE=canvasTex(64,","""const STAR=canvasTex(128,(g,s)=>{const c=s/2;const gr=g.createRadialGradient(c,c,0,c,c,c);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.18,'rgba(255,255,255,.7)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;
 g.beginPath();for(let i=0;i<16;i++){const a=i/16*TAU,r=i%2?c*.16:c*(i%4?.62:1);g.lineTo(c+Math.cos(a)*r,c+Math.sin(a)*r);}g.closePath();g.fill();});
const FLAME=canvasTex(64,(g,s)=>{const gr=g.createRadialGradient(32,44,2,32,36,30);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.moveTo(32,2);g.bezierCurveTo(52,24,58,46,32,62);g.bezierCurveTo(6,46,12,24,32,2);g.fill();});
const DETAILG=canvasTex(256,(g,s)=>{g.fillStyle='#fff';g.fillRect(0,0,s,s);for(let i=0;i<5000;i++){const v=200+Math.random()*55|0;g.fillStyle=`rgb(${v},${v},${v})`;g.fillRect(Math.random()*s,Math.random()*s,1+Math.random()*2,1+Math.random()*2);}
 for(let i=0;i<40;i++){const x=Math.random()*s,y=Math.random()*s,r=8+Math.random()*26,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(150,140,130,.22)');gr.addColorStop(1,'rgba(150,140,130,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}});
DETAILG.wrapS=DETAILG.wrapT=THREE.RepeatWrapping;DETAILG.repeat.set(160,160);const DETAILR=DETAILG.clone();DETAILR.needsUpdate=true;DETAILR.repeat.set(2,2);
const SMOKE=canvasTex(64,""")
rep("s.material.color.setHex(o.color??0xffffff);","{const mp=o.map||(o.smoke?SMOKE:GLOW);if(s.material.map!==mp){s.material.map=mp;s.material.needsUpdate=true;}}s.material.color.setHex(o.color??0xffffff);")
rep("function sparks(pos,color,n=10,spd=12,size=.35){","function sparkStar(pos,size=2,color=0xffffff){spawn({pos,color,size,life:.16,map:STAR,grow:size*3});spawn({pos,color:0xfff2c0,size:size*.6,life:.1,map:STAR});}\nfunction sparks(pos,color,n=10,spd=12,size=.35){")
rep("const flatMat=()=>phong({vertexColors:true,flatShading:true,shininess:0});","const flatMat=()=>phong({vertexColors:true,flatShading:true,shininess:0,map:DETAILR});")
rep("const gm=new THREE.Mesh(g,flatMat());gm.receiveShadow=true;","const gm=new THREE.Mesh(g,phong({vertexColors:true,map:DETAILG}));gm.receiveShadow=true;")
rep("const gm=new THREE.Mesh(g,phong({vertexColors:true}));gm.receiveShadow=true;","const gm=new THREE.Mesh(g,phong({vertexColors:true,map:DETAILG}));gm.receiveShadow=true;")
rep("const planet=new THREE.Mesh(pg,phong({vertexColors:true}));","const planet=new THREE.Mesh(pg,phong({vertexColors:true,map:DETAILR}));DETAILR.repeat.set(3,3);")
# cielo: brillo del sol y nubes suaves
rep("mix(h,b,pow(-y,.5));gl_FragColor=vec4(c,1.0);}","mix(h,b,pow(-y,.5));vec3 sd=normalize(vec3(-.55,.22,.35));float sdot=max(dot(vP,sd),0.0);float sg=pow(sdot,8.0)*.3+pow(sdot,220.0)*1.4;float cl=0.0;if(y>0.0){vec2 q=vP.xz/(y+.22)*1.4;cl=smoothstep(.58,.95,.5+.25*sin(q.x*1.3+sin(q.y*.7)*2.0)+.25*sin(q.y*1.7+sin(q.x*.9)*1.5))*smoothstep(0.0,.2,y)*.5;}c=mix(c,mix(h,vec3(1.0),.55),cl)+vec3(1.0,.93,.82)*sg;gl_FragColor=vec4(c,1.0);}")
# ---- aura con llamas que suben (como en el anime)
rep("const group=new THREE.Group();group.add(outer,inner);group.visible=false;","const group=new THREE.Group();group.add(outer,inner);group.visible=false;\n const flames=[];for(let i=0;i<14;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:FLAME,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));s.userData={a:i/14*TAU,ph:Math.random(),sp:rand(.9,1.6)};group.add(s);flames.push(s);}")
rep("return{group,outer,inner,bolts,level:0,target:0,boltT:0,","return{group,outer,inner,bolts,flames,level:0,target:0,boltT:0,")
rep("setColor(c){outer.material.uniforms.uColor.value.setHex(c);","setColor(c){for(const s of flames)s.material.color.setHex(c);outer.material.uniforms.uColor.value.setHex(c);")
rep("const s=(.8+this.level*.5)*.8;this.group.scale.set(s,(.85+this.level*.35)*.75,s);","const s=(.8+this.level*.5)*.8;this.group.scale.set(s,(.85+this.level*.35)*.75,s);\n   {const L=Math.min(1.2,this.level);for(const f of flames){const u=f.userData;u.ph=(u.ph+dt*u.sp*(.8+L))%1;const k=u.ph,a=u.a+t*.6,r=.62*(1-k*.55);f.position.set(Math.cos(a)*r,.15+k*2.5,Math.sin(a)*r);f.scale.set(.55*(1.2-k*.6)*(.4+L),.9*(1.2-k*.5)*(.4+L),1);f.material.opacity=Math.sin(k*Math.PI)*Math.min(1,L)*.55;}}")
# ---- impactos: estrella, fotograma de impacto (inversión breve) y golpe de zoom
rep("if(big){ring(cp,0xffffff,2.2,.25,false,.2);speedLines(.22);}","if(big){ring(cp,0xffffff,2.2,.25,false,.2);speedLines(.22);}sparkStar(cp,big?3:1.4,big?0xfff0b0:0xffffff);\n if(kind!=='light'&&kind!=='blast'){POST.impact=Math.max(POST.impact,kind==='heavy'?.55:1);game.fovKick=Math.max(game.fovKick||0,kind==='heavy'?5:9);}")
rep("cam.lookAt(camLook);\n if(game.shake>.01)","{const fk=game.fovKick||0;if(Math.abs(cam.fov-(55-fk))>.01){cam.fov=55-fk;cam.updateProjectionMatrix();}game.fovKick=fk*Math.exp(-7*dt);}\n cam.lookAt(camLook);\n if(game.shake>.01)")
# polvo al volar a ras de suelo
rep("const hs=clamp(1-(this.pos.y-g)/40,.2,1)*this.model.body.scale.x*this.giant;this.shadow.scale.setScalar(hs);}","const hs=clamp(1-(this.pos.y-g)/40,.2,1)*this.model.body.scale.x*this.giant;this.shadow.scale.setScalar(hs);\n  if(g>-1e9&&this.pos.y-g<2.4*this.giant&&m.speed>12&&Math.random()<.45)spawn({pos:V3(this.pos.x+rand(-.5,.5),g+.25,this.pos.z+rand(-.5,.5)),vel:V3(rand(-1.5,1.5),rand(.6,2.2),rand(-1.5,1.5)),color:world.dirt||0x9a8a70,size:rand(.9,1.8)*this.giant,life:.9,grow:1.6,smoke:true,op:.4,drag:1.5});}")
# ---- posprocesado: bloom (resplandor de auras y rayos), viñeta, gradación de color y fotogramas de impacto
rep("addEventListener('resize',resize);resize();","""/* Posprocesado propio (Three r128): escena en un búfer con antialias, paso de brillos, desenfoque a 1/4 y composición */
const POST={on:store.get('kc_bloom',true),impact:0,ok:false};
const PV=`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}`;
let rtScene,rtA,rtB,postScene,postCam,pQuad,mBright,mBlur,mComp;
function postResize(){if(!POST.ok)return;const pr=renderer.getPixelRatio(),W=Math.max(2,Math.floor(innerWidth*pr)),H=Math.max(2,Math.floor(innerHeight*pr));rtScene.setSize(W,H);rtA.setSize(W>>2,H>>2);rtB.setSize(W>>2,H>>2);}
function initPost(){try{const o={minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat};
 rtScene=renderer.capabilities.isWebGL2&&THREE.WebGLMultisampleRenderTarget?new THREE.WebGLMultisampleRenderTarget(2,2,o):new THREE.WebGLRenderTarget(2,2,o);rtA=new THREE.WebGLRenderTarget(2,2,o);rtB=new THREE.WebGLRenderTarget(2,2,o);
 postCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);postScene=new THREE.Scene();pQuad=new THREE.Mesh(new THREE.PlaneGeometry(2,2));pQuad.frustumCulled=false;postScene.add(pQuad);
 mBright=new THREE.ShaderMaterial({uniforms:{t:{value:null},th:{value:.7}},vertexShader:PV,fragmentShader:`uniform sampler2D t;uniform float th;varying vec2 vUv;void main(){vec3 c=texture2D(t,vUv).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(th,th+.25,l),1.0);}`,depthTest:false,depthWrite:false});
 mBlur=new THREE.ShaderMaterial({uniforms:{t:{value:null},d:{value:new THREE.Vector2()}},vertexShader:PV,fragmentShader:`uniform sampler2D t;uniform vec2 d;varying vec2 vUv;void main(){vec3 c=texture2D(t,vUv).rgb*.227;c+=(texture2D(t,vUv+d*1.38).rgb+texture2D(t,vUv-d*1.38).rgb)*.316;c+=(texture2D(t,vUv+d*3.23).rgb+texture2D(t,vUv-d*3.23).rgb)*.07;gl_FragColor=vec4(c,1.0);}`,depthTest:false,depthWrite:false});
 mComp=new THREE.ShaderMaterial({uniforms:{t:{value:null},b:{value:null},k:{value:1.15},imp:{value:0},res:{value:new THREE.Vector2(1,1)}},vertexShader:PV,
  fragmentShader:`uniform sampler2D t;uniform sampler2D b;uniform float k;uniform float imp;varying vec2 vUv;void main(){vec3 c=texture2D(t,vUv).rgb;vec3 hx=max(c-.7,0.0);c=c-hx+hx/(1.0+hx*2.6);vec3 bl=texture2D(b,vUv).rgb;c+=bl*k;
   float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,1.12);c=(c-.5)*1.06+.5;vec2 q=vUv-.5;c*=1.0-dot(q,q)*.55;
   float m=step(.55,l);c=mix(c,vec3(1.0-m)*vec3(1.0,.96,.9)+vec3(m*.05),imp);gl_FragColor=vec4(clamp(c,0.0,1.0),1.0);}`,depthTest:false,depthWrite:false});
 POST.ok=true;postResize();}catch(e){reportError(e);POST.ok=false;}}
/* resplandor selectivo: solo brillan auras, rayos, esferas, chispas y explosiones (se ocultan escenario y cuerpos en ese pase) */
function renderPost(camera,dt){const R=renderer;R.setRenderTarget(rtScene);R.clear();R.render(scene,camera);
 const sw=[];if(!POST.blk)POST.blk=new THREE.MeshBasicMaterial({color:0});const blk=POST.blk;
 const lit=m=>m&&(m.isMeshToonMaterial||m.isMeshStandardMaterial||m.isMeshLambertMaterial||m.isMeshPhongMaterial);
 scene.traverseVisible(o=>{if(!o.isMesh)return;if(lit(o.material)||(Array.isArray(o.material))){sw.push(o,o.material);o.material=blk;}});
 const hid=[];worldGroup.traverse(o=>{if(o.isMesh&&o.material!==blk){sw.push(o,o.material);o.material=blk;}else if((o.isSprite||o.isPoints||o.isLine)&&o.visible){o.visible=false;hid.push(o);}});
 const fog=scene.fog;scene.fog=null;R.setRenderTarget(rtA);R.setClearColor(0x000000,1);R.clear();R.render(scene,camera);scene.fog=fog;for(let i=0;i<sw.length;i+=2)sw[i].material=sw[i+1];for(const o of hid)o.visible=true;
 const w=rtA.width,h=rtA.height;for(let i=0;i<2;i++){pQuad.material=mBlur;mBlur.uniforms.t.value=rtA.texture;mBlur.uniforms.d.value.set((1+i)/w,0);R.setRenderTarget(rtB);R.render(postScene,postCam);
  mBlur.uniforms.t.value=rtB.texture;mBlur.uniforms.d.value.set(0,(1+i)/h);R.setRenderTarget(rtA);R.render(postScene,postCam);}
 pQuad.material=mComp;mComp.uniforms.t.value=rtScene.texture;mComp.uniforms.b.value=rtA.texture;mComp.uniforms.imp.value=POST.impact>.5?1:0;R.setRenderTarget(null);R.render(postScene,postCam);
 POST.impact=Math.max(0,POST.impact-(dt||.016)*9);}
addEventListener('resize',resize);resize();""")
rep("fx2d.width=w;fx2d.height=h;if(window.fitTouch)window.fitTouch();}","fx2d.width=w;fx2d.height=h;if(window.fitTouch)window.fitTouch();if(typeof postResize==='function')postResize();}")
rep("else{renderer.setViewport(0,0,W,H);renderer.render(scene,cam);}}","else if(POST.on&&POST.ok){renderPost(cam,rdt);}\n else{renderer.setViewport(0,0,W,H);renderer.render(scene,cam);}}")
rep("if(code==='F2'){","if(code==='KeyB'&&(menuState||game.paused||!game.phase)){POST.on=!POST.on;store.set('kc_bloom',POST.on);return;}\n if(code==='F2'){")
rep("applyTouch();world=buildEarth(0);","initPost();applyTouch();world=buildEarth(0);")
rep('<span class="k">F2</span> calidad · <span class="k">V</span> voces','<span class="k">F2</span> calidad · <span class="k">B</span> resplandor · <span class="k">V</span> voces',2)
# ---- retratos ilustrados en el HUD (forma base; las transformaciones usan su busto 3D)
rep("const PORTRAITS=CHARS.map(ch=>PORTRAIT_IMG[ch.id]||renderPortrait(ch,0).toDataURL());","const PORTRAITS=CHARS.map(ch=>PORTRAIT_IMG[ch.id]||renderPortrait(ch,0).toDataURL());\nconst PIMG={};for(const k in PORTRAIT_IMG){const im=new Image();im.src=PORTRAIT_IMG[k];PIMG[k]=im;}")
rep("function hudPortrait(f){const c=$('#por'+f.idx);if(!c)return;const g=c.getContext('2d');g.clearRect(0,0,96,96);g.drawImage(renderPortrait(f.ch,f.formIdx),0,0,96,96);}",
    "function hudPortrait(f){const c=$('#por'+f.idx);if(!c)return;const g=c.getContext('2d');g.clearRect(0,0,96,96);const im=typeof PIMG!=='undefined'&&PIMG[f.ch.id];if(im&&im.complete&&im.naturalWidth){g.drawImage(im,0,0,96,96);if(f.formIdx>0){const fm=f.ch.forms[f.formIdx],hc='#'+((fm&&fm.aura)||0xffd040).toString(16).padStart(6,'0');g.save();g.globalCompositeOperation='screen';const gr=g.createRadialGradient(48,48,22,48,48,62);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,hc);g.globalAlpha=.85;g.fillStyle=gr;g.fillRect(0,0,96,96);g.restore();}}else g.drawImage(renderPortrait(f.ch,f.formIdx),0,0,96,96);}")
open(D+'stage18b.js','w',encoding='utf8').write(src)
print('ok')
