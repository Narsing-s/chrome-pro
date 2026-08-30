const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('chromePro', {
  version: '0.2.0',
  getAppInfo: () => ipcRenderer.invoke('app:info'),
  openExternal: (url) => ipcRenderer.invoke('browser:external', url),
  clearSiteData: () => ipcRenderer.invoke('browser:clear-data')
});
