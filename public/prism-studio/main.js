const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

function createWindow() {
  const iconFile = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  const iconPath = path.join(__dirname, iconFile);
  const appIcon = nativeImage.createFromPath(iconPath);

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 640,
    title: 'Prism Studio',
    icon: appIcon,
    backgroundColor: '#141418',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false         // allows Gemini API calls without CORS issues
    }
  });

  win.loadFile('index.html');
  win.setMenuBarVisibility(false);  // clean, no menu bar

  // Uncomment to open DevTools for debugging:
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
