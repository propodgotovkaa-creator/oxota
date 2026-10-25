import {clamp} from './vacuum.js';
const CAST=[['ghost','jester','librarian','scientist'],['librarian','ghost','scientist','jester'],['scientist','jester','ghost','librarian'],['jester','scientist','ghost']];
const behavior=()=>({spawned:false,spawnDelay:0,attackTime:0,idleTime:0,scale:1});
export function makeGhosts(level){const n=[4,4,4,3][level];return Array.from({length:n},(_,i)=>({...behavior(),id:i,x:180+(i%3)*410,y:205+Math.floor(i/3)*190,homeX:180+(i%3)*410,homeY:205+Math.floor(i/3)*190,phase:i*2.4,radius:75,progress:0,caught:false,opacity:0,available:false,kind:CAST[level][i],hue:0,boss:false,round:0,escape:0,age:0,spawnDelay:.5+i*2.6}));}
export function makeBoss(){return {...behavior(),id:99,x:1030,y:265,homeX:640,homeY:260,phase:0,radius:145,progress:0,caught:false,opacity:0,available:false,kind:'boss',hue:0,boss:true,round:0,escape:1.3,age:0};}
export function updateGhost(g,dt,time,level,vacuum,locked,onCatch,onBreak,onEvent=()=>{},canAttack=true){
 if(g.caught)return;
 g.age+=dt;
 if(g.age<g.spawnDelay){g.available=false;g.opacity=0;return;}
 if(!g.spawned){g.spawned=true;onEvent('appear',g);}
 g.escape=Math.max(0,g.escape-dt);
 const cycle=(time+g.phase)%11;
 const hidden=!g.boss&&!g.attackTime&&((level===1&&g.id%2===0&&cycle>8.3)||(level===2&&cycle>7.8));
 g.available=!hidden&&g.escape<=0&&g.age-g.spawnDelay>.8;
 g.opacity+=((hidden?(level===1?.03:.14):1)-g.opacity)*(1-Math.exp(-dt*5));
 const held=vacuum.active&&locked===g.id&&g.available&&vacuum.inBeam(g);
 if(held){
   if(g.progress===0){g.captureX=g.x;g.captureY=g.y;}
   g.attackTime=0;g.idleTime=0;
   g.progress+=dt/(g.boss?2.8:2.35);
   if(g.progress>=1){
     g.progress=0;
     if(g.boss&&g.round<2){g.round++;g.escape=1.6;g.homeX=g.round===1?950:340;g.homeY=240;onBreak(g);}
     else {g.caught=true;onCatch(g);return;}
   }
 }else {
   g.progress=0;
   if(g.available&&!g.attackTime)g.idleTime+=dt;
   if(canAttack&&g.available&&!g.attackTime&&g.idleTime>=5+(g.boss?1:g.id*.8)){
     g.attackTime=.001;g.attackX=g.x;g.attackY=g.y;g.idleTime=0;onEvent('attack',g);
   }
 }
 let approach=0;
 if(g.attackTime){g.attackTime+=dt;approach=Math.sin(Math.min(1,g.attackTime/2.2)*Math.PI)**2;
   if(g.attackTime>=2.2){g.attackTime=0;g.idleTime=0;approach=0;}}
 g.scale+=((1+approach*(g.boss?.35:.65))-g.scale)*(1-Math.exp(-dt*8));
 const p=g.progress,tip=vacuum.tip;
 // Broad room-scale paths. Capture freezes the flight anchor for forgiving aim.
 const flyX=g.boss?g.homeX+Math.sin(time*.27)*130:640+Math.sin(time*.16+g.phase)*450;
 const flyY=g.boss?g.homeY+Math.cos(time*.35)*65:315+Math.cos(time*.23+g.phase*1.3)*135;
 let hx=held?g.captureX:flyX,hy=held?g.captureY:flyY;
 if(g.attackTime){hx=g.attackX+(640-g.attackX)*approach*.78;hy=g.attackY+(365-g.attackY)*approach*.78;}
 const pull=p*p*.88;
 const tx=hx*(1-pull)+tip.x*pull+Math.sin(time*24+g.phase)*p*(1-p)*42;
 const ty=hy*(1-pull)+tip.y*pull+Math.cos(time*21)*p*(1-p)*20;
 const ease=1-Math.exp(-dt*(held?7:2.4));
 let dx=(clamp(tx,75,1205)-g.x)*ease,dy=(clamp(ty,145,590)-g.y)*ease;
 if(!held){const distance=Math.hypot(dx,dy),limit=dt*(g.escape>0?210:g.attackTime?360:88);if(distance>limit){dx*=limit/distance;dy*=limit/distance;}}
 g.x+=dx;g.y+=dy;
}
