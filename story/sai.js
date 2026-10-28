/* Kaioken Clash · Modo historia «Junto a Goku» · Arco 1: Saga Saiyajin (datos) */
KC_STORY({id:'sai',name:'Saga Saiyajin',map:{c1:'#5aa8ff',c2:'#c8a060',deco:[['🏝',10,30,26],['⛰',55,28,30],['🌳',30,80,20],['🛸',78,62,22],['🌵',88,85,18]]},nodes:[
{id:'sai0',t:'cine',name:'Un visitante del espacio',place:'Kame House',x:8,y:70,cine:{id:'c_sai0',title:'Un visitante del espacio',world:0,cast:[{c:'goku',x:-2,z:0},{c:'krilin',x:-4,z:2},{c:'raditz',x:4,z:0}],shots:[
 {who:'nar',say:'Cinco años después de su boda, Goku visita a sus viejos amigos en Kame House.',cam:'wide'},
 {who:'raditz',say:'Por fin te encuentro, Kakaroto. Has olvidado tu misión.',cam:'close'},
 {who:'goku',say:'¿Kakaroto? Te confundes. Mi nombre es Goku.',cam:'two'},
 {who:'raditz',say:'Eres un Saiyajin, como yo. Soy tu hermano mayor, Raditz. Y me llevo a tu hijo.',cam:'close',fx:'hit:goku'},
 {who:'krilin',say:'¡Goku! ¡De un solo golpe…!',cam:'two'},
 {who:'goku',say:'Devuélveme a Gohan… ¡ahora mismo!',cam:'low',pose:'charge'}]}},
{id:'sai1',t:'fight',name:'Goku y Piccolo contra Raditz',place:'Yermo · el bosque de Gohan',x:22,y:52,world:0,
 p:{c:'goku',base:416,forms:['base']},ally:{c:'piccolo',base:408},e:{c:'raditz',base:1100,hp:1.2,forms:['base','full']},
 goal:{type:'win'},stars:[{type:'ally',txt:'Piccolo sigue en pie al final'},{type:'time',v:150,txt:'Gana en menos de 150 s'}],coins:120,unlock:'raditz',
 pre:[['raditz','¿Un namekiano y mi hermanito? ¡Qué risa!'],['piccolo','Por esta vez, Goku. Solo por esta vez.']],
 cine:{id:'c_sai1',title:'El precio de la victoria',world:0,cast:[{c:'goku',x:-1,z:0},{c:'piccolo',x:-5,z:2},{c:'raditz',x:2,z:0}],shots:[
  {who:'raditz',say:'Ji… dentro de un año llegarán dos Saiyajin mucho más fuertes que yo.',cam:'close',pose:'down'},
  {who:'piccolo',say:'¡Makankosappo!',cam:'low',pose:'beamFire',fx:'beam:raditz:fff07a'},
  {who:'nar',say:'Goku da su vida para detener a su hermano. Su viaje continúa en el Otro Mundo.',cam:'wide',fx:'flash'}]}},
{id:'sai1c',t:'cine',name:'El Camino de la Serpiente',place:'Planeta de Kaiosama',x:36,y:30,cine:{id:'c_sai1c',title:'Gravedad x10',world:3,cast:[{c:'goku',x:0,z:0}],shots:[
 {who:'nar',say:'Tras recorrer el Camino de la Serpiente, Goku llega al diminuto planeta del Kaio del Norte.',cam:'wide'},
 {who:'goku',say:'¡Uf! ¡Aquí todo pesa diez veces más! Así entrenaré el doble de rápido.',cam:'close',pose:'charge'},
 {who:'nar',say:'Kaiosama le enseña dos técnicas secretas: el Kaio-ken y la Genkidama.',cam:'two',fx:'flash'},
 {who:'goku',say:'¡Kaio-ken!',cam:'low',form:'kk3'}]}},
{id:'sai2',t:'fight',name:'La furia de Nappa',place:'Yermo rocoso',x:50,y:62,world:0,v:0,
 p:{c:'goku',base:8000,forms:['base','kk3']},e:{c:'nappa',base:4000,hp:1.3,forms:['base','rage']},
 goal:{type:'win'},stars:[{type:'noTrans',txt:'Gana sin usar el Kaio-ken'},{type:'hp',v:.6,txt:'Termina con más del 60 % de vida'}],coins:130,unlock:'nappa',
 pre:[['nappa','¿Otro insecto? ¡Te aplastaré como a los demás!'],['goku','Has hecho daño a mis amigos. Esto se acaba ya.']]},
{id:'db1',t:'db',n:1,name:'Esfera de 1 estrella',x:64,y:84,hint:'Entre las rocas del yermo donde aterrizó la nave Saiyajin.',who:'goku'},
{id:'sai3',t:'fight',name:'Goku contra Vegeta',place:'Yermo · el duelo de los Saiyajin',x:72,y:40,world:0,v:1,
 p:{c:'goku',base:8000,forms:['base','kk3','kk10']},e:{c:'vegeta',base:18000,hp:1.3,forms:['base'],f:'base'},
 goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'},{type:'time',v:140,txt:'Gana en menos de 140 s'}],coins:150,
 pre:[['vegeta','Un Saiyajin de clase baja no puede superar a un príncipe.'],['goku','Pues este clase baja ha entrenado mucho.']],
 cine:{id:'c_sai3',title:'La luna artificial',world:0,v:1,cast:[{c:'goku',x:-3,z:0},{c:'vegeta',x:3,z:0}],shots:[
  {who:'vegeta',say:'¡Basta de juegos! Crearé una luna con mi propia energía.',cam:'close',pose:'raise',fx:'flash'},
  {who:'goku',say:'¿Qué es esa luz? ¡No puedo dejar de mirarla!',cam:'two'},
  {who:'nar',say:'Vegeta se transforma en un gigantesco Oozaru.',cam:'wide',fx:'shake'}]}},
{id:'sai4',t:'fight',name:'¡El Oozaru!',place:'Yermo bajo la luna',x:84,y:22,world:0,v:1,boss:'oozaru',bossPow:120000,bossHp:.55,
 p:{c:'goku',base:8000,forms:['base','kk3','kk10']},ally:{c:'gohan',base:2800},
 goal:{type:'win'},stars:[{type:'ally',txt:'Gohan sigue en pie al final'},{type:'hp',v:.3,txt:'Termina con más del 30 % de vida'}],coins:180,
 pre:[['goku','¡Gohan, ayúdame! Si le cortamos la cola, volverá a la normalidad.']]},
{id:'sai5',t:'cine',name:'Rumbo a Namek',place:'Hospital de la Capital del Oeste',x:94,y:58,cine:{id:'c_sai5',title:'Rumbo a Namek',world:0,cast:[{c:'goku',x:-2,z:0},{c:'gohan',x:2,z:1},{c:'krilin',x:3,z:-2}],shots:[
 {who:'nar',say:'Vegeta huye malherido. La Tierra se ha salvado, pero a un alto precio.',cam:'wide'},
 {who:'krilin',say:'Las Esferas del Dragón de Namek pueden revivir a nuestros amigos.',cam:'two'},
 {who:'gohan',say:'¡Yo también iré! Esta vez quiero ayudar.',cam:'close',pose:'victory'},
 {who:'goku',say:'Id delante. Me pondré bien y os alcanzaré en Namek.',cam:'close'}]}}]});
