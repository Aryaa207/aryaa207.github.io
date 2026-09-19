import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { sardComponents } from './sard-components';
export async function mountSlicer(root:HTMLElement){
 const host=root.querySelector<HTMLElement>('[data-slicer-canvas]')!,status=root.querySelector<HTMLElement>('[data-slicer-status]')!,marker=root.querySelector<HTMLElement>('[data-marker]')!;
 status.textContent='Loading airframe…';
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.localClippingEnabled=true;renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(33,1,.01,20),clip=new THREE.Plane(new THREE.Vector3(0,-1,0),1);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xc2e7ff,0x24394b,2));const key=new THREE.DirectionalLight(0xf6ead7,3);key.position.set(3,5,4);scene.add(key);
 let model:THREE.Group;
 try{model=(await new GLTFLoader().loadAsync(root.dataset.model!)).scene;}catch(error){env.dispose();renderer.dispose();renderer.domElement.remove();throw error;}
 const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 const ghost=model.clone(true);ghost.traverse(o=>{if(o instanceof THREE.Mesh)o.material=new THREE.MeshBasicMaterial({color:0x91cde5,transparent:true,opacity:.045,depthWrite:false,side:THREE.DoubleSide});});scene.add(ghost);
 model.traverse(o=>{if(o instanceof THREE.Mesh){for(const m of(Array.isArray(o.material)?o.material:[o.material])){m.clippingPlanes=[clip];m.side=THREE.DoubleSide;if(m instanceof THREE.MeshStandardMaterial){m.color.set(0xa5b5c4);m.metalness=.35;m.roughness=.48;}m.needsUpdate=true;}}});scene.add(model);
 const section=new THREE.Group();section.position.copy(center);scene.add(section);
 const sheet=new THREE.Mesh(new THREE.PlaneGeometry(size.x*1.12,size.z*1.12),new THREE.MeshBasicMaterial({color:0x98dff4,transparent:true,opacity:.06,side:THREE.DoubleSide,depthWrite:false}));sheet.rotation.x=-Math.PI/2;section.add(sheet);
 const border=new THREE.LineSegments(new THREE.EdgesGeometry(sheet.geometry),new THREE.LineBasicMaterial({color:0xa8e5f1,transparent:true,opacity:.6}));border.rotation.x=-Math.PI/2;section.add(border);
 let target=0,current=0,index=0,active=true,visible=false,frame=0,disposed=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function fit(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);const radius=size.length()*.5;const angle=Math.min(camera.fov*Math.PI/360,Math.atan(Math.tan(camera.fov*Math.PI/360)*camera.aspect));const distance=radius/Math.sin(angle)*1.03;camera.position.copy(center).add(new THREE.Vector3(.9,.48,1).normalize().multiplyScalar(distance));camera.lookAt(center);for(let i=0;i<3;i++){camera.updateMatrixWorld();let extent=0;for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new THREE.Vector3(x,y,z).project(camera);extent=Math.max(extent,Math.abs(p.x),Math.abs(p.y));}camera.position.sub(center).multiplyScalar(Math.max(.65,Math.min(1.4,extent/.79))).add(center);camera.lookAt(center);}camera.updateMatrixWorld();requestDraw();}
 function draw(){frame=0;if(disposed||!active||!visible||document.hidden)return;current=reduced.matches?target:current+(target-current)*.11;if(Math.abs(target-current)<.0003)current=target;
   const y=box.max.y-current*size.y*.92;clip.constant=y;section.position.y=y;
   const p=sardComponents[index].position;const point=new THREE.Vector3(p[0],y+.012,p[2]).project(camera);marker.style.left=`${(point.x*.5+.5)*host.clientWidth}px`;marker.style.top=`${(-point.y*.5+.5)*host.clientHeight}px`;marker.textContent=`0${index+1}`;marker.hidden=false;
   renderer.render(scene,camera);root.dataset.slicerProgress=current.toFixed(3);if(current!==target)requestDraw();
 }
 function requestDraw(){if(!frame&&!disposed&&active&&visible&&!document.hidden)frame=requestAnimationFrame(draw);}
 const resize=new ResizeObserver(fit);resize.observe(host);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;requestDraw();});observer.observe(host);
 const visibility=()=>requestDraw();document.addEventListener('visibilitychange',visibility);
 status.textContent='Scroll section · component locations schematic';root.dataset.slicerLoaded='true';fit();
 return {setProgress(p:number,i:number){target=p;index=i;requestDraw();},setActive(value:boolean){active=value;if(value)fit();},dispose(){disposed=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility);const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.LineSegments){geometries.add(o.geometry);for(const m of(Array.isArray(o.material)?o.material:[o.material])){materials.add(m);for(const v of Object.values(m))if(v instanceof THREE.Texture)textures.add(v);}}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());env.dispose();renderer.dispose();renderer.domElement.remove();}};
}
