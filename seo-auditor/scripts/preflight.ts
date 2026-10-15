import {settings} from '../src/config.js';
import {TinyFishProvider,walletAllowed} from '../src/provider.js';
import {Budget} from '../src/budget.js';
import {errorCode} from '../src/types.js';
const budget=new Budget(settings.budgetPath,settings.cap);
const result:Record<string,unknown>={checkedAt:new Date().toISOString(),keyPresent:!!settings.key,freeCreditsApproved:settings.approved,used:budget.used(),cap:settings.cap,wallet:'not tested'};
if(settings.key){try{const wallet=await new TinyFishProvider(settings.key).wallet();walletAllowed(wallet,budget.baseline(Number(wallet.available_balance)));result.wallet='safe';result.autoReload=wallet.auto_reload?.state;result.freeSearchFetchRatesVerified=true;result.browserRateCeilingUsdPerMinute=0.002;}catch(e){result.wallet=errorCode(e);}}
budget.close();console.log(JSON.stringify(result,null,2));
