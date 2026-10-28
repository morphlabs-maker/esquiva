/* ---------------- Botones 2.0 (lista blanca de acciones, como el resto del juego) ---------------- */
const nodeById=id=>book&&book.nodes.find(n=>n.id===id);
Object.assign(ACTIONS,{
 openStory:()=>{initAudio();sfx('ok');storyMsg='';if(!music.track)playTrack('menu');menuState='story';renderMenu();},
 toStory:()=>{sfx('back');menuState='story';renderMenu();},
 openArc:a=>{const i=+a;if(Number.isInteger(i)&&i>=0&&i<ARCS.length)openArc(i);},
 openWhatifList:()=>{if(!storyAllDone()){storyMsg='Termina todos los arcos del modo historia para desbloquearlas.';sfx('back');renderMenu();return;}
  loadStory('whatif',WHATIF_FILE).then(()=>{menuState='whatif';sfx('ok');renderMenu();}).catch(()=>{storyMsg='No se pudo descargar. La primera vez necesita internet.';renderMenu();});},
 openWhatif:a=>{const i=+a;if(Number.isInteger(i)&&i>=0)openWhatif(i);},
 openGallery:()=>{sfx('ok');storyMsg='';const L=ARCS.filter((a,i)=>arcOpen(i)).map(a=>loadStory(a.id,a.file).catch(()=>{}));if(storyAllDone())L.push(loadStory('whatif',WHATIF_FILE).catch(()=>{}));
  menuState='gallery';renderMenu();Promise.all(L).then(()=>{if(menuState==='gallery')renderMenu();});},
 gPlay:a=>{const c=findCine(String(a));if(c&&cineSeen(c.id))cinePlay(c,()=>{menuState='gallery';renderMenu();});},
 dlAll:()=>downloadAll(),
 sDiff:()=>{prog.sdiff=(prog.sdiff+1)%DIFFS.length;saveProg();sfx('sel');renderMenu();},
 sNode:a=>{const n=nodeById(String(a));if(!n)return;selNode=n.id;sfx('sel');renderMenu();},
 sPlay:()=>{const n=nodeById(selNode);if(!n||!nodeOpen(n))return;sfx('ok');playNode(n);},
 sCine:()=>{const n=nodeById(selNode);if(n&&n.cine)cinePlay(n.cine,()=>{menuState='smap';renderMenu();});},
 sNext:()=>storyNext(),
 sRetry:()=>{const S=game.story;if(!S)return;$('#msg').classList.remove('show');$('#sub').innerHTML='';const n=S.n;storyStart(n);},
 sMapQuit:()=>{endStoryFight();renderMenu();},
 cineNext:()=>cineNext(),cineSkip:()=>cineEnd(),
 wish:a=>{if(WISHES.some(w=>w.id===a)&&prog.db.length>=7)grantWish(a);},
 openProfile:()=>{initAudio();sfx('ok');profView='main';xferMsg='';menuState='profile';renderMenu();},
 profView:a=>{if(['main','titles','ach','xfer'].includes(a)){profView=a;xferMsg='';sfx('sel');renderMenu();}},
 setTitle:a=>{if(prog.ach.includes(a)){prog.title=a;saveProg();sfx('ok');renderMenu();}},
 xfer:a=>{if(['copy','share','import'].includes(a))xferAct(a);},
 openChal:()=>{initAudio();sfx('ok');menuState='chal';renderMenu();},
 claimChal:a=>{if(claimChal(String(a)))sfx('ok');renderMenu();},
 tryOutfit:a=>{const id=String(a||'');if(id&&!outfitOf(id))return;tryOutfit=id;sfx('sel');renderMenu();},
 eqOutfit:a=>{const ch=CHARS[shopChar],id=String(a||'');if(!id)delete prog.ofEq[ch.id];else{const o=outfitOf(id);if(!o||o.who!==ch.id||!prog.ofOwn.includes(id))return;prog.ofEq[ch.id]=id;}tryOutfit=null;saveProg();sfx('ok');renderMenu();},
 buyOutfit:a=>{const o=outfitOf(String(a));if(!o||o.paid||prog.ofOwn.includes(o.id))return;if(prog.coins<o.price){outfitConfirm='';sfx('back');renderMenu();return;}
  if(outfitConfirm!==o.id){outfitConfirm=o.id;tryOutfit=o.id;sfx('sel');renderMenu();return;}outfitConfirm='';if(buyOutfit(o)){sfx('ok');tryOutfit=null;}renderMenu();},
 payOutfit:a=>{const o=outfitOf(String(a));if(o&&o.paid&&!prog.ofOwn.includes(o.id))paypalBuy(o);},
 ppClose:()=>{$('#ppbox').style.display='none';$('#ppbox').innerHTML='';},
 replay:()=>replayStart(),
 repCtl:a=>{const R=game.replay;if(!R)return;if(a==='pause')R.pause=!R.pause;else if(a==='spd')R.spd=R.spd===1?.5:R.spd===.5?.25:1;else if(a==='re'){R.i=0;R.pause=false;}else if(a==='exit'){replayExit();return;}renderRepBar();},
 photo:()=>photoStart(),
 phCtl:a=>{const P=game.photo;if(!P)return;if(a==='flt'){P.flt=(P.flt+1)%PH_FILTERS.length;renderPhotoBar();}else if(a==='shot')P.shot=true;else if(a==='exit')photoExit();
  else if(a==='tgt'){P.ti=((P.ti||0)+1)%game.f.length;const f=game.f[P.ti];if(f)P.tgt=f.chest();renderPhotoBar();}},
 dlgNext:()=>dlgNext(),dlgSkip:()=>dlgSkip()});
/* la tienda: cambiar de luchador reinicia el probador */
{const sp=ACTIONS.shopPick;ACTIONS.shopPick=a=>{tryOutfit=null;outfitConfirm='';probKey='';sp(a);};}
checkAchs();
