/* Kaioken Clash · Modo historia · Arco 9: Saga de Moro (manga, datos) */
KC_STORY({id:'mor',name:'Saga de Moro',nodes:[
{id:'mor0',t:'cine',name:'El devorador de planetas',place:'Prisión de la Patrulla Galáctica',cine:{id:'c_mor0',title:'El devorador de planetas',world:3,cast:[{c:'moro',x:3,z:0},{c:'goku',x:-3,z:0,f:'base'}],shots:[
 {who:'nar',say:'Moro, un mago que absorbe la energía de planetas enteros, escapa de la prisión galáctica.',cam:'wide'},
 {who:'moro',say:'Tu energía es deliciosa, Saiyajin. Dámela.',cam:'close',fx:'flash'},
 {who:'goku',say:'¡Me está quitando la fuerza! ¿Qué clase de magia es esta?',cam:'close',pose:'tired'}]}},
{id:'mor1',t:'fight',name:'La magia de Moro',place:'El nuevo Namek',world:1,
 p:{c:'vegeta',f:'ssb',base:2.6e6,forms:['ssb']},e:{c:'moro',f:'young',base:1.5e10,hp:1.3,forms:['young','planets']},
 goal:{type:'survive',t:70},stars:[{type:'hp',v:.4,txt:'Resiste con más del 40 % de vida'},{type:'ult',txt:'Lanza un definitivo'}],coins:320,
 pre:[['moro','Cuanta más energía robo, más fuerte me vuelvo.'],['vegeta','Entonces no te dejaré tocarme.']],
 cine:{id:'c_mor1',title:'La técnica de Yardrat',world:1,cast:[{c:'vegeta',x:-3,z:0,f:'ssb'},{c:'moro',x:3,z:0,f:'planets'}],shots:[
  {who:'vegeta',say:'¿Te gusta robar energía? Entonces devuélvemela… ¡toda!',cam:'close',pose:'raise',fx:'flash'},
  {who:'nar',say:'Con lo aprendido en Yardrat, Vegeta divide su espíritu y arranca a Moro todo lo que había absorbido.',cam:'wide',fx:'shake'},
  {who:'moro',say:'¡Mi poder…! ¡Maldito Saiyajin!',cam:'close',pose:'down'}]}},
{id:'db7',t:'db',n:7,name:'Esfera de 7 estrellas',hint:'En el planeta prisión de la Patrulla Galáctica.',who:'goku',world:3},
{id:'mor1b',t:'fight',name:'Goku y Vegeta contra Moro',place:'El nuevo Namek',world:1,v:1,
 p:{c:'goku',f:'ssb',base:3e6,forms:['ssb']},ally:{c:'vegeta',f:'ssb',base:2.6e6,forms:['ssb']},e:{c:'moro',f:'planets',base:1.5e10,hp:1.4,forms:['planets']},
 goal:{type:'win'},stars:[{type:'ally',txt:'Vegeta sigue en pie al final'},{type:'time',v:150,txt:'Gana en menos de 150 s'}],coins:330,
 pre:[['goku','Esta vez sin trucos de magia, Moro.'],['moro','Los dos juntos solo sois más comida.']]},
{id:'mor2',t:'fight',name:'Moro y el Siete-Tres',place:'Capital del Oeste',world:7,
 p:{c:'goku',f:'ssb',base:3e6,forms:['ssb','uio']},e:{c:'moro',f:'s73',base:1.5e10,hp:1.5,forms:['s73','merus']},
 goal:{type:'win'},stars:[{type:'time',v:150,txt:'Gana en menos de 150 s'},{type:'hp',v:.4,txt:'Termina con más del 40 % de vida'}],coins:340,
 pre:[['moro','He copiado las habilidades de Siete-Tres. Ya no puedes ganar.'],['goku','He aprendido algo de Merus. ¡Te lo enseñaré!']],
 cine:{id:'c_mor2',title:'El sacrificio de Merus',world:7,cast:[{c:'goku',x:-3,z:0},{c:'moro',x:4,z:0,f:'merus'}],shots:[
  {who:'nar',say:'Merus, un ángel en secreto, rompe las reglas para salvar a Goku… y desaparece.',cam:'wide',fx:'flash'},
  {who:'goku',say:'Gracias, Merus. Ahora lo entiendo: el instinto se domina con el corazón tranquilo.',cam:'close',form:'ui'}]}},
{id:'mor3',t:'fight',name:'Moro terrestre',place:'La Tierra fusionada con Moro',world:0,v:1,
 p:{c:'goku',f:'ui',base:3e6,forms:['ui','giant']},e:{c:'moro',f:'earth',base:1.5e10,hp:1.6,forms:['earth']},
 goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'},{type:'hp',v:.4,txt:'Termina con más del 40 % de vida'}],coins:380,
 pre:[['moro','¡Soy uno con la Tierra! ¡Si me destruyes, destruyes el planeta!'],['goku','Entonces te sacaré de ella. ¡Gigante de Luz!']]},
{id:'mor4',t:'cine',name:'El Gigante de Luz',place:'La Tierra',cine:{id:'c_mor4',title:'El Gigante de Luz',world:0,v:1,cast:[{c:'goku',x:0,z:0,f:'ui'}],shots:[
 {who:'nar',say:'Con la energía que le dio Uub, Goku forma un gigantesco avatar de luz y derrota a Moro.',cam:'wide',form:'giant',fx:'flash'},
 {who:'goku',say:'Se acabó, Moro. Los planetas vuelven a ser libres.',cam:'close'}]}}]});
