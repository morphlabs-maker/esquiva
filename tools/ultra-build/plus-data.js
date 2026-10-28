/* =========================================================
   KAIOKEN CLASH 2.0 — CONTENIDO COMO DATOS
   Todo lo nuevo (luchadores, técnicas, outfits, jefes, fusiones, diálogos, desafíos, logros, deseos y arcos)
   vive en estas tablas. Los sistemas de plus.js solo las leen: para añadir contenido se edita aquí.
   ========================================================= */

/* ---- Luchadores nuevos: se desbloquean jugando el modo historia (unlock = id del capítulo que lo da) ---- */
const ARMOR_C={ex1:0xf2f2f2,ex2:0xc8a040};
CHARS.push(
{id:'raditz',name:'Raditz',era:'Z',base:1500,saiyan:1,hair:'raditz',hairColor:0x161616,extras:['armor','furTail'],unlock:'sai1',h:1.08,
 colors:{skin:SKIN,top:0x2a2438,sleeve:SKIN,pants:0x2a2438,belt:0x2a2438,boots:0xf2f2f2,glove:SKIN,wrist:0xc03030,ex1:0x5a4a3a,ex2:0x3a2e24},
 s1:{name:'Double Sunday',type:'ball',color:0xff5aa0},s2:{name:'Ráfaga Saiyajin',type:'barrage',color:0xffa0d0},ult:{name:'Bomba Saturday Crush',type:'ball',color:0xff3a8a},
 forms:[F('base','Base',1),F('full','Poder al máximo',1.6,{cost:1,aura:0xffffff,auraOn:1}),F('oozaru','Oozaru',10,{cost:3,drain:.01,giant:2.2,tdur:2,aura:0xffe080,colors:{skin:0x8a5a34,top:0x8a5a34,sleeve:0x8a5a34,pants:0x8a5a34,glove:0x8a5a34,eye:0xff3030,pupil:0xff3030},extras:['apeMuzzle','apeEars','furTail']})]},
{id:'nappa',ears:true,name:'Nappa',era:'Z',base:4000,saiyan:1,hair:'none',hairColor:0x161616,extras:['armor','mustache','furTail'],unlock:'sai2',h:1.2,scale:[1.22,1.05,1.22],
 colors:{skin:SKIN,top:0x2a2a5a,sleeve:SKIN,pants:0x2a2a5a,belt:0x2a2a5a,boots:0xf2f2f2,glove:SKIN,wrist:0xc03030,ex1:0xe8e8e8,ex2:0xc8a040},
 s1:{name:'Bomba Gigante',type:'ball',color:0xffb03a},s2:{name:'Ráfaga Explosiva',type:'barrage',color:0xffd080},ult:{name:'Break Cannon',type:'beam',color:0xffe14d},
 forms:[F('base','Base',1),F('rage','Furia Saiyajin',1.8,{cost:1,aura:0xffe080,auraOn:1,bolt:1})]},
{id:'ginyu',ears:false,name:'Capitán Ginyu',era:'Z',base:120000,hair:'none',hairColor:0,extras:['hitHorns','armor'],unlock:'nam2',
 colors:{skin:0x8a62b8,top:0x2a2a3a,sleeve:0x8a62b8,pants:0x2a2a3a,belt:0xf2f2f2,boots:0xf2f2f2,glove:0xf2f2f2,wrist:0xf2f2f2,ex1:0xf2f2f2,ex2:0xe8c040,pupil:0x111111},
 s1:{name:'Milky Cannon',type:'beam',color:0xd08aff},s2:{name:'Ráfaga Ginyu',type:'barrage',color:0xe0b0ff},ult:{name:'Pose Especial Ginyu',type:'ball',color:0xffd23a},
 forms:[F('base','Base',1),F('pose','Pose de combate',1.5,{cost:1,aura:0xd08aff,auraOn:1})]},
{id:'goten',name:'Goten',era:'Z',base:9e5,saiyan:1,hair:'goku',hairColor:0x161616,extras:[],unlock:'buu1',h:.78,
 colors:{skin:SKIN,top:0xff7a1a,pants:0xff7a1a,belt:0x1f4fd8,boots:0x1f4fd8,wrist:0x1f4fd8,sleeve:0x1f4fd8},
 s1:{name:'Kamehameha de Goten',type:'beam',color:0x5cc8ff},s2:{name:'Ráfaga de ki',type:'barrage',color:0x9fdcff},ult:{name:'Kamehameha Mini',type:'beam',color:0x7fd8ff},
 forms:[F('base','Base',1),F('ssj','Super Saiyajin',50,{cost:1,drain:.005,hair:'ssj',hairColor:GOLD,aura:0xffd23a,pupil:0x1fa39a})]},
{id:'zamasuk',ears:false,name:'Zamasu',era:'S',base:2e9,hair:'zamasu',hairColor:0xf4f4f4,extras:['earringL','pointyEars'],unlock:'tr1',regen:.006,
 colors:{skin:0x7ac87a,top:0x3a2a5a,sleeve:0x3a2a5a,pants:0x3a2a5a,belt:0xf0f0f0,boots:0xf0f0f0,glove:0x7ac87a,wrist:0xe8c040,ex1:0x5aff9a,ex2:0xffffff},
 s1:{name:'Rayo Divino',type:'beam',color:0xff6ad0},s2:{name:'Ráfaga del Kaioshin',type:'barrage',color:0xffb0e0},ult:{name:'Luz del Juicio',type:'ball',color:0xff6ad0},
 forms:[F('base','Base',1),F('immortal','Cuerpo inmortal',3,{era:'S',cost:3,drain:.01,regen:.02,aura:0xff8ad8,auraOn:1})]},
{id:'gohanks',name:'Gohanks',era:'Z',base:1.2e8,saiyan:1,hair:'gohanks',hairColor:0x3a2a45,extras:['fusionVest'],unlock:'wi2',
 colors:{skin:SKIN,top:0x2a3a8a,sleeve:SKIN,pants:0xf2f2f2,belt:0x2a6ad8,boots:0x1a1a1a,wrist:0x2a6ad8,ex1:0xffd23a},
 s1:{name:'Masenko Buster',type:'beam',color:0xffe35a},s2:{name:'Ráfaga Fusionada',type:'barrage',color:0xfff08a},ult:{name:'Kamehameha Ardiente',type:'beam',color:0x6ad0ff},
 forms:[F('base','Base',1),F('ssj','Super Saiyajin',50,{cost:1,drain:.005,hairColor:GOLD,aura:0xffd23a,pupil:0x1fa39a}),F('ssj2','Super Saiyajin 2',100,{cost:2,drain:.01,hairColor:GOLD,aura:0xffd23a,pupil:0x1fa39a,bolt:1})]},
{id:'granolah',name:'Granolah',era:'S',base:9e10,hair:'granolah',hairColor:0xf2f2f2,extras:['scarfRed'],unlock:'gr1',evade:.08,
 colors:{skin:0xd8b898,top:0x4a6a3a,sleeve:0x4a6a3a,pants:0x3a3a2a,belt:0x8a5a2a,boots:0x2a2a2a,glove:0x2a2a2a,wrist:0x8a5a2a,ex1:0xc02a2a,pupil:0xc02a2a},
 s1:{name:'Disparo del Francotirador',type:'beam',thin:1,color:0x9affd0},s2:{name:'Lluvia de Balas de Ki',type:'barrage',color:0xb0ffe0},ult:{name:'Cañón de Ki Cerealiano',type:'beam',color:0x7affc0},
 forms:[F('base','Base',1),F('wish','El más fuerte (deseo)',2.2,{era:'S',cost:4,drain:.012,aura:0x7affc0,auraOn:1,bolt:1})]},
{id:'gas',ears:false,name:'Gas',era:'S',base:7e10,hair:'gas',hairColor:0xb02a2a,extras:['armor'],unlock:'gr2',h:1.25,scale:[1.3,1.15,1.3],
 colors:{skin:0x9a88b8,top:0x3a3a4a,sleeve:0x9a88b8,pants:0x3a3a4a,belt:0x1a1a1a,boots:0x1a1a1a,glove:0x9a88b8,wrist:0x1a1a1a,ex1:0x4a4a5a,ex2:0xb02a2a,pupil:0xffe14d},
 s1:{name:'Rayo de Gas',type:'beam',color:0xff6a3a},s2:{name:'Golpes en Ráfaga',type:'barrage',color:0xff9a6a},ult:{name:'Explosión Heeter',type:'ball',color:0xff4a2a},
 forms:[F('base','Base',1),F('wish','Deseo cumplido',2.4,{era:'S',cost:3,drain:.01,aura:0xff6a3a,auraOn:1}),F('limit','Más allá del límite',3.4,{era:'S',cost:5,drain:.02,hpDrain:.006,aura:0xff2a2a,auraOn:1,bolt:1,scale:[1.4,1.2,1.4]})]});
['raditz','nappa','ginyu','goten','zamasuk','gohanks','granolah','gas'].forEach(id=>{const c=CHARS.find(x=>x.id===id);c.voice=150;});

/* ---- Fusiones válidas: solo estas parejas pueden fusionarse en una pelea por equipos ---- */
const FUSIONS=[
 {a:'goku',b:'vegeta',r:'gogeta',how:'¡Danza de la Fusión!',by:'goku'},
 {a:'goku',b:'vegeta',r:'vegetto',how:'¡Pendientes Pothala!',by:'vegeta'},
 {a:'gohan',b:'trunks',r:'gohanks',how:'¡Danza de la Fusión!'},
 {a:'black',b:'zamasuk',r:'zamasu',how:'¡Pendientes Pothala!'},
 {a:'goten',b:'trunks',r:'gotenks',how:'¡Danza de la Fusión!'}];

/* ---- Jefes gigantes nuevos ---- */
const NEW_BOSSES=[
 {id:'oozaru',name:'Oozaru',desc:'El mono gigante de la luna llena. Pisotones que tiemblan el suelo, rayo por la boca y un rugido que paraliza. Pega fuerte pero es lento.',giant:3.1,speed:.6,pw:()=>gokuPow('ssj3')/1.2,hpK:1.15,moves:{melee:3,shock:3,beam:2,roar:1,ult:1},roar:'¡GROAAARGH!',
  ch:{id:'oozaru',name:'Oozaru',era:'Z',base:1,saiyan:1,hair:'none',hairColor:0x6a3a1a,extras:['apeMuzzle','apeEars','furTail'],head:[1.12,1.05,1.12],scale:[1.25,1.1,1.25],
   colors:{skin:0x8a5a34,top:0x6a3e20,sleeve:0x8a5a34,pants:0x6a3e20,belt:0x3a2a5a,boots:0x6a3e20,glove:0x8a5a34,wrist:0x8a5a34,ex1:0xd8a878,ex2:0x6a3e20,eye:0xff3030,pupil:0xff3030},
   s1:{name:'Rayo Bucal',type:'beam',color:0xff8a3a},ult:{name:'Galick Gun del Oozaru',type:'beam',color:0xd060ff},forms:[F('boss','Furia de la luna llena',1,{aura:0xffe080,auraOn:1})]}},
 {id:'hildegarn',name:'Hildegarn',desc:'El demonio de la flauta de Hoi. Gigantesco, con cola de látigo y una llamarada que arrasa todo. Su forma final es la más dura de los jefes.',giant:3.6,speed:.7,pw:()=>gokuPow('ssj4')*1.1,hpK:1.3,moves:{melee:2,shock:2,tail:3,ball:2,ult:1},roar:'¡HRRAAAAAH!',
  ch:{id:'hildegarn',ears:false,name:'Hildegarn',era:'Z',base:1,hair:'none',hairColor:0x2a1a3a,extras:['hornsBig','tail','hildCrest'],head:[1.1,1.15,1.15],scale:[1.3,1.2,1.3],
   colors:{skin:0x5a4a8a,top:0x3a2a6a,sleeve:0x5a4a8a,pants:0x3a2a6a,belt:0x2a1a3a,boots:0x2a1a3a,glove:0x5a4a8a,wrist:0xc8a040,ex1:0xe8d8b0,ex2:0xe8d8b0,eye:0xffe14d,pupil:0xff3a1a},
   s1:{name:'Llamarada Infernal',type:'ball',color:0xff6a2a},ult:{name:'Tormenta de Hildegarn',type:'ball',color:0xff3a1a},forms:[F('boss','Forma completa',1,{aura:0xb070ff,auraOn:1,bolt:1})]}}];

/* ---- Técnicas icónicas: 4 por personaje (ráfaga, rayo, cuerpo a cuerpo y definitiva) ----
   Las tres primeras van al botón Especial (E · 🌀), la definitiva al Definitivo (E+H · ☄️). "pow" es la fuerza base. */
const SIG_KIND={barrage:'RÁFAGA',beam:'RAYO',rush:'CUERPO A CUERPO',ult:'DEFINITIVA'};
const SIG=(who,list)=>list.map(([k,id,name,o])=>Object.assign({id,who:[who],kind:k,slot:k==='ult'?'ult':'s1',name},o));
const TECHS=[
 ...SIG('goku',[['barrage','gk_r','Ráfaga Kaio-ken',{type:'barrage',color:0xff6a5a,pow:170,price:160}],['beam','gk_b','Kamehameha Instantáneo',{type:'beam',color:0x5cc8ff,tele:1,pow:1700,price:220}],['rush','gk_c','Puño del Dragón',{type:'rush',color:0xffc83a,dragon:1,hits:7,pow:2300,price:280}],['ult','gk_u','Genkidama',{type:'ball',color:0x9fe0ff,size:5.5,spd:.7,ki:5,pow:4500,price:480}]]),
 ...SIG('vegeta',[['barrage','vg_r','Bombardeo Mortal',{type:'barrage',color:0xffe07a,pow:175,price:160}],['beam','vg_b','Galick Ho',{type:'beam',color:0xd060ff,pow:1750,price:220}],['rush','vg_c','Furia del Príncipe',{type:'rush',color:0x8fd0ff,hits:6,pow:2250,price:270}],['ult','vg_u','Final Flash',{type:'beam',color:0xfff35a,w:1.5,pow:4200,price:460}]]),
 ...SIG('gohan',[['barrage','gh_r','Lluvia de Masenko',{type:'barrage',color:0xfff08a,pow:165,price:150}],['beam','gh_b','Masenko',{type:'beam',color:0xffe35a,pow:1700,price:210}],['rush','gh_c','Ira Bestia',{type:'rush',color:0xe0d0ff,hits:7,pow:2400,price:290}],['ult','gh_u','Kamehameha Padre-Hijo',{type:'beam',color:0x6ad0ff,w:1.5,pow:4300,price:470}]]),
 ...SIG('trunks',[['barrage','tr_r','Ráfaga Buster',{type:'barrage',color:0xffd060,pow:160,price:150}],['beam','tr_b','Burning Attack',{type:'ball',color:0xffb03a,size:1.3,pow:1750,price:210}],['rush','tr_c','Shining Sword Attack',{type:'rush',color:0x8fe0ff,hits:6,pow:2300,price:270}],['ult','tr_u','Espada de la Esperanza',{type:'beam',color:0x8fffe8,w:1.6,pow:4100,price:450}]]),
 ...SIG('piccolo',[['barrage','pc_r','Hellzone Grenade',{type:'barrage',color:0xfff07a,pow:180,price:160}],['beam','pc_b','Makankosappo',{type:'beam',thin:1,color:0xfff07a,pow:2000,price:230}],['rush','pc_c','Golpes Namekianos',{type:'rush',color:0x9aff8a,hits:5,pow:2100,price:240}],['ult','pc_u','Granada de Luz',{type:'ball',color:0xfff07a,size:3.4,pow:3900,price:420}]]),
 ...SIG('krilin',[['barrage','kr_r','Lluvia de Kienzan',{type:'barrage',color:0xfff07a,pow:150,price:120}],['beam','kr_b','Kamehameha de Krilin',{type:'beam',color:0x5cc8ff,pow:1550,price:170}],['rush','kr_c','Taiyoken y Golpe',{type:'rush',color:0xffffff,hits:5,pow:1900,price:200}],['ult','kr_u','Kienzan Gigante',{type:'ball',color:0xfff07a,size:3,pow:3600,price:360}]]),
 ...SIG('gogeta',[['barrage','gg_r','Ráfaga Fusionada',{type:'barrage',color:0x9fe8ff,pow:190,price:200}],['beam','gg_b','Big Bang Kamehameha',{type:'beam',color:0x6fd8ff,w:1.2,pow:2300,price:280}],['rush','gg_c','Meteor Explosion',{type:'rush',color:0x8fe0ff,hits:8,pow:2700,price:320}],['ult','gg_u','Stardust Breaker',{type:'ball',color:0xf0c8ff,size:4.5,ki:5,pow:4800,price:520}]]),
 ...SIG('vegetto',[['barrage','vt_r','Ráfaga Final',{type:'barrage',color:0x7fd0ff,pow:190,price:200}],['beam','vt_b','Big Bang Attack',{type:'ball',color:0x8fd0ff,size:1.5,pow:2250,price:270}],['rush','vt_c','Espada Espiritual',{type:'rush',color:0x9fe8ff,hits:6,pow:2600,price:310}],['ult','vt_u','Final Kamehameha',{type:'beam',color:0x7fd0ff,w:1.6,ki:5,pow:4800,price:520}]]),
 ...SIG('freezer',[['barrage','fr_r','Rayos Mortales',{type:'barrage',color:0xff6ad0,pow:170,price:150}],['beam','fr_b','Rayo Mortal',{type:'beam',thin:1,color:0xff5ab0,pow:1900,price:210}],['rush','fr_c','Furia Imperial',{type:'rush',color:0xd8a0ff,hits:5,pow:2200,price:250}],['ult','fr_u','Supernova',{type:'ball',color:0xffb03a,size:4.5,pow:4100,price:440}]]),
 ...SIG('cell',[['barrage','cl_r','Ráfaga Perfecta',{type:'barrage',color:0x9aff8a,pow:175,price:160}],['beam','cl_b','Kamehameha Perfecto',{type:'beam',color:0x5cc8ff,pow:1900,price:220}],['rush','cl_c','Combo Bioandroide',{type:'rush',color:0x7aff6a,hits:6,pow:2300,price:270}],['ult','cl_u','Kamehameha Solar',{type:'beam',color:0x8fe0ff,w:1.5,pow:4200,price:450}]]),
 ...SIG('broly',[['barrage','br_r','Lluvia de Meteoros',{type:'barrage',color:0x7aff6a,pow:185,price:180}],['beam','br_b','Eraser Cannon',{type:'ball',color:0x55ff66,size:1.6,pow:2200,price:250}],['rush','br_c','Gigantic Hammer',{type:'rush',color:0x7aff6a,hits:4,pow:2600,price:290}],['ult','br_u','Omega Blaster',{type:'ball',color:0x55ff66,size:5.5,spd:.75,pow:4600,price:490}]]),
 ...SIG('jiren',[['barrage','jr_r','Ráfaga de Poder',{type:'barrage',color:0xff6a5a,pow:190,price:190}],['beam','jr_b','Mirada del Poder',{type:'beam',color:0xff4a3a,pow:2200,price:260}],['rush','jr_c','Puño del Poder Absoluto',{type:'rush',color:0xff4a3a,hits:5,pow:2600,price:300}],['ult','jr_u','Impacto de Poder',{type:'ball',color:0xff2a2a,size:4.5,pow:4600,price:500}]]),
 ...SIG('black',[['barrage','bk_r','Lanzas Divinas',{type:'barrage',color:0xff6ad0,pow:175,price:160}],['beam','bk_b','Kamehameha Negro',{type:'beam',color:0xff55c0,pow:1900,price:220}],['rush','bk_c','Guadaña Divina',{type:'rush',color:0xff8ad8,hits:6,pow:2300,price:270}],['ult','bk_u','Kamehameha Rosé',{type:'beam',color:0xff55c0,w:1.5,pow:4200,price:450}]]),
 ...SIG('bills',[['barrage','bl_r','Esferas de Destrucción',{type:'barrage',color:0xb070ff,pow:200,price:200}],['beam','bl_b','Rayo Destructor',{type:'beam',color:0x9a3aff,pow:2300,price:270}],['rush','bl_c','Golpe del Dios de la Destrucción',{type:'rush',color:0xc090ff,hits:5,pow:2700,price:310}],['ult','bl_u','Hakai',{type:'ball',color:0x9a3aff,size:5,ki:5,pow:4800,price:520}]])];

/* ---- Outfits (solo visuales): por saga. paid = cosmético exclusivo de pago (PayPal); el resto con monedas ---- */
const OUTFITS=[
 {id:'gk_sai',who:'goku',saga:'Saga Saiyajin',name:'Gi de Kaiosama',price:180,colors:{top:0xff7a1a,pants:0xff7a1a,belt:0x1f4fd8,boots:0x1f4fd8,wrist:0x1f4fd8,sleeve:0x1f4fd8}},
 {id:'gk_yar',who:'goku',saga:'Saga de los Androides',name:'Traje de Yardrat',price:220,colors:{top:0xe8dcb8,sleeve:0xe8dcb8,pants:0x3a5aa8,belt:0x3a5aa8,boots:0x2a2a2a,wrist:0xe8dcb8}},
 {id:'gk_far',who:'goku',saga:'La batalla de los dioses',name:'Ropa de granjero',price:160,colors:{top:0xe8e0d0,sleeve:SKIN,pants:0x6a5a40,belt:0x3a2a1a,boots:0x3a2a1a,wrist:SKIN}},
 {id:'gk_pat',who:'goku',saga:'Saga de Moro',name:'Patrulla Galáctica',price:260,colors:{top:0x2a3040,sleeve:0x2a3040,pants:0x2a3040,belt:0xe8e8e8,boots:0xe8e8e8,glove:0x2a3040,wrist:0xe8e8e8}},
 {id:'gk_gold',who:'goku',saga:'Exclusivo',name:'Gi dorado de Whis',paid:1.99,colors:{top:0xffd23a,pants:0xffd23a,belt:0x6a2ad8,boots:0x6a2ad8,wrist:0x6a2ad8,sleeve:0x6a2ad8}},
 {id:'vg_sai',who:'vegeta',saga:'Saga Saiyajin',name:'Armadura Saiyajin clásica',price:180,colors:{top:0x24357f,ex1:0xf2f2f2,ex2:0x8a6a3a,boots:0xf2f2f2,glove:0xf2f2f2}},
 {id:'vg_bad',who:'vegeta',saga:'Saga de los Androides',name:'Camisa rosa «Badman»',price:200,colors:{top:0xff8ac0,sleeve:SKIN,pants:0xe8d060,belt:0xe8d060,boots:0x6a4a2a,glove:SKIN,wrist:SKIN,ex1:0xff8ac0,ex2:0xff8ac0}},
 {id:'vg_top',who:'vegeta',saga:'Torneo del Poder',name:'Traje del Universo 7',price:240,colors:{top:0x1a2a6a,sleeve:0x1a2a6a,pants:0x1a2a6a,ex1:0xf2f2f2,ex2:0xffd23a}},
 {id:'vg_king',who:'vegeta',saga:'Exclusivo',name:'Armadura del Rey Vegeta',paid:1.99,colors:{top:0x3a1a1a,sleeve:0x3a1a1a,pants:0x3a1a1a,ex1:0xc02a2a,ex2:0xe8c040,boots:0xe8c040,glove:0xe8c040}},
 {id:'gh_pic',who:'gohan',saga:'Saga Saiyajin',name:'Traje de Piccolo',price:180,colors:{top:0x5b2b8f,pants:0x5b2b8f,belt:0xd02020,boots:0x6b3d1f,wrist:0xd02020}},
 {id:'gh_sm',who:'gohan',saga:'Saga de Buu',name:'Gran Saiyaman',price:240,colors:{top:0x1a5a2a,sleeve:0x1a1a1a,pants:0x1a5a2a,belt:0xd02020,boots:0xf2f2f2,glove:0xf2f2f2,wrist:0xf2f2f2}},
 {id:'gh_cell',who:'gohan',saga:'Saga de Cell',name:'Armadura Saiyajin',price:220,colors:{top:0x1a2a6a,sleeve:0x1a2a6a,pants:0x1a2a6a,belt:0xf2f2f2,boots:0xf2f2f2,glove:0xf2f2f2}},
 {id:'tr_cc',who:'trunks',saga:'Saga de los Androides',name:'Chaqueta Cápsula Corp',price:200,colors:{top:0x2a2a3a,sleeve:0x2a2a3a,pants:0x3a3a4a,belt:0xe8c040,boots:0xe8c040}},
 {id:'tr_sup',who:'trunks',saga:'Saga de Trunks del futuro',name:'Abrigo de la resistencia',price:230,colors:{top:0x3a4a7a,sleeve:0x3a4a7a,pants:0x2a2a2a,belt:0xc02a2a,boots:0x8a5a2a}},
 {id:'pc_cape',who:'piccolo',saga:'Saga Saiyajin',name:'Capa y turbante blancos',price:180,colors:{top:0x6a2a9a,pants:0x6a2a9a,ex1:0xf2f2f2,ex2:0xf2f2f2}},
 {id:'pc_hero',who:'piccolo',saga:'Super Hero',name:'Traje de Super Hero',price:240,colors:{top:0x4a3a8a,pants:0x4a3a8a,belt:0xe0483a,boots:0x8a5a2a}},
 {id:'kr_pol',who:'krilin',saga:'Saga de Freezer resucitado',name:'Uniforme de policía',price:180,colors:{top:0x2a4a8a,sleeve:0x2a4a8a,pants:0x2a2a3a,belt:0x1a1a1a,boots:0x1a1a1a}},
 {id:'fr_mecha',who:'freezer',saga:'Saga de los Androides',name:'Mecha-Freezer',price:260,colors:{skin:0xb8c4d0,top:0x8a96a8,pants:0xb8c4d0,belt:0x8a96a8,boots:0x8a96a8,ex1:0x6a7a8a}},
 {id:'fr_army',who:'freezer',saga:'Saga de Freezer',name:'Armadura del Ejército',price:200,colors:{top:0x2a2a3a,ex1:0xf2f2f2,ex2:0xc8a040}},
 {id:'cl_jr',who:'cell',saga:'Saga de Cell',name:'Cell Junior',price:220,colors:{skin:0x5a8ad8,top:0x2a5ab8,sleeve:0x2a5ab8,pants:0x2a5ab8,glove:0x5a8ad8,boots:0x5a8ad8}},
 {id:'br_par',who:'broly',saga:'Dragon Ball Super: Broly',name:'Traje de Vampa',price:220,colors:{top:0x6a5a3a,sleeve:0x6a5a3a,pants:0x4a3a2a,ex1:0x8a7a5a,wrist:0x8a7a5a}},
 {id:'jr_red',who:'jiren',saga:'Torneo del Poder',name:'Pride Troopers negro',price:240,colors:{top:0x1a1a1a,sleeve:0x1a1a1a,pants:0x1a1a1a,belt:0xf2f2f2,boots:0xf2f2f2}},
 {id:'bk_rose',who:'black',saga:'Saga de Trunks del futuro',name:'Gi gris del Kaioshin',price:230,colors:{top:0x6a6a7a,sleeve:0x6a6a7a,pants:0x6a6a7a,belt:0xc02a6a}},
 {id:'bl_paj',who:'bills',saga:'La batalla de los dioses',name:'Pijama de la siesta',price:200,colors:{top:0x8ab0e0,pants:0x8ab0e0,belt:0xf2f2f2,ex1:0xf2f2f2}},
 {id:'bl_gold',who:'bills',saga:'Exclusivo',name:'Toga dorada del Hakai',paid:1.49,colors:{top:0xe8c040,pants:0xe8c040,ex1:0xffe88a,ex2:0x1a1a2a}}];
/* Cosméticos de pago (PayPal). Pon aquí tu Client ID de PayPal (https://developer.paypal.com) para activar el botón de compra. */
const PAYPAL={clientId:'',currency:'USD'};

/* ---- Diálogos de entrada entre rivales clásicos (se muestran al empezar la pelea; cualquier botón los salta) ---- */
const INTRO_DIALOGS={
 'goku|vegeta':[['vegeta','Kakaroto, hoy demostraré quién es el verdadero Saiyajin.'],['goku','¡Me alegra oír eso! Dame todo lo que tienes, Vegeta.']],
 'freezer|goku':[['freezer','El mono de Namek… esta vez no tendrás tanta suerte.'],['goku','Te di una oportunidad, Freezer. No habrá otra.']],
 'cell|gohan':[['cell','Muéstrame ese poder oculto, muchacho.'],['gohan','Lo vas a lamentar, Cell.']],
 'freezer|vegeta':[['vegeta','Ya no soy tu soldado, Freezer.'],['freezer','Siempre fuiste un mono malagradecido.']],
 'goku|jiren':[['jiren','La fuerza lo es todo. Lo demás sobra.'],['goku','Te equivocas. ¡Voy a demostrártelo!']],
 'black|trunks':[['trunks','¡Pagarás por mi mundo, Black!'],['black','Los mortales siempre se aferran a la esperanza.']],
 'bills|goku':[['bills','Si me aburres, destruyo el planeta.'],['goku','¡Entonces me esforzaré al máximo!']],
 'broly|goku':[['broly','¡KAKAROTOOO!'],['goku','Tranquilo, Broly. Peleemos limpio.']],
 'broly|vegeta':[['vegeta','Otro Saiyajin que se cree más fuerte que yo…'],['broly','…Pelea.']],
 'gohan|piccolo':[['piccolo','Veamos si sigues entrenando, Gohan.'],['gohan','¡Señor Piccolo, no me contendré!']],
 'buu|goku':[['buu','¡Buu te convertirá en chocolate!'],['goku','¡Prefiero las peleas a los dulces!']],
 'buu|vegeta':[['vegeta','Esta vez lo haré por mi familia.'],['buu','¡Ji, ji! Buu juega.']],
 'goku|hit':[['hit','Mi trabajo es terminar rápido.'],['goku','¡Detén el tiempo si quieres, te alcanzaré!']],
 'gogeta|broly':[['gogeta','Yo soy Gogeta. Y voy a acabar contigo.'],['broly','¡GRAAAH!']],
 'vegetto|zamasu':[['zamasu','Un mortal fusionado… qué blasfemia.'],['vegetto','Habla menos y pelea más, «dios».']],
 'goku|raditz':[['raditz','Kakaroto, tu misión era destruir este planeta.'],['goku','¡Mi nombre es Goku!']],
 'nappa|vegeta':[['nappa','¿Me dejas aplastarlo, Vegeta?'],['vegeta','Haz lo que quieras… pero no me hagas perder el tiempo.']],
 'goku|moro':[['moro','Tu energía será mía, Saiyajin.'],['goku','¡No dejaré que robes más planetas!']],
 'granolah|goku':[['granolah','Los Saiyajin destruyeron mi pueblo.'],['goku','No sabía nada de eso… pero no voy a huir.']],
 'gas|granolah':[['gas','El más fuerte del universo soy yo ahora.'],['granolah','Vas a pagar por lo que hicisteis.']],
 'cell|goku':[['cell','¡El torneo de Cell es tu tumba, Goku!'],['goku','Me lo he pasado muy bien preparándome.']],
 'goku|kefla':[['kefla','¡Te voy a hacer pedazos!'],['goku','¡Ese poder es increíble!']],
 'gamma1|piccolo':[['gamma1','Somos superhéroes. Tú eres el villano.'],['piccolo','Os han engañado, chatarra.']],
 'goten|trunks':[['goten','¡Trunks, juguemos a pelear!'],['trunks','¡Pero luego nos fusionamos!']],
 'ginyu|goku':[['ginyu','¡Fuerzas Especiales Ginyu! ¡Pose!'],['goku','…¿Tengo que esperar a que termines?']]};

/* ---- Desafíos (diarios y semanales): se eligen cada día/semana de esta lista ---- */
const CHAL_POOL=[
 {id:'w3',txt:'Gana 3 peleas',ev:'win',n:3,c:60},{id:'w5',txt:'Gana 5 peleas',ev:'win',n:5,c:90},
 {id:'u3',txt:'Lanza 3 definitivos',ev:'ult',n:3,c:50},{id:'t5',txt:'Transfórmate 5 veces',ev:'trans',n:5,c:50},
 {id:'cb10',txt:'Haz un combo de 10 golpes',ev:'combo',n:10,c:70,max:1},{id:'sv5',txt:'Llega a la oleada 5 de Supervivencia',ev:'surv',n:5,c:90,max:1},
 {id:'bs1',txt:'Derrota a un jefe gigante',ev:'boss',n:1,c:80},{id:'st2',txt:'Completa 2 capítulos del modo historia',ev:'story',n:2,c:90},
 {id:'hd1',txt:'Gana en Extremo o Legendario',ev:'hard',n:1,c:90},{id:'fu1',txt:'Fusiónate en una pelea',ev:'fusion',n:1,c:70},
 {id:'ko8',txt:'Noquea a 8 rivales',ev:'ko',n:8,c:70},{id:'pf1',txt:'Gana una pelea sin bajar del 75 % de vida',ev:'perfect',n:1,c:90}];
const CHAL_WEEK=[
 {id:'W20',txt:'Gana 20 peleas esta semana',ev:'win',n:20,c:300},{id:'Wst',txt:'Completa 6 capítulos del modo historia',ev:'story',n:6,c:320},
 {id:'Wsv',txt:'Llega a la oleada 10 de Supervivencia',ev:'surv',n:10,c:350,max:1},{id:'Wbs',txt:'Derrota a 4 jefes gigantes',ev:'boss',n:4,c:300},
 {id:'Wul',txt:'Lanza 20 definitivos',ev:'ult',n:20,c:260},{id:'Wlg',txt:'Gana 3 peleas en Legendario',ev:'legend',n:3,c:400},{id:'Wko',txt:'Noquea a 40 rivales',ev:'ko',n:40,c:280}];

/* ---- Logros y títulos (cada logro da un título que se puede mostrar en el perfil) ---- */
const ACHS=[
 {id:'a_win1',name:'Primer combate',desc:'Gana tu primera pelea.',title:'Aprendiz de la Tortuga',st:'win',n:1},
 {id:'a_win25',name:'Guerrero en ascenso',desc:'Gana 25 peleas.',title:'Guerrero Z',st:'win',n:25},
 {id:'a_win100',name:'Cien victorias',desc:'Gana 100 peleas.',title:'Orgullo Saiyajin',st:'win',n:100},
 {id:'a_ko50',name:'Imparable',desc:'Noquea a 50 rivales.',title:'Destructor',st:'ko',n:50},
 {id:'a_ult25',name:'Rayo tras rayo',desc:'Lanza 25 definitivos.',title:'Maestro del ki',st:'ult',n:25},
 {id:'a_combo20',name:'Combo legendario',desc:'Encadena un combo de 20 golpes.',title:'Puños de acero',st:'combo',n:20,max:1},
 {id:'a_trans50',name:'Mil formas',desc:'Transfórmate 50 veces.',title:'Más allá del límite',st:'trans',n:50},
 {id:'a_ui',name:'Instinto Superior',desc:'Alcanza el Ultra Instinto dominado.',title:'Ángel de combate',st:'ui',n:1},
 {id:'a_boss5',name:'Cazagigantes',desc:'Derrota a 5 jefes gigantes.',title:'Cazagigantes',st:'boss',n:5},
 {id:'a_surv10',name:'Superviviente',desc:'Llega a la oleada 10 de Supervivencia.',title:'Superviviente',st:'surv',n:10,max:1},
 {id:'a_surv20',name:'Ejército de uno',desc:'Llega a la oleada 20 de Supervivencia.',title:'Ejército de uno',st:'surv',n:20,max:1},
 {id:'a_legend',name:'Leyenda',desc:'Gana una pelea en Legendario.',title:'Leyenda viviente',st:'legend',n:1},
 {id:'a_fusion',name:'Uno solo',desc:'Fusiónate en una pelea.',title:'Fusionado',st:'fusion',n:1},
 {id:'a_perfect',name:'Intocable',desc:'Gana sin bajar del 75 % de vida.',title:'Intocable',st:'perfect',n:1},
 {id:'a_sai',name:'Llegan los Saiyajin',desc:'Termina el arco Saiyajin.',title:'Rival de Vegeta',arc:'sai'},
 {id:'a_nam',name:'Leyenda de Namek',desc:'Termina el arco de Freezer.',title:'Super Saiyajin legendario',arc:'nam'},
 {id:'a_cel',name:'Juegos de Cell',desc:'Termina el arco de Cell.',title:'Héroe del torneo de Cell',arc:'cel'},
 {id:'a_buu',name:'Adiós, Buu',desc:'Termina el arco de Buu.',title:'Salvador de la Tierra',arc:'buu'},
 {id:'a_tp',name:'Universo 7',desc:'Termina el arco del Torneo del Poder.',title:'Guerrero del Universo 7',arc:'tp'},
 {id:'a_story',name:'Junto a Goku',desc:'Termina todo el modo historia.',title:'Junto a Goku',arc:'*'},
 {id:'a_stars',name:'Perfeccionista',desc:'Consigue 60 estrellas en el modo historia.',title:'Perfeccionista',st:'stars',n:60,max:1},
 {id:'a_whatif',name:'Viajero del tiempo',desc:'Termina todas las historias «¿Qué pasaría si…?».',title:'Viajero del tiempo',wi:'*'},
 {id:'a_db',name:'Shenlong, ¡aparece!',desc:'Junta las 7 Esferas del Dragón.',title:'Elegido de Shenlong',st:'wish',n:1},
 {id:'a_chal10',name:'Siempre a punto',desc:'Completa 10 desafíos.',title:'Disciplinado',st:'chal',n:10},
 {id:'a_rich',name:'Ahorrador',desc:'Gana 10 000 monedas en total.',title:'Millonario de la Corporación Cápsula',st:'earned',n:10000,max:1},
 {id:'a_tech8',name:'Técnicas maestras',desc:'Compra 8 técnicas icónicas.',title:'Discípulo de Whis',st:'sigs',n:8,max:1},
 {id:'a_outfit5',name:'A la moda',desc:'Compra 5 outfits.',title:'Bulma aprueba',st:'outfits',n:5,max:1},
 {id:'a_unlock',name:'Equipo completo',desc:'Desbloquea a todos los luchadores del modo historia.',title:'Reclutador',st:'unl',n:8,max:1},
 {id:'a_duo',name:'Mano a mano',desc:'Juega una pelea de 2 jugadores en el mismo celular.',title:'Compañero de sofá',st:'duo',n:1},
 {id:'a_photo',name:'Fotógrafo',desc:'Guarda una foto en el modo foto.',title:'Reportero de la Tierra',st:'photo',n:1}];

/* ---- Deseos de Shenlong (al juntar las 7 Esferas del Dragón) ---- */
const WISHES=[
 {id:'coins',name:'Quiero ser rico',desc:'+2500 monedas.'},
 {id:'char',name:'Revivir a un guerrero',desc:'Desbloquea al siguiente luchador del modo historia que aún no tengas.'},
 {id:'outfit',name:'Un traje digno de un dios',desc:'Te regala el outfit de monedas más caro que no tengas.'},
 {id:'forms',name:'Despertar mi poder',desc:'Desbloquea todas las formas de un luchador al azar que aún no tengas.'}];

/* ---- Modo historia «Junto a Goku»: índice de arcos (los capítulos se descargan aparte: story/<id>.js) ---- */
const ARCS=[
 {id:'sai',n:1,name:'Saga Saiyajin',color:'#ff8a1e',file:'story/sai.js'},
 {id:'nam',n:2,name:'Saga de Freezer',color:'#7aff6a',file:'story/nam.js'},
 {id:'cel',n:3,name:'Androides y Cell',color:'#9aff8a',file:'story/cel.js'},
 {id:'buu',n:4,name:'Saga de Majin Buu',color:'#ff8ad8',file:'story/buu.js'},
 {id:'god',n:5,name:'Dioses y la resurrección de Freezer',color:'#b070ff',file:'story/god.js'},
 {id:'tr',n:6,name:'Universo 6 y Trunks del futuro',color:'#8fe0ff',file:'story/tr.js'},
 {id:'tp',n:7,name:'Torneo del Poder',color:'#ff5a4a',file:'story/tp.js'},
 {id:'bro',n:8,name:'Broly',color:'#55ff66',file:'story/bro.js'},
 {id:'mor',n:9,name:'Saga de Moro',color:'#c0a0ff',file:'story/mor.js'},
 {id:'gr',n:10,name:'Granolah y Black Freezer',color:'#2a2830',file:'story/gr.js'}];
const WHATIF_FILE='story/whatif.js';
/* Esferas del Dragón: siete escondites del modo historia (capítulo donde está y pista) */
const DRAGONBALLS=[
 {n:1,arc:'sai',node:'db1',hint:'Entre las rocas del yermo donde aterrizó la nave Saiyajin.'},
 {n:2,arc:'nam',node:'db2',hint:'En un pueblo namekiano abandonado.'},
 {n:3,arc:'cel',node:'db3',hint:'Cerca de la isla donde despertaron los androides.'},
 {n:4,arc:'buu',node:'db4',hint:'En los restos de la nave de Babidi.'},
 {n:5,arc:'tr',node:'db5',hint:'En la Tierra en ruinas del futuro de Trunks.'},
 {n:6,arc:'tp',node:'db6',hint:'Tras la estatua del Gran Sacerdote.'},
 {n:7,arc:'mor',node:'db7',hint:'En el planeta prisión de la Patrulla Galáctica.'}];
const WHATIF_N=4;
