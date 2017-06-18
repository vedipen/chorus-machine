'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var configuration = require('./configuration');
var globalShortcut = require('global-shortcut');

var mainWindow = null;

app.on('ready', function() {
    
    if (!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift', 'space']);
    }
    
    mainWindow = new BrowserWindow({
        frame: false,
        height: 700,
        resizable: false,
        width: 368
    });

    mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
    setGlobalShortcuts(); 
});

var ipc = require('ipc');

ipc.on('close-main-window', function () {
    app.quit();
});

function setGlobalShortcuts() {
    globalShortcut.unregisterAll();
    
    var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
    var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';
    
    if(shortcutPrefix.search(/space/) !== -1) {
        shortcutPrefix = shortcutPrefix.replace(/space\+/,"");
        globalShortcut.register('space', function () {
            mainWindow.webContents.send('global-shortcut', (Math.floor((Math.random() * 2))));
        });
    }

    globalShortcut.register(shortcutPrefix + '1', function () {
        mainWindow.webContents.send('global-shortcut', 0);
    });
    
    globalShortcut.register(shortcutPrefix + '2', function () {
        mainWindow.webContents.send('global-shortcut', 1);
    });
}

var settingsWindow = null;

ipc.on('open-settings-window', function () {
    if (settingsWindow) {
        return;
    }

    settingsWindow = new BrowserWindow({
        frame: false,
        height: 250,
        resizable: false,
        width: 200
    });

    settingsWindow.loadUrl('file://' + __dirname + '/app/settings.html');

    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
});

ipc.on('close-settings-window', function () {
    if (settingsWindow) {
        settingsWindow.close();
    }
});

ipc.on('set-global-shortcuts', function () {
    setGlobalShortcuts();
});


var aboutWindow = null;

ipc.on('open-about-window', function () {
    if (aboutWindow) {
        return;
    }

    aboutWindow = new BrowserWindow({
        frame: false,
        height: 200,
        resizable: false,
        width: 200
    });

    aboutWindow.loadUrl('file://' + __dirname + '/app/about.html');

    aboutWindow.on('closed', function () {
        aboutWindow = null;
    });
});

ipc.on('close-about-window', function () {
    if (aboutWindow) {
        aboutWindow.close();
    }
});


