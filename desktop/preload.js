const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('chromePro', {
  version:'0.4.0', getAppInfo:()=>ipcRenderer.invoke('app:info'), open:u=>ipcRenderer.invoke('browser:open',u),
  newTab:()=>ipcRenderer.invoke('browser:new-tab'), closeTab:i=>ipcRenderer.invoke('browser:close-tab',i), switchTab:i=>ipcRenderer.invoke('browser:switch-tab',i),
  newProfile:n=>ipcRenderer.invoke('browser:new-profile',n), incognito:()=>ipcRenderer.invoke('browser:incognito'), tabs:()=>ipcRenderer.invoke('browser:tabs'),
  history:()=>ipcRenderer.invoke('browser:history'), bookmarks:()=>ipcRenderer.invoke('browser:bookmarks'), addBookmark:b=>ipcRenderer.invoke('browser:add-bookmark',b),
  removeBookmark:u=>ipcRenderer.invoke('browser:remove-bookmark',u), downloads:()=>ipcRenderer.invoke('browser:downloads'), clearSiteData:()=>ipcRenderer.invoke('browser:clear-data'),
  openExternal:u=>ipcRenderer.invoke('browser:external',u)
});