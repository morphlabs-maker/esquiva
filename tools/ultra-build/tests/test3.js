const {chromium}=require('/opt/node-tools/node_modules/playwright');
const D='/tmp/claude-0/-home-user/c488c0f1-c25f-52ed-b887-a5a2654d4987/scratchpad/kc/',S=D+'shots/';
(async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:1280,height:720}});
 await p.route(/three\.min\.js/,r=>r.fulfill({path:D+'three/package/build/three.min.js',contentType:'application/javascript'}));await p.route(/fonts\.g/,r=>r.abort());
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_FAILED/.test(m.text()))errs.push(m.text())});
 await p.goto('file:///home/user/kc/kaioken-clash-ultra.html');await p.waitForTimeout(2500);
 /* alineación de varios luchadores en el menú para comparar alturas y diseños */
 const lineup=async(name,list)=>{await p.evaluate(`(()=>{window.updateCamera=function(){};game.mode='vs';game.world=0;game.sel=[0,1];game.startForm=[0,0];startMatch();game.phase='intro';
  window._lu&&window._lu.forEach(m=>scene.remove(m.root));window._lu=[];const L=${JSON.stringify(list)};L.forEach((e,i)=>{const ch=e[0]==='whis'?WHIS:CHARS.find(c=>c.id===e[0]);const m=buildModel(ch);const fi=ch.forms.findIndex(f=>f.id===e[1]);applyFormModel(m,ch,ch.forms[Math.max(0,fi)],0);m.root.position.set((i-(L.length-1)/2)*1.4,1,30);m.root.rotation.y=0;scene.add(m.root);window._lu.push(m);});
  for(const f of game.f){f.model.root.visible=false;}cam.position.set(0,2.2,36.5);camLook.set(0,1.9,30);})()`);
  await p.waitForTimeout(800);await p.evaluate(`cam.position.set(0,2.2,36.5);cam.lookAt(0,1.9,30);`);await p.screenshot({path:S+name+'.png'});};
 await lineup('L1',[['goku','base'],['goku','ssj4'],['goku','ssg'],['vegeta','ssj4'],['freezer','f50'],['piccolo','base'],['bills','base']]);
 await p.evaluate(`window._lu.forEach(m=>{m.root.rotation.y=Math.PI/2;})`);await p.waitForTimeout(300);await p.screenshot({path:S+'L1side.png'});
 await lineup('L2',[['gamma1','base'],['gamma2','base'],['krilin','base'],['cell','perf'],['moro','old'],['whis','angel'],['gogeta','ssj4']]);
 await p.evaluate(`(()=>{window._lu.forEach(m=>{m.root.rotation.y=Math.PI;});})()`);await p.waitForTimeout(300);await p.screenshot({path:S+'L2back.png'});
 await p.evaluate(`toMenu('title');game.mode='cpu';menuState='chars';pst=['char','char'];renderMenu();`);await p.waitForTimeout(800);await p.screenshot({path:S+'sel.png'});
 for(const bi of [1,2]){await p.evaluate(`window.updateCamera=undefined;toMenu('title');game.mode='boss';game.bossSel=${bi};menuState='boss';renderMenu();`);await p.waitForTimeout(1500);await p.screenshot({path:S+'boss'+bi+'.png'});}
 console.log(errs.join('\n'));await b.close();})();
