import {lookup} from 'node:dns/promises';
import https from 'node:https';
import ipaddr from 'ipaddr.js';
import {SafeError,type HttpReceipt,type Preflight} from './types.js';
export type Address={address:string;family:number};
export type Resolver=(host:string)=>Promise<Address[]>;
export const resolver:Resolver=host=>lookup(host,{all:true,verbatim:true});
export function publicAddress(value:string){try{return ipaddr.process(value).range()==='unicast';}catch{return false;}}
export function parseUrl(value:string,resource=false):URL {
 if(typeof value!=='string'||value.length>2000||/[\s\\\u0000-\u001f]/u.test(value))throw new SafeError('invalid_url');
 let u:URL;try{u=new URL(value);}catch{throw new SafeError('invalid_url');}
 const host=u.hostname.replace(/^\[|\]$/g,'');
 if(u.protocol!=='https:'||u.username||u.password||u.port||u.hash||(!resource&&u.search)||!host.includes('.')||host.endsWith('.')||/(^|\.)(localhost|local|internal|test|invalid|onion|home|lan|example)$/.test(host))throw new SafeError('public_https_required');
 if(ipaddr.isValid(host)&&!publicAddress(host))throw new SafeError('private_address');
 return u;
}
export async function validateUrl(value:string,origin?:string,resource=false,resolve:Resolver=resolver):Promise<{url:URL;addresses:Address[]}>{
 const url=parseUrl(value,resource);if(origin&&url.origin!==origin)throw new SafeError('cross_origin_redirect');
 let addresses:Address[];let timer:ReturnType<typeof setTimeout>|undefined;
 try{addresses=await Promise.race([resolve(url.hostname.replace(/^\[|\]$/g,'')),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new SafeError('dns_timeout')),4000);})]);}catch(e){if(e instanceof SafeError)throw e;throw new SafeError('dns_unavailable');}finally{if(timer)clearTimeout(timer);}
 if(!addresses.length||addresses.some(x=>!publicAddress(x.address)))throw new SafeError('private_address');return {url,addresses};
}
export type Retrieve=(url:string,method:'HEAD'|'GET',origin:string)=>Promise<{status:number;location?:string;body:string}>;
// Pin the validated address in the TLS request. The hostname remains the TLS SNI / cert identity.
export const retrieve:Retrieve=async(input,method,origin)=>{
 const {url,addresses}=await validateUrl(input,origin,true);
 return new Promise((resolve,reject)=>{
 let done=false;const finish=(e?:Error,result?:{status:number;location?:string;body:string})=>{if(done)return;done=true;clearTimeout(deadline);if(e)reject(e);else resolve(result!);};
 const req=https.request(url,{method,headers:{'User-Agent':'PageProof/0.1 (read-only public SEO audit)','Accept':method==='GET'?'text/plain':'*/*'},lookup:((_host:string,options:{all?:boolean},cb:Function)=>options.all?cb(null,[addresses[0]]):cb(null,addresses[0].address,addresses[0].family)) as any},res=>{
  let body='';res.setEncoding('utf8');res.on('data',(chunk:string)=>{body+=chunk;if(body.length>128000){req.destroy();finish(new SafeError('response_too_large'));}});res.on('end',()=>finish(undefined,{status:res.statusCode??0,location:res.headers.location,body}));res.on('error',()=>finish(new SafeError('http_unavailable')));
 });
 const deadline=setTimeout(()=>{req.destroy();finish(new SafeError('http_timeout'));},8000);req.on('error',()=>finish(new SafeError('http_unavailable')));req.end();
 });
};
export function robotsAllows(text:string,path:string):boolean|null{
 const groups:{agents:string[];rules:{allow:boolean;value:string}[]}[]=[];let group:typeof groups[number]|undefined;
 for(const raw of text.split(/\r?\n/)){
  const line=raw.replace(/#.*/,'').trim();if(!line)continue;const match=/^([^:]+):\s*(.*)$/.exec(line);if(!match)return null;
  const name=match[1].toLowerCase().trim(),value=match[2].trim();
  if(name==='user-agent'){if(!group||group.rules.length){group={agents:[],rules:[]};groups.push(group);}group.agents.push(value.toLowerCase());}
  else if(name==='allow'||name==='disallow'){if(!group)return null;group.rules.push({allow:name==='allow',value});}
 }
 if(!groups.length)return text.trim()===''?true:null;
 const specific=groups.filter(g=>g.agents.some(a=>a!=='*'&&(/tinyfish|pageproof/i.test(a))));
 const candidates=specific.length?specific:groups.filter(g=>g.agents.includes('*'));
 let length=-1,allowed=true;
 for(const g of candidates)for(const rule of g.rules){if(!rule.value)continue;const pattern=rule.value.replace(/[.+?^{}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*');let re:RegExp;try{re=new RegExp('^'+pattern);}catch{return null;}if(re.test(path)){const n=rule.value.replace(/[\*$]/g,'').length;if(n>length||(n===length&&rule.allow)){length=n;allowed=rule.allow;}}}
 return allowed;
}
export async function preflight(input:string,get:Retrieve=retrieve,validate=validateUrl):Promise<Preflight>{
 const checked=await validate(input);const origin=checked.url.origin;let current=checked.url.href;const chain:HttpReceipt[]=[];
 for(let i=0;i<5;i++){
  await validate(current,origin);const r=await get(current,'HEAD',origin);chain.push({url:current,status:r.status,...(r.location?{location:new URL(r.location,current).href}:{})});
  if([301,302,303,307,308].includes(r.status)&&r.location){current=new URL(r.location,current).href;await validate(current,origin);if(i===4)throw new SafeError('redirect_limit');continue;}break;
 }
 let robots:Preflight['robots']={url:origin+'/robots.txt',status:null,text:null,allowed:null};
 try{let target=robots.url;for(let i=0;i<3;i++){
  const r=await get(target,'GET',origin);if([301,302,303,307,308].includes(r.status)&&r.location){target=new URL(r.location,target).href;await validate(target,origin,true);if(i===2)throw new SafeError('robots_redirect_limit');continue;}
  robots={url:target,status:r.status,text:r.status===200?r.body:null,allowed:r.status===200?robotsAllows(r.body,new URL(current).pathname):[404,410].includes(r.status)?true:false};break;
 }}catch{robots.code='robots_unavailable';}
 return {url:current,chain,robots};
}
