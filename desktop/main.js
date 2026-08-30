const { app, BrowserWindow, session } = require('electron');
const path = require('path');

const START_URL = process.env.CHROME_PRO_START_URL || 'https://chrome-pro.vercel.app';

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    title: 'Chrome Pro',
    backgroundColor: '#f8fafc',
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      spellcheck: true
    }
  });

  win.loadURL(START_URL);

  win.webContents.setWindowOpenHandler(({ url }) => {
    const child = new BrowserWindow({
      width: 1280,
      height: 800,
      webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false }
    });
    child.loadURL(url);
    return { action: 'deny' };
  });

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    if (!win.isDestroyed()) {
      win.loadURL(`data:text/html,<html><body style="font-family:system-ui;padding:40px"><h1>Chrome Pro</h1><p>Unable to load the start page.</p><p>${errorCode}: ${errorDescription}</p><button onclick="location.reload()">Retry</button></body></html>`);
    }
  });
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowed = ['notifications', 'fullscreen'].includes(permission);
    callback(allowed);
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
