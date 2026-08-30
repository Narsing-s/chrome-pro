const { app, BrowserWindow, BrowserView, session, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const START_URL = process.env.CHROME_PRO_START_URL || 'https://chrome-pro.vercel.app';
const windows = new Map(); let activeWindow = null;
const dataFile = () => path.join(app.getPath('userData'), 'browser-data.json');
let data = { bookmarks: [], history: [] };
function loadData(){ try { data = JSON.parse(fs.readFileSync(dataFile(),'utf8')); } catch {} }
function saveData(){ try { fs.writeFileSync(dataFile(), JSON.stringify(data,null,2)); } catch {} }
const profilePath = name => path.join(app.getPath('userData'),'profiles',name);
function normalizeUrl(input){ const v=String(input||'').trim(); if(!v)return START_URL; try{return new URL(v).href}catch{} if(/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(v))return `https://${v}`; return `https://www.google.com/search?q=${encodeURIComponent(v)}`; }
function createWindow(profile='default', incognito=false){
  const ses=incognito?session.fromPartition(`incognito-${Date.now()}-${Math.random()}`):session.fromPath(profilePath(profile),{cache:true});
  const win=new BrowserWindow({width:1440,height:900,minWidth:1000,minHeight:650,title:incognito?'Chrome Pro — Incognito':'Chrome Pro',backgroundColor:'#f8fafc'});
  const state={profile,incognito,session:ses,tabs:[],active:0}; windows.set(win.id,state); activeWindow=win;
  const addTab=(url=START_URL)=>{ const view=new BrowserView({webPreferences:{session:ses,contextIsolation:true,sandbox:true,nodeIntegration:false}}); state.tabs.push(view);state.active=state.tabs.length-1;win.setBrowserView(view);const b=win.getContentBounds();view.setBounds({x:0,y:0,width:b.width,height:b.height});view.setAutoResize({width:true,height:true});view.webContents.loadURL(normalizeUrl(url));view.webContents.on('did-navigate',(_e,u)=>{if(!incognito){data.history.unshift({url:u,time:Date.now()});data.history=data.history.slice(0,500);saveData();}});view.webContents.on('page-title-updated',(_e,t)=>win.setTitle(`${t||'New Tab'} — ${incognito?'Incognito — ':''}Chrome Pro`));return view;};
  state.addTab=addTab; addTab();
  win.on('resize',()=>{const v=state.tabs[state.active];if(v){const b=win.getContentBounds();v.setBounds({x:0,y:0,width:b.width,height:b.height});}});
  win.on('closed',()=>{state.tabs.forEach(v=>{if(!v.webContents.isDestroyed())v.webContents.destroy()});windows.delete(win.id);if(activeWindow===win)activeWindow=BrowserWindow.getAllWindows()[0]||null;}); return win;
}
function activeState(){return windows.get(activeWindow?.id)}
function closeTab(index){const s=activeState();if(!s)return;const v=s.tabs[index??s.active];if(!v)return;if(!v.webContents.isDestroyed())v.webContents.destroy();s.tabs.splice(index??s.active,1);if(!s.tabs.length)s.addTab();else{s.active=Math.min(index??s.active,s.tabs.length-1);activeWindow.setBrowserView(s.tabs[s.active]);}}
app.whenReady().then(()=>{
  loadData();
  ipcMain.handle('app:info',()=>({name:app.getName(),version:app.getVersion(),platform:process.platform,arch:process.arch}));
  ipcMain.handle('browser:open',(_e,url)=>activeState()?.addTab(url));
  ipcMain.handle('browser:new-tab',()=>activeState()?.addTab());
  ipcMain.handle('browser:close-tab',(_e,i)=>closeTab(i));
  ipcMain.handle('browser:switch-tab',(_e,i)=>{const s=activeState();if(s?.tabs[i]){s.active=i;activeWindow.setBrowserView(s.tabs[i]);return true}return false});
  ipcMain.handle('browser:new-profile',(_e,name)=>createWindow(String(name||'profile').replace(/[^a-z0-9_-]/gi,'_')).id);
  ipcMain.handle('browser:incognito',()=>createWindow('incognito',true).id);
  ipcMain.handle('browser:tabs',()=>{const s=activeState();return s?{active:s.active,count:s.tabs.length,profile:s.profile,incognito:s.incognito,tabs:s.tabs.map(v=>({title:v.webContents.getTitle(),url:v.webContents.getURL()}))}:{active:0,count:0};});
  ipcMain.handle('browser:history',()=>data.history);
  ipcMain.handle('browser:bookmarks',()=>data.bookmarks);
  ipcMain.handle('browser:add-bookmark',(_e,b)=>{if(b?.url){data.bookmarks.unshift({title:String(b.title||b.url),url:String(b.url),time:Date.now()});saveData()}return data.bookmarks});
  ipcMain.handle('browser:remove-bookmark',(_e,url)=>{data.bookmarks=data.bookmarks.filter(x=>x.url!==url);saveData();return data.bookmarks});
  ipcMain.handle('browser:downloads',()=>app.getPath('downloads'));
  ipcMain.handle('browser:clear-data',async()=>{const s=activeState();if(s&&!s.incognito){await s.session.clearCache();await s.session.clearStorageData()}return true});
  ipcMain.handle('browser:external',async(_e,url)=>{if(typeof url==='string'&&/^https?:/i.test(url))await shell.openExternal(url);return true});
  Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'Chrome Pro',submenu:[{role:'about'},{role:'quit'}]},{label:'Browser',submenu:[{label:'New Tab',accelerator:'CmdOrCtrl+T',click:()=>activeState()?.addTab()},{label:'New Incognito Window',accelerator:'CmdOrCtrl+Shift+N',click:()=>createWindow('incognito',true)},{label:'New Profile',accelerator:'CmdOrCtrl+Shift+P',click:()=>createWindow(`profile-${Date.now()}`)},{type:'separator'},{role:'reload'},{role:'toggledevtools'}]}]));
  session.defaultSession.setPermissionRequestHandler((_wc,p,cb)=>cb(['notifications','fullscreen','media'].includes(p)));
  createWindow(); app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)createWindow()});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});