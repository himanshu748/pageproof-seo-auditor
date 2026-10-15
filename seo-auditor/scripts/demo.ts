import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {settings} from '../src/config.js';
import {Budget} from '../src/budget.js';
import {TinyFishProvider} from '../src/provider.js';
import {AuditService} from '../src/service.js';
import {fixtureNames,fixtureReport} from '../src/fixtures.js';
import {renderReport} from '../src/render.js';
import {errorCode,type Report} from '../src/types.js';
mkdirSync('evidence',{recursive:true});
const save=(name:string,r:Report)=>{writeFileSync(join('evidence',r.mode==='live'?'live-'+r.id+'.json':name+'.json'),JSON.stringify(r,null,2));writeFileSync(join('evidence',r.mode==='live'?'live-'+r.id+'.html':name+'.html'),renderReport(r));console.log(JSON.stringify({artifact:name,mode:r.mode,url:r.url,score:r.score.value,coverage:r.score.coverage,statuses:Object.fromEntries(r.findings.map(f=>[f.id,f.status]))}));};
if(!process.argv.includes('--live')){for(const name of fixtureNames)save('fixture-'+name,fixtureReport(name));console.log('SYNTHETIC FIXTURES ONLY. TinyFish was not called.');}
else{
 if(!settings.key||!settings.approved)throw new Error('Existing key and FREE_CREDITS_APPROVED=true required.');
 const budget=new Budget(settings.budgetPath,settings.cap);const service=new AuditService(new TinyFishProvider(settings.key),budget,true,settings.key);
 // Explicit URL can make exactly one permitted read-only demo run; default demonstrates three public pages.
 const explicit=process.argv.find(a=>a.startsWith('https://'));
 const urls=explicit?[explicit]:['https://example.com/','https://docs.tinyfish.ai/for-coding-agents','https://www.tinyfish.ai/'];
 try{for(let i=0;i<urls.length;i++){console.log(`Starting genuine TinyFish audit ${i+1}/${urls.length}`);try{const r=await service.run({url:urls[i],permitted:true});save('live-'+(explicit?'single':String(i+1)),r);}catch(e){const code=errorCode(e);writeFileSync(join('evidence','live-error-'+(i+1)+'.json'),JSON.stringify({mode:'live',url:urls[i],observedAt:new Date().toISOString(),code},null,2));console.log(JSON.stringify({mode:'live',url:urls[i],error:code}));if(['budget_exhausted','wallet_unsafe','browser_rate_unverified','free_product_rate_unverified','credit_reserve_reached'].includes(code))break;}}}finally{budget.close();}
}
