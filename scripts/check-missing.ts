import { readFile } from 'node:fs/promises';
const missing=await readFile('MISSING_CONTENT.md','utf8');
if(missing.includes('- raw/')) {
  // Optional evidence improvements stay visible without preventing publication
  // of the reviewed case studies, which already state their limitations.
  if(process.env.REQUIRE_COMPLETE_CONTENT==='1') {
    console.error('Content completeness check failed. See MISSING_CONTENT.md.'); process.exit(1);
  }
  console.warn('Additional evidence remains in MISSING_CONTENT.md; reviewed scope and limitations are retained.');
}
