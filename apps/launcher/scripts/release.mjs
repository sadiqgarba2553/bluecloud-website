// Standalone app publishing. This script never reads or writes website source.
import {readFile,writeFile,mkdir,stat,readdir,copyFile,unlink} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createHash,sign} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {Transform} from 'node:stream';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url),appDir=fileURLToPath(new URL('../',import.meta.url)),root=path.resolve(appDir,'../..');
const config=JSON.parse(await readFile(path.join(appDir,'config.json'),'utf8'));
const pkg=JSON.parse(await readFile(path.join(appDir,'package.json'),'utf8'));
const tooldeck=JSON.parse(await readFile(path.join(root,'apps/tooldeck/package.json'),'utf8'));
const products=JSON.parse(await readFile(path.join(appDir,'products.json'),'utf8'));
const [mode,requestedTag]=process.argv.slice(2);
const tag=requestedTag||`launcher-v${pkg.version}`;
if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}$/.test(tag))throw Error('Invalid release tag');
const out=path.join(root,'artifacts/app-releases',tag);
await mkdir(out,{recursive:true});
async function hash(file){const h=createHash('sha256');for await(const chunk of createReadStream(file))h.update(chunk);return h.digest('hex');}
async function sum(dir){let size=0;for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);size+=entry.isDirectory()?await sum(file):(await stat(file)).size;}return size;}
function assetUrl(name){return `https://github.com/${config.repository}/releases/download/${tag}/${encodeURIComponent(name)}`;}
const manifestFile=path.join(out,'release-manifest.json');
if(mode==='prepare'){
  const releases=[],assets=[];
  const add=async file=>{assets.push({file,name:path.basename(file),size:(await stat(file)).size,sha256:await hash(file)});};
  for(const id of ['coneic','quranly','tooldeck']){
    const product=products.find(p=>p.id===id),version=id==='tooldeck'?tooldeck.version:product.version;
    const name=`${id}-${version}-win-x64.zip`,file=path.join(out,name);
    const directory=path.join(root,id==='coneic'?'artifacts/coneic/Coneic':`artifacts/${id}/win-unpacked`);
    const executable={coneic:'Coneic.exe',quranly:'Quranly.exe',tooldeck:'Tooldeck.exe'}[id];
    await stat(path.join(directory,executable));
    let reusable=false;
    if(id!=='tooldeck')try{
      const old=JSON.parse(await readFile(path.join(root,'artifacts/releases/alpha-feed.json'),'utf8'));const record=JSON.parse(old.payload).releases.find(r=>r.appId===id&&r.version===version);
      const cached=path.join(root,'artifacts/releases',name);
      reusable=Boolean(record&&await hash(cached)===record.sha256&&await sum(directory)===record.unpackedSize);
      if(reusable)await copyFile(cached,file);
    }catch{}
    if(!reusable){
      await unlink(file).catch(error=>{if(error.code!=='ENOENT')throw error;});
      const result=spawnSync(require('7zip-bin').path7za,['a','-tzip','-mx=5',file,'.'],{cwd:directory,windowsHide:true,encoding:'utf8'});if(result.status!==0)throw Error(`Could not package ${id}: ${result.stderr}`);
    }
    await add(file);const metadata=assets.at(-1);
    releases.push({appId:id,version,minimumLauncher:'0.1.0-alpha',platform:'win32',arch:'x64',packageType:'zip',executable,size:metadata.size,unpackedSize:await sum(directory),sha256:metadata.sha256,url:assetUrl(name),notes:product.features.join(' · ')});
    console.log(`Prepared ${id}: ${Math.round(metadata.size/1024/1024)} MB`);
  }
  const installer=`Tooldeck-Setup-${tooldeck.version}-x64.exe`;await copyFile(path.join(root,'artifacts/tooldeck',installer),path.join(out,installer));await add(path.join(out,installer));
  const launcher=`BlueCloud-Launcher-Setup-${pkg.version}-x64.exe`;await copyFile(path.join(root,'artifacts/launcher',launcher),path.join(out,launcher));await add(path.join(out,launcher));const launcherAsset=assets.at(-1);
  releases.push({appId:'launcher',version:pkg.version,minimumLauncher:'0.1.0-alpha',platform:'win32',arch:'x64',packageType:'nsis',size:launcherAsset.size,unpackedSize:await sum(path.join(root,'artifacts/launcher/win-unpacked')),sha256:launcherAsset.sha256,url:assetUrl(launcher),notes:'Standalone Windows launcher. Install Coneic, Quranly and Tooldeck; check and apply app updates; install all and update all controls.'});
  const source=`Coneic-${products.find(p=>p.id==='coneic').version}-source.zip`;await copyFile(path.join(root,'artifacts/releases',source),path.join(out,source));await add(path.join(out,source));
  const published=new Date(),expires=new Date(published);expires.setUTCFullYear(expires.getUTCFullYear()+1);
  const payload=JSON.stringify({schemaVersion:1,channel:config.channel,publishedAt:published.toISOString(),expiresAt:expires.toISOString(),releases});
  const privateKey=await readFile(path.join(root,'artifacts/signing/release-private.pem'),'utf8');const envelope={payload,signature:sign(null,Buffer.from(payload),privateKey).toString('base64')};
  const {verifyFeed}=require('../electron/security.cjs');verifyFeed(envelope,config.publicKey,config.channel,pkg.version);
  await writeFile(path.join(out,'alpha-feed.json'),JSON.stringify(envelope,null,2)+'\n');await add(path.join(out,'alpha-feed.json'));
  await writeFile(path.join(out,'SHA256SUMS.txt'),assets.map(a=>`${a.sha256}  ${a.name}`).join('\n')+'\n');await add(path.join(out,'SHA256SUMS.txt'));
  await writeFile(manifestFile,JSON.stringify({tag,version:pkg.version,assets},null,2)+'\n');
  await writeFile(path.join(out,'promote-feed.sql'),`insert into public.bluecloud_release_channels(channel,envelope,published,updated_at) values ('${config.channel}','${JSON.stringify(envelope).replaceAll("'","''")}'::jsonb,true,now()) on conflict(channel) do update set envelope=excluded.envelope,published=true,updated_at=now();\n`);
  console.log(`Prepared standalone release ${tag}. No website files changed.`);
}else if(mode==='verify'){
  const {verifyFeed}=require('../electron/security.cjs');const url=new URL('/rest/v1/bluecloud_release_channels',config.supabaseUrl);url.search=new URLSearchParams({channel:`eq.${config.channel}`,published:'eq.true',select:'envelope'});
  const response=await fetch(url,{headers:{apikey:config.publishableKey},signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error(`Public feed unavailable: ${response.status}`);const rows=await response.json();if(!rows[0])throw Error('No published feed');const feed=verifyFeed(rows[0].envelope,config.publicKey,config.channel,pkg.version);
  for(const r of feed.releases){const response=await fetch(r.url,{method:'HEAD',signal:AbortSignal.timeout(30000)});if(!response.ok||Number(response.headers.get('content-length'))!==r.size)throw Error(`Package unavailable or wrong size: ${r.appId}`);console.log(`Verified public package: ${r.appId} ${r.version}`);}
}else if(mode==='upload'||mode==='publish'){
  const manifest=JSON.parse(await readFile(manifestFile,'utf8'));
  const result=spawnSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',windowsHide:true});if(result.status!==0)throw Error('GitHub credentials are unavailable');
  const credentials=Object.fromEntries(result.stdout.trim().split('\n').map(l=>{const i=l.indexOf('=');return[l.slice(0,i),l.slice(i+1).replace(/\r$/,'')];}));if(!credentials.password)throw Error('GitHub authentication is unavailable');
  const headers={Authorization:`Bearer ${credentials.password}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
  async function api(url,options={}){const r=await fetch(url,{...options,headers:{...headers,...options.headers}});if(!r.ok)throw Error(`GitHub request failed: ${r.status} ${(await r.text()).slice(0,300)}`);return r.status===204?null:r.json();}
  const base=`https://api.github.com/repos/${config.repository}`;const releases=await api(`${base}/releases?per_page=50`);let release=releases.find(r=>r.tag_name===tag);
  if(!release&&mode==='publish')throw Error('Upload a draft first');
  if(!release){const commit=spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim();release=await api(`${base}/releases`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({tag_name:tag,target_commitish:commit,name:`BlueCloud Launcher ${pkg.version} · Windows`,draft:true,prerelease:true,body:`Download **BlueCloud-Launcher-Setup-${pkg.version}-x64.exe**, run it, then install Coneic Player, Quranly PC and Tooldeck from the app library. The launcher checks for updates automatically; choose Update or Update all to apply them. A separate Tooldeck installer is also available.\n\nThis is a standalone Windows x64 alpha release. It does not replace or modify bluecloudai.online. Packages are currently unsigned Windows builds; the launcher authenticates its release feed and package hashes. Existing standalone installs stay separate from managed app copies. Settings and app data are retained during updates.\n\nConeic includes its full runtime and third-party notices. Corresponding source and SHA-256 checksums are attached. No account is required to manage apps.`})});}
  if(mode==='upload'){
    if(!release.draft)throw Error('Published assets are immutable; use a new version');
    for(const asset of manifest.assets){
      if(await hash(asset.file)!==asset.sha256)throw Error(`Local asset changed: ${asset.name}`);
      const existing=release.assets.find(a=>a.name===asset.name);if(existing){if(existing.state==='uploaded'&&existing.size===asset.size&&(!existing.digest||existing.digest===`sha256:${asset.sha256}`)){console.log(`Already verified ${asset.name}`);continue;}if(existing.state==='starter')await api(`${base}/releases/assets/${existing.id}`,{method:'DELETE'});else throw Error(`A different asset already exists: ${asset.name}`);}
      console.log(`Uploading ${asset.name} (${Math.round(asset.size/1024/1024)} MB)`);let sent=0,last=Date.now();const body=createReadStream(asset.file).pipe(new Transform({transform(chunk,_encoding,callback){sent+=chunk.length;if(Date.now()-last>15000){last=Date.now();console.log(`${asset.name}: ${Math.round(sent/asset.size*100)}% sent`);}callback(null,chunk);}}));
      const uploaded=await api(`${release.upload_url.split('{')[0]}?name=${encodeURIComponent(asset.name)}`,{method:'POST',headers:{'content-type':'application/octet-stream','content-length':String(asset.size)},body,duplex:'half'});
      if(uploaded.size!==asset.size||uploaded.digest&&uploaded.digest!==`sha256:${asset.sha256}`)throw Error(`Upload verification failed: ${asset.name}`);console.log(`Verified ${asset.name}`);
    }
    await writeFile(path.join(out,'github-release.json'),JSON.stringify({id:release.id,url:release.html_url,tag},null,2)+'\n');console.log(`Draft ready: ${release.html_url}`);
  }else{
    for(const asset of manifest.assets){if(!release.assets.some(a=>a.name===asset.name&&a.state==='uploaded'&&a.size===asset.size&&(!a.digest||a.digest===`sha256:${asset.sha256}`)))throw Error(`Asset not verified: ${asset.name}`);}
    const published=await api(`${base}/releases/${release.id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({draft:false})});console.log(`Published ${published.html_url}`);
  }
}else throw Error('Use prepare, upload, publish or verify');
