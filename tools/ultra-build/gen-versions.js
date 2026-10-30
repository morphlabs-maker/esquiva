/* Genera plus-verdata.js: para cada luchador y arco, el poder base y las formas que tiene en el modo historia (acumuladas). */
const fs=require('fs'),path=require('path'),D=path.join(__dirname,'../../story/');
const ARCS=['sai','nam','cel','buu','dai','god','tr','tp','bro','mor','gr'],out={};
const add=(arc,s)=>{if(!s||!s.c)return;const o=(out[s.c]=out[s.c]||{})[arc]=(out[s.c]||{})[arc]||{base:0,forms:new Set()};if(s.base)o.base=Math.max(o.base,s.base);(s.forms||[s.f||'base']).forEach(f=>o.forms.add(f));if(s.f)o.forms.add(s.f);};
for(const a of ARCS){let data;global.KC_STORY=d=>{data=d;};require(D+a+'.js');for(const n of data.nodes){if(n.t!=='fight'&&!(n.t==='db'&&n.fight))continue;const N=n.fight||n;['p','ally','e','e2'].forEach(k=>add(a,N[k]));}
 /* 3.2: también los que solo salen en escenas de ese arco (Goku en Cell, Krilin, Bills…): versión con lo que ya tenían */
 for(const m of JSON.stringify(data).matchAll(/"c":"(\w+)"/g)){const c=m[1];if(['shenlong','sshen','oozaru','oozaruv','hilde'].includes(c))continue;const o=((out[c]=out[c]||{})[a]=out[c][a]||{base:0,forms:new Set()});}}
/* formas que se ganan en escenas y no en peleas (Goku SSJ4 al final de Daima) */
const EXTRA={goku:{dai:['ssj4']}};for(const c in EXTRA)for(const a in EXTRA[c]){const o=((out[c]=out[c]||{})[a]=out[c][a]||{base:0,forms:new Set()});EXTRA[c][a].forEach(f=>o.forms.add(f));}
const res={};for(const c in out){let prevB=0,prevF=new Set();res[c]=[];for(const a of ARCS){const o=out[c][a];if(!o)continue;const b=Math.max(o.base||0,prevB),F=new Set([...prevF,...o.forms]);if(!F.size)F.add('base');prevB=b;prevF=F;res[c].push({arc:a,base:b,forms:[...F]});}}
fs.writeFileSync(path.join(__dirname,'plus-verdata.js'),'/* Generado por gen-versions.js desde story/*.js: versión de cada luchador por arco (poder base y formas acumuladas). No editar a mano. */\nconst VER_DATA='+JSON.stringify(res)+';\n');
for(const c of ['goku','vegeta','gohan','freezer','raditz'])console.log(c,JSON.stringify(res[c]));
