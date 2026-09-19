import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const browserErrors=new WeakMap<Page,string[]>();
test.beforeEach(async({page})=>{const errors:string[]=[];browserErrors.set(page,errors);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});});
test.afterEach(async({page})=>{expect(browserErrors.get(page)).toEqual([]);});
const routes=['/','/resume/','/projects/pn-guidance/','/projects/sard-drone/','/projects/mach5-hypersonic-cfd/','/projects/flying-wing-glider/','/projects/kia-k4-cfd/','/projects/sr-71-geometry/','/projects/interceptor-capstone/','/projects/cal50-projectile-cfd/','/focus/gnc/','/focus/cfd/','/focus/embedded/','/404.html'];
for(const route of routes)test(`route and accessibility: ${route}`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(route);await expect(page.locator('h1')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(result.violations.filter(v=>v.impact==='serious'||v.impact==='critical')).toEqual([]);expect(errors).toEqual([]);
});
test('lens persists through navigation, reload, and browser history',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'CFD',exact:true}).click();await expect(page).toHaveURL(/lens=cfd/);await expect(page.locator('[data-project]:visible')).toHaveCount(5);await page.reload();await expect(page.getByRole('button',{name:'CFD',exact:true})).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'GNC',exact:true}).click();await expect(page.locator('[data-project]:visible')).toHaveCount(3);await page.goBack();await expect(page.getByRole('button',{name:'CFD',exact:true})).toHaveAttribute('aria-pressed','true');await page.goto('/?lens=bogus');await expect(page.locator('[data-project]:visible')).toHaveCount(3);await page.locator('[data-archive] summary').click();await expect(page.locator('[data-project]:visible')).toHaveCount(8);
});
test('airfoil keyboard input changes computed coefficients',async({page})=>{
 await page.goto('/');const before=await page.locator('[data-cl]').innerText();await page.locator('#alpha').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('#alpha-value')).toHaveText('5.5°');expect(await page.locator('[data-cl]').innerText()).not.toBe(before);
});
test('PDF loads selectable text and zooms',async({page})=>{
 await page.goto('/resume/');await page.getByRole('button',{name:'Open interactive PDF'}).click();await expect(page.locator('.pdf-status')).toContainText('Résumé loaded',{timeout:20000});await expect(page.locator('.textLayer')).toContainText('ARYAA VIJAY');await expect(page.locator('.textLayer')).toContainText('3.8');await expect(page.locator('.textLayer')).toContainText('200-trial');await expect(page.locator('.textLayer')).toContainText('May 2027');await page.getByRole('button',{name:'Zoom in',exact:true}).click();await expect(page.locator('[data-zoom-level]')).toHaveText('125%');
});
test('no heavy viewer or third-party resources on home',async({page})=>{
 const requests:string[]=[];page.on('request',r=>requests.push(r.url()));await page.goto('/');await page.waitForLoadState('networkidle');expect(requests.every(r=>r.startsWith('http://127.0.0.1:4321')||r.startsWith('data:'))).toBe(true);expect(requests.some(r=>/pdf\.worker|model-viewer|sard-drone\.glb/.test(r))).toBe(false);
});
test('capture visual review',async({page},info)=>{await page.goto('/');await page.locator('img').evaluateAll(images=>images.forEach(i=>i.setAttribute('loading','eager')));await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(i=>(i as HTMLImageElement).decode().catch(()=>{})));});await page.screenshot({scale:'css',path:`test-results/home-top-${info.project.name}.png`});for(const section of await page.locator('.section-heading,.project-card,.experiment-section,.about-section,.skill-card,.research-note,#contact').all()){if(await section.isVisible())await section.scrollIntoViewIfNeeded();}await page.locator('#contact h2').scrollIntoViewIfNeeded();await expect(page.locator('#contact h2')).toHaveCSS('opacity','1');await page.screenshot({scale:'css',path:`test-results/home-${info.project.name}.png`,fullPage:true});});

test('project image opens, zooms, and closes with Escape',async({page})=>{await page.goto('/projects/kia-k4-cfd/');await page.locator('[data-gallery-index]').click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('slider',{name:'Image zoom',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(page.locator('.lightbox-stage img')).toHaveCSS('width',/px$/);await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();});
test('headline proof points are visible in the landing viewport',async({page})=>{await page.goto('/');const proof=await page.locator('.proof-strip').boundingBox();expect(proof).not.toBeNull();expect(proof!.y+proof!.height).toBeLessThanOrEqual(page.viewportSize()!.height);});

for(const slug of ['kia-k4-cfd','sr-71-geometry','mach5-hypersonic-cfd','cal50-projectile-cfd'])test(`additional 3D model: ${slug}`,async({page},info)=>{
 await page.goto(`/projects/${slug}/`);await page.getByRole('button',{name:/Explore 3D model/}).click();await expect(page.locator('.model-status')).toContainText('triangles',{timeout:25000});
 await page.locator('.model-viewport').evaluate(el=>el.scrollIntoView({block:'center'}));await page.locator('.model-viewport').screenshot({path:`test-results/model-${slug}-${info.project.name}.png`,scale:'css'});
});
test('local demonstrations are playable and deferred',async({page})=>{await page.goto('/projects/sard-drone/');await page.getByRole('tab',{name:'IMU & sensor acquisition',exact:true}).click();for(const video of await page.locator('video').all()){await expect(video).toHaveAttribute('preload','none');await video.evaluate(async(v:HTMLVideoElement)=>{v.muted=true;await v.play();});await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(0);await video.evaluate((v:HTMLVideoElement)=>v.pause());}});

test('case study prioritizes ownership and links directly to the sensor recording',async({page})=>{await page.goto('/projects/sard-drone/');await expect(page.locator('.case-brief')).toContainText('Independent');await page.getByRole('link',{name:'Sensor bench ↓',exact:true}).click();await expect(page.getByRole('tab',{name:'IMU & sensor acquisition',exact:true})).toHaveAttribute('aria-selected','true');await expect(page.locator('#sensor-bench')).toBeInViewport();await expect(page.locator('#sensor-bench video')).toBeVisible();await expect(page.locator('#camera-bench')).toHaveCount(0);await expect(page.locator('img[src*="drone-field"]')).toHaveCount(0);await expect(page.locator('img[src*="drone-concept"],img[src*="drone-ai"]')).toHaveCount(0);});
