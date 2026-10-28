/* Kaioken Clash · Modo historia · Arco 4: Saga de Majin Buu (datos) */
KC_STORY({id:'buu',name:'Saga de Majin Buu',map:{c1:'#ff9ad0',c2:'#c8a070',deco:[['🏟',12,36,28],['🥚',36,22,24],['🏠',56,74,22],['🍬',72,26,22],['🪐',90,60,26]]},nodes:[
{id:'buu0',t:'cine',name:'El regreso de Goku',place:'Torneo de las Artes Marciales',x:8,y:62,cine:{id:'c_buu0',title:'Un día en la Tierra',world:0,cast:[{c:'goku',x:-3,z:0},{c:'goten',x:-1,z:2},{c:'vegeta',x:3,z:0}],shots:[
 {who:'nar',say:'Siete años después, Goku vuelve a la Tierra por un día para el Torneo de las Artes Marciales.',cam:'wide'},
 {who:'goten',say:'¿Tú eres mi papá? ¡Hola! Soy Goten.',cam:'close',pose:'victory'},
 {who:'goku',say:'¡Te pareces muchísimo a mí cuando era pequeño!',cam:'two'},
 {who:'vegeta',say:'Kakaroto… al fin podremos terminar nuestro combate.',cam:'close'}]}},
{id:'buu1',t:'fight',name:'Goku contra Majin Vegeta',place:'El yermo',x:24,y:44,world:0,v:1,
 p:{c:'goku',f:'ssj',base:3e6,forms:['ssj','ssj2']},e:{c:'vegeta',f:'majin',base:2.6e6,hp:1.4,forms:['majin']},
 goal:{type:'win'},stars:[{type:'time',v:140,txt:'Gana en menos de 140 s'},{type:'hp',v:.5,txt:'Termina con más del 50 % de vida'}],coins:200,unlock:'goten',
 pre:[['vegeta','He dejado que Babidi controle mi mente para pelear contigo sin contenerme.'],['goku','¡Hay gente inocente en peligro, Vegeta!']]},
{id:'db4',t:'db',n:4,name:'Esfera de 4 estrellas',x:38,y:82,hint:'En los restos de la nave de Babidi.',who:'goten'},
{id:'buu2',t:'fight',name:'Gotenks contra Super Buu',place:'La habitación del tiempo',x:50,y:30,world:3,
 p:{c:'gotenks',f:'ssj',base:1e6,forms:['ssj','ssj3']},e:{c:'buu',f:'super',base:3e8,hp:1.3,forms:['super']},
 goal:{type:'survive',t:70},stars:[{type:'ult',txt:'Lanza un definitivo'},{type:'hp',v:.4,txt:'Resiste con más del 40 % de vida'}],coins:200,
 pre:[['gotenks','¡Soy el gran Gotenks! ¡Te voy a hacer papilla!'],['buu','Ji, ji. Buu quiere jugar.']]},
{id:'buu3',t:'fight',name:'Vegito contra Super Buu',place:'Dentro de Buu',x:64,y:60,world:0,v:1,
 p:{c:'vegetto',base:2e7,forms:['base','svg']},e:{c:'buu',f:'gabs',base:3e8,hp:1.4,forms:['gabs']},
 goal:{type:'win'},stars:[{type:'noTrans',txt:'Gana sin transformarte'},{type:'time',v:120,txt:'Gana en menos de 120 s'}],coins:230,
 pre:[['vegetto','No soy Goku ni Vegeta. Soy el que te va a derrotar.'],['buu','¡Imposible! ¡Buu es el más fuerte!']]},
{id:'buu4',t:'fight',name:'La Genkidama contra Kid Buu',place:'Planeta de los Kaioshin',x:80,y:34,world:3,v:1,
 p:{c:'goku',f:'ssj3',base:3e6,forms:['ssj','ssj3']},ally:{c:'vegeta',base:2.6e6,f:'ssj2',forms:['ssj2']},e:{c:'buu',f:'kid',base:3e8,hp:1.6,forms:['kid']},
 goal:{type:'survive',t:80},stars:[{type:'ally',txt:'Vegeta sigue en pie al final'},{type:'ult',txt:'Lanza un definitivo'}],coins:250,
 pre:[['vegeta','Kakaroto, prepara la Genkidama. Yo lo entretendré.'],['goku','¡Gente de la Tierra, prestadme vuestra energía!']],
 cine:{id:'c_buu4',title:'Adiós, Buu',world:3,v:1,cast:[{c:'goku',x:-3,z:0},{c:'buu',x:4,z:0,f:'kid'}],shots:[
  {who:'nar',say:'Mr. Satan convence a toda la Tierra para que levante las manos.',cam:'wide'},
  {who:'goku',say:'¡Toma esto, Buu! ¡GENKIDAMA!',cam:'low',pose:'raise',fx:'beam:buu:9fe0ff'},
  {who:'goku',say:'Ojalá renazcas como un buen chico. Así podremos volver a pelear, tú y yo solos.',cam:'close',pose:'victory'}]}},
{id:'buu5',t:'cine',name:'Diez años después',place:'Torneo 28',x:94,y:66,cine:{id:'c_buu5',title:'Diez años después',world:0,cast:[{c:'goku',x:-2,z:0},{c:'goten',x:2,z:1}],shots:[
 {who:'nar',say:'Pasa el tiempo y la Tierra vive en paz. Pero en el universo hay dioses dormidos…',cam:'wide'}]}}]});
