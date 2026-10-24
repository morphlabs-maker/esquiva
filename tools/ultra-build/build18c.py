import sys
import os;D=os.path.dirname(os.path.abspath(__file__))+'/'
src=open(D+'stage18b.js',encoding='utf8').read()
def rep(old,new,cnt=1):
    global src
    n=src.count(old)
    if n!=cnt: sys.exit('COUNT %d!=%d for: %s'%(n,cnt,old[:110]))
    src=src.replace(old,new)
# capa por tramos con muelle + pelo mechón a mechón
rep("if(model.cape){const want=.12+Math.sin(model.t*2.3)*.06+(model.target==='fly'?1.1:0)+(model.target==='knock'?.8:0);model.cape.rotation.x=lerp(model.cape.rotation.x,want,1-Math.exp(-dt*5));}",
"""/* capa: cada tramo sigue al anterior con un muelle; se levanta al volar y ondea con el viento */
 const h2=Math.min(dt,.05);
 if(model.cape){const sp2=model.speed||0,t2=model.t;model.cape.forEach((p,i)=>{const u=p.userData,want=(i?.06:.12)+Math.min(1.25,sp2*.055)*(i?.32:1)+(model.target==='knock'?.5:0)+Math.sin(t2*2.4-i*1.1)*(.05+Math.min(.12,sp2*.005))*(1+i*.6);
  u.v=(u.v||0)+((want-p.rotation.x)*55-(u.v||0)*7)*h2;p.rotation.x+=u.v*h2;p.rotation.z=Math.sin(t2*1.6-i*.8)*.035*(1+i);});}
 /* pelo: cada mechón se mece con el viento, se echa hacia atrás al volar y flamea con el aura (más los largos) */
 if(model.locks){const sp2=model.speed||0,au=model.auraLv||0,t2=model.t;for(const L of model.locks){const amp=(.012+.02*L.k)*(1+au*2.2);
  L.m.rotation.x=L.rx-Math.min(.45,sp2*.008*L.k)+Math.sin(t2*(2.1+.4*L.k)+L.ph)*amp;L.m.rotation.z=L.rz+Math.cos(t2*(1.8+.3*L.k)+L.ph)*amp*.8;}}""")
rep("this.plight.color.setHex(f.aura);","m.auraLv=this.aura.level;if(this.avatar)this.avatar.auraLv=m.auraLv;this.plight.color.setHex(f.aura);")
# androides sin cansancio
rep("tire(v){if(this.role==='p')","tire(v){if(this.role==='p'&&!this.ch.android)")
rep("if(this.role==='p'){const busy=","if(this.role==='p'&&!this.ch.android){const busy=")
# sin voz robótica que diga el nombre de cada técnica
a=src.index("/* Nombres de las técnicas en voz alta");b=src.index("function sfx(n,k=1)")
src=src[:a]+"function say(){} /* ya no se leen en voz alta los nombres de las técnicas */\n"+src[b:]
rep("if(s.type!=='barrage')say(this,s.name);","")
# Moro: absorción más justa
rep("amt=op.maxHp*.018*g;","amt=op.maxHp*.009*g;")
rep("op.ki=Math.max(0,op.ki-.22*g);m.hp=Math.min(m.maxHp,m.hp+amt*.6);op.drained=Math.min(1,op.drained+.045*g);","op.ki=Math.max(0,op.ki-.12*g);m.hp=Math.min(m.maxHp,m.hp+amt*.4);op.drained=Math.min(1,op.drained+.025*g);")
rep("if(this.drained>0)this.drained=Math.max(0,this.drained-.012*dt);","if(this.drained>0)this.drained=Math.max(0,this.drained-.03*dt);")
rep("this.absorbMul=lerp(1,rp>own?rp*1.05/own:1.4,op.drained);","this.absorbMul=lerp(1,rp>own?rp*.85/own:1.25,op.drained);")
rep("*(1-.45*this.drained);}","*(1-.3*this.drained);}")
rep("if(d<24+this.reach()&&op.state!=='ko'&&sp.t>.2)","if(d<16+this.reach()&&op.state!=='ko'&&sp.t>.2)")
rep("s.type==='absorb'?1.9:","s.type==='absorb'?1.5:")
# jefes
rep("const gokuPow=id=>","/* Bills jefe con el mismo diseño que el luchador: cola de gato, joyas de oro y cuerpo delgado */\nsetTimeout(()=>{},0);\nconst gokuPow=id=>")
rep("function bossChar(b){if(b.ch)return b.ch;","function bossChar(b){if(b.id==='bills'&&!b.ch.h){const bl=CHARS.find(c=>c.id==='bills');Object.assign(b.ch,{extras:bl.extras,build:bl.build,h:bl.h});}if(b.ch)return b.ch;")
rep("F('boss','Legendario descontrolado',1,{era:'S',","F('boss','Legendario descontrolado',1,{era:'S',build:{fore:1.25,hand:1.2,upper:1.3,chest:1.12},")
rep("setTimeout(()=>{},0);\n","")
# dragón más realista: escamas, cuello más largo y suave, hocico, cejas óseas, ojos que brillan, placas del vientre, alas grandes, púas en la cola
rep("function buildDragonModel(ch){","""function dragonScales(){const t=canvasTex(256,(g,S)=>{g.fillStyle='#fff';g.fillRect(0,0,S,S);for(let y=0;y<S+16;y+=14)for(let x=-16;x<S+16;x+=18){const ox=(y/14%2)*9;const gr=g.createRadialGradient(x+ox,y,2,x+ox,y,12);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#b8b8c4');g.fillStyle=gr;g.beginPath();g.arc(x+ox,y,11,0,Math.PI);g.fill();g.strokeStyle='rgba(40,30,60,.45)';g.lineWidth=1.5;g.beginPath();g.arc(x+ox,y,11,0,Math.PI);g.stroke();}});t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(5,5);return t;}
function buildDragonModel(ch){""")
rep("mats.mouth=new THREE.MeshBasicMaterial({color:0x2a0a1a});mats.shine=new THREE.MeshBasicMaterial({color:0xffffff});mats.hair.side=THREE.DoubleSide;",
    "mats.mouth=new THREE.MeshBasicMaterial({color:0x2a0a1a});mats.shine=new THREE.MeshBasicMaterial({color:0xffffff});mats.hair.side=THREE.DoubleSide;const SC=dragonScales();mats.skin.map=SC;mats.top.map=SC;")
rep("const segs=[];let par=base;const ang=[.25,.3,.28,.22];for(let k=0;k<4;k++){const sg=new THREE.Group();sg.position.y=k?.19:0;sg.rotation.x=ang[k];par.add(sg);addPart(capsule(.1-.012*k,.11-.012*k,.12),mats.skin,sg,0,.1,0);\n   if(k<3)",
    "const segs=[];let par=base;const ang=[.17,.2,.2,.19,.18,.16];for(let k=0;k<6;k++){const sg=new THREE.Group();sg.position.y=k?.14:0;sg.rotation.x=ang[k];par.add(sg);addPart(capsule(.105-.008*k,.115-.008*k,.08),mats.skin,sg,0,.08,0);\n   if(k<5)")
rep("addPart(Sph(.15,20,14),mats.skin,head,0,0,0).scale.set(1,.85,1.15);addPart(Bx(.15,.09,.24),mats.skin,head,0,-.01,.2);",
    "addPart(Sph(.15,20,14),mats.skin,head,0,0,0).scale.set(1,.85,1.15);addPart(Bx(.15,.09,.24),mats.skin,head,0,-.01,.2);{const sn=addPart(new THREE.ConeGeometry(.078,.17,8),mats.skin,head,0,-.008,.37);sn.rotation.x=Math.PI/2;sn.scale.set(1,1,.62);}")
rep("   const e=new THREE.Mesh(Sph(.026,10,8),eyeM);e.position.set(s*.085,.04,.12);head.add(e);}",
    "   const e=new THREE.Mesh(Sph(.026,10,8),eyeM);e.position.set(s*.085,.04,.12);head.add(e);\n   const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:0xffe14d,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));gl.scale.setScalar(.16);gl.position.copy(e.position);head.add(gl);\n   const br=addPart(Bx(.07,.028,.12),mats.ex2,head,s*.075,.075,.1);br.rotation.z=s*.35;addPart(Sph(.012,8,6),mats.mouth,head,s*.025,.02,.45,false);}")
rep("addPart(Sph(.32,24,16),mats.skin,torso,0,.5,.16).scale.set(1.1,.9,1);","addPart(Sph(.32,24,16),mats.skin,torso,0,.5,.16).scale.set(1.1,.9,1);\n for(let i=0;i<6;i++){const pl=addPart(Bx(.34-i*.035,.055,.05),mats.top,torso,0,.5-i*.09,.47-i*.035);pl.rotation.x=.25+i*.06;}")
rep("const mem=new THREE.Mesh(new THREE.ShapeGeometry(sh),mats.hair);mem.castShadow=true;w.add(mem);","const mem=new THREE.Mesh(new THREE.ShapeGeometry(sh),mats.hair);mem.castShadow=true;mem.scale.setScalar(1.7);w.add(mem);bone.scale.setScalar(1.7);bone.position.multiplyScalar(1.7);")
rep("const seg=addPart(g,mats.skin,tp,0,i?.28:.05,i?0:-.42);seg.rotation.x=i?.12:-1.95;tail.push(seg);tp=seg;}",
    "const seg=addPart(g,mats.skin,tp,0,i?.28:.05,i?0:-.42);seg.rotation.x=i?.12:-1.95;if(i<6){const tsp=addPart(cone(.035,.1,5),mats.ex1,seg,0,.15,-r0*.85);tsp.rotation.x=-1.25;}tail.push(seg);tp=seg;}")
# retratos: busto con hombros en lugar del primer plano de la cara (admite imágenes reales en PORTRAIT_IMG)
rep("porCam.position.set(hp.x+.2*s,hp.y+.02*s,hp.z+.88*s*hs);porCam.lookAt(hp.x,hp.y-.06*s,hp.z);","porCam.position.set(hp.x+.3*s,hp.y-.02*s,hp.z+1.25*s*hs);porCam.lookAt(hp.x,hp.y-.15*s,hp.z);")
rep("const PORTRAITS=CHARS.map(ch=>renderPortrait(ch,0).toDataURL());","/* Si hay una imagen real del personaje (p. ej. portraits/goku.webp) se usa; si no, se dibuja su busto en 3D */\nconst PORTRAIT_IMG=window.KC_PORTRAITS||{};\nconst PORTRAITS=CHARS.map(ch=>PORTRAIT_IMG[ch.id]||renderPortrait(ch,0).toDataURL());")
open(D+'stage18b.js','w',encoding='utf8').write(src)
print('ok')
