const {chromium}=require('/opt/node-tools/node_modules/playwright');
const D='/tmp/claude-0/-home-user/c488c0f1-c25f-52ed-b887-a5a2654d4987/scratchpad/kc/',S=D+'shots/';
(async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 for(const [vp,tag,mob] of [[{width:1280,height:720},'pc',false],[{width:844,height:390},'mob',true]]){
 const p=await b.newPage({viewport:vp,hasTouch:mob,isMobile:mob});
 await p.route(/three\.min\.js/,r=>r.fulfill({path:D+'three/package/build/three.min.js',contentType:'application/javascript'}));await p.route(/fonts\.g/,r=>r.abort());
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
 await p.goto('file:///home/user/kc/kaioken-clash-ultra.html');await p.waitForTimeout(2500);
 await p.evaluate(`game.mode='vs';game.world=0;game.sel=[0,CHARS.findIndex(c=>c.id==='cell')];game.startForm=[3,CHARS.find(c=>c.id==='cell').forms.length-1];startMatch();`);
 await p.waitForTimeout(4500);await p.screenshot({path:S+'b0'+tag+'.png'});
 await p.evaluate(`const F=game.f[0];F.ki=F.maxKi||99;F.kiBars=7;F.ki=99;F.doSpecial('ult');`);await p.waitForTimeout(1400);await p.screenshot({path:S+'b1'+tag+'.png'});
 await p.evaluate(`const F=game.f[1];F.ki=99;F.doSpecial('s1');game.f[1].aura.target=1;`);await p.waitForTimeout(900);await p.screenshot({path:S+'b2'+tag+'.png'});
 console.log(tag,errs.join('\n'));await p.close();}
 await b.close();})();
