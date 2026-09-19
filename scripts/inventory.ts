import { readdir, stat, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root=process.argv[2];if(!root){console.error('Usage: npm run inventory -- /path/to/project-files');process.exit(1);}
const rows:{path:string;bytes:number;kind:string}[]=[];
async function visit(dir:string){for(const item of await readdir(dir,{withFileTypes:true})){if(item.name.startsWith('.')||item.isSymbolicLink())continue;const p=resolve(dir,item.name);if(item.isDirectory()){if(!['node_modules','dist'].includes(item.name))await visit(p);}else{const ext=extname(p).toLowerCase();if(/\.(pdf|md|txt|docx|png|jpe?g|heic|webp|tiff?|mp4|mov|webm|glb|gltf|step|stp|sldprt|stl|f3d|m|csv|xlsx|pptx)$/.test(ext))rows.push({path:p,bytes:(await stat(p)).size,kind:ext.slice(1)});}}}
await visit(resolve(root));await writeFile('raw/inbox/inventory.json',JSON.stringify(rows,null,2));console.log(`Indexed ${rows.length} files. No source files moved or modified. See raw/inbox/inventory.json.`);
