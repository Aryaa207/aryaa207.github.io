import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
export async function mountModel(host: HTMLElement){
 const viewport=host.querySelector<HTMLElement>('.model-viewport')!,status=host.querySelector<HTMLElement>('.model-status')!;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 const low=(navigator.hardwareConcurrency??8)<=4;renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,2));renderer.localClippingEnabled=true;renderer.setSize(viewport.clientWidth,viewport.clientHeight);
 viewport.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,viewport.clientWidth/viewport.clientHeight,.01,100);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=.6;controls.maxDistance=8;
 const pmrem=new THREE.PMREMGenerator(renderer),environment=new RoomEnvironment();const env=pmrem.fromScene(environment);scene.environment=env.texture;environment.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xc8e8ff,0x233348,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(3,5,4);scene.add(light);
 const gltf=await new GLTFLoader().loadAsync(host.dataset.src!,e=>{if(e.total)status.textContent=`Loading model… ${Math.round(e.loaded/e.total*100)}%`;});
 const model=gltf.scene,box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 // The recovered model is a visualization mesh with no trustworthy physical calibration.
 const max=Math.max(size.x,size.y,size.z);const normalized=new THREE.Group();normalized.add(model);model.position.sub(center);normalized.scale.setScalar(1.8/max);scene.add(normalized);
 let triangles=0;const materials:THREE.MeshStandardMaterial[]=[];const edges:THREE.LineSegments[]=[];
 model.traverse(o=>{if(o instanceof THREE.Mesh){triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;const list=Array.isArray(o.material)?o.material:[o.material];for(const m of list)if(m instanceof THREE.MeshStandardMaterial){materials.push(m);m.side=THREE.DoubleSide;}const edge=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,28),new THREE.LineBasicMaterial({color:0x80c8ff}));edge.visible=false;o.add(edge);edges.push(edge);}});
 const axis=new THREE.AxesHelper(.32);axis.position.set(-1,-.5,0);scene.add(axis);
 host.querySelector<HTMLElement>('[data-load]')!.hidden=true;host.querySelector<HTMLElement>('.viewer-toolbar')!.hidden=false;
 status.textContent=`${Math.round(triangles).toLocaleString()} triangles · ${host.dataset.size} MB · visualization scale unverified · axes: X red, Y green, Z blue`;
 const fit=()=>{const bounds=new THREE.Box3().setFromObject(normalized);for(let iteration=0;iteration<3;iteration++){camera.lookAt(controls.target);camera.updateMatrixWorld();let extent=0;for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){const projected=new THREE.Vector3(x,y,z).project(camera);extent=Math.max(extent,Math.abs(projected.x),Math.abs(projected.y));}camera.position.multiplyScalar(Math.max(.5,Math.min(1.5,extent/.8)));}controls.update();};
 const reset=()=>{camera.position.set(2.4,1.7,2.8);controls.target.set(0,0,0);fit();};reset();
 let rotating=false,visible=true,frame=0,disposed=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const draw=()=>{if(disposed)return;frame=requestAnimationFrame(draw);if(!visible||document.hidden)return;controls.autoRotate=rotating&&!reduced.matches;controls.autoRotateSpeed=.8;controls.update();renderer.render(scene,camera);};draw();
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});observer.observe(host);
 const resize=new ResizeObserver(()=>{camera.aspect=viewport.clientWidth/viewport.clientHeight;camera.updateProjectionMatrix();renderer.setSize(viewport.clientWidth,viewport.clientHeight);});resize.observe(viewport);
 const toggle=(selector:string,fn:(v:boolean)=>void)=>{const b=host.querySelector<HTMLButtonElement>(selector)!;b.addEventListener('click',()=>{const v=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(v));fn(v);});};
 toggle('[data-wire]',v=>materials.forEach(m=>m.wireframe=v));toggle('[data-xray]',v=>materials.forEach(m=>{m.transparent=v;m.opacity=v?.25:1;m.depthWrite=!v;}));toggle('[data-edges]',v=>edges.forEach(e=>e.visible=v));toggle('[data-rotate]',v=>rotating=v);
 host.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b=>b.addEventListener('click',()=>{const views:Record<string,number[]>={Iso:[2.4,1.7,2.8],Front:[0,0,3.7],Top:[0,3.7,.001],Right:[3.7,0,0]};camera.position.fromArray(views[b.dataset.view!]);controls.target.set(0,0,0);fit();}));
 host.querySelector('[data-reset]')!.addEventListener('click',reset);
 const fullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await host.requestFullscreen();}catch{status.textContent='Fullscreen is not available in this browser.';}};host.querySelector('[data-fullscreen]')!.addEventListener('click',fullscreen);
 const section=host.querySelector<HTMLSelectElement>('[data-section]')!,offset=host.querySelector<HTMLInputElement>('[data-section-offset]')!;
 const clip=()=>{const normals:Record<string,THREE.Vector3>={X:new THREE.Vector3(1,0,0),Y:new THREE.Vector3(0,1,0),Z:new THREE.Vector3(0,0,1)};renderer.clippingPlanes=section.value==='none'?[]:[new THREE.Plane(normals[section.value],Number(offset.value))];};section.addEventListener('change',clip);offset.addEventListener('input',clip);
 viewport.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown','+','-','=','r','w','x','f'].includes(k))e.preventDefault();if(k==='r')reset();if(k==='f')void fullscreen();if(k==='w')host.querySelector<HTMLButtonElement>('[data-wire]')!.click();if(k==='x')host.querySelector<HTMLButtonElement>('[data-xray]')!.click();const spherical=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));if(k==='arrowleft')spherical.theta-=.12;if(k==='arrowright')spherical.theta+=.12;if(k==='arrowup')spherical.phi-=.12;if(k==='arrowdown')spherical.phi+=.12;if(k==='+'||k==='=')spherical.radius*=.9;if(k==='-')spherical.radius*=1.1;spherical.makeSafe();camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(controls.target));controls.update();});
 const cleanup=()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();controls.dispose();env.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.LineSegments){o.geometry.dispose();const list=Array.isArray(o.material)?o.material:[o.material];list.forEach(m=>{for(const value of Object.values(m))if(value instanceof THREE.Texture)value.dispose();m.dispose();});}});renderer.dispose();};window.addEventListener('pagehide',cleanup,{once:true});
}
