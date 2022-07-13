const {ipcRenderer, contextBridge} = require('electron');
contextBridge.exposeInMainWorld("api",{
    send: (channel, data) => ipcRenderer.send(channel, data),
    recieve: (channel, func) => ipcRenderer.on(
        channel,
        (event, message) => func(message)
    ),

})