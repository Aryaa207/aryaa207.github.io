import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('scroll slicer reveals every component and supports direct keyboard control',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/projects/sard-drone/');await page.getByRole('tab',{name:'Component slicer',exact:true}).scrollIntoViewIfNeeded();
 await expect(page.locator('[data-sard]')).toHaveAttribute('data-slicer-loaded','true',{timeout:20000});
 const names=['Arducam 64 MP','OV2659 camera','NEO-6M GPS','LSM9DS1 IMU','Arduino controller','Raspberry Pi 4B','KK2.1.5 controller','3S LiPo battery'];
 for(const name of names){await page.getByRole('button',{name:`Show ${name}`,exact:true}).click();await expect(page.locator('.component-detail:visible h3')).toHaveText(name);await expect.poll(()=>page.locator('.component-detail:visible img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);}
 await page.getByRole('button',{name:'Show LSM9DS1 IMU',exact:true}).click();await expect.poll(()=>page.locator('[data-sard]').getAttribute('data-slicer-progress')).toMatch(/^0\.4/);
 await page.locator('.sard-sticky').screenshot({path:`test-results/slicer-${info.project.name}.png`,scale:'css'});
 const result=await new AxeBuilder({page}).include('.sard-experience').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(result.violations.filter(v=>v.impact==='serious'||v.impact==='critical')).toEqual([]);
 const slider=page.getByRole('slider',{name:'Section depth',exact:true});await slider.focus();await page.keyboard.press('Home');await expect(page.locator('.component-detail:visible h3')).toHaveText('Arducam 64 MP');
 await page.mouse.wheel(0,1000);await expect.poll(()=>slider.inputValue()).not.toBe('0.0');
 await page.locator('.project-body').scrollIntoViewIfNeeded();await expect(page.locator('.project-body')).toBeInViewport();expect(errors).toEqual([]);
});
test('IMU simulation supports tabs, axis modes, pause, reset, and finite measurements',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/projects/sard-drone/');
 await page.getByRole('tab',{name:'Component slicer',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab',{name:'IMU & sensor acquisition',exact:true})).toHaveAttribute('aria-selected','true');
 await page.getByRole('button',{name:'Start IMU simulation',exact:true}).click();await expect(page.locator('[data-sard]')).toHaveAttribute('data-imu-loaded','true');
 await expect.poll(()=>page.locator('[data-imu-time]').innerText()).not.toBe('0.0 s');
 await page.getByRole('button',{name:'Pause',exact:true}).click();const pausedTime=await page.locator('[data-imu-time]').innerText();await page.getByRole('combobox',{name:'Motion',exact:true}).selectOption('roll');await expect(page.locator('[data-imu-time]')).toHaveText('0.0 s');await expect(page.locator('[data-roll]')).toHaveText('0.0°');
 await page.getByRole('button',{name:'Resume',exact:true}).click();await expect.poll(()=>page.locator('[data-roll]').innerText()).not.toBe('0.0°');await page.getByRole('button',{name:'Pause',exact:true}).click();
 expect(pausedTime).not.toBe('0.0 s');expect(await page.locator('.imu-data').innerText()).not.toMatch(/NaN|Infinity/);
 await page.locator('[data-imu]').screenshot({path:`test-results/imu-${info.project.name}.png`,scale:'css'});
 const result=await new AxeBuilder({page}).include('#imu-panel').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(result.violations.filter(v=>v.impact==='serious'||v.impact==='critical')).toEqual([]);
 await page.getByRole('button',{name:'Reset',exact:true}).click();await expect(page.locator('[data-imu-time]')).toHaveText('0.0 s');await page.getByRole('button',{name:'Step',exact:true}).click();await expect(page.locator('[data-roll]')).not.toHaveText('0.0°');expect(errors).toEqual([]);
});
test('reduced motion keeps content visible and slicer manual',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('#contact .container')).toHaveCSS('opacity','1');await page.goto('/projects/sard-drone/');await expect(page.locator('.sard-sticky')).toHaveCSS('position','relative');await page.getByRole('button',{name:'Show LSM9DS1 IMU',exact:true}).click();await expect(page.locator('.component-detail:visible h3')).toHaveText('LSM9DS1 IMU');await page.getByRole('tab',{name:'IMU & sensor acquisition',exact:true}).click();await page.getByRole('button',{name:'Start IMU simulation',exact:true}).click();await expect(page.getByRole('button',{name:'Resume',exact:true})).toBeEnabled();
});
test('home reveal completes on scroll and keyboard focus',async({page})=>{await page.goto('/');const contact=page.locator('#contact h2');await contact.scrollIntoViewIfNeeded();await expect(contact).toHaveCSS('opacity','1');await page.getByRole('button',{name:'CFD',exact:true}).click();const link=page.locator('[data-project]:visible a').last();await link.focus();await expect(page.locator('[data-project]:visible').last()).toHaveCSS('opacity','1');});
test('home remains readable without JavaScript',async({browser})=>{const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:4321/');await expect(page.locator('#contact .container')).toHaveCSS('opacity','1');await expect(page.locator('h1')).toContainText('Aryaa Vijay');await context.close();});
test('drone page defers 3D code until the slicer approaches the viewport',async({page})=>{const requests:string[]=[];page.on('request',r=>requests.push(r.url()));await page.goto('/projects/sard-drone/');await page.waitForLoadState('networkidle');expect(requests.some(url=>/sard-slicer|three\.module|sard-drone\.glb/.test(url))).toBe(false);await page.getByRole('tab',{name:'Component slicer',exact:true}).scrollIntoViewIfNeeded();await expect(page.locator('[data-sard]')).toHaveAttribute('data-slicer-loaded','true',{timeout:20000});});
