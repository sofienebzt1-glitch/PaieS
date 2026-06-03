const { app, BrowserWindow, session } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "PayeTN",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  const customUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
  
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = customUserAgent;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  const targetUrl = 'https://base44.com';

  win.webContents.on('did-navigate', (event, url) => {
    if (url.includes('://base44.com') && !url.includes('editor') && !url.includes('login')) {
      win.loadURL(targetUrl);
    }
  });

  win.loadURL('https://://base44.com/login');
  win.setMenu(null);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
