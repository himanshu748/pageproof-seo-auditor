// SYNTHETIC TRANSPORT CONTRACTS — these tests never contact TinyFish.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TinyFishProvider} from '../src/provider.js';
import {attempt} from '../src/service.js';
test('official Fetch uses documented route, live markdown, bounded timeout and no retries',async()=>{
 const original=globalThis.fetch;const calls:{url:string;body:Record<string,unknown>}[]=[];
 globalThis.fetch=async(input,init)=>{calls.push({url:String(input),body:JSON.parse(String(init?.body)) as Record<string,unknown>});return new Response(JSON.stringify({results:[{url:'https://example.com/',final_url:'https://example.com/',title:'Fixture',description:null,language:'en',author:null,published_date:null,format:'markdown',text:'Synthetic provider text'}],errors:[]}),{status:200,headers:{'Content-Type':'application/json'}});};
 try{const p=new TinyFishProvider('synthetic-key-not-real');const r=await p.read('https://example.com/');assert.equal(r.text,'Synthetic provider text');assert.equal(calls.length,1);assert.equal(calls[0].url,'https://api.fetch.tinyfish.ai/');assert.deepEqual(calls[0].body.urls,['https://example.com/']);assert.equal(calls[0].body.ttl,0);assert.equal(calls[0].body.format,'markdown');assert.equal(calls[0].body.per_url_timeout_ms,20000);}finally{globalThis.fetch=original;}
});
test('provider denial, timeout and rate limiting are not retried or reported as page absence',async()=>{
 const original=globalThis.fetch;try{for(const [status,payload,expected] of [[200,{results:[],errors:[{url:'https://example.com/',error:'timeout'}]},'fetch_timeout'],[200,{results:[],errors:[{url:'https://example.com/',error:'blocked'}]},'fetch_blocked'],[429,{error:{code:'RATE_LIMIT_EXCEEDED',message:'Synthetic limit'}},'provider_unavailable']] as const){let count=0;globalThis.fetch=async()=>{count++;return new Response(JSON.stringify(payload),{status,headers:{'Content-Type':'application/json'}});};const r=await attempt(()=>new TinyFishProvider('synthetic-key').read('https://example.com/'));assert.equal(count,1);assert.equal(r.ok,false);if(!r.ok)assert.equal(r.code,expected);}}finally{globalThis.fetch=original;}
});
