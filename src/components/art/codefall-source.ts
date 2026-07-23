// CodeFall worker source, as a STRING.
//
// It is a string because it has to become a Blob URL inside the inline boot
// script in CodeFall.tsx. That is what lets the hero art start before anything
// else on the page: no module graph, no bundle, no extra network request. A
// separate .js file in public/ would work too, but it would be a request that
// has to land before a single glyph appears, which defeats the purpose.
//
// WHY A WORKER AT ALL. requestAnimationFrame and canvas 2D both run on the main
// thread. Measured on this site 2026-07-23: the main thread is blocked for
// ~434ms while the browser parses 1,148 KB of application JavaScript, so
// anything drawn from the page freezes solid through that window no matter how
// early it started. Proven in lab/codefall/: across four consecutive 450ms
// blocks the page-driven copy dropped 472ms while the worker copy's longest gap
// was 35ms, which is one frame at the 30fps throttle.
//
// The algorithm below is the same one CodeFall.tsx runs as its fallback. Keep
// them in step: same glyph set, same brand stops, same column ranges, same dt
// cap, same orb constants. The lab folder holds the readable copy of this.
//
// Nothing here may touch window or document. A worker has neither.

export const CODEFALL_WORKER_SOURCE = String.raw`
var GLYPHS="01<>/{}[]()=+-*;:&|!?$#@.abcdefghijklmnopqrstuvwxyz0123456789{}</>";
var HEAD=[102,41,188],TN=[36,57,137],TF=[174,185,234];
var ORB_R=59,SPRING=26,FRICTION=7,FRAME_MS=1000/30;
var cv=null,ctx=null,font="monospace",animate=true,paused=false,parked=false;
var cssW=0,cssH=0,colW=0,rowH=0,rows=0,fontPx=0,cols=0,columns=[],last=0;
var mx=-9999,my=-9999,ox=-9999,oy=-9999,ovx=0,ovy=0,ostr=0,otar=0;

function rand(a,b){return a+Math.random()*(b-a)}
function pick(){return GLYPHS[(Math.random()*GLYPHS.length)|0]}
function lerp(a,b,t){return a+(b-a)*t}

function newColumn(above){
  var len=Math.round(rand(10,26)),ch=[];
  for(var q=0;q<len+rows+2;q++)ch.push(pick());
  return {head:above?rand(-rows*1.1,rows*0.7):rand(-len,-1),
    speed:rand(5.5,13),len:len,dim:rand(0.4,1),chars:ch,lastRow:-9999};
}

function layout(w,h,dpr){
  cssW=w;cssH=h;
  fontPx=Math.max(13,Math.min(17,Math.round(cssW/30)));
  cv.width=Math.round(cssW*dpr);cv.height=Math.round(cssH*dpr);
  // Assigning width/height resets every context property, so transform and font
  // must be re-applied AFTER it.
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.font=fontPx+"px "+font;
  ctx.textBaseline="top";
  colW=Math.max(8,Math.ceil(ctx.measureText("0").width)+1);
  rowH=Math.round(fontPx*1.18);
  rows=Math.ceil(cssH/rowH)+2;
  cols=Math.ceil(cssW/colW);
  columns=[];
  for(var i=0;i<cols;i++)columns.push(newColumn(true));
}

function blit(ch,px,py,scale){
  if(scale===1){ctx.fillText(ch,px,py);return}
  var cx=px+colW*0.45,cy=py+fontPx*0.5;
  ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);
  ctx.fillText(ch,px-cx,py-cy);ctx.restore();
}

function drawColumn(col,x){
  var headRow=Math.floor(col.head);
  for(var k=0;k<col.len;k++){
    var row=headRow-k;
    if(row<0||row>rows)continue;
    var ch=col.chars[row]||pick(),gx=x,gy=row*rowH,scale=1;
    if(ostr>0.001){
      var cx=gx+colW*0.45,cy=gy+fontPx*0.5,dx=cx-ox,dy=cy-oy;
      var r=Math.sqrt(dx*dx+dy*dy);
      if(r<ORB_R){
        var nr=r/ORB_R,rp=ORB_R*Math.sin(nr*(Math.PI/2));
        if(r>0.0001){var f=(rp-r)*ostr;gx+=(dx/r)*f;gy+=(dy/r)*f}
        var nrp=Math.min(1,rp/ORB_R),z=Math.sqrt(Math.max(0,1-nrp*nrp));
        scale=1+Math.pow(z,1.2)*0.65*ostr;
      }
    }
    var t=k/col.len;
    if(k===0){
      ctx.shadowColor="rgba(102, 41, 188, 0.55)";ctx.shadowBlur=7;
      ctx.fillStyle="rgba("+HEAD[0]+", "+HEAD[1]+", "+HEAD[2]+", "+(0.95*col.dim)+")";
      blit(ch,gx,gy,scale);ctx.shadowBlur=0;
    } else {
      var ct=Math.min(1,t*1.3);
      var rr=lerp(TN[0],TF[0],ct),gg=lerp(TN[1],TF[1],ct),bb=lerp(TN[2],TF[2],ct);
      var a=Math.pow(1-t,1.5)*0.82*col.dim;
      ctx.fillStyle="rgba("+(rr|0)+", "+(gg|0)+", "+(bb|0)+", "+a+")";
      blit(ch,gx,gy,scale);
    }
  }
}

function paint(){
  ctx.clearRect(0,0,cssW,cssH);
  for(var i=0;i<columns.length;i++)drawColumn(columns[i],i*colW);
}

function frame(now){
  requestAnimationFrame(frame);
  if(paused||parked||!animate)return;
  if(last&&now-last<FRAME_MS)return;
  var dt=last?Math.min((now-last)/1000,0.066):0;
  last=now;
  // The orb has mass: it accelerates toward the pointer under a soft spring and
  // coasts, rather than snapping.
  if(ostr<0.01){ox=mx;oy=my;ovx=0;ovy=0}
  ovx+=(mx-ox)*SPRING*dt;ovy+=(my-oy)*SPRING*dt;
  var fr=Math.exp(-FRICTION*dt);ovx*=fr;ovy*=fr;
  ox+=ovx*dt;oy+=ovy*dt;
  ostr+=(otar-ostr)*Math.min(1,dt*3.5);
  for(var i=0;i<columns.length;i++){
    var col=columns[i];
    col.head+=col.speed*dt;
    var hr=Math.floor(col.head);
    if(hr!==col.lastRow){
      col.lastRow=hr;
      if(hr>=0&&hr<col.chars.length)col.chars[hr]=pick();
      if(Math.random()<0.5)col.chars[(Math.random()*col.chars.length)|0]=pick();
    }
    if(hr-col.len>rows)columns[i]=newColumn(false);
  }
  paint();
}

self.onmessage=function(e){
  var d=e.data;
  if(d.type==="init"){
    cv=d.canvas;ctx=cv.getContext("2d");font=d.font||"monospace";animate=!!d.animate;
    layout(d.cssW,d.cssH,d.dpr);
    paint(); // first frame immediately, not on the next rAF
    requestAnimationFrame(frame);
  } else if(d.type==="resize"&&ctx){
    layout(d.cssW,d.cssH,d.dpr);
    last=0; // a fresh dt, so the resize does not integrate one huge step
    paint();
  } else if(d.type==="pointer"&&ctx){
    mx=d.x;my=d.y;otar=d.inside?1:0;
  } else if(d.type==="paused"){
    paused=!!d.value; if(!paused)last=0;
  } else if(d.type==="parked"){
    // Off-screen: stop integrating entirely, the same way the page version
    // parks its loop via IntersectionObserver.
    parked=!!d.value; if(!parked)last=0;
  }
};
`;
