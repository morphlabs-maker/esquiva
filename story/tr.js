/* Kaioken Clash · Modo historia · Arco 6: Universo 6 y Trunks del futuro (datos) */
KC_STORY({id:'tr',name:'Universo 6 y Trunks del futuro',map:{c1:'#8fd0ff',c2:'#7a6a7a',deco:[['🏟',14,36,26],['🕳',38,20,22],['🏚',56,74,24],['💍',74,30,22],['🌌',90,62,26]]},nodes:[
{id:'tr0',t:'cine',name:'El torneo de los dos universos',place:'Planeta sin nombre',x:8,y:60,cine:{id:'c_tr0',title:'Universo 6 contra Universo 7',world:2,cast:[{c:'goku',x:-3,z:0},{c:'hit',x:3,z:0}],shots:[
 {who:'nar',say:'Champa, el hermano de Bills, organiza un torneo entre los universos 6 y 7.',cam:'wide'},
 {who:'hit',say:'Soy un asesino. Terminaré rápido.',cam:'close'},
 {who:'goku',say:'¡Eh! ¡Puedes detener el tiempo! ¡Esto será emocionante!',cam:'two'}]}},
{id:'tr1',t:'fight',name:'Goku contra Hit',place:'Ring del torneo',x:22,y:40,world:2,
 p:{c:'goku',f:'ssb',base:3e6,forms:['ssb','ssbkk']},e:{c:'hit',base:1.5e10,hp:1.4,forms:['base','skip','full']},
 goal:{type:'win'},stars:[{type:'time',v:140,txt:'Gana en menos de 140 s'},{type:'hp',v:.4,txt:'Termina con más del 40 % de vida'}],coins:260,
 pre:[['hit','Mi Salto del Tiempo dura medio segundo. Es suficiente.'],['goku','¡Entonces seré más rápido que medio segundo!']]},
{id:'tr2',t:'cine',name:'Un futuro sin esperanza',place:'La Tierra del futuro',x:38,y:70,cine:{id:'c_tr2',title:'Un futuro sin esperanza',world:0,v:1,cast:[{c:'trunks',x:-3,z:0},{c:'black',x:4,z:0}],shots:[
 {who:'trunks',say:'Ese hombre tiene la cara de Goku… pero lo está destruyendo todo.',cam:'close'},
 {who:'black',say:'Los mortales son un error. Yo lo corregiré.',cam:'close'},
 {who:'nar',say:'Trunks huye al pasado con la última máquina del tiempo.',cam:'wide',fx:'flash'}]}},
{id:'db5',t:'db',n:5,name:'Esfera de 5 estrellas',x:50,y:86,hint:'En la Tierra en ruinas del futuro de Trunks.',who:'trunks',world:0,
 fight:{world:0,v:1,p:{c:'trunks',f:'ssj',base:2.4e6,forms:['ssj','ssj2']},e:{c:'black',base:3e6,hp:.7,forms:['base']},goal:{type:'survive',t:45},stars:[{type:'hp',v:.5,txt:'Termina con más del 50 % de vida'}],pre:[['trunks','La esfera está aquí… no dejaré que Black me detenga.']]}},
{id:'tr3',t:'fight',name:'Goku contra Goku Black',place:'Ciudad en ruinas',x:56,y:46,world:0,v:1,
 p:{c:'goku',f:'ssb',base:3e6,forms:['ssb']},e:{c:'black',f:'rose',base:3e6,hp:1.4,forms:['rose']},
 goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'},{type:'time',v:140,txt:'Gana en menos de 140 s'}],coins:260,
 pre:[['black','Este cuerpo es magnífico, Son Goku. Gracias por prestármelo.'],['goku','¡Devuélvemelo y no vuelvas a usar mi cara!']]},
{id:'tr4',t:'fight',name:'La alianza de los Zamasu',place:'Ciudad en ruinas',x:70,y:26,world:0,v:1,
 p:{c:'goku',f:'ssb',base:3e6,forms:['ssb']},ally:{c:'vegeta',f:'ssb',base:2.6e6,forms:['ssb']},e:{c:'black',f:'rose',base:2.5e6,hp:1.1,forms:['rose']},e2:{c:'zamasuk',base:1.5e10,hp:1.1,forms:['base','immortal']},
 goal:{type:'win'},stars:[{type:'ally',txt:'Vegeta sigue en pie al final'},{type:'hp',v:.4,txt:'Termina con más del 40 % de vida'}],coins:280,unlock:'zamasuk',
 pre:[['zamasuk','Soy inmortal. Vuestros golpes no significan nada.'],['vegeta','Entonces te golpearé hasta que te aburras.']]},
{id:'tr5',t:'fight',name:'Vegito contra Zamasu fusionado',place:'Cielo del futuro',x:84,y:52,world:0,v:1,
 p:{c:'vegetto',f:'vblue',base:6e7,forms:['vblue']},e:{c:'zamasu',base:3e11,hp:1.6,forms:['base','half']},
 goal:{type:'win'},stars:[{type:'time',v:130,txt:'Gana en menos de 130 s'},{type:'ult',txt:'Lanza un definitivo'}],coins:300,
 pre:[['zamasu','¡Contemplad la belleza de un dios fusionado!'],['vegetto','Mucho hablar para alguien que va a perder.']],
 cine:{id:'c_tr5',title:'El botón de Zeno',world:0,v:1,cast:[{c:'goku',x:-2,z:0},{c:'trunks',x:2,z:1}],shots:[
  {who:'nar',say:'Zamasu se convierte en una luz que lo invade todo. Goku pulsa el botón que llama a Zeno.',cam:'wide'},
  {who:'nar',say:'Zeno borra esa línea del tiempo. Trunks parte hacia otro futuro, en paz.',cam:'close',fx:'flash'}]}},
{id:'tr6',t:'cine',name:'Un nuevo comienzo',place:'Otra línea del tiempo',x:96,y:30,cine:{id:'c_tr6',title:'Un nuevo comienzo',world:0,cast:[{c:'trunks',x:0,z:0}],shots:[
 {who:'trunks',say:'Gracias a todos. Esta vez protegeré mi futuro.',cam:'close',pose:'victory'}]}}]});
