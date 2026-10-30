/* Exporta los datos de Kaioken Clash (web) al proyecto Unity: node tools/unity-export/export.js
   Abre el juego compilado (tools/ultra-build/out/index.html) en Chromium y vuelca personajes, formas, técnicas, peinados,
   poses, outfits, versiones, mundos, canciones y todo el modo historia a unity/KaiokenClash/Assets/Resources/Data/kaioken.json */
const {chromium}=require('/opt/node-tools/node_modules/playwright'),fs=require('fs'),path=require('path');
const R=path.join(__dirname,'../../'),OUT=path.join(R,'unity/KaiokenClash/Assets/Resources/Data/kaioken.json');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
 const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 /* el juego compilado espera vendor/ y story/ junto a él */
 await p.goto('file://'+R+'index.html');await p.waitForTimeout(3000);
 const data=await p.evaluate(async()=>{for(const a of ARCS)await loadStory(a.id,a.file).catch(()=>{});await loadStory('whatif',WHATIF_FILE).catch(()=>{});
  const tech=t=>t?{name:t.name,type:t.type,color:t.color,pow:t.pow||0,w:t.w||0,thin:t.thin?1:0,n:t.n||0,size:t.size||0}:null;
  const form=f=>({id:f.id,name:f.name,mult:f.mult,cost:f.cost||0,drain:f.drain||0,era:f.era||'Z',hair:f.hair||'',hairColor:f.hairColor==null?-1:f.hairColor,aura:f.aura,auraOn:f.auraOn?1:0,kk:f.kk?1:0,hpDrain:f.hpDrain||0,ui:f.ui||0,giant:f.giant||0,
   scale:f.scale||null,colors:f.colors||null,extras:f.extras||null,eye:f.eye==null?-1:f.eye,pupil:f.pupil==null?-1:f.pupil,bolt:f.bolt?1:0});
  const ch=c=>({id:c.id,name:c.name,era:c.era,base:c.base,saiyan:c.saiyan?1:0,android:c.android?1:0,h:c.h||1,scale:c.scale||[1,1,1],head:c.head||[1,1,1],hair:c.hair||'none',hairColor:c.hairColor||0,
   colors:c.colors,extras:c.extras||[],unlock:c.unlock||'',ears:c.ears===false?0:1,s1:tech(c.s1),s2:tech(c.s2),ult:tech(c.ult),forms:c.forms.map(form),order:c.order||null,evade:c.evade||0,model:c.model||''});
  const songs={};for(const k in TRACKS)songs[k]={bpm:TRACKS[k].bpm,bass:TRACKS[k].bass,lead:TRACKS[k].lead};
  return{version:APP.version,chars:CHARS.map(ch),whis:ch(WHIS),hair:HAIR,poses:POSES,joints:JOINTS,fusions:FUSIONS,outfits:OUTFITS,techs:TECHS.map(t=>Object.assign({id:t.id,who:t.who,slot:t.slot,price:t.price||0},tech(t))),
   verData:VER_DATA,verK:VER_K,verM:VER_M,arcs:ARCS.map(a=>({id:a.id,n:a.n,name:a.name,color:a.color})),story:STORY,worlds:WORLDS.map((w,i)=>({i,name:w.name,desc:w.desc||'',vars:w.vars||[]})),songs,
   drainOfK:.002,maxHp:MAXHP,kiMax:KIMAX};});
 fs.writeFileSync(OUT,JSON.stringify(data));console.log('chars',data.chars.length,'arcs',Object.keys(data.story).length,'kB',Math.round(fs.statSync(OUT).size/1024),errs.join('|')||'OK');await b.close();})();
