/* Kaioken Clash · Modo historia · Arco 5: Dioses y la resurrección de Freezer (datos) */
KC_STORY({id:'god',name:'Dioses y la resurrección de Freezer',nodes:[
{id:'god0',t:'cine',name:'El dios de la destrucción despierta',place:'Planeta de Bills',cine:{id:'c_god0',title:'Un sueño profético',world:'bills',cast:[{c:'bills',x:2,z:0},{c:'whis',x:-2,z:1}],shots:[
 {who:'bills',say:'He soñado con un rival: el Super Saiyajin Dios. Quiero conocerlo.',cam:'close'},
 {who:'whis',say:'Han pasado treinta y nueve años, señor Bills. Tendrá hambre.',cam:'two'},
 {who:'nar',say:'Bills viaja a la Tierra y derrota a todos con un solo dedo.',cam:'wide',fx:'shake'}]}},
{id:'god0b',t:'cine',name:'El ritual del Dios Saiyajin',place:'Corporación Cápsula',cine:{id:'c_god0b',title:'Seis Saiyajin de corazón puro',world:7,cast:[{c:'goku',x:0,z:0},{c:'vegeta',x:-3,z:1},{c:'gohan',x:3,z:1},{c:'goten',x:-2,z:3},{c:'trunks',x:2,z:3}],shots:[
 {who:'nar',say:'Shenlong revela el secreto: cinco Saiyajin de corazón puro transmiten su poder a un sexto.',cam:'wide'},
 {who:'vegeta',say:'Solo esta vez, Kakaroto. No te acostumbres.',cam:'close'},
 {who:'goku',say:'Lo noto… un calor tranquilo, como una llama.',cam:'close',form:'ssg',fx:'flash'}]}},
{id:'god1',t:'fight',name:'El Super Saiyajin Dios',place:'En el cielo de la Tierra',world:7,boss:'bills',bossPow:3.6e10,bossHp:.6,
 p:{c:'goku',f:'ssg',base:3e6,forms:['ssg']},
 goal:{type:'survive',t:90},stars:[{type:'hp',v:.3,txt:'Resiste con más del 30 % de vida'},{type:'ult',txt:'Lanza un definitivo'}],coins:240,
 pre:[['bills','Un dios con forma de Saiyajin… Interesante. Diviérteme.'],['goku','¡Por fin un rival de verdad!']],
 cine:{id:'c_god1',title:'Hasta la próxima',world:7,cast:[{c:'goku',x:-2,z:0},{c:'bills',x:2,z:0}],shots:[
  {who:'bills',say:'Has absorbido el poder de dios. Te dejaré vivir… y a la Tierra también.',cam:'two'},
  {who:'goku',say:'¡La próxima vez te ganaré!',cam:'close',pose:'victory'}]}},
{id:'god1b',t:'fight',name:'Entrenamiento con Whis',place:'Planeta de Bills',world:'bills',
 p:{c:'vegeta',f:'ssg',base:2.6e6,forms:['ssg','ssb']},e:{c:'goku',f:'ssg',base:3e6,hp:1.2,forms:['ssg','ssb']},
 goal:{type:'win'},stars:[{type:'time',v:120,txt:'Gana en menos de 120 s'},{type:'combo',v:10,txt:'Haz un combo de 10 golpes'}],coins:220,
 pre:[['vegeta','Whis dice que entrene contigo. No me hagas perder el tiempo.'],['goku','¡Venga, Vegeta! ¡Con todo!']]},
{id:'god2',t:'cine',name:'Resurrección',place:'Espacio',cine:{id:'c_god2',title:'Resurrección',world:0,cast:[{c:'freezer',x:0,z:0,f:'f100'}],shots:[
 {who:'nar',say:'Los restos del ejército de Freezer reúnen las Esferas del Dragón.',cam:'wide'},
 {who:'freezer',say:'He vuelto. Y esta vez he entrenado. Que el Saiyajin tiemble.',cam:'close',form:'golden'}]}},
{id:'god3',t:'fight',name:'Golden Freezer',place:'Yermo',world:0,
 p:{c:'goku',f:'ssb',base:3e6,forms:['ssb']},e:{c:'freezer',f:'golden',base:5.3e5,hp:1.5,forms:['golden']},
 goal:{type:'win'},stars:[{type:'time',v:130,txt:'Gana en menos de 130 s'},{type:'hp',v:.5,txt:'Termina con más del 50 % de vida'}],coins:250,
 pre:[['freezer','Es mi forma dorada. Hermosa, ¿verdad?'],['goku','Yo también tengo una nueva: el Super Saiyajin Blue.']]},
{id:'god4',t:'fight',name:'Vegeta contra Freezer',place:'Yermo',world:0,v:1,
 p:{c:'vegeta',f:'ssb',base:2.6e6,forms:['ssb']},e:{c:'freezer',f:'golden',base:5.3e5,hp:1.3,forms:['golden']},
 goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'},{type:'noTrans',txt:'Gana sin transformarte'}],coins:250,
 pre:[['vegeta','Tengo una deuda pendiente contigo, Freezer.']]},
{id:'god5',t:'cine',name:'Whis rebobina el tiempo',place:'La Tierra',cine:{id:'c_god5',title:'Tres minutos atrás',world:0,cast:[{c:'whis',x:0,z:0},{c:'goku',x:-3,z:0}],shots:[
 {who:'nar',say:'Freezer destruye la Tierra en un último ataque desesperado.',cam:'wide',fx:'flash'},
 {who:'whis',say:'Puedo retroceder el tiempo tres minutos. Esta vez no te distraigas, Goku.',cam:'close'},
 {who:'goku',say:'Gracias, Whis. No volverá a pasar.',cam:'two'}]}}]});
