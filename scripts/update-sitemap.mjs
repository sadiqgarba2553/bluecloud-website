import {writeFile} from 'node:fs/promises';
const paths=['/','/apps','/apps/coneic','/apps/quranly','/apps/tooldeck','/launcher','/downloads','/releases','/support','/privacy','/terms','/coneic/privacy','/coneic/installer-codes'];
await writeFile(new URL('../public/sitemap.xml',import.meta.url),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+paths.map(p=>`  <url><loc>https://bluecloudai.online${p}</loc></url>`).join('\n')+'\n</urlset>\n');
await writeFile(new URL('../public/robots.txt',import.meta.url),'User-agent: *\nAllow: /\nSitemap: https://bluecloudai.online/sitemap.xml\n');
