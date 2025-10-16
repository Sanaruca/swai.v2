import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  platform: process.platform,
  checkInternet: () => ipcRenderer.invoke('check-internet'),
  checkDisk: () => ipcRenderer.invoke('check-disk'),
  checkRAM: () => ipcRenderer.invoke('check-ram'),
  checkWindows: () => ipcRenderer.invoke('check-windows'),
  checkPostgres: () => ipcRenderer.invoke('check-postgres'),
  checkBun: () => ipcRenderer.invoke('check-bun'),
  checkNode: () => ipcRenderer.invoke('check-node'),
  runBunInstall: () => ipcRenderer.invoke('run-bun-install'),
  runPrismaPush: () => ipcRenderer.invoke('run-prisma-push'),
  runNxBuild: () => ipcRenderer.invoke('run-nx-build'),
  checkWorkspace: () => ipcRenderer.invoke('check-workspace'),
  runFinishInstall: () => ipcRenderer.invoke('run-finish-install'),
  runDatabaseSeed: (user: string, pass: string) =>
    ipcRenderer.invoke('run-database-seed', user, pass),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  quit: () => ipcRenderer.invoke('quit'),
});
