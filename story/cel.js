/* Kaioken Clash · Modo historia · Arco 3: Androides y Cell (datos) */
KC_STORY({id:'cel',name:'Androides y Cell',map:{c1:'#ffb070',c2:'#c88a5a',deco:[['🏙',12,30,26],['🏝',32,78,24],['🏟',72,40,30],['⛰',88,24,26],['🔬',50,22,22]]},nodes:[
{id:'cel0',t:'cine',name:'El joven del futuro',place:'Afueras de la Capital del Oeste',x:8,y:60,cine:{id:'c_cel0',title:'El joven del futuro',world:0,cast:[{c:'trunks',x:3,z:0},{c:'goku',x:-3,z:0}],shots:[
 {who:'nar',say:'Un joven misterioso acaba con Freezer en segundos y espera la llegada de Goku.',cam:'wide'},
 {who:'trunks',say:'Vengo del futuro. Dentro de tres años aparecerán dos androides que lo destruirán todo.',cam:'close'},
 {who:'goku',say:'¿Androides? Entonces entrenaré tanto como pueda.',cam:'two'},
 {who:'trunks',say:'Y tome esto: una medicina para un virus del corazón que le atacará pronto.',cam:'close'}]}},
{id:'cel1',t:'fight',name:'Vegeta contra la Androide 18',place:'Carretera de montaña',x:22,y:40,world:0,
 p:{c:'vegeta',base:5e5,forms:['base','ssj']},e:{c:'a18',base:2.4e7,hp:1.2,forms:['base']},
 goal:{type:'win'},stars:[{type:'time',v:130,txt:'Gana en menos de 130 s'},{type:'hp',v:.5,txt:'Termina con más del 50 % de vida'}],coins:170,
 pre:[['vegeta','Yo también soy un Super Saiyajin. Hora de demostrarlo.'],['a18','Nuestra energía es infinita. Tú te cansarás antes.']]},
{id:'db3',t:'db',n:3,name:'Esfera de 3 estrellas',x:36,y:82,hint:'Cerca de la isla donde despertaron los androides.',who:'krilin'},
{id:'cel2',t:'fight',name:'Piccolo contra Cell',place:'Pueblo de Ginger',x:46,y:56,world:0,
 p:{c:'piccolo',base:2e7,forms:['base']},e:{c:'cell',f:'imp',base:2.4e7,hp:1.2,forms:['imp']},
 goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'},{type:'noTrans',txt:'Gana sin transformarte'}],coins:170,
 pre:[['cell','Tengo las células de los mejores guerreros. También las tuyas, Piccolo.'],['piccolo','Entonces sabrás lo que te espera.']]},
{id:'cel3',t:'fight',name:'Super Vegeta contra Cell semiperfecto',place:'Islas del sur',x:58,y:30,world:0,
 p:{c:'vegeta',base:2.6e6,forms:['ssj','sv']},e:{c:'cell',f:'semi',base:3e7,hp:1.3,forms:['semi']},
 goal:{type:'win'},stars:[{type:'time',v:120,txt:'Gana en menos de 120 s'},{type:'ult',txt:'Acaba con un definitivo'}],coins:190,
 pre:[['vegeta','Soy Super Vegeta. No me sirves ni de calentamiento.'],['cell','Dejadme absorber a la 18 y verás lo que es un rival.']]},
{id:'cel4',t:'cine',name:'Los Juegos de Cell',place:'Ring de los Juegos de Cell',x:70,y:58,cine:{id:'c_cel4',title:'Los Juegos de Cell',world:0,cast:[{c:'cell',x:4,z:0,f:'perf'},{c:'goku',x:-3,z:1,f:'ssj'},{c:'gohan',x:-5,z:-1,f:'ssj'}],shots:[
 {who:'cell',say:'Organizaré un torneo. Si nadie me vence, la Tierra será mía.',cam:'close'},
 {who:'nar',say:'Goku pelea contra el Cell perfecto… y se rinde.',cam:'wide'},
 {who:'goku',say:'Me rindo. Mi sustituto será… ¡Gohan!',cam:'two'},
 {who:'gohan',say:'¿Yo? Papá… está bien. Lo intentaré.',cam:'close'}]}},
{id:'cel5',t:'fight',name:'Gohan despierta',place:'Ring de los Juegos de Cell',x:82,y:36,world:0,v:1,
 p:{c:'gohan',f:'ssj',base:3e6,forms:['ssj','ssj2']},e:{c:'cell',f:'perf',base:3e7,hp:1.5,forms:['perf','sp']},
 goal:{type:'win'},stars:[{type:'ult',txt:'Acaba con el Kamehameha padre-hijo (definitivo)'},{type:'hp',v:.3,txt:'Termina con más del 30 % de vida'}],coins:240,
 pre:[['cell','¡Enfádate, muchacho! ¡Muéstrame ese poder!'],['gohan','Ya basta… No te perdonaré, Cell.']],
 cine:{id:'c_cel5',title:'Kamehameha padre-hijo',world:0,v:1,cast:[{c:'gohan',x:-3,z:0,f:'ssj2'},{c:'cell',x:4,z:0,f:'sp'}],shots:[
  {who:'cell',say:'¡Te llevaré conmigo! ¡Kamehameha!',cam:'close',pose:'beamFire'},
  {who:'nar',say:'Con un brazo herido, Gohan escucha la voz de su padre desde el Otro Mundo.',cam:'wide'},
  {who:'gohan',say:'¡KAMEHAMEHAAA!',cam:'low',pose:'beamFire',fx:'beam:cell:5cc8ff'},
  {who:'nar',say:'Cell desaparece. Gohan es el nuevo héroe de la Tierra.',cam:'wide',fx:'flash'}]}},
{id:'cel6',t:'cine',name:'La paz',place:'El templo de Kamisama',x:94,y:62,cine:{id:'c_cel6',title:'La paz',world:0,cast:[{c:'gohan',x:0,z:0},{c:'piccolo',x:-3,z:1}],shots:[
 {who:'piccolo',say:'Tu padre ha decidido quedarse en el Otro Mundo.',cam:'two'},
 {who:'gohan',say:'Cuidaré de mamá. Y de mi hermanito, cuando nazca.',cam:'close',pose:'victory'}]}}]});
