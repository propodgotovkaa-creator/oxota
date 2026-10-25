import fs from 'node:fs';
// Original synthesized score and effects, saved as local PCM assets. No external audio.
const rate=22050,TAU=Math.PI*2;
function wav(name,duration,fn){const count=Math.round(rate*duration),b=Buffer.alloc(44+count*2);b.write('RIFF');b.writeUInt32LE(36+count*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(count*2,40);for(let i=0;i<count;i++){const x=Math.max(-.95,Math.min(.95,fn(i/rate,duration)));b.writeInt16LE(Math.round(x*32767),44+i*2);}fs.writeFileSync(new URL('../assets/'+name+'.wav',import.meta.url),b);}
const sin=(f,t)=>Math.sin(TAU*f*t),env=(t,d)=>Math.min(1,t/.025)*Math.min(1,(d-t)/.08),noise=()=>Math.random()*2-1;
wav('hum',2,(t,d)=>(sin(66,t)*.35+sin(132,t)*.12+noise()*.018)*(.8+.2*sin(4,t)));
wav('charge',1.6,(t,d)=>env(t,d)*(sin(180+t*230,t)*.22+sin(360+t*300,t)*.08)*(1-t/d*.4));
wav('catch',.7,(t,d)=>env(t,d)*(sin(600-500*t,t)*.3+noise()*.08)*Math.exp(-t*3));
wav('appear',1.4,(t,d)=>env(t,d)*sin(180+Math.sin(t*6)*40,t)*.25*Math.sin(Math.PI*t/d));
wav('laugh',1.7,(t,d)=>env(t,d)*(sin(170+Math.sin(t*14)*45,t)*.2+sin(340,t)*.05)*Math.pow(Math.max(0,sin(3.5,t)),2));
wav('resist',.8,(t,d)=>env(t,d)*sin(210+Math.sin(t*22)*70,t)*.18);
wav('door',1.2,(t,d)=>env(t,d)*(sin(100+Math.sin(t*17)*20,t)*.2+noise()*.055)*Math.sin(Math.PI*t/d));
wav('paper',.6,(t,d)=>env(t,d)*noise()*.12*(.5+.5*sin(12,t)));
wav('spark',.35,(t,d)=>env(t,d)*(noise()*.1+sin(2200,t)*.08)*Math.exp(-t*8));
const notes=[261.63,311.13,392,523.25,392,311.13,293.66,392,466.16,587.33,466.16,392,261.63,311.13,415.3,523.25,415.3,311.13,233.08,293.66,349.23,466.16,349.23,293.66];
wav('music',24,(t,d)=>{const beat=Math.floor(t),q=t%1,f=notes[beat];const bell=(sin(f,t)*.19+sin(f*2.001,t)*.07+sin(f*3,t)*.025)*Math.exp(-q*4)*Math.min(1,q*80);const pad=(sin(65.406,t)*.06+sin(98,t)*.025)*(.7+.3*sin(1/12,t));return (bell+pad)*Math.min(1,t/.1,(d-t)/.1);});
const win=[261.63,329.63,392,523.25,659.25,783.99,1046.5,783.99];
wav('victory',4,(t,d)=>{const f=win[Math.min(7,Math.floor(t*2))],q=t%.5;return env(t,d)*(sin(f,t)*.3+sin(f*2,t)*.1)*Math.exp(-q*5);});
console.log('Created 11 local audio assets.');
