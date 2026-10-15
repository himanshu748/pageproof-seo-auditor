import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,chmodSync} from 'node:fs';
import {dirname} from 'node:path';
import {SafeError} from './types.js';
export class Budget {
 db:DatabaseSync;
 constructor(path:string,private cap=3){if(path!==':memory:'){mkdirSync(dirname(path),{recursive:true,mode:0o700});}this.db=new DatabaseSync(path);if(path!==':memory:')chmodSync(path,0o600);this.db.exec('PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS attempts(id TEXT PRIMARY KEY, created TEXT NOT NULL); CREATE TABLE IF NOT EXISTS config(key TEXT PRIMARY KEY,value REAL NOT NULL)');}
 used(){return Number((this.db.prepare('SELECT count(*) AS n FROM attempts').get() as {n:number}).n);}
 reserve(id:string){this.db.exec('BEGIN IMMEDIATE');try{if(this.used()>=this.cap)throw new SafeError('budget_exhausted');this.db.prepare('INSERT INTO attempts VALUES(?,?)').run(id,new Date().toISOString());this.db.exec('COMMIT');}catch(e){this.db.exec('ROLLBACK');if(e instanceof SafeError)throw e;throw new SafeError('duplicate_request');}}
 baseline(balance:number){this.db.prepare("INSERT OR IGNORE INTO config VALUES('baseline',?)").run(balance);return Number((this.db.prepare("SELECT value FROM config WHERE key='baseline'").get() as {value:number}).value);}
 close(){this.db.close();}
}
