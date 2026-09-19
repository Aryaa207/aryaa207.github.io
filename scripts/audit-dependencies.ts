import { spawnSync } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

// A reported high/critical vulnerability blocks deployment. An npm advisory
// service outage is reported separately and must never be called a clean audit.
for(let attempt=1;attempt<=3;attempt++){
  const result=spawnSync('npm',['audit','--json'],{encoding:'utf8',timeout:60000,maxBuffer:10*1024*1024});
  let report:{metadata?:{vulnerabilities?:{high:number;critical:number}},statusCode?:number};
  try{report=JSON.parse(result.stdout);}catch{console.error('Could not read npm audit response.');process.exit(1);}
  const counts=report.metadata?.vulnerabilities;
  if(counts){
    console.log(`Dependency audit: ${counts.high} high, ${counts.critical} critical.`);
    if(counts.high+counts.critical>0){console.error('Resolve reported high/critical vulnerabilities before deployment.');process.exit(1);}
    process.exit(0);
  }
  if(report.statusCode!==503){console.error('Dependency audit failed without a usable report.');process.exit(1);}
  if(attempt<3){await setTimeout(5000);continue;}
  console.warn('::warning::npm advisory service unavailable (HTTP 503) after three attempts. Dependency vulnerability status was not verified in this run.');
}
