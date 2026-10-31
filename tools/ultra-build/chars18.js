/* ---------------- Versión Ultra: nuevos luchadores, voces, técnicas y la forma final de Goku ---------------- */
/* Alturas canónicas (Goku = 1): Freezer final es bajito, Piccolo y Cell altos… */
{const HEIGHT={vegeta:.94,trunks:.97,piccolo:1.2,gotenks:.92,gogeta:1.03,vegetto:1.03,a17:.98,freezer:.86,cooler:1.05,cell:1.14,black:1,zamasu:1.01,bills:.96};
 CHARS.forEach(c=>{if(HEIGHT[c.id])c.h=HEIGHT[c.id];});
 /* todas las fases 4 tienen cola de pelaje rojo */
 CHARS.forEach(c=>c.forms.forEach(f=>{if(f.id==='ssj4')f.extras=(f.extras&&f.extras.length?f.extras:(c.extras||[]).filter(e=>e!=='armor'&&e!=='fusionVest')).concat('furTail');}));
 /* Bills: cola de gato, joyas de oro y complexión delgada */
 const bl=CHARS.find(c=>c.id==='bills');bl.extras=['catEars','collar','catTail','egyptGold','earrings'];bl.build={chest:.84,upper:.8,fore:.8,hand:.9};bl.colors.ex2=0x24242e;}
/* tamaño de Cell Max (su forma gigante × su escala de cuerpo): el Gigante de Luz mide exactamente lo mismo */
const CELLMAX_G=(()=>{const f=CHARS.find(c=>c.id==='cell').forms.find(x=>x.id==='max');return f.giant*f.scale[1]*(CHARS.find(c=>c.id==='cell').h||1);})();
{const goku=CHARS[0];goku.colors.inner=0x1f4fd8;goku.emblem='悟';
 /* Gigante de Luz (manga, contra Moro): avatar de aura celeste translúcido con Goku Ultra Instinto dentro. Poder 1,15 B */
 goku.forms.push(F('giant','Gigante de Luz',1.15e12/3e6,{era:'S',cost:7,lightGiant:1,giant:CELLMAX_G,ui:.6,hairColor:0xe8eef8,aura:0x8fe8ff,pupil:0xc8d0e0,auraOn:1}));
 CHARS.find(c=>c.id==='gohan').colors.inner=0x2a3a8a;
 /* Piccolo como su figura de Super Hero: faja roja, manchas namekianas en los brazos */
 const pic=CHARS.find(c=>c.id==='piccolo');pic.extras=['antennae','ears','namekPatches'];Object.assign(pic.colors,{belt:0xe0483a,wrist:0xd03a30,ex1:0xe8a07a,boots:0x8a5a2a});}
CHARS.push(
/* Kefla: Base ≈ Goku base potenciado, SSJ ≈ Goku SSB, SSJ2 pierde por bastante contra el Ultra Instinto (señal) */
{id:'kefla',name:'Kefla',era:'S',base:8e8,saiyan:1,fem:1,hair:'kefla',hairColor:0x161616,extras:['earrings'],
 colors:{skin:SKIN,top:0x1e8a6a,inner:SKIN,pants:0x6a2a7a,belt:0xff4a6a,boots:0x2a2a30,wrist:0xff4a6a,ex1:0xf2e14a},
 s1:{name:'Rayo Gigante',type:'beam',color:0x7aff9a},s2:{name:'Ráfaga Kefla',type:'barrage',color:0x9affb8},ult:{name:'Explosión Kefla',type:'ball',color:0x9affb8},
 forms:[F('base','Base',1,{era:'S'}),F('ssj','Super Saiyajin',50,{era:'S',cost:1,drain:.006,hairColor:GOLD,aura:0xffd23a,pupil:0x1fa39a}),
  F('ssj2','Super Saiyajin 2',100,{era:'S',cost:3,drain:.012,hairColor:GOLD,aura:0xffd23a,pupil:0x1fa39a,bolt:1})]},
/* Gamma 1 y Gamma 2 (Super Hero): uniforme amarillo con botones plateados, número en el pecho, cinturón con la R, pistolera, botas altas y capa */
{id:'gamma1',name:'Gamma 1',era:'S',base:2.5e11,android:1,h:1.06,slimPants:1,hair:'none',hairColor:0x161618,extras:['gammaHead1','gammaCoat','tallBoots','cape'],chestNum:{t:'1',c:'#d8201e'},
 colors:{skin:0xdcdfe4,top:0xf0b418,inner:0xf0b418,sleeve:0xf0b418,pants:0xf0b418,belt:0x2a2a30,boots:0x4a4a56,glove:0x3a3a46,wrist:0xf0b418,ex1:0xe8eaee,ex2:0xc81e1e,eye:0xffd23a,pupil:0x111111},
 s1:{name:'Gamma Blaster',type:'beam',color:0xff5050},s2:{name:'Ráfaga Gamma',type:'barrage',color:0xff8080},ult:{name:'Ráfaga Gamma Máxima',type:'ball',color:0xff6a3a},
 forms:[F('base','Modo de combate',1,{era:'S',aura:0xff6a6a})]},
{id:'gamma2',name:'Gamma 2',era:'S',base:2.5e11,android:1,h:1.06,slimPants:1,hair:'none',hairColor:0x161618,extras:['gammaHead2','gammaCoat','tallBoots','cape'],chestNum:{t:'2',c:'#2a5ad8'},
 colors:{skin:0xdcdfe4,top:0xf0b418,inner:0xf0b418,sleeve:0xf0b418,pants:0xf0b418,belt:0x2a2a30,boots:0x4a4a56,glove:0x3a3a46,wrist:0xf0b418,ex1:0xe8eaee,ex2:0x2a5ad8,eye:0xffd23a,pupil:0x111111},
 s1:{name:'Lanza Gamma',type:'beam',thin:1,color:0x6aa0ff},s2:{name:'Ráfaga Gamma',type:'barrage',color:0x8ab0ff},ult:{name:'Gamma Burst Flash',type:'beam',color:0x5a8aff},
 forms:[F('base','Modo de combate',1,{era:'S',aura:0x7aa8ff})]},
/* Moro (manga): débil físicamente al principio y con poca vida; su magia absorbe la energía del rival */
{id:'moro',ears:false,name:'Moro',era:'S',h:.92,base:1.5e10,moro:1,hair:'none',hairColor:0xf2f2f2,extras:['ramHorns','beard','robe'],
 colors:{skin:0x9a9aa8,top:0x1e2a4a,sleeve:0x1e2a4a,pants:0x1e2a4a,belt:0xc8a040,boots:0x2a2018,glove:0x9a9aa8,wrist:0xc8a040,ex1:0xe8e2d0,ex2:0x1e2a4a,eye:0xffe14d,pupil:0x111111},
 s1:{name:'Absorción de energía',type:'absorb',color:0x9aff6a},s2:{name:'Ráfaga mágica',type:'barrage',color:0xc0a0ff},ult:{name:'Lluvia de Meteoros',type:'ball',color:0xc87a3a},
 forms:[F('old','Moro anciano (debilitado)',1,{era:'S',hpMax:.45,slump:.35,aura:0x8a7ab0}),
  F('young','Moro joven (deseo cumplido)',12,{era:'S',cost:2,hpMax:.7,aura:0x6a5aff,auraOn:1,scale:[1.08,1.06,1.08],colors:{skin:0xa8a8b8},extras:['ramHornsBig','beardShort','robe']}),
  F('planets','Moro tras devorar planetas',30,{era:'S',cost:4,hpMax:.9,aura:0x7a3aff,auraOn:1,bolt:1,scale:[1.12,1.08,1.12],extras:['ramHornsBig','beardShort','robe']}),
  F('s73','Moro + Siete-Tres',36.7,{era:'S',cost:5,hpMax:1,aura:0x3a6aff,auraOn:1,bolt:1,scale:[1.15,1.1,1.15],colors:{skin:0x8a98b8},extras:['ramHornsBig','beardShort','robe']}),
  F('merus','Moro con el poder de Merus',40,{era:'S',cost:6,hpMax:1,ui:.35,collapse:1,hpDrain:.006,aura:0xdde6ff,auraOn:1,pupil:0xe0e8ff,scale:[1.15,1.1,1.15],colors:{skin:0x8a98b8,eye:0xe8f0ff},extras:['ramHornsBig','beardShort','robe']}),
  F('earth','Moro terrestre (fusionado con la Tierra)',53.3,{era:'S',cost:7,hpMax:1.4,giant:3,aura:0x9a6a3a,auraOn:1,colors:{skin:0x6a5a48,top:0x4a3a2a,sleeve:0x6a5a48,pants:0x4a3a2a,glove:0x6a5a48},extras:['ramHornsBig','beardShort','gem','rocky']})]});
const VOICE={goku:165,vegeta:140,gohan:178,trunks:158,piccolo:110,krilin:185,gotenks:270,gogeta:148,vegetto:150,a17:160,a18:290,freezer:235,cooler:200,cell:128,buu:205,broly:92,jiren:88,hit:120,black:148,zamasu:160,bills:175,kefla:310,gamma1:150,gamma2:168,moro:98};
CHARS.forEach(c=>c.voice=VOICE[c.id]||150);
/* androides y bioandroides: no se cansan */
['a17','a18','gamma1','gamma2','cell'].forEach(id=>{const c=CHARS.find(x=>x.id===id);if(c)c.android=1;});
/* Whis: maestro del entrenamiento. Poder 50 B, esquiva como el Ultra Instinto dominado. No está en la tienda ni en la selección */
const WHIS={id:'whis',name:'Whis',era:'S',h:1.12,build:{chest:.86,upper:.82,fore:.82},base:5e13,voice:215,hair:'whis',hairColor:0xf2f4f8,extras:['halo','staff'],
 colors:{skin:0x8fb0e0,top:0x3a1022,sleeve:0x3a1022,pants:0x3a1022,belt:0xf0e8d8,boots:0x1a1a1a,glove:0x8fb0e0,wrist:0xe8c060,ex1:0xc8d0e0,ex2:0x7ad0ff,pupil:0x6a4ab0},
 s1:{name:'—',type:'beam',color:0xffffff},ult:{name:'—',type:'ball',color:0xffffff},forms:[F('angel','Ángel',1,{era:'S',ui:.6,aura:0xe8f4ff})]};
const WHIS_TIPS=['Tus golpes avisan antes de llegar. Relaja los hombros.','Si te cansas, respira: quédate quieto un momento y recuperarás el ritmo.','Encadena el combo de 5 sin parar y termina con el golpe fuerte.','No pienses en esquivar. Deja que el cuerpo se mueva solo.','Un buen guerrero carga ki cuando el rival está lejos.','Transfórmate cuando tengas ki de sobra, no cuando te falte.','Hacia atrás o de lado, la esquiva te salva. Hacia delante, te teletransportas.'];
const WHIS_QUIPS=['«Demasiado lento»','«Ho ho ho»','«Casi»','«Otra vez»','«Mejor»'];

/* ---------------- Técnicas de la tienda (Dragon Ball Super) ----------------
   Sustituyen al especial (E) o al definitivo (E+H) del luchador, con los mismos botones. "pow" es la fuerza base del ataque. */
const TECHS=[
 {id:'kdios',who:['goku'],slot:'s1',name:'Kamehameha Dios',type:'beam',color:0xff5a7a,pow:1750,price:140},
 {id:'kinst',who:['goku'],slot:'s1',name:'Kamehameha Instantáneo',type:'beam',color:0x5cc8ff,tele:1,pow:1650,price:180},
 {id:'dfist',who:['goku'],slot:'s1',name:'Puño del Dragón',type:'rush',color:0xffc83a,dragon:1,hits:7,pow:2300,price:260},
 {id:'kkblue',who:['goku'],slot:'ult',name:'Kamehameha Blue Kaio-ken x10',type:'beam',color:0x4a9aff,w:1.4,pow:3600,price:340},
 {id:'genki',who:['goku'],slot:'ult',name:'Genkidama Universal',type:'ball',color:0x9fe0ff,size:5.5,spd:.7,ki:5,pow:4400,price:450},
 {id:'kui',who:['goku'],slot:'ult',name:'Kamehameha del Ultra Instinto',type:'beam',color:0xdfe8ff,w:1.5,ki:5,pow:4800,price:520},
 {id:'galickd',who:['vegeta'],slot:'s1',name:'Galick Gun Dios',type:'beam',color:0xd060ff,pow:1750,price:140},
 {id:'bbblue',who:['vegeta'],slot:'s1',name:'Big Bang Attack Blue',type:'ball',color:0x6ad0ff,size:1.3,pow:1800,price:160},
 {id:'ffblue',who:['vegeta'],slot:'ult',name:'Final Flash Blue',type:'beam',color:0x8fe0ff,w:1.4,pow:3600,price:340},
 {id:'hakai',who:['vegeta'],slot:'ult',name:'Hakai (Ultra Ego)',type:'ball',color:0x9a3aff,size:2.6,ki:5,pow:4500,price:480},
 {id:'mkbeast',who:['gohan'],slot:'s1',name:'Makankosappo Bestia',type:'beam',thin:1,color:0xffe27a,pow:2100,price:200},
 {id:'kbeast',who:['gohan'],slot:'ult',name:'Kamehameha Bestia',type:'beam',color:0xe0d0ff,w:1.4,pow:4200,price:420},
 {id:'shine',who:['trunks'],slot:'s1',name:'Shining Sword Attack',type:'rush',color:0x8fe0ff,hits:5,pow:1900,price:180},
 {id:'hope',who:['trunks'],slot:'ult',name:'Espada de la Esperanza',type:'beam',color:0x8fffe8,w:1.6,pow:3900,price:400},
 {id:'lgren',who:['piccolo'],slot:'s1',name:'Granada de Luz',type:'ball',color:0xfff07a,size:1.2,pow:1700,price:150},
 {id:'mkdef',who:['piccolo'],slot:'ult',name:'Makankosappo Definitivo',type:'beam',color:0xfff07a,w:.5,pow:3700,price:360},
 {id:'kamikz',who:['gotenks'],slot:'ult',name:'Ataque Kamikaze Gigante',type:'ball',color:0xeaf6ff,size:3,pow:3200,price:260},
 {id:'ssword',who:['vegetto'],slot:'s1',name:'Espada Espiritual',type:'rush',color:0x9fe8ff,hits:6,pow:2300,price:240},
 {id:'fkblue',who:['vegetto'],slot:'ult',name:'Final Kamehameha Blue',type:'beam',color:0x7fd0ff,w:1.5,pow:4300,price:440},
 {id:'sdust',who:['gogeta'],slot:'s1',name:'Stardust Breaker',type:'ball',color:0xf0c8ff,size:1.6,pow:2400,price:260},
 {id:'meteor',who:['gogeta'],slot:'s1',name:'Meteor Explosion',type:'rush',color:0x8fe0ff,hits:8,pow:2600,price:300},
 {id:'ultk',who:['gogeta'],slot:'ult',name:'Kamehameha Definitivo',type:'beam',color:0x6fd8ff,w:1.6,ki:5,pow:4700,price:500},
 {id:'gdbeam',who:['freezer'],slot:'s1',name:'Rayo Mortal Dorado',type:'beam',thin:1,color:0xffd84a,pow:1900,price:170},
 {id:'snova',who:['freezer'],slot:'ult',name:'Supernova Dorada',type:'ball',color:0xffb03a,size:4.5,pow:3900,price:400},
 {id:'kperf',who:['cell'],slot:'ult',name:'Kamehameha Perfecto',type:'beam',color:0x5cc8ff,w:1.3,pow:3200,price:280},
 {id:'gaxe',who:['broly'],slot:'s1',name:'Embestida Gigante',type:'rush',color:0x7aff6a,hits:4,pow:2200,price:210},
 {id:'groar',who:['broly'],slot:'ult',name:'Rugido Gigante',type:'beam',color:0x55ff66,w:1.8,pow:4300,price:430},
 {id:'jfist',who:['jiren'],slot:'s1',name:'Puño del Poder Absoluto',type:'rush',color:0xff4a3a,hits:5,pow:2400,price:240},
 {id:'jstorm',who:['jiren'],slot:'ult',name:'Impacto de Poder Infinito',type:'ball',color:0xff2a2a,size:4,pow:4400,price:450},
 {id:'holyw',who:['black'],slot:'s1',name:'Ira Divina',type:'beam',color:0xff6ad0,pow:1900,price:180},
 {id:'rosek',who:['black'],slot:'ult',name:'Kamehameha Rosé',type:'beam',color:0xff55c0,w:1.4,pow:3700,price:360},
 {id:'kblast',who:['kefla'],slot:'s1',name:'Ráfaga Kefla Máxima',type:'barrage',color:0x9affb8,pow:185,price:140},
 {id:'kgig',who:['kefla'],slot:'ult',name:'Rayo Gigante Máximo',type:'beam',color:0x7aff9a,w:1.4,pow:3700,price:360},
 {id:'gbfd',who:['gamma1','gamma2'],slot:'ult',name:'Gamma Burst Flash Doble',type:'beam',color:0xff6a3a,w:1.5,pow:3800,price:380},
 {id:'planet',who:['moro'],slot:'ult',name:'Explosión Planetaria',type:'ball',color:0xc87a3a,size:5,pow:4200,price:420},
 {id:'kienz',who:['krilin'],slot:'s1',name:'Kienzan Doble',type:'ball',color:0xfff07a,size:1.1,pow:1700,price:140},
 {id:'a17bar',who:['a17'],slot:'ult',name:'Barrera Definitiva',type:'ball',color:0x7fe8ff,size:3.5,pow:3600,price:340},
 {id:'a18disc',who:['a18'],slot:'s1',name:'Disco de Energía Doble',type:'ball',color:0xfff07a,pow:1650,price:140},
 {id:'csnova',who:['cooler'],slot:'ult',name:'Supernova de Cooler',type:'ball',color:0xff3a8a,size:4.5,pow:3700,price:360},
 {id:'cmax',who:['cell'],slot:'s1',name:'Rayo de Cell Max',type:'beam',color:0xff6a2a,w:.8,pow:2000,price:200},
 {id:'hitk',who:['hit'],slot:'s1',name:'Golpe Mortal Temporal',type:'rush',color:0xc8a0ff,hits:4,pow:2300,price:230},
 {id:'zjud',who:['zamasu'],slot:'ult',name:'Luz del Juicio Divino',type:'beam',color:0xffb0e8,w:1.5,pow:3900,price:400},
 {id:'bhakai',who:['bills'],slot:'ult',name:'Esfera de Destrucción Suprema',type:'ball',color:0x9a3aff,size:5,ki:5,pow:4500,price:470}];
const TYPE_LABEL={beam:'rayo',ball:'esfera',barrage:'ráfaga',rush:'golpes',absorb:'absorción'};
function techStars(t){const p=t.type==='barrage'?t.pow*9:t.pow,k=t.slot==='ult'?(p-2600)/450:(p-1300)/280,n=clamp(Math.round(k),1,5);return'★'.repeat(n)+'☆'.repeat(5-n);}
