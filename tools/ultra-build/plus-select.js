/* 3.0: selección de personaje: vista previa grande a la izquierda, con guardia de combate y gestos que cambian; con forma transformada, se carga de poder */
const CS_GEST=['taunt','knuckles','crossArms','tauntB','powerup'];
function csSolo(){return['boss','train','surv'].includes(game.mode);}
function csX(p){return csSolo()?-2.4:p?-1.75:-3.5;}
function csPose(p,t,f){const k=(t+p*1.9)%5.2,n=Math.floor((t+p*1.9)/5.2);if(k>3.8){const g=CS_GEST[n%CS_GEST.length];return g==='powerup'&&f.mult<=1?'taunt':g;}return Math.floor(t*.9+p)%7===3?'stanceB':'stance';}
function verRow(ci){const ch=CHARS[ci];if(!ch)return'';const L=verList(ch.id);if(!L.length)return'';const v=verOf(ch.id);
 return`<div class="verrow">Versión: ${L.length>1?`<button class="btn sbtn" data-act="verPick" data-arg="${ci}:-1">◀</button>`:''}<b>${esc(arcName(v))}</b>${L.length>1?`<button class="btn sbtn" data-act="verPick" data-arg="${ci}:1">▶</button>`:''}<span>×${String(VER_K[v]).replace('.',',')} poder · +${VER_M[v]} % maestría</span></div>`;}
/* 3.0: un outfit puede quitar piezas (p. ej. la armadura de Vegeta) y añadir otras (túnica, chaqueta, sombrero…) */
function outfitExtras(model,L){const o=model.outfit&&outfitOf(model.outfit);if(!o)return L;return L.filter(e=>!(o.rm||[]).includes(e)).concat((o.add||[]).filter(e=>!L.includes(e)));}
