const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('chromePro', {
  version:'0.5.0', getAppInfo:()=>ipcRenderer.invoke('app:info'), open:u=>ipcRenderer.invoke('browser:open',u), navigate:u=>ipcRenderer.invoke('browser:navigate',u),
  newTab:()=>ipcRenderer.invoke('browser:new-tab'), closeTab:i=>ipcRenderer.invoke('browser:close-tab',i), switchTab:i=>ipcRenderer.invoke('browser:switch-tab',i), back:()=>ipcRenderer.invoke('browser:back'), forward:()=>ipcRenderer.invoke('browser:forward'), reload:()=>ipcRenderer.invoke('browser:reload'),
  newProfile:n=>ipcRenderer.invoke('browser:new-profile',n), incognito:()=>ipcRenderer.invoke('browser:incognito'), tabs:()=>ipcRenderer.invoke('browser:tabs'), history:()=>ipcRenderer.invoke('browser:history'), bookmarks:()=>ipcRenderer.invoke('browser:bookmarks'),
  addBookmark:b=>ipcRenderer.invoke('browser:add-bookmark',b), removeBookmark:u=>ipcRenderer.invoke('browser:remove-bookmark',u), downloads:()=>ipcRenderer.invoke('browser:downloads'), clearSiteData:()=>ipcRenderer.invoke('browser:clear-data'), openExternal:u=>ipcRenderer.invoke('browser:external',u),
  onState:cb=>{const fn=(_e,s)=>cb(s);ipcRenderer.on('browser:state',fn);return()=>ipcRenderer.removeListener('browser:state',fn)}
});