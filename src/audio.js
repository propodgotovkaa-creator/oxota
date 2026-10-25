export class Sound {
 constructor(){this.muted=false;this.ready=false;this.loops={};this.buffers={};this.ctx=null;}
 async load(){const names=['hum','catch','charge','appear','laugh','door','paper','spark','victory','resist'];this.raw=await Promise.all(names.map(async n=>[n,await (await fetch(`assets/${n}.wav`)).arrayBuffer()]));}
 async start(){if(this.ready){await this.ctx.resume();return;}this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=this.muted?0:.55;this.master.connect(this.ctx.destination);for(const[n,data]of this.raw)this.buffers[n]=await this.ctx.decodeAudioData(data.slice(0));this.ready=true;}
 play(n,volume=.5){if(!this.ready)return;const s=this.ctx.createBufferSource(),g=this.ctx.createGain();s.buffer=this.buffers[n];g.gain.value=volume;s.connect(g).connect(this.master);s.start();}
 loop(n,volume){if(!this.ready)return;if(!this.loops[n]){const s=this.ctx.createBufferSource(),g=this.ctx.createGain();s.buffer=this.buffers[n];s.loop=true;s.connect(g).connect(this.master);s.start();this.loops[n]={s,g};}this.loops[n].g.gain.setTargetAtTime(volume,this.ctx.currentTime,.08);}
 mute(){this.muted=!this.muted;if(this.master)this.master.gain.setTargetAtTime(this.muted?0:.55,this.ctx.currentTime,.04);return this.muted;}
 suspend(){this.loop('hum',0);this.ctx?.suspend();}
}
