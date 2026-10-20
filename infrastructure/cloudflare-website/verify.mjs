import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const base = process.argv[2];
if (!base?.startsWith('https://')) throw new Error('Pass the HTTPS website base URL.');
const checks = [];
async function check(route, { status = 200, text, type, method = 'GET' } = {}) {
  const r = await fetch(new URL(route, base), { method, redirect: 'manual', signal: AbortSignal.timeout(30000) });
  assert.equal(r.status, status, route + ' HTTP status');
  if (type) assert.match(r.headers.get('content-type') || '', type, route + ' content type');
  if (text) assert.match(await r.text(), text, route + ' content');
  checks.push({ route, status: r.status });
  return r;
}
await check('/contact', { text: /info@bluecloudai\.online/, type: /text\/html/ });
const index = await fetch(new URL('/', base)).then(r => r.text());
const entry = index.match(/src="([^"\s]+\.js)"/)?.[1];
assert(entry, 'Website script entry');
const bundle = await fetch(new URL(entry, base)).then(r => r.text());
for (const address of ['info@bluecloudai.online', 'support@bluecloudai.online', 'ceo@bluecloudai.online']) assert(bundle.includes(address), address + ' in website');
await check('/portal/login', { text: /<div id="root">/ });
await check('/projects', { text: /<div id="root">/ });
await check('/coneic/privacy', { text: /support@bluecloudai\.online/ });
await check('/coneic/installer-codes', { text: /support@bluecloudai\.online/ });
await check('/quranly/privacy.html', { text: /support@bluecloudai\.online/ });
await check('/quranly/read/1', { text: /<title>Quranly/ });
await check('/portfolio.html', { text: /ceo@bluecloudai\.online/ });
await check('/port/', { text: /ceo@bluecloudai\.online/ });
await check('/wifi-master/', { text: /support@bluecloudai\.online/ });
const career = await check('/career-application/google.html?source=mail', { status: 301 });
assert.equal(new URL(career.headers.get('location')).pathname, '/career-application/interview.html');
assert.equal(new URL(career.headers.get('location')).search, '?source=mail');
await check('/Quranly.apk', { method: 'HEAD', type: /android|octet-stream/ });
await check('/quranly.apk', { method: 'HEAD', type: /android|octet-stream/ });
await check('/assets/missing.js', { status: 404 });
await check('/quranly/assets/missing.js', { status: 404 });
await check('/contact', { status: 405, method: 'POST' });
const range = await fetch(new URL('/Quranly.apk', base), { headers: { Range: 'bytes=0-15' }, signal: AbortSignal.timeout(30000) });
const download = Buffer.from(await range.arrayBuffer());
if (range.status === 206) {
  assert.equal(download.byteLength, 16);
} else {
  assert.equal(range.status, 200);
  const expected = fs.readFileSync('artifacts/cloudflare-website/assets/Quranly.apk');
  assert.equal(createHash('sha256').update(download).digest('hex'), createHash('sha256').update(expected).digest('hex'), 'Full download fallback integrity');
}
checks.push({ route: '/Quranly.apk download integrity', status: range.status });
const report = { base, passed: true, checks, at: new Date().toISOString() };
fs.writeFileSync('artifacts/cloudflare-website/verification-' + new URL(base).hostname + '.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
