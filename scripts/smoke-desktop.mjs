import { _electron as electron } from '@playwright/test';
import {mkdtemp,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
await mkdir('artifacts/screenshots',{recursive:true});
for(const [id,executable]of [['launcher','BlueCloud Launcher.exe'],['quranly','Quranly.exe']]){
  const profile=await mkdtemp(path.join(tmpdir(),`bluecloud-${id}-smoke-`));const env={...process.env};delete env.ELECTRON_RUN_AS_NODE;
  const app=await electron.launch({executablePath:path.resolve(`artifacts/${id}/win-unpacked/${executable}`),args:[`--user-data-dir=${profile}`],env});
  try{
    const info=await app.evaluate(({app,BrowserWindow})=>{const prefs=BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences();return{packaged:app.isPackaged,version:app.getVersion(),profile:app.getPath('userData'),isolated:prefs.contextIsolation,sandbox:prefs.sandbox,node:prefs.nodeIntegration};});
    if(!info.packaged||info.version!=='0.1.0-alpha'||!info.isolated||!info.sandbox||info.node||info.profile!==profile)throw Error(`${id} packaged identity or isolation failed`);
    const page=await app.firstWindow();
    if(id==='launcher'){await page.getByRole('heading',{name:'Your app library.'}).waitFor();await page.getByRole('button',{name:'Check for updates'}).waitFor();await page.screenshot({path:'artifacts/screenshots/launcher-packaged.png',fullPage:true});}
    else{await page.getByRole('button',{name:'Skip setup'}).click();await page.locator('.desktop-sidebar').waitFor();await page.locator('.home-page').waitFor();await page.screenshot({path:'artifacts/screenshots/quranly-packaged.png',fullPage:true});}
    console.log(`${id}: packaged startup, version, isolated user profile and sandbox passed.`);
  }finally{await app.close();await rm(profile,{recursive:true,force:true});}
}
