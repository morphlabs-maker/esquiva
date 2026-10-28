/* Kaioken Clash · Modo historia · Arco 5: Dioses y la resurrección de Freezer (datos) */
KC_STORY({id:'god',name:'Dioses y la resurrección de Freezer',map:{c1:'#b090ff',c2:'#4a7a3a',deco:[['🍄',14,30,26],['🪐',40,24,26],['🍜',30,80,20],['🌋',68,72,24],['👑',86,30,24]]},nodes:[
{id:'god0',t:'cine',name:'El dios de la destrucción despierta',place:'Planeta de Bills',x:8,y:58,cine:{id:'c_god0',title:'Un sueño profético',world:'bills',cast:[{c:'bills',x:2,z:0},{c:'whis',x:-2,z:1}],shots:[
 {who:'bills',say:'He soñado con un rival: el Super Saiyajin Dios. Quiero conocerlo.',cam:'close'},
 {who:'nar',say:'Bills viaja a la Tierra y derrota a todos con un solo dedo.',cam:'wide',fx:'shake'}]}},
{id:'god1',t:'fight',name:'El Super Saiyajin Dios',place:'Planeta de Bills',x:24,y:40,world:'bills',boss:'bills',bossPow:3.6e10,bossHp:.6,
 p:{c:'goku',f:'ssg',base:3e6,forms:['ssg']},
 goal:{type:'survive',t:90},stars:[{type:'hp',v:.3,txt:'Resiste con más del 30 % de vida'},{type:'ult',txt:'Lanza un definitivo'}],coins:240,
 pre:[['bills','Un dios con forma de Saiyajin… Interesante. Diviérteme.'],['goku','¡Por fin un rival de verdad!']],
 cine:{id:'c_god1',title:'Hasta la próxima',world:'bills',cast:[{c:'goku',x:-2,z:0},{c:'bills',x:2,z:0}],shots:[
  {who:'bills',say:'Has absorbido el poder de dios. Te dejaré vivir… y a la Tierra también.',cam:'two'},
  {who:'goku',say:'¡La próxima vez te ganaré!',cam:'close',pose:'victory'}]}},
{id:'god2',t:'cine',name:'Resurrección',place:'Espacio',x:40,y:72,cine:{id:'c_god2',title:'Resurrección',world:0,cast:[{c:'freezer',x:0,z:0,f:'f100'}],shots:[
 {who:'nar',say:'Los restos del ejército de Freezer reúnen las Esferas del Dragón.',cam:'wide'},
 {who:'freezer',say:'He vuelto. Y esta vez he entrenado. Que el Saiyajin tiemble.',cam:'close',form:'golden'}]}},
{id:'god3',t:'fight',name:'Golden Freezer',place:'Yermo',x:60,y:40,world:0,
 p:{c:'goku',f:'ssb',base:3e6,forms:['ssb']},e:{c:'freezer',f:'golden',base:5.3e5,hp:1.5,forms:['golden']},
 goal:{type:'win'},stars:[{type:'time',v:130,txt:'Gana en menos de 130 s'},{type:'hp',v:.5,txt:'Termina con más del 50 % de vida'}],coins:250,
 pre:[['freezer','Es mi forma dorada. Hermosa, ¿verdad?'],['goku','Yo también tengo una nueva: el Super Saiyajin Blue.']]},
{id:'god4',t:'fight',name:'Vegeta contra Freezer',place:'Yermo',x:76,y:58,world:0,v:1,
 p:{c:'vegeta',f:'ssb',base:2.6e6,forms:['ssb']},e:{c:'freezer',f:'golden',base:5.3e5,hp:1.3,forms:['golden']},
 goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'},{type:'noTrans',txt:'Gana sin transformarte'}],coins:250,
 pre:[['vegeta','Tengo una deuda pendiente contigo, Freezer.']]},
{id:'god5',t:'cine',name:'Whis rebobina el tiempo',place:'La Tierra',x:92,y:34,cine:{id:'c_god5',title:'Tres minutos atrás',world:0,cast:[{c:'whis',x:0,z:0},{c:'goku',x:-3,z:0}],shots:[
 {who:'nar',say:'Freezer destruye la Tierra en un último ataque desesperado.',cam:'wide',fx:'flash'},
 {who:'whis',say:'Puedo retroceder el tiempo tres minutos. Esta vez no te distraigas, Goku.',cam:'close'},
 {who:'goku',say:'Gracias, Whis. No volverá a pasar.',cam:'two'}]}}]});
