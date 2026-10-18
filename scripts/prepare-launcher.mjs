import { generateKeyPairSync } from 'node:crypto';
import { readFile, writeFile, mkdir, access, copyFile } from 'node:fs/promises';
const configUrl=new URL('../infrastructure/releases/config.json',import.meta.url);
const privateUrl=new URL('../artifacts/signing/release-private.pem',import.meta.url);
const config=JSON.parse(await readFile(configUrl,'utf8'));
if(!config.publicKey){
  try { await access(privateUrl); throw Error('An existing signing key needs recovery; refusing to overwrite it.'); } catch(e) { if(e.code!=='ENOENT')throw e; }
  const keys=generateKeyPairSync('ed25519',{publicKeyEncoding:{type:'spki',format:'pem'},privateKeyEncoding:{type:'pkcs8',format:'pem'}});
  await mkdir(new URL('../artifacts/signing/',import.meta.url),{recursive:true});await writeFile(privateUrl,keys.privateKey,{mode:0o600});config.publicKey=keys.publicKey;await writeFile(configUrl,JSON.stringify(config,null,2)+'\n');
  console.log('Created release signing key in ignored artifacts/signing. Back this file up privately.');
}
await writeFile(new URL('../apps/launcher/config.json',import.meta.url),JSON.stringify(config,null,2)+'\n');
await copyFile(new URL('../packages/product-catalog/products.json',import.meta.url),new URL('../apps/launcher/products.json',import.meta.url));
await mkdir(new URL('../apps/launcher/ui/assets/',import.meta.url),{recursive:true});
await copyFile(new URL('../apps/coneic/share/coneic/coneic-128.png',import.meta.url),new URL('../apps/launcher/ui/assets/coneic.png',import.meta.url));
await copyFile(new URL('../public/quranlylogo.png',import.meta.url),new URL('../apps/launcher/ui/assets/quranly.png',import.meta.url));
await copyFile(new URL('../public/tooldecklogo.png',import.meta.url),new URL('../apps/launcher/ui/assets/tooldeck.png',import.meta.url));
console.log('Launcher catalog and public release trust configuration prepared.');
