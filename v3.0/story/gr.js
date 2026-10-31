/* Kaioken Clash · Modo historia · Arco 10: Granolah y Black Freezer (manga, datos) */
KC_STORY({id:'gr',name:'Granolah y Black Freezer',nodes:[
{id:'gr0',t:'cine',name:'El último cerealiano',place:'Planeta Cereal',cine:{id:'c_gr0',title:'El último cerealiano',world:0,v:0,cast:[{c:'granolah',x:0,z:0}],shots:[
 {who:'nar',say:'Granolah, el último superviviente de su pueblo, pide un deseo a las esferas de Cereal.',cam:'wide'},
 {who:'granolah',say:'Quiero ser el más fuerte del universo… aunque me cueste la vida.',cam:'close',fx:'flash'}]}},
{id:'gr1',t:'fight',name:'Vegeta contra Granolah',place:'Ciudad de Cereal',world:0,
 p:{c:'vegeta',f:'ssb',base:2.6e6,forms:['ssb','ue']},e:{c:'granolah',f:'wish',base:9e10,hp:1.4,forms:['wish']},
 goal:{type:'win'},stars:[{type:'time',v:150,txt:'Gana en menos de 150 s'},{type:'hp',v:.4,txt:'Termina con más del 40 % de vida'}],coins:360,unlock:'granolah',
 pre:[['granolah','Los Saiyajin destruyeron a mi pueblo. Vosotros pagaréis.'],['vegeta','No huyo de nadie. Ni siquiera de mi pasado.']],
 cine:{id:'c_gr1',title:'El ego del destructor',world:0,cast:[{c:'vegeta',x:-3,z:0,f:'ssb'},{c:'granolah',x:3,z:0,f:'wish'}],shots:[
  {who:'vegeta',say:'Bills me enseñó algo: un dios de la destrucción no piensa en defenderse.',cam:'close',pose:'charge',aura:{vegeta:1.2}},
  {who:'nar',say:'Un aura morada y oscura envuelve a Vegeta: el Ultra Ego.',cam:'wide',form:'ue',fx:'flash'},
  {who:'vegeta',say:'Cuanto más me golpeas, más fuerte me vuelvo. Sigue.',cam:'close'}]}},
{id:'gr2',t:'fight',name:'Gas, el más fuerte',place:'Montañas de Cereal',world:0,v:1,
 p:{c:'goku',f:'ui',base:3e6,forms:['ssb','ui']},ally:{c:'granolah',f:'wish',base:9e10,forms:['wish']},e:{c:'gas',f:'wish',base:3e11,hp:1.8,forms:['wish','limit']},
 goal:{type:'win'},stars:[{type:'ally',txt:'Granolah sigue en pie al final'},{type:'ult',txt:'Lanza un definitivo'}],coins:380,unlock:'gas',
 pre:[['gas','El deseo de Elec me ha hecho invencible.'],['goku','Granolah, peleemos juntos. ¡Te cubro!']]},
{id:'gr2b',t:'fight',name:'Gas al límite',place:'Montañas de Cereal',world:0,v:1,
 p:{c:'goku',f:'ui',base:3e6,forms:['ui']},e:{c:'gas',f:'limit',base:3e11,hp:1.6,forms:['limit']},
 goal:{type:'survive',t:60},stars:[{type:'hp',v:.35,txt:'Resiste con más del 35 % de vida'},{type:'combo',v:10,txt:'Haz un combo de 10 golpes'}],coins:380,
 pre:[['gas','¡Más! ¡Quiero más poder, aunque me consuma!'],['goku','Te estás destruyendo, Gas. ¡Para ya!']],
 cine:{id:'c_gr2',title:'Una sombra negra',world:0,v:1,cast:[{c:'goku',x:-3,z:0,f:'ui'},{c:'vegeta',x:-5,z:2,f:'ue'},{c:'freezer',x:4,z:0,f:'golden'}],shots:[
  {who:'nar',say:'Cuando la batalla termina, una nave conocida aterriza en Cereal.',cam:'wide'},
  {who:'freezer',say:'Mientras vosotros jugabais, yo entrené diez años en la Habitación del Tiempo.',cam:'close',form:'black',fx:'shake'},
  {who:'nar',say:'De un solo golpe cada uno, Freezer deja fuera de combate a Goku y a Vegeta.',cam:'wide',fx:'hit:goku'},
  {who:'freezer',say:'Llamadme Black Freezer. Volveré cuando os hayáis recuperado. Ho, ho, ho.',cam:'close'}]}},
{id:'gr3',t:'fight',name:'Black Freezer',place:'Cereal en ruinas',world:0,v:1,
 p:{c:'goku',f:'ui',base:3e6,forms:['ui']},e:{c:'freezer',f:'black',base:5.3e5,hp:2,forms:['black']},
 goal:{type:'survive',t:45},stars:[{type:'hp',v:.3,txt:'Resiste con más del 30 % de vida'},{type:'ult',txt:'Lanza un definitivo'}],coins:420,
 pre:[['freezer','¿Todavía te mueves, mono? Qué terquedad.'],['goku','No voy a rendirme… nunca.']]},
{id:'gr4',t:'cine',name:'Continuará…',place:'Espacio',cine:{id:'c_gr4',title:'Continuará…',world:'bills',v:1,cast:[{c:'goku',x:-2,z:0},{c:'vegeta',x:2,z:1}],shots:[
 {who:'vegeta',say:'Freezer nos ha superado otra vez… Esto no quedará así.',cam:'close'},
 {who:'goku',say:'Entonces tendremos que entrenar más que nunca. ¡Juntos!',cam:'two',pose:'victory'},
 {who:'nar',say:'Fin del modo historia «Junto a Goku». Se han desbloqueado las historias «¿Qué pasaría si…?».',cam:'wide',fx:'flash'}]}}]});
