// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {};

contextBridge.exposeInMainWorld('api', electronHandler);

export type ElectronHandler = typeof electronHandler;
