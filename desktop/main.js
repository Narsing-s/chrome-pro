const { app, BrowserWindow, session, ipcMain, shell } = require('electron');
const path = require('path');

const START_URL = process.env.CHROME_PRO_START_URL || 'https://chrome-pro.vercel.app';

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 1000, minHeight: 650,
    title: 'Chrome Pro', backgroundColor: '#f8fafc',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, sandbox: true, nodeIntegration: false, spellcheck: true
    }
  });

  win.loadURL(START_URL);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (!/^https?:/i.test(url) && !url.startsWith('file:')) event.preventDefault();
  });

  win.webContents.on('did-fail-load', (_event, code, description) => {
    if (!win.isDestroyed()) {
      const safe = String(description).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      win.loadURL(`data:text/html,<html><body style="font-family:system-ui;padding:40px"><h1>Chrome Pro</h1><p>Unable to load the start page.</p><p>${code}: ${safe}</p><button onclick="location.reload()">Retry</button></body></html>`);
    }
  });
}

app.whenReady().then(() => {
  ipcMain.handle('app:info', () => ({ name: app.getName(), version: app.getVersion(), platform: process.platform, arch: process.arch }));
  ipcMain.handle('browser:external', async (_event, url) => {
    if (typeof url === 'string' && /^https?:/i.test(url)) await shell.openExternal(url);
    return true;
  });
  ipcMain.handle('browser:clear-data', async () => {
    await session.defaultSession.clearStorageData({ storages: ['cookies', 'localstorage', 'serviceworkers', 'cachestorage'] });
    await session.defaultSession.clearCache();
    return true;
  });
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(['notifications', 'fullscreen'].includes(permission));
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
