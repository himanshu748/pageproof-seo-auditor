import {randomUUID} from 'node:crypto';
import {analyze} from './analyze.js';
import {preflight,type Retrieve,validateUrl} from './policy.js';
import {Budget} from './budget.js';
import {walletAllowed,type Provider} from './provider.js';
import {SafeError,errorCode,type Input,type Observations,type Outcome,type Report} from './types.js';
export async function attempt<T>(call:()=>Promise<T>):Promise<Outcome<T>>{try{return {ok:true,data:await call()};}catch(e){return {ok:false,code:errorCode(e)};}}
export function validateInput(raw:unknown):Input{
 if(!raw||typeof raw!=='object')throw new SafeError('invalid_input');const i=raw as Record<string,unknown>;
 if(i.permitted!==true)throw new SafeError('permission_required');if(typeof i.url!=='string'||(i.query!==undefined&&(typeof i.query!=='string'||i.query.length>180||/[\u0000-\u001f]/u.test(i.query))))throw new SafeError('invalid_input');
 return {url:i.url,query:typeof i.query==='string'?i.query.trim():undefined,permitted:true};
}
export function redactReport(report:Report,secrets:string[]=[]):Report{
 let serialized=JSON.stringify(report);for(const secret of secrets.filter(x=>x.length>6))serialized=serialized.split(secret).join('[REDACTED]');
 serialized=serialized.replace(/(?:tf[_-]|sk[_-])[A-Za-z0-9_-]{16,}/g,'[REDACTED]').replace(/((?:api[_-]?key|token|secret|password|authorization)(?:=|%3D))[^\s&"<>\\]+/gi,'$1[REDACTED]');
 return JSON.parse(serialized) as Report;
}
export class AuditService{
 private active=false;
 constructor(private provider:Provider,private budget:Budget,private approved:boolean,private key='',private get:Retrieve|undefined=undefined,private validate=validateUrl){}
 async run(raw:unknown):Promise<Report>{
  const input=validateInput(raw);if(!this.approved)throw new SafeError('free_credit_approval_required');if(this.active)throw new SafeError('audit_in_progress');
  this.active=true;
  try{
   const {url}=await this.validate(input.url);const id=randomUUID();this.budget.reserve(id);
   const wallet=await this.provider.wallet();const balance=Number(wallet.available_balance);if(!Number.isFinite(balance))throw new SafeError('wallet_unsafe');walletAllowed(wallet,this.budget.baseline(balance));
   const p=await preflight(url.href,this.get,this.validate);const query=input.query||p.url;
   const search=await attempt(()=>this.provider.search(query));
   const denied=p.robots.allowed!==true||[401,403,429].includes(p.chain.at(-1)?.status??0);
   const blocked:Outcome<never>={ok:false,code:p.robots.allowed===false?'robots_restricted':p.robots.allowed===null?'robots_policy_unverified':'access_blocked'};
   const read=denied?blocked:await attempt(()=>this.provider.read(p.url));
   // No bot-protection bypass or fallback. A denied Fetch does not escalate to Browser.
   const dom=denied?blocked:!read.ok&&read.code==='fetch_blocked'?{ok:false as const,code:'access_blocked'}:await attempt(()=>this.provider.dom(p.url));
   const obs:Observations={preflight:p,search,fetch:read,dom};
   return redactReport(analyze(url.href,query,obs,'live',id),[this.key]);
  }finally{this.active=false;}
 }
}
