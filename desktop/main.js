const { app, BrowserWindow, BrowserView, session, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const START_URL = process.env.CHROME_PRO_START_URL || 'https://www.google.com';
const SEARCH_URL = process.env.CHROME_PRO_SEARCH_URL || 'https://www.google.com/search?q=';
const UI_HEIGHT = 104;
const NAV_TIMEOUT_MS = 20000;
const windows = new Map();
let activeWindow = null;

const dataFile = () => path.join(app.getPath('userData'), 'browser-data.json');
let data = { bookmarks: [], history: [] };

function loadData() { try { data = JSON.parse(fs.readFileSync(dataFile(), 'utf8')); } catch (_) {} }
function saveData() { try { fs.mkdirSync(path.dirname(dataFile()), { recursive: true }); fs.writeFileSync(dataFile(), JSON.stringify(data, null, 2)); } catch (e) { console.error(e); } }
const profilePath = n => path.join(app.getPath('userData'), 'profiles', n);

function normalizeUrl(input) {
  const v = String(input || '').trim();
  if (!v) return START_URL;
  try { return new URL(v).href; } catch (_) {}
  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(v)) return `https://${v}`;
  return `${SEARCH_URL}${encodeURIComponent(v)}`;
}
function alive(v) { return !!(v && v.webContents && !v.webContents.isDestroyed()); }
function navigationHistory(t) { return alive(t) ? t.webContents.navigationHistory : null; }
function canGoBack(t) { const h = navigationHistory(t); return !!(h && h.canGoBack()); }
function canGoForward(t) { const h = navigationHistory(t); return !!(h && h.canGoForward()); }
function layout(w, s) {
  const b = w.getContentBounds();
  if (alive(s.chrome)) s.chrome.setBounds({ x: 0, y: 0, width: b.width, height: UI_HEIGHT });
  const v = s.tabs[s.active];
  if (alive(v)) v.setBounds({ x: 0, y: UI_HEIGHT, width: b.width, height: Math.max(0, b.height - UI_HEIGHT) });
}
function stateTabs(s) {
  return s.tabs.filter(alive).map(v => ({ title: v.webContents.getTitle() || 'New Tab', url: v.webContents.getURL(), loading: v.webContents.isLoading(), canGoBack: canGoBack(v), canGoForward: canGoForward(v) }));
}
function sendState(s) {
  if (alive(s.chrome)) s.chrome.webContents.send('browser:state', { active: s.active, profile: s.profile, incognito: s.incognito, tabs: stateTabs(s) });
}
function createWindow(profile = 'default', incognito = false) {
  const ses = incognito ? session.fromPartition(`incognito-${Date.now()}-${Math.random()}`) : session.fromPath(profilePath(profile), { cache: true });
  const win = new BrowserWindow({ width: 1440, height: 900, minWidth: 1000, minHeight: 650, title: incognito ? 'Chrome Pro — Incognito' : 'Chrome Pro', backgroundColor: '#202124', autoHideMenuBar: true });
  const s = { profile, incognito, session: ses, tabs: [], active: 0, chrome: null };
  windows.set(win.id, s); activeWindow = win;

  const addTab = (u = START_URL) => {
    const v = new BrowserView({ webPreferences: { session: ses, contextIsolation: true, sandbox: true, nodeIntegration: false } });
    s.tabs.push(v); s.active = s.tabs.length - 1; win.setBrowserView(v);
    const url = normalizeUrl(u);
    v.webContents.loadURL(url).catch(error => console.warn('Chrome Pro navigation failed:', error.code || error.message, url));
    v.webContents.on('did-navigate', (_e, n) => { if (!incognito) { data.history.unshift({ url: n, time: Date.now() }); data.history = data.history.slice(0, 500); saveData(); } sendState(s); });
    ['did-start-loading', 'did-stop-loading', 'page-title-updated', 'did-fail-load', 'did-navigate-in-page'].forEach(e => v.webContents.on(e, () => sendState(s)));
    v.webContents.on('did-fail-load', (_e, code, description, failedUrl, isMainFrame) => { if (isMainFrame) console.warn(`Chrome Pro load failed (${code}): ${description}`, failedUrl); });
    layout(win, s); sendState(s); return v;
  };
  s.addTab = addTab;

  const chrome = new BrowserView({ webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  s.chrome = chrome; win.setBrowserView(chrome); chrome.webContents.loadFile(path.join(__dirname, 'browser-ui.html'));
  chrome.webContents.once('did-finish-load', () => { layout(win, s); sendState(s); });
  addTab();
  win.on('resize', () => layout(win, s)); win.on('focus', () => { activeWindow = win; sendState(s); });
  win.on('closed', () => { s.tabs.forEach(v => { if (alive(v)) v.webContents.destroy(); }); if (alive(chrome)) chrome.webContents.destroy(); windows.delete(win.id); if (activeWindow === win) activeWindow = BrowserWindow.getAllWindows()[0] || null; });
  return win;
}
function state() { return windows.get(activeWindow?.id); }
function activeTab() { const s = state(); return s?.tabs[s.active]; }

app.whenReady().then(() => {
  loadData();
  ipcMain.handle('app:info', () => ({ name: app.getName(), version: app.getVersion(), platform: process.platform, arch: process.arch }));
  ipcMain.handle('window:minimize', () => activeWindow?.minimize());
  ipcMain.handle('window:maximize', () => { if (!activeWindow) return false; activeWindow.isMaximized() ? activeWindow.unmaximize() : activeWindow.maximize(); return activeWindow.isMaximized(); });
  ipcMain.handle('window:close', () => activeWindow?.close());
  ipcMain.handle('browser:open', (_e, u) => state()?.addTab(u));
  ipcMain.handle('browser:new-tab', () => state()?.addTab());
  ipcMain.handle('browser:close-tab', (_e, i) => { const s = state(), n = i ?? s?.active; if (!s?.tabs[n]) return false; const v = s.tabs[n]; if (alive(v)) v.webContents.destroy(); s.tabs.splice(n, 1); if (!s.tabs.length) s.addTab(); else { s.active = Math.min(n, s.tabs.length - 1); activeWindow.setBrowserView(s.tabs[s.active]); layout(activeWindow, s); sendState(s); } return true; });
  ipcMain.handle('browser:switch-tab', (_e, i) => { const s = state(); if (!s?.tabs[i]) return false; s.active = i; activeWindow.setBrowserView(s.tabs[i]); layout(activeWindow, s); sendState(s); return true; });
  ipcMain.handle('browser:navigate', async (_e, u) => { const t = activeTab(); if (!t) return false; const url = normalizeUrl(u); try { await t.webContents.loadURL(url, { timeout: NAV_TIMEOUT_MS }); return true; } catch (error) { console.warn('Chrome Pro navigation failed:', error.code || error.message, url); return false; } });
  ipcMain.handle('browser:back', () => { const t = activeTab(); return t && canGoBack(t) ? t.webContents.navigationHistory.goBack() : false; });
  ipcMain.handle('browser:forward', () => { const t = activeTab(); return t && canGoForward(t) ? t.webContents.navigationHistory.goForward() : false; });
  ipcMain.handle('browser:reload', () => activeTab()?.webContents.reload());
  ipcMain.handle('browser:new-profile', (_e, n) => createWindow(String(n || 'profile').replace(/[^a-z0-9_-]/gi, '_')).id);
  ipcMain.handle('browser:incognito', () => createWindow('incognito', true).id);
  ipcMain.handle('browser:tabs', () => { const s = state(); return s ? { active: s.active, profile: s.profile, incognito: s.incognito, tabs: stateTabs(s) } : { active: 0, tabs: [] }; });
  ipcMain.handle('browser:history', () => data.history);
  ipcMain.handle('browser:bookmarks', () => data.bookmarks);
  ipcMain.handle('browser:add-bookmark', (_e, b) => { if (b?.url && !data.bookmarks.some(x => x.url === b.url)) { data.bookmarks.unshift({ title: String(b.title || b.url), url: String(b.url), time: Date.now() }); saveData(); } return data.bookmarks; });
  ipcMain.handle('browser:remove-bookmark', (_e, u) => { data.bookmarks = data.bookmarks.filter(x => x.url !== u); saveData(); return data.bookmarks; });
  ipcMain.handle('browser:downloads', () => app.getPath('downloads'));
  ipcMain.handle('browser:clear-data', async () => { const s = state(); if (s && !s.incognito) { await s.session.clearCache(); await s.session.clearStorageData(); } return true; });
  ipcMain.handle('browser:external', async (_e, u) => { if (typeof u === 'string' && /^https?:/i.test(u)) await shell.openExternal(u); return true; });
  Menu.setApplicationMenu(Menu.buildFromTemplate([{ label: 'Chrome Pro', submenu: [{ role: 'about' }, { role: 'quit' }] }, { label: 'Browser', submenu: [{ label: 'New Tab', accelerator: 'CmdOrCtrl+T', click: () => state()?.addTab() }, { label: 'New Incognito Window', accelerator: 'CmdOrCtrl+Shift+N', click: () => createWindow('incognito', true) }, { label: 'New Profile', accelerator: 'CmdOrCtrl+Shift+P', click: () => createWindow(`profile-${Date.now()}`) }, { type: 'separator' }, { role: 'reload' }, { role: 'toggledevtools' }] }]));
  session.defaultSession.setPermissionRequestHandler((_wc, p, cb) => cb(['notifications', 'fullscreen', 'media'].includes(p)));
  createWindow();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
}).catch(e => { console.error('Chrome Pro startup failed:', e); app.quit(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
