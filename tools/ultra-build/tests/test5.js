const {chromium}=require('/opt/node-tools/node_modules/playwright');const fs=require('fs');
const S='/tmp/claude-0/-home-user/c488c0f1-c25f-52ed-b887-a5a2654d4987/scratchpad/kc/shots/';
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const ctx=await b.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true});
 for(const pg of ['index.html','ultra.html']){const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('http://localhost:8765/'+pg);await p.waitForTimeout(4000);
  const sw=await p.evaluate(`navigator.serviceWorker.controller?'ctrl':'noctrl'`);
  const busyMenu=await p.evaluate(`(()=>{const m=document.getElementById('menu');return getComputedStyle(m).display})()`);
  await p.evaluate(`game.mode='cpu';game.world=0;game.sel=[0,1];game.startForm=[0,0];startMatch();`);await p.waitForTimeout(3500);
  const busyFight=await p.evaluate(`getComputedStyle(document.getElementById('menu')).display+' '+game.phase`);
  await p.screenshot({path:S+'srv_'+pg+'.png'});
  console.log(pg,sw,'menu:',busyMenu,'fight:',busyFight,errs.join('|'));await p.close();}
 // offline
 await ctx.setOffline(true);const p=await ctx.newPage();await p.goto('http://localhost:8765/ultra.html').catch(e=>console.log('offline fail',e.message));await p.waitForTimeout(3000);
 console.log('offline title:',await p.title(),await p.evaluate(`typeof THREE`));await b.close();})();
