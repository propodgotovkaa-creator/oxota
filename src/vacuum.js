export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export class Vacuum {
 constructor(){this.aim={x:640,y:270};this.angle=-Math.PI/2;this.active=false;this.flash=0;this.total=0;this.base={x:640,y:622};}
 update(dt){const a=Math.atan2(this.aim.y-this.base.y,this.aim.x-this.base.x);const desired=clamp(a,-Math.PI+.13,-.13);let d=desired-this.angle;this.angle+=d*(1-Math.exp(-dt*12));this.flash=Math.max(0,this.flash-dt*1.5);}
 get tip(){return {x:this.base.x+Math.cos(this.angle)*82,y:this.base.y+Math.sin(this.angle)*82};}
 inBeam(ghost){const p=this.tip,dx=ghost.x-p.x,dy=ghost.y-p.y;const along=dx*Math.cos(this.angle)+dy*Math.sin(this.angle);const across=Math.abs(dx*Math.sin(this.angle)-dy*Math.cos(this.angle));return along>-35&&along<1000&&across<46+Math.max(0,along)*.22+ghost.radius*.48;}
 stop(){this.active=false;}
}
