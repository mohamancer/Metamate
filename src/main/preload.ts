// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

type Message = {
  role: string;
  content: string;
};

const electronHandler = {
  sendChatAndGetResponse: async (
    context: Message[],
  ): Promise<string | null> => {
    return ipcRenderer.invoke('sendChatAndGetResponse', context);
  },
  setOpenAiKey: (key: string): void => {
    ipcRenderer.send('setOpenAiKey', key);
  },
  getData: async (): Promise<string[]> => {
    return ipcRenderer.invoke('getData');
  },
  setFacebookData: (
    appID: string,
    secret: string,
    accessToken: string,
  ): void => {
    ipcRenderer.send('setFacebookData', appID, secret, accessToken);
  },
  pageMap: (mapCallback: (event: IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on('pageMap', mapCallback);
  },
};
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
