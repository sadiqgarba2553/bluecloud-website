import {mkdir,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const directory=path.resolve('artifacts/coneic/Coneic');
await mkdir('artifacts/smoke',{recursive:true});
const samples=8000,bytes=Buffer.alloc(44+samples*2);bytes.write('RIFF');bytes.writeUInt32LE(36+samples*2,4);bytes.write('WAVEfmt ',8);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(1,22);bytes.writeUInt32LE(8000,24);bytes.writeUInt32LE(16000,28);bytes.writeUInt16LE(2,32);bytes.writeUInt16LE(16,34);bytes.write('data',36);bytes.writeUInt32LE(samples*2,40);for(let i=0;i<samples;i++)bytes.writeInt16LE(Math.round(Math.sin(i*2*Math.PI*440/8000)*1000),44+i*2);
const fixture=path.resolve('artifacts/smoke/tone.wav');await writeFile(fixture,bytes);
const result=spawnSync(path.join(directory,'Coneic.exe'),['--ignore-config','--no-one-instance','--no-media-library','--intf','dummy','--aout','dummy','--vout','dummy','--play-and-exit',fixture],{cwd:directory,windowsHide:true,encoding:'utf8',timeout:20000});
await writeFile('artifacts/smoke/coneic.log',(result.stdout||'')+(result.stderr||''));if(result.status!==0)throw Error(`Coneic packaged runtime smoke failed (${result.status}): ${result.error?.message||''}`);console.log('Coneic full portable runtime loaded and played the generated WAV through dummy output; exited successfully.');
