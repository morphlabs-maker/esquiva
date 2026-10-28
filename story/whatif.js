/* Kaioken Clash · Historias «¿Qué pasaría si…?» (se desbloquean al terminar el modo historia) */
KC_STORY({id:'whatif',stories:[
{id:'wi1',name:'¿Y si Goku no se hubiera golpeado la cabeza?',desc:'Kakaroto cumple su misión Saiyajin y ataca la Tierra.',color:'#ff5a4a',nodes:[
 {id:'wi1a',t:'cine',name:'Kakaroto',x:10,y:60,cine:{id:'c_wi1a',title:'Kakaroto',world:8,v:1,cast:[{c:'goku',x:0,z:0},{c:'raditz',x:-3,z:1}],shots:[
  {who:'nar',say:'Esta vez nadie cuidó del pequeño Saiyajin. Kakaroto creció con un solo objetivo: conquistar.',cam:'wide'},
  {who:'raditz',say:'Bien hecho, hermanito. La Tierra caerá en un día.',cam:'two'},
  {who:'goku',say:'Los terrícolas son débiles. Esto será aburrido.',cam:'close'}]}},
 {id:'wi1b',t:'fight',name:'Kakaroto contra Piccolo',x:40,y:40,world:8,v:1,p:{c:'goku',base:1500,forms:['base','kk3']},e:{c:'piccolo',base:1200,hp:1.2},goal:{type:'win'},stars:[{type:'time',v:120,txt:'Gana en menos de 120 s'},{type:'hp',v:.5,txt:'Termina con más del 50 % de vida'}],coins:200,pre:[['piccolo','No dejaré que un Saiyajin destruya este planeta.']]},
 {id:'wi1c',t:'fight',name:'El último defensor',x:70,y:62,world:8,v:1,p:{c:'goku',base:1500,forms:['base','kk3']},ally:{c:'raditz',base:1500},e:{c:'krilin',f:'pot',base:1400,hp:1.3,forms:['pot']},e2:{c:'gohan',base:1000,hp:1},goal:{type:'win'},stars:[{type:'ally',txt:'Raditz sigue en pie al final'}],coins:220,
  cine:{id:'c_wi1c',title:'Un corazón que despierta',world:8,v:1,cast:[{c:'goku',x:-2,z:0},{c:'gohan',x:2,z:0}],shots:[{who:'gohan',say:'Por favor… no hagas daño a nadie más.',cam:'close'},{who:'goku',say:'…¿Por qué me duele el pecho al oírte?',cam:'close',pose:'tired'},{who:'nar',say:'Quizá, en otra vida, Kakaroto habría sido un héroe.',cam:'wide'}]}}]},
{id:'wi2',name:'¿Y si Gohan y Trunks se hubieran fusionado?',desc:'En el futuro, Gohan sobrevive y aprende la danza de la fusión con Trunks.',color:'#ffd23a',map:{c1:'#6a6a8a',c2:'#5a4a4a',deco:[['🏙',20,30,26],['⚡',70,70,24]]},nodes:[
 {id:'wi2a',t:'cine',name:'La danza del futuro',x:10,y:62,cine:{id:'c_wi2a',title:'La danza del futuro',world:7,v:1,cast:[{c:'gohan',x:-2,z:0,f:'ssj'},{c:'trunks',x:2,z:0}],shots:[
  {who:'gohan',say:'Trunks, solos no podemos con los androides. Pero juntos…',cam:'two'},
  {who:'trunks',say:'¡Fuuu…sión! ¡Ja!',cam:'two',pose:'raise',fx:'flash'},
  {who:'nar',say:'Nace Gohanks, la esperanza del futuro.',cam:'wide'}]}},
 {id:'wi2b',t:'fight',name:'Gohanks contra los androides',x:42,y:36,world:7,v:1,p:{c:'gohanks',f:'ssj',base:1.5e6,forms:['ssj','ssj2']},e:{c:'a17',base:2.5e7,hp:1.6,forms:['base','full']},e2:{c:'a18',base:2.4e7,hp:1.6,forms:['base','full']},goal:{type:'win'},stars:[{type:'hp',v:.4,txt:'Termina con más del 40 % de vida'},{type:'time',v:160,txt:'Gana en menos de 160 s'}],coins:260,unlock:'gohanks',pre:[['a17','¿Dos en uno? Será más divertido.']]},
 {id:'wi2c',t:'fight',name:'Gohanks contra Cell',x:74,y:58,world:7,v:1,p:{c:'gohanks',f:'ssj2',base:2e6,forms:['ssj2']},e:{c:'cell',f:'perf',base:3e7,hp:1.6,forms:['perf','sp']},goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'}],coins:280,
  cine:{id:'c_wi2c',title:'Un futuro en paz',world:7,cast:[{c:'gohan',x:-2,z:0},{c:'trunks',x:2,z:0}],shots:[{who:'trunks',say:'Lo logramos, Gohan. El futuro es nuestro.',cam:'two',pose:'victory'}]}}]},
{id:'wi3',name:'¿Y si Vegeta hubiera vencido a Freezer en Namek?',desc:'Vegeta despierta el Super Saiyajin antes que Goku.',color:'#4a8aff',map:{c1:'#7ad08a',c2:'#3a8a6a',deco:[['🌋',70,30,26],['🏠',20,70,22]]},nodes:[
 {id:'wi3a',t:'cine',name:'El orgullo del príncipe',x:10,y:60,cine:{id:'c_wi3a',title:'El orgullo del príncipe',world:1,v:1,cast:[{c:'vegeta',x:-2,z:0},{c:'freezer',x:4,z:0,f:'f100'}],shots:[
  {who:'freezer',say:'Arrodíllate, Vegeta. Como siempre.',cam:'close'},
  {who:'vegeta',say:'Nunca más. ¡NUNCA MÁS!',cam:'low',form:'ssj',fx:'flash'}]}},
 {id:'wi3b',t:'fight',name:'Super Vegeta contra Freezer',x:44,y:40,world:1,v:1,p:{c:'vegeta',f:'ssj',base:3e6,forms:['ssj']},e:{c:'freezer',f:'f100',base:5.3e5,hp:1.6,forms:['f100']},goal:{type:'win'},stars:[{type:'time',v:140,txt:'Gana en menos de 140 s'},{type:'hp',v:.5,txt:'Termina con más del 50 % de vida'}],coins:260},
 {id:'wi3c',t:'fight',name:'La venganza de Cooler',x:76,y:62,world:1,v:1,p:{c:'vegeta',f:'ssj',base:3e6,forms:['ssj','sv']},e:{c:'cooler',f:'fifth',base:1.2e8,hp:1.5,forms:['fifth','metal']},goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'}],coins:280,
  cine:{id:'c_wi3c',title:'El rey de los Saiyajin',world:1,cast:[{c:'vegeta',x:0,z:0,f:'ssj'}],shots:[{who:'vegeta',say:'El universo tiene un nuevo rey. Y se llama Vegeta.',cam:'close',pose:'victory'}]}}]},
{id:'wi4',name:'¿Y si Broly hubiera llegado al Torneo del Poder?',desc:'Un Saiyajin legendario se cuela en el torneo de Zeno.',color:'#55ff66',map:{c1:'#3a2a6a',c2:'#8a7aa8',deco:[['🏛',50,18,28],['💚',30,70,24]]},nodes:[
 {id:'wi4a',t:'cine',name:'Un invitado inesperado',x:10,y:60,cine:{id:'c_wi4a',title:'Un invitado inesperado',world:2,cast:[{c:'broly',x:3,z:0,f:'lssj'},{c:'jiren',x:-3,z:0}],shots:[
  {who:'nar',say:'Una grieta en el espacio deja caer a Broly en mitad del Torneo del Poder.',cam:'wide',fx:'shake'},
  {who:'jiren',say:'Un poder sin control no es fuerza.',cam:'close'},{who:'broly',say:'¡GRAAAAH!',cam:'close',fx:'flash'}]}},
 {id:'wi4b',t:'fight',name:'Goku contra Broly en el Vacío',x:44,y:38,world:2,v:1,p:{c:'goku',f:'ssb',base:3e6,forms:['ssb','uio']},e:{c:'broly',f:'lssj',base:1.8e10,hp:1.7,forms:['lssj']},goal:{type:'survive',t:80},stars:[{type:'hp',v:.4,txt:'Resiste con más del 40 % de vida'}],coins:260},
 {id:'wi4c',t:'fight',name:'Broly y Goku contra Jiren',x:76,y:60,world:2,v:1,p:{c:'goku',f:'ui',base:3e6,forms:['ui']},ally:{c:'broly',f:'lssj',base:1.8e10,forms:['lssj']},e:{c:'jiren',f:'full',base:1.2e11,hp:2,forms:['full','limit']},goal:{type:'win'},stars:[{type:'ally',txt:'Broly sigue en pie al final'}],coins:300,
  cine:{id:'c_wi4c',title:'Saiyajin unidos',world:2,cast:[{c:'goku',x:-2,z:0,f:'ui'},{c:'broly',x:2,z:0,f:'lssj'}],shots:[{who:'goku',say:'¿Lo ves, Broly? Juntos somos más fuertes.',cam:'two',pose:'victory'},{who:'broly',say:'…Kakaroto. Amigo.',cam:'close'}]}}]}]});
