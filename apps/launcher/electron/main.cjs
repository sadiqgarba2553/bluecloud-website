const {app,BrowserWindow,ipcMain,Menu,dialog,shell}=require('electron');
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const {spawn,execFile}=require('node:child_process');
const {promisify}=require('node:util');
const {pathToFileURL}=require('node:url');
const {extractPackage}=require('./extract.cjs');
const semver=require('semver');
const {safePath,trustedDownload,verifyFeed,IDS}=require('./security.cjs');
const config=require('../config.json');
const products=require('../products.json');
const version=require('../package.json').version;
if(process.env.BLUECLOUD_TEST_PROFILE&&!app.isPackaged)app.setPath('userData',process.env.BLUECLOUD_TEST_PROFILE);
if(app.commandLine.hasSwitch('user-data-dir'))app.setPath('userData',path.resolve(app.commandLine.getSwitchValue('user-data-dir')));
const library=path.join(app.getPath('userData'),'library');
const registryPath=path.join(app.getPath('userData'),'installed.json');
const feedCache=path.join(app.getPath('userData'),'feed.json');
const start=pathToFileURL(path.join(__dirname,'../ui/index.html')).href;
let win,feed=null,installed={},lastError='',highestPublished=0;
const jobs=new Map(),children=new Map();let saveQueue=Promise.resolve();
function saveRegistry(){saveQueue=saveQueue.catch(()=>{}).then(async()=>{await fs.mkdir(path.dirname(registryPath),{recursive:true});await fs.writeFile(registryPath+'.tmp',JSON.stringify(installed,null,2));await fs.rename(registryPath+'.tmp',registryPath);});return saveQueue;}
function sender(event){if(event.sender!==win?.webContents||event.senderFrame?.url.split('#')[0]!==start)throw Error('Untrusted window');}
function idCheck(id){if(!IDS.has(id))throw Error('Unknown app');}
async function openLink(input){idCheck(input?.id);const links={website:'https://bluecloudai.online/',source:`https://github.com/sadiqgarba2553/bluecloud-website/tree/main/apps/${input.id}`,support:'mailto:sadeeqsgi@icloud.com'};if(!Object.hasOwn(links,input.kind))throw Error('Unknown link');await shell.openExternal(links[input.kind]);return state();}
function emit(id,phase,percent=0){if(!win?.isDestroyed())win?.webContents.send('progress',{id,phase,percent});}
function state(){return{products,installed,releases:(feed?.releases||[]).map(r=>({...r,updateAvailable:semver.gt(r.version,r.appId==='launcher'?version:installed[r.appId]?.version||r.version)})),version,channel:config.channel,error:lastError,busy:[...jobs.keys()]};}
async function refresh(){
  try{
    const url=new URL('/rest/v1/bluecloud_release_channels',config.supabaseUrl);url.search=new URLSearchParams({channel:`eq.${config.channel}`,published:'eq.true',select:'envelope'});
    const response=await fetch(url,{headers:{apikey:config.publishableKey},signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw Error(`Release service returned ${response.status}`);
    const rows=await response.json();if(!rows[0])throw Error('No published releases yet. Installed apps can still open.');
    const next=verifyFeed(rows[0].envelope,config.publicKey,config.channel,version);
    if(Date.parse(next.publishedAt)<highestPublished)throw Error('Release feed is older than the last trusted feed');
    highestPublished=Date.parse(next.publishedAt);feed=next;lastError='';await fs.writeFile(feedCache,JSON.stringify(rows[0].envelope));
  }catch(error){lastError=error.message;}
  return state();
}
async function download(release,dest,signal){
  let url=trustedDownload(release.url),response;
  for(let i=0;i<6;i++){
    response=await fetch(url,{signal,redirect:'manual'});
    if([301,302,303,307,308].includes(response.status)){const location=response.headers.get('location');await response.body?.cancel();if(!location)throw Error('Missing download redirect');url=trustedDownload(new URL(location,url).href);continue;}
    break;
  }
  if(!response?.ok||!response.body)throw Error(`Download failed (${response?.status})`);
  const hash=crypto.createHash('sha256');let bytes=0;const file=await fs.open(dest,'wx');
  let lastPercent=-1;
  try{for await(const chunk of response.body){signal.throwIfAborted();bytes+=chunk.length;if(bytes>release.size)throw Error('Package exceeds the expected size');hash.update(chunk);let offset=0;while(offset<chunk.length){const result=await file.write(chunk,offset,chunk.length-offset);if(result.bytesWritten===0)throw Error('Could not write the downloaded package');offset+=result.bytesWritten;}const percent=Math.round(bytes/release.size*100);if(percent!==lastPercent){lastPercent=percent;emit(release.appId,'Downloading',percent);}}}
  finally{await file.close();}
  if(bytes!==release.size||hash.digest('hex')!==release.sha256)throw Error('Package verification failed. Retry the download.');
}
async function running(id){const child=children.get(id);if(child&&child.exitCode===null)return true;const entry=installed[id];if(!entry)return false;try{const {stdout}=await promisify(execFile)('tasklist.exe',['/FI',`IMAGENAME eq ${path.basename(entry.executable)}`,'/FO','CSV','/NH'],{windowsHide:true});return stdout.toLowerCase().includes(`"${path.basename(entry.executable).toLowerCase()}"`);}catch{throw Error('Could not check whether the app is running. Close the app and retry.');}}
async function install(id){
  idCheck(id);if(jobs.has(id))throw Error('This app already has an operation in progress');
  if(process.platform!=='win32'||process.arch!=='x64')throw Error('This release supports Windows x64.');
  const r=feed?.releases.find(r=>r.appId===id);if(!r)throw Error('No trusted release is available. Check for updates first.');
  if(Date.parse(feed.expiresAt)<=Date.now())throw Error('Release information expired. Check for updates again.');
  const old=installed[id];if(old&&!semver.gt(r.version,old.version))throw Error('The installed version is already current.');
  const controller=new AbortController();jobs.set(id,controller);const work=path.join(library,`.download-${id}-${crypto.randomUUID()}`);let destination;
  try{
    if(id!=='launcher'&&await running(id))throw Error('Close the app before updating it.');
    await fs.mkdir(work,{recursive:true});const disk=await fs.statfs(work);if(disk.bavail*disk.bsize<r.size+r.unpackedSize+100000000)throw Error('Not enough free disk space.');
    const archive=path.join(work,r.packageType==='zip'?'package.zip':'setup.exe');await download(r,archive,AbortSignal.any([controller.signal,AbortSignal.timeout(1800000)]));controller.signal.throwIfAborted();emit(id,'Verifying',100);
    if(id==='launcher'){
      const answer=await dialog.showMessageBox(win,{type:'question',message:`Install BlueCloud Launcher ${r.version}?`,detail:'The launcher will close and run the verified update installer.',buttons:['Install update','Later'],defaultId:1,cancelId:1});
      if(answer.response===0){const child=spawn(archive,[],{detached:true,stdio:'ignore',windowsHide:false});await new Promise((resolve,reject)=>{child.once('spawn',resolve);child.once('error',reject);});child.unref();app.quit();return state();}
      return state();
    }
    emit(id,'Installing',100);const unpack=path.join(work,'unpacked');
    await extractPackage(archive,unpack,r.unpackedSize,controller.signal);
    controller.signal.throwIfAborted();const exe=safePath(unpack,r.executable);const stat=await fs.lstat(exe);if(!stat.isFile()||stat.isSymbolicLink())throw Error('Package executable is missing');
    destination=safePath(library,`${id}/${r.version}-${crypto.randomUUID()}`);await fs.mkdir(path.dirname(destination),{recursive:true});await fs.rename(unpack,destination);
    installed[id]={version:r.version,directory:path.relative(library,destination).replaceAll('\\','/'),executable:r.executable,installedAt:new Date().toISOString()};
    try{await saveRegistry();}catch(error){if(old)installed[id]=old;else delete installed[id];await fs.rm(destination,{recursive:true,force:true});throw error;}
    // Keep the previous version for manual recovery; never delete app profile data.
    emit(id,'Ready',100);
  }finally{jobs.delete(id);if(id!=='launcher'||!app.isQuitting)await fs.rm(work,{recursive:true,force:true}).catch(()=>{});emit(id,'Finished',100);}
  return state();
}
async function launch(id){idCheck(id);if(jobs.has(id))throw Error('Wait for the update to finish.');const entry=installed[id];if(!entry)throw Error('Install this app first.');const dir=safePath(library,entry.directory);const exe=safePath(dir,entry.executable);const stat=await fs.lstat(exe);if(!stat.isFile()||stat.isSymbolicLink())throw Error('The installed executable is missing.');if(jobs.has(id))throw Error('Wait for the update to finish.');const child=spawn(exe,[],{cwd:dir,detached:true,stdio:'ignore'});await new Promise((resolve,reject)=>{child.once('spawn',resolve);child.once('error',reject);});children.set(id,child);child.once('exit',()=>children.delete(id));child.unref();return state();}
async function uninstall(id){
  idCheck(id);if(id==='launcher'||jobs.has(id))throw Error('This app cannot be removed during an operation.');if(!installed[id])return state();
  jobs.set(id,new AbortController());
  try{
    if(await running(id))throw Error('Close the app before removing it.');
    const answer=await dialog.showMessageBox(win,{type:'question',message:`Remove ${products.find(p=>p.id===id).name}?`,detail:'Managed app files will be removed. Your app settings and user data are retained.',buttons:['Remove app','Cancel'],defaultId:1,cancelId:1});
    if(answer.response!==0)return state();const dir=safePath(library,id);await fs.rm(dir,{recursive:true,force:true});delete installed[id];await saveRegistry();
  }finally{jobs.delete(id);emit(id,'Finished',100);}
  return state();
}
if(!app.requestSingleInstanceLock())app.quit();
else app.whenReady().then(async()=>{
  app.setAppUserModelId('com.bluecloud.launcher');await fs.mkdir(library,{recursive:true});
  try{const saved=JSON.parse(await fs.readFile(registryPath,'utf8'));for(const [id,e]of Object.entries(saved)){if(!IDS.has(id)||id==='launcher'||!semver.valid(e.version))continue;safePath(library,e.directory);safePath(library,e.executable);installed[id]=e;}}catch(error){if(error.code!=='ENOENT')lastError='The library record could not be read. Contact support before reinstalling apps.';}
  try{const envelope=JSON.parse(await fs.readFile(feedCache,'utf8'));feed=verifyFeed(envelope,config.publicKey,config.channel,version);highestPublished=Date.parse(feed.publishedAt);}catch{}
  win=new BrowserWindow({width:1380,height:860,minWidth:920,minHeight:620,titleBarStyle:'hidden',titleBarOverlay:{color:'#14171d',symbolColor:'#9da8b9',height:65},backgroundColor:'#0e1013',webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true}});Menu.setApplicationMenu(null);
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));win.webContents.on('will-navigate',(event,url)=>{if(url.split('#')[0]!==start)event.preventDefault();});win.webContents.on('will-attach-webview',e=>e.preventDefault());
  for(const [name,handler]of Object.entries({state,refresh,install,launch,uninstall,openLink,cancel:id=>{idCheck(id);jobs.get(id)?.abort();return state();}}))ipcMain.handle(name,async(event,...args)=>{sender(event);try{return{ok:true,state:await handler(...args)};}catch(error){return{ok:false,error:error.message};}});
  win.loadURL(start);app.on('second-instance',()=>{if(win.isMinimized())win.restore();win.focus();});
  win.on('close',event=>{if(jobs.size&&!app.isQuitting){event.preventDefault();dialog.showMessageBox(win,{message:'An app operation is in progress',detail:'Cancel the download or wait for installation to finish before closing.'});}});
});
app.on('before-quit',()=>{app.isQuitting=true;});
app.on('window-all-closed',()=>app.quit());
