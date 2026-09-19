import sharp from 'sharp';
import { mkdir, readdir, readFile } from 'node:fs/promises';
await mkdir('public/social',{recursive:true});
const labels: Record<string,string>={all:'Aerospace Engineering',gnc:'Guidance, Navigation & Control',cfd:'Computational Fluid Dynamics',embedded:'Embedded Systems'};
for(const slug of await readdir('raw/projects')){try{const content=await readFile(`raw/projects/${slug}/content.md`,'utf8');labels[slug]=JSON.parse(content.match(/^---\n([\s\S]*?)\n---/)![1]).title;}catch{continue;}}
for(const [lens,rawLabel] of Object.entries(labels)){
const label=rawLabel.replaceAll('&','&amp;').replaceAll('<','&lt;');
const svg=`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#080b10"/><circle cx="1060" cy="300" r="290" fill="#112a3b"/><path d="M700 370Q795 240 1135 345Q850 358 700 370" fill="#91cee1"/><text x="80" y="110" font-family="Helvetica,Arial,sans-serif" font-size="22" fill="#a9bdcf">FLORIDA TECH · CLASS OF 2027</text><text x="75" y="300" font-family="Helvetica,Arial,sans-serif" font-weight="bold" font-size="88" fill="#edf5ff">Aryaa Vijay</text><text x="80" y="365" font-family="Helvetica,Arial,sans-serif" font-size="30" fill="#91deef">${label}</text><text x="80" y="550" font-family="Helvetica,Arial,sans-serif" font-size="22" fill="#a9bdcf">Available May 2027 · Full-time &amp; internships</text></svg>`;
await sharp(Buffer.from(svg)).png().toFile(`public/social/${lens}.png`);
}
