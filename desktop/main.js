const { app, BrowserWindow, BrowserView, session, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const START_URL = process.env.CHROME_PRO_START_URL || 'https://www.google.com';
const UI_HEIGHT = 112;
const windows = new Map();
let activeWindow = null;

const dataFile = () => path.join(app.getPath('userData'), 'browser-data.json');
let data = { bookmarks: [], history: [] };

function loadData() {
  try {
    data = JSON.parse(fs.readFileSync(dataFile(), 'utf8'));
  } catch (_) {}
}

function saveData() {
  try {
    fs.mkdirSync(path.dirname(dataFile()), { recursive: true });
    fs.writeFileSync(dataFile(), JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

const profilePath = (name) => path.join(app.getPath('userData'), 'profiles', name);

function normalizeUrl(input) {
  const value = String(input || '').trim();
  if (!value) return START_URL;

  try {
    return new URL(value).href;
  } catch (_) {}

  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) {
    return `https://${value}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
}

function alive(view) {
  return !!(view && view.webContents && !view.webContents.isDestroyed());
}

function layout(win, state) {
  const bounds = win.getContentBounds();

  if (alive(state.chrome)) {
    state.chrome.setBounds({
      x: 0,
      y: 0,
      width: bounds.width,
      height: UI_HEIGHT
    });
  }

  const view = state.tabs[state.active];
  if (alive(view)) {
    view.setBounds({
      x: 0,
      y: UI_HEIGHT,
      width: bounds.width,
      height: Math.max(0, bounds.height - UI_HEIGHT)
    });
  }
}

function stateTabs(state) {
  return state.tabs.filter(alive).map((view) => ({
    title: view.webContents.getTitle() || 'New Tab',
    url: view.webContents.getURL(),
    loading: view.webContents.isLoading()
  }));
}

function sendState(state) {
  if (alive(state.chrome)) {
    state.chrome.webContents.send('browser:state', {
      active: state.active,
      profile: state.profile,
      incognito: state.incognito,
      tabs: stateTabs(state)
    });
  }
}

function createWindow(profile = 'default', incognito = false) {
  const ses = incognito
    ? session.fromPartition(`incognito-${Date.now()}-${Math.random()}`)
    : session.fromPath(profilePath(profile), { cache: true });

  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    title: incognito ? 'Chrome Pro — Incognito' : 'Chrome Pro',
    backgroundColor: '#202124',
    autoHideMenuBar: true
  });

  const state = {
    profile,
    incognito,
    session: ses,
    tabs: [],
    active: 0,
    chrome: null,
    addTab: null
  };

  windows.set(win.id, state);
  activeWindow = win;

  const addTab = (url = START_URL) => {
    const view = new BrowserView({
      webPreferences: {
        session: ses,
        contextIsolation: true,
        sandbox: true,
        nodeIntegration: false
      }
    });

    state.tabs.push(view);
    state.active = state.tabs.length - 1;
    win.setBrowserView(view);

    view.webContents.loadURL(normalizeUrl(url));

    view.webContents.on('did-navigate', (_event, navigatedUrl) => {
      if (!incognito) {
        data.history.unshift({ url: navigatedUrl, time: Date.now() });
        data.history = data.history.slice(0, 500);
        saveData();
      }
      sendState(state);
    });

    ['did-start-loading', 'did-stop-loading', 'page-title-updated', 'did-fail-load']
      .forEach((eventName) => view.webContents.on(eventName, () => sendState(state)));

    layout(win, state);
    sendState(state);
    return view;
  };

  state.addTab = addTab;

  const chrome = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  state.chrome = chrome;
  win.setBrowserView(chrome);
  chrome.webContents.loadFile(path.join(__dirname, 'browser-ui.html'));
  chrome.webContents.once('did-finish-load', () => {
    layout(win, state);
    sendState(state);
  });

  addTab();

  win.on('resize', () => layout(win, state));
  win.on('focus', () => { activeWindow = win; });
  win.on('closed', () => {
    state.tabs.forEach((view) => {
      if (alive(view)) view.webContents.destroy();
    });
    if (alive(chrome)) chrome.webContents.destroy();
    windows.delete(win.id);
    if (activeWindow === win) {
      activeWindow = BrowserWindow.getAllWindows()[0] || null;
    }
  });

  return win;
}

function state() {
  return windows.get(activeWindow?.id);
}

function activeTab() {
  const currentState = state();
  return currentState?.tabs[currentState.active];
}

app.whenReady()
  .then(() => {
    loadData();

    ipcMain.handle('app:info', () => ({
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch
    }));

    ipcMain.handle('window:minimize', () => activeWindow?.minimize());

    ipcMain.handle('window:maximize', () => {
      if (!activeWindow) return false;
      if (activeWindow.isMaximized()) {
        activeWindow.unmaximize();
      } else {
        activeWindow.maximize();
      }
      return activeWindow.isMaximized();
    });

    ipcMain.handle('window:close', () => activeWindow?.close());
    ipcMain.handle('browser:open', (_event, url) => state()?.addTab(url));
    ipcMain.handle('browser:new-tab', () => state()?.addTab());

    ipcMain.handle('browser:close-tab', (_event, index) => {
      const currentState = state();
      const tabIndex = index ?? currentState?.active;
      if (!currentState?.tabs[tabIndex]) return false;

      const view = currentState.tabs[tabIndex];
      if (alive(view)) view.webContents.destroy();
      currentState.tabs.splice(tabIndex, 1);

      if (!currentState.tabs.length) {
        currentState.addTab();
      } else {
        currentState.active = Math.min(tabIndex, currentState.tabs.length - 1);
        activeWindow.setBrowserView(currentState.tabs[currentState.active]);
        layout(activeWindow, currentState);
        sendState(currentState);
      }
      return true;
    });

    ipcMain.handle('browser:switch-tab', (_event, index) => {
      const currentState = state();
      if (!currentState?.tabs[index]) return false;
      currentState.active = index;
      activeWindow.setBrowserView(currentState.tabs[index]);
      layout(activeWindow, currentState);
      sendState(currentState);
      return true;
    });

    ipcMain.handle('browser:navigate', (_event, url) => {
      const tab = activeTab();
      return tab?.webContents.loadURL(normalizeUrl(url));
    });

    ipcMain.handle('browser:back', () => {
      const tab = activeTab();
      return tab && tab.webContents.canGoBack() ? tab.webContents.goBack() : false;
    });

    ipcMain.handle('browser:forward', () => {
      const tab = activeTab();
      return tab && tab.webContents.canGoForward() ? tab.webContents.goForward() : false;
    });

    ipcMain.handle('browser:reload', () => activeTab()?.webContents.reload());

    ipcMain.handle('browser:new-profile', (_event, name) => {
      const safeName = String(name || 'profile').replace(/[^a-z0-9_-]/gi, '_');
      return createWindow(safeName).id;
    });

    ipcMain.handle('browser:incognito', () => createWindow('incognito', true).id);

    ipcMain.handle('browser:tabs', () => {
      const currentState = state();
      return currentState
        ? {
            active: currentState.active,
            profile: currentState.profile,
            incognito: currentState.incognito,
            tabs: stateTabs(currentState)
          }
        : { active: 0, tabs: [] };
    });

    ipcMain.handle('browser:history', () => data.history);
    ipcMain.handle('browser:bookmarks', () => data.bookmarks);

    ipcMain.handle('browser:add-bookmark', (_event, bookmark) => {
      if (bookmark?.url && !data.bookmarks.some((item) => item.url === bookmark.url)) {
        data.bookmarks.unshift({
          title: String(bookmark.title || bookmark.url),
          url: String(bookmark.url),
          time: Date.now()
        });
        saveData();
      }
      return data.bookmarks;
    });

    ipcMain.handle('browser:remove-bookmark', (_event, url) => {
      data.bookmarks = data.bookmarks.filter((item) => item.url !== url);
      saveData();
      return data.bookmarks;
    });

    ipcMain.handle('browser:downloads', () => app.getPath('downloads'));

    ipcMain.handle('browser:clear-data', async () => {
      const currentState = state();
      if (currentState && !currentState.incognito) {
        await currentState.session.clearCache();
        await currentState.session.clearStorageData();
      }
      return true;
    });

    ipcMain.handle('browser:external', async (_event, url) => {
      if (typeof url === 'string' && /^https?:/i.test(url)) {
        await shell.openExternal(url);
      }
      return true;
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: 'Chrome Pro',
        submenu: [
          { role: 'about' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Browser',
        submenu: [
          {
            label: 'New Tab',
            accelerator: 'CmdOrCtrl+T',
            click: () => state()?.addTab()
          },
          {
            label: 'New Incognito Window',
            accelerator: 'CmdOrCtrl+Shift+N',
            click: () => createWindow('incognito', true)
          },
          {
            label: 'New Profile',
            accelerator: 'CmdOrCtrl+Shift+P',
            click: () => createWindow(`profile-${Date.now()}`)
          },
          { type: 'separator' },
          { role: 'reload' },
          { role: 'toggledevtools' }
        ]
      }
    ]));

    session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
      callback(['notifications', 'fullscreen', 'media'].includes(permission));
    });

    createWindow();

    app.on('activate', () => {
      if (!BrowserWindow.getAllWindows().length) createWindow();
    });
  })
  .catch((error) => {
    console.error('Chrome Pro startup failed:', error);
    app.quit();
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
