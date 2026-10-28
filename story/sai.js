/* Kaioken Clash · Modo historia «Junto a Goku» · Arco 1: Saga Saiyajin (datos)
   Mundos: 0 Yermo · 1 Namek · 2 Torneo del Poder · 3 Kaiosama · 4 Dimensión rota · 5 Antártida · 6 Kame House · 7 Capital del Oeste · 8 Montaña Paoz · 9 Torneo de Artes Marciales · 10 Planeta de Bills · 11 Habitación del Tiempo */
KC_STORY({id:'sai',name:'Saga Saiyajin',nodes:[
{id:'sai0',t:'cine',name:'Un visitante del espacio',place:'Kame House',cine:{id:'c_sai0',title:'Un visitante del espacio',world:6,cast:[{c:'goku',x:-2,z:2},{c:'krilin',x:-5,z:4},{c:'raditz',x:4,z:2}],shots:[
 {who:'nar',say:'Cinco años después de su boda, Goku visita a sus viejos amigos en Kame House con su hijo Gohan.',cam:'wide'},
 {who:'raditz',say:'Por fin te encuentro, Kakaroto. Has olvidado tu misión.',cam:'close'},
 {who:'goku',say:'¿Kakaroto? Te confundes. Mi nombre es Goku.',cam:'two'},
 {who:'raditz',say:'Eres un Saiyajin, como yo. Soy tu hermano mayor, Raditz. Y me llevo a tu hijo.',cam:'close',fx:'hit:goku'},
 {who:'krilin',say:'¡Goku! ¡De un solo golpe…!',cam:'two'},
 {who:'goku',say:'Devuélveme a Gohan… ¡ahora mismo!',cam:'low',pose:'charge'}]}},
{id:'sai0b',t:'cine',name:'Una alianza imposible',place:'Montaña Paoz',cine:{id:'c_sai0b',title:'Una alianza imposible',world:8,cast:[{c:'goku',x:-3,z:0},{c:'piccolo',x:3,z:0}],shots:[
 {who:'piccolo',say:'Ese Saiyajin también es una amenaza para mí. Pelearemos juntos… por esta vez.',cam:'close'},
 {who:'goku',say:'¡Quién lo diría! Piccolo y yo en el mismo bando.',cam:'two',pose:'victory'},
 {who:'piccolo',say:'No te acostumbres. Cuando acabemos, este planeta será mío.',cam:'low'}]}},
{id:'sai1',t:'fight',name:'Goku y Piccolo contra Raditz',place:'Bosque de la Montaña Paoz',world:8,
 p:{c:'goku',base:416,forms:['base']},ally:{c:'piccolo',base:408},e:{c:'raditz',base:1100,hp:1.2,forms:['base','full']},
 goal:{type:'win'},stars:[{type:'ally',txt:'Piccolo sigue en pie al final'},{type:'time',v:150,txt:'Gana en menos de 150 s'}],coins:120,unlock:'raditz',
 pre:[['raditz','¿Un namekiano y mi hermanito? ¡Qué risa!'],['piccolo','Por esta vez, Goku. Solo por esta vez.']],
 cine:{id:'c_sai1',title:'El precio de la victoria',world:8,cast:[{c:'goku',x:-1,z:0},{c:'piccolo',x:-5,z:2},{c:'raditz',x:2,z:0}],shots:[
  {who:'raditz',say:'Ji… dentro de un año llegarán dos Saiyajin mucho más fuertes que yo.',cam:'close',pose:'down'},
  {who:'piccolo',say:'¡Makankosappo!',cam:'low',pose:'beamFire',fx:'beam:raditz:fff07a'},
  {who:'nar',say:'Goku da su vida para detener a su hermano. Su viaje continúa en el Otro Mundo.',cam:'wide',fx:'flash'}]}},
{id:'sai1b',t:'fight',name:'El despertar de Gohan',place:'Desierto donde entrena Gohan',world:0,
 intro:{id:'c_sai1b',title:'Seis meses en el desierto',world:0,cast:[{c:'piccolo',x:3,z:0},{c:'gohan',x:-2,z:0}],shots:[
  {who:'piccolo',say:'Tienes un poder oculto enorme. Si no aprendes a usarlo, morirás cuando lleguen los Saiyajin.',cam:'close'},
  {who:'gohan',say:'¡Quiero ser fuerte como mi papá! ¡Enséñeme, señor Piccolo!',cam:'close',pose:'charge'}]},
 p:{c:'gohan',base:1000,forms:['base']},e:{c:'piccolo',base:1200,hp:.8,forms:['base']},
 goal:{type:'survive',t:45},stars:[{type:'hp',v:.5,txt:'Resiste con más del 50 % de vida'},{type:'ult',txt:'Lanza un definitivo (Masenko)'}],coins:110,
 pre:[['piccolo','Esquiva o muere. Así de simple.'],['gohan','¡No voy a llorar más!']]},
{id:'sai1c',t:'cine',name:'El Camino de la Serpiente',place:'Planeta de Kaiosama',cine:{id:'c_sai1c',title:'Gravedad x10',world:3,cast:[{c:'goku',x:0,z:0}],shots:[
 {who:'nar',say:'Tras recorrer el Camino de la Serpiente, Goku llega al diminuto planeta del Kaio del Norte.',cam:'wide'},
 {who:'goku',say:'¡Uf! ¡Aquí todo pesa diez veces más! Así entrenaré el doble de rápido.',cam:'close',pose:'charge'},
 {who:'nar',say:'Kaiosama le enseña dos técnicas secretas: el Kaio-ken y la Genkidama.',cam:'two',fx:'flash'},
 {who:'goku',say:'¡Kaio-ken!',cam:'low',form:'kk3'}]}},
{id:'sai2',t:'fight',name:'La furia de Nappa',place:'Yermo rocoso',world:0,v:0,
 intro:{id:'c_sai2i',title:'Llegan los Saiyajin',world:0,cast:[{c:'vegeta',x:4,z:0},{c:'nappa',x:2,z:2},{c:'krilin',x:-4,z:0}],shots:[
  {who:'nar',say:'Un año después, dos naves esféricas caen sobre la Tierra.',cam:'wide',fx:'shake'},
  {who:'nappa',say:'¿Esta es la gran resistencia de la Tierra? Me voy a divertir.',cam:'close'},
  {who:'vegeta',say:'No pierdas el tiempo, Nappa. Busca las Esferas del Dragón.',cam:'close'}]},
 p:{c:'goku',base:8000,forms:['base','kk3']},e:{c:'nappa',base:4000,hp:1.3,forms:['base','rage']},
 goal:{type:'win'},stars:[{type:'noTrans',txt:'Gana sin usar el Kaio-ken'},{type:'hp',v:.6,txt:'Termina con más del 60 % de vida'}],coins:130,unlock:'nappa',
 pre:[['nappa','¿Otro insecto? ¡Te aplastaré como a los demás!'],['goku','Has hecho daño a mis amigos. Esto se acaba ya.']]},
{id:'db1',t:'db',n:1,name:'Esfera de 1 estrella',hint:'Entre las rocas del yermo donde aterrizó la nave Saiyajin.',who:'goku'},
{id:'sai3',t:'fight',name:'Goku contra Vegeta',place:'Yermo · el duelo de los Saiyajin',world:0,v:1,
 p:{c:'goku',base:8000,forms:['base','kk3','kk10']},e:{c:'vegeta',base:18000,hp:1.3,forms:['base'],f:'base'},
 goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'},{type:'time',v:140,txt:'Gana en menos de 140 s'}],coins:150,
 pre:[['vegeta','Un Saiyajin de clase baja no puede superar a un príncipe.'],['goku','Pues este clase baja ha entrenado mucho.']]},
{id:'sai3b',t:'cine',name:'Kaio-ken x4 contra Galick Gun',place:'Yermo',cine:{id:'c_sai3b',title:'El choque de energía',world:0,v:1,cast:[{c:'goku',x:-4,z:0},{c:'vegeta',x:4,z:0}],shots:[
 {who:'vegeta',say:'¡Desaparece junto con este planeta! ¡GALICK GUN!',cam:'close',pose:'beamFire',fx:'beam:goku:b05cff'},
 {who:'goku',say:'¡Kaio-ken… por cuatro! ¡KAMEHAMEHAAA!',cam:'low',form:'kk10',fx:'beam:vegeta:5cc8ff'},
 {who:'nar',say:'Los dos rayos chocan en el cielo. El Kamehameha empuja y lanza a Vegeta a las nubes.',cam:'wide',fx:'flash'},
 {who:'vegeta',say:'¡Imposible! ¡Un guerrero de clase baja…! Me da igual: crearé una luna con mi energía.',cam:'close',pose:'raise',fx:'shake'},
 {who:'nar',say:'Vegeta se transforma en un gigantesco Oozaru.',cam:'wide',fx:'shake'}]}},
{id:'sai4',t:'fight',name:'¡El Oozaru!',place:'Yermo bajo la luna',world:0,v:1,boss:'oozaru',bossPow:120000,bossHp:.55,
 p:{c:'goku',base:8000,forms:['base','kk3','kk10']},ally:{c:'gohan',base:2800},
 goal:{type:'win'},stars:[{type:'ally',txt:'Gohan sigue en pie al final'},{type:'hp',v:.3,txt:'Termina con más del 30 % de vida'}],coins:180,
 pre:[['goku','¡Gohan, ayúdame! Si le cortamos la cola, volverá a la normalidad.']]},
{id:'sai5',t:'cine',name:'Rumbo a Namek',place:'Capital del Oeste',cine:{id:'c_sai5',title:'Rumbo a Namek',world:7,cast:[{c:'goku',x:-2,z:0},{c:'gohan',x:2,z:1},{c:'krilin',x:3,z:-2}],shots:[
 {who:'nar',say:'Vegeta huye malherido. La Tierra se ha salvado, pero a un alto precio.',cam:'wide'},
 {who:'krilin',say:'Las Esferas del Dragón de Namek pueden revivir a nuestros amigos.',cam:'two'},
 {who:'gohan',say:'¡Yo también iré! Esta vez quiero ayudar.',cam:'close',pose:'victory'},
 {who:'goku',say:'Id delante. Me pondré bien y os alcanzaré en Namek.',cam:'close'}]}}]});
