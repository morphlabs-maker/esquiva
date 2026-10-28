/* Kaioken Clash · Modo historia · Arco 8: Broly (datos) */
KC_STORY({id:'bro',name:'Broly',nodes:[
{id:'bro0',t:'cine',name:'El Saiyajin olvidado',place:'Antártida',cine:{id:'c_bro0',title:'El Saiyajin olvidado',world:5,cast:[{c:'broly',x:3,z:0},{c:'freezer',x:6,z:2,f:'golden'},{c:'vegeta',x:-3,z:0}],shots:[
 {who:'nar',say:'Freezer trae a la Tierra a Broly, un Saiyajin criado en un planeta salvaje.',cam:'wide'},
 {who:'freezer',say:'Vamos, Broly. Muéstrales a esos monos lo que es la verdadera fuerza.',cam:'close'},
 {who:'vegeta',say:'¿Un Saiyajin con ese poder? Será interesante.',cam:'close'}]}},
{id:'bro1',t:'fight',name:'Vegeta contra Broly',place:'Glaciar',world:5,
 p:{c:'vegeta',f:'ssg',base:2.6e6,forms:['ssg','ssb']},e:{c:'broly',base:1.8e10,hp:1.4,forms:['base','wrath']},
 goal:{type:'win'},stars:[{type:'time',v:140,txt:'Gana en menos de 140 s'},{type:'ult',txt:'Lanza un definitivo'}],coins:300,
 pre:[['vegeta','Aprende algo de técnica antes de pelear conmigo.'],['broly','…Pelea.']]},
{id:'bro1b',t:'fight',name:'Goku contra Broly',place:'Glaciar',world:5,
 p:{c:'goku',f:'ssg',base:3e6,forms:['ssg','ssb']},e:{c:'broly',f:'wrath',base:1.8e10,hp:1.4,forms:['wrath','ssj']},
 goal:{type:'survive',t:60},stars:[{type:'hp',v:.4,txt:'Resiste con más del 40 % de vida'},{type:'combo',v:8,txt:'Haz un combo de 8 golpes'}],coins:300,
 pre:[['goku','¡Eres increíble, Broly! ¡Cada vez más fuerte!'],['broly','¡KAKAROTO!']],
 cine:{id:'c_bro1b',title:'La furia de Broly',world:5,v:1,cast:[{c:'broly',x:2,z:0,f:'ssj'},{c:'goku',x:-4,z:0,f:'ssb'}],shots:[
  {who:'nar',say:'Freezer mata a Paragus delante de su hijo. Algo se rompe dentro de Broly.',cam:'wide',fx:'flash'},
  {who:'broly',say:'¡GRAAAAAAAH!',cam:'close',form:'lssj',fx:'shake'},
  {who:'goku',say:'Su poder… no deja de crecer. Así no podremos ganarle.',cam:'close'}]}},
{id:'bro2',t:'fight',name:'¡Broly descontrolado!',place:'Glaciar en la ventisca',world:5,v:1,boss:'broly',bossPow:5e10,bossHp:.6,
 p:{c:'goku',f:'ssb',base:3e6,forms:['ssb']},ally:{c:'vegeta',f:'ssb',base:2.6e6,forms:['ssb']},
 goal:{type:'survive',t:80},stars:[{type:'ally',txt:'Vegeta sigue en pie al final'},{type:'hp',v:.3,txt:'Resiste con más del 30 % de vida'}],coins:320,
 pre:[['goku','¡Su poder no deja de subir! ¡Vegeta, hay que fusionarse!'],['vegeta','¡Ni hablar! …Está bien. Solo esta vez.']],
 cine:{id:'c_bro2',title:'¡Fusión!',world:5,v:1,cast:[{c:'goku',x:-3,z:0},{c:'vegeta',x:3,z:0}],shots:[
  {who:'goku',say:'¡Fuuu…!',cam:'two',pose:'raise'},{who:'vegeta',say:'¡…sión!',cam:'two',pose:'raise'},
  {who:'nar',say:'De la danza de la fusión nace el guerrero definitivo: Gogeta.',cam:'wide',fx:'flash'}]}},
{id:'bro3',t:'fight',name:'Gogeta contra Broly',place:'La dimensión rota',world:4,v:1,
 p:{c:'gogeta',f:'ssb',base:6e7,forms:['ssg','ssb']},e:{c:'broly',f:'lssj',base:1.8e10,hp:1.8,forms:['lssj']},
 goal:{type:'win'},stars:[{type:'ult',txt:'Acaba con un definitivo'},{type:'hp',v:.5,txt:'Termina con más del 50 % de vida'}],coins:360,
 pre:[['gogeta','Soy Gogeta. Y voy a calmarte de una vez.'],['broly','¡GRAAAAH!']],
 cine:{id:'c_bro3',title:'El espacio se rompe',world:4,v:1,cast:[{c:'gogeta',x:-3,z:0,f:'ssb'},{c:'broly',x:3,z:0,f:'lssj'}],shots:[
  {who:'nar',say:'Los golpes de los dos guerreros resquebrajan el espacio. Ya no hay suelo ni cielo.',cam:'wide',fx:'shake'},
  {who:'gogeta',say:'Final… ¡KAMEHAMEHAAA!',cam:'low',pose:'beamFire',fx:'beam:broly:6fd8ff'}]}},
{id:'bro4',t:'cine',name:'Un deseo para Broly',place:'Planeta lejano',cine:{id:'c_bro4',title:'Un deseo para Broly',world:5,cast:[{c:'broly',x:2,z:0},{c:'goku',x:-3,z:0}],shots:[
 {who:'nar',say:'Cheelai pide un deseo: llevar a Broly a un lugar seguro.',cam:'wide',fx:'flash'},
 {who:'goku',say:'Volveré a visitarte, Broly. Te enseñaré a controlar ese poder.',cam:'close',pose:'victory'}]}}]});
