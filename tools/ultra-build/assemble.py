import os;D=os.path.dirname(os.path.abspath(__file__))+'/'
import json
head=open(D+'head18.html',encoding='utf8').read().replace('.cell img{width:74px;height:74px;border-radius:50%;margin-bottom:5px}','.cell img{width:80px;height:80px;border-radius:6px;margin-bottom:4px;object-fit:cover}');body=open(D+'stage18b.js',encoding='utf8').read()
import base64,glob
P={os.path.basename(p)[:-5]:'data:image/webp;base64,'+base64.b64encode(open(p,'rb').read()).decode() for p in glob.glob(D+'../../portraits/*.webp')}
pa='<script>window.KC_PORTRAITS='+json.dumps(P)+';</script>\n'
pp='<script>window.KC_PORTRAITS='+json.dumps({k:'portraits/'+k+'.webp' for k in P})+';</script>\n'
cdn='<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" integrity="sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>'
open(D+'out/kaioken-clash-ultra.html','w',encoding='utf8').write(head+body.replace('@@LIBS@@',cdn+'\n'+pa)+'\n')
src=open(D+'base-1.8.html',encoding='utf8').read()
sk=src[:src.index('<title>')].replace('content="Kaioken Clash"','content="Kaioken Ultra"')
pages=sk+head+body.replace('@@LIBS@@','<script src="vendor/three.min.js"></script>\n<script src="vendor/peerjs.min.js"></script>\n'+pp)+"\n\n<script>if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));</script></body></html>\n"
open(D+'out/ultra.html','w',encoding='utf8').write(pages)
s=open(D+'out/kaioken-clash-ultra.html',encoding='utf8').read()
i=s.index("<script>\n'use strict';");j=s.index('</script>',i);open(D+'g18.js','w').write(s[i+8:j])
