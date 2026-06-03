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

  // User-Agent Chrome ultra-propre et sans aucune mention d'Electron
  const customUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
  
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = customUserAgent;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  // LE SECRET : On force TOUTES les nouvelles fenêtres (comme le popup Google) à utiliser le même User-Agent masqué
  win.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        webPreferences: {
          userAgent: customUserAgent,
          contextIsolation: true,
          nodeIntegration: false
        }
      }
    };
  });

  const targetUrl = 'https://app.base44.com/apps/6a16a0457fe004b13fc8f502/editor/preview';
  win.loadURL(targetUrl);
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
