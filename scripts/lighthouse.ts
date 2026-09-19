import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const allRoutes=['/','/resume/','/projects/pn-guidance/','/projects/sard-drone/','/projects/mach5-hypersonic-cfd/','/projects/flying-wing-glider/','/projects/kia-k4-cfd/','/projects/sr-71-geometry/','/projects/interceptor-capstone/','/projects/cal50-projectile-cfd/','/focus/gnc/','/focus/cfd/','/focus/embedded/'];
const routes=process.argv.slice(2).length?process.argv.slice(2):allRoutes;
await mkdir('.lighthouseci',{recursive:true});
const chrome=await launch({chromePath:process.env.CI?undefined:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
const results:{route:string;[key:string]:unknown}[]=[];try{for(const row of JSON.parse(await readFile('.lighthouseci/summary.json','utf8')))if(!routes.includes(row.route))results.push(row);}catch{ /* First run has no stored report. */ }let failed=false;
try {for(const route of routes){
 const result=await lighthouse(`http://127.0.0.1:4321${route}`,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
 if(!result)throw new Error('No Lighthouse result');const lhr=result.lhr;
 const row={route,scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round((v.score??0)*100)])),lcpMs:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue};
 results.push(row);console.log(JSON.stringify(row));await writeFile(`.lighthouseci/${route.replaceAll('/','_')||'home'}.json`,JSON.stringify(lhr));
 const min=route==='/'?95:85;if(row.scores.performance<min||row.scores.accessibility<95||row.scores['best-practices']<95||row.scores.seo<95||(route==='/'&&((row.lcpMs??Infinity)>2000||(row.cls??Infinity)>.05)))failed=true;
 }}finally{await chrome.kill();await writeFile('.lighthouseci/summary.json',JSON.stringify(results,null,2));}
if(failed)process.exitCode=1;
