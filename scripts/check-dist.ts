import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import sharp from 'sharp';
async function walk(dir:string):Promise<string[]>{const result:string[]=[];for(const name of await readdir(dir)){const p=join(dir,name);if((await stat(p)).isDirectory())result.push(...await walk(p));else result.push(p);}return result;}
const files=await walk('dist');let images=0;
for(const file of files){
 if(/\.(png|jpe?g|webp|avif)$/i.test(file)){const meta=await sharp(file).metadata();if(meta.exif||meta.xmp)throw new Error(`Unstripped image metadata: ${file}`);images++;}
 if(file.endsWith('.glb')&&(await stat(file)).size>5_000_000)throw new Error(`Model exceeds 5 MB: ${file}`);
 if(file.endsWith('.pdf')&&/\/(Author|Creator|Metadata)\b/.test((await readFile(file)).toString('latin1')))throw new Error(`PDF metadata requires review: ${file}`);
 if(/\.(step|stp|sldprt|f3d|iges)$/i.test(file))throw new Error(`Native CAD in output: ${file}`);
 if(file.endsWith('.html')){const text=await readFile(file,'utf8');if(!text.toLowerCase().includes('content-security-policy'))throw new Error(`Missing CSP: ${file}`);if(/<script[^>]*src=["']https?:/i.test(text))throw new Error(`Remote script in ${file}`);}
}
const home=await readFile('dist/index.html','utf8');let initial=0;
const visited=new Set<string>();
async function scan(code:string){
 initial+=gzipSync(code).length;
 for(const match of code.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)){
  const name=match[1].split('/').pop()!;const file=files.find(f=>f.endsWith('/'+name)&&f.endsWith('.js'));
  if(file&&!visited.has(file)){visited.add(file);await scan(await readFile(file,'utf8'));}
 }
}
for(const m of home.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
 if(m[1].includes('application/ld+json'))continue;
 const src=m[1].match(/src="([^"]+)"/);if(src){const name=src[1].split('/').pop()!;const file=files.find(f=>f.endsWith('/'+name));if(file&&!visited.has(file)){visited.add(file);await scan(await readFile(file,'utf8'));}}else await scan(m[2]);
}
if(initial>120*1024)throw new Error(`Home JS budget exceeded: ${initial}`);
await import('node:fs/promises').then(fs=>fs.writeFile('dist/build-metrics.json',JSON.stringify({images,homeEntryGzipBytes:initial,htmlPages:files.filter(f=>extname(f)==='.html').length},null,2)));
console.log(`Output checks passed: ${images} processed images, home entry JS ${(initial/1024).toFixed(1)} KiB gzip.`);
