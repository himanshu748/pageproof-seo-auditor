// Offline client behavior tests. No browser, TinyFish call or live measurement.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {fixtureReport} from '../src/fixtures.js';
class Element {
 textContent='';className='';value='';hidden=false;disabled=false;href='';download='';dataset:Record<string,string>={};
 children:Element[]=[];attributes:Record<string,string>={};listeners:Record<string,Function>={};
 classList={toggle:()=>{},remove:()=>{}};
 animate=()=>({cancel:()=>{}});
 append(...children:Element[]){this.children.push(...children);}
 replaceChildren(...children:Element[]){this.children=children;}
 addEventListener(name:string,handler:Function){this.listeners[name]=handler;}
 setAttribute(name:string,value:string){this.attributes[name]=value;}
 querySelector(){return new Element();}
 focus(){}
}
type Reply={ok:boolean;data?:unknown;invalidJson?:boolean};
const settle=()=>new Promise<void>(resolve=>setImmediate(resolve));
function client(reduce:boolean,replies:Reply[]=[]){
 const elements=new Map<string,Element>();const element=(id:string)=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)!;};
 const animations:{cancelled:boolean}[]=[];const preference={matches:reduce,onChange:()=>{},addEventListener(_name:string,handler:()=>void){this.onChange=handler;}};
 const document={getElementById:element,createElement:()=>new Element(),createTextNode:(text:string)=>{const e=new Element();e.textContent=text;return e;},querySelector:element,querySelectorAll:()=>[],getAnimations:()=>animations.map(a=>({cancel:()=>{a.cancelled=true;}}))};
 const pageElements=['page-title','.evidence-map','.lede','.audit-box'];for(const id of pageElements)element(id).animate=()=>{const a={cancelled:false};animations.push(a);return {cancel:()=>{a.cancelled=true;}};};
 const calls:string[]=[];
 const fetch=async(url:string)=>{calls.push(url);const reply=replies.shift();if(!reply)throw new Error('offline harness exhausted');return {ok:reply.ok,json:async()=>{if(reply.invalidJson)throw new Error('invalid fixture JSON');return reply.data;}};};
 runInNewContext(readFileSync('public/app.js','utf8'),{window:{matchMedia:()=>preference},document,fetch,console});
 return {element,calls,animations,preference};
}
const session={ok:true,data:{token:'synthetic-session',enabled:true,remaining:0,cap:3}};
const noReceipts={ok:true,data:[]};
test('reduced motion keeps content available and disables entrance animation',async()=>{const page=client(true,[session,noReceipts]);await settle();assert.equal(page.animations.length,0);assert.equal(page.element('submit').disabled,true);assert.equal(page.element('submit').textContent,'Live budget exhausted');assert.equal(page.element('availability-note').hidden,false);assert.equal(page.element('open-saved').disabled,true);});
test('switching to reduced motion cancels running entrance animations',async()=>{const page=client(false,[session,noReceipts]);await settle();assert.equal(page.animations.length,4);page.preference.matches=true;page.preference.onChange();assert.ok(page.animations.every(a=>a.cancelled));});
test('a failed receipt request shows an error and preserves previous report contents',async()=>{
 const page=client(true,[session,{ok:true,data:[{id:'missing',url:'https://example.com/',observedAt:'2026-10-12T16:54:10Z'}]},{ok:false,data:{error:'report_not_found'}}]);await settle();page.element('saved').value='missing';page.element('report-url').textContent='Previous report stays visible';page.element('saved').listeners.change();assert.equal(page.element('open-saved').disabled,false);
 await page.element('open-saved').listeners.click();assert.equal(page.element('status').className,'status error');assert.match(page.element('status').textContent,/unavailable/);assert.equal(page.element('report-url').textContent,'Previous report stays visible');assert.equal(page.element('open-saved').disabled,false);assert.ok(page.calls.every(u=>!u.startsWith('/api/audit')));
});
test('saved synthetic response is labeled and never becomes a live measurement',async()=>{
 const report=fixtureReport('blocked');const page=client(true,[session,{ok:true,data:[{id:report.id,url:report.url,observedAt:report.observedAt}]},{ok:true,data:report}]);await settle();page.element('saved').value=report.id;await page.element('open-saved').listeners.click();assert.match(page.element('mode').textContent,/Synthetic fixture/);assert.match(page.element('status').textContent,/Synthetic fixture/);assert.equal(page.element('score-number').textContent,'N/A');assert.equal(page.element('coverage').textContent,'0% measurement coverage');assert.equal(page.element('checks').children.length,13);assert.equal(page.animations.length,0);
});
test('unreadable server responses leave an actionable unavailable state',async()=>{const page=client(true,[{ok:true,invalidJson:true}]);await settle();assert.equal(page.element('submit').disabled,true);assert.match(page.element('availability-note').textContent,/Restart it and reload/);assert.equal(page.element('status').textContent,'');});
