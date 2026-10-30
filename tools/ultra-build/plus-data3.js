/* =========================================================
   KAIOKEN CLASH 3.0 — CONTENIDO NUEVO (DATOS)
   ========================================================= */
/* Goku Black: Rosé fase 3 (410 MM) y fase 4 (600 MM) */
(()=>{const b=CHARS.find(c=>c.id==='black');if(!b)return;const i=b.forms.findIndex(f=>f.id==='rose');
 b.forms.splice(i+1,0,F('rose3','Rosé fase 3',4.1e11/b.base,{era:'S',cost:6,drain:.025,hair:'ssj2',hairColor:0xff5ab8,aura:0xff3aa8,pupil:0x9a2a6a,bolt:1,scale:[1.05,1.02,1.05]}),
  F('rose4','Rosé fase 4',6e11/b.base,{era:'S',cost:7,drain:.03,hair:'ssj2',hairColor:0xff2a90,aura:0xff1a7a,pupil:0x7a1a4a,bolt:1,auraOn:1,scale:[1.1,1.04,1.1]}));})();
/* Vegeta: Ultra Ego a 770 MM */
(()=>{const v=CHARS.find(c=>c.id==='vegeta'),u=v&&v.forms.find(f=>f.id==='ue');if(u)u.mult=7.7e11/v.base;})();
/* Toppo, del Universo 11: de base hasta Dios de la Destrucción (igual de fuerte que Vegeta Blue Evolucionado) */
CHARS.push({id:'toppo',ears:true,name:'Toppo',era:'S',base:4e10,hair:'none',hairColor:0x2a1a12,extras:['toppoStache'],h:1.22,scale:[1.42,1.1,1.42],head:[1.12,1.08,1.08],
 colors:{skin:0xb98a6a,top:0xd02a2a,sleeve:0x1a1a22,pants:0x1a1a22,belt:0xf2f2f2,boots:0xf2f2f2,glove:0xf2f2f2,wrist:0xf2f2f2,ex1:0x2a1a12,ex2:0xd02a2a,pupil:0x111111},
 s1:{name:'Justice Flash',type:'rain',color:0xffe06a},s2:{name:'Justicia Aplastante',type:'ball',color:0xffc03a},ult:{name:'Hakai de Toppo',type:'hakai',color:0xb040ff},
 forms:[F('base','Base',1,{era:'S'}),F('justice','Poder de la Justicia',2.5,{era:'S',cost:3,drain:.01,aura:0xffd23a,auraOn:1}),
  F('god','Dios de la Destrucción',(2.6e6*115385)/4e10,{era:'S',cost:7,drain:.03,aura:0x9a40ff,auraOn:1,bolt:1,eye:0xf4f4f4,pupil:0xf4f4f4,scale:[1.5,1.14,1.5],colors:{top:0xb98a6a,sleeve:0xb98a6a,glove:0xb98a6a}})]});
/* 3.1: Super Saiyajin 4 al estilo de Daima: pelaje rosado-rojo, pecho al descubierto, melena enorme magenta y ojos con borde rojo */
const FUR_D=0xc8466e,HAIR4_D=0xd23a72;
(()=>{const set=(id,o)=>{const c=CHARS.find(x=>x.id===id),f=c&&c.forms.find(x=>x.id==='ssj4');if(f)Object.assign(f,o);};
 set('goku',{name:'Super Saiyajin 4 (Daima)',hair:'ssj4d',hairColor:HAIR4_D,aura:0xff4a7a,extras:['furChest','redRims','furTail'],colors:{top:FUR_D,sleeve:FUR_D,pants:0xff8a1a,belt:0xff8a1a,boots:0x2448c8,wrist:0x2448c8}});
 set('vegeta',{name:'Super Saiyajin 4 (Daima)',hair:'vegeta4d',hairColor:HAIR4_D,aura:0xff4a7a,extras:['furChest','redRims','furTail'],colors:{top:FUR_D,sleeve:FUR_D,pants:0x23306e,belt:0xf2f2f2,boots:0xf2f2f2,wrist:0x23306e}});
 set('gogeta',{name:'Gogeta SSJ4 (Daima)',aura:0xff4a6a,extras:['furChest','redRims','furTail','fusionVest'],colors:{top:FUR_D,sleeve:FUR_D,pants:0xf2f2f2,belt:0x2a6ad8,boots:0x1a1a1a,wrist:0x2a6ad8}});
 set('vegetto',{name:'Vegito SSJ4 (Daima)',hair:'ssj4d',hairColor:HAIR4_D,aura:0xff4a7a,extras:['furChest','redRims','furTail'],colors:{top:FUR_D,sleeve:FUR_D}});})();
/* 3.1: Vegeta Super Saiyajin 3 (va al final de la lista para no mover las formas ya compradas; el orden de transformación lo marca «order») */
(()=>{const v=CHARS.find(c=>c.id==='vegeta');if(!v||v.forms.some(f=>f.id==='ssj3'))return;
 v.forms.push(F('ssj3','Super Saiyajin 3',400,{era:'Z',cost:4,drain:.04,hair:'vegeta3',hairColor:GOLD,aura:0xffc21a,pupil:0x1fa39a,bolt:1,noRegen:1,tdur:2,noBrows:1}));
 const id=x=>v.forms.findIndex(f=>f.id===x),ord=v.forms.map((_,i)=>i).filter(i=>i!==id('ssj3'));ord.splice(ord.indexOf(id('majin'))+1,0,id('ssj3'));v.order=ord;})();
/* =========================================================
   KAIOKEN CLASH 3.2 — Daima y Gas
   ========================================================= */
/* Guardianes de las esferas del Reino Demoníaco: robots blancos con ojos rojos, hombreras con púas y la esfera en el pecho.
   N.º 1 con espada curva, N.º 2 alto y delgado con tridente, N.º 3 bajo y ancho con martillo. Se desbloquean al vencerlos en el arco Daima. */
const TAMA_C={skin:0xe6e0d2,top:0xe6e0d2,sleeve:0x3a3a42,pants:0x3a3a42,belt:0x6a5ac8,boots:0xe6e0d2,glove:0xa4a4ae,wrist:0x6a5ac8,ex1:0xd8b040,ex2:0xece6d8,pupil:0xe0242a,eye:0xe0242a};
CHARS.push(
 {id:'tama1',ears:false,name:'Guardián N.º 1',era:'S',base:9e8,hair:'none',hairColor:0xe6e0d2,extras:['tamaHead','tamaPads','tamaChest','tamaSword'],unlock:'dai1',h:1.2,scale:[.96,1.08,.96],head:[1.04,.94,1.04],android:1,
  colors:Object.assign({},TAMA_C),s1:{name:'Corte Demoníaco',type:'sword',color:0xe8f0ff},s2:{name:'Tajo en Cruz',type:'disc',color:0xff4a4a},ult:{name:'Juicio del Guardián',type:'beam',color:0xff3a3a},
  forms:[F('base','Base',1,{era:'S'})]},
 {id:'tama2',ears:false,name:'Guardián N.º 2',era:'S',base:1.05e9,hair:'none',hairColor:0xe6e0d2,extras:['tamaHead','tamaPads','tamaChest','tamaTrident'],unlock:'dai3',h:1.42,scale:[.86,1.24,.86],head:[1.1,.84,1.08],android:1,evade:.1,
  colors:Object.assign({},TAMA_C,{belt:0x7078d8,wrist:0x7078d8,boots:0x7078d8}),s1:{name:'Estocada del Tridente',type:'spiral',color:0xffe06a},s2:{name:'Lluvia de Lanzas',type:'rain',color:0xffd04a},ult:{name:'Rayo del Tridente',type:'beam',color:0xffd23a},
  forms:[F('base','Base',1,{era:'S'})]},
 {id:'tama3',ears:false,name:'Guardián N.º 3',era:'S',base:1.2e9,hair:'none',hairColor:0xe6e0d2,extras:['tamaHead3','tamaPads','tamaChest','tamaHammer'],unlock:'dai4',h:1.12,scale:[1.5,.95,1.42],android:1,
  colors:Object.assign({},TAMA_C,{belt:0xd8b040,wrist:0xd8b040}),s1:{name:'Martillazo',type:'meteors',color:0xffb04a},s2:{name:'Onda Sísmica',type:'barrage',color:0xffc06a},ult:{name:'Martillo del Abismo',type:'ball',color:0xff6a2a},
  forms:[F('base','Base',1,{era:'S'})]});
['tama1','tama2','tama3'].forEach(id=>{const c=CHARS.find(x=>x.id===id);c.voice=90;c.porK=1.35;});
/* 3.2b: Gas con sus cinco formas del manga (imágenes del usuario, de la inicial a la última). Piel cian, rastas, diadema con colmillos de marfil,
   tabardo rojo con ribete amarillo y botas azules. Poderes: base 120 MM → deseo 500 MM → gabardina 650 MM → despertado 800 MM → al límite 900 MM
   (Goku Ultra Instinto dominado = 900 MM; Granolah máximo 850 MM). Las formas nuevas van al final para no mover las compras; el orden lo marca «order». */
(()=>{const g=CHARS.find(c=>c.id==='gas');if(!g)return;const B=1.2e11;
 const CY=0x6ac8e2,WH=0xe8e8f4,BL=0x1e3296;
 Object.assign(g,{base:B,hair:'none',hairColor:0x6a4a8a,ears:false,extras:['dreads','gasCrown','pointyEars','tabard','bootBuckle'],h:1.24,scale:[1.18,1.12,1.14],
  colors:{skin:CY,top:WH,sleeve:WH,pants:WH,belt:0xb81a1e,boots:BL,glove:CY,wrist:WH,ex1:0xe0b84a,ex2:0xb81a1e,pupil:0x2a4ad8,eye:0xffffff}});
 const set=(id,o)=>{const f=g.forms.find(x=>x.id===id);if(f)Object.assign(f,o);};
 set('base',{name:'Base'});
 set('wish',{name:'Deseo cumplido',mult:5e11/B,hairColor:0x7a5a9a,extras:['dreadsWild','gasTusksBig','pointyEars','tabardTorn','bootBuckle','blankEyes'],aura:0xff6ad8,auraOn:1,bolt:0,scale:[1.42,1.18,1.36],colors:{top:CY,skin:0xa8dcea,glove:0xa8dcea}});
 set('limit',{name:'Al límite',mult:9e11/B,hairColor:0x1e1a24,extras:['dreadsLong','gasTusksBig','pointyEars','rags','gasLines','blackEyes'],aura:0x9a3aff,auraOn:1,bolt:1,scale:[1.08,1.3,1.04],
  colors:{skin:0x9ad0dc,top:0x9ad0dc,sleeve:0x9ad0dc,glove:0x9ad0dc,pants:0xe6e2ea,belt:0xe6e2ea,boots:0x9ad0dc,wrist:0x9ad0dc,pupil:0x6a3ad8}});
 const lim=g.forms.find(f=>f.id==='limit'),lc=lim?{cost:lim.cost,drain:lim.drain}:{cost:5,drain:.02};
 if(!g.forms.some(f=>f.id==='coat'))g.forms.push(F('coat','El más fuerte del universo',6.5e11/B,{era:'S',cost:4,drain:.012,hairColor:0x24202c,extras:['dreadsLong','gasCrown','pointyEars','tabardLong','bootBuckle'],aura:0xff7a3a,auraOn:1,scale:[1.26,1.2,1.2]}));
 if(!g.forms.some(f=>f.id==='awaken'))g.forms.push(F('awaken','Despertado',8e11/B,{era:'S',cost:5,drain:.016,hairColor:0x6a4a8a,extras:['dreadsWild','gasTusksBig','pointyEars','tabardTorn','bootBuckle','blankEyes'],aura:0xff3ad0,auraOn:1,bolt:1,scale:[1.55,1.22,1.46],
  colors:{skin:0xb8dcea,top:0xb8dcea,sleeve:0xb8dcea,glove:0xb8dcea}}));
 Object.assign(lim||{},lc);const ix=id=>g.forms.findIndex(f=>f.id===id);g.order=['base','wish','coat','awaken','limit'].map(ix).filter(i=>i>=0);})();
/* 3.2b: Granolah como en las imágenes: pelo menta hacia atrás, visor en el ojo derecho, bufanda blanca, chaleco verde con botones, guantes y botas marrones.
   Con el deseo: ropa negra con tirantes y pelo blanco erizado. Máximo 850 MM. */
(()=>{const g=CHARS.find(c=>c.id==='granolah');if(!g)return;const B=1e11;
 Object.assign(g,{base:B,hair:'granolah',hairColor:0x9ae6d4,extras:['scope','scarfRed','vestButtons'],
  colors:{skin:0xe8c8a8,top:0x5e8a48,sleeve:0x4a6e36,pants:0x3e4a22,belt:0x7a4a1a,boots:0xa8743a,glove:0x8a5a2a,wrist:0x8a5a2a,ex1:0xf4f4f4,ex2:0x7a4a1a,pupil:0x3a6a3a}});
 const w=g.forms.find(f=>f.id==='wish');if(w)Object.assign(w,{mult:8.5e11/B,hair:'granolahW',hairColor:0xeef2f4,extras:['scope','suspenders'],aura:0x7affc0,auraOn:1,bolt:1,
  colors:{top:0x18181c,sleeve:0x18181c,pants:0x18181c,belt:0x9a9aa4,wrist:0x18181c,glove:0xe8c8a8,boots:0x18181c}});})();
/* 3.2b: Cell Max como en Super Hero: cuerpo verde, placas rojas con manchas negras, alas negras, boca abierta y cola con maza */
(()=>{const c=CHARS.find(x=>x.id==='cell'),f=c&&c.forms.find(x=>x.id==='max');if(!f)return;
 Object.assign(f,{extras:['cellcrown','maxWings','tail','maxMace','maxPlates','maxMouth'],head:[1.1,1.0,1.15],scale:[1.45,1.2,1.4],aura:0xff4a2a,
  colors:{skin:0x84c040,top:0xc8261c,sleeve:0x84c040,pants:0x84c040,belt:0x1e1e22,boots:0xc8261c,glove:0x84c040,wrist:0x6a2a70,ex1:0x1a1a1a,ex2:0x34343a,eye:0xf2f2f2,pupil:0xf2f2f2}});})();
/* 3.2b: Zamasu fusionado: pelo blanco, abrigo gris de Kaioshin con forro rojo, faja roja, botas blancas; forma nueva «Corrupto» con el brazo derecho morado */
(()=>{const z=CHARS.find(x=>x.id==='zamasuk');if(!z)return;
 Object.assign(z,{extras:['earringL','pointyEars','kaioCoat'],colors:{skin:0x7ac87a,top:0x5a5a64,sleeve:0x1a1a20,pants:0x26262c,belt:0xc0201e,boots:0xf0f0f0,glove:0x7ac87a,wrist:0x1a1a20,ex1:0x5aff9a,ex2:0xffffff}});
 if(!z.forms.some(f=>f.id==='corrupt'))z.forms.push(F('corrupt','Fusión corrupta',5,{era:'S',cost:5,drain:.016,regen:.02,extras:['earringL','pointyEars','kaioCoat','purpleArm'],aura:0xb06aff,auraOn:1,bolt:1,scale:[1.08,1.04,1.08]}));})();
/* 3.2b: Kaioken (botón KK) para Goku, Vegito y Gogeta en cualquier momento y forma */
/* Gogeta: el Soul Punisher se llama Quebrantador de Espíritu (esfera pequeña y multicolor, ver plus-moves.js) */
(()=>{const g=CHARS.find(c=>c.id==='gogeta');if(g&&g.ult&&/Soul Punisher/.test(g.ult.name))Object.assign(g.ult,{name:'Quebrantador de Espíritu',type:'soul'});})();
