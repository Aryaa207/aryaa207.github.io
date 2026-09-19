import * as THREE from 'three';
import { AngleFilter, orientation, type Motion } from './imu-signals';
export async function mountImu(root:HTMLElement){
 const host=root.querySelector<HTMLElement>('[data-imu-canvas]')!,dashboard=root.querySelector<HTMLElement>('[data-imu]')!;
 const status=root.querySelector<HTMLElement>('[data-imu-status]')!,pause=root.querySelector<HTMLButtonElement>('[data-imu-pause]')!,reset=root.querySelector<HTMLButtonElement>('[data-imu-reset]')!,stepButton=root.querySelector<HTMLButtonElement>('[data-imu-step]')!,select=root.querySelector<HTMLSelectElement>('#imu-motion')!;
 const angleCanvas=root.querySelector<HTMLCanvasElement>('[data-angle-chart]')!,accelCanvas=root.querySelector<HTMLCanvasElement>('[data-accel-chart]')!;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.05,30);camera.position.set(3,2.4,4);camera.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight(0xd4f1ff,0x203348,3));const light=new THREE.DirectionalLight(0xffffff,4);light.position.set(2,4,3);scene.add(light);
 const grid=new THREE.GridHelper(9,24,0x385b70,0x20384b);grid.position.y=-1.5;scene.add(grid);
 // Simplified quadcopter visual adapted from the original simulation geometry.
 const drone=new THREE.Group();scene.add(drone);
 const body=new THREE.MeshStandardMaterial({color:0x234054,metalness:.6,roughness:.35}),dark=new THREE.MeshStandardMaterial({color:0x0b1924,metalness:.5,roughness:.4}),metal=new THREE.MeshStandardMaterial({color:0xc6aa79,metalness:.65,roughness:.3}),prop=new THREE.MeshStandardMaterial({color:0x96d5e9,metalness:.35,roughness:.25,transparent:true,opacity:.8});
 function mesh(geometry:THREE.BufferGeometry,material:THREE.Material,x=0,y=0,z=0){const obj=new THREE.Mesh(geometry,material);obj.position.set(x,y,z);drone.add(obj);return obj;}
 mesh(new THREE.CylinderGeometry(.4,.35,.14,6),body);mesh(new THREE.CylinderGeometry(.3,.3,.04,6),dark,0,.1,0);mesh(new THREE.CylinderGeometry(.1,.1,.05,24),metal,0,.14,0);
 for(const [sx,sz] of [[-1,-1],[1,-1],[1,1],[-1,1]]){
  const end=new THREE.Vector3(sx*.9,0,sz*.9),arm=mesh(new THREE.CylinderGeometry(.04,.04,end.length(),10),dark,end.x/2,0,end.z/2);arm.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.clone().normalize());
  mesh(new THREE.CylinderGeometry(.11,.11,.12,20),metal,end.x,.07,end.z);
  const blade=mesh(new THREE.BoxGeometry(.67,.016,.085),prop,end.x,.16,end.z);blade.rotation.y=sx*sz*.6;
  mesh(new THREE.CylinderGeometry(.035,.035,.05,12),dark,end.x,.16,end.z);mesh(new THREE.CylinderGeometry(.022,.022,.35,8),dark,end.x*.75,-.22,end.z*.75);
 }
 mesh(new THREE.BoxGeometry(.18,.14,.18),dark,0,-.13,.36);const lens=mesh(new THREE.CylinderGeometry(.058,.058,.08,16),prop,0,-.13,.47);lens.rotation.x=Math.PI/2;
 mesh(new THREE.SphereGeometry(.075,16,8,0,Math.PI*2,0,Math.PI/2),metal,0,.16,-.13);
 const histories:number[][]=Array.from({length:7},()=>[]),colors=['#a2dff255','#edbb8655','#a2dff2','#edbb86','#a2dff2','#edbb86','#bbacf7'];
 let rollFilter=new AngleFilter(),pitchFilter=new AngleFilter(),time=0,yaw=0,previous=orientation(0,'combined'),mode:Motion='combined',seed=207,active=true,visible=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,disposed=false,frame=0,last=0,accumulator=0,sample=0;
 let roll=0,pitch=0,accel=[0,0,9.81];
 const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return(seed/4294967296-.5)*2;};
 function chart(canvas:HTMLCanvasElement,indices:number[],min:number,max:number){const context=canvas.getContext('2d');if(!context)return;const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;const ratio=Math.min(devicePixelRatio,2);if(canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)){canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);}context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,w,h);const left=28,right=w-8,top=10,bottom=h-13;
  context.font='8px ui-monospace,monospace';context.fillStyle='#99b2c4';context.strokeStyle='#8db6ca18';context.lineWidth=1;
  for(let i=0;i<3;i++){const y=top+(bottom-top)*i/2;context.beginPath();context.moveTo(left,y);context.lineTo(right,y);context.stroke();context.fillText(String(max-(max-min)*i/2),3,y+3);}
  context.fillText('−10 s',left,h-2);context.fillText('now',right-19,h-2);
  for(const index of indices){const values=histories[index];context.strokeStyle=colors[index];context.lineWidth=index<2?1:1.6;context.beginPath();values.forEach((v,i)=>{const x=right-(values.length-1-i)/100*(right-left),y=bottom-(v-min)/(max-min)*(bottom-top);if(i===0)context.moveTo(x,y);else context.lineTo(x,y);});context.stroke();}
 }
 function draw(){if(disposed||!active||!visible||document.hidden)return;drone.rotation.set(pitch*Math.PI/180,yaw*Math.PI/180,-roll*Math.PI/180,'YXZ');renderer.render(scene,camera);chart(angleCanvas,[0,1,2,3],-60,60);chart(accelCanvas,[4,5,6],-12,12);}
 function text(){root.querySelector('[data-roll]')!.textContent=`${roll.toFixed(1)}°`;root.querySelector('[data-pitch]')!.textContent=`${pitch.toFixed(1)}°`;root.querySelector('[data-yaw]')!.textContent=`${yaw.toFixed(1)}°`;root.querySelector('[data-accel]')!.textContent=`X ${accel[0].toFixed(2)} · Y ${accel[1].toFixed(2)} · Z ${accel[2].toFixed(2)} m/s²`;root.querySelector('[data-imu-time]')!.textContent=`${time.toFixed(1)} s`;}
 function step(){const dt=1/30;time+=dt;const current=orientation(time,mode),r=current[0]*Math.PI/180,p=current[1]*Math.PI/180;accel=[-Math.sin(p)*9.81+noise()*.25,Math.sin(r)*Math.cos(p)*9.81+noise()*.25,Math.cos(r)*Math.cos(p)*9.81+noise()*.25];const rawRoll=Math.atan2(accel[1],accel[2])*180/Math.PI,rawPitch=Math.atan2(-accel[0],Math.hypot(accel[1],accel[2]))*180/Math.PI;
  roll=rollFilter.update(rawRoll,(current[0]-previous[0])/dt+.12+noise()*.5,dt);pitch=pitchFilter.update(rawPitch,(current[1]-previous[1])/dt-.08+noise()*.5,dt);yaw+=((current[2]-previous[2])/dt+.1+noise()*.3)*dt;previous=current;
  if(sample++%3===0){[rawRoll,rawPitch,roll,pitch,...accel].forEach((v,i)=>{histories[i].push(v);if(histories[i].length>101)histories[i].shift();});text();}
 }
 function animate(now:number){frame=0;if(disposed||paused||!active||!visible||document.hidden){last=0;return;}if(last)accumulator+=Math.min((now-last)/1000,.1);last=now;while(accumulator>=1/30){step();accumulator-=1/30;}draw();frame=requestAnimationFrame(animate);}
 function schedule(){if(!frame&&!paused&&active&&visible&&!document.hidden&&!disposed)frame=requestAnimationFrame(animate);}
 function state(){pause.textContent=paused?'Resume':'Pause';root.dataset.imuPaused=String(paused);status.textContent=`${paused?'Paused':'Simulated inputs'} · no hardware connection`;stepButton.disabled=!paused;}
 function restart(){time=0;yaw=0;roll=0;pitch=0;sample=0;seed=207;last=0;accumulator=0;rollFilter=new AngleFilter();pitchFilter=new AngleFilter();previous=orientation(0,mode);accel=[0,0,9.81];histories.forEach(h=>h.length=0);text();draw();}
 pause.disabled=false;reset.disabled=false;state();root.querySelector<HTMLElement>('.imu-start')!.hidden=true;root.dataset.imuLoaded='true';
 pause.addEventListener('click',()=>{paused=!paused;last=0;state();schedule();});reset.addEventListener('click',restart);stepButton.addEventListener('click',()=>{if(paused){step();text();draw();}});select.addEventListener('change',()=>{mode=select.value as Motion;restart();});
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);draw();}
 const size=new ResizeObserver(resize);size.observe(dashboard);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;draw();schedule();});observer.observe(dashboard);
 const visibility=()=>{last=0;draw();schedule();};document.addEventListener('visibilitychange',visibility);resize();text();
 return{setActive(value:boolean){active=value;last=0;if(value){resize();schedule();}},dispose(){disposed=true;cancelAnimationFrame(frame);size.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility);const materials=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.LineSegments){o.geometry.dispose();for(const m of(Array.isArray(o.material)?o.material:[o.material]))materials.add(m);}});materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();}};
}
