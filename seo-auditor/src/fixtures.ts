import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {analyze} from './analyze.js';
import type {Observations,Report} from './types.js';
export const fixtureNames=['valid','flawed','malformed','blocked','timeout','redirect'] as const;
export function fixtureReport(name:string):Report{
 if(!fixtureNames.includes(name as typeof fixtureNames[number]))throw new Error('unknown_fixture');
 const url='https://example.com/'+name;const html=readFileSync(join(process.cwd(),'tests/fixtures',name==='valid'||name==='redirect'?'valid.html':name==='malformed'?'malformed.html':'flawed.html'),'utf8');
 const blocked=name==='blocked'||name==='timeout';const finalUrl=name==='redirect'?'https://example.com/valid':url;
 const obs:Observations={preflight:{url:finalUrl,chain:name==='redirect'?[{url,status:301,location:finalUrl},{url:finalUrl,status:200}]:[{url,status:blocked?403:200}],robots:{url:'https://example.com/robots.txt',status:200,text:'User-agent: *\nAllow: /',allowed:true}},dom:blocked?{ok:false,code:name==='timeout'?'browser_timeout':'browser_blocked'}:{ok:true,data:{html,finalUrl,status:200,redirects:name==='redirect'?[{url,status:301,location:finalUrl}]:[],xRobotsTag:null,limited:false,blockedRequests:0,settle:'network-idle',cleanup:'confirmed'}},fetch:blocked?{ok:false,code:name==='timeout'?'fetch_timeout':'fetch_blocked'}:{ok:true,data:{finalUrl,text:'A practical guide to accessible garden design. Plan an accessible garden with useful paths and planting ideas for all visitors. This is synthetic fixture extraction text.',characters:163,truncated:false,title:'A practical guide to accessible garden design'}},search:blocked?{ok:false,code:'synthetic_search_unavailable'}:{ok:true,data:{query:'accessible garden design',results:[{url:finalUrl,title:'A practical guide to accessible garden design',snippet:'Synthetic test snippet; TinyFish was not called.'}],returned:1,location:'US',language:'en'}}};
 return analyze(url,'accessible garden design',obs,'fixture');
}
