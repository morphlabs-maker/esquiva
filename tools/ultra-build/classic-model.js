/* Kaioken Clash clásico: piezas chibi de los luchadores nuevos de Ultra (Kefla, Gamma 1 y 2, Moro, Whis) y de los extras añadidos */
HAIR.kefla={cap:1,sp:HAIR.ssj.sp.map(s=>[s[0]*1.12,s[1],s[2]*1.1,s[3]*1.15,s[4]*1.2,s[5]*1.3,s[6]*1.1])};
HAIR.gamma1={cap:1,sp:[[0,.15,0,-.45,0,.2,.075],[.1,.12,.02,-.3,-.85,.18,.065],[-.1,.12,.02,-.3,.85,.18,.065],[.05,.12,.12,1.1,-.2,.14,.05],[-.05,.12,.12,1.1,.2,.14,.05]]};
HAIR.gamma2={cap:1,sp:[[0,.16,.07,.75,0,.3,.095],[.07,.15,.05,.55,-.3,.26,.08],[-.07,.15,.05,.55,.3,.26,.08],[0,.1,-.12,-1.6,0,.18,.07],[.12,.06,-.04,-.6,-1.2,.16,.06],[-.12,.06,-.04,-.6,1.2,.16,.06]]};
HAIR.whis={cap:1,sp:[[0,.17,-.03,-.1,0,.62,.1],[0,.15,.05,.2,0,.46,.085],[.05,.15,0,-.05,-.15,.5,.08],[-.05,.15,0,-.05,.15,.5,.08]]};
/* 2.0: peinados de los luchadores del modo historia */
HAIR.raditz={cap:1,sp:HAIR.goku.sp.slice(0,5).concat([[0,.06,-.15,-2.75,0,.95,.11],[.09,.04,-.13,-2.8,-.18,.92,.1],[-.09,.04,-.13,-2.8,.18,.92,.1],[0,-.04,-.15,-2.95,0,.9,.1],[.13,0,-.08,-2.9,-.4,.8,.08],[-.13,0,-.08,-2.9,.4,.8,.08]])};
HAIR.gohanks={cap:1,sp:HAIR.gohan.sp.map(s=>[s[0],s[1],s[2],s[3]*.8,s[4],s[5]*.9,s[6]]).concat([[.06,.1,.15,2.3,-.3,.18,.04]])};
HAIR.granolah={cap:1,sp:[[0,.16,-.02,-.35,0,.3,.08],[.09,.14,0,-.2,-.6,.26,.07],[-.09,.14,0,-.2,.6,.26,.07],[.05,.12,.12,1.6,-.25,.16,.05],[-.05,.12,.12,1.6,.25,.16,.05],[0,.08,-.14,-1.9,0,.24,.07]]};
HAIR.gas={cap:1,sp:[[0,.16,-.02,-.2,0,.34,.09],[.1,.13,0,-.1,-.7,.3,.08],[-.1,.13,0,-.1,.7,.3,.08],[0,.1,-.12,-1.2,0,.3,.08],[.13,.05,-.04,-.4,-1.3,.24,.06],[-.13,.05,-.04,-.4,1.3,.24,.06]]};
const NUMTEX={};
function numTex(n){const k=n.t+n.c;return NUMTEX[k]||(NUMTEX[k]=canvasTex(64,g=>{g.fillStyle=n.c;g.font='bold 56px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(n.t,32,36);}));}
function chibiExtras(model,e,add,cone){const J=model.J,m=model.mats;
 if(e==='ramHorns'||e==='ramHornsBig'){const k=e==='ramHornsBig'?1.3:1;for(const s of[1,-1])add(new THREE.TorusGeometry(.055*k,.022*k,8,16,Math.PI*1.5),m.ex1,J.head,s*.16,.22,-.02,0,s*Math.PI/2,s*.6);}
 if(e==='beard'){add(new THREE.ConeGeometry(.07,.26,10),m.ex1,J.head,0,-.08,.1,Math.PI+.3);}
 if(e==='beardShort'){add(new THREE.ConeGeometry(.055,.12,10),m.ex1,J.head,0,-.02,.12,Math.PI+.4);}
 if(e==='robe'){add(new THREE.CylinderGeometry(.2,.3,.4,20,1,true),m.ex2,J.hips,0,-.17,0);add(new THREE.CylinderGeometry(.13,.2,.1,20,1,true),m.ex2,J.torso,0,.44,0);}
 if(e==='gem'){add(new THREE.OctahedronGeometry(.03),new THREE.MeshBasicMaterial({color:0xff3a6a}),J.head,0,.24,.15).scale.set(1,1.4,.6);}
 if(e==='rocky'){for(let i=0;i<9;i++){const a=i/9*TAU;add(new THREE.DodecahedronGeometry(.05+.025*Math.random(),0),m.top,J.torso,Math.cos(a)*.24,.18+Math.random()*.25,Math.sin(a)*.17);}}
 if(e==='halo'){add(new THREE.TorusGeometry(.12,.022,8,24),m.ex2,J.torso,0,.47,-.02,Math.PI/2);}
 if(e==='staff'){add(new THREE.CylinderGeometry(.012,.012,1.1,8),m.ex1,J.elR,0,-.12,.03);add(Sph(.04,12,8),m.ex2,J.elR,0,.44,.03);}
 if(e==='namekPatches'){for(const L of['L','R']){const s=L==='L'?1:-1;add(Sph(.032,10,8),m.ex1,J['sh'+L],s*.05,-.08,.02).scale.set(.8,1.3,1);add(Sph(.028,10,8),m.ex1,J['el'+L],s*.04,-.06,.02).scale.set(.8,1.4,1);}}
 if(e==='furTail'||e==='catTail'){const cat=e==='catTail',mt=cat?m.skin:m.top;let parent=J.hips;const segs=[];
  for(let i=0;i<5;i++){const g=new THREE.CylinderGeometry(cat?.022:.035,(cat?.028:.055)-.004*i,.26,10);g.translate(0,.13,0);const p=add(g,mt,parent,0,i===0?-.02:.26,i===0?-.12:0,i===0?2.2:.35);segs.push(p);parent=p;}model.tail=segs;}
 if(e==='egyptGold'){for(const L of['L','R']){add(new THREE.CylinderGeometry(.07,.07,.04,14),m.ex1,J['el'+L],0,-.12,0);add(new THREE.CylinderGeometry(.078,.078,.04,14),m.ex1,J['kn'+L],0,-.1,0);}}
 if(e==='gammaHead1'||e==='gammaHead2'){for(const s of[1,-1])add(Sph(.032,10,8),m.ex1,J.head,s*.168,.13,0).scale.set(.6,1,1);}
 if(e==='gammaCoat'){add(new THREE.CylinderGeometry(.2,.26,.3,20,1,true),m.top,J.hips,0,-.12,0);add(new THREE.CylinderGeometry(.07,.085,.08,14),m.top,J.torso,0,.45,0);}
 if(e==='tallBoots'){for(const L of['L','R'])add(new THREE.CylinderGeometry(.078,.07,.16,14),m.boots,J['kn'+L],0,-.1,0);}
 if(e==='apeMuzzle'){add(Sph(.11,16,12),m.ex1,J.head,0,.07,.12).scale.set(1.2,.85,1);for(const s of[1,-1])add(Sph(.016,8,6),m.mouth,J.head,s*.04,.1,.225);}
 if(e==='apeEars'){for(const s of[1,-1])add(Sph(.05,12,8),m.ex1,J.head,s*.18,.16,-.01).scale.set(.5,1,.9);}
 if(e==='mustache'){for(const s of[1,-1]){const b=add(Bx(.09,.025,.02),m.hair,J.head,s*.04,.06,.16);b.rotation.z=-s*.35;}}
 if(e==='scarfRed'){add(new THREE.TorusGeometry(.1,.035,8,18),m.ex1,J.torso,0,.44,0,Math.PI/2);add(Bx(.07,.22,.025),m.ex1,J.torso,-.08,.32,-.16,-.2,0,.25);}
 if(e==='hildCrest'){for(let i=0;i<4;i++)add(cone(.035,.16,6),m.ex1,J.head,0,.27-i*.05,-.06-i*.05,-.6-i*.35);for(const s of[1,-1])add(cone(.05,.2,6),m.ex1,J['sh'+(s>0?'L':'R')],0,.05,0,0,0,-s*.6);}
 if(e==='cape'){add(Bx(.42,.62,.02),m.ex2,J.torso,0,.12,-.2,.12);}
}
