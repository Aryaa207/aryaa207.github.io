// Two-state angle / gyro-bias filter, adapted from Aryaa207/sard-assets.
// All angular inputs use degrees and degrees/second consistently.
export class AngleFilter {
 angle=0; bias=0; private p00=0; private p01=0; private p10=0; private p11=0;
 update(measuredAngle:number,rate:number,dt:number){
  if(!Number.isFinite(dt)||dt<=0)return this.angle;
  this.angle+=dt*(rate-this.bias);
  this.p00+=dt*(dt*this.p11-this.p01-this.p10+.001);
  this.p01-=dt*this.p11;this.p10-=dt*this.p11;this.p11+=.003*dt;
  const s=this.p00+.03,k0=this.p00/s,k1=this.p10/s,error=measuredAngle-this.angle;
  this.angle+=k0*error;this.bias+=k1*error;
  const p00=this.p00,p01=this.p01;
  this.p00-=k0*p00;this.p01-=k0*p01;this.p10-=k1*p00;this.p11-=k1*p01;
  return this.angle;
 }
}
export type Motion='combined'|'roll'|'pitch'|'yaw';
export function orientation(t:number,mode:Motion):[number,number,number]{
 return mode==='roll'?[45*Math.sin(.8*t),0,0]:mode==='pitch'?[0,40*Math.sin(.7*t),0]:mode==='yaw'?[0,0,30*t]:[30*Math.sin(.6*t)+10*Math.sin(1.3*t),25*Math.sin(.5*t),12*t];
}
