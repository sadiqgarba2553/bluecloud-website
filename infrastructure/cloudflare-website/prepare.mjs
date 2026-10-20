import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const source = path.join(root, 'dist');
const generated = path.join(root, 'artifacts/cloudflare-website');
const output = path.join(generated, 'assets');
if (!fs.existsSync(path.join(source, 'index.html'))) throw new Error('Run npm run build first.');
if (path.dirname(output) !== generated || !generated.startsWith(root + path.sep)) throw new Error('Unsafe generated asset path.');
console.log('Preparing generated website assets at ' + output);
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
const paths = {};
let bytes = 0;
function copy(directory, relative = '') {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.well-known') continue;
    if (entry.name === 'node_modules' || /\.(pem|key|pfx)$/i.test(entry.name)) continue;
    const name = path.posix.join(relative, entry.name);
    const input = path.join(directory, entry.name);
    if (entry.isDirectory()) { copy(input, name); continue; }
    if (!entry.isFile() || name === '_redirects' || name === '_headers') continue;
    const stat = fs.statSync(input);
    if (stat.size > 25 * 1024 * 1024) throw new Error('Asset exceeds Cloudflare limit: ' + name);
    const target = path.join(output, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(input, target);
    paths['/' + name.toLowerCase()] = '/' + name;
    bytes += stat.size;
  }
}
copy(source);
if (Object.keys(paths).length > 20000) throw new Error('Cloudflare static asset count exceeded.');
fs.writeFileSync(path.join(generated, 'asset-paths.mjs'), 'export default ' + JSON.stringify(paths) + ';\n');
fs.writeFileSync(path.join(output, '_headers'), '/*\n  Cache-Control: public, max-age=0, must-revalidate\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n');
console.log(JSON.stringify({ files: Object.keys(paths).length, MiB: +(bytes / 1048576).toFixed(1) }));
