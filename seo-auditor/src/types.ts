export type Status='pass'|'warning'|'fail'|'not tested';
export type Finding={id:string;name:string;status:Status;weight:number;evidence:string;impact:string;fix:string;source:string};
export type Outcome<T>={ok:true;data:T}|{ok:false;code:string};
export type HttpReceipt={url:string;status:number;location?:string};
export type Preflight={url:string;chain:HttpReceipt[];robots:{url:string;status:number|null;text:string|null;allowed:boolean|null;code?:string}};
export type DomData={html:string;finalUrl:string;status:number;redirects:HttpReceipt[];xRobotsTag:string|null;limited:boolean;blockedRequests:number;settle:'network-idle'|'bounded-snapshot';cleanup:'confirmed'|'unconfirmed'};
export type FetchData={finalUrl:string;text:string;characters:number;truncated:boolean;title:string|null};
export type SearchData={query:string;results:{title:string;url:string;snippet:string}[];returned:number;location:'US';language:'en'};
export type Input={url:string;query?:string;permitted:true};
export type Observations={preflight:Preflight;dom:Outcome<DomData>;fetch:Outcome<FetchData>;search:Outcome<SearchData>};
export type Report={version:1;id:string;mode:'live'|'fixture';url:string;observedAt:string;query:string;findings:Finding[];score:{value:number|null;earned:number;available:number;measured:number;total:number;coverage:number;formula:string};priorities:Finding[];observations:Omit<Observations,'dom'> & {dom:Outcome<Omit<DomData,'html'>>};limits:string[]};
export class SafeError extends Error{constructor(public code:string){super(code);}}
export const errorCode=(e:unknown)=>e instanceof SafeError?e.code:'provider_unavailable';
