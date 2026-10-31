/* 3.0: selección de personaje: vista previa grande a la izquierda, con guardia de combate y gestos que cambian; con forma transformada, se carga de poder */
const CS_GEST=['taunt','knuckles','crossArms','tauntB','powerup'];
function csSolo(){return['boss','train','surv'].includes(game.mode);}
function csX(p){return csSolo()?-2.4:p?-1.75:-3.5;}
function csPose(p,t,f){const k=(t+p*1.9)%5.2,n=Math.floor((t+p*1.9)/5.2);if(k>3.8){const g=CS_GEST[n%CS_GEST.length];return g==='powerup'&&f.mult<=1?'taunt':g;}return Math.floor(t*.9+p)%7===3?'stanceB':'stance';}
function verRow(ci,side=0){const ch=CHARS[ci];if(!ch)return'';const L=verList(ch.id);if(!L.length)return'';const v=verOfSide(ch.id,side),d=verInfo(ch.id,v),t=verTArc(v),pc=x=>Math.round(x*100)+' %';
 return`<div class="verrow">Versión: ${L.length>1?`<button class="btn sbtn" data-act="verPick" data-arg="${ci}:-1:${side}">◀</button>`:''}<b>${esc(arcName(v))}</b>${L.length>1?`<button class="btn sbtn" data-act="verPick" data-arg="${ci}:1:${side}">▶</button>`:''}<span>Poder base ${fmtP(d.base)} · tope ${fmtP(d.cap)} · ${d.forms.length} formas · +${VER_M[v]} % maestría · velocidad ${pc(vtLerp(t,.8,1.2))} · ki ${pc(vtLerp(t,.75,1.3))}${t===0?' · sin teletransporte':''}</span></div>`;}
/* 3.0: un outfit puede quitar piezas (p. ej. la armadura de Vegeta) y añadir otras (túnica, chaqueta, sombrero…) */
function outfitExtras(model,L){const o=model.outfit&&outfitOf(model.outfit);if(!o)return L;return L.filter(e=>!(o.rm||[]).includes(e)).concat((o.add||[]).filter(e=>!L.includes(e)));}
