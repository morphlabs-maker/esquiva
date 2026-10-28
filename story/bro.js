/* Kaioken Clash · Modo historia · Arco 8: Broly (datos) */
KC_STORY({id:'bro',name:'Broly',map:{c1:'#a8d8ff',c2:'#e8f0ff',deco:[['❄',16,30,22],['🧊',40,74,24],['🛸',62,24,24],['⚡',84,64,24]]},nodes:[
{id:'bro0',t:'cine',name:'El Saiyajin olvidado',place:'Polo Norte',x:8,y:60,cine:{id:'c_bro0',title:'El Saiyajin olvidado',world:0,cast:[{c:'broly',x:3,z:0},{c:'freezer',x:6,z:2,f:'golden'},{c:'vegeta',x:-3,z:0}],shots:[
 {who:'nar',say:'Freezer trae a la Tierra a Broly, un Saiyajin criado en un planeta salvaje.',cam:'wide'},
 {who:'freezer',say:'Vamos, Broly. Muéstrales a esos monos lo que es la verdadera fuerza.',cam:'close'},
 {who:'vegeta',say:'¿Un Saiyajin con ese poder? Será interesante.',cam:'close'}]}},
{id:'bro1',t:'fight',name:'Vegeta contra Broly',place:'Glaciar',x:24,y:42,world:0,
 p:{c:'vegeta',f:'ssg',base:2.6e6,forms:['ssg','ssb']},e:{c:'broly',base:1.8e10,hp:1.4,forms:['base','wrath']},
 goal:{type:'win'},stars:[{type:'time',v:140,txt:'Gana en menos de 140 s'},{type:'ult',txt:'Lanza un definitivo'}],coins:300,
 pre:[['vegeta','Aprende algo de técnica antes de pelear conmigo.'],['broly','…Pelea.']]},
{id:'bro2',t:'fight',name:'¡Broly descontrolado!',place:'Glaciar destrozado',x:44,y:66,world:0,v:1,boss:'broly',bossPow:5e10,bossHp:.6,
 p:{c:'goku',f:'ssb',base:3e6,forms:['ssb']},ally:{c:'vegeta',f:'ssb',base:2.6e6,forms:['ssb']},
 goal:{type:'survive',t:80},stars:[{type:'ally',txt:'Vegeta sigue en pie al final'},{type:'hp',v:.3,txt:'Resiste con más del 30 % de vida'}],coins:320,
 pre:[['goku','¡Su poder no deja de subir! ¡Vegeta, hay que fusionarse!'],['vegeta','¡Ni hablar! …Está bien. Solo esta vez.']],
 cine:{id:'c_bro2',title:'¡Fusión!',world:0,v:1,cast:[{c:'goku',x:-3,z:0},{c:'vegeta',x:3,z:0}],shots:[
  {who:'goku',say:'¡Fuuu…!',cam:'two',pose:'raise'},{who:'vegeta',say:'¡…sión!',cam:'two',pose:'raise'},
  {who:'nar',say:'De la danza de la fusión nace el guerrero definitivo: Gogeta.',cam:'wide',fx:'flash'}]}},
{id:'bro3',t:'fight',name:'Gogeta contra Broly',place:'La dimensión rota',x:66,y:36,world:4,v:1,
 p:{c:'gogeta',f:'ssb',base:6e7,forms:['ssg','ssb']},e:{c:'broly',f:'lssj',base:1.8e10,hp:1.8,forms:['lssj']},
 goal:{type:'win'},stars:[{type:'ult',txt:'Acaba con un definitivo'},{type:'hp',v:.5,txt:'Termina con más del 50 % de vida'}],coins:360,
 pre:[['gogeta','Soy Gogeta. Y voy a calmarte de una vez.'],['broly','¡GRAAAAH!']]},
{id:'bro4',t:'cine',name:'Un deseo para Broly',place:'Planeta lejano',x:90,y:56,cine:{id:'c_bro4',title:'Un deseo para Broly',world:0,cast:[{c:'broly',x:2,z:0},{c:'goku',x:-3,z:0}],shots:[
 {who:'nar',say:'Cheelai pide un deseo: llevar a Broly a un lugar seguro.',cam:'wide',fx:'flash'},
 {who:'goku',say:'Volveré a visitarte, Broly. Te enseñaré a controlar ese poder.',cam:'close',pose:'victory'}]}}]});
