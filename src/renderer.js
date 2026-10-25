const lerp=(a,b,t)=>a+(b-a)*t;
export class Renderer{
 constructor(canvas,images){this.ctx=canvas.getContext('2d',{alpha:false});this.images=images;}
 glow(x,y,r,color,alpha=1){const c=this.ctx;c.save();c.globalAlpha=alpha;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore();}
 background(id,time,cleared=false,win=0){const c=this.ctx,img=this.images[id];c.save();const zoom=id==='mansion'?(1.03-Math.min(win/7,1)*.03):1.012;const dx=Math.sin(time*.12)*3;c.drawImage(img,(1280-1280*zoom)/2+dx,(720-720*zoom)/2,1280*zoom,720*zoom);c.fillStyle=`rgba(4,8,20,${cleared?.04:.2})`;c.fillRect(0,0,1280,720);c.restore();
   const calm=cleared?.25:1;
   for(let i=0;i<24;i++){const x=(i*113+time*(i%2?5:-3)+2560)%1280,y=150+(i*67)%530+Math.sin(time*.4+i)*25;this.glow(x,y,1.5+(i%3),'#d8e9ff',.3*calm);}
   if(!cleared)for(let i=0;i<5;i++){const x=((time*13+i*340)%1800)-260,y=640+Math.sin(time*.2+i)*35;const g=c.createRadialGradient(x,y,0,x,y,310);g.addColorStop(0,id==='attic'?'#ae9adc14':'#aacbdc10');g.addColorStop(1,'transparent');c.save();c.scale(1,.4);c.fillStyle=g;c.fillRect(x-310,y-310,620,620);c.restore();}
   if(id==='parlor'){this.glow(165,415,190,'#fa9c24',.06+.025*Math.sin(time*7));c.save();c.translate(1070,397);c.rotate(Math.sin(time*1.8)*.12);c.strokeStyle='#aa874a';c.lineWidth=3;c.beginPath();c.moveTo(0,0);c.lineTo(0,60);c.stroke();this.glow(0,60,9,'#e8ca78',.6);c.restore();}
   if(id==='library'&&!cleared){for(let i=0;i<6;i++){c.save();c.translate(190+i*170+Math.sin(time+i)*22,200+Math.sin(time*.7+i)*90);c.rotate(Math.sin(time+i)*.4);c.globalAlpha=.75;c.drawImage(this.images.page,-13,-18,26,36);c.restore();}}
   if(id==='laboratory'&&!cleared){for(let i=0;i<8;i++)this.glow(125+i*148,410-((time*19+i*20)%100),15,'#72ffd4',.12);if(Math.sin(time*2.1)>.985){c.strokeStyle='#aaeaff';c.lineWidth=2;c.beginPath();c.moveTo(1080,340);for(let i=1;i<9;i++)c.lineTo(1080+i*10,340+Math.sin(i*2.7+time*20)*15);c.stroke();}}
   if(id==='attic'&&!cleared&&Math.sin(time*.49)>.999){c.fillStyle='#b4b8ff18';c.fillRect(0,0,1280,720);}
   if(cleared){this.glow(650,280,650,'#ffc96b',.13);}
 }
 beam(v,time){if(!v.active)return;const c=this.ctx,t=v.tip;c.save();c.translate(t.x,t.y);c.rotate(v.angle);const grad=c.createLinearGradient(0,0,900,0);grad.addColorStop(0,'#aeffe577');grad.addColorStop(.5,'#70ecd21b');grad.addColorStop(1,'#70ecd200');c.fillStyle=grad;c.beginPath();c.moveTo(0,-25);c.lineTo(920,-245);c.lineTo(920,245);c.lineTo(0,25);c.closePath();c.fill();for(let i=0;i<45;i++){const f=(i/45+1-(time*.55)%1)%1;const x=f*850,y=Math.sin(i*9.1+time*4)*(22+x*.2);c.strokeStyle=`rgba(161,255,230,${(1-f)*.65})`;c.lineWidth=1.4;c.beginPath();c.moveTo(x,y);c.lineTo(x+14+f*20,y+Math.sin(time*8+i)*4);c.stroke();}c.restore();this.glow(t.x,t.y,80,'#8fffe8',.2);}
 ghost(g,v,time){if(g.caught||!g.spawned)return;const c=this.ctx,img=this.images[g.kind],p=g.progress,size=g.radius*2.2*(g.scale||1);const h=size*(img.height/img.width);c.save();c.globalAlpha=g.opacity*.91;if(g.hue)c.filter=`hue-rotate(${g.hue}deg)`;
  // Horizontal texture bands follow a curved spine. The tail reaches the nozzle
  // before the head, then the whole ghost winds into a narrow corkscrew.
  const tip=v.tip;const slices=p>0?52:24;
  const spine=(u)=>{const drag=Math.pow(u,1.5)*p;const x0=g.x+Math.sin(time*(p?17:2.3)+u*7+g.phase)*(4+p*19)*u;const y0=g.y-h*.48+u*h;return {x:lerp(x0,tip.x,drag),y:lerp(y0,tip.y,drag)};};
  for(let i=0;i<slices;i++){const u=i/slices,a=spine(u),b=spine((i+1)/slices);const shrink=Math.max(.025,1-p*.93-p*u*.05);const twist=p>.55?Math.sin(u*19-time*17)*p*(1-p)*48:0;const width=size*shrink*(1+Math.sin(u*9+time*12)*p*.09);c.save();c.translate(a.x+twist,a.y);c.rotate(Math.atan2(b.y-a.y,b.x-a.x)-Math.PI/2);const sh=img.height/slices;c.drawImage(img,0,i*sh,img.width,Math.min(sh+1,img.height-i*sh),-width/2,0,width,Math.max(1.2,Math.hypot(b.x-a.x,b.y-a.y)+1.3));c.restore();}
  c.restore();
  if(p>0){c.save();c.strokeStyle='#bdffe5';c.lineWidth=4;c.globalAlpha=.8;c.beginPath();c.arc(g.x,g.y-h*.48-12,18,-Math.PI/2,-Math.PI/2+p*Math.PI*2);c.stroke();c.restore();}
 }
 vacuum(v,time){const c=this.ctx,tip=v.tip;const jiggle=v.flash*Math.sin(time*80)*4;c.save();c.translate(jiggle,0);
  // Flexible ribbed hose with metallic shading, fixed body connection.
  const start={x:1034,y:580},end={x:tip.x-Math.cos(v.angle)*65,y:tip.y-Math.sin(v.angle)*65};
  for(const [width,color]of [[34,'#050d16'],[29,'#51636a'],[23,'#132f38'],[12,'#273f46']]){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(start.x,start.y);c.bezierCurveTo(920,704,740,714,end.x,end.y);c.stroke();}
  for(let i=0;i<40;i++){const u=i/39,k=1-u;const x=k*k*k*start.x+3*k*k*u*920+3*k*u*u*740+u*u*u*end.x;const y=k*k*k*start.y+3*k*k*u*704+3*k*u*u*714+u*u*u*end.y;const dx=3*k*k*(920-start.x)+6*k*u*(740-920)+3*u*u*(end.x-740),dy=3*k*k*(704-start.y)+6*k*u*(714-704)+3*u*u*(end.y-714);c.save();c.translate(x,y);c.rotate(Math.atan2(dy,dx));c.drawImage(this.images.hose,-4,-16,8,32);c.restore();}
  c.drawImage(this.images.vacuum,980,493,268,220);if(v.total){c.save();c.globalAlpha=.5;for(let i=0;i<Math.min(4,v.total);i++){const x=1118+Math.sin(time+i*2)*13,y=598+Math.cos(time*.8+i)*20;c.drawImage(this.images.ghost,x-10,y-14,20,28);}c.restore();}
  if(v.flash>0)this.glow(1120,599,115,'#b5ffe2',v.flash*.6);
  c.save();c.translate(tip.x,tip.y);c.rotate(v.angle+Math.PI/2);c.drawImage(this.images.nozzle,-56,-12,112,106);c.restore();c.restore();
 }
 transition(amount){const c=this.ctx;c.fillStyle=`rgba(210,255,233,${Math.sin(Math.min(1,amount)*Math.PI)*.28})`;c.fillRect(0,0,1280,720);}
}
