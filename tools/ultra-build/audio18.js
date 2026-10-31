/* ---------------- Audio: impactos en capas, voces sintetizadas, gritos y música orquestal-electrónica ---------------- */
let AC=null,master,sfxBus,musBus,musSend,NOISE,humG,humF;let musicOn=store.get('kc_music',true),voicesOn=store.get('kc_voices',true);
function initAudio(){if(AC){if(AC.state==='suspended'&&AC.resume)AC.resume().catch(()=>{});return;}try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(AC.destination);
 master=AC.createGain();master.gain.value=.6;master.connect(comp);sfxBus=AC.createGain();sfxBus.gain.value=.9;sfxBus.connect(master);musBus=AC.createGain();musBus.gain.value=musicOn?.3:0;musBus.connect(master);
 const dl=AC.createDelay(1),fb=AC.createGain(),dlf=AC.createBiquadFilter();dl.delayTime.value=.32;fb.gain.value=.32;dlf.type='lowpass';dlf.frequency.value=2200;musSend=AC.createGain();musSend.gain.value=.5;musSend.connect(dl);dl.connect(dlf);dlf.connect(fb);fb.connect(dl);dlf.connect(musBus);
 NOISE=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const d=NOISE.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 /* zumbido continuo del aura: sube con la energía de los luchadores */
 const hs=AC.createBufferSource();hs.buffer=NOISE;hs.loop=true;humF=AC.createBiquadFilter();humF.type='bandpass';humF.frequency.value=220;humF.Q.value=.9;humG=AC.createGain();humG.gain.value=0;hs.connect(humF);humF.connect(humG);humG.connect(sfxBus);hs.start();}
function setHum(level){if(!AC||!humG)return;humG.gain.setTargetAtTime(Math.min(.28,level*.2),AC.currentTime,.15);humF.frequency.setTargetAtTime(180+level*160,AC.currentTime,.2);}
function tone(type,f0,f1,dur,vol,delay=0,bus,lp){if(!AC)return;const t=AC.currentTime+Math.max(0,delay),o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),t+Math.min(.012,dur*.2));g.gain.exponentialRampToValueAtTime(.0001,t+dur);let n=o;if(lp){const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;o.connect(f);n=f;}n.connect(g);g.connect(bus||sfxBus);o.start(t);o.stop(t+dur+.02);}
function noise(dur,vol,ftype,f0,f1,delay=0,bus,q=1){if(!AC)return;const t=AC.currentTime+Math.max(0,delay),s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NOISE;s.loop=true;f.type=ftype;f.Q.value=q;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur);
 g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(bus||sfxBus);s.start(t,Math.random()*1.5);s.stop(t+dur+.02);}
/* Voz humana sintetizada: cuerda vocal (diente de sierra con vibrato) + aliento, filtrados por los formantes de cada vocal */
const VOW={a:[780,1180,2500],e:[480,1750,2500],o:[520,880,2450],u:[340,780,2350],i:[310,2150,2950]};
function voice(pitch,vw,dur,vol=.5,slide=1,breath=.3,delay=0,attack='h'){if(!AC||!voicesOn)return;const t=AC.currentTime+delay,F=VOW[vw]||VOW.a;
 const o=AC.createOscillator(),lfo=AC.createOscillator(),lg=AC.createGain(),src=AC.createGain(),out=AC.createGain();o.type='sawtooth';
 o.frequency.setValueAtTime(pitch,t);if(slide>1)o.frequency.linearRampToValueAtTime(pitch*slide,t+dur*.35);o.frequency.exponentialRampToValueAtTime(Math.max(40,pitch*slide),t+dur);
 lfo.frequency.value=5.5+Math.random()*2;lg.gain.value=pitch*.035;lfo.connect(lg);lg.connect(o.frequency);o.connect(src);src.gain.value=1.6;
 const nb=AC.createBufferSource();nb.buffer=NOISE;nb.loop=true;const ng=AC.createGain();ng.gain.value=breath*1.4;nb.connect(ng);ng.connect(src);
 for(let i=0;i<3;i++){const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=F[i]*(pitch>220?1.12:1);bp.Q.value=[6,8,10][i];const fg=AC.createGain();fg.gain.value=[1.3,.8,.45][i];src.connect(bp);bp.connect(fg);fg.connect(out);}
 out.gain.setValueAtTime(.0001,t);out.gain.exponentialRampToValueAtTime(vol,t+.025);out.gain.setValueAtTime(vol,t+Math.max(.03,dur*.6));out.gain.exponentialRampToValueAtTime(.0001,t+dur);out.connect(sfxBus);
 if(attack==='k')noise(.035,vol*.8,'highpass',3200,2500,delay);else if(attack==='h')noise(.06,vol*.5,'bandpass',1600,1200,delay,null,1.5);
 o.start(t);lfo.start(t);nb.start(t,Math.random());o.stop(t+dur+.05);lfo.stop(t+dur+.05);nb.stop(t+dur+.05);}
/* Gritos y sonidos de esfuerzo de cada luchador (tono de voz propio; los gigantes suenan más graves) */
function vox(f,kind,k=1){if(!AC||!voicesOn||!f||!f.ch||!f.model)return;const now=AC.currentTime;if(f.vNext&&now<f.vNext&&kind!=='ko'&&kind!=='scream')return;
 const p=(f.ch.voice||150)*(f.giant>2?.6:1)*(1+rand(-.04,.04));let dur=.2;
 switch(kind){
  case'kiai':dur=rand(.1,.16);voice(p*1.15,Math.random()<.5?'a':'e',dur,.55,.82,.25,0,Math.random()<.5?'h':'k');break;
  case'heavy':dur=.3;voice(p*1.2,'a',dur,.75,.75,.35,0,'h');break;
  case'hurt':dur=.18;voice(p*.95,Math.random()<.5?'u':'o',dur,.5,.7,.45,0,'');break;
  case'hurtBig':dur=.42;voice(p*1.25,'a',dur,.7,.55,.55,0,'h');break;
  case'scream':dur=k;voice(p*1.1,'a',dur,.65,1.35,.4,0,'h');voice(p*1.66,'a',dur,.2,1.35,.2);break;
  case'shout':dur=.55;voice(p*1.25,'a',dur,.75,.9,.35,0,'h');break;
  case'effort':dur=.35;voice(p*.9,'u',dur,.45,1.1,.5,0,'');break;
  case'pant':dur=.5;noise(.22,.2,'bandpass',1300,900,0,null,1.2);noise(.26,.15,'bandpass',900,700,.28,null,1.2);break;
  case'dodge':dur=.12;noise(.12,.16,'bandpass',1500,800,0,null,1.4);break;
  case'ko':dur=1.1;voice(p*1.3,'a',dur,.7,.45,.5,0,'h');break;}
 f.vNext=now+dur*.85;if(kind!=='pant'&&kind!=='dodge')f.model.yell=Math.max(f.model.yell||0,dur);}
/* grito largo sin luchador asociado (p. ej. Broly perdiendo el control) */
function scream(dur,pitch=150){voice(pitch*1.1,'a',dur,.7,1.4,.45,0,'h');voice(pitch*1.7,'a',dur,.22,1.4,.2);}
/* Nombres de las técnicas en voz alta (si el navegador tiene voz en español) */
let speechVoice=null;function pickSpeech(){try{const vs=speechSynthesis.getVoices();speechVoice=vs.find(v=>/^es/i.test(v.lang))||null;}catch(e){}}
try{if(window.speechSynthesis){pickSpeech();speechSynthesis.onvoiceschanged=pickSpeech;}}catch(e){}
function say(f,text){if(!voicesOn||!window.speechSynthesis||!text||!f||!f.ch)return;try{const u=new SpeechSynthesisUtterance(text.replace(/\(.*?\)/g,''));u.lang='es-ES';if(speechVoice)u.voice=speechVoice;u.pitch=clamp((f.ch.voice||150)/150,.1,2);u.rate=1.08;u.volume=1;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}}
function sfx(n,k=1){if(!AC)return;switch(n){
 case'hitL':tone('sine',170,55,.11,.55*k);noise(.08,.6*k,'lowpass',4200,900);noise(.025,.3*k,'highpass',5200,4800);break;
 case'hitH':tone('sine',120,30,.38,.85*k);tone('triangle',70,38,.45,.45*k);noise(.32,.85*k,'lowpass',2600,140);noise(.12,.5*k,'bandpass',900,600,0,null,3);break;
 case'block':tone('triangle',460,300,.1,.3);noise(.08,.35,'bandpass',2300,1800,0,null,4);tone('sine',130,60,.12,.35);break;
 case'blast':tone('triangle',900,220,.14,.16);noise(.1,.18,'highpass',2800,2400);noise(.12,.15,'bandpass',500,300,0,null,2);break;
 case'tele':tone('sine',1300,2800,.07,.14);noise(.1,.2,'bandpass',2600,700,0,null,2);break;
 case'swing':noise(.13,.24,'bandpass',500,2600,0,null,1.4);break;
 case'dodge':noise(.18,.22,'bandpass',2000,450,0,null,1.2);break;
 case'tink':tone('triangle',2600,2400,.09,.14);noise(.05,.15,'highpass',4000,4000);break;
 case'charge':noise(.36,.2,'lowpass',380,220);noise(.3,.08,'bandpass',2500,3500,0,null,6);break;
 case'beamCharge':tone('sine',160,800,k,.14);noise(k,.16,'bandpass',300,2600,0,null,3);tone('sawtooth',80,140,k,.06,0,null,500);break;
 case'beamFire':noise(.9,.55,'lowpass',2600,500);tone('sawtooth',90,60,.9,.18,0,null,700);noise(.5,.25,'bandpass',1200,3000,0,null,2);break;
 case'boom':noise(1.3*k,.95*k,'lowpass',1600,60);tone('sine',85,24,1.1*k,.85*k);noise(.15,.4*k,'highpass',3000,1500);break;
 case'transform':tone('sawtooth',70,600,k,.1,0,null,1800);noise(k,.3,'bandpass',150,3200,0,null,1.5);noise(k*.9,.25,'lowpass',300,200);break;
 case'flash':noise(.7,.65,'lowpass',6000,250);tone('sine',60,28,.7,.7);break;
 case'thunder':noise(1.6,.9,'lowpass',4500,70);break;
 case'shard':tone('triangle',3200,1800,.25,.18);noise(.3,.3,'highpass',5000,3000);break;
 case'absorb':noise(.25,.18,'bandpass',600,1800,0,null,5);tone('sine',300,900,.25,.06);break;
 case'sel':tone('sine',880,880,.05,.12);tone('triangle',1760,1760,.03,.05);break;
 case'ok':tone('sine',880,1320,.09,.16);tone('triangle',1320,1760,.12,.1,.07);break;
 case'back':tone('sine',600,360,.09,.14);break;
}}
/* Música original por mundo: bajo filtrado, cuerdas, lead con eco y percusión */
const TRACKS={
 menu:{bpm:132,bass:[45,0,57,0,45,0,52,0,43,0,55,0,43,0,50,0,41,0,53,0,41,0,48,0,40,0,52,0,44,0,47,0],lead:[69,0,0,72,0,74,76,0,74,0,72,0,71,0,67,0,69,0,0,72,0,74,76,0,79,0,76,0,74,0,0,0]},
 earth:{bpm:150,bass:[45,45,57,45,43,43,55,43,41,41,53,41,40,40,52,40,45,45,57,45,43,43,55,43,41,41,53,41,40,40,52,52],lead:[69,0,72,74,76,0,74,72,74,0,76,79,76,0,74,72,69,0,72,74,76,79,81,0,79,76,74,72,74,0,0,0]},
 namek:{bpm:124,bass:[38,0,45,0,41,0,45,0,36,0,43,0,40,0,43,0,38,0,45,0,41,0,45,0,34,0,41,0,37,0,40,0],lead:[62,65,69,0,67,65,64,0,62,0,60,62,64,0,0,0,65,69,72,0,70,69,67,0,65,0,64,62,61,0,0,0]},
 void:{bpm:160,bass:[40,40,41,40,40,40,43,41,40,40,41,40,40,40,46,45,40,40,41,40,40,40,43,41,38,38,40,38,36,36,35,35],lead:[64,0,65,0,67,0,65,64,71,0,72,0,71,69,67,0,64,0,65,67,69,0,67,65,64,63,64,0,0,0,0,0]},
};
TRACKS.kaio={bpm:118,bass:TRACKS.earth.bass.map(n=>n+2),lead:TRACKS.menu.lead.map(n=>n&&n+2)};
TRACKS.broken={bpm:172,bass:TRACKS.void.bass.map(n=>n+1),lead:TRACKS.void.lead.map(n=>n&&n+1)};
TRACKS.bills={bpm:100,bass:TRACKS.namek.bass.map(n=>n+3),lead:TRACKS.namek.lead.map(n=>n&&n+3)};
const music={track:null,step:0,next:0,intense:false};
function playTrack(n){music.track=TRACKS[n];music.step=0;if(AC)music.next=AC.currentTime+.05;}
const mf=n=>440*Math.pow(2,(n-69)/12);
function musicTick(){if(!AC||!music.track)return;const tr=music.track,sp=60/(tr.bpm*(music.intense?1.12:1))/2;
 while(music.next<AC.currentTime+.2){const s=music.step%32,d=music.next-AC.currentTime;
  if(tr.bass[s]){const f=mf(tr.bass[s]-12);tone('sawtooth',f,f,sp*.95,.3,d,musBus,520);tone('sine',f,f,sp*.95,.28,d,musBus);}
  if(tr.lead[s]){const f=mf(tr.lead[s]);for(const det of[.996,1.004]){tone('sawtooth',f*det,f*det,sp*1.8,.06,d,musBus,2400);tone('sawtooth',f*det,f*det,sp*1.8,.03,d,musSend,1800);}}
  if(s%8===0){const ch=tr.bass[s]||45;for(const n of[0,4,7])tone('triangle',mf(ch+12+n),mf(ch+12+n),sp*7.5,.03,d,musBus,1400);}
  if(s%4===0)tone('sine',130,38,.22,.7,d,musBus);
  if(s%8===4){noise(.16,.38,'bandpass',1800,1400,d,musBus,.8);tone('triangle',190,120,.1,.16,d,musBus);}
  if(music.intense&&s%2===1)noise(.05,.12,'highpass',7000,7000,d,musBus);
  noise(.03,.05,'highpass',8000,8000,d,musBus);
  music.next+=sp;music.step++;}}

