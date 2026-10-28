/* Kaioken Clash · Modo historia · Arco 2: Saga de Freezer (datos) */
KC_STORY({id:'nam',name:'Saga de Freezer',map:{c1:'#7ad08a',c2:'#3a8a6a',deco:[['🏠',14,40,22],['🌴',30,26,22],['🌊',50,84,26],['🛸',74,30,26],['🌋',90,70,26]]},nodes:[
{id:'nam0',t:'cine',name:'El planeta verde',place:'Namek',x:8,y:62,cine:{id:'c_nam0',title:'El planeta verde',world:1,cast:[{c:'gohan',x:-2,z:0},{c:'krilin',x:-4,z:1},{c:'freezer',x:5,z:0,f:'f1'}],shots:[
 {who:'nar',say:'En Namek, Gohan y Krilin descubren que alguien más busca las Esferas del Dragón.',cam:'wide'},
 {who:'freezer',say:'Con las siete esferas conseguiré la vida eterna. Nada podrá detenerme.',cam:'close'},
 {who:'krilin',say:'Es Freezer… el emperador del universo. Su poder es aterrador.',cam:'two'},
 {who:'gohan',say:'Papá vendrá pronto. Tenemos que aguantar.',cam:'close'}]}},
{id:'nam1',t:'fight',name:'Las Fuerzas Especiales Ginyu',place:'Pradera de Namek',x:24,y:44,world:1,
 p:{c:'goku',base:90000,forms:['base','kk3']},e:{c:'ginyu',base:120000,hp:1.2,forms:['base','pose']},
 goal:{type:'win'},stars:[{type:'noTrans',txt:'Gana sin usar el Kaio-ken'},{type:'time',v:120,txt:'Gana en menos de 120 s'}],coins:160,unlock:'ginyu',
 pre:[['ginyu','¡Fuerzas Especiales Ginyu! ¡Pose de combate!'],['goku','Llego justo a tiempo. ¿Os importa si pelamos ya?']]},
{id:'db2',t:'db',n:2,name:'Esfera de 2 estrellas',x:38,y:78,hint:'En un pueblo namekiano abandonado.',who:'gohan',world:1,
 fight:{world:1,p:{c:'gohan',base:20000,forms:['base']},e:{c:'freezer',f:'f1',base:9000,hp:.6,forms:['f1']},goal:{type:'survive',t:40},stars:[{type:'hp',v:.5,txt:'Termina con más del 50 % de vida'}],pre:[['gohan','¡La esfera es mía! Solo tengo que aguantar hasta escapar.']]}},
{id:'nam2',t:'fight',name:'Piccolo contra Freezer',place:'Lagos de Namek',x:48,y:30,world:1,
 p:{c:'piccolo',base:1.1e6,forms:['base']},e:{c:'freezer',f:'f2',base:5.3e5,hp:1.2,forms:['f2','f3']},
 goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'},{type:'hp',v:.4,txt:'Termina con más del 40 % de vida'}],coins:170,
 pre:[['piccolo','Me he fusionado con Nail. Ya no soy el de antes.'],['freezer','Entonces tendré que mostrarte mi siguiente forma.']]},
{id:'nam3',t:'fight',name:'La forma final de Freezer',place:'Namek en llamas',x:62,y:58,world:1,v:1,
 p:{c:'goku',base:3e6,forms:['base','kk10','kk20']},e:{c:'freezer',f:'f50',base:5.3e5,hp:1.4,forms:['f50']},
 goal:{type:'survive',t:75},stars:[{type:'hp',v:.4,txt:'Resiste con más del 40 % de vida'},{type:'ult',txt:'Lanza un definitivo'}],coins:190,
 pre:[['freezer','Sabes que no puedes ganar, mono. Te dejaré atacar primero.'],['goku','Kaio-ken… ¡por veinte!']],
 cine:{id:'c_nam3',title:'¡Super Saiyajin!',world:1,v:1,cast:[{c:'goku',x:-2,z:0},{c:'freezer',x:4,z:0,f:'f50'}],shots:[
  {who:'freezer',say:'Ese pequeño amigo tuyo, el calvo… ya no está. ¿Qué vas a hacer?',cam:'close'},
  {who:'goku',say:'Krilin… ¡KRILIN!',cam:'low',pose:'charge',aura:{goku:1.2},fx:'shake'},
  {who:'nar',say:'La ira despierta la leyenda: el Super Saiyajin que aparece cada mil años.',cam:'wide',form:'ssj',fx:'flash'},
  {who:'goku',say:'Soy el guerrero que ha venido desde la Tierra para derrotarte, Freezer.',cam:'close'}]}},
{id:'nam4',t:'fight',name:'Super Saiyajin contra Freezer al 100 %',place:'El planeta que se desmorona',x:78,y:34,world:1,v:1,
 p:{c:'goku',f:'ssj',base:3e6,forms:['ssj']},e:{c:'freezer',f:'f100',base:5.3e5,hp:1.5,forms:['f100']},
 goal:{type:'win'},stars:[{type:'time',v:120,txt:'Gana en menos de 120 s'},{type:'hp',v:.5,txt:'Termina con más del 50 % de vida'}],coins:220,
 pre:[['freezer','¡Al cien por cien! ¡No queda nada que puedas hacer!'],['goku','Ya basta, Freezer. Tu orgullo está herido.']]},
{id:'nam5',t:'cine',name:'Adiós, Namek',place:'Espacio',x:94,y:62,cine:{id:'c_nam5',title:'Adiós, Namek',world:1,v:1,cast:[{c:'goku',x:0,z:0,f:'ssj'}],shots:[
 {who:'nar',say:'Namek estalla. Todos creen que Goku ha muerto con el planeta.',cam:'wide',fx:'flash'},
 {who:'nar',say:'Pero en una nave de las Fuerzas Ginyu, un Saiyajin sobrevive y viaja a un planeta lejano: Yardrat.',cam:'close'}]}}]});
