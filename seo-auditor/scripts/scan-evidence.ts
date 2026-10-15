import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {settings} from '../src/config.js';
function paths(dir:string):string[]{return readdirSync(dir,{withFileTypes:true}).flatMap(e=>['node_modules','dist','.data','.git'].includes(e.name)?[]:e.isDirectory()?paths(join(dir,e.name)):[join(dir,e.name)]);}
const hits:string[]=[];
for(const path of paths('.')){const data=readFileSync(path);if(settings.key&&data.includes(Buffer.from(settings.key)))hits.push(path);}
const report={checkedAt:new Date().toISOString(),keyPresent:!!settings.key,knownKeyOccurrences:hits.length,matchingPaths:hits,envExampleBytes:readFileSync('.env.example').length,scope:'seo-auditor tracked source/docs/evidence, excluding dependencies/build/budget database; no secret values printed'};
writeFileSync('evidence/secret-check.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(hits.length)process.exitCode=1;
