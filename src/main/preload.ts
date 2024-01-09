// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { formData } from '../pages/Post';
import { PostResponse } from './PostUtil';

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
  removePageListener: () => {
    ipcRenderer.removeAllListeners('pageMap');
  },
  postForms: async (forms: formData[]): Promise<PostResponse[]> => {
    return ipcRenderer.invoke('postForms', forms);
  },
};
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
