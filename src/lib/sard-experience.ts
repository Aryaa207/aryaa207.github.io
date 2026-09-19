import { sardComponents } from './sard-components';
export function initSard(root: HTMLElement) {
  const track=root.querySelector<HTMLElement>('.sard-track')!, sticky=root.querySelector<HTMLElement>('.sard-sticky')!;
  const slider=root.querySelector<HTMLInputElement>('#slicer-depth')!, cards=[...root.querySelectorAll<HTMLElement>('[data-component]')];
  const steps=[...root.querySelectorAll<HTMLButtonElement>('[data-component-step]')], tabs=[...root.querySelectorAll<HTMLButtonElement>('[data-mode-button]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let progress=0, loading=false, scheduled=0;
  let slicer:Awaited<ReturnType<typeof import('./sard-slicer').mountSlicer>>|undefined;
  let imu:Awaited<ReturnType<typeof import('./imu-demo').mountImu>>|undefined;
  root.dataset.ready='true';
  function update(value:number) {
    progress=Math.max(0,Math.min(1,value));const index=Math.min(7,Math.floor(progress*8));
    slider.value=(progress*100).toFixed(1);slider.setAttribute('aria-valuetext',`${Math.round(progress*100)} percent — ${sardComponents[index].name}`);
    root.querySelector('[data-depth]')!.textContent=`${String(Math.round(progress*100)).padStart(2,'0')}%`;
    cards.forEach((card,i)=>card.hidden=i!==index);steps.forEach((step,i)=>step.setAttribute('aria-pressed',String(i===index)));
    slicer?.setProgress(progress,index);
  }
  function scrollProgress(){scheduled=0;if(root.dataset.mode!=='slicer'||reduced.matches||getComputedStyle(sticky).position!=='sticky')return;const rect=track.getBoundingClientRect();const distance=track.offsetHeight-sticky.offsetHeight;update((parseFloat(getComputedStyle(sticky).top)-rect.top)/Math.max(1,distance));}
  const onScroll=()=>{if(!scheduled)scheduled=requestAnimationFrame(scrollProgress);};
  window.addEventListener('scroll',onScroll,{passive:true});
  function select(value:number){update(value);if(!reduced.matches&&getComputedStyle(sticky).position==='sticky'){const top=track.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(sticky).top);window.scrollTo({top:top+value*(track.offsetHeight-sticky.offsetHeight),behavior:'instant'});}}
  slider.addEventListener('input',()=>select(Number(slider.value)/100));steps.forEach((b,i)=>b.addEventListener('click',()=>select((i+.4)/8)));
  async function loadSlicer(){if(loading||slicer)return;loading=true;root.querySelectorAll<HTMLImageElement>('.component-photo img').forEach(img=>img.loading='eager');try{slicer=await(await import('./sard-slicer')).mountSlicer(root);slicer.setProgress(progress,Math.min(7,Math.floor(progress*8)));slicer.setActive(root.dataset.mode==='slicer');}catch{root.querySelector('[data-slicer-status]')!.textContent='3D preview unavailable. Use the slider to inspect component photographs.';}finally{loading=false;}}
  const nearby=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){void loadSlicer();nearby.disconnect();}},{rootMargin:'100px'});nearby.observe(root.querySelector('.slicer-viewport')!);
  function setMode(mode:string){
    const before=track.getBoundingClientRect().top;
    root.dataset.mode=mode;
    tabs.forEach(t=>{const active=t.dataset.modeButton===mode;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;root.querySelector<HTMLElement>(`#${t.getAttribute('aria-controls')}`)!.hidden=!active;});
    slicer?.setActive(mode==='slicer');imu?.setActive(mode==='imu');
    root.querySelectorAll<HTMLVideoElement>('video').forEach(v=>v.pause());
    if(before<80)window.scrollTo({top:scrollY+track.getBoundingClientRect().top-100,behavior:'instant'});
    if(mode==='slicer'){scrollProgress();void loadSlicer();}
  }
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>setMode(tab.dataset.modeButton!));tab.addEventListener('keydown',e=>{let index:number;if(e.key==='ArrowRight')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();tabs[index].focus();setMode(tabs[index].dataset.modeButton!);});});
  const start=root.querySelector<HTMLButtonElement>('[data-imu-start]')!;
  start.addEventListener('click',async()=>{start.disabled=true;start.textContent='Loading simulation…';try{imu=await(await import('./imu-demo')).mountImu(root);imu.setActive(root.dataset.mode==='imu');}catch{start.disabled=false;start.textContent='Retry simulation';root.querySelector('[data-imu-status]')!.textContent='Unable to load simulation. The original hardware recording is available below.';}});
  reduced.addEventListener('change',()=>{if(!reduced.matches)scrollProgress();});
  window.addEventListener('pagehide',()=>{nearby.disconnect();window.removeEventListener('hashchange',followHash);window.removeEventListener('scroll',onScroll);cancelAnimationFrame(scheduled);slicer?.dispose();imu?.dispose();},{once:true});
  function followHash(){if(location.hash==='#imu-panel'||location.hash==='#sensor-bench'){setMode('imu');requestAnimationFrame(()=>root.querySelector(location.hash)?.scrollIntoView({block:'start'}));}}
  window.addEventListener('hashchange',followHash);
  update(0);scrollProgress();followHash();
}
