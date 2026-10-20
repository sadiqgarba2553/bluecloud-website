import assetPaths from '../../artifacts/cloudflare-website/asset-paths.mjs';

const careerRedirects = new Set([
  '/career-application', '/career-application/', '/career-application/google.html',
  '/career-application/instagram.html', '/career-application/linkedin.html',
  '/career-application/index.html', '/career-application/spreadsheet.html',
]);
const staticSites = [
  '/career-application', '/port', '/flux-website', '/prism-studio', '/tool-deck',
  '/tunnel', '/mods', '/cargoledger', '/wifi-master', '/coneic', '/assets',
];
const isWithin = (pathname, prefix) => pathname === prefix || pathname.startsWith(prefix + '/');

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.bluecloudai.online') {
      url.hostname = 'bluecloudai.online';
      return Response.redirect(url, 301);
    }
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { return new Response('Invalid path', { status: 400 }); }
    if (careerRedirects.has(pathname.toLowerCase())) {
      url.pathname = '/career-application/interview.html';
      return Response.redirect(url, 301);
    }
    async function asset(name) {
      const target = new URL(request.url);
      target.pathname = name;
      return env.ASSETS.fetch(new Request(target, request));
    }
    const exact = assetPaths[pathname.toLowerCase()];
    if (exact) return asset(exact);
    if (pathname === '/coneic/privacy' || pathname === '/coneic/installer-codes') return asset(pathname + '.html');
    const directory = assetPaths[(pathname.replace(/\/$/, '') + '/index.html').toLowerCase()];
    if (directory) return asset(directory);
    if (isWithin(pathname, '/quranly')) {
      if (['/quranly/assets', '/quranly/reciters', '/quranly/nature', '/quranly/icons'].some(p => isWithin(pathname, p))) return new Response('Not found', { status: 404 });
      return asset('/quranly/index.html');
    }
    if (staticSites.some(p => isWithin(pathname, p)) || /\.[a-z0-9]+$/i.test(pathname)) return new Response('Not found', { status: 404 });
    return asset('/index.html');
  },
};
