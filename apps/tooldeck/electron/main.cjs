const { app, BrowserWindow, Menu, shell, session } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
app.setAppUserModelId('com.bluecloud.tooldeck');
const start = pathToFileURL(path.join(__dirname, '../dist/index.html')).href;
if (!app.requestSingleInstanceLock()) app.quit();
else app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1220, height: 850, minWidth: 780, minHeight: 600, backgroundColor: '#101715', webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true } });
  Menu.setApplicationMenu(null);
  session.defaultSession.setPermissionRequestHandler((_wc, permission, done) => done(permission === 'clipboard-sanitized-write'));
  session.defaultSession.webRequest.onHeadersReceived((details, done) => done({ responseHeaders: { ...details.responseHeaders, 'Content-Security-Policy': ["default-src 'self' file:; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; font-src 'self'; object-src 'none'; base-uri 'none'; frame-src 'none'"] } }));
  win.webContents.setWindowOpenHandler(({ url }) => { if (url.startsWith('https://bluecloudai.online/')) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (event, url) => { if (url.split('#')[0] !== start) event.preventDefault(); });
  win.webContents.on('will-attach-webview', event => event.preventDefault());
  win.loadURL(start);
  app.on('second-instance', () => { if (win.isMinimized()) win.restore(); win.focus(); });
});
app.on('window-all-closed', () => app.quit());
