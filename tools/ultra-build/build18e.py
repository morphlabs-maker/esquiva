import sys
import os;D=os.path.dirname(os.path.abspath(__file__))+'/'
src=open(D+'stage18b.js',encoding='utf8').read()
def rep(old,new,cnt=1):
    global src
    n=src.count(old)
    if n!=cnt: sys.exit('COUNT %d!=%d for: %s'%(n,cnt,old[:110]))
    src=src.replace(old,new)
# voces: solo el grito al transformarse
rep("vox(this,'scream',Math.max(.7,this.transDur+.2));","vox(this,'tscream',Math.max(.7,this.transDur+.2));")
rep("function vox(f,kind,k=1){","function vox(f,kind,k=1){if(kind!=='tscream')return;kind='scream';")
# brillo: solo las auras (los ataques de energía sin resplandor)
rep("const group=new THREE.Group();group.add(outer,inner);group.visible=false;","outer.userData.glow=inner.userData.glow=true;const group=new THREE.Group();group.add(outer,inner);group.visible=false;")
rep("group.add(s);flames.push(s);}","s.userData.glow=true;group.add(s);flames.push(s);}")
rep("scene.traverseVisible(o=>{if(!o.isMesh)return;if(lit(o.material)||(Array.isArray(o.material))){sw.push(o,o.material);o.material=blk;}});",
    "const hid0=[];scene.traverseVisible(o=>{if(o.userData.glow)return;if(o.isMesh){const mt=o.material;if(!Array.isArray(mt)&&mt.transparent&&!lit(mt)){o.visible=false;hid0.push(o);}else{sw.push(o,mt);o.material=blk;}}else if(o.isSprite||o.isPoints||o.isLine){o.visible=false;hid0.push(o);}});")
rep("for(const o of hid)o.visible=true;","for(const o of hid)o.visible=true;for(const o of hid0)o.visible=true;")
# aura proporcional al cuerpo (personajes grandes)
rep("const s=(.8+this.level*.5)*.8;this.group.scale.set(s,(.85+this.level*.35)*.75,s);",
    "const s=(.8+this.level*.5)*.8,bs=this.body?this.body.scale:null,bx=bs?Math.max(.6,(bs.x+bs.z)/2):1,by=bs?Math.max(.6,bs.y):1;this.group.scale.set(s*bx*1.12,(.85+this.level*.35)*.75*by*1.08,s*bx*1.12);this.bolts.scale.set(.75*bx,.75*by,.75*bx);")
rep("this.aura.target=lv;","this.aura.body=this.model.body;this.aura.target=lv;")
rep("mm.aura.target=pst[p]","mm.aura.body=mm.model.body;mm.aura.target=pst[p]")
rep("bossPrev.aura.target=.6;","bossPrev.aura.body=bossPrev.model.body;bossPrev.aura.target=.6;")
# cámara más cerca (más aún en el celular)
rep("const dy=Math.abs(a.pos.y-b.pos.y),dist=5.5+sep*.7+dy*.4;const tp=mid.clone().addScaledVector(n,dist).add(V3(0,2.2+sep*.12,0));",
    "const CZ=(typeof coarse!=='undefined'&&coarse)?.7:.82,dy=Math.abs(a.pos.y-b.pos.y),dist=(3.4+sep*.5+dy*.3)*CZ;const tp=mid.clone().addScaledVector(n,dist).add(V3(0,1.6+sep*.09,0));")
rep("addScaledVector(to,-7*a.giant).addScaledVector(r,-1.8).add(V3(0,2.8*a.giant,0));","addScaledVector(to,-5.2*a.giant).addScaledVector(r,-1.5).add(V3(0,2.2*a.giant,0));")

# rayos sin brillo: color sólido de energía, núcleo tenue, cabeza y boca más pequeñas
rep("float a=clamp((.4+f*.9)*s,0.0,1.0);vec3 c=mix(vec3(1.0),uColor,clamp(f*1.7,0.0,1.0));gl_FragColor=vec4(c,a);}`,\n transparent:true,blending:THREE.AdditiveBlending,",
    "float a=clamp((.5+f*.35)*s,0.0,.85);vec3 c=mix(mix(vec3(1.0),uColor,.6),uColor*.85,clamp(f*1.6,0.0,1.0));gl_FragColor=vec4(c,a);}`,\n transparent:true,blending:THREE.NormalBlending,")
rep("new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));\n const head=",
    "new THREE.MeshBasicMaterial({color:new THREE.Color(color).lerp(new THREE.Color(1,1,1),.55),transparent:true,opacity:.6,depthWrite:false}));\n const head=")
rep("v.head.scale.setScalar(w*5*fl);v.headCore.position.copy(headPos);v.headCore.scale.setScalar(w*2.6*fl);\n v.mouth.position.copy(origin);v.mouth.scale.setScalar(w*3.4*fl);v.core.material.opacity=.95*fade;v.head.material.opacity=v.headCore.material.opacity=v.mouth.material.opacity=fade;",
    "v.head.scale.setScalar(w*2.8*fl);v.headCore.position.copy(headPos);v.headCore.scale.setScalar(w*1.3*fl);\n v.mouth.position.copy(origin);v.mouth.scale.setScalar(w*2*fl);v.core.material.opacity=.6*fade;v.head.material.opacity=.5*fade;v.headCore.material.opacity=.35*fade;v.mouth.material.opacity=.45*fade;")
rep("spawn({pos,color:0xffffff,size:radius*3.2,life:.22});spawn({pos,color,size:radius*4.5,life:.45,grow:radius*2});",
    "spawn({pos,color:0xffffff,size:radius*2,life:.18,op:.55});spawn({pos,color,size:radius*3.2,life:.4,grow:radius*1.5,op:.6});")
open(D+'stage18b.js','w',encoding='utf8').write(src)
print('ok-e')
