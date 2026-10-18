import {spawnSync} from 'node:child_process';
import {readFile,stat} from 'node:fs/promises';
const result=spawnSync('git',['diff','--cached','--name-only','--diff-filter=ACMR','-z'],{encoding:'utf8',maxBuffer:20000000});
if(result.status!==0)throw Error('Could not inspect staged paths');
const paths=result.stdout.split('\0').filter(Boolean),problems=[];let bytes=0;
for(const file of paths){const info=await stat(file);bytes+=info.size;if(info.size>95*1024*1024)problems.push(`Oversized source file: ${file}`);if(/(^|\/)\.env(?:\.|$)/.test(file)&&!file.endsWith('.example'))problems.push(`Local environment file: ${file}`);if(/\.(pem|key|p12|pfx|keystore)$/.test(file))problems.push(`Private credential container: ${file}`);if(info.size<3000000&&/\.(js|jsx|mjs|cjs|json|md|txt|yml|yaml|html|sql|env|example)$/.test(file)){const value=await readFile(file,'utf8');if(/-----BEGIN (?:RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----[\r\n]+[A-Za-z0-9+/]{30}/.test(value)||/gh[pousr]_[A-Za-z0-9]{30,}/.test(value)||/sb_secret_[A-Za-z0-9_-]{25,}/.test(value))problems.push(`Credential-like content: ${file}`);}}
if(problems.length){console.error(problems.join('\n'));process.exitCode=1;}else console.log(`Checked ${paths.length} staged source paths (${Math.round(bytes/1024/1024)} MB): no private credential containers, local environment files or oversized files found.`);
