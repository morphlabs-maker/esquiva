/* =========================================================
   KAIOKEN CLASH 3.0 — 3D DE VERDAD
   Cámara en tercera persona detrás de tu luchador y movimiento libre por el espacio, relativo a la cámara.
   · Objetivo fijado (por defecto): la cámara mira al rival y A/D rodean al rival.
   · Objetivo libre (L o 🔓): la cámara la giras tú (ratón, ← →, o arrastrando el dedo) y el luchador mira hacia donde vuela.
   · Space sube, C/Mayús baja. En celular: botones ⤒ ⤓.
   · La cámara clásica (de lado) sigue disponible en la pausa. Online y 2 jugadores en una pantalla usan la clásica.
   ========================================================= */
let CAM3D=store.get('kc_cam3d',true),lock3=true,cy3=0,cp3=.12,drag3=null,camDragT=0;
const local2P=()=>['vs','2v1amigo','duo'].includes(game.mode);
function on3D(){const p=game.f[0];return CAM3D&&!!game.phase&&!game.online&&!!p&&human(p)&&!duoPhone()&&!local2P()&&!game.replay&&!game.photo;}
const angLerp=(a,b,k)=>{let d=b-a;d=Math.atan2(Math.sin(d),Math.cos(d));return a+d*k;};
/* coberturas: rocas y troncos tapan la línea de visión (la CPU no dispara si no te ve) */
function losBlocked(a,b){if(!world||!world.rocks)return false;const ax=a.pos.x,az=a.pos.z,dx=b.pos.x-ax,dz=b.pos.z-az,L2=dx*dx+dz*dz;if(L2<1)return false;
 for(const r of world.rocks){if(!r.alive)continue;const t=clamp(((r.x-ax)*dx+(r.z-az)*dz)/L2,0,1),px=ax+dx*t,pz=az+dz*t;if(Math.hypot(r.x-px,r.z-pz)<r.r*.9){const y=lerp(a.pos.y,b.pos.y,t)+1;if(y<r.top()&&y>r.y0-1&&t>.05&&t<.95)return true;}}return false;}
/* la cámara no atraviesa rocas: se acerca al luchador */
function camClip(from,to){if(!world||!world.rocks)return to;const dx=to.x-from.x,dz=to.z-from.z,L2=dx*dx+dz*dz;if(L2<.01)return to;let best=1;
 for(const r of world.rocks){if(!r.alive)continue;const t=clamp(((r.x-from.x)*dx+(r.z-from.z)*dz)/L2,0,1),px=from.x+dx*t,pz=from.z+dz*t;if(Math.hypot(r.x-px,r.z-pz)<r.r+.6){const y=lerp(from.y,to.y,t);if(y<r.top()+.5&&y>r.y0-1)best=Math.min(best,Math.max(.25,t-.08));}}
 return best<1?from.clone().lerp(to,best):to;}
function cam3D(dt){const p=game.f[0];if(!p||p.state==='ko'||p.benched)return false;
 const t=lock3&&p.opp&&p.opp.state!=='ko'&&!p.opp.benched?p.opp:null,g=Math.max(1,p.giant),CZ=1;
 if(t){const to=t.pos.clone().sub(p.pos);if(Math.hypot(to.x,to.z)>.6)cy3=angLerp(cy3,Math.atan2(to.x,to.z),1-Math.exp(-4.5*dt));}
 else if(camDragT<=0&&p.vel.lengthSq()>9)cy3=angLerp(cy3,p.face,1-Math.exp(-1.2*dt)); // sin objetivo, la cámara se coloca poco a poco detrás de ti
 camDragT-=dt;
 const F=V3(Math.sin(cy3),0,Math.cos(cy3)),Rt=V3(-F.z,0,F.x),dist=7.2*g*CZ*(t&&t.giant>1.5?1.25:1);
 const ch=p.pos.clone().add(V3(0,1.1*g,0));
 let tp=ch.clone().addScaledVector(F,-dist*Math.cos(cp3)).addScaledVector(Rt,.45*g).add(V3(0,1.55*g+dist*Math.sin(cp3),0));
 const gy=world?world.groundY(tp.x,tp.z):0;if(gy>-1e9&&tp.y<gy+.8)tp.y=gy+.8;
 tp=camClip(ch,tp);
 let look=ch.clone().addScaledVector(F,9).addScaledVector(Rt,.3).add(V3(0,.75*g-Math.sin(cp3)*3,0));
 if(t){const tc=t.chest();look.lerp(tc,clamp(9/Math.max(6,t.pos.distanceTo(p.pos)),.25,.6));}
 const k=1-Math.exp(-9*dt);cam.position.lerp(tp,k);camLook.lerp(look,k);return true;}
/* entrada del jugador en 3D: dirección en el mundo según la cámara */
function input3D(f){const i=f.inp;if(i.trans){i.mx=0;return;}
 const ax=(i.right?1:0)-(i.left?1:0),az=(i.up?1:0)-(i.down?1:0),pad=padFor(0),PH=c=>pad&&padHeld.has(pad+c);
 if(justPressed.has('KeyL')||justPressed.has('P0B10x')){lock3=!lock3;pop(f,lock3?'🎯 OBJETIVO FIJADO':'🔓 OBJETIVO LIBRE','#9fe8ff');sfx('sel');syncLockBtn();}
 if(!lock3){const r=(keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0);if(r){cy3-=r*2.4*STEP;camDragT=.6;}}
 const pu=(keys.has('ArrowUp')?1:0)-(keys.has('ArrowDown')?1:0);if(pu)cp3=clamp(cp3+pu*1.2*STEP,-.35,.75);
 const F=V3(Math.sin(cy3),0,Math.cos(cy3)),Rt=V3(-F.z,0,F.x),v=F.multiplyScalar(az).addScaledVector(Rt,ax);if(v.lengthSq()>1)v.normalize();
 i.v3={x:v.x,z:v.z};i.free=!lock3;
 const to=f.opp?f.opp.pos.clone().sub(f.pos):V3(0,0,1);to.y=0;if(to.lengthSq()>.01)to.normalize();i.mx=v.x*to.x+v.z*to.z;
 i.up=keys.has('Space')||PH('RU');i.down=keys.has('KeyC')||keys.has('ShiftLeft')||PH('RD');}
/* CPU en 3D: rodea al rival y busca la línea de visión */
function cpuStrafe(f,o){o.sx=Math.sin(performance.now()/1100+f.idx*2.3)>0?1:-1;}
/* ratón y dedo: arrastrar gira la cámara */
function camDragStart(x,y,id){if(!on3D()||game.paused)return;drag3={x,y,id};}
function camDragMove(x,y,id){if(!drag3||drag3.id!==id)return;const dx=x-drag3.x,dy=y-drag3.y;drag3.x=x;drag3.y=y;if(!lock3){cy3-=dx*.006;camDragT=1.5;}cp3=clamp(cp3+dy*.004,-.35,.75);}
canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0)camDragStart(e.clientX,e.clientY,e.pointerId);});
addEventListener('pointermove',e=>{if(e.pointerType==='mouse')camDragMove(e.clientX,e.clientY,e.pointerId);});
addEventListener('pointerup',e=>{if(drag3&&drag3.id===e.pointerId)drag3=null;});
(()=>{const z=$('#camZone');if(!z)return;z.addEventListener('pointerdown',e=>{e.preventDefault();try{z.setPointerCapture(e.pointerId);}catch(_){}camDragStart(e.clientX,e.clientY,e.pointerId);});
 z.addEventListener('pointermove',e=>camDragMove(e.clientX,e.clientY,e.pointerId));for(const t of['pointerup','pointercancel','lostpointercapture'])z.addEventListener(t,e=>{if(drag3&&drag3.id===e.pointerId)drag3=null;});})();
function syncLockBtn(){const b=$('#b3dlock');if(b)b.textContent=lock3?'🎯':'🔓';}
function set3DClass(){document.body.classList.toggle('c3d',on3D());}
setInterval(set3DClass,400);
/* al empezar cada ronda: cámara detrás de ti mirando al rival */
function cam3DReset(){const p=game.f[0];if(!p)return;lock3=true;syncLockBtn();const o=p.opp;cy3=o?Math.atan2(o.pos.x-p.pos.x,o.pos.z-p.pos.z):p.face;cp3=.12;}
Object.assign(ACTIONS,{cam3d:()=>{CAM3D=!CAM3D;store.set('kc_cam3d',CAM3D);sfx('sel');renderPause('main');set3DClass();}});
/* ---------------- Kaioken combinable: K (o KK) sube x3 → x10 → x20 → apagado, sobre cualquier forma y en cualquier momento (también en la historia) ---------------- */
const KK_LV=[0,3,10,20],kkCan=f=>!!f&&['goku','vegetto'].includes(f.ch.id)&&f.role!=='boss';
function kkSet(f,lv){if(f.kkL===lv)return;f.kkL=lv;f._kkVis=-1;if(lv){f.ki=Math.max(0,f.ki-.4);sfx('transform',.8);flashScreen(.25,'#ff3a3a');ring(f.chest(),0xff2a2a,5,.4,false,.2);pop(f,'¡KAIOKEN x'+lv+'!','#ff4a4a',true);}else{f.aura.setColor(f.form.aura);f.model.mats.skin.emissive.setHex(f.form.kk?0x661010:0);}}
function kkTick(f,dt){if(!kkCan(f)||f.state==='ko'){if(f.kkL)kkSet(f,0);return;}
 if(game.phase==='fight'&&!f.form.kk){
  if(human(f)&&f.idx===0&&!game.online&&(justPressed.has('KeyK')||(padFor(0)&&justPressed.has(padFor(0)+'B11')))){const i=KK_LV.indexOf(f.kkL||0);kkSet(f,KK_LV[(i+1)%KK_LV.length]);}
  else if(f.cpu&&!f.kkL&&f.hp<f.maxHp*.55&&Math.random()<dt*.08)kkSet(f,Math.random()<.6?3:10);}
 if(f.form.kk&&f.kkL)kkSet(f,0);
 if(!f.kkL)return;
 /* combinado con una transformación agota más rápido; nunca te deja K.O. (se apaga solo) */
 const drain=(f.kkL>=20?.07:f.kkL>=10?.035:.015)*(f.form.mult>1?1.6:1);f.hp-=f.maxHp*drain*dt*(game.mode==='train'?.3:1);
 if(f.hp<f.maxHp*.06){f.hp=Math.max(f.hp,f.maxHp*.05);kkSet(f,0);pop(f,'EL CUERPO NO AGUANTA','#ffb070');return;}
 if(f._kkVis!==f.formIdx){f._kkVis=f.formIdx;f.aura.setColor(f.form.mult>1?0xff2a5a:0xff2a2a);f.model.mats.skin.emissive.setHex(0x661010);}
 if(Math.random()<dt*10)spawn({pos:f.pos.clone().add(V3(rand(-.5,.5),rand(0,1.8)*f.sy(),rand(-.5,.5))),vel:V3(0,rand(2,5),0),color:0xff3a3a,size:rand(.3,.7),life:.4});}
setInterval(()=>{document.body.classList.toggle('cankk',!!game.phase&&kkCan(game.f[0])&&human(game.f[0]));},500);
