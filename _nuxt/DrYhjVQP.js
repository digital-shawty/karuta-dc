const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./DOObYbjI.js","./BCiCTKAo.js","./C7hYmhsk.js","./BR3tvZ9Z.js","./entry.BbBzmrAw.css"])))=>i.map(i=>d[i]);
import{r as e}from"./BCiCTKAo.js";import{C as t,G as n,J as r,K as i,M as a,Nt as o,O as s,P as c,Pt as l,Q as u,R as d,S as f,T as p,V as m,W as h,Z as g,a as _,at as v,b as y,ct as b,et as x,g as S,it as C,j as w,jt as T,k as E,pt as D,q as O,tt as ee,ut as k,w as A,x as j}from"./BR3tvZ9Z.js";import{a as M,c as N,i as P,l as F,o as I,r as te,s as L,t as R}from"#entry";var z=[`aria-checked`,`aria-label`],B={class:`whitespace-nowrap text-[1.3125rem] font-semibold uppercase tracking-[0.18em]`},ne={__name:`CardgenToggle`,props:{modelValue:{type:String,required:!0},options:{type:Array,required:!0},labels:{type:Object,required:!0}},emits:[`update:modelValue`],setup(e,{emit:t}){let r=e,i=t,a=j(()=>r.modelValue===r.options[1]),o=j(()=>r.labels[r.modelValue]);function s(){i(`update:modelValue`,a.value?r.options[0]:r.options[1])}return(e,t)=>(n(),p(`button`,{type:`button`,role:`switch`,"aria-checked":D(a),"aria-label":D(o),class:`group flex items-center gap-[1.125rem] rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`,onClick:s},[f(`span`,{class:T([`relative inline-flex h-[2.625rem] w-[4.5rem] shrink-0 items-center rounded-full border-[3px] border-ink transition-colors`,D(a)?`bg-accent`:`bg-surface`])},[f(`span`,{class:T([`absolute size-6 rounded-full border-[3px] border-ink transition-[left] duration-150`,D(a)?`left-[2.4375rem] bg-surface`:`left-1.5 bg-ink`])},null,2)],2),f(`span`,B,l(D(o)),1)],8,z))}},V=Uint8Array,H=Uint16Array,re=Int32Array,ie=new V([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),ae=new V([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),oe=new V([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),se=function(e,t){for(var n=new H(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var i=new re(n[30]),r=1;r<30;++r)for(var a=n[r];a<n[r+1];++a)i[a]=a-n[r]<<5|r;return{b:n,r:i}},U=se(ie,2),W=U.b,ce=U.r;W[28]=258,ce[258]=28;var le=se(ae,0);le.b;for(var ue=le.r,de=new H(32768),G=0;G<32768;++G){var K=(G&43690)>>1|(G&21845)<<1;K=(K&52428)>>2|(K&13107)<<2,K=(K&61680)>>4|(K&3855)<<4,de[G]=((K&65280)>>8|(K&255)<<8)>>1}for(var fe=(function(e,t,n){for(var r=e.length,i=0,a=new H(t);i<r;++i)e[i]&&++a[e[i]-1];var o=new H(t);for(i=1;i<t;++i)o[i]=o[i-1]+a[i-1]<<1;var s;if(n){s=new H(1<<t);var c=15-t;for(i=0;i<r;++i)if(e[i])for(var l=i<<4|e[i],u=t-e[i],d=o[e[i]-1]++<<u,f=d|(1<<u)-1;d<=f;++d)s[de[d]>>c]=l}else for(s=new H(r),i=0;i<r;++i)e[i]&&(s[i]=de[o[e[i]-1]++]>>15-e[i]);return s}),pe=new V(288),G=0;G<144;++G)pe[G]=8;for(var G=144;G<256;++G)pe[G]=9;for(var G=256;G<280;++G)pe[G]=7;for(var G=280;G<288;++G)pe[G]=8;for(var me=new V(32),G=0;G<32;++G)me[G]=5;var he=fe(pe,9,0),ge=fe(me,5,0),_e=function(e){return(e+7)/8|0},ve=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new V(e.subarray(t,n))},ye=[`unexpected EOF`,`invalid block type`,`invalid length/literal`,`invalid distance`,`stream finished`,`no stream handler`,,`no callback`,`invalid UTF-8 data`,`extra field too long`,`date not in range 1980-2099`,`filename too long`,`stream finishing`,`invalid zip data`],be=function(e,t,n){var r=Error(t||ye[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,be),!n)throw r;return r},q=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8},xe=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8,e[r+2]|=n>>16},Se=function(e,t){for(var n=[],r=0;r<e.length;++r)e[r]&&n.push({s:r,f:e[r]});var i=n.length,a=n.slice();if(!i)return{t:ke,l:0};if(i==1){var o=new V(n[0].s+1);return o[n[0].s]=1,{t:o,l:1}}n.sort(function(e,t){return e.f-t.f}),n.push({s:-1,f:25001});var s=n[0],c=n[1],l=0,u=1,d=2;for(n[0]={s:-1,f:s.f+c.f,l:s,r:c};u!=i-1;)s=n[n[l].f<n[d].f?l++:d++],c=n[l!=u&&n[l].f<n[d].f?l++:d++],n[u++]={s:-1,f:s.f+c.f,l:s,r:c};for(var f=a[0].s,r=1;r<i;++r)a[r].s>f&&(f=a[r].s);var p=new H(f+1),m=Ce(n[u-1],p,0);if(m>t){var r=0,h=0,g=m-t,_=1<<g;for(a.sort(function(e,t){return p[t.s]-p[e.s]||e.f-t.f});r<i;++r){var v=a[r].s;if(p[v]>t)h+=_-(1<<m-p[v]),p[v]=t;else break}for(h>>=g;h>0;){var y=a[r].s;p[y]<t?h-=1<<t-p[y]++-1:++r}for(;r>=0&&h;--r){var b=a[r].s;p[b]==t&&(--p[b],++h)}m=t}return{t:new V(p),l:m}},Ce=function(e,t,n){return e.s==-1?Math.max(Ce(e.l,t,n+1),Ce(e.r,t,n+1)):t[e.s]=n},we=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new H(++t),r=0,i=e[0],a=1,o=function(e){n[r++]=e},s=1;s<=t;++s)if(e[s]==i&&s!=t)++a;else{if(!i&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(i),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(i);a=1,i=e[s]}return{c:n.subarray(0,r),n:t}},Te=function(e,t){for(var n=0,r=0;r<t.length;++r)n+=e[r]*t[r];return n},Ee=function(e,t,n){var r=n.length,i=_e(t+2);e[i]=r&255,e[i+1]=r>>8,e[i+2]=e[i]^255,e[i+3]=e[i+1]^255;for(var a=0;a<r;++a)e[i+a+4]=n[a];return(i+4+r)*8},De=function(e,t,n,r,i,a,o,s,c,l,u){q(t,u++,n),++i[256];for(var d=Se(i,15),f=d.t,p=d.l,m=Se(a,15),h=m.t,g=m.l,_=we(f),v=_.c,y=_.n,b=we(h),x=b.c,S=b.n,C=new H(19),w=0;w<v.length;++w)++C[v[w]&31];for(var w=0;w<x.length;++w)++C[x[w]&31];for(var T=Se(C,7),E=T.t,D=T.l,O=19;O>4&&!E[oe[O-1]];--O);var ee=l+5<<3,k=Te(i,pe)+Te(a,me)+o,A=Te(i,f)+Te(a,h)+o+14+3*O+Te(C,E)+2*C[16]+3*C[17]+7*C[18];if(c>=0&&ee<=k&&ee<=A)return Ee(t,u,e.subarray(c,c+l));var j,M,N,P;if(q(t,u,1+(A<k)),u+=2,A<k){j=fe(f,p,0),M=f,N=fe(h,g,0),P=h;var F=fe(E,D,0);q(t,u,y-257),q(t,u+5,S-1),q(t,u+10,O-4),u+=14;for(var w=0;w<O;++w)q(t,u+3*w,E[oe[w]]);u+=3*O;for(var I=[v,x],te=0;te<2;++te)for(var L=I[te],w=0;w<L.length;++w){var R=L[w]&31;q(t,u,F[R]),u+=E[R],R>15&&(q(t,u,L[w]>>5&127),u+=L[w]>>12)}}else j=he,M=pe,N=ge,P=me;for(var w=0;w<s;++w){var z=r[w];if(z>255){var R=z>>18&31;xe(t,u,j[R+257]),u+=M[R+257],R>7&&(q(t,u,z>>23&31),u+=ie[R]);var B=z&31;xe(t,u,N[B]),u+=P[B],B>3&&(xe(t,u,z>>5&8191),u+=ae[B])}else xe(t,u,j[z]),u+=M[z]}return xe(t,u,j[256]),u+M[256]},Oe=new re([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),ke=new V(0),Ae=function(e,t,n,r,i,a){var o=a.z||e.length,s=new V(r+o+5*(1+Math.ceil(o/7e3))+i),c=s.subarray(r,s.length-i),l=a.l,u=(a.r||0)&7;if(t){u&&(c[0]=a.r>>3);for(var d=Oe[t-1],f=d>>13,p=d&8191,m=(1<<n)-1,h=a.p||new H(32768),g=a.h||new H(m+1),_=Math.ceil(n/3),v=2*_,y=function(t){return(e[t]^e[t+1]<<_^e[t+2]<<v)&m},b=new re(25e3),x=new H(288),S=new H(32),C=0,w=0,T=a.i||0,E=0,D=a.w||0,O=0;T+2<o;++T){var ee=y(T),k=T&32767,A=g[ee];if(h[k]=A,g[ee]=k,D<=T){var j=o-T;if((C>7e3||E>24576)&&(j>423||!l)){u=De(e,c,0,b,x,S,w,E,O,T-O,u),E=C=w=0,O=T;for(var M=0;M<286;++M)x[M]=0;for(var M=0;M<30;++M)S[M]=0}var N=2,P=0,F=p,I=k-A&32767;if(j>2&&ee==y(T-I))for(var te=Math.min(f,j)-1,L=Math.min(32767,T),R=Math.min(258,j);I<=L&&--F&&k!=A;){if(e[T+N]==e[T+N-I]){for(var z=0;z<R&&e[T+z]==e[T+z-I];++z);if(z>N){if(N=z,P=I,z>te)break;for(var B=Math.min(I,z-2),ne=0,M=0;M<B;++M){var oe=T-I+M&32767,se=oe-h[oe]&32767;se>ne&&(ne=se,A=oe)}}}k=A,A=h[k],I+=k-A&32767}if(P){b[E++]=268435456|ce[N]<<18|ue[P];var U=ce[N]&31,W=ue[P]&31;w+=ie[U]+ae[W],++x[257+U],++S[W],D=T+N,++C}else b[E++]=e[T],++x[e[T]]}}for(T=Math.max(T,D);T<o;++T)b[E++]=e[T],++x[e[T]];u=De(e,c,l,b,x,S,w,E,O,T-O,u),l||(a.r=u&7|c[u/8|0]<<3,u-=7,a.h=g,a.p=h,a.i=T,a.w=D)}else{for(var T=a.w||0;T<o+l;T+=65535){var le=T+65535;le>=o&&(c[u/8|0]=l,le=o),u=Ee(c,u+1,e.subarray(T,le))}a.i=o}return ve(s,0,r+_e(u)+i)},je=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,r=9;--r;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),Me=function(){var e=-1;return{p:function(t){for(var n=e,r=0;r<t.length;++r)n=je[n&255^t[r]]^n>>>8;e=n},d:function(){return~e}}},Ne=function(e,t,n,r,i){if(!i&&(i={l:1},t.dictionary)){var a=t.dictionary.subarray(-32768),o=new V(a.length+e.length);o.set(a),o.set(e,a.length),e=o,i.w=a.length}return Ae(e,t.level==null?6:t.level,t.mem==null?i.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,r,i)},Pe=function(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n},J=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function Fe(e,t){return Ne(e,t||{},0,0)}var Ie=function(e,t,n,r){for(var i in e){var a=e[i],o=t+i,s=r;Array.isArray(a)&&(s=Pe(r,a[1]),a=a[0]),ArrayBuffer.isView(a)?n[o]=[a,s]:(n[o+=`/`]=[new V(0),s],Ie(a,o,n,r))}},Le=typeof TextEncoder<`u`&&new TextEncoder,Re=typeof TextDecoder<`u`&&new TextDecoder;try{Re.decode(ke,{stream:!0})}catch{}function ze(e,t){if(t){for(var n=new V(e.length),r=0;r<e.length;++r)n[r]=e.charCodeAt(r);return n}if(Le)return Le.encode(e);for(var i=e.length,a=new V(e.length+(e.length>>1)),o=0,s=function(e){a[o++]=e},r=0;r<i;++r){if(o+5>a.length){var c=new V(o+8+(i-r<<1));c.set(a),a=c}var l=e.charCodeAt(r);l<128||t?s(l):l<2048?(s(192|l>>6),s(128|l&63)):l>55295&&l<57344?(l=65536+(l&1047552)|e.charCodeAt(++r)&1023,s(240|l>>18),s(128|l>>12&63),s(128|l>>6&63),s(128|l&63)):(s(224|l>>12),s(128|l>>6&63),s(128|l&63))}return ve(a,0,o)}var Be=function(e){var t=0;if(e)for(var n in e){var r=e[n].length;r>65535&&be(9),t+=r+4}return t},Ve=function(e,t,n,r,i,a,o,s){var c=r.length,l=n.extra,u=s&&s.length,d=Be(l);J(e,t,o==null?67324752:33639248),t+=4,o!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(a<0&&8),e[t++]=i&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var f=new Date(n.mtime==null?Date.now():n.mtime),p=f.getFullYear()-1980;if((p<0||p>119)&&be(10),J(e,t,p<<25|f.getMonth()+1<<21|f.getDate()<<16|f.getHours()<<11|f.getMinutes()<<5|f.getSeconds()>>1),t+=4,a!=-1&&(J(e,t,n.crc),J(e,t+4,a<0?-a-2:a),J(e,t+8,n.size)),J(e,t+12,c),J(e,t+14,d),t+=16,o!=null&&(J(e,t,u),J(e,t+6,n.attrs),J(e,t+10,o),t+=14),e.set(r,t),t+=c,d)for(var m in l){var h=l[m],g=h.length;J(e,t,+m),J(e,t+2,g),e.set(h,t+4),t+=4+g}return u&&(e.set(s,t),t+=u),t},He=function(e,t,n,r,i){J(e,t,101010256),J(e,t+8,n),J(e,t+10,n),J(e,t+12,r),J(e,t+16,i)};function Ue(e,t){t||={};var n={},r=[];Ie(e,``,n,t);var i=0,a=0;for(var o in n){var s=n[o],c=s[0],l=s[1],u=l.level==0?0:8,d=ze(o),f=d.length,p=l.comment,m=p&&ze(p),h=m&&m.length,g=Be(l.extra);f>65535&&be(11);var _=u?Fe(c,l):c,v=_.length,y=Me();y.p(c),r.push(Pe(l,{size:c.length,crc:y.d(),c:_,f:d,m,u:f!=o.length||m&&p.length!=h,o:i,compression:u})),i+=30+f+g+v,a+=76+2*(f+g)+(h||0)+v}for(var b=new V(a+22),x=i,S=a-i,C=0;C<r.length;++C){var d=r[C];Ve(b,d.o,d,d.f,d.u,d.c.length);var w=30+d.f.length+Be(d.extra);b.set(d.c,d.o+w),Ve(b,i,d,d.f,d.u,d.c.length,d.o,d.m),i+=16+w+(d.m?d.m.length:0)}return He(b,i,r.length,S,x),b}var We=new Map;async function Ge(e){let t=await createImageBitmap(e),{width:n,height:r}=t;return t.close(),{src:URL.createObjectURL(e),blob:e,width:n,height:r}}async function Ke(e){let t=We.get(e);if(t)return t;let n=new Image;return n.src=e,await n.decode(),We.set(e,n),n}function qe(e,t){let n=new Set(t),r=[];for(let t of e)t!==void 0&&!n.has(t)&&!r.includes(t)&&r.push(t);return r}function Je(e){e&&(We.delete(e.src),URL.revokeObjectURL(e.src))}function Ye(e){return e.type.startsWith(`image/`)}var Xe=`.jpg, .png, .gif, .webp, .avif, .bmp`,Ze=``;function Qe(e){Ze=e.replace(/\/+$/,``)}function $e(e){return Ze+e}var et={vs:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 240 120" width="240" height="120">
  <!--
    Generated by scripts/frames/build-vs-mark.py. Do not edit by hand.

    The versus mark: a pixel-art VS, outline only. There is no fill, so the
    letters are hollow and the matchup behind shows through them. That keeps
    the mark readable over any background without picking a colour that has to
    suit every one of them.

    \`stroke\` is the only colour the mark has. The resolver swaps it and sets
    the root width and height before rasterising, so a palette could be added
    later without touching these paths.

    Drawn rather than typeset: an SVG rendered into a canvas cannot fetch a
    font, so a <text> element would fall back to whatever the machine has.
  -->
  <g fill="none" stroke="#000000" stroke-width="10"
     stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="4">
    <path d="M 120,0 L 220,0 L 220,20 L 150,20 L 150,40 L 220,40 L 220,100 L 120,100 L 120,80 L 190,80 L 190,60 L 120,60 Z"/>
    <path d="M 30,100 L 30,80 L 20,80 L 20,60 L 10,60 L 10,40 L 0,40 L 0,0 L 30,0 L 30,40 L 40,40 L 40,60 L 60,60 L 60,40 L 70,40 L 70,0 L 100,0 L 100,40 L 90,40 L 90,60 L 80,60 L 80,80 L 70,80 L 70,100 Z"/>
  </g>
</svg>
`,"1st":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 157 112" width="157" height="112">
  <!--
    Rank mark "1ST". Flat shapes with an outline, white inside black,
    matching vs-default.svg. \`fill\` is the face and \`stroke\` is the outline; the
    mark resolver swaps both and sets the root width and height before drawing.

    Every character is a closed polygon with no curves, so the set reads as one
    blocky family. D and R carry their counters as a second subpath, which is
    why the group sets fill-rule="evenodd": the counter punches a hole and the
    outline traces it too.

    Drawn rather than typeset. An SVG rendered into a canvas cannot fetch a
    font, so a <text> element would fall back to whatever the machine has.
  -->
  <g transform="translate(6,6)" fill="#ffffff" stroke="#000000"
     stroke-width="5" stroke-linejoin="miter" stroke-miterlimit="6" fill-rule="evenodd">
    <path d="M 0,22 L 26,0 L 52,0 L 52,100 L 26,100 L 26,34 Z"/>
    <g transform="translate(62,0)"><path d="M 0,0 L 38,0 L 38,12 L 12,12 L 12,21 L 38,21 L 38,55 L 0,55 L 0,43 L 26,43 L 26,33 L 0,33 Z"/></g>
    <g transform="translate(107,0)"><path d="M 0,0 L 38,0 L 38,12 L 25,12 L 25,55 L 13,55 L 13,12 L 0,12 Z"/></g>
  </g>
</svg>
`,"2nd":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 171 112" width="171" height="112">
  <!--
    Rank mark "2ND". Flat shapes with an outline, white inside black,
    matching vs-default.svg. \`fill\` is the face and \`stroke\` is the outline; the
    mark resolver swaps both and sets the root width and height before drawing.

    Every character is a closed polygon with no curves, so the set reads as one
    blocky family. D and R carry their counters as a second subpath, which is
    why the group sets fill-rule="evenodd": the counter punches a hole and the
    outline traces it too.

    Drawn rather than typeset. An SVG rendered into a canvas cannot fetch a
    font, so a <text> element would fall back to whatever the machine has.
  -->
  <g transform="translate(6,6)" fill="#ffffff" stroke="#000000"
     stroke-width="5" stroke-linejoin="miter" stroke-miterlimit="6" fill-rule="evenodd">
    <path d="M 0,0 L 70,0 L 70,42 L 24,76 L 70,76 L 70,100 L 0,100 L 0,76 L 46,42 L 46,24 L 0,24 Z"/>
    <g transform="translate(80,0)"><path d="M 0,0 L 12,0 L 24,33 L 24,0 L 36,0 L 36,55 L 24,55 L 12,22 L 12,55 L 0,55 Z"/></g>
    <g transform="translate(123,0)"><path d="M 0,0 L 27,0 L 36,9 L 36,46 L 27,55 L 0,55 Z M 12,12 L 24,12 L 24,43 L 12,43 Z"/></g>
  </g>
</svg>
`,"3rd":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 171 112" width="171" height="112">
  <!--
    Rank mark "3RD". Flat shapes with an outline, white inside black,
    matching vs-default.svg. \`fill\` is the face and \`stroke\` is the outline; the
    mark resolver swaps both and sets the root width and height before drawing.

    Every character is a closed polygon with no curves, so the set reads as one
    blocky family. D and R carry their counters as a second subpath, which is
    why the group sets fill-rule="evenodd": the counter punches a hole and the
    outline traces it too.

    Drawn rather than typeset. An SVG rendered into a canvas cannot fetch a
    font, so a <text> element would fall back to whatever the machine has.
  -->
  <g transform="translate(6,6)" fill="#ffffff" stroke="#000000"
     stroke-width="5" stroke-linejoin="miter" stroke-miterlimit="6" fill-rule="evenodd">
    <path d="M 0,0 L 70,0 L 70,100 L 0,100 L 0,76 L 46,76 L 46,62 L 20,62 L 20,38 L 46,38 L 46,24 L 0,24 Z"/>
    <g transform="translate(80,0)"><path d="M 0,0 L 28,0 L 36,8 L 36,27 L 29,34 L 36,55 L 23,55 L 17,35 L 12,35 L 12,55 L 0,55 Z M 12,12 L 24,12 L 24,23 L 12,23 Z"/></g>
    <g transform="translate(123,0)"><path d="M 0,0 L 27,0 L 36,9 L 36,46 L 27,55 L 0,55 Z M 12,12 L 24,12 L 24,43 L 12,43 Z"/></g>
  </g>
</svg>
`},tt=`#ffffff`,nt=`#000000`,rt=new Map;function it(e){let t=e.match(/viewBox="(-?[\d.]+)\s+(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)"/);if(!t)throw Error(`mark is missing a viewBox`);return{w:Number(t[3]),h:Number(t[4])}}function at(e,t){let{w:n,h:r}=it(et[e]);return t*n/r}async function ot(e,t,n=tt,r=nt){let i=Math.max(1,Math.round(t)),a=Math.max(1,Math.round(at(e,i))),o=`${e}|${a}x${i}|${n}|${r}`,s=rt.get(o);if(s)return s;let c=et[e].replace(`fill="#ffffff"`,`fill="${n}"`).replace(`stroke="#000000"`,`stroke="${r}"`).replace(/width="[\d.]+" height="[\d.]+"/,`width="${a}" height="${i}"`),l=URL.createObjectURL(new Blob([c],{type:`image/svg+xml`}));try{let e=new Image;return e.src=l,await e.decode(),rt.set(o,e),e}finally{URL.revokeObjectURL(l)}}var Y={w:274,h:405},st=Y.w/10,X={w:1920,h:1152};function ct(e,t,n){let r=Math.min(n.w/e,n.h/t),i=e*r,a=t*r;return{x:n.x+(n.w-i)/2,y:n.y+(n.h-a)/2,w:i,h:a}}function lt(e,t,n){let r=Math.min(n,t.w/2,t.h/2);e.beginPath(),e.moveTo(t.x+r,t.y),e.arcTo(t.x+t.w,t.y,t.x+t.w,t.y+t.h,r),e.arcTo(t.x+t.w,t.y+t.h,t.x,t.y+t.h,r),e.arcTo(t.x,t.y+t.h,t.x,t.y,r),e.arcTo(t.x,t.y,t.x+t.w,t.y,r),e.closePath()}function ut(e,t){e.save(),e.fillStyle=`rgba(255, 255, 255, 0.86)`,e.strokeStyle=`rgba(24, 24, 27, 0.35)`,e.lineWidth=Math.max(2,t.w*.012),e.setLineDash([t.w*.07,t.w*.05]),lt(e,t,t.w*.06),e.fill(),e.stroke(),e.restore()}async function dt(e,t,n){let r;try{r=await Ke(t.src)}catch(e){console.warn(`cc-gen: a card image could not be loaded, leaving its slot empty`,e);return}let i=ct(r.naturalWidth,r.naturalHeight,n);if(e.drawImage(r,i.x,i.y,i.w,i.h),t.mask)try{let n=await Ke($e(t.mask.url)),{inset:r}=t.mask;e.drawImage(n,i.x+r.x*i.w,i.y+r.y*i.h,r.w*i.w,r.h*i.h);return}catch(e){console.warn(`cc-gen: could not load the frame mask`,e)}e.save(),e.fillStyle=`#000000`;for(let n of t.redactions)e.fillRect(i.x+n.x/Y.w*i.w,i.y+n.y/Y.h*i.h,n.w/Y.w*i.w,n.h/Y.h*i.h);e.restore()}function ft(e){return{x:e.x,y:e.y,w:Y.w*e.scale,h:Y.h*e.scale}}async function pt(e,t,n={}){let{w:r,h:i}=t.canvas;e.clearRect(0,0,r,i),e.imageSmoothingEnabled=!0,e.imageSmoothingQuality=`high`;let a=await Ke(t.background.src);e.drawImage(a,0,0,r,i);for(let r=0;r<t.slots.length;r++){let i=ft(t.slots[r]),a=t.cards[r];a?await dt(e,a,i):n.placeholders&&ut(e,i)}for(let n of t.marks){let t=n.h,r=at(n.kind,t);n.maxW&&r>n.maxW&&(t*=n.maxW/r,r=n.maxW);let i=await ot(n.kind,t);e.drawImage(i,n.cx-r/2,n.cy-t/2,r,t)}}function mt(){let e=new Date,t=e=>String(e).padStart(2,`0`);return`${e.getFullYear()}${t(e.getMonth()+1)}${t(e.getDate())}-${t(e.getHours())}${t(e.getMinutes())}`}async function ht(e){let{w:t,h:n}=e.canvas;if(typeof OffscreenCanvas<`u`){let r=new OffscreenCanvas(t,n),i=r.getContext(`2d`);if(!i)throw Error(`could not get a drawing context`);return await pt(i,e),r.convertToBlob({type:`image/png`})}let r=document.createElement(`canvas`);r.width=t,r.height=n;let i=r.getContext(`2d`);if(!i)throw Error(`could not get a drawing context`);return await pt(i,e),new Promise((e,t)=>{r.toBlob(n=>n?e(n):t(Error(`the canvas produced no image`)),`image/png`)})}function gt(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.append(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e4)}var _t={png:{description:`PNG image`,accept:{"image/png":[`.png`]}},zip:{description:`Zip archive`,accept:{"application/zip":[`.zip`]}}};async function vt(e,t){let n=globalThis.showSaveFilePicker;if(!n)return{chosen:!1,write:async t=>gt(t,e)};try{let r=await n({suggestedName:e,types:[_t[t]]});return{chosen:!0,write:async e=>{let t=await r.createWritable();await t.write(e),await t.close()}}}catch(t){return t.name===`AbortError`?void 0:(console.warn(`cc-gen: could not open the save dialog`,t),{chosen:!1,write:async t=>gt(t,e)})}}function yt(){return`winners-${mt()}.png`}function bt(e,t){return`matchup-${String(e+1).padStart(2,`0`)}-${t}.png`}async function xt(e){let t={};for(let n of e)t[n.name]=[new Uint8Array(await n.blob.arrayBuffer()),{level:0}];return new Blob([Ue(t)],{type:`application/zip`})}function St(){return`matchups-${mt()}.zip`}var Ct=.6,wt={"cards-2":{margin:2,teamGap:8,duoGap:0,teams:2,perTeam:1},"cards-3":{margin:1,teamGap:2.5,duoGap:0,teams:3,perTeam:1},"pairs-2":{margin:1,teamGap:3,duoGap:Ct,teams:2,perTeam:2},"pairs-3":{margin:1,teamGap:2.5,duoGap:Ct,teams:3,perTeam:2}},Tt=46,Et=.833,Dt=1.2,Ot=[{cx:.5,lift:.072},{cx:.158,lift:0},{cx:.842,lift:0}],kt=[{scale:1,cx:.3,cy:.464},{scale:.54,cx:.819,cy:.278},{scale:.54,cx:.819,cy:.709}],At=.1,jt=.8,Mt=.03;function Nt(e,t){return(t===`pair`?2:3)*(e===`duos`?2:1)}function Pt(e,t){let n=Nt(e,`pair`),r=Nt(e,`trio`),i={pairs:0,trios:0,leftover:t};for(let e=0;e*r<=t;e++){let a=t-e*r,o=Math.floor(a/n),s=a-o*n;s<i.leftover&&(i={pairs:o,trios:e,leftover:s})}return{sizes:[...Array.from({length:i.pairs},()=>`pair`),...Array.from({length:i.trios},()=>`trio`)],leftover:i.leftover}}function Ft(e,t=Math.random){let n=e.flat();for(let e=n.length-1;e>0;e--){let r=Math.floor(t()*(e+1)),i=n[e];n[e]=n[r],n[r]=i}let r=0;return e.map(e=>{let t=n.slice(r,r+e.length);return r+=e.length,t})}function It(e,t,n){return e===`winners`?t===`duos`?`winners-pairs`:`winners-cards`:t===`duos`?n===`pair`?`pairs-2`:`pairs-3`:n===`pair`?`cards-2`:`cards-3`}function Lt(e,t,n){return e===`winners`?t===`duos`?6:3:Nt(t,n)}function Rt(e){return 2*e.margin+e.teams*e.perTeam*10+(e.teams-1)*e.teamGap+e.teams*(e.perTeam-1)*e.duoGap}function zt(e){let t=e*st,n=Math.min(t,X.w);return{w:Math.round(n),span:n,scale:n/t}}function Bt(e){return Math.round(X.h*(e/X.w))}function Vt(e){let t=X.w/X.h;return{exact:e.width===X.w&&e.height===X.h,distortion:Math.abs(e.width/e.height/t-1),upscale:Math.max(0,X.w/e.width-1)}}function Ht(e){let t=wt[e],{w:n,span:r,scale:i}=zt(Rt(t)),a=Bt(n),o=st*i,s=Y.w*i,c=Y.h*i,l=(a-c)/2,u=[],d=[],f=(n-r)/2+t.margin*o;for(let e=0;e<t.teams;e++){if(e>0){let e=f;f+=t.teamGap*o,d.push({kind:`vs`,cx:(e+f)/2,cy:l+c/2-Mt*c,h:At*c,maxW:t.teamGap*o*jt})}for(let e=0;e<t.perTeam;e++)e>0&&(f+=t.duoGap*o),u.push({x:f,y:l,scale:i}),f+=s}return{canvas:{w:n,h:a},slots:u,marks:d}}function Ut(){let{w:e,scale:t}=zt(Tt),n=Bt(e),r=t*Dt,i=Y.w*r,a=Y.h*r,o=Ot.map(t=>{let o=(Et-t.lift)*n;return{x:t.cx*e-i/2,y:o-a,scale:r}});return{canvas:{w:e,h:n},slots:o,marks:[]}}function Wt(){let{w:e,scale:t}=zt(Tt),n=Bt(e),r=[];for(let i of kt){let a=t*i.scale,o=Y.w*a,s=Y.h*a,c=Ct*st*a,l=o*2+c,u=i.cx*e-l/2,d=i.cy*n-s/2;r.push({x:u,y:d,scale:a}),r.push({x:u+o+c,y:d,scale:a})}return{canvas:{w:e,h:n},slots:r,marks:[]}}function Gt(e,t,n){let r=It(e.mode,e.teamSize,t),i=r===`winners-cards`?Ut():r===`winners-pairs`?Wt():Ht(r);return{background:e.background,...i,cards:i.slots.map((e,t)=>n[t])}}var Kt=.16,qt=50,Jt=4,Yt=.14,Xt=.55,Zt=.285,Qt=.032,$t=.06,en=.9,tn=6,nn=.03,rn=4;function an(e,t){return .299*e[t]+.587*e[t+1]+.114*e[t+2]}function on(e,t,n){let r=[],i=-1,a=-1;for(let o=0;o<t;o++)an(e,(n*t+o)*4)<qt?(i<0&&(i=o),a=o):i>=0&&o-a>Jt&&(r.push({start:i,end:a+1}),i=-1);return i>=0&&r.push({start:i,end:a+1}),r.filter(e=>e.end-e.start>=t*Yt&&e.end-e.start<=t*Xt)}function sn(e,t,n,r,i){let a=[],o=[];for(let n=r;n<i;n++){let r=[];for(let i of on(e,t,n)){let e=a.find(e=>!r.includes(e)&&i.start<e.x1&&i.end>e.x0);e?(e.x0=Math.min(e.x0,i.start),e.x1=Math.max(e.x1,i.end),e.y1=n+1,r.push(e)):r.push({x0:i.start,x1:i.end,y0:n,y1:n+1})}for(let e of a)r.includes(e)||o.push(e);a=r}o.push(...a);let s;for(let e of o){let i=e.x1-e.x0,a=e.y1-e.y0;if(a<tn||i>t*Xt||e.x0<t*nn||e.x1>t*.97)continue;let o=i/a;if(o<2.2||o>15)continue;let c=Math.abs(i/t-Zt)/Zt+Math.abs(a/n-Qt)/Qt/2+Math.abs(e.y0/n-(r===0?$t:en))*6;(!s||c<s.score)&&(s={score:c,box:e})}if(!s)return;let{box:c}=s;return{x:c.x0-rn,y:c.y0-rn,w:c.x1-c.x0+8,h:c.y1-c.y0+8}}function cn(e,t,n){let r=Math.max(0,Math.min(e.x,t)),i=Math.max(0,Math.min(e.y,n));return{x:r,y:i,w:Math.min(e.w,t-r),h:Math.min(e.h,n-i)}}function ln(e,t=Y.w,n=Y.h){let r=Math.round(n*Kt),i=sn(e,t,n,0,r),a=sn(e,t,n,n-r,n);return{top:i&&cn(i,t,n),bottom:a&&cn(a,t,n)}}function un(e){let t=document.createElement(`canvas`);t.width=Y.w,t.height=Y.h;let n=t.getContext(`2d`,{willReadFrequently:!0});return n?(n.fillStyle=`#ffffff`,n.fillRect(0,0,Y.w,Y.h),n.drawImage(e,0,0,Y.w,Y.h),ln(n.getImageData(0,0,Y.w,Y.h).data)):{}}var Z={w:64,h:96,ringX:11,ringY:16,url:`/card-frame-prints.png`},dn=`100kservers|163,49,281,28,0|535,925,281,28,0|49
abandonedchurch|160,46,286,32,0|538,912,239,28,0|54
aerial|84,39,315,33,0|606,933,310,32,0|32
alchemist|155,51,281,30,0|517,923,281,30,0|24
alienalloy|197,46,270,32,0|546,919,273,32,0|21
apollo|365,44,273,28,0|365,930,273,30,0|32
arabiannights|168,32,286,32,0|533,928,273,32,0|37
arcademachine|79,37,407,28,0|546,932,220,32,0|122
arcana|186,42,278,30,0|541,928,268,28,0|35
archangel|231,49,297,26,0|528,926,283,28,0|73
archery|247,47,199,30,0|549,921,202,32,0|95
architectura|186,49,231,28,0|541,923,234,35,0|96
archlight|370,44,260,30,0|370,928,260,30,0|36
archon|367,40,268,28,0|365,932,273,30,0|35
artnouveau|157,40,289,32,0|556,919,294,32,0|20
ascendant|136,54,260,28,0|606,918,257,30,0|51
ashes|171,28,291,28,0|517,942,328,28,0|64
astrolabe|152,26,286,37,0|572,940,283,35,0|45
autumnbreeze|184,53,257,33,0|567,916,252,33,0|59
autumnview|160,40,281,35,0|538,919,234,32,0|73
aztecjungle|171,53,278,32,0|551,923,210,33,0|62
azureclaw|160,42,291,30,0|556,933,289,30,0|22
bamboostalks|157,37,283,39,0|549,925,283,37,0|73
banliang|163,42,265,30,0|554,928,268,30,0|107
barbecue|152,44,283,28,0|546,925,281,30,0|61
baroque|173,42,265,42,0|554,914,270,40,0|117
beach|165,49,273,28,0|543,928,226,28,0|85
beachtowel|178,42,265,35,0|564,919,252,35,0|50
beauty|147,35,276,40,0|517,923,270,40,0|90
bewitchedparchment|126,58,252,33,0|564,916,270,44,0|80
blacktiara|207,46,286,33,0|509,921,286,33,0|17
blackwidow|362,23,278,35,0|360,944,281,35,0|46
blaze|360,46,283,30,0|357,923,289,30,0|23
bloodmoonbite|352,30,299,32,0|354,939,294,30,0|36
bloodthorn|354,33,294,30,0|354,940,294,30,0|34
blossom|168,51,268,25,0|530,921,249,33,0|104
blueprint|189,47,231,28,0|543,921,228,28,0|87
boardwalk|336,37,328,33,0|336,933,328,32,0|44
boneconstruct|163,42,283,37,0|525,918,286,39,0|50
boneslasher|136,46,318,30,0|543,925,315,28,0|48
bookworm|207,47,192,33,0|556,907,192,33,0|105
borealsparkles|115,44,336,32,0|546,923,307,32,0|39
brass|165,47,278,30,0|543,921,239,32,0|66
brawler|157,37,283,47,0|509,916,320,44,0|135
bridesmaid|207,30,252,25,0|533,939,252,25,0|121
brokenmirror|150,44,260,32,0|562,944,276,32,0|38
bronzerank|152,47,312,28,0|538,925,310,30,0|43
bubblebath|210,42,265,42,0|525,916,268,42,0|90
bubblefountain|108,32,297,39,0|598,932,297,40,0|66
bubbletea|171,39,283,51,0|554,916,281,53,0|166
buccaneer|186,47,239,32,0|538,921,239,30,0|48
budokai|184,54,273,30,0|570,928,281,30,0|34
bunnybliss|365,46,270,30,0|367,923,265,30,0|33
bunnypaws|171,46,265,30,0|593,930,262,28,0|38
butler|147,25,294,54,0|591,928,291,49,0|172
butterflygarden|192,51,252,32,0|533,928,268,26,0|76
butterflywoods|155,25,278,35,0|564,942,283,37,0|49
cagedessence|147,47,310,30,0|546,921,310,32,0|33
candyland|171,44,273,32,0|556,923,236,32,0|122
carnations|163,47,281,30,0|554,921,281,30,0|55
carraramarble|152,28,286,32,0|535,935,286,32,0|33
carvedstone|144,51,320,35,0|541,933,318,33,0|41
casefiles|147,44,325,42,0|499,912,302,47,0|118
casino|176,54,265,28,0|538,914,236,28,0|78
catcafe|194,33,304,19,0|499,947,302,19,0|110
celestial|157,40,234,28,0|612,935,234,26,0|73
cemetary|181,44,260,32,0|538,916,278,33,0|47
championrank|173,39,307,28,0|520,935,307,28,0|48
chaosborn|357,44,289,35,0|357,921,289,35,0|31
chefskitchen|152,46,281,30,0|507,919,281,46,0|103
cherryberry|178,40,262,35,0|530,919,260,35,0|49
chess|163,33,273,44,0|522,926,268,46,0|103
chocodrizzle|354,39,286,32,0|365,928,273,32,0|21
chocolatebunny|184,47,239,30,0|564,916,247,30,0|62
chocolateorange|171,47,260,32,0|564,921,249,32,0|56
chocomint|142,46,323,30,0|549,923,312,32,0|40
chopsticks|184,44,268,35,0|525,926,265,33,0|38
chrome|202,51,257,25,0|564,919,236,21,0|97
circustent|171,51,265,25,0|533,921,231,25,0|84
classroom|152,74,412,21,0|528,937,241,21,0|211
cleave|362,46,278,32,0|362,930,278,25,0|39
coffeeshop|173,47,257,28,0|546,925,223,26,0|78
constellations|412,89,289,26,0|486,916,307,21,0|120
coralreef|152,40,291,35,0|522,939,260,37,0|72
corruptedtitanium|144,49,315,30,0|543,923,312,30,0|40
cosmicentity|134,46,268,32,0|609,923,265,32,0|35
crimescene|150,40,291,42,0|517,921,294,40,0|75
crimsonbleed|139,46,315,32,0|546,921,320,35,0|44
crispwind|220,54,231,25,0|546,923,231,25,0|94
crow|168,51,270,25,0|538,926,239,25,0|84
crystal|168,49,276,30,0|533,923,255,32,0|71
crystallinelocket|178,53,247,26,0|572,918,247,26,0|78
crystalwings|73,51,307,30,0|601,940,325,26,0|64
cupidsarrow|184,42,273,26,0|559,930,247,28,0|92
cupidslock|184,42,273,26,0|559,930,247,28,0|92
cursedplace|181,49,299,30,0|538,921,236,30,0|57
cursedrelics|360,39,283,40,0|360,923,283,40,0|64
darkcathedral|168,46,273,30,0|562,921,276,32,0|25
darkiron|178,51,252,33,0|499,923,283,35,0|37
deathbringer|131,46,349,30,0|520,923,346,32,0|60
demonflame|176,37,299,32,0|535,939,312,32,0|33
desertrose|147,47,278,30,0|549,925,247,32,0|111
destiny|352,23,297,35,0|357,958,286,33,0|51
deviation|360,58,283,30,0|360,909,281,32,0|31
diamondrank|176,39,304,28,0|520,935,307,28,0|47
divineduality|160,39,273,37,0|562,923,276,37,0|49
divinity|184,42,265,35,0|541,918,215,37,0|106
djinnlamp|105,33,289,30,0|609,935,289,32,0|30
dragonballs|163,42,286,42,0|562,916,283,42,0|94
dragonfruit|362,54,278,30,0|362,923,278,28,0|34
dragonhunt|163,49,278,30,0|501,925,276,30,0|69
dreadstone|129,46,270,30,0|604,928,268,30,0|29
earthen|144,61,297,30,0|559,911,299,30,0|44
easel|181,44,247,30,0|580,923,236,30,0|53
edofurin|199,42,281,30,0|546,925,268,33,0|45
eldritch|325,30,352,42,0|323,930,354,42,0|123
electrified|123,46,255,26,0|630,921,241,30,0|81
electrocell|165,47,278,30,0|543,926,234,30,0|58
elegance|97,63,283,32,0|588,937,310,32,0|34
elvenblossom|202,35,307,42,0|493,923,304,42,0|99
empyrean|121,40,320,37,0|622,937,294,44,0|85
enchantedgarden|155,56,265,30,0|583,930,268,30,0|33
enchantedstar|129,46,268,33,0|604,923,270,33,0|27
etherealgrasp|328,51,346,30,0|331,919,341,32,0|60
exoticbirds|160,51,283,23,0|488,926,281,28,0|99
explosion|362,56,276,32,0|365,916,276,30,0|42
faerieforest|168,46,273,33,0|541,923,231,32,0|53
fanservice|189,49,236,28,0|575,925,236,28,0|80
festivedinner|213,23,252,33,0|541,946,252,32,0|53
festivity|360,25,281,32,0|362,946,278,30,0|35
festivusfreeze|142,46,276,30,0|591,940,276,30,0|27
festivuslights|375,51,252,35,0|375,916,249,33,0|50
festivusnight|176,42,249,33,0|543,930,255,25,0|59
festivuspark|202,42,252,28,0|543,946,249,30,0|68
festivuspresents|160,49,320,30,0|525,937,318,32,0|44
fireandice|213,40,281,30,0|496,925,273,32,0|79
fireelement|160,46,312,33,0|528,919,344,35,0|57
fishingtrip|129,46,234,30,0|640,923,236,30,0|56
flametemple|94,39,252,28,0|664,928,252,30,0|59
flowerbuds|365,42,273,28,0|365,930,270,35,0|39
flyingdragon|142,46,265,30,0|486,914,257,30,0|47
forbidden|168,42,260,30,0|570,928,262,30,0|40
fortress|171,54,276,28,0|549,930,228,28,0|90
fragrantbloom|370,51,262,28,0|370,926,262,30,0|41
frenchmaid|197,42,297,28,0|499,928,312,42,0|79
frills|210,42,260,32,0|535,930,262,30,0|47
frostborn|92,44,297,30,0|614,926,297,30,0|28
frostedglass|163,35,291,42,0|533,918,260,40,0|163
frostwood|165,46,273,30,0|562,928,273,28,0|32
fuselage|176,51,260,25,0|546,925,228,30,0|70
gamingchair|113,49,262,30,0|625,944,262,28,0|43
gardenfountain|155,30,239,32,0|601,926,241,35,0|62
gardensnake|173,46,270,33,0|556,919,260,33,0|32
gazebo|173,77,286,26,0|580,947,234,28,0|93
geode|150,23,273,28,0|559,951,220,25,0|119
gildedstars|176,49,270,26,0|556,921,252,26,0|81
gingerbake|365,53,273,30,0|362,953,278,30,0|36
glinted|94,30,268,35,0|651,939,260,37,0|56
glory|150,44,281,32,0|570,923,283,32,0|21
goldenhour|362,42,276,30,0|362,932,276,30,0|32
goldennectar|367,46,268,30,0|367,928,268,30,0|30
goldrank|176,42,299,32,0|528,926,297,32,0|19
gothiccloak|108,49,344,35,0|612,914,299,32,0|62
gothicornament|126,37,318,47,0|556,919,318,47,0|141
gothictower|168,54,270,30,0|533,923,270,32,0|40
graspingshadows|147,44,286,32,0|533,923,315,30,0|31
grimrose|360,44,283,30,0|357,937,291,30,0|23
groomsman|205,30,273,25,0|514,940,273,25,0|87
grovedruid|236,46,331,35,0|522,918,336,33,0|75
hacker|184,46,234,30,0|577,921,236,28,0|63
halloweenporch|163,44,299,35,0|541,921,228,33,0|76
hangingscrolls|173,46,260,32,0|559,921,265,30,0|61
hannya|223,44,270,30,0|509,925,270,30,0|35
harpstring|113,67,304,39,0|585,898,304,42,0|107
hauntedharvest|129,46,265,30,0|606,923,265,30,0|35
hauntedstone|79,33,260,30,0|646,932,255,30,0|47
hauntedthicket|336,46,388,32,0|357,921,289,33,0|62
heartbreak|139,33,286,30,0|593,942,297,28,0|56
heartofsilver|168,35,268,46,0|522,935,265,46,0|132
heraldic|157,51,286,28,0|522,916,299,39,0|87
herbedroom|131,42,304,33,0|501,940,349,33,0|75
hexweave|352,44,299,39,0|344,923,312,39,0|65
higasa|168,51,260,28,0|538,923,252,33,0|47
holidaytreats|173,49,283,35,0|517,925,286,32,0|19
holovortex|171,40,268,30,0|562,930,268,28,0|38
holyknight|367,54,270,23,0|367,930,270,26,0|87
holyroman|163,47,286,33,0|538,925,239,33,0|34
honeycomb|100,47,344,46,0|572,909,336,42,0|129
husband|362,21,273,32,0|381,944,236,30,0|69
icecreamparlor|129,56,270,32,0|617,916,236,30,0|49
icecube|152,47,278,28,0|564,930,278,30,0|26
icicle|144,46,286,26,0|567,930,283,26,0|39
illusion|113,49,281,33,0|612,914,281,33,0|23
infinityvoid|152,21,270,28,0|580,953,273,30,0|58
interface|383,58,236,28,0|383,914,236,30,0|71
inwonderland|171,49,278,30,0|575,923,270,26,0|56
ironrank|163,46,289,30,0|583,933,273,28,0|29
islandgrotto|178,47,252,26,0|612,949,244,26,0|97
islandluau|21,25,488,32,0|677,921,244,33,0|141
jadecherrywood|178,51,241,30,0|580,923,236,32,0|49
jamboree|142,44,336,39,0|507,926,286,23,0|85
japanesealley|168,39,273,32,0|535,918,336,35,0|55
jewelrybox|173,42,249,32,0|525,923,260,33,0|38
jinglebells|84,25,270,35,0|648,951,273,35,0|54
jurassic|155,46,310,32,0|491,921,304,32,0|27
karutaanniversary2022|168,47,315,30,0|514,925,318,32,0|40
karutaanniversary2023|168,49,257,30,0|580,921,255,30,0|42
karutaanniversary2024|349,47,304,30,0|352,935,299,32,0|23
karutaanniversary2025|365,47,273,32,0|344,926,312,39,0|50
karutaanniversary2026|357,42,286,30,0|354,932,291,30,0|21
karutaboy|173,49,276,30,0|551,923,228,32,0|43
karutavice|184,46,234,30,0|585,928,236,28,0|59
kawaiibento|163,47,270,33,0|499,930,273,35,0|34
kimono|121,26,357,21,0|470,954,451,21,0|204
kintsugi|165,58,278,28,0|543,935,226,26,0|123
kitsune|168,42,236,40,0|541,930,244,39,0|85
kominka|157,44,291,32,0|535,923,294,28,0|69
kraken|181,47,236,30,0|554,919,226,32,0|56
labpunk|129,42,299,30,0|562,921,304,30,0|36
lagoon|367,25,268,30,0|365,947,270,30,0|48
leatherbelt|165,37,294,44,0|541,926,257,35,0|93
legendrank|173,39,307,30,0|520,933,310,28,0|43
lich|176,77,247,28,0|554,926,270,28,0|66
lifedeath|168,47,294,32,0|520,925,270,32,0|58
lifeguard|134,46,260,30,0|612,923,257,30,0|39
lighthousestorm|144,44,241,32,0|654,916,268,32,0|43
livestream|142,37,244,32,0|619,954,244,32,0|51
livingdead|136,32,415,39,0|483,926,354,28,0|130
longhair|176,40,255,32,0|528,919,265,32,0|42
luminouswings|360,42,283,35,0|360,926,283,33,0|23
macawchief|228,42,278,32,0|507,930,281,32,0|24
madscientist|129,33,325,51,0|533,916,249,54,0|183
madteaparty|105,35,357,44,0|470,912,404,51,0|190
magicalgirl|173,56,276,28,0|192,928,289,21,1|105
magiclibrary|184,46,239,32,0|583,925,239,32,0|57
magitek|165,51,276,26,0|546,928,223,26,0|70
magitor|176,44,257,32,0|567,926,257,32,0|28
magus|163,49,278,30,0|538,923,239,30,0|108
mahou|360,44,281,28,0|357,928,286,28,0|40
malicetree|157,35,357,47,0|517,916,286,44,0|137
manekineko|165,47,273,28,0|567,921,268,28,0|54
mangaartist|186,44,228,32,0|564,919,189,32,0|102
manticore|113,54,328,25,0|562,925,331,26,0|81
mardigras|163,47,281,30,0|556,921,270,30,0|52
martialartist|176,46,255,35,0|525,925,255,35,0|79
mermaid|136,32,362,44,0|522,921,341,42,0|143
midnightbloom|352,51,299,32,0|352,919,299,32,0|26
midnightpetal|136,51,297,30,0|570,919,297,32,0|26
mingvase|165,49,268,28,0|559,923,270,28,0|66
mirroredenergy|383,46,236,30,0|383,925,236,28,0|60
mistletoeseason|178,44,244,32,0|577,919,247,30,0|71
mobilesuit|102,40,252,33,0|596,930,260,44,0|81
molten|155,46,291,30,0|554,926,294,30,0|24
monsterific|171,46,278,25,0|528,923,270,28,0|52
moonaltar|71,49,270,33,0|664,916,273,35,0|43
moonkingdom|155,25,234,28,0|522,939,247,35,0|100
moonlitbloom|370,46,262,30,0|367,926,265,30,0|38
morningdew|205,42,231,28,0|554,925,239,30,0|88
musicalnotes|199,42,252,28,0|559,928,255,30,0|76
nether|360,54,281,33,0|365,935,283,33,0|20
nightfestival|171,35,241,32,0|583,933,236,30,0|50
nightlotus|357,39,289,32,0|362,918,278,26,0|48
nightmare|165,44,286,32,0|556,926,294,28,0|41
nightooze|157,51,278,30,0|512,926,289,30,0|27
nightwalker|136,47,304,32,0|598,942,270,30,0|35
nimbuscloud|228,51,244,26,0|517,926,257,28,0|81
ninjutsu|173,37,260,21,0|520,916,265,26,0|103
noble|113,35,286,35,0|643,944,286,26,0|59
nordic|192,40,231,32,0|528,918,247,30,0|84
nova|349,7,304,32,0|349,961,304,32,0|59
noxious|213,46,244,30,0|549,926,244,30,0|51
nursesoffice|189,49,234,28,0|541,923,234,28,0|91
oceanic|375,49,252,32,0|370,930,262,32,0|41
omnitech|207,49,257,33,0|541,926,255,32,0|43
orbweaver|194,30,294,30,0|525,940,294,28,0|70
origami|157,46,328,30,0|528,926,260,28,0|83
ornamental|165,35,276,37,0|512,921,273,37,0|76
ornatestars|378,21,247,28,0|381,958,244,28,0|92
ostara|168,42,268,30,0|543,919,249,33,0|48
panda|173,19,262,32,0|236,932,323,28,1|114
parkpicnic|136,47,236,26,0|622,928,249,28,0|72
pastelcastle|165,53,273,32,0|543,926,228,32,0|45
pastelgeometry|115,40,278,30,0|514,930,286,30,0|23
pastelwisps|168,32,241,37,0|593,935,241,37,0|73
patchwork|157,44,286,35,0|530,921,241,32,0|93
peppermint|173,42,257,30,0|596,933,257,28,0|48
petals|181,49,239,32,0|583,923,236,30,0|49
phantomblade|142,42,315,32,0|549,926,315,33,0|34
phantomslament|360,44,281,32,0|360,926,281,32,0|15
pharaoh|163,58,276,26,0|570,933,278,28,0|47
pirate|165,46,281,32,0|535,923,262,32,0|41
pistilsuit|165,58,273,30,0|522,935,278,30,0|45
plasmagun|147,46,294,30,0|562,926,294,30,0|25
platinumrank|176,39,307,28,0|517,923,310,30,0|48
pocketpet|341,33,320,49,0|286,907,436,53,0|220
polaroid|126,46,234,30,0|646,925,234,28,0|86
polishedlocket|213,54,228,26,0|562,916,244,25,0|95
poolside|152,46,278,32,0|47,954,289,28,1|85
popidol|199,33,236,32,0|549,926,236,32,0|57
prehistoric|160,42,315,39,0|509,916,344,46,0|113
presenttime|118,65,234,32,0|667,935,231,32,0|68
primrose|341,44,320,26,0|357,933,289,32,0|61
prisonbreak|105,47,234,28,0|661,923,234,30,0|62
prototype|572,53,289,28,1|134,921,291,25,1|100
pumpkinking|168,49,276,26,0|546,923,273,26,0|50
pumpkinseason|160,47,270,30,0|535,923,234,32,0|62
rabbithole|173,46,249,26,0|533,925,252,25,0|76
radiance|352,37,297,32,0|352,933,299,32,0|19
rainbowgalaxy|171,47,286,30,0|543,925,231,30,0|67
rainforest|171,49,273,30,0|499,916,297,35,0|40
raven|150,54,289,35,0|564,912,286,33,0|32
rebellion|192,32,278,28,0|533,939,281,28,0|42
reclaimedbynature|186,54,236,32,0|509,925,291,32,0|36
renaissance|136,23,299,32,0|564,951,291,33,0|57
ripple|349,35,304,30,0|346,933,307,32,0|36
ritual|97,46,270,32,0|643,923,255,32,0|27
robotic|239,56,213,26,0|559,918,257,25,0|95
roseknight|63,37,304,32,0|572,925,278,33,0|37
royalprincess|163,49,286,32,0|538,932,286,30,0|43
royalty|100,58,273,30,0|622,914,273,32,0|42
rozen|215,74,218,26,0|535,919,218,23,0|118
ruineddragon|168,44,312,33,0|522,930,297,33,0|43
runic|383,61,236,28,0|383,912,236,28,0|79
runicfrost|110,54,257,33,0|630,912,257,33,0|43
rusticspringtide|192,46,341,32,0|451,939,341,32,0|51
rustyfortress|160,49,320,30,0|499,925,320,30,0|55
sakurasnack|163,35,339,40,0|449,926,341,39,0|113
saloonbrawl|160,44,302,32,0|501,928,299,32,0|19
samurai|115,44,323,30,0|541,926,294,30,0|47
sandcastle|160,61,234,30,0|554,928,239,30,0|63
sanguinewisps|155,46,270,30,0|580,925,262,28,0|44
scarletastral|147,60,286,30,0|572,911,283,30,0|35
scimitarfight|163,51,278,28,0|528,918,241,26,0|66
seaglass|365,47,273,32,0|365,928,273,30,0|24
sealedgraveyard|163,49,268,28,0|572,928,268,28,0|40
seamster|192,51,260,30,0|504,911,294,42,0|73
seatemple|352,46,299,37,0|370,921,262,35,0|50
serpenttemple|123,46,383,32,0|451,926,381,32,0|76
shadowborn|129,44,312,32,0|556,923,315,32,0|31
shadowglass|192,49,255,33,0|562,925,231,33,0|53
shadowneedlework|370,44,262,39,0|360,918,283,46,0|88
shatteredplumes|105,42,312,37,0|572,925,318,33,0|50
sheeppuff|176,42,283,35,0|499,928,307,30,0|35
shibainu|121,44,239,32,0|614,902,239,32,0|64
shimmer|147,51,289,30,0|564,921,289,30,0|24
shiningdiamond|165,58,283,32,0|509,923,286,33,0|43
shisa|150,46,273,32,0|535,925,265,33,0|28
shoji|357,44,286,30,0|346,932,283,35,0|34
shortbread|192,28,236,26,0|567,942,241,30,0|93
showman|163,63,278,25,0|538,921,297,28,0|101
silentburial|365,33,270,39,0|367,932,268,35,0|52
silverrank|202,46,276,30,0|520,919,302,30,0|34
simulation|176,46,257,30,0|520,923,255,28,0|47
sinisterreach|160,46,276,30,0|564,923,281,30,0|26
slums|163,54,265,30,0|541,923,218,39,0|96
smithyforge|155,40,276,32,0|530,939,268,30,0|36
snowday|147,53,283,28,0|585,923,281,28,0|35
snowdrop|165,44,244,32,0|559,928,281,32,0|47
snowedin|173,61,249,32,0|583,935,241,32,0|57
snowfire|357,47,289,32,0|362,923,278,32,0|17
snowlands|165,47,278,30,0|562,925,223,30,0|80
snowtree|171,40,239,39,0|538,923,231,39,0|87
solisfairsip|173,49,262,26,0|570,921,265,26,0|58
solisfairstand|165,49,268,32,0|646,919,236,32,0|45
solisfairswirl|365,46,270,30,0|381,946,236,32,0|48
spaceship|173,40,257,40,0|541,919,223,39,0|111
spectralsigils|113,46,257,32,0|627,923,268,32,0|34
spellbook|344,21,315,32,0|336,942,336,35,0|65
spiderlily|202,60,273,33,0|488,909,307,39,0|71
spiderqueen|102,49,268,28,0|656,935,262,26,0|48
spirit|176,49,265,26,0|507,923,286,28,0|74
spiritsilk|357,51,283,39,0|362,907,273,37,0|75
springbreeze|163,49,257,30,0|580,923,260,28,0|45
springcrafts|157,30,302,53,0|509,914,307,47,0|150
springglimmer|142,47,257,30,0|572,918,257,30,0|42
springhatchling|304,51,394,37,0|302,914,394,37,0|119
springlilies|171,40,276,30,0|556,932,276,30,0|25
springrain|160,47,265,30,0|564,923,291,35,0|36
springtideserenity|378,33,247,30,0|378,942,247,28,0|62
springtidetimber|181,46,241,32,0|580,923,244,32,0|39
springtidetreats|155,40,297,42,0|520,918,276,37,0|72
springtidevibes|142,53,297,28,0|567,935,297,30,0|49
springwhimsy|142,40,294,42,0|543,923,294,44,0|102
stackeddeck|168,42,291,35,0|535,926,286,30,0|41
stainedglass|160,47,289,33,0|556,926,220,30,0|71
starrysky|165,51,276,28,0|549,925,220,28,0|82
starshine|357,33,289,37,0|357,932,286,39,0|47
startertown|184,30,257,25,0|546,944,276,26,0|99
steampulse|144,42,297,32,0|554,928,297,32,0|17
stellar|354,46,294,30,0|354,925,294,32,0|21
strawberrydessert|181,30,281,28,0|541,937,281,28,0|57
submarine|168,49,273,28,0|543,925,228,32,0|73
summersplash|126,47,252,30,0|619,925,252,30,0|46
suncatcher|370,37,270,28,0|388,949,236,32,0|62
sundae|176,51,276,26,0|551,928,226,26,0|69
superhero|383,49,236,28,0|383,925,234,28,0|65
susanoo|160,47,286,28,0|562,921,281,28,0|34
sushi|147,51,318,30,0|538,930,268,30,0|63
sweetheart|108,18,283,32,0|609,935,286,32,0|40
swordsman|150,49,281,28,0|572,925,281,28,0|33
tanglung|173,40,252,32,0|564,926,265,33,0|66
tao|176,49,265,32,0|549,923,255,32,0|32
tarotcard|181,39,241,32,0|533,921,241,40,0|102
tatami|134,44,189,19,0|680,939,189,19,0|173
tetromino|184,44,236,30,0|538,919,234,30,0|59
tetsuo|181,46,234,28,0|541,925,234,28,0|67
textingbuddy|139,49,286,30,0|593,937,281,28,0|108
thelight|113,46,294,30,0|596,928,291,30,0|23
thenutcracker|189,46,286,35,0|535,918,265,37,0|45
tiara|150,46,307,37,0|530,926,262,32,0|76
tipsy|186,47,234,28,0|575,923,231,26,0|110
titanscales|108,39,270,30,0|627,935,270,32,0|27
tombrelic|168,47,270,30,0|543,923,218,28,0|88
toymecha|186,49,228,26,0|538,923,244,26,0|94
tpd|157,42,312,37,0|507,926,286,35,0|45
tranquilblossom|365,47,273,30,0|352,907,297,30,0|60
treefrog|451,75,323,23,0|134,839,320,26,0|189
tribalchief|168,49,281,32,0|538,925,281,30,0|17
tropicalflame|142,74,304,32,0|567,937,289,28,0|55
undeaddomain|157,46,276,32,0|570,928,273,30,0|24
undine|367,49,270,32,0|365,918,270,30,0|28
valleyelegance|360,46,283,32,0|362,925,278,30,0|18
vaporwave|367,51,262,32,0|370,926,257,33,0|34
vendingmachine|381,40,239,30,0|381,939,239,30,0|55
venicecarnival|168,51,268,23,0|549,926,213,23,0|112
verdant|160,30,328,32,0|512,935,333,32,0|64
vizier|157,46,278,32,0|541,921,276,32,0|17
voidspawn|131,47,320,30,0|554,925,320,30,0|43
volcanic|165,47,278,33,0|554,921,220,32,0|72
volleyball|165,42,273,35,0|520,939,273,37,0|65
wanted|84,42,257,32,0|654,926,257,32,0|41
warmmantle|373,53,249,28,0|373,926,283,32,0|50
warmrain|144,33,286,33,0|606,928,291,32,0|44
waterelement|79,39,312,35,0|491,933,278,32,0|34
watermelonjuice|168,68,249,21,0|585,904,249,21,0|139
watervial|383,46,236,30,0|383,923,236,30,0|55
whirlpool|168,46,265,35,0|528,919,255,33,0|50
wife|373,53,260,32,0|362,926,278,28,0|42
wildwaters|94,39,294,40,0|622,923,286,32,0|46
wildwest|181,46,247,30,0|533,919,244,33,0|49
winenebula|147,25,291,32,0|562,949,286,33,0|34
winnerspodium|134,39,333,33,0|504,928,331,33,0|50
wintercampfire|136,47,278,32,0|606,916,276,39,0|41
witchaltar|244,28,294,32,0|499,949,302,28,0|59
witchsbrew|184,39,265,40,0|525,916,257,37,0|76
witchsbroom|173,49,291,30,0|546,926,278,23,0|60
wizardshut|45,14,283,42,0|583,923,268,37,0|83
wrapped|55,51,281,30,0|667,926,281,30,0|22
yakuza|362,56,262,42,0|383,925,231,40,0|98
yearoftheboar|375,47,252,32,0|373,928,255,30,0|38
yearofthedog|370,47,255,32,0|370,928,255,32,0|31
yearofthedragon|373,47,255,30,0|373,926,257,32,0|45
yearofthehorse|375,46,252,30,0|375,926,252,28,0|48
yearofthemonkey|375,51,252,30,0|375,930,252,32,0|35
yearoftheox|375,44,252,30,0|375,928,252,30,0|42
yearoftherabbit|375,42,255,30,0|375,923,255,30,0|48
yearoftherat|375,46,252,30,0|375,925,252,32,0|42
yearoftherooster|373,46,255,30,0|373,925,257,32,0|35
yearofthesheep|375,46,252,30,0|375,925,252,32,0|38
yearofthesnake|375,42,252,30,0|375,925,252,30,0|45
yearofthetiger|375,46,252,30,0|375,925,252,32,0|46
yinandyang|173,23,286,28,0|541,953,286,25,0|81
zenith|160,49,307,30,0|562,923,286,30,0|34`,Q={x:10/Y.w,y:10/Y.h,w:254/Y.w,h:380/Y.h},fn={x:0,y:0,w:1,h:1},pn=.5,mn=.12,hn=6,gn=.05,_n=8,vn=16,yn=1/12,bn=110,xn=150,Sn=[];for(let e=0;e<Z.h;e++)for(let t=0;t<Z.w;t++)(t<Z.ringX||t>=Z.w-Z.ringX||e<Z.ringY||e>=Z.h-Z.ringY)&&Sn.push(e*Z.w+t);var $=Sn.length,Cn=new Int32Array($*4).fill(-1);{let e=new Map(Sn.map((e,t)=>[e,t]));for(let[t,n]of Sn.entries()){let r=n%Z.w,i=Math.floor(n/Z.w),a=0;for(let[n,o]of[[-1,0],[1,0],[0,-1],[0,1]]){let s=r+n,c=i+o;if(s<0||c<0||s>=Z.w||c>=Z.h)continue;let l=e.get(c*Z.w+s);l!==void 0&&(Cn[t*4+a++]=l)}}}var wn;function Tn(){return wn??=dn.trim().split(`
`).map(e=>{let[t,n,r,i]=e.split(`|`),a=n.split(`,`).map(Number),o=r.split(`,`).map(Number);return{id:t,top:a.slice(0,4),bottom:o.slice(0,4),pale:[a[4]===1,o[4]===1],score:Number(i)}}),wn}function En(e,t=0){let n=new Float32Array($);for(let r=0;r<$;r++){let i=e[t+r],a=1;for(let n=r*4;n<r*4+4&&Cn[n]>=0;n++)i+=e[t+Cn[n]],a++;n[r]=e[t+r]-i/a}return n}function Dn(e,t,n){let r=Tn();if(t!==$||n<r.length*2)throw Error(`frame sprite is ${t}x${n}, expected ${$}x${r.length*2}`);let i=new Uint8Array(r.length*$),a=new Uint8Array(r.length*$),o=new Uint8Array(r.length*$);for(let n=0;n<r.length;n++){for(let o=0;o<$;o++)i[n*$+o]=e[(n*t+o)*4],a[n*$+o]=e[((r.length+n)*t+o)*4];o.set(On(a.subarray(n*$,(n+1)*$)),n*$)}let s=new Float32Array(r.length*$);for(let e=0;e<r.length;e++)s.set(En(i,e*$),e*$);return{frames:r,prints:i,coverage:a,weights:o,relief:s}}function On(e){let t=e.map(e=>e>=255?255:0),n=new Uint8Array($),r=0;for(let e=0;e<$;e++){if(!t[e])continue;let i=!0;for(let n=e*4;n<e*4+4&&Cn[n]>=0;n++)if(!t[Cn[n]]){i=!1;break}i&&(n[e]=255,r++)}return r>=$*yn?n:t}function kn(e,t,n,r=0,i=0){let{w:a,h:o}=Z,s=Math.round(Q.x*t)+r,c=Math.round(Q.y*n)+i,l=Math.round(Q.w*t),u=Math.round(Q.h*n),d=new Float32Array($);for(let[r,i]of Sn.entries()){let f=i%a,p=Math.floor(i/a),m=s+Math.floor(f*l/a),h=s+Math.max(Math.floor(f*l/a)+1,Math.floor((f+1)*l/a)),g=c+Math.floor(p*u/o),_=c+Math.max(Math.floor(p*u/o)+1,Math.floor((p+1)*u/o)),v=0,y=0;for(let r=g;r<_;r++)for(let i=m;i<h;i++){if(i<0||r<0||i>=t||r>=n)continue;let a=(r*t+i)*4,o=e[a],s=e[a+1],c=e[a+2];v+=(Math.max(o,s,c)+Math.min(o,s,c))/2,y++}d[r]=y?v/y:0}return d}function An(e,t,n,r){let i=0,a=0,o=0;for(let s=0;s<$;s++){let c=r[n+s];c&&(i+=c,a+=c*e[s],o+=c*t[n+s])}if(i<$*255*gn)return-1;let s=a/i,c=o/i,l=0,u=0,d=0;for(let i=0;i<$;i++){let a=r[n+i];if(!a)continue;let o=e[i]-s,f=t[n+i]-c;l+=a*o*f,u+=a*o*o,d+=a*f*f}return l/Math.sqrt(u*d+1e-9)}function jn(e,t,n,r){let i=r*$,a=An(e,n.prints,i,n.weights);return a===-1?-1:(a+An(t,n.relief,i,n.weights))/2}function Mn(e,t){let[n,r,i,a]=e;return{x:(t.x+n/1e3*t.w)*Y.w,y:(t.y+r/1e3*t.h)*Y.h,w:i/1e3*t.w*Y.w,h:a/1e3*t.h*Y.h}}function Nn(e,t,n=Q){return{id:e.id,score:Math.round(t*1e3)/1e3,inset:n,confidence:e.score,maskUrl:`/card-frame-masks/${e.id}.png`,redactions:[Mn(e.top,n),Mn(e.bottom,n)]}}function Pn(e,t,n=_n){let r=En(e);return t.frames.map((n,i)=>({frame:n,score:jn(e,r,t,i)})).sort((e,t)=>t.score-e.score).slice(0,n).map(e=>Nn(e.frame,e.score))}function Fn(e,t,n,r,i){let a=new Map(r.frames.map((e,t)=>[e.id,t])),o=new Map(i.map(e=>[e.id,e]));for(let i=-1;i<=1;i++)for(let s=-1;s<=1;s++){if(!s&&!i)continue;let c=kn(e,t,n,s,i),l=En(c);for(let[e,t]of o){let n=a.get(e),i=jn(c,l,r,n);i>t.score&&o.set(e,Nn(r.frames[n],i))}}return[...o.values()].sort((e,t)=>t.score-e.score)}function In(e,t,n,r){let i=t/Y.w,a=n/Y.h,o=Math.round((r.x+r.w*.15)*i),s=Math.round((r.x+r.w*.85)*i),c=Math.round((r.y+r.h*.2)*a),l=Math.round((r.y+r.h*.8)*a),u=0,d=0;for(let r=Math.max(0,c);r<Math.min(n,l);r++)for(let n=Math.max(0,o);n<Math.min(t,s);n++){let i=(r*t+n)*4;u+=.299*e[i]+.587*e[i+1]+.114*e[i+2],d++}return d?u/d:255}function Ln(e,t,n,r,i){let a=i.frames.find(e=>e.id===r.id);return a?r.redactions.every((r,i)=>{let o=In(e,t,n,r);return a.pale[i]?o>xn:o<bn}):!1}function Rn(e,t){return e.redactions.every((e,n)=>{let r=t.redactions[n];return Math.abs(e.x-r.x)<=hn&&Math.abs(e.y-r.y)<=hn&&Math.abs(e.w-r.w)<=hn&&Math.abs(e.h-r.h)<=hn})}function zn(e){let t=e[0];if(!t||t.score<pn)return;let n=e.slice(1).find(e=>!Rn(e,t));if(!(n&&t.score-n.score<mn))return t}function Bn(e,t,n,r,i=Q){let a=zn(Vn(e,t,n,r));return!a||i===Q?a:Nn(r.frames.find(e=>e.id===a.id),a.score,i)}function Vn(e,t,n,r){return Fn(e,t,n,r,Pn(kn(e,t,n),r,vn)).filter(i=>Ln(e,t,n,i,r))}var Hn;function Un(){return Hn??=(async()=>{try{let e=await Ke($e(Z.url)),t=document.createElement(`canvas`);t.width=e.naturalWidth,t.height=e.naturalHeight;let n=t.getContext(`2d`,{willReadFrequently:!0});if(!n)throw Error(`no 2d context`);return n.drawImage(e,0,0),Dn(n.getImageData(0,0,t.width,t.height).data,t.width,t.height)}catch(e){throw Hn=void 0,e}})(),Hn}async function Wn(e){let t=await Un(),n=document.createElement(`canvas`);n.width=Y.w,n.height=Y.h;let r=n.getContext(`2d`,{willReadFrequently:!0});if(!r)return;let i;for(let n of[Q,fn]){r.fillStyle=`#ffffff`,r.fillRect(0,0,Y.w,Y.h),n===Q?r.drawImage(e,0,0,Y.w,Y.h):r.drawImage(e,Q.x*Y.w,Q.y*Y.h,Q.w*Y.w,Q.h*Y.h);let a=r.getImageData(0,0,Y.w,Y.h).data,o=Bn(a,Y.w,Y.h,t,n);o&&(!i||o.score>i.score)&&(i=o)}return i}var Gn={width:.283,height:.032};function Kn(){return[{x:70,y:6,w:134,h:30},{x:78,y:362,w:118,h:30}]}function qn(e){let[t,n]=Kn(),r=!!(e.top||e.bottom);return{redactions:[e.top??t,e.bottom??n],detect:r?`pixel`:`fallback`}}async function Jn(e,t){if(!t)return{...e,redactions:Kn(),detect:`fallback`};try{let n=await Wn(t);if(n)return{...e,redactions:n.redactions,mask:{url:n.maskUrl,inset:n.inset},detect:`frame`,frame:n.id}}catch(e){console.warn(`cc-gen: frame matching failed, scanning instead`,e)}try{return{...e,...qn(un(t))}}catch{return{...e,redactions:Kn(),detect:`fallback`}}}function Yn(e){return e.detect===`pixel`||e.detect===`fallback`}async function Xn(e,t){if(Yn(e))try{let{readPlates:n}=await te(async()=>{let{readPlates:e}=await import(`./DOObYbjI.js`);return{readPlates:e}},__vite__mapDeps([0,1,2,3,4]),import.meta.url),r=await n(t);if(!r.top&&!r.bottom)return;let[i,a]=e.redactions;return{...e,redactions:[r.top??i,r.bottom??a],detect:`ocr`}}catch(e){console.warn(`cc-gen: could not read the card text`,e);return}}function Zn(e){let t=Math.max(8,Math.min(e.w,Y.w)),n=Math.max(8,Math.min(e.h,Y.h));return{w:t,h:n,x:Math.max(0,Math.min(e.x,Y.w-t)),y:Math.max(0,Math.min(e.y,Y.h-n))}}var Qn=`draft`,$n=`winners`,er=`application/x-cardgen-slot`;function tr(){return Math.random().toString(36).slice(2,10)}function nr(){let e=b(`setup`),t=b(),n=b(`versus`),r=b(`singles`),i=b([]),a=b([]),o=b(null),s=b(!1),c=b(``),l=b(``),u=b(``),d;function f(e){u.value=e,clearTimeout(d),d=setTimeout(p,5e3)}function p(){clearTimeout(d),u.value=``}let m=`Please insert valid image file (${Xe})`;function h(e){return Ye(e)?!0:(f(m),!1)}async function g(e){let t=await Ge(e),n=new Image;n.src=t.src,await n.decode();let r=v(await Jn(t,n));return Yn(r)&&y(r),r}function _(e,t){let n=n=>n&&n.src===e&&n.detect!==`manual`?t:n;i.value=i.value.map(n),a.value=a.value.map(e=>({...e,cards:e.cards.map(n)})),o.value&&={...o.value,cards:o.value.cards.map(n)}}function y(e){(async()=>{try{let t=new Image;t.src=e.src,await t.decode();let n=await Xn(e,t);n&&_(e.src,v(n))}catch(e){console.warn(`cc-gen: could not refine the mask`,e)}})()}function x(e,i){return t.value?Gt({background:t.value,mode:n.value,teamSize:r.value},e,i):null}async function S(e){if(h(e)){l.value=``;try{let n=v(await Ge(e));Je(t.value),t.value=n}catch{l.value=`That file could not be read as an image.`}}}function C(){let e=Lt(`winners`,r.value,`pair`),t=i.value.slice(0,e);for(;t.length<e;)t.push(void 0);i.value=t}function w(e){n.value=e}function T(e){e!==r.value&&(r.value=e,ie(),o.value=null,C())}let E=j(()=>!!t.value);function D(){E.value&&(C(),e.value=`build`)}function O(){e.value=`setup`}async function ee(e,t){if(h(t)){l.value=``;try{let n=await g(t),r=i.value.slice();Je(r[e]),r[e]=n,i.value=r}catch{l.value=`That card could not be read as an image.`}}}function k(e,t){let n=i.value.slice();n[e]=v(t),i.value=n}function A(e){let t=i.value.slice();Je(t[e]),t[e]=void 0,i.value=t}let M=j(()=>x(`pair`,i.value)),N=j(()=>i.value.length>0&&i.value.every(Boolean));async function P(){let e=M.value;if(!e||!N.value||s.value)return;let t=await vt(yt(),`png`);if(t){s.value=!0,l.value=``;try{await t.write(await ht(e))}catch{l.value=`The image could not be generated.`}finally{s.value=!1}}}function F(e){B();let t=Nt(r.value,e);o.value={id:tr(),size:e,cards:Array.from({length:t},()=>void 0),editing:!1}}function I(e){let t=a.value.find(t=>t.id===e);t&&(o.value={id:e,size:t.size,cards:t.cards.slice(),editing:!0})}async function te(e,t){if(o.value&&h(t)){l.value=``;try{let n=await g(t),r=o.value.cards.slice(),i=r[e];for(let e of qe([i],L()))Je(e);r[e]=n,o.value={...o.value,cards:r}}catch{l.value=`That card could not be read as an image.`}}}function L(){return o.value?.editing?a.value.find(e=>e.id===o.value.id)?.cards??[]:[]}function R(e,t){if(!o.value)return;let n=o.value.cards.slice();n[e]=v(t),o.value={...o.value,cards:n}}function z(e){if(!o.value)return;let t=o.value.cards.slice();for(let n of qe([t[e]],L()))Je(n);t[e]=void 0,o.value={...o.value,cards:t}}function B(){let e=o.value;if(e)for(let t of qe(e.cards,L()))Je(t);o.value=null}let ne=j(()=>!!o.value&&o.value.cards.every(Boolean)),V=j(()=>o.value?x(o.value.size,o.value.cards):null);function H(){let e=o.value;if(!e||!ne.value)return;let t={id:e.id,size:e.size,cards:e.cards.slice()},n=a.value.findIndex(t=>t.id===e.id);if(n>=0){let e=a.value.slice();for(let r of qe(e[n].cards,t.cards))Je(r);e[n]=t,a.value=e}else a.value=[...a.value,t];o.value=null}function re(e){let t=a.value.find(t=>t.id===e);if(t){o.value?.id===e&&B();for(let e of t.cards)Je(e);a.value=a.value.filter(t=>t.id!==e)}}function ie(){for(let e of a.value)for(let t of e.cards)Je(t);a.value=[]}function ae(){B(),ie()}async function oe(e){let t=[...e],n=t.filter(Ye);if(n.length<t.length&&f(m),n.length&&!s.value){s.value=!0,l.value=``;try{let e=[];for(let[t,r]of n.entries())c.value=`Reading ${t+1} of ${n.length}`,e.push(await g(r));let{sizes:t,leftover:i}=Pt(r.value,e.length),s=[],l=0;for(let n of t){let t=Nt(r.value,n);s.push({id:tr(),size:n,cards:e.slice(l,l+t)}),l+=t}if(a.value=[...a.value,...s],i>0){B();let t=e.slice(l),n=Nt(r.value,`pair`);o.value={id:tr(),size:`pair`,editing:!1,cards:Array.from({length:n},(e,n)=>t[n])}}}catch{l.value=`Those cards could not all be read as images.`}finally{s.value=!1,c.value=``}}}function se(){if(!a.value.length)return;o.value?.editing&&B();let e=Ft(a.value.map(e=>e.cards));a.value=a.value.map((t,n)=>({...t,cards:e[n]}))}let U=b(null),W=b(null);function ce(e){if(e)return e.scope===`draft`?o.value?.cards[e.index]:e.scope===`winners`?i.value[e.index]:a.value.find(t=>t.id===e.scope)?.cards[e.index]}function le(e,t){if(!e||e.scope===t.scope&&e.index===t.index)return!1;let n=e=>e===`draft`||e===`winners`;if(n(e.scope)||n(t.scope))return e.scope===t.scope;let r=o.value?.editing?o.value.id:null;return!r||e.scope!==r&&t.scope!==r}function ue(e,t){U.value={scope:e,index:t},W.value=null}function de(e,t){let n=W.value;n&&n.scope===e&&n.index===t||le(U.value,{scope:e,index:t})&&(W.value={scope:e,index:t})}function G(e,t){let n=W.value;n&&n.scope===e&&n.index===t&&(W.value=null)}function K(){U.value=null,W.value=null}function fe(e,t){let n=U.value,r=W.value;if(n&&r){if(r.scope===e&&r.index===t)return ce(n);if(n.scope===e&&n.index===t)return ce(r)}}function pe(e,t){let n=U.value,r={scope:e,index:t};if(K(),!le(n,r)||!n)return;if(n.scope===`draft`){if(!o.value)return;let e=o.value.cards.slice(),t=e[n.index];e[n.index]=e[r.index],e[r.index]=t,o.value={...o.value,cards:e};return}if(n.scope===`winners`){let e=i.value.slice(),t=e[n.index];e[n.index]=e[r.index],e[r.index]=t,i.value=e;return}let s=ce(n),c=ce(r);a.value=a.value.map(e=>{if(e.id!==n.scope&&e.id!==r.scope)return e;let t=e.cards.slice();return e.id===n.scope&&(t[n.index]=c),e.id===r.scope&&(t[r.index]=s),{...e,cards:t}})}function me(e){return x(e.size,e.cards)}let he=j(()=>a.value.length>0);async function ge(e){let t=a.value.findIndex(t=>t.id===e),n=a.value[t];if(!n||s.value)return;let r=await vt(bt(t,n.size),`png`);if(r){s.value=!0,l.value=``;try{let e=me(n);e&&await r.write(await ht(e))}catch{l.value=`The image could not be generated.`}finally{s.value=!1}}}async function _e(){if(!he.value||s.value)return;let e=a.value,t=e.length===1?e[0]:void 0,n=t?await vt(bt(0,t.size),`png`):await vt(St(),`zip`);if(n){s.value=!0,l.value=``;try{if(t){let e=me(t);e&&await n.write(await ht(e))}else{let t=[];for(let[n,r]of e.entries()){c.value=`Rendering ${n+1} of ${e.length}`;let i=me(r);i&&t.push({name:bt(n,r.size),blob:await ht(i)})}c.value=`Packing the archive`,await n.write(await xt(t))}}catch{l.value=`The download could not be generated.`}finally{s.value=!1,c.value=``}}}return{step:e,background:t,mode:n,teamSize:r,winnersCards:i,matchups:a,draft:o,busy:s,progress:c,error:l,toast:u,dismissToast:p,canAdvance:E,winnersScene:M,winnersReady:N,draftScene:V,draftReady:ne,versusReady:he,dragFrom:U,setBackground:S,setMode:w,setTeamSize:T,next:D,back:O,setWinnersCard:ee,updateWinnersCard:k,clearWinnersCard:A,downloadWinners:P,startDraft:F,editMatchup:I,setDraftCard:te,updateDraftCard:R,clearDraftCard:z,cancelDraft:B,commitDraft:H,removeMatchup:re,clearAll:ae,addMulti:oe,shuffleMatchups:se,beginDrag:ue,hoverSlot:de,leaveSlot:G,endDrag:K,pendingAt:fe,dropOn:pe,sceneForMatchup:me,downloadMatchup:ge,downloadMatchups:_e}}var rr;function ir(){return rr??=nr()}var ar={class:`flex w-full flex-col gap-8 rounded-2xl bg-surface p-6 md:p-10`},or={class:`grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center`},sr={class:`flex flex-col items-center gap-3`},cr=[`src`],lr={key:1,class:`grid h-full place-items-center px-4 text-center text-sm text-muted`},ur={class:`max-w-prose text-center text-xs leading-relaxed text-muted/80`},dr={key:1,class:`text-center text-xs leading-relaxed`},fr={class:`text-muted`},pr={key:0,class:`mt-1 text-danger`},mr={key:1,class:`mt-1 text-danger`},hr={class:`flex flex-col gap-5`},gr={class:`text-xs leading-relaxed text-muted`},_r={key:0,class:`text-center text-sm text-danger`},vr={class:`flex justify-center`},yr=[`disabled`],br=.08,xr=.15,Sr={__name:`CardgenSetupStep`,setup(e){let t=ir(),r=b(null),i=b(!1),a=j(()=>{let e=t.background.value;return e?Vt(e):null});function o(e){let n=e.target.files?.[0];n&&t.setBackground(n),e.target.value=``}function c(e){i.value=!1;let n=e.dataTransfer?.files?.[0];n&&t.setBackground(n)}return(e,u)=>{let d=ne;return n(),p(`section`,ar,[f(`div`,or,[f(`div`,sr,[f(`button`,{type:`button`,class:T([`mx-auto w-full overflow-hidden rounded-xl border-2 bg-canvas/40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,[D(i)?`border-accent bg-accent/5`:`border-line`,D(t).background.value?`border-solid`:`border-dashed`]]),style:{"aspect-ratio":`5 / 3`,"max-width":`calc(var(--preview-max-h) * 5 / 3)`},onClick:u[0]||=e=>D(r)?.click(),onDragover:u[1]||=F(e=>i.value=!0,[`prevent`]),onDragleave:u[2]||=e=>i.value=!1,onDrop:F(c,[`prevent`])},[D(t).background.value?(n(),p(`img`,{key:0,src:D(t).background.value.src,alt:`The uploaded background`,class:`h-full w-full object-contain`},null,8,cr)):(n(),p(`span`,lr,` Browse or drag image here `))],34),f(`p`,ur,` Final image will be adjusted to `+l(D(X).w)+` × `+l(D(X).h)+`, as this is the optimal size to fit cards on a background. Please use backgrounds as close to these dimensions as possible to minimize distortion. `,1),D(t).background.value?(n(),p(`button`,{key:0,type:`button`,class:`h-11 rounded-lg border-2 border-dashed border-line/80 bg-surface/60 px-5 text-sm text-muted transition-colors hover:border-accent hover:bg-accent/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,onClick:u[3]||=e=>D(r)?.click()},` Replace background `)):A(``,!0),D(t).background.value?(n(),p(`div`,dr,[f(`p`,fr,[s(l(D(t).background.value.width)+` × `+l(D(t).background.value.height)+` pixels. `,1),D(a).exact?(n(),p(S,{key:0},[s(`Exact match.`)],64)):(n(),p(S,{key:1},[s(` Stretched to `+l(D(X).w)+` × `+l(D(X).h)+`. `,1)],64))]),D(a).distortion>br?(n(),p(`p`,pr,` That is a different shape, so the artwork will look squashed or pulled. A `+l(D(X).w)+` × `+l(D(X).h)+` background avoids it. `,1)):D(a).upscale>xr?(n(),p(`p`,mr,` That is smaller than the target, so the background will look soft. `)):A(``,!0)])):A(``,!0)]),f(`div`,hr,[E(d,{"model-value":D(t).mode.value,options:[`versus`,`winners`],labels:{versus:`Versus`,winners:`Winners`},"onUpdate:modelValue":D(t).setMode},null,8,[`model-value`,`onUpdate:modelValue`]),E(d,{"model-value":D(t).teamSize.value,options:[`singles`,`duos`],labels:{singles:`Singles`,duos:`Duos`},"onUpdate:modelValue":D(t).setTeamSize},null,8,[`model-value`,`onUpdate:modelValue`]),f(`p`,gr,l(D(t).mode.value===`winners`?`One podium image, first place largest.`:`Build as many matchups as you like, then download them together.`)+` `+l(D(t).teamSize.value===`duos`?`Two cards per side.`:`One card per side.`),1)])]),D(t).error.value?(n(),p(`p`,_r,l(D(t).error.value),1)):A(``,!0),f(`div`,vr,[f(`button`,{type:`button`,disabled:!D(t).canAdvance.value,class:T([`h-11 w-40 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`,D(t).canAdvance.value?`bg-accent text-canvas hover:opacity-90`:`cursor-not-allowed bg-surface text-muted`]),onClick:u[4]||=(...e)=>D(t).next&&D(t).next(...e)},` Next `,10,yr)]),f(`input`,{ref_key:`input`,ref:r,type:`file`,accept:`image/*`,class:`sr-only`,onChange:o},null,544)])}}},Cr=[`draggable`,`onDragstart`,`onDragover`,`onDragleave`,`onDrop`],wr=[`src`],Tr={key:0,class:`absolute inset-0 grid place-items-center text-sm text-muted`},Er=170,Dr={__name:`CardgenCanvasPreview`,props:{scene:{type:Object,default:null},placeholders:{type:Boolean,default:!0},scope:{type:String,default:``}},setup(e){let t=e,i=ir(),a=b(null),c=j(()=>{let e=t.scene;return!e||!t.scope?[]:e.slots.map((t,n)=>({index:n,slot:t,card:e.cards[n],style:{left:`${t.x/e.canvas.w*100}%`,top:`${t.y/e.canvas.h*100}%`,width:`${Y.w*t.scale/e.canvas.w*100}%`,height:`${Y.h*t.scale/e.canvas.h*100}%`}}))}),l=j(()=>{let e=t.scene?.canvas??{w:5,h:3};return{aspectRatio:`${e.w} / ${e.h}`,maxWidth:`calc(var(--preview-max-h) * ${e.w} / ${e.h})`}}),d=Promise.resolve();async function g(){let e=a.value,n=t.scene;if(!e||!n)return;e.width=n.canvas.w,e.height=n.canvas.h;let r=e.getContext(`2d`);r&&await pt(r,n,{placeholders:t.placeholders})}function _(){d=d.then(g).catch(e=>console.error(`cc-gen: preview failed to draw`,e))}u(()=>t.scene,_,{deep:!0}),h(_);let v=null;function y(e){let t=a.value;if(!t)return null;let n=Math.round(Y.w*e.scale),r=Math.round(Y.h*e.scale),i=Math.min(1,Er/r),o=document.createElement(`canvas`);o.width=Math.max(1,Math.round(n*i)),o.height=Math.max(1,Math.round(r*i));let s=o.getContext(`2d`);return s?(s.drawImage(t,Math.round(e.x),Math.round(e.y),n,r,0,0,o.width,o.height),o.style.cssText=`position:fixed;top:-1000px;left:-1000px;pointer-events:none`,document.body.append(o),o):null}function x(){v?.remove(),v=null}function C(e,n){n.card&&(e.dataTransfer.setData(er,`${t.scope}:${n.index}`),e.dataTransfer.effectAllowed=`move`,v=y(n.slot),v&&e.dataTransfer.setDragImage(v,v.width/2,v.height/2),i.beginDrag(t.scope,n.index))}function w(){x(),i.endDrag()}function E(e,n){[...e.dataTransfer?.types??[]].includes(`application/x-cardgen-slot`)&&(e.preventDefault(),e.dataTransfer.dropEffect=`move`,i.hoverSlot(t.scope,n))}function k(e){x(),i.dropOn(t.scope,e)}return m(x),(t,u)=>(n(),p(`div`,{class:`relative mx-auto w-full overflow-hidden rounded-xl border border-line bg-surface`,style:o(D(l))},[ee(f(`canvas`,{ref_key:`canvas`,ref:a,class:`absolute inset-0 h-full w-full`},null,512),[[N,e.scene]]),(n(!0),p(S,null,O(D(c),t=>(n(),p(`div`,{key:t.index,class:T([`absolute rounded-sm transition-colors`,[t.card?`cursor-grab active:cursor-grabbing`:``,D(i).pendingAt(e.scope,t.index)&&`outline outline-2 outline-dashed outline-accent`]]),style:o(t.style),draggable:!!t.card,onDragstart:e=>C(e,t),onDragend:w,onDragover:e=>E(e,t.index),onDragleave:n=>D(i).leaveSlot(e.scope,t.index),onDrop:F(e=>k(t.index),[`prevent`])},[D(i).pendingAt(e.scope,t.index)?(n(),p(`img`,{key:0,src:D(i).pendingAt(e.scope,t.index).src,alt:``,draggable:`false`,class:`pointer-events-none h-full w-full object-contain opacity-60`},null,8,wr)):A(``,!0)],46,Cr))),128)),e.scene?A(``,!0):(n(),p(`p`,Tr,[r(t.$slots,`empty`,{},()=>[u[0]||=s(`Background preview`,-1)])]))],4))}},Or={class:`flex min-w-0 flex-col gap-1.5`},kr={key:0,class:`text-xs font-semibold uppercase tracking-[0.14em] text-muted`},Ar={class:`relative`},jr=[`src`,`draggable`],Mr={__name:`CardgenCardField`,props:{card:{type:Object,default:null},label:{type:String,default:``},scope:{type:String,default:``},index:{type:Number,default:0}},emits:[`file`,`edit`,`clear`],setup(e,{emit:t}){let r=e,i=t,a=ir(),o=b(null),s=b(!1),c=j(()=>r.scope?a.pendingAt(r.scope,r.index):void 0),u=j(()=>c.value??r.card);function d(){r.card?i(`edit`):o.value?.click()}function m(e){let t=e.target.files?.[0];t&&i(`file`,t),e.target.value=``}function h(e){return[...e.dataTransfer?.types??[]].includes(er)}function g(e){r.scope&&r.card&&(e.dataTransfer.setData(er,`${r.scope}:${r.index}`),e.dataTransfer.effectAllowed=`move`,a.beginDrag(r.scope,r.index))}function _(e){if(h(e)){if(!r.scope)return;e.preventDefault(),e.dataTransfer.dropEffect=`move`,a.hoverSlot(r.scope,r.index)}else e.preventDefault(),s.value=!0}function v(){s.value=!1,r.scope&&a.leaveSlot(r.scope,r.index)}function y(e){if(s.value=!1,h(e)){r.scope&&a.dropOn(r.scope,r.index);return}let t=e.dataTransfer?.files?.[0];t&&i(`file`,t)}return(t,r)=>(n(),p(`div`,Or,[e.label?(n(),p(`p`,kr,l(e.label),1)):A(``,!0),f(`div`,Ar,[f(`button`,{type:`button`,class:T([`flex h-11 w-full items-center gap-2 rounded-lg border px-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,[e.card?`border-solid border-line bg-surface`:`border-2 border-dashed border-line/80 bg-surface/60`,(D(s)||D(c))&&`border-accent bg-accent/5`,e.card&&`pr-8`]]),onClick:d,onDragover:F(_,[`prevent`]),onDragleave:v,onDrop:F(y,[`prevent`])},[D(u)?(n(),p(`img`,{key:0,src:D(u).src,alt:``,class:T([`size-7 shrink-0 rounded-sm object-cover`,[D(c)&&`opacity-50`,e.scope&&e.card&&`cursor-grab active:cursor-grabbing`]]),draggable:!!(e.scope&&e.card),onDragstart:g,onDragend:r[0]||=(...e)=>D(a).endDrag&&D(a).endDrag(...e),onClick:F(d,[`stop`])},null,42,jr)):A(``,!0),f(`span`,{class:T([`min-w-0 flex-1 truncate`,e.card?`text-ink`:`text-muted`])},l(e.card?`Edit image`:`Browse or drag image here`),3)],34),e.card?(n(),p(`button`,{key:0,type:`button`,"aria-label":`Remove image`,class:`absolute right-1.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent`,onClick:r[1]||=F(e=>i(`clear`),[`stop`])},[...r[2]||=[f(`svg`,{viewBox:`0 0 16 16`,class:`size-3.5`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`},[f(`path`,{d:`M4 4l8 8M12 4l-8 8`})],-1)]])):A(``,!0),f(`input`,{ref_key:`input`,ref:o,type:`file`,accept:`image/*`,class:`sr-only`,onChange:m},null,544)])]))}},Nr={role:`dialog`,"aria-modal":`true`,"aria-label":`Edit card`,class:`flex max-h-full w-full max-w-md flex-col gap-4 overflow-y-auto rounded-xl bg-surface p-6 text-ink`},Pr=[`src`],Fr=[`onPointerdown`],Ir=[`onPointerdown`],Lr={class:`flex items-center gap-2 text-xs text-muted`},Rr={class:`flex flex-wrap items-center gap-2`},zr={__name:`CardgenCardEditModal`,props:{card:{type:Object,required:!0}},emits:[`update`,`replace`,`close`],setup(e,{emit:t}){let r=e,i=t,a=b(r.card.redactions.map(e=>({...e})));u(()=>r.card,e=>{a.value=e.redactions.map(e=>({...e}))});let c=b(null),d=b(null),g=b(!0),_=j(()=>{switch(r.card.detect){case`frame`:return{label:`Matched the ${r.card.frame} frame, so these are its exact plates.`,warn:!1};case`ocr`:return{label:`This frame is new, so the code was found by reading it.`,warn:!1};case`manual`:return{label:`You placed these by hand.`,warn:!1};case`pixel`:return{label:`This frame is new. The dark bars were found by scanning, so check them.`,warn:!0};default:return{label:`Nothing was recognised, so these sit where codes usually are. Check them.`,warn:!0}}}),v=null;function y(e,t){return`${e/t*100}%`}function x(e){return{left:y(e.x,Y.w),top:y(e.y,Y.h),width:y(e.w,Y.w),height:y(e.h,Y.h)}}function w(e,t,n){let r=c.value?.getBoundingClientRect();r?.width&&(e.preventDefault(),e.currentTarget.setPointerCapture?.(e.pointerId),v={index:t,mode:n,x:e.clientX,y:e.clientY,from:{...a.value[t]},unit:Y.w/r.width})}function E(e){if(!v)return;let t=(e.clientX-v.x)*v.unit,n=(e.clientY-v.y)*v.unit,r=v.from,i=v.mode===`move`?{...r,x:r.x+t,y:r.y+n}:{...r,w:r.w+t,h:r.h+n},o=a.value.slice();o[v.index]=Zn(i),a.value=o}function k(){v&&(v=null,M())}function M(){i(`update`,{...r.card,redactions:a.value.map(e=>({...e})),mask:void 0,detect:`manual`})}function N(){a.value=Kn(),M()}function P(e){let t=e.target.files?.[0];t&&i(`replace`,t),e.target.value=``}function I(e){e.key===`Escape`&&i(`close`)}return h(()=>document.addEventListener(`keydown`,I)),m(()=>document.removeEventListener(`keydown`,I)),(t,r)=>(n(),p(`div`,{class:`fixed inset-0 z-50 grid place-items-center bg-canvas/80 p-4`,onPointerdown:r[3]||=F(e=>i(`close`),[`self`])},[f(`div`,Nr,[f(`div`,null,[r[4]||=f(`h2`,{class:`text-base font-semibold`},`Cover the code`,-1),r[5]||=f(`p`,{class:`mt-1 text-xs text-muted`},` Drag a box to move it, or its corner to resize. Both boxes are included in the download whether or not they are shown here. `,-1),f(`p`,{class:T([`mt-1.5 text-xs`,D(_).warn?`text-danger`:`text-muted`])},l(D(_).label),3)]),f(`div`,{ref_key:`frame`,ref:c,class:`relative mx-auto w-full max-w-[18rem] touch-none select-none overflow-hidden rounded-lg border border-line`,onPointermove:E,onPointerup:k,onPointercancel:k},[f(`img`,{src:e.card.src,alt:``,class:`block w-full`,draggable:`false`},null,8,Pr),D(g)?(n(!0),p(S,{key:0},O(D(a),(e,t)=>(n(),p(`div`,{key:t,class:`absolute cursor-move bg-black outline outline-2 outline-offset-[-2px] outline-accent/70`,style:o(x(e)),onPointerdown:e=>w(e,t,`move`)},[f(`span`,{class:`absolute -bottom-1 -right-1 size-3 cursor-nwse-resize rounded-sm border-2 border-ink bg-accent`,onPointerdown:F(e=>w(e,t,`resize`),[`stop`])},null,40,Ir)],44,Fr))),128)):A(``,!0)],544),f(`label`,Lr,[ee(f(`input`,{"onUpdate:modelValue":r[0]||=e=>C(g)?g.value=e:null,type:`checkbox`,class:`size-3.5 accent-[color:var(--color-accent)]`},null,512),[[L,D(g)]]),r[6]||=s(` Show the boxes `,-1)]),f(`div`,Rr,[f(`button`,{type:`button`,class:`h-9 rounded-lg border border-line px-3 text-xs font-semibold transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,onClick:r[1]||=e=>D(d)?.click()},` Replace image `),f(`button`,{type:`button`,class:`h-9 rounded-lg border border-line px-3 text-xs font-semibold transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,onClick:N},` Reset boxes `),f(`button`,{type:`button`,class:`ml-auto h-9 rounded-lg bg-accent px-4 text-xs font-semibold text-canvas transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`,onClick:r[2]||=e=>i(`close`)},` Done `)]),f(`input`,{ref_key:`input`,ref:d,type:`file`,accept:`image/*`,class:`sr-only`,onChange:P},null,544)])],32))}},Br={class:`flex w-full flex-col gap-6 rounded-2xl bg-surface p-6 md:p-8`},Vr={class:`grid gap-4 sm:grid-cols-3`},Hr={class:`text-xs font-semibold uppercase tracking-[0.14em] text-muted`},Ur={key:0,class:`text-center text-sm text-danger`},Wr={class:`flex justify-center`},Gr=[`disabled`],Kr={__name:`CardgenWinnersStep`,setup(e){let r=ir(),i=b(null),a=j(()=>{let e=r.teamSize.value===`duos`?2:1,t=t=>Array.from({length:e},(n,r)=>t*e+r);return[{label:`2nd place`,slots:t(1)},{label:`1st place`,slots:t(0)},{label:`3rd place`,slots:t(2)}]}),o=j(()=>i.value===null?null:r.winnersCards.value[i.value]);async function s(e){i.value!==null&&await r.setWinnersCard(i.value,e)}return(e,c)=>{let u=Dr,d=Mr,m=zr;return n(),p(`section`,Br,[E(u,{scene:D(r).winnersScene.value,scope:D($n)},null,8,[`scene`,`scope`]),f(`div`,Vr,[(n(!0),p(S,null,O(D(a),e=>(n(),p(`div`,{key:e.label,class:`flex flex-col gap-2`},[f(`p`,Hr,l(e.label),1),(n(!0),p(S,null,O(e.slots,e=>(n(),t(d,{key:e,card:D(r).winnersCards.value[e],scope:D($n),index:e,onFile:t=>D(r).setWinnersCard(e,t),onEdit:t=>i.value=e,onClear:t=>D(r).clearWinnersCard(e)},null,8,[`card`,`scope`,`index`,`onFile`,`onEdit`,`onClear`]))),128))]))),128))]),D(r).error.value?(n(),p(`p`,Ur,l(D(r).error.value),1)):A(``,!0),f(`div`,Wr,[f(`button`,{type:`button`,disabled:!D(r).winnersReady.value||D(r).busy.value,class:T([`h-11 w-44 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`,D(r).winnersReady.value&&!D(r).busy.value?`bg-accent text-canvas hover:opacity-90`:`cursor-not-allowed bg-surface text-muted`]),onClick:c[0]||=(...e)=>D(r).downloadWinners&&D(r).downloadWinners(...e)},l(D(r).busy.value?`Working…`:`Download`),11,Gr)]),D(o)?(n(),t(m,{key:1,card:D(o),onUpdate:c[1]||=e=>D(r).updateWinnersCard(D(i),e),onReplace:s,onClose:c[2]||=e=>i.value=null},null,8,[`card`])):A(``,!0)])}}},qr={key:0,class:`text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted`},Jr=[`disabled`],Yr={__name:`CardgenMatchupDrawer`,props:{draft:{type:Object,required:!0},teamSize:{type:String,required:!0}},emits:[`file`,`edit`,`clear`,`commit`,`delete`],setup(e,{emit:r}){let i=e,a=r,o=j(()=>{let e=i.teamSize===`duos`?2:1,t=i.draft.cards.length/e;return Array.from({length:t},(t,n)=>Array.from({length:e},(t,r)=>n*e+r))}),s=j(()=>i.draft.cards.every(Boolean)),c=j(()=>i.draft.editing?`Confirm edit`:i.draft.size===`pair`?`Add pair`:`Add trio`);return(r,i)=>{let u=Mr;return n(),p(`div`,{class:T([`flex flex-col gap-3 rounded-lg border-2 bg-canvas/60 p-3`,e.draft.editing?`border-accent`:`border-line`])},[f(`div`,{class:T([`grid gap-3`,D(o).length===3?`sm:grid-cols-3`:`sm:grid-cols-2`])},[(n(!0),p(S,null,O(D(o),(r,i)=>(n(),p(`div`,{key:i,class:`flex min-w-0 flex-col gap-2`},[e.teamSize===`duos`?(n(),p(`p`,qr,` Side `+l(i+1),1)):A(``,!0),(n(!0),p(S,null,O(r,r=>(n(),t(u,{key:r,card:e.draft.cards[r],scope:D(Qn),index:r,onFile:e=>a(`file`,r,e),onEdit:e=>a(`edit`,r),onClear:e=>a(`clear`,r)},null,8,[`card`,`scope`,`index`,`onFile`,`onEdit`,`onClear`]))),128))]))),128))],2),f(`button`,{type:`button`,disabled:!D(s),class:T([`h-10 rounded-lg text-xs font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`,D(s)?`bg-accent text-canvas hover:opacity-90`:`cursor-not-allowed bg-surface text-muted`]),onClick:i[0]||=e=>a(`commit`)},l(D(c)),11,Jr),f(`button`,{type:`button`,class:`h-10 rounded-lg border border-danger bg-danger-soft text-xs font-semibold uppercase tracking-[0.12em] text-danger transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger`,onClick:i[1]||=e=>a(`delete`)},` Delete `)],2)}}},Xr={class:`flex flex-col items-center gap-1.5`},Zr=[`src`,`title`,`onDragstart`,`onDragover`,`onDragleave`,`onDrop`],Qr={class:`flex gap-1.5`},$r={__name:`CardgenMatchupChip`,props:{matchup:{type:Object,required:!0},active:{type:Boolean,default:!1}},emits:[`edit`,`remove`,`download`],setup(e,{emit:t}){let r=e,i=t,a=ir();function o(e){return a.pendingAt(r.matchup.id,e)??r.matchup.cards[e]}function s(e){return!!a.pendingAt(r.matchup.id,e)}let c=!1;function l(e,t){c=!0,e.dataTransfer.setData(er,`${r.matchup.id}:${t}`),e.dataTransfer.effectAllowed=`move`,a.beginDrag(r.matchup.id,t)}function u(){c||r.active||i(`edit`)}function d(e,t){[...e.dataTransfer?.types??[]].includes(`application/x-cardgen-slot`)&&(e.preventDefault(),e.dataTransfer.dropEffect=`move`,a.hoverSlot(r.matchup.id,t))}return(t,r)=>(n(),p(`div`,Xr,[f(`div`,{class:T([`flex gap-1.5 rounded-lg border-2 bg-surface p-2 transition-colors`,e.active?`border-accent`:`border-line`])},[(n(!0),p(S,null,O(e.matchup.cards,(t,i)=>(n(),p(`img`,{key:i,src:o(i)?.src,alt:``,draggable:`true`,title:e.active?``:`Click to edit, or drag to swap`,class:T([`h-[5.25rem] w-[3.55rem] cursor-grab rounded-sm object-cover transition-opacity active:cursor-grabbing`,s(i)&&`opacity-50 outline outline-2 outline-dashed outline-accent`]),onPointerdown:r[0]||=e=>C(c)?c.value=!1:c=!1,onClick:u,onDragstart:e=>l(e,i),onDragend:r[1]||=(...e)=>D(a).endDrag&&D(a).endDrag(...e),onDragover:e=>d(e,i),onDragleave:t=>D(a).leaveSlot(e.matchup.id,i),onDrop:F(t=>D(a).dropOn(e.matchup.id,i),[`prevent`])},null,42,Zr))),128))],2),f(`div`,Qr,[f(`button`,{type:`button`,"aria-label":`Edit matchup`,class:T([`grid size-7 place-items-center rounded-md transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent`,e.active?`text-accent`:`text-ink`]),onClick:r[2]||=e=>i(`edit`)},[...r[5]||=[f(`svg`,{viewBox:`0 0 16 16`,class:`size-4`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.6`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[f(`path`,{d:`M11.5 2.5l2 2L6 12l-3 1 1-3z`})],-1)]],2),f(`button`,{type:`button`,"aria-label":`Download this matchup`,class:`grid size-7 place-items-center rounded-md text-ink transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent`,onClick:r[3]||=e=>i(`download`)},[...r[6]||=[f(`svg`,{viewBox:`0 0 16 16`,class:`size-4`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.6`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[f(`path`,{d:`M8 2.5v7.5M4.75 7l3.25 3 3.25-3M3 13h10`})],-1)]]),f(`button`,{type:`button`,"aria-label":`Remove matchup`,class:`grid size-7 place-items-center rounded-md bg-danger-soft text-danger transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-danger`,onClick:r[4]||=e=>i(`remove`)},[...r[7]||=[f(`svg`,{viewBox:`0 0 16 16`,class:`size-4`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`},[f(`path`,{d:`M4 8h8`})],-1)]])])]))}},ei=[`aria-label`],ti={class:`text-base font-semibold`},ni={class:`flex justify-end gap-2`},ri={__name:`CardgenConfirmModal`,props:{title:{type:String,required:!0},confirmLabel:{type:String,default:`Confirm`},cancelLabel:{type:String,default:`Cancel`}},emits:[`confirm`,`cancel`],setup(e,{emit:t}){let r=t;function i(e){e.key===`Escape`&&r(`cancel`)}return h(()=>document.addEventListener(`keydown`,i)),m(()=>document.removeEventListener(`keydown`,i)),(t,i)=>(n(),p(`div`,{class:`fixed inset-0 z-50 grid place-items-center bg-canvas/80 p-4`,onPointerdown:i[2]||=F(e=>r(`cancel`),[`self`])},[f(`div`,{role:`alertdialog`,"aria-modal":`true`,"aria-label":e.title,class:`flex w-full max-w-sm flex-col gap-5 rounded-xl bg-surface p-6 text-ink`},[f(`p`,ti,l(e.title),1),f(`div`,ni,[f(`button`,{type:`button`,class:`h-10 rounded-lg bg-accent px-5 text-sm font-semibold text-canvas transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`,onClick:i[0]||=e=>r(`cancel`)},l(e.cancelLabel),1),f(`button`,{type:`button`,class:`h-10 rounded-lg bg-danger px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger`,onClick:i[1]||=e=>r(`confirm`)},l(e.confirmLabel),1)])],8,ei)],32))}},ii={class:`grid w-full gap-8 rounded-2xl bg-surface p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:p-8`},ai={key:1,class:`w-full overflow-hidden rounded-xl border border-line bg-canvas/40`,style:{"aspect-ratio":`5 / 3`}},oi=[`src`],si={key:0,class:`flex flex-col items-center gap-3`},ci=[`onClick`],li={class:`pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap text-xs text-muted/70 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100`},ui={key:1},di={class:`flex flex-col gap-4`},fi={class:`flex min-h-80 flex-1 flex-col rounded-xl bg-canvas/60 p-4`},pi={key:0,class:`flex flex-1 flex-wrap content-start items-start gap-5`},mi={key:1,class:`grid flex-1 place-items-center text-center text-sm text-muted`},hi={key:2,class:`pt-3 text-center text-xs text-muted/70`},gi={key:0,class:`text-center text-sm text-danger`},_i={class:`flex flex-col items-center gap-2`},vi={class:`flex flex-wrap items-center justify-center gap-3`},yi=[`disabled`],bi=[`disabled`],xi=[`disabled`],Si={key:0,class:`text-xs text-muted`},Ci=`Drag around cards to reorder`,wi={__name:`CardgenVersusStep`,setup(e){let r=ir(),i=b(null),a=b(!1),c=b(null),u=b(null),_=b(null),v=j(()=>i.value===null?null:r.draft.value?.cards[i.value]),y=j(()=>{let e=r.draftScene.value?.canvas??{w:5,h:3};return{maxWidth:`calc(var(--preview-max-h) * ${e.w} / ${e.h})`}}),x=[{size:`pair`,label:`Pair`,hint:`Add 2 card matchup`},{size:`trio`,label:`Trio`,hint:`Add 3 card matchup`},{size:`multi`,label:`Multi`,hint:`Add multiple matchups (4+ cards)`}],C=b(``);function w(e){return{mouseenter:()=>{C.value=e},mouseleave:()=>{C.value=``},focus:()=>{C.value=e},blur:()=>{C.value=``}}}function T(e){e===`multi`?c.value?.click():r.startDraft(e)}async function ee(e){i.value!==null&&await r.setDraftCard(i.value,e)}function k(){let e=r.draft.value?.id;e&&r.removeMatchup(e),r.cancelDraft()}function M(e){let t=[...e.target.files??[]];t.length&&r.addMulti(t),e.target.value=``}function N(e){let t=e.target.files?.[0];t&&r.setBackground(t),e.target.value=``}function P(e){r.draft.value&&r.draftReady.value&&(i.value!==null||a.value||_.value?.contains(e.target)||r.commitDraft())}function F(){a.value=!1,C.value=``,r.clearAll()}return h(()=>document.addEventListener(`pointerdown`,P)),m(()=>document.removeEventListener(`pointerdown`,P)),(e,m)=>{let h=Dr,b=Yr,j=$r,P=zr,I=ri;return n(),p(`section`,ii,[f(`div`,{ref_key:`builderBox`,ref:_,class:`flex flex-col gap-5`},[f(`div`,{class:`relative mx-auto w-full`,style:o(D(y))},[D(r).draft.value?(n(),t(h,{key:0,scene:D(r).draftScene.value,scope:D(Qn)},null,8,[`scene`,`scope`])):(n(),p(`div`,ai,[D(r).background.value?(n(),p(`img`,{key:0,src:D(r).background.value.src,alt:`The uploaded background`,class:`h-full w-full object-contain`},null,8,oi)):A(``,!0)])),f(`button`,{type:`button`,"aria-label":`Replace the background`,title:`Replace the background`,class:`absolute bottom-2 left-2 grid size-9 place-items-center rounded-lg border border-line bg-surface/90 text-ink shadow-sm transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,onClick:m[0]||=e=>D(u)?.click()},[...m[10]||=[f(`svg`,{viewBox:`0 0 16 16`,class:`size-4`,fill:`none`,stroke:`currentColor`,"stroke-width":`1.6`,"stroke-linecap":`round`,"stroke-linejoin":`round`},[f(`path`,{d:`M11.5 2.5l2 2L6 12l-3 1 1-3z`})],-1)]])],4),D(r).draft.value?(n(),p(`div`,ui,[E(b,{draft:D(r).draft.value,"team-size":D(r).teamSize.value,onFile:m[1]||=(e,t)=>D(r).setDraftCard(e,t),onEdit:m[2]||=e=>i.value=e,onClear:m[3]||=e=>D(r).clearDraftCard(e),onCommit:D(r).commitDraft,onDelete:k},null,8,[`draft`,`team-size`,`onCommit`])])):(n(),p(`div`,si,[(n(),p(S,null,O(x,e=>f(`div`,{key:e.size,class:`group relative`},[f(`button`,{type:`button`,class:`flex w-32 items-center gap-3 text-base font-semibold text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,onClick:t=>T(e.size)},[m[11]||=f(`span`,{class:`grid size-8 shrink-0 place-items-center rounded-full border-2 border-current`},[f(`svg`,{viewBox:`0 0 16 16`,class:`size-4`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`},[f(`path`,{d:`M8 3.5v9M3.5 8h9`})])],-1),s(` `+l(e.label),1)],8,ci),f(`span`,li,l(e.hint),1)])),64))]))],512),f(`div`,di,[f(`div`,fi,[D(r).matchups.value.length?(n(),p(`div`,pi,[(n(!0),p(S,null,O(D(r).matchups.value,e=>(n(),t(j,{key:e.id,matchup:e,active:D(r).draft.value?.id===e.id,onEdit:t=>D(r).editMatchup(e.id),onRemove:t=>D(r).removeMatchup(e.id),onDownload:t=>D(r).downloadMatchup(e.id)},null,8,[`matchup`,`active`,`onEdit`,`onRemove`,`onDownload`]))),128))])):(n(),p(`p`,mi,` Matchups you add will collect here. `)),D(r).matchups.value.length?(n(),p(`p`,hi,l(D(C)||Ci),1)):A(``,!0)]),D(r).error.value?(n(),p(`p`,gi,l(D(r).error.value),1)):A(``,!0),f(`div`,_i,[f(`div`,vi,[f(`button`,d({type:`button`,disabled:!D(r).versusReady.value,class:[`h-11 w-28 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger`,D(r).versusReady.value?`bg-danger text-white hover:opacity-90`:`cursor-not-allowed bg-surface text-muted`]},g(w(`Delete all matchups`),!0),{onClick:m[4]||=e=>a.value=!0}),` Clear `,16,yi),f(`button`,d({type:`button`,disabled:!D(r).versusReady.value,class:[`h-11 w-32 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`,D(r).versusReady.value?`bg-line text-ink hover:opacity-90`:`cursor-not-allowed bg-surface text-muted`]},g(w(`Randomize order of all cards`),!0),{onClick:m[5]||=(...e)=>D(r).shuffleMatchups&&D(r).shuffleMatchups(...e)}),` Shuffle `,16,bi),f(`button`,d({type:`button`,disabled:!D(r).versusReady.value||D(r).busy.value,class:[`h-11 w-40 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`,D(r).versusReady.value&&!D(r).busy.value?`bg-accent text-canvas hover:opacity-90`:`cursor-not-allowed bg-surface text-muted`]},g(w(`Download all matchups`),!0),{onClick:m[6]||=(...e)=>D(r).downloadMatchups&&D(r).downloadMatchups(...e)}),l(D(r).busy.value?`Working…`:`Download`),17,xi)]),D(r).progress.value?(n(),p(`p`,Si,l(D(r).progress.value),1)):A(``,!0)])]),D(v)?(n(),t(P,{key:0,card:D(v),onUpdate:m[7]||=e=>D(r).updateDraftCard(D(i),e),onReplace:ee,onClose:m[8]||=e=>i.value=null},null,8,[`card`])):A(``,!0),D(a)?(n(),t(I,{key:1,title:`Are you sure you want to clear all the matchups?`,"confirm-label":`Clear`,onConfirm:F,onCancel:m[9]||=e=>a.value=!1})):A(``,!0),f(`input`,{ref_key:`multiInput`,ref:c,type:`file`,accept:`image/*`,multiple:``,class:`sr-only`,onChange:M},null,544),f(`input`,{ref_key:`bgInput`,ref:u,type:`file`,accept:`image/*`,class:`sr-only`,onChange:N},null,544)])}}},Ti={class:`pointer-events-none fixed right-4 top-20 z-50 flex justify-end md:right-6`,role:`alert`},Ei={key:0,class:`pointer-events-auto flex max-w-xs items-start gap-2.5 rounded-lg border-2 border-danger bg-danger-soft px-3.5 py-2.5 text-sm leading-snug text-ink shadow-lg`},Di={class:`min-w-0`},Oi=R({__name:`CardgenToast`,setup(e){let t=ir();return(e,r)=>(n(),p(`div`,Ti,[E(I,{name:`toast`},{default:x(()=>[D(t).toast.value?(n(),p(`div`,Ei,[r[2]||=f(`svg`,{viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"aria-hidden":`true`,class:`mt-0.5 size-4 shrink-0 text-danger`},[f(`circle`,{cx:`12`,cy:`12`,r:`9`}),f(`path`,{d:`M12 7.5v5.5M12 16.5v.01`})],-1),f(`p`,Di,l(D(t).toast.value),1),f(`button`,{type:`button`,"aria-label":`Dismiss`,class:`-mr-1 -mt-0.5 shrink-0 rounded p-1 text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,onClick:r[0]||=(...e)=>D(t).dismissToast&&D(t).dismissToast(...e)},[...r[1]||=[f(`svg`,{viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":`2`,"stroke-linecap":`round`,"aria-hidden":`true`,class:`size-3.5`},[f(`path`,{d:`M6 6l12 12M18 6L6 18`})],-1)]])])):A(``,!0)]),_:1})]))}},[[`__scopeId`,`data-v-154a9e13`]]),ki={class:`flex w-full flex-col gap-6`},Ai={class:`flex w-full flex-wrap items-baseline justify-between gap-3`},ji={class:`mt-0.5 text-sm text-muted`},Mi={__name:`CardgenApp`,setup(e){let r=ir();Qe(_().app.baseURL),h(()=>{Un().catch(()=>{})});let i=j(()=>r.step.value===`setup`?`Start with a background`:r.mode.value===`winners`?`Build the podium`:`Build your matchups`);return(e,a)=>{let o=Sr,s=Kr,c=wi,u=Oi;return n(),p(`div`,ki,[f(`header`,Ai,[f(`div`,null,[a[1]||=f(`h1`,{class:`text-xl font-bold tracking-tight md:text-2xl`},`Card Comp Generator`,-1),f(`p`,ji,l(D(i)),1)]),D(r).step.value===`build`?(n(),p(`button`,{key:0,type:`button`,class:`text-sm font-semibold text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,onClick:a[0]||=(...e)=>D(r).back&&D(r).back(...e)},` ← Background and mode `)):A(``,!0)]),D(r).step.value===`setup`?(n(),t(o,{key:0})):D(r).mode.value===`winners`?(n(),t(s,{key:1})):(n(),t(c,{key:2})),E(u)])}}};w({name:`ServerPlaceholder`,render(){return p(`div`)}});var Ni=Symbol.for(`nuxt:client-only`),Pi=w({name:`ClientOnly`,inheritAttrs:!1,props:[`fallback`,`placeholder`,`placeholderTag`,`fallbackTag`],setup(e,{slots:t,attrs:n}){let r=k(!1);h(()=>{r.value=!0});let o=a();return o&&(o._nuxtClientOnly=!0),i(Ni,!0),()=>{if(r.value){let e=t.default?.();return e&&e.length===1?[y(e[0],n)]:e}let i=t.fallback||t.placeholder;if(i)return c(i);let a=e.fallback||e.placeholder||``,o=P(e.fallbackTag||e.placeholderTag,`span`);return p(o,n,a)}}}),Fi=e({default:()=>Ii}),Ii={__name:`cc-gen`,setup(e){return M({title:`Card Comp Generator — Karuta Stuff`}),(e,r)=>{let i=Mi,a=Pi;return n(),t(a,null,{fallback:x(()=>[...r[0]||=[f(`p`,{class:`p-8 text-sm text-muted`},`Loading the generator…`,-1)]]),default:x(()=>[E(i)]),_:1})}}};export{Ii as default,Gn as n,Y as r,Fi as t};