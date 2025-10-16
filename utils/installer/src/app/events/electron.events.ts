/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

import { app, ipcMain, shell } from 'electron';
import { environment } from '../../environments/environment';
import {
  checkWorkspace,
  runBunInstall,
  runDatabaseSeed,
  runFinishInstall,
  runNxBuild,
  runPrismaPush,
} from './command-runner';

import { exec } from 'child_process';
import { lookup } from 'dns';
import { platform, release, totalmem } from 'os';

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

// Retrieve app version
ipcMain.handle('get-app-version', (event) => {
  console.log(`Fetching application version... [v${environment.version}]`);

  return environment.version;
});
ipcMain.handle('check-internet', async () => await checkInternet());
ipcMain.handle('check-disk', async () => await checkDiskSpace());
ipcMain.handle('check-ram', () => checkRAM());
ipcMain.handle('check-windows', () => checkWindowsVersion());
ipcMain.handle('check-postgres', async () => await checkPostgres());
ipcMain.handle('check-bun', async () => await checkBun());
ipcMain.handle('check-node', async () => await checkNodeVersion());

ipcMain.handle('check-workspace', async () => await checkWorkspace());
ipcMain.handle('run-bun-install', async () => await runBunInstall());
ipcMain.handle('run-prisma-push', async () => await runPrismaPush());
ipcMain.handle('run-nx-build', async () => await runNxBuild());
ipcMain.handle('run-finish-install', async () => await runFinishInstall());
ipcMain.handle(
  'run-database-seed',
  async (_, user, pass) => await runDatabaseSeed(user, pass),
);

ipcMain.handle('open-external', (_, url) => shell.openExternal(url));
ipcMain.handle('quit', () => app.quit());

// Handle App termination
ipcMain.on('quit', (event, code) => {
  app.exit(code);
});

export async function checkNodeVersion(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('node --version', (err, stdout) => {
      if (err) return resolve(false);
      const version = stdout.trim().split('v')[1];
      const majorVersion = parseInt(version.split('.')[0], 10);
      resolve(majorVersion >= 22 && majorVersion < 23);
    });
  });
}

export async function checkBun(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('bun --version', (err) => resolve(!err));
  });
}

export async function checkPostgres(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('pg_isready', (err, stdout) => {
      if (err) return resolve(false);
      resolve(stdout.includes('accepting connections'));
    });
  });
}

export function checkWindowsVersion(): boolean {
  if (platform() !== 'win32') return false;
  const version = parseInt(release().split('.')[0], 10);
  return version >= 10;
}

export function checkRAM(): boolean {
  const totalGB = totalmem() / 1024 / 1024 / 1024;
  return totalGB >= 4;
}

export async function checkDiskSpace(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('df -k --output=avail / | tail -1', (err, stdout) => {
      if (err) return resolve(false);
      const availableKB = parseInt(stdout.trim(), 10);
      const availableGB = availableKB / 1024 / 1024;
      resolve(availableGB >= 4);
    });
  });
}

export async function checkInternet(): Promise<boolean> {
  return new Promise((resolve) => {
    lookup('google.com', (err) => resolve(!err));
  });
}
