import { readdir,readFile,stat } from 'node:fs/promises';
import { join,resolve } from 'node:path';
const output=process.env.CHECK_DIST||'dist';
const base=(process.env.BASE_PATH||'/').replace(/\/$/,'');
async function walk(dir:string):Promise<string[]>{const paths:string[]=[];for(const item of await readdir(dir)){const p=join(dir,item);if((await stat(p)).isDirectory())paths.push(...await walk(p));else paths.push(p);}return paths;}
const files=await walk(output);let count=0;
for(const f of files.filter(f=>f.endsWith('.html'))){const html=await readFile(f,'utf8');for(const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){const target=m[1].replace(/&amp;/g,'&').split('?')[0];if(!target.startsWith('/')||target.startsWith('//'))continue;const relative=target.startsWith(base+'/')?target.slice(base.length):target;const candidate=resolve(output,'.'+relative);if(!candidate.startsWith(resolve(output)+'/')&&candidate!==resolve(output))throw new Error('Unsafe path');try{const info=await stat(candidate);if(info.isDirectory())await stat(join(candidate,'index.html'));count++;}catch{throw new Error(`Broken internal link in ${f}: ${target}`);}}}
console.log(`Verified ${count} internal links and asset references.`);
