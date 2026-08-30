const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('chromePro', {
  version: '0.3.0',
  getAppInfo: () => ipcRenderer.invoke('app:info'),
  open: (url) => ipcRenderer.invoke('browser:open', url),
  newProfile: (name) => ipcRenderer.invoke('browser:new-profile', name),
  getHistory: () => ipcRenderer.invoke('browser:history'),
  getTabs: () => ipcRenderer.invoke('browser:tabs'),
  clearSiteData: () => ipcRenderer.invoke('browser:clear-data'),
  openExternal: (url) => ipcRenderer.invoke('browser:external', url)
});
