// Credentials are requested from Git's configured helper in memory; never logged or persisted.
import {readFile,writeFile,mkdir,stat,readdir} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createHash,sign} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url),root=fileURLToPath(new URL('../',import.meta.url));
const config=JSON.parse(await readFile(path.join(root,'infrastructure/releases/config.json'),'utf8'));
const products=JSON.parse(await readFile(path.join(root,'packages/product-catalog/products.json'),'utf8'));
const out=path.join(root,'artifacts/releases');await mkdir(out,{recursive:true});
const tag='bluecloud-alpha-2026.10.18';
const [mode]=process.argv.slice(2);
const files=[
  {id:'coneic',directory:path.join(root,'artifacts/coneic/Coneic'),executable:'Coneic.exe'},
  {id:'quranly',directory:path.join(root,'artifacts/quranly/win-unpacked'),executable:'Quranly.exe',installer:path.join(root,'artifacts/quranly/Quranly-Setup-0.1.0-alpha-x64.exe')},
  {id:'tooldeck',directory:path.join(root,'artifacts/tooldeck/win-unpacked'),executable:'Tooldeck.exe',installer:path.join(root,'artifacts/tooldeck/Tooldeck-Setup-0.1.0-alpha-x64.exe')},
];
async function sum(dir){let size=0;for(const d of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,d.name);size+=d.isDirectory()?await sum(file):(await stat(file)).size;}return size;}
async function hash(file){const h=createHash('sha256');for await(const chunk of createReadStream(file))h.update(chunk);return h.digest('hex');}
function archive(directory,target){const p=spawnSync(require('7zip-bin').path7za,['a','-tzip','-mx=5',target,'.'],{cwd:directory,windowsHide:true,encoding:'utf8'});if(p.status!==0)throw Error(`Archive failed: ${p.stderr||p.stdout}`);}
if(mode==='prepare'){
  const releases=[];
  for(const f of files){const p=products.find(p=>p.id===f.id),name=`${f.id}-${p.version}-win-x64.zip`,target=path.join(out,name);archive(f.directory,target);const r={appId:p.id,version:p.version,minimumLauncher:'0.1.0-alpha',platform:'win32',arch:'x64',packageType:'zip',executable:f.executable,size:(await stat(target)).size,unpackedSize:await sum(f.directory),sha256:await hash(target),url:`https://github.com/${config.repository}/releases/download/${tag}/${name}`,websiteUrl:`https://github.com/${config.repository}/releases/download/${tag}/${f.installer?path.basename(f.installer):name}`,notes:p.features.join(' · ')};releases.push(r);console.log(`Prepared ${name} (${Math.round(r.size/1024/1024)} MB)`);}
  const launcherFile=path.join(root,'artifacts/launcher/BlueCloud-Launcher-Setup-0.1.0-alpha-x64.exe');
  releases.push({appId:'launcher',version:'0.1.0-alpha',minimumLauncher:'0.1.0-alpha',platform:'win32',arch:'x64',packageType:'nsis',size:(await stat(launcherFile)).size,unpackedSize:await sum(path.join(root,'artifacts/launcher/win-unpacked')),sha256:await hash(launcherFile),url:`https://github.com/${config.repository}/releases/download/${tag}/${path.basename(launcherFile)}`,websiteUrl:`https://github.com/${config.repository}/releases/download/${tag}/${path.basename(launcherFile)}`,notes:'First BlueCloud launcher alpha: install, open, remove and update managed apps with signed package verification.'});
  const now=new Date(),expires=new Date(now);expires.setUTCFullYear(expires.getUTCFullYear()+1);
  const payload=JSON.stringify({schemaVersion:1,channel:'alpha',publishedAt:now.toISOString(),expiresAt:expires.toISOString(),releases});const privateKey=await readFile(path.join(root,'artifacts/signing/release-private.pem'),'utf8');const envelope={payload,signature:sign(null,Buffer.from(payload),privateKey).toString('base64')};
  await writeFile(path.join(out,'alpha-feed.json'),JSON.stringify(envelope,null,2)+'\n');
  await writeFile(path.join(out,'website-catalog.json'),JSON.stringify({schemaVersion:1,releases},null,2)+'\n');
  const sql=`insert into public.bluecloud_release_channels(channel,envelope,published,updated_at) values ('alpha','${JSON.stringify(envelope).replaceAll("'","''")}'::jsonb,true,now()) on conflict(channel) do update set envelope=excluded.envelope,published=true,updated_at=now();\n`;
  await writeFile(path.join(out,'promote-feed.sql'),sql);
  const sourceZip=path.join(out,'Coneic-0.2.1-alpha-r2-source.zip');archive(path.join(root,'apps/coneic'),sourceZip);
  console.log('Signed release feed and corresponding Coneic source archive prepared.');
}else if(mode==='upload'||mode==='publish'){
  const filled=spawnSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',windowsHide:true});
  if(filled.status!==0)throw Error('GitHub authentication is unavailable from the configured Git credential helper.');
  const credentials=Object.fromEntries(filled.stdout.trim().split('\n').map(l=>{const i=l.indexOf('=');return[l.slice(0,i),l.slice(i+1)];}));
  if(!credentials.password)throw Error('No GitHub credential was returned.');
  const headers={Authorization:`Bearer ${credentials.password}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
  async function api(url,options={}){const response=await fetch(url,{...options,headers:{...headers,...options.headers}});if(!response.ok)throw Error(`GitHub request failed: ${response.status} ${await response.text()}`);return response.status===204?null:response.json();}
  const base=`https://api.github.com/repos/${config.repository}`;
  let release;const response=await fetch(`${base}/releases/tags/${tag}`,{headers});if(response.ok)release=await response.json();else if(response.status!==404)throw Error(`GitHub lookup failed: ${response.status}`);
  if(!release&&mode==='publish')throw Error('Upload a draft release first.');
  if(!release)release=await api(`${base}/releases`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({tag_name:tag,name:'BlueCloud Windows Alpha · 18 October 2026',draft:true,prerelease:true,body:'First unified BlueCloud Windows alpha: BlueCloud Launcher, Coneic Player, Quranly PC and Tooldeck. The launcher installs managed app copies and verifies signed release metadata and package SHA-256 hashes. Standalone installers remain available. Windows packages are unsigned development builds. Coneic includes the full native runtime and notices; its corresponding source archive is attached. See the repository README for setup and known limitations.'})});
  if(mode==='upload'){
    if(!release.draft)throw Error('Release is already published; immutable assets will not be overwritten.');
    const uploads=[...(await readdir(out)).filter(n=>n.endsWith('.zip')||n==='alpha-feed.json').map(n=>path.join(out,n)),...files.filter(f=>f.installer).map(f=>f.installer),path.join(root,'artifacts/launcher/BlueCloud-Launcher-Setup-0.1.0-alpha-x64.exe')];
    for(const file of uploads){const name=path.basename(file),existing=release.assets.find(a=>a.name===name),digest=await hash(file),size=(await stat(file)).size;if(existing){if(existing.size!==size||existing.digest&&existing.digest!==`sha256:${digest}`)throw Error(`Existing asset differs: ${name}`);console.log(`Already uploaded ${name}`);continue;}console.log(`Uploading ${name} (${Math.round(size/1024/1024)} MB)`);const asset=await api(`${release.upload_url.split('{')[0]}?name=${encodeURIComponent(name)}`,{method:'POST',headers:{'content-type':'application/octet-stream','content-length':String(size)},body:createReadStream(file),duplex:'half'});if(asset.size!==size||asset.digest&&asset.digest!==`sha256:${digest}`)throw Error(`Upload verification failed: ${name}`);console.log(`Verified ${name}`);}
    await writeFile(path.join(out,'github-release.json'),JSON.stringify({id:release.id,url:release.html_url,tag},null,2));console.log(`Draft uploaded: ${release.html_url}`);
  }else{
    const expected=JSON.parse(await readFile(path.join(out,'website-catalog.json'),'utf8')).releases;
    for(const r of expected)for(const url of [r.url,r.websiteUrl]){const name=decodeURIComponent(new URL(url).pathname.split('/').at(-1));if(!release.assets.some(a=>a.name===name&&a.state==='uploaded'))throw Error(`Missing release asset: ${name}`);}
    const result=await api(`${base}/releases/${release.id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({draft:false})});console.log(`Published ${result.html_url}`);
    await writeFile(path.join(root,'public/releases/catalog.json'),await readFile(path.join(out,'website-catalog.json')));
  }
}else throw Error('Use: node scripts/releases.mjs prepare|upload|publish');
