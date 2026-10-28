import sys,re
import os;D=os.path.dirname(os.path.abspath(__file__))+'/'
src=open(D+'base-1.8.html',encoding='utf8').read()
def rep(old,new,cnt=1):
    global src
    n=src.count(old)
    if n!=cnt: sys.exit('COUNT %d!=%d for: %s'%(n,cnt,old[:110]))
    src=src.replace(old,new)
# ---- separar: cuerpo del juego (desde el canvas hasta el final del script principal)
i=src.index('<canvas id="game"></canvas>');j=src.index('<script src="vendor/three.min.js"></script>')
k=src.index("<script>\n'use strict';");e=src.index('</script>\n\n<script>if(\'serviceWorker\'')
html=src[i:j];js=src[k:e+len('</script>')]
src=html+'@@LIBS@@\n'+js
# código muerto en la 1.8: un comentario // se tragaba lo que venía detrás en la misma línea
rep("// el dragón aguanta mucho pero pega menosif(def.ch.brolyPassive","// el dragón aguanta mucho pero pega menos\nif(def.ch.brolyPassive")
rep("// crece o encoge poco a poco al cambiar de formaconst idleBob=","// crece o encoge poco a poco al cambiar de forma\nconst idleBob=")
rep('<div id="flash"></div><div id="crt"></div>','<div id="flash"></div><div id="vig"></div>')
rep('<div class="logo" style="font-size:20px">GIRA EL CELULAR</div>','<div class="logo" style="font-size:52px">GIRA EL CELULAR</div>')
for a,b in [('font-size:8px','font-size:15px'),('font-size:9px','font-size:14px'),('font-size:10px','font-size:16px')]:src=src.replace(a,b)
rep('KAIOKEN CLASH — prototipo jugable (fase 1)\n   1v1 local · 3 mundos · 13 luchadores · poder realista','KAIOKEN CLASH ULTRA — versión realista sobre la 1.8\n   5 mundos + planeta de Bills · 25 luchadores · poder según el anime y el manga')
rep('const APP=Object.freeze({version:"1.8.0",build:"2026-10-18",updateUrl:"",storeUrl:""});','const APP=Object.freeze({version:"2.1.0",build:"2026-10-24",updateUrl:"",storeUrl:""});')
# Ultra Instinto dominado permanente (Goku, Gogeta y Vegito)
src,n=re.subn(r"(F\('ui','Ultra Instinto dominado',300000,\{era:'S',cost:7,)dur:25,hpReq:\.3,",r"\1",src);assert n==3,n
rep("pupil:0x6a2a6a},\n],","XX") if False else None
rep("forms:[F('base','Base',1,{era:'S',aura:0xb070ff}),F('god','Poder divino',3,{era:'S',cost:4,drain:.012,aura:0x9a50ff,auraOn:1}),\n  F('serious','Destrucción total',5,{era:'S',cost:6,drain:.02,aura:0x7a30ff,auraOn:1,bolt:1})]},\n];",
 "forms:[F('base','Base',1,{era:'S',aura:0xb070ff}),F('god','Poder divino',3,{era:'S',cost:4,drain:.012,aura:0x9a50ff,auraOn:1}),\n  F('serious','Destrucción total',5,{era:'S',cost:6,drain:.02,aura:0x7a30ff,auraOn:1,bolt:1})]},\n];\n"+open(D+'chars18.js',encoding='utf8').read())
rep("{id:'train',name:'Entrenamiento',desc:'El rival se queda quieto. Practica combos, formas y especiales.'}","{id:'train',name:'Entrenamiento',desc:'En el planeta de Bills, con Whis de maestro. Él no ataca y esquiva como el Ultra Instinto dominado.'}")
# ---- render
rep("""const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.setPixelRatio(1);
renderer.autoClear=true;
let PIX=clamp(Math.round(store.get('kc_pix',2))||2,1,3);""","""const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
/* Calidad (F2): densidad de píxeles del render, sin pixelado */
const QUALS=[1,1.5,2];let QUAL=QUALS.includes(store.get('kc_q',1.5))?store.get('kc_q',1.5):1.5;
const applyQual=()=>renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,QUAL));applyQual();
renderer.autoClear=true;
const PIX=1;""")
src=src.replace('new THREE.MeshPhongMaterial(','phong(').replace('new THREE.MeshToonMaterial({','phong({')
rep("""const TOON=new THREE.DataTexture(new Uint8Array([70,140,205,255]),4,1,THREE.LuminanceFormat);
TOON.minFilter=TOON.magFilter=THREE.NearestFilter;TOON.needsUpdate=true;
const OUTLINE=new THREE.MeshBasicMaterial({color:0x0a0a16,side:THREE.BackSide});
const toon=c=>phong({color:c,gradientMap:TOON});""","""/* Sombreado anime de alta definición: tonos limpios + luz de contorno (rim), como en los juegos de lucha modernos */
const TOON=new THREE.DataTexture(new Uint8Array([92,92,168,228,228]),5,1,THREE.LuminanceFormat);
TOON.minFilter=TOON.magFilter=THREE.NearestFilter;TOON.needsUpdate=true;
const OUTLINE=new THREE.MeshBasicMaterial({color:0x0c0c18,side:THREE.BackSide});
const RIM_CODE='float rimK=1.0-max(dot(normalize(normal),normalize(vViewPosition)),0.0);gl_FragColor.rgb+=vec3(.9,.95,1.0)*smoothstep(.6,.95,rimK)*.28;\\n#include <dithering_fragment>';
const toon=c=>{const m=new THREE.MeshToonMaterial({color:c,gradientMap:TOON});m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <dithering_fragment>',RIM_CODE);};return m;};
/* Escenarios: materiales físicos y rugosos */
function phong(o){const p=Object.assign({roughness:.88,metalness:0},o);delete p.shininess;delete p.gradientMap;return new THREE.MeshStandardMaterial(p);}""")
rep("SPOTS.wrapS=SPOTS.wrapT=THREE.RepeatWrapping;SPOTS.magFilter=THREE.NearestFilter;","SPOTS.wrapS=SPOTS.wrapT=THREE.RepeatWrapping;")
# ---- modelos
a=src.index('const CHIBI=.95,HEADK=1.75;');b=src.index('/* ---------------- Poses ---------------- */')
src=src[:a]+open(D+'model18.js',encoding='utf8').read()+src[b:]
rep("POSES.punchL=mirrorPose(POSES.punchR);POSES.blastL=mirrorPose(POSES.blastR);","""POSES.punchL=mirrorPose(POSES.punchR);POSES.blastL=mirrorPose(POSES.blastR);
Object.assign(POSES,{
 kickHigh:{torso:[-.2,.4,-.35],head:[.1,-.3,.2],shL:[-.6,0,.8],elL:[-1.2,0,0],shR:[-1.2,0,-.5],elR:[-1.8,0,0],hipL:[-1.5,0,.9],knL:[.2,0,0],hipR:[.1,0,-.05],knR:[.25,0,0]},
 dodgeL:{torso:[.1,0,.45],head:[0,0,-.25],shL:[-1.2,0,.6],elL:[-1.8,0,0],shR:[-1.3,0,-.2],elR:[-1.9,0,0],hipL:[-.2,0,.35],knL:[.6,0,0],hipR:[-.1,0,.1],knR:[.4,0,0]},
 sway:{torso:[-.5,0,0],head:[.35,0,0],shL:[-1.3,0,.45],elL:[-1.9,0,0],shR:[-1.2,0,-.45],elR:[-1.9,0,0],hipL:[.15,0,.08],knL:[.6,0,0],hipR:[-.35,0,-.08],knR:[.5,0,0]},
 duck:{torso:[.75,0,0],head:[-.6,0,0],shL:[-1.6,0,.3],elL:[-1.8,0,0],shR:[-1.5,0,-.3],elR:[-1.9,0,0],hipL:[-1.3,0,.12],knL:[1.9,0,0],hipR:[-.5,0,-.12],knR:[1.6,0,0]},
 tired:{torso:[.55,0,0],head:[-.35,0,0],shL:[-.5,0,.18],elL:[-.5,0,0],shR:[-.5,0,-.18],elR:[-.5,0,0],hipL:[-.55,0,.1],knL:[.8,0,0],hipR:[-.25,0,-.1],knR:[.6,0,0]}});
POSES.dodgeR=mirrorPose(POSES.dodgeL);""")
rep("const SNAPPY=new Set(['punchR','punchL','kick','uppercut','blastR','blastL','beamFire','throw','hit','knock','windup']);","const SNAPPY=new Set(['punchR','punchL','kick','kickHigh','uppercut','blastR','blastL','beamFire','throw','hit','knock','windup','dodgeL','dodgeR','sway','duck']);")
rep("""model.t+=dt;const P=POSES[model.target]||POSES.idle,br=Math.sin(model.t*2.2)*.035;""","""model.t+=dt;const P=POSES[model.target]||POSES.idle,fat=model.fatigue||0,br=Math.sin(model.t*(2.2+fat*3.4))*(.03+fat*.06),eff=model.effort||0,sl=(model.slump||0)+fat*.22;""")
rep("""  model.J[j].rotation.set(c[0]+(j==='torso'?br:j==='head'?-br*.6:(j==='shL'||j==='shR')?br*.8:0),c[1],c[2]);}
 if(model.smear>0)model.smear-=dt;
 for(const L of['L','R']){const s=model.smear>0&&model.smearSide===L?1.3:1;model.M.arms[L][0].scale.y=s;model.M.arms[L][1].scale.y=s;}""","""  /* respiración (más agitada con cansancio), espalda encorvada y temblor de esfuerzo al cargar o en un choque */
  let x=c[0],zz=c[2];if(j==='torso')x+=br+sl*.55;else if(j==='head')x+=-br*.6-sl*.3;else if(j==='shL'||j==='shR')x+=br*.8+sl*.4;
  if(eff>0){const q=eff*.03;x+=rand(-q,q);zz+=rand(-q,q);}
  model.J[j].rotation.set(x,c[1],zz);}
 if(model.cape){const want=.12+Math.sin(model.t*2.3)*.06+(model.target==='fly'?1.1:0)+(model.target==='knock'?.8:0);model.cape.rotation.x=lerp(model.cape.rotation.x,want,1-Math.exp(-dt*5));}
 if(model.M.mouthO){model.yell=(model.yell||0)-dt;const y=model.yell>0;model.M.mouthO.visible=y;model.M.mouth.visible=!y;}""")
rep('a=floor(a*5.0)/5.0;','',2)
rep('c=floor(c*22.0)/22.0;','');rep('c=floor(c*16.0)/16.0;','')
rep("u1.uOp.value=Math.min(1,this.level)*.85;u2.uOp.value=Math.min(1,this.level)*.4;","u1.uOp.value=Math.min(1,this.level)*.55;u2.uOp.value=Math.min(1,this.level)*.25;")
# ---- audio
a=src.index('/* ---------------- Audio (sintetizado) ---------------- */');b=src.index('/* ---------------- Mundos ---------------- */')
src=src[:a]+open(D+'audio18.js',encoding='utf8').read()+src[b:]
open(D+'stage18.js','w',encoding='utf8').write(src)
print('ok',len(src))
