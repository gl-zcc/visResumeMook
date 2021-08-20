/* 

主入口

 */

const path = require('path');
const { app, ipcMain, BrowserWindow } = require('electron');

const ROOT_PATH = path.join(app.getAppPath(), '../');

// 👇 监听渲染进程发的消息并回复
ipcMain.on('get-root-path', (event, arg) => {
    event.reply('reply-root-path', ROOT_PATH);
});

function isDev() {
    // 👉 还记得我们配置中通过 webpack.DefinePlugin 定义的构建变量吗
    return process.env.NODE_ENV === 'development';
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            devTools: true,
            nodeIntegration: true // 注入 Node 模块
        }
    })

    if (isDev()) {
        // 👇 看到了吗，在开发环境下，我们加载的是运行在 7001 端口的 React
        mainWindow.loadURL(`http://127.0.0.1:7001`);
    } else {
        mainWindow.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);
    }
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})