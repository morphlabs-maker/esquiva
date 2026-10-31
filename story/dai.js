/* Kaioken Clash · Modo historia · Arco especial: Daima (datos). Va entre la saga de Buu y la de los Dioses. */
KC_STORY({id:'dai',name:'Daima',nodes:[
{id:'dai0',t:'cine',name:'El Reino Demoníaco',place:'Reino Demoníaco',cine:{id:'c_dai0',title:'Las Esferas del Reino Demoníaco',world:4,cast:[{c:'goku',x:-2,z:0},{c:'vegeta',x:-4,z:1}],shots:[
 {who:'nar',say:'Un deseo a Shenlong deja a Goku y a sus amigos convertidos en niños.',cam:'wide',card:'DAIMA'},
 {who:'nar',say:'Para deshacerlo viajan al Reino Demoníaco, donde unas Esferas del Dragón propias esperan custodiadas.',cam:'wide'},
 {who:'goku',say:'Dicen que cada esfera tiene un guardián. ¡Qué ganas de verlos!',cam:'close'},
 {who:'vegeta',say:'Guardianes o no, nadie se interpone entre el príncipe de los Saiyajin y lo que quiere.',cam:'close',pose:'crossArms'}]}},
{id:'dai1',t:'fight',name:'El guardián de la espada',place:'Templo de la primera esfera',world:4,
 p:{c:'vegeta',f:'ssj2',base:2.6e6,forms:['ssj','ssj2','ssj3']},e:{c:'tama1',base:9e8,hp:1.3,forms:['base']},
 goal:{type:'win'},stars:[{type:'combo',v:8,txt:'Haz un combo de 8 golpes'},{type:'hp',v:.4,txt:'Termina con más del 40 % de vida'}],coins:240,
 pre:[['tama1','…'],['vegeta','Una lata con una espada. Esto acabará pronto.']],
 intro:{id:'c_dai1i',title:'Guardián N.º 1',world:4,cast:[{c:'vegeta',x:-3,z:0,f:'ssj2'},{c:'tama1',x:3,z:0,under:1}],shots:[
  {who:'nar',say:'Del suelo del templo surge el primer guardián: un guerrero de metal con una espada curva.',cam:'wide',rise:['tama1'],card:'GUARDIÁN N.º 1'},
  {who:'vegeta',say:'Por fin algo que golpear.',cam:'close'}]}},
{id:'dai2',t:'cine',name:'Un poder que nunca mostró',place:'Templo de la segunda esfera',cine:{id:'c_dai2',title:'Super Saiyajin 3',world:4,cast:[{c:'vegeta',x:0,z:0,f:'ssj2'},{c:'goku',x:-4,z:2}],shots:[
 {who:'goku',say:'¡Vegeta! Ese guardián de la lanza es muy rápido.',cam:'two'},
 {who:'vegeta',say:'Kakaroto, ¿creías que eras el único que podía hacer esto?',cam:'close'},
 {who:'nar',say:'El suelo tiembla. El pelo de Vegeta crece hasta la espalda y sus cejas desaparecen.',cam:'wide',fx:'shake',aura:{vegeta:1}},
 {who:'vegeta',say:'¡Super Saiyajin 3!',cam:'close',form:'ssj3',fx:'flash',card:'VEGETA SUPER SAIYAJIN 3'}]}},
{id:'dai3',t:'fight',name:'El guardián de la lanza',place:'Templo de la segunda esfera',world:4,v:1,
 p:{c:'vegeta',f:'ssj3',base:2.6e6,forms:['ssj3']},e:{c:'tama2',base:1.05e9,hp:1.4,forms:['base']},
 goal:{type:'win'},stars:[{type:'time',v:140,txt:'Gana en menos de 140 s'},{type:'combo',v:10,txt:'Haz un combo de 10 golpes'}],coins:260,
 pre:[['tama2','…'],['vegeta','Tu lanza no me alcanzará.']],
 intro:{id:'c_dai3i',title:'Guardián N.º 2',world:4,cast:[{c:'vegeta',x:-3,z:0,f:'ssj3'},{c:'tama2',x:3,z:0}],shots:[
  {who:'nar',say:'El segundo guardián, alto y delgado, gira su tridente dorado.',cam:'wide',card:'GUARDIÁN N.º 2'},
  {who:'vegeta',say:'Ven. Te enseñaré lo que es un Saiyajin de verdad.',cam:'close'}]}},
{id:'dai4',t:'fight',name:'El guardián del martillo',place:'Templo de la tercera esfera',world:4,
 p:{c:'vegeta',f:'ssj3',base:2.6e6,forms:['ssj','ssj2','ssj3']},e:{c:'tama3',base:1.2e9,hp:1.7,forms:['base']},
 goal:{type:'win'},stars:[{type:'ult',txt:'Lanza un definitivo'},{type:'hp',v:.3,txt:'Termina con más del 30 % de vida'}],coins:280,
 pre:[['tama3','…'],['vegeta','Gordo, lento y con un martillo. Qué original.']],
 intro:{id:'c_dai4i',title:'Guardián N.º 3',world:4,cast:[{c:'vegeta',x:-3,z:0,f:'ssj3'},{c:'tama3',x:3,z:0}],shots:[
  {who:'nar',say:'El último guardián es el más pesado. Su martillo hace temblar el templo entero.',cam:'wide',fx:'shake',card:'GUARDIÁN N.º 3'},
  {who:'vegeta',say:'Cuanto más grandes, más ruido hacen al caer.',cam:'close',pose:'crossArms'}]}},
{id:'dai5',t:'cine',name:'Las tres esferas',place:'Reino Demoníaco',cine:{id:'c_dai5',title:'El regreso',world:4,cast:[{c:'vegeta',x:-2,z:0,f:'ssj3'},{c:'goku',x:2,z:0}],shots:[
 {who:'goku',say:'¡Lo hiciste, Vegeta! ¡Los tres guardianes!',cam:'two'},
 {who:'vegeta',say:'Hmph. Era lo mínimo.',cam:'close',pose:'crossArms'},
 {who:'nar',say:'Y en la batalla final contra Gomah, Goku despierta un poder olvidado.',cam:'wide',fx:'shake'},
 {who:'goku',say:'¡Super Saiyajin 4!',cam:'close',form:'ssj4',fx:'flash',card:'SUPER SAIYAJIN 4'}]}}]});
