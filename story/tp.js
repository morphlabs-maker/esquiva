/* Kaioken Clash · Modo historia · Arco 7: Torneo del Poder (datos) */
KC_STORY({id:'tp',name:'Torneo del Poder',map:{c1:'#3a2a6a',c2:'#8a7aa8',deco:[['🏛',50,16,30],['🗿',80,30,24],['✨',20,30,20],['💫',70,80,20]]},nodes:[
{id:'tp0',t:'cine',name:'Ocho universos, un ganador',place:'Mundo del Vacío',x:8,y:60,cine:{id:'c_tp0',title:'El Torneo del Poder',world:2,cast:[{c:'goku',x:-3,z:0},{c:'vegeta',x:-5,z:2},{c:'jiren',x:4,z:0}],shots:[
 {who:'nar',say:'Zeno organiza un torneo: los universos que pierdan serán borrados.',cam:'wide'},
 {who:'jiren',say:'…',cam:'close'},
 {who:'goku',say:'Ese tipo es increíblemente fuerte. Tengo que pelear con él.',cam:'two'},
 {who:'vegeta',say:'No te distraigas, Kakaroto. Primero sobrevive.',cam:'close'}]}},
{id:'tp1',t:'fight',name:'Kefla',place:'Arena del Torneo del Poder',x:24,y:44,world:2,
 p:{c:'goku',f:'ssb',base:3e6,forms:['ssb','uio']},e:{c:'kefla',f:'ssj',base:8e8,hp:1.4,forms:['ssj','ssj2']},
 goal:{type:'win'},stars:[{type:'time',v:140,txt:'Gana en menos de 140 s'},{type:'hp',v:.4,txt:'Termina con más del 40 % de vida'}],coins:280,
 pre:[['kefla','¡Te voy a sacar del ring a patadas!'],['goku','¡Dos guerreras fusionadas! ¡Increíble!']]},
{id:'db6',t:'db',n:6,name:'Esfera de 6 estrellas',x:40,y:84,hint:'Tras la estatua del Gran Sacerdote.',who:'vegeta',world:2},
{id:'tp2',t:'fight',name:'Goku y Vegeta contra Jiren',place:'Arena en ruinas',x:56,y:36,world:2,v:1,
 p:{c:'goku',f:'ssb',base:3e6,forms:['ssb','ssbkk']},ally:{c:'vegeta',f:'ssbe',base:2.6e6,forms:['ssbe']},e:{c:'jiren',base:1.2e11,hp:2,forms:['base','full']},
 goal:{type:'survive',t:90},stars:[{type:'ally',txt:'Vegeta sigue en pie al final'},{type:'hp',v:.3,txt:'Resiste con más del 30 % de vida'}],coins:300,
 pre:[['jiren','La confianza no vale nada. Solo la fuerza.'],['vegeta','Pues te enseñaremos la fuerza de dos Saiyajin.']],
 cine:{id:'c_tp2',title:'El instinto superior',world:2,v:1,cast:[{c:'goku',x:-2,z:0,f:'ssb'},{c:'jiren',x:4,z:0}],shots:[
  {who:'nar',say:'Al límite de sus fuerzas, el cuerpo de Goku empieza a moverse solo.',cam:'wide'},
  {who:'goku',say:'…',cam:'close',form:'ui',fx:'flash'},
  {who:'jiren',say:'¿Qué es esto? ¿Me esquiva sin pensar?',cam:'close'}]}},
{id:'tp3',t:'fight',name:'Ultra Instinto contra Jiren',place:'Arena en ruinas',x:74,y:58,world:2,v:1,
 p:{c:'goku',f:'ui',base:3e6,forms:['ui']},e:{c:'jiren',f:'full',base:1.2e11,hp:1.8,forms:['full','limit']},
 goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'},{type:'time',v:150,txt:'Gana en menos de 150 s'}],coins:340,
 pre:[['jiren','Muéstrame ese poder. Lo superaré.'],['goku','Ya no pienso. Solo me muevo.']]},
{id:'tp4',t:'cine',name:'El deseo del Androide 17',place:'Mundo del Vacío',x:92,y:34,cine:{id:'c_tp4',title:'El deseo del Androide 17',world:2,cast:[{c:'a17',x:0,z:0},{c:'goku',x:-3,z:1}],shots:[
 {who:'nar',say:'El Androide 17 es el último en pie y gana el torneo para el Universo 7.',cam:'wide'},
 {who:'a17',say:'Mi deseo: que vuelvan todos los universos borrados.',cam:'close',fx:'flash'},
 {who:'goku',say:'¡Bien hecho, 17! Ese es un buen deseo.',cam:'two',pose:'victory'}]}}]});
