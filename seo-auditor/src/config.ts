import {config} from 'dotenv';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {SafeError} from './types.js';
config({quiet:true});config({path:join(homedir(),'.config/tinyfish/credentials.env'),quiet:true});
export const root=process.cwd();
const cap=Number(process.env.MAX_AUDITS??3),port=Number(process.env.PORT??3130);
if(!Number.isInteger(cap)||cap<1||cap>10||!Number.isInteger(port)||port<1024||port>65535)throw new SafeError('invalid_configuration');
export const settings={key:process.env.TINYFISH_API_KEY??'',approved:process.env.FREE_CREDITS_APPROVED==='true',cap,port,budgetPath:join(root,'.data/budget.sqlite')};
