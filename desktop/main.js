const { app, BrowserWindow, BrowserView, session, ipcMain, shell, Menu } = require('electron');
const path = require('path');

const START_URL = process.env.CHROME_PRO_START_URL || 'https://chrome-pro.vercel.app';
const windows = new Map();
let activeWindow = null;

const profilePath = name => path.join(app.getPath('userData'), 'profiles', name);

function normalizeUrl(input) {
  const value = String(input || '').trim();
  if (!value) return START_URL;
  try { return new URL(value).href; } catch {}
  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) return `https://${value}`;
  return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
}

function createWindow(profile = 'default') {
  const ses = session.fromPath(profilePath(profile), { cache: true });
  const win = new BrowserWindow({ width: 1440, height: 900, minWidth: 1000, minHeight: 650, title: 'Chrome Pro', backgroundColor: '#f8fafc' });
  const state = { profile, session: ses, tabs: [], active: 0, history: [] };
  windows.set(win.id, state);
  activeWindow = win;

  const addTab = (url = START_URL) => {
    const view = new BrowserView({ webPreferences: { session: ses, contextIsolation: true, sandbox: true, nodeIntegration: false } });
    state.tabs.push(view); state.active = state.tabs.length - 1; win.setBrowserView(view);
    const b = win.getContentBounds(); view.setBounds({ x: 0, y: 0, width: b.width, height: b.height }); view.setAutoResize({ width: true, height: true });
    view.webContents.loadURL(normalizeUrl(url));
    view.webContents.on('did-navigate', (_e, navigated) => state.history.push({ url: navigated, time: Date.now() }));
    view.webContents.on('did-navigate-in-page', (_e, navigated) => state.history.push({ url: navigated, time: Date.now() }));
    view.webContents.on('page-title-updated', (_e, title) => win.setTitle(`${title || 'New Tab'} — Chrome Pro`));
    return view;
  };
  state.addTab = addTab;
  addTab();

  win.on('resize', () => { const v = state.tabs[state.active]; if (v) { const b = win.getContentBounds(); v.setBounds({ x: 0, y: 0, width: b.width, height: b.height }); } });
  win.on('closed', () => { state.tabs.forEach(v => v.webContents.destroy()); windows.delete(win.id); if (activeWindow === win) activeWindow = BrowserWindow.getAllWindows()[0] || null; });
  return win;
}

function closeTab(win, index = windows.get(win.id)?.active) {
  const state = windows.get(win.id); if (!state || !state.tabs[index]) return;
  state.tabs[index].webContents.destroy(); state.tabs.splice(index, 1);
  if (!state.tabs.length) state.addTab(); else { state.active = Math.min(index, state.tabs.length - 1); win.setBrowserView(state.tabs[state.active]); }
}

app.whenReady().then(() => {
  ipcMain.handle('app:info', () => ({ name: app.getName(), version: app.getVersion(), platform: process.platform, arch: process.arch }));
  ipcMain.handle('browser:open', (_e, url) => activeWindow && windows.get(activeWindow.id)?.addTab(url));
  ipcMain.handle('browser:new-profile', (_e, name) => createWindow(String(name || 'profile').replace(/[^a-z0-9_-]/gi, '_')).id);
  ipcMain.handle('browser:history', () => windows.get(activeWindow?.id)?.history || []);
  ipcMain.handle('browser:tabs', () => { const s = windows.get(activeWindow?.id); return s ? { active: s.active, count: s.tabs.length, profile: s.profile } : { active: 0, count: 0 }; });
  ipcMain.handle('browser:clear-data', async () => { const s = windows.get(activeWindow?.id); if (s) { await s.session.clearCache(); await s.session.clearStorageData(); } return true; });
  ipcMain.handle('browser:external', async (_e, url) => { if (typeof url === 'string' && /^https?:/i.test(url)) await shell.openExternal(url); return true; });

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'Chrome Pro', submenu: [{ role: 'about' }, { role: 'quit' }] },
    { label: 'Browser', submenu: [
      { label: 'New Tab', accelerator: 'CmdOrCtrl+T', click: () => windows.get(activeWindow?.id)?.addTab() },
      { label: 'New Profile', accelerator: 'CmdOrCtrl+Shift+P', click: () => createWindow(`profile-${Date.now()}`) },
      { type: 'separator' }, { role: 'reload' }, { role: 'toggledevtools' }
    ] }
  ]));

  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => callback(['notifications', 'fullscreen', 'media'].includes(permission)));
  createWindow();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
