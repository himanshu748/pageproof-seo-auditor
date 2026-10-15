import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Budget} from '../src/budget.js';
import {AuditService} from '../src/service.js';
import {walletAllowed,type Provider} from '../src/provider.js';
import {validateUrl} from '../src/policy.js';
import {SafeError} from '../src/types.js';
import {fixtureReport} from '../src/fixtures.js';
import type {WalletResponse} from '@tiny-fish/sdk';
const wallet:WalletResponse={available_balance:'37',currency:'USD',as_of:'2026-10-12',auto_reload:{state:'off',threshold:'0',recharge_to:'0'},pending_top_up:null,rates:{as_of:'2026-10-12',meters:[{label:'Search',unit_amount:'0',currency:'USD'},{label:'Fetch',unit_amount:'0',currency:'USD'},{label:'Browser',unit_amount:'0.002',currency:'USD',per:'minute'}]}};
const valid=(u:string,o?:string,r=false)=>validateUrl(u,o,r,async()=>[{address:'8.8.8.8',family:4}]);
function provider(){const r=fixtureReport('valid');return {wallet:async()=>wallet,search:async()=>{assert.ok(r.observations.search.ok);return r.observations.search.data;},read:async()=>{assert.ok(r.observations.fetch.ok);return r.observations.fetch.data;},dom:async()=>{throw new SafeError('browser_timeout');}} satisfies Provider;}
const get=async(u:string)=>({status:200,body:u.endsWith('robots.txt')?'User-agent: *\nAllow: /':''});
test('no provider calls before approval and permission',async()=>{const p=provider();p.wallet=async()=>{throw new Error('unexpected call');};const budget=new Budget(':memory:');const s=new AuditService(p,budget,false,'',get,valid);await assert.rejects(()=>s.run({url:'https://example.com/',permitted:true}),/approval/);assert.equal(budget.used(),0);budget.close();});
test('wallet reload/pending balance/unknown rates gates fail closed',()=>{assert.equal(walletAllowed(wallet,37),37);for(const w of [{...wallet,auto_reload:null},{...wallet,auto_reload:{state:'on',threshold:'5',recharge_to:'10'}},{...wallet,pending_top_up:{amount:'5',started_at:'now'}},{...wallet,available_balance:'NaN'},{...wallet,rates:null},{...wallet,available_balance:'36.70'}])assert.throws(()=>walletAllowed(w as WalletResponse,37));});
test('durable budget survives restart and duplicate reservation cannot spend twice',()=>{const path=join(mkdtempSync(join(tmpdir(),'pageproof-test-')),'budget.sqlite');let b=new Budget(path,1);b.reserve('one');assert.throws(()=>b.reserve('one'));b.close();b=new Budget(path,1);assert.equal(b.used(),1);assert.throws(()=>b.reserve('two'),/budget_exhausted/);b.close();});
test('failed and timed-out provider calls consume budget and produce partial reports',async()=>{const b=new Budget(':memory:',1);const s=new AuditService(provider(),b,true,'',get,valid);const r=await s.run({url:'https://example.com/',permitted:true});assert.equal(r.mode,'live');assert.equal(r.findings.find(f=>f.id==='title')?.status,'not tested');assert.equal(r.findings.find(f=>f.id==='readability')?.status,'pass');assert.equal(b.used(),1);await assert.rejects(()=>s.run({url:'https://example.com/',permitted:true}),/budget_exhausted/);b.close();});
test('robots denial never calls Fetch or Browser and still reports Search observations',async()=>{const p=provider();p.read=async()=>{throw new Error('must not fetch');};const b=new Budget(':memory:');const s=new AuditService(p,b,true,'',async u=>({status:200,body:u.endsWith('robots.txt')?'User-agent: *\nDisallow: /':''}),valid);const r=await s.run({url:'https://example.com/',permitted:true});assert.equal(r.observations.fetch.ok,false);assert.equal(r.findings.find(f=>f.id==='robots-txt')?.status,'warning');assert.equal(r.score.value,null);b.close();});
test('Fetch access denial never escalates to Browser',async()=>{const p=provider();p.read=async()=>{throw new SafeError('fetch_blocked');};p.dom=async()=>{throw new Error('unexpected browser call');};const b=new Budget(':memory:');const r=await new AuditService(p,b,true,'',get,valid).run({url:'https://example.com/',permitted:true});assert.equal(r.observations.dom.ok,false);if(!r.observations.dom.ok)assert.equal(r.observations.dom.code,'access_blocked');b.close();});
test('concurrent requests cannot pass the active guard while DNS is pending',async()=>{
 let release:()=>void=()=>{};const wait=new Promise<void>(r=>{release=r;});let first=true;const blockedValidate=async(u:string,o?:string,r=false)=>{if(first){first=false;await wait;}return valid(u,o,r);};
 const b=new Budget(':memory:');const s=new AuditService(provider(),b,true,'',get,blockedValidate);const pending=s.run({url:'https://example.com/',permitted:true});await assert.rejects(()=>s.run({url:'https://example.com/',permitted:true}),/audit_in_progress/);release();await pending;assert.equal(b.used(),1);b.close();
});
