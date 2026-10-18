const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('bluecloud', {
  state:()=>ipcRenderer.invoke('state'), refresh:()=>ipcRenderer.invoke('refresh'),
  install:id=>ipcRenderer.invoke('install',id), launch:id=>ipcRenderer.invoke('launch',id),
  cancel:id=>ipcRenderer.invoke('cancel',id), uninstall:id=>ipcRenderer.invoke('uninstall',id),
  openLink:input=>ipcRenderer.invoke('openLink',input),
  onProgress:callback=>{const handler=(_event,data)=>callback(data);ipcRenderer.on('progress',handler);return()=>ipcRenderer.removeListener('progress',handler);},
});
