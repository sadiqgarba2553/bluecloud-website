import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import worker from './worker.mjs';
const root = path.resolve('artifacts/cloudflare-website/assets');
const env = { ASSETS: { async fetch(request) {
  const file = path.join(root, decodeURIComponent(new URL(request.url).pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return new Response('', { status: 404 });
  return new Response(request.method === 'HEAD' ? null : fs.readFileSync(file), { headers: { 'X-Test-Asset': path.relative(root, file).replaceAll('\\', '/') } });
} } };
const get = (p, method = 'GET') => worker.fetch(new Request('https://bluecloudai.online' + p, { method }), env);
test('React routes retain the website entry and company email metadata', async () => {
  for (const route of ['/', '/contact', '/projects', '/portal/login', '/portal/dashboard', '/coneic-player']) {
    const r = await get(route); assert.equal(r.status, 200); assert.equal(r.headers.get('X-Test-Asset'), 'index.html'); assert.match(await r.text(), /info@bluecloudai\.online/);
  }
});
test('Legacy app pages, privacy links, downloads and case-insensitive URLs resolve to their own files', async () => {
  for (const [route, file] of [['/coneic/privacy', 'coneic/privacy.html'], ['/coneic/installer-codes', 'coneic/installer-codes.html'], ['/quranly/privacy.html', 'quranly/privacy.html'], ['/quranly/read/1', 'quranly/index.html'], ['/portfolio.html', 'portfolio.html'], ['/port/', 'port/index.html'], ['/wifi-master/', 'wifi-master/index.html'], ['/quranly.apk', 'Quranly.apk']]) {
    const r = await get(route, 'HEAD'); assert.equal(r.status, 200, route); assert.equal(r.headers.get('X-Test-Asset'), file, route);
  }
});
test('Career redirects and www canonical redirects preserve query strings', async () => {
  const r = await get('/career-application/google.html?source=mail'); assert.equal(r.status, 301); assert.equal(r.headers.get('Location'), 'https://bluecloudai.online/career-application/interview.html?source=mail');
  const www = await worker.fetch(new Request('https://www.bluecloudai.online/contact?x=1'), env); assert.equal(www.headers.get('Location'), 'https://bluecloudai.online/contact?x=1');
});
test('Missing scripts and unsupported submissions do not return unrelated HTML', async () => {
  for (const route of ['/assets/missing.js', '/quranly/assets/missing.js', '/coneic/downloads/missing.exe']) assert.equal((await get(route)).status, 404);
  assert.equal((await get('/contact', 'POST')).status, 405);
});
