import { readdir, readFile, writeFile, mkdir, copyFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
const root='raw/projects', output='src/content/projects';
await mkdir(output,{recursive:true});
const missing: string[] = [];
const globalGaps = JSON.parse(await readFile('raw/content-gaps.json','utf8'));
for(const gap of globalGaps) missing.push(`- ${gap.file}: ${gap.field}`);
for(const slug of (await readdir(root)).sort()) {
  const source=join(root,slug,'content.md');
  let text: string; try { text=await readFile(source,'utf8'); } catch { continue; }
  const match=text.match(/^---\n([\s\S]*?)\n---/); if(!match) throw new Error(`Missing metadata: ${source}`);
  const data=JSON.parse(match[1]);
  await writeFile(join(output,slug+'.mdx'),text);
  for(const item of data.missing??[]) missing.push(`- ${source}: ${item}`);
}
await mkdir('public/models',{recursive:true});
const model='raw/projects/sard-drone/model/drone.glb';
try { await stat(model); await copyFile(model,'public/models/sard-drone.glb'); } catch(e) { if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e; }
if((await stat('public/models/sard-drone.glb')).size>5_000_000)throw new Error('Model exceeds 5 MB');
await mkdir('public/documents',{recursive:true});
// Published PDF is a metadata-clean derivative, prepared separately from the original.
await writeFile('MISSING_CONTENT.md','# Future content improvements\n\nOriginal files remain untouched. Published case studies state the scope of the available evidence. These follow-up items do not prevent publication of the reviewed version.\n\n'+missing.join('\n')+'\n');
console.log(`Ingested project content; ${missing.length} unresolved content items.`);
