const {app, BrowserWindow, ipcMain, Notification, ipcRenderer, Tray, Menu, shell} = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

const mouseEvents = require('global-mouse-events');
const { electron } = require('process');
const fs = require('fs');

const Store = require('electron-store');

const store = new Store();

const isDev = !app.isPackaged;

var iconpath = path.join(__dirname, 'icon.png');

var win;
function createWindow(){
    win = new BrowserWindow({
        width: 400,
        height: 600,
        resizable: false,
        acceptFirstMouse: true,
        frame:false,
        transparent:true,
        hasShadow: true,
        webPreferences:{
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    
    var appIcon = new Tray(iconpath);
    win.loadFile('index.html');
    mouseEvents.on('mousedown', (e)=>{
      win.webContents.send('mouseclick', 'click');
    })
    win.setBackgroundColor('#00000000')



    app.on('quit', (e)=>{
        if(runOnStartup.checked){
            app.setLoginItemSettings({
                openAtLogin: true
            })
            
            
        }else{
            app.setLoginItemSettings({
                openAtLogin: false
            })

        }
        store.set('startup', runOnStartup.checked);
    })
        

    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show Clicket', click: function(){
                win.show()
            }
        },
        {
            label: 'Quit Clicket', click: function(){
                app.quit();
            }
        },
        {
            type: 'checkbox',
            checked:store.get('startup'),
            id:"runonstartup",
            label: "Run on startup", click: function(){}
            
        }
    ])

    appIcon.setContextMenu(contextMenu)

    var runOnStartup = contextMenu.getMenuItemById('runonstartup')

   

    appIcon.on('click', ()=>{
        win.show();
    })

    ipcMain.on('hide', (e,message)=>{
        win.hide();
    })

    ipcMain.on('getFiles', (e,message)=>{
        var files = getDirectories('./sounds')
        e.sender.send('gotFiles', files);
    })

    ipcMain.on('saveToStore', (e, message)=>{
        store.set(message[0], message[1])
    })

    ipcMain.on('getFromStore', (e, message)=>{
        var value = store.get(message);
        switch(message){
            case 'volume':
                e.sender.send('gotVolume', value);
                break;
            case 'select':
                e.sender.send('gotSelect', value);
        }
    })
    ipcMain.on('openExternal', (e, message)=>{
        shell.openExternal(message)
    })

    
}

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path+'/'+file).isDirectory();
    });
  }
  

if(isDev) {
    require('electron-reload')(__dirname, { 
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    })
    
}


ipcMain.on('exit', (e, message)=>{
    app.exit();
})





app.whenReady().then(createWindow);