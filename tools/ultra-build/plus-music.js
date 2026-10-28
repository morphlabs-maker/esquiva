/* =========================================================
   KAIOKEN CLASH 3.0 — UNA CANCIÓN PROPIA POR ARCO
   Melodías originales (no son las del anime): cada arco tiene su tonalidad, progresión, ritmo de bajo y motivo,
   con el carácter de su saga (aventura, tensión, épica, misterio…). 8 compases en corcheas.
   ========================================================= */
const SCALES={minor:[0,2,3,5,7,8,10],major:[0,2,4,5,7,9,11],harm:[0,2,3,5,7,8,11],dor:[0,2,3,5,7,9,10],phryg:[0,1,3,5,7,8,10]};
function songDeg(sc,root,d){const n=sc.length,o=Math.floor(d/n),i=((d%n)+n)%n;return root+sc[i]+12*o;}
const BASSPAT={drive:[0,0,12,0,0,0,12,0],gallop:[0,-1,0,0,-1,0,12,0],half:[0,-1,-1,-1,7,-1,-1,-1],walk:[0,-1,7,-1,12,-1,7,-1],pump:[0,0,0,0,0,0,0,0],syn:[0,-1,0,12,-1,0,12,-1]};
function mkSong(o){const sc=SCALES[o.mode],bass=[],lead=[];
 for(let bar=0;bar<8;bar++){const r=songDeg(sc,o.root-24,o.prog[bar]),P=BASSPAT[o.bass];for(let i=0;i<8;i++)bass.push(P[i]<0?0:r+P[i]);
  const ph=bar<4?o.a:o.b,ofs=bar>=4&&!o.b?(o.shift||0):0,M=(o.b&&bar>=4?o.b:o.a);
  for(let i=0;i<8;i++){const d=M[(bar%4)*8+i];lead.push(d==null?0:songDeg(sc,o.root,d+ofs));}}
 return{bpm:o.bpm,bass,lead};}
const _=null;
const ARC_SONGS={
 /* Saga Saiyajin: aventura luminosa */
 sai:{bpm:150,root:69,mode:'major',bass:'drive',prog:[0,3,4,0,5,3,4,4],
  a:[0,_,2,4,_,4,5,4, 2,_,0,_,1,2,_,_, 4,_,5,7,_,7,8,7, 5,_,4,_,2,_,_,_],
  b:[7,_,7,8,7,5,4,_, 5,_,5,7,5,4,2,_, 4,_,2,_,4,5,7,_, 8,_,7,_,_,_,_,_]},
 /* Namek: tensión en un planeta lejano */
 nam:{bpm:136,root:62,mode:'harm',bass:'gallop',prog:[0,0,5,4,0,3,5,4],
  a:[0,_,_,2,3,_,2,0, 6,_,_,_,4,_,_,_, 0,_,_,2,3,_,4,5, 4,_,3,_,2,_,_,_],
  b:[7,_,6,_,5,_,4,_, 5,_,4,_,3,_,2,_, 3,4,5,_,7,_,6,_, 7,_,_,_,_,_,_,_]},
 /* Androides y Cell: rock que no para */
 cel:{bpm:160,root:64,mode:'minor',bass:'syn',prog:[0,0,5,6,0,0,3,4],
  a:[0,0,_,0,3,_,4,_, 0,0,_,0,6,_,5,_, 0,0,_,0,3,_,4,_, 7,_,6,_,4,_,3,_],
  b:[7,_,7,_,6,7,_,9, 7,_,6,_,4,_,3,_, 4,_,4,_,3,4,_,6, 7,_,_,_,9,_,_,_]},
 /* Majin Buu: travieso y amenazante */
 buu:{bpm:144,root:67,mode:'dor',bass:'walk',prog:[0,3,0,3,5,4,0,4],
  a:[0,_,2,_,4,2,0,_, 3,_,5,_,6,5,3,_, 0,_,2,_,4,2,0,_, 4,3,2,_,1,_,_,_],
  b:[7,_,6,_,7,_,4,_, 5,_,4,_,5,_,2,_, 3,4,5,6,7,_,5,_, 4,_,_,_,0,_,_,_]},
 /* Dioses: majestuoso */
 god:{bpm:118,root:65,mode:'major',bass:'half',prog:[0,4,5,3,0,4,3,4],
  a:[4,_,_,_,5,_,4,_, 2,_,_,_,0,_,_,_, 3,_,_,_,4,_,5,_, 7,_,_,_,_,_,_,_],
  b:[9,_,_,_,8,_,7,_, 5,_,_,_,4,_,_,_, 5,_,7,_,8,_,9,_, 7,_,_,_,_,_,_,_]},
 /* Trunks del futuro y Black: melancolía heroica */
 tr:{bpm:150,root:60,mode:'minor',bass:'drive',prog:[0,5,2,6,0,5,3,4],
  a:[4,_,3,_,2,_,0,_, 2,_,_,3,4,_,_,_, 4,_,3,_,2,_,0,_, 6,_,_,4,_,_,_,_],
  b:[7,_,6,_,4,_,6,7, 9,_,_,7,_,6,_,_, 7,_,6,_,4,_,3,_, 4,_,_,_,_,_,_,_]},
 /* Torneo del Poder: épica de supervivencia */
 tp:{bpm:164,root:71,mode:'minor',bass:'pump',prog:[0,5,3,4,0,5,6,4],
  a:[0,_,0,2,3,_,_,2, 3,_,4,_,5,_,_,_, 3,_,3,4,5,_,_,4, 5,_,6,_,7,_,_,_],
  b:[7,_,_,6,7,_,9,_, 10,_,_,9,7,_,6,_, 5,_,_,4,5,_,6,_, 7,_,_,_,_,_,_,_]},
 /* Broly: furia pesada */
 bro:{bpm:170,root:54,mode:'phryg',bass:'gallop',prog:[0,1,0,1,0,6,5,1],
  a:[7,7,_,7,8,_,7,_, 5,_,4,_,3,_,1,_, 7,7,_,7,8,_,10,_, 8,_,7,_,_,_,_,_],
  b:[10,_,8,_,7,_,8,_, 10,_,11,_,10,_,8,_, 7,_,5,_,4,_,3,_, 1,_,_,_,0,_,_,_]},
 /* Moro: magia oscura */
 mor:{bpm:138,root:63,mode:'harm',bass:'half',prog:[0,6,5,4,0,6,3,4],
  a:[0,_,1,_,2,_,1,0, 6,_,_,_,_,_,_,_, 0,_,1,_,2,_,4,2, 4,_,_,_,_,_,_,_],
  b:[7,_,6,_,5,_,4,_, 3,_,_,4,_,_,_,_, 2,_,3,_,4,_,6,_, 7,_,_,_,_,_,_,_]},
 /* Granolah: el último de su pueblo */
 gr:{bpm:132,root:69,mode:'dor',bass:'walk',prog:[0,6,5,4,0,3,6,4],
  a:[0,_,_,4,_,3,2,_, 0,_,_,_,6,_,_,_, 0,_,_,4,_,5,6,_, 4,_,_,_,_,_,_,_],
  b:[7,_,_,6,_,4,6,_, 7,_,_,_,9,_,_,_, 7,_,6,_,4,_,3,_, 2,_,_,_,0,_,_,_]},
 /* ¿Qué pasaría si…?: sueño extraño */
 whatif:{bpm:126,root:64,mode:'dor',bass:'syn',prog:[0,3,5,4,0,3,6,4],
  a:[0,2,4,_,6,_,4,2, 3,_,_,_,5,_,_,_, 0,2,4,_,6,_,7,_, 6,_,4,_,_,_,_,_],
  b:[9,_,7,_,6,_,4,_, 5,_,6,_,7,_,_,_, 4,_,6,_,7,_,9,_, 7,_,_,_,_,_,_,_]}};
for(const k in ARC_SONGS)TRACKS['arc_'+k]=mkSong(ARC_SONGS[k]);
const arcTrack=id=>{if(id&&/^wi/.test(id))id='whatif';return id&&TRACKS['arc_'+id]?'arc_'+id:null;};
