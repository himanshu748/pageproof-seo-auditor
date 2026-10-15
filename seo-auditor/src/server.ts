import {createServer,type IncomingMessage,type ServerResponse} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomBytes} from 'node:crypto';
import {settings} from './config.js';
import {Budget} from './budget.js';
import {AuditService} from './service.js';
import {TinyFishProvider} from './provider.js';
import {fixtureReport} from './fixtures.js';
import {errorCode,SafeError,type Report} from './types.js';
import {renderReport} from './render.js';
const messages:Record<string,string>={free_credit_approval_required:'Live audits need FREE_CREDITS_APPROVED=true and an existing server-side API key.',budget_exhausted:'The persistent live audit budget is exhausted. Saved reports and fixtures remain available.',permission_required:'Confirm that you have permission to audit this public page.',public_https_required:'Use a public HTTPS URL without credentials, query strings, fragments or custom ports.',private_address:'Private, reserved and local addresses are blocked.',cross_origin_redirect:'Cross-origin redirects are blocked. Enter the permitted final public URL directly.',wallet_unsafe:'Wallet auto-reload, top-up or state could not be verified as safe.',free_product_rate_unverified:'Free Search/Fetch rates could not be verified. No content calls were made.',browser_rate_unverified:'The approved Browser rate could not be verified. No content calls were made.',credit_reserve_reached:'The free-credit reserve was reached. No top-up or purchase will be attempted.',audit_in_progress:'Another audit is running. Wait for it to finish.',http_timeout:'The public-page preflight timed out. No audit findings were invented.',invalid_input:'Check the URL and query (180 characters maximum).',dns_unavailable:'Public DNS could not be resolved.',provider_unavailable:'TinyFish or public-page access failed. Raw provider errors are redacted.'};
export function makeServer(options:{service?:Pick<AuditService,'run'>;budget?:Budget;port?:number;enabled?:boolean}={}){
 const budget=options.budget??new Budget(settings.budgetPath,settings.cap);const port=options.port??settings.port;const token=randomBytes(24).toString('hex');
 const enabled=options.enabled??(!!settings.key&&settings.approved);const service=options.service??new AuditService(new TinyFishProvider(settings.key||'disabled'),budget,enabled,settings.key);
 const reports=new Map<string,Report>();
 const receiptDir=join(process.cwd(),'evidence');mkdirSync(receiptDir,{recursive:true});
 for(const name of readdirSync(receiptDir).filter(n=>/^live-[a-f0-9-]{36}\.json$/.test(n)).slice(-50)){try{const r=JSON.parse(readFileSync(join(receiptDir,name),'utf8')) as Report;if(r.mode==='live'&&r.version===1)reports.set(r.id,r);}catch{/* Damaged receipts are not presented as audits. */}}
 const server=createServer(async(req:IncomingMessage,res:ServerResponse)=>{
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Cache-Control','no-store');
  const send=(status:number,payload:unknown)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(payload));};
  try{
   if(req.headers.host!==`127.0.0.1:${port}`&&req.headers.host!==`localhost:${port}`)throw new SafeError('host_rejected');
   if(req.headers.origin&&!['http://127.0.0.1:'+port,'http://localhost:'+port].includes(req.headers.origin))throw new SafeError('origin_rejected');
   const path=new URL(req.url??'/','http://127.0.0.1').pathname;
   if(req.method==='GET'&&path==='/api/session'){send(200,{token,enabled,remaining:Math.max(0,settings.cap-budget.used()),cap:settings.cap});return;}
   if(req.method==='GET'&&path==='/api/receipts'){send(200,[...reports.values()].filter(r=>r.mode==='live').map(r=>({id:r.id,url:r.url,observedAt:r.observedAt})));return;}
   if(req.method==='POST'&&(path==='/api/audit'||path==='/api/fixture')){
    if(req.headers['x-audit-token']!==token)throw new SafeError('session_rejected');if(!req.headers['content-type']?.startsWith('application/json'))throw new SafeError('json_required');
    let body='';for await(const chunk of req){body+=chunk;if(body.length>4096)throw new SafeError('request_too_large');}let parsed:unknown;try{parsed=JSON.parse(body);}catch{throw new SafeError('invalid_input');}
    const report=path==='/api/audit'?await service.run(parsed):fixtureReport((parsed as {name:string})?.name);reports.set(report.id,report);if(report.mode==='live')writeFileSync(join(receiptDir,`live-${report.id}.json`),JSON.stringify(report,null,2),{mode:0o600});if(reports.size>50)reports.delete(reports.keys().next().value!);send(200,report);return;
   }
   const match=/^\/api\/reports\/([a-f0-9-]+)\.(json|html)$/.exec(path);
   if(req.method==='GET'&&match){const r=reports.get(match[1]);if(!r){send(404,{error:'report_not_found'});return;}res.setHeader('Content-Disposition',`attachment; filename="pageproof-${r.mode}-${r.id}.${match[2]}"`);res.setHeader('Content-Type',match[2]==='html'?'text/html; charset=utf-8':'application/json; charset=utf-8');res.end(match[2]==='html'?renderReport(r):JSON.stringify(r,null,2));return;}
   const files:Record<string,[string,string]>={'/':['index.html','text/html'],'/app.js':['app.js','text/javascript'],'/style.css':['style.css','text/css'],'/assets/public-sans.woff2':['assets/public-sans.woff2','font/woff2'],'/assets/space-grotesk.woff2':['assets/space-grotesk.woff2','font/woff2']};
   if(req.method==='GET'&&files[path]){res.setHeader('Content-Type',files[path][1]+(files[path][1]==='font/woff2'?'':'; charset=utf-8'));res.end(readFileSync(join(process.cwd(),'public',files[path][0])));return;}
   send(404,{error:'not_found'});
  }catch(e){const code=errorCode(e);send(code==='budget_exhausted'||code==='audit_in_progress'?409:400,{error:code,message:messages[code]??'Request could not be completed safely. Check the URL, permissions and configuration.'});}
 });
 return {server,budget};
}
if(import.meta.url===pathToFileURL(process.argv[1]).href){const {server}=makeServer();server.listen(settings.port,'127.0.0.1',()=>console.log(`PageProof ready at http://127.0.0.1:${settings.port}`));}
