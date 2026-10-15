import {test} from 'node:test';
import {request} from 'node:http';
import assert from 'node:assert/strict';
import {makeServer} from '../src/server.js';
import {Budget} from '../src/budget.js';
import {fixtureReport} from '../src/fixtures.js';
import {SafeError} from '../src/types.js';
const port=19330;
test('local API enforces Host Origin token and supports genuine partial errors and safe downloads',async()=>{
 let calls=0;const budget=new Budget(':memory:');const {server}=makeServer({port,budget,enabled:true,service:{run:async()=>{calls++;throw new SafeError('http_timeout');}}});await new Promise<void>(r=>server.listen(port,'127.0.0.1',r));
 try{const base='http://127.0.0.1:'+port;const session=await fetch(base+'/api/session').then(r=>r.json()) as {token:string};const post=(path:string,body:unknown,headers:Record<string,string>={})=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json','X-Audit-Token':session.token,...headers},body:JSON.stringify(body)});
 assert.equal((await post('/api/audit',{}, {'X-Audit-Token':'wrong'})).status,400);assert.equal(calls,0);
 assert.equal((await post('/api/audit',{}, {Origin:'https://evil.example'})).status,400);assert.equal(calls,0);
 const forgedHost=await new Promise<number>((resolve,reject)=>{const req=request(base+'/api/session',{headers:{Host:'evil.example'}},res=>{res.resume();resolve(res.statusCode!);});req.on('error',reject);req.end();});assert.equal(forgedHost,400);
 const fail=await post('/api/audit',{});assert.equal(fail.status,400);assert.match((await fail.json() as {message:string}).message,/timed out/);
 const r=await post('/api/fixture',{name:'flawed'}).then(r=>r.json()) as ReturnType<typeof fixtureReport>;assert.equal(r.mode,'fixture');
 const html=await fetch(`${base}/api/reports/${r.id}.html`);assert.match(html.headers.get('content-disposition')??'',/attachment/);assert.match(await html.text(),/SYNTHETIC FIXTURE/);
 const json=await fetch(`${base}/api/reports/${r.id}.json`).then(r=>r.json()) as typeof r;assert.equal(json.id,r.id);
 for(const name of ['public-sans','space-grotesk']){const font=await fetch(base+'/assets/'+name+'.woff2');assert.equal(font.status,200);assert.equal(font.headers.get('content-type'),'font/woff2');assert.equal(Buffer.from(await font.arrayBuffer()).subarray(0,4).toString(),'wOF2');}
 assert.equal((await fetch(base+'/.env')).status,404);assert.equal((await fetch(base+'/src/provider.ts')).status,404);
 }finally{await new Promise<void>(r=>server.close(()=>r()));budget.close();}
});
