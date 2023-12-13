/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { app, BrowserWindow, shell, ipcMain, session } from 'electron';
import OpenAI from 'openai';
import Store from 'electron-store';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const store = new Store();
let openai: OpenAI;

if (store.has('openAI_User_APIKey')) {
  const openAIKey = store.get('openAI_User_APIKey') as string;
  openai = new OpenAI({
    apiKey: openAIKey,
  });
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

/**
 * Add event listeners...
 */
async function performTaskAndSendResult() {
  try {
    const userAccessToken = store.get('accessToken', '');

    if (!userAccessToken) {
      return;
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=access_token,id,name&access_token=${userAccessToken}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // You can include other headers if needed
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    const pageMap: Record<
      string,
      { id: string; access_token: string; imageUrl?: string }
    > = {};

    // Iterate through each page in the response
    await Promise.all(
      responseData.data.map(
        async (page: { name: string; id: string; access_token: string }) => {
          try {
            // Make a request to get the page image
            const pageImageResponse = await fetch(
              `https://graph.facebook.com/v18.0/${page.id}?fields=picture&access_token=${page.access_token}`,
            );

            if (!pageImageResponse.ok) {
              throw new Error(
                `HTTP error! Status: ${pageImageResponse.status}`,
              );
            }

            // Extract the image URL from the response
            const pageImageURL = (await pageImageResponse.json()).picture.data
              .url;

            // Add the image URL to the pageMap
            pageMap[page.name] = {
              id: page.id,
              access_token: page.access_token,
              imageUrl: pageImageURL,
            };
          } catch (error) {
            console.error(
              `Error fetching image for page ${page.name}: `,
              error,
            );
          }
        },
      ),
    );

    // Send the pageMap to the renderer
    mainWindow?.webContents.send('pageMap', pageMap);
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
}

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    mainWindow?.webContents.once('did-finish-load', () => {
      performTaskAndSendResult();
      setInterval(performTaskAndSendResult, 3600000);
    });
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

ipcMain.handle('sendChatAndGetResponse', async (_, context) => {
  const content = {
    model: 'gpt-3.5-turbo',
    messages: context,
    temperature: 0.7,
  };
  try {
    const response = await openai.chat.completions.create(content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error sending chat and getting response:', error);
    return null;
  }
});

ipcMain.on('setOpenAiKey', (_, key) => {
  store.set('openAI_User_APIKey', key);
  openai = new OpenAI({
    apiKey: key,
  });
});
ipcMain.on('setFacebookData', (_, appID, secret, accessToken) => {
  store.set('facebookAppID', appID);
  store.set('facebookSecret', secret);
  store.set('accessToken', accessToken);
});
ipcMain.handle('getData', (): [string, string, string, string] => {
  return [
    store.get('openAI_User_APIKey', '') as string,
    store.get('facebookAppID', '') as string,
    store.get('facebookSecret', '') as string,
    store.get('accessToken', '') as string,
  ];
});
