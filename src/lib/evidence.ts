import type { ImageMetadata } from 'astro';
import { statSync } from 'node:fs';
const images=import.meta.glob<{default:ImageMetadata}>('../assets/evidence/*.{jpg,png}',{eager:true});
export const asset=(name:string):ImageMetadata=>{const entry=images[`../assets/evidence/${name}.jpg`]??images[`../assets/evidence/${name}.png`];if(!entry)throw new Error(`Missing evidence image: ${name}`);return entry.default;};
const item=(name:string,caption:string,alt=caption)=>({src:asset(name),alt,caption});
export const projectMedia:Record<string,{src:ImageMetadata;alt:string;caption:string}[]>={
 'sard-drone':[
 item('sard-poster','Original S.A.R.D. project poster. Range, endurance, and weight figures retain the poster’s stated scope.'),
 item('vision-bench','The physical camera, mount, and detection display on the laboratory bench.'),
 item('expo-demo','Presenting the S.A.R.D. airframe and camera demonstration at Florida Tech.'),
 item('drone-sunset','The actual quadcopter, held outdoors. This photograph documents the hardware, not a flight test.'),
 ],
 'pn-guidance':[item('guidance-trajectories','Single-run trajectory plot from the supplied presentation. Original axes and units retained.'),item('guidance-acceleration','Commanded acceleration history from the same presentation, plotted in g versus seconds.'),item('guidance-statistics','Original 200-trial results table. These are simulation outputs, not flight-test results.')],
 'mach5-hypersonic-cfd':[item('hypersonic-mach','Original Fluent Mach-number contour export. Convergence is not established by the image.'),item('hypersonic-pressure','Original Fluent pressure-field export, with its source legend.'),item('hypersonic-flow','Additional flow-field visualization from the source archive.'),item('hypersonic-monitor','Workstation photograph of the early drag-monitor history. This is not a final converged result.')],
 'cal50-projectile-cfd':[item('projectile-residuals','Original report page: residual status at 950 iterations, with several equations still not converged.'),item('projectile-monitors','Original report page: drag and area-weighted total-temperature monitors.'),item('projectile-mach','Mach-number contour at the saved solution state.'),item('projectile-pressure','Original pressure-field export; enlarge to inspect the source scale.'),item('projectile-temperature','Static-temperature field. This is distinct from the report’s area-weighted total-temperature value.'),item('projectile-velocity','Velocity-magnitude contour from the Fluent study.'),item('projectile-pathlines','Original pathline visualization with color legend.'),item('projectile-mesh','Mesh/workstation view retained from the original archive.')],
};
export const covers:Record<string,{src:ImageMetadata;alt:string}>= {
 'sr-71-geometry':{src:asset('sr71-model'),alt:'Rendered preview of the supplied SR-71 surface model'},
 'kia-k4-cfd':{src:asset('kia-model'),alt:'Rendered preview of the supplied Kia K4 geometry'},
 'sard-drone':{src:asset('drone-sunset'),alt:'S.A.R.D. quadcopter held against the evening sky'},
 'pn-guidance':{src:asset('guidance-trajectories'),alt:'Original MATLAB trajectory comparison'},
 'mach5-hypersonic-cfd':{src:asset('hypersonic-pressure'),alt:'Original Fluent pressure-field visualization'},
 'cal50-projectile-cfd':{src:asset('projectile-mach'),alt:'Original Mach-number contour'},
};
export const models:Record<string,{src:string;label:string;size:string}>={
 'sard-drone':{src:'sard-drone',label:'S.A.R.D.',size:'0.80'},
 'kia-k4-cfd':{src:'kia-k4',label:'Kia K4',size:'3.18'},
 'sr-71-geometry':{src:'sr-71',label:'SR-71',size:'2.59'},
 'mach5-hypersonic-cfd':{src:'hypersonic',label:'Hypersonic geometry',size:'2.58'},
 'cal50-projectile-cfd':{src:'projectile',label:'Projectile geometry',size:'0.15'},
};

for(const model of Object.values(models))model.size=(statSync(`public/models/${model.src}.glb`).size/1_000_000).toFixed(2);
