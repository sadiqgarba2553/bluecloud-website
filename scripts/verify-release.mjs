import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{verifyFeed}=require('../apps/launcher/electron/security.cjs');
const config=JSON.parse(await readFile(new URL('../infrastructure/releases/config.json',import.meta.url),'utf8'));
const url=new URL('/rest/v1/bluecloud_release_channels',config.supabaseUrl);url.search=new URLSearchParams({channel:`eq.${config.channel}`,published:'eq.true',select:'envelope'});
const response=await fetch(url,{headers:{apikey:config.publishableKey},signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error(`Public release feed failed: ${response.status}`);const rows=await response.json();if(!rows[0])throw Error('No published feed');const feed=verifyFeed(rows[0].envelope,config.publicKey,config.channel,'0.1.0-alpha');
for(const release of feed.releases){for(const link of new Set([release.url,release.websiteUrl])){const head=await fetch(link,{method:'HEAD',signal:AbortSignal.timeout(30000)});if(!head.ok)throw Error(`${release.appId} download unavailable: ${head.status}`);if(link===release.url&&Number(head.headers.get('content-length'))!==release.size)throw Error(`${release.appId} size differs from signed metadata`);}console.log(`Verified public download: ${release.appId} ${release.version}`);}
console.log('Public Supabase feed signature, expiry and four app download URLs verified.');
