import { spawnSync } from 'node:child_process';
import { cp, mkdir } from 'node:fs/promises';
const command = process.platform === 'win32' ? 'node.exe' : 'node';
function run(args, cwd) { const p = spawnSync(command, args, { cwd, stdio: 'inherit' }); if (p.status !== 0) process.exit(p.status || 1); }
const root = new URL('../', import.meta.url);
run(['node_modules/vite/bin/vite.js','build'],root);
run(['../../node_modules/vite/bin/vite.js','build'],new URL('../apps/tooldeck/',import.meta.url));
await mkdir(new URL('../dist/tool-deck/',import.meta.url),{recursive:true});
await cp(new URL('../apps/tooldeck/dist/',import.meta.url),new URL('../dist/tool-deck/',import.meta.url),{recursive:true});
await cp(new URL('../sw.js',import.meta.url),new URL('../dist/sw.js',import.meta.url));
console.log('Website and bundled Tooldeck web app built.');
