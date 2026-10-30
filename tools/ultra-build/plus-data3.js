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
