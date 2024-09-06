const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let electronWindow;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    mainWindow.loadURL('http://localhost:3100'); // URL вашего React-приложения
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('open-electron-window', (event, arg) => {
    if (!electronWindow) {
        electronWindow = new BrowserWindow({
            width: 500,
            height: 400,
        });

        electronWindow.loadURL('http://localhost:3100/electron-page'); // URL для новой страницы в React

        electronWindow.on('closed', () => {
            electronWindow = null; // Обнуляем переменную после закрытия окна
        });
    } else {
        electronWindow.focus(); // Фокусируемся на уже открытом окне
    }
});
