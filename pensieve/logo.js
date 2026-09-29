// Letter strokes start as rectangular prisms. Target profiles follow the supplied logo,
// rather than fitting a new cubic frame to it. Orthographic final pose preserves the silhouette.
const logoProfiles = [
 {p:[[5,26],[35,8],[35,19],[13,32]],c:[12,144,154]},
 {p:[[35,8],[66,26],[56,32],[35,19]],c:[40,199,202]},
 {p:[[5,26],[13,32],[13,65],[5,60]],c:[4,112,134]},
 {p:[[56,32],[66,26],[66,59],[56,54]],c:[0,145,157]},
 {p:[[56,54],[66,59],[39,76],[39,64]],c:[4,102,126]},
 {p:[[22,37],[35,29],[47,37],[32,45]],c:[21,189,195]},
 {p:[[22,37],[32,45],[32,76],[22,70]],c:[3,115,140]},
 {p:[[32,45],[47,37],[47,43],[56,37],[56,41],[35,54],[32,52]],c:[5,159,173]}
];
const mix=(a,b,t)=>a+(b-a)*t;
const mixPoint=(a,b,t)=>a.map((x,i)=>mix(x,b[i],t));
const cross2=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
function triangulate(poly){
 let order=poly.map((_,i)=>i);
 const area=poly.reduce((s,p,i)=>{const q=poly[(i+1)%poly.length];return s+p[0]*q[1]-q[0]*p[1]},0);
 if(area<0)order.reverse();
 const triangles=[];
 while(order.length>3){
  let found=false;
  for(let i=0;i<order.length;i++){
   const ids=[order[(i+order.length-1)%order.length],order[i],order[(i+1)%order.length]];
   const [a,b,c]=ids.map(k=>poly[k]);
   if(cross2(a,b,c)<=1e-8)continue;
   if(order.some(k=>!ids.includes(k)&&cross2(a,b,poly[k])>=-1e-8&&cross2(b,c,poly[k])>=-1e-8&&cross2(c,a,poly[k])>=-1e-8))continue;
   triangles.push([a,b,c]);order.splice(i,1);found=true;break;
  }
  if(!found)throw Error('Logo profile triangulation failed');
 }
 triangles.push(order.map(i=>poly[i]));return triangles;
}
function targetPieces(){
 const result=[];
 logoProfiles.slice(0,7).forEach(profile=>{
  const [a,b,c,d]=profile.p;
  for(let i=0;i<3;i++)result.push({p:[mixPoint(a,b,i/3),mixPoint(a,b,(i+1)/3),mixPoint(d,c,(i+1)/3),mixPoint(d,c,i/3)],c:profile.c});
 });
 const triangles=triangulate(logoProfiles[7].p);
 const first=triangles.shift(),mid=mixPoint(first[0],first[1],.5);
 triangles.unshift([first[0],mid,first[2]],[mid,first[1],first[2]]);
 triangles.forEach(([a,b,c])=>result.push({p:[a,b,c,c],c:logoProfiles[7].c}));
 return result;
}
const glyphStrokes=[];
function stroke(letter,ax,ay,bx,by,w=4){
 const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy),nx=-dy/len*w/2,ny=dx/len*w/2;
 glyphStrokes.push({letter,p:[[ax+nx,ay+ny],[bx+nx,by+ny],[bx-nx,by-ny],[ax-nx,ay-ny]]});
}
// Native wordmark placement: x=86…292, y=35…55.
stroke('P',88,35,88,56);stroke('P',88,37,101,37);stroke('P',102,37,102,45);stroke('P',88,46,102,46);
function E(x){stroke('E',x+2,35,x+2,56);stroke('E',x+2,37,x+16,37);stroke('E',x+2,45,x+15,45);stroke('E',x+2,54,x+16,54)}
E(115);
stroke('N',144,35,144,56);stroke('N',144,36,161,55);stroke('N',161,35,161,56);
stroke('S',176,37,192,37);stroke('S',176,37,176,44);stroke('S',176,45,191,45);stroke('S',191,45,191,53);stroke('S',174,54,191,54);
stroke('I',205,35,205,56);
E(218);
stroke('V',246,36,255,54);stroke('V',264,36,255,54);
E(276);
const logoTargets=targetPieces();
// Spread consecutive strokes across the silhouette while keeping one-to-one identity.
logoTargets.sort((a,b)=>a.p.reduce((s,p)=>s+p[1]/4,0)-b.p.reduce((s,p)=>s+p[1]/4,0));
function motionState(ms){
 const s=(Math.max(0,ms)/1000)%14;
 const assembly=s<1.5?0:s<5.5?(s-1.5)/4:s<8.5?1:s<12.5?1-(s-8.5)/4:0;
 return {seconds:s,assembly,phase:s<1.5?'strokes':s<5.5?'assembling':s<8.5?'logo':s<12.5?'disassembling':'strokes',progress:s/14};
}
if(typeof module!=='undefined')module.exports={logoProfiles,glyphStrokes,logoTargets,triangulate,motionState};

(() => {
 'use strict';
 const canvas=document.querySelector('#logo-mesh');
 if(!canvas)return;
 const ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx){canvas.replaceWith(document.createTextNode('로고 애니메이션을 표시할 수 없습니다.'));return}
 const pauseButton=document.querySelector('#logo-motion'),replayButton=document.querySelector('#logo-replay');
 const scrub=document.querySelector('#logo-scrub');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let started=performance.now(),paused=reduced.matches,held=7000,frame=0,lastFrame=0,width=580,height=500;
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10)};
 const center=poly=>poly.reduce((a,p)=>a.map((v,i)=>v+p[i]/poly.length),[0,0]);
 const signedArea=p=>p.reduce((s,v,i)=>{const w=p[(i+1)%p.length];return s+v[0]*w[1]-w[0]*v[1]},0);
 const positive=p=>signedArea(p)<0?[...p].reverse():p;
 function rotate(p,rx,ry,rz){
  let [x,y,z]=p;
  [y,z]=[y*Math.cos(rx)-z*Math.sin(rx),y*Math.sin(rx)+z*Math.cos(rx)];
  [x,z]=[x*Math.cos(ry)+z*Math.sin(ry),-x*Math.sin(ry)+z*Math.cos(ry)];
  return [x*Math.cos(rz)-y*Math.sin(rz),x*Math.sin(rz)+y*Math.cos(rz),z];
 }
 const pieces=glyphStrokes.map((source,i)=>{
  const from=positive(source.p.map(([x,y])=>[(x-189)*.4,(y-45)*.4]));
  let to=positive(logoTargets[i].p.map(([x,y])=>[x-35,y-42]));
  const a=center(from),b=center(to);
  const local=from.map(p=>p.map((v,j)=>v-a[j]));
  // Match cyclic vertex order before changing profile, avoiding twisted quadrilaterals.
  let best=to,cost=Infinity;
  for(let shift=0;shift<4;shift++){
   const q=to.map((_,k)=>to[(k+shift)%4]);
   const c=q.reduce((sum,p,k)=>sum+p.reduce((s,v,j)=>s+(v-b[j]-local[k][j])**2,0),0);
   if(c<cost){best=q;cost=c}
  }
  return {from:local,to:best.map(p=>p.map((v,j)=>v-b[j])),a,b,color:logoTargets[i].c};
 });
 function scene(ms){
  const state=motionState(ms),faces=[];
  const allMove=smooth(state.assembly);
  pieces.forEach((piece,i)=>{
   const u=smooth((state.assembly*4-(i%9)*.055)/3.55),arc=Math.sin(Math.PI*u);
   const depth=4.8;
   const midpoint=[mix(piece.a[0],piece.b[0],u)+Math.sin(i*1.8)*arc*13,
    mix(piece.a[1],piece.b[1],u)+arc*(-20+(i%4)*10),arc*(12+(i%5)*4)];
   const rx=arc*(i%2?1:-1)*Math.PI*.5+.23*(1-u);
   const ry=arc*((i%3)-1)*Math.PI*.5-.12*(1-u);
   const rz=arc*Math.sin(i)*.48;
   const shape=piece.from.map((p,k)=>p.map((v,j)=>mix(v,piece.to[k][j],u)));
   const transform=(p,z)=>rotate([p[0],p[1],z],rx,ry,rz).map((v,j)=>v+midpoint[j]);
   const front=shape.map(p=>transform(p,0)),back=shape.map(p=>transform(p,-depth));
   const color=piece.color;
   faces.push({v:front,c:color,side:false});
   faces.push({v:[...back].reverse(),c:color,side:true});
   for(let k=0;k<4;k++){const n=(k+1)%4;faces.push({v:[front[k],back[k],back[n],front[n]],c:color,side:true})}
  });
  faces.sort((a,b)=>a.v.reduce((sum,p)=>sum+p[2]/4,0)-b.v.reduce((sum,p)=>sum+p[2]/4,0));
  return {state,faces,allMove};
 }
 function render(ms){
  const {state,faces,allMove}=scene(ms);
  ctx.clearRect(0,0,width,height);
  const scale=Math.min(width/113,height/103),cx=width/2,cy=height*.45;
  const project=([x,y])=>[cx+x*scale,cy+y*scale];
  const glow=ctx.createRadialGradient(cx,cy,10,cx,cy,width*.46);
  glow.addColorStop(0,'rgba(0,204,203,.11)');glow.addColorStop(1,'rgba(0,204,203,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
  // Teal solid strokes are fully visible from frame zero in both directions.
  ctx.globalAlpha=1;
  // Once joined, render each contiguous profile as one face to remove AA seams.
  const visibleFaces=state.assembly===1?logoProfiles.map(p=>({v:positive(p.p).map(([x,y])=>[x-35,y-42,0]),c:p.c,side:false})):faces;
  visibleFaces.forEach(face=>{
   // Newell normal also handles triangle faces stored as four vertices with a repeated point.
   const normal=face.v.reduce((n,p,i)=>{const q=face.v[(i+1)%face.v.length];return [n[0]+(p[1]-q[1])*(p[2]+q[2]),n[1]+(p[2]-q[2])*(p[0]+q[0]),n[2]+(p[0]-q[0])*(p[1]+q[1])]},[0,0,0]);
   if(normal[2]<=1e-9)return;
   const length=Math.hypot(...normal);
   const light=.70+.30*Math.max(0,(normal[0]*-.35+normal[1]*-.5+normal[2]*.79)/length);
   const rgb=f=>`rgb(${face.c.map(v=>Math.round(Math.max(0,Math.min(255,v*light*f)))).join(',')})`;
   const paint=ctx.createLinearGradient(cx-width*.35,cy-height*.35,cx+width*.3,cy+height*.4);
   paint.addColorStop(0,rgb(face.side?.75:1.18));paint.addColorStop(1,rgb(face.side?.48:.9));
   ctx.beginPath();face.v.forEach((p,i)=>i?ctx.lineTo(...project(p)):ctx.moveTo(...project(p)));ctx.closePath();
   ctx.fillStyle=paint;ctx.fill();
   // Shared fragment edges disappear on final lock; preserve only the native silhouette.
   if(state.assembly<1){ctx.lineWidth=.65;ctx.strokeStyle=`rgba(58,211,214,${.42*(1-allMove)})`;ctx.stroke()}
  });
  ctx.globalAlpha=1;
  // A subdued floor light supplies depth without changing the final artwork's outline.
  ctx.save();ctx.globalAlpha=allMove*.55;ctx.translate(cx,cy+height*.38);ctx.scale(1,.2);
  [width*.20,width*.31].forEach((r,i)=>{ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.strokeStyle=i?'#174753':'#216573';ctx.lineWidth=1;ctx.stroke()});ctx.restore();
  canvas.dataset.phase=state.phase;canvas.dataset.strokes=String(pieces.length);canvas.dataset.time=String(Math.round(ms));
  canvas.dataset.geometry='wordmark-strokes-to-native-logo';
  canvas.dataset.finalLocked=String(state.assembly===1);
  canvas.dataset.loop='true';
  scrub.value=String(paused&&held===14000?1000:Math.round(state.progress*1000));
 }
 function controls(){pauseButton.textContent=paused?'재생':'일시정지';pauseButton.setAttribute('aria-pressed',String(paused))}
 function resize(){if(!canvas.getClientRects().length)return;width=canvas.clientWidth||580;height=canvas.clientHeight||500;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render(paused?held:performance.now()-started)}
 function tick(now){frame=requestAnimationFrame(tick);if(document.hidden||!canvas.getClientRects().length||now-lastFrame<30||paused)return;lastFrame=now;render(now-started)}
 pauseButton.addEventListener('click',()=>{if(paused){started=performance.now()-held;paused=false}else{held=(performance.now()-started)%14000;paused=true}controls();render(paused?held:performance.now()-started)});
 replayButton.addEventListener('click',()=>{started=performance.now();held=0;paused=false;controls();render(0)});
 scrub.addEventListener('input',()=>{held=Number(scrub.value)/1000*14000;paused=true;controls();render(held)});
 reduced.addEventListener('change',e=>{paused=e.matches;held=7000;started=performance.now()-(paused?7000:0);controls();render(paused?held:0)});
 new ResizeObserver(resize).observe(canvas);controls();resize();frame=requestAnimationFrame(tick);
 addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0});
 addEventListener('pageshow',()=>{if(!frame)frame=requestAnimationFrame(tick)});
})();
