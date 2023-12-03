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
  setApiKey: (key: string): void => {
    ipcRenderer.send('setApiKey', key);
  },
  getApiKey: async (): Promise<string | null> => {
    return ipcRenderer.invoke('getApiKey');
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
