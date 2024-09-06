const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openElectronWindow: () => ipcRenderer.send('open-electron-window'),
});
