// src/cordova.d.ts
interface Window {
  cordova: Cordova;
  FileTransfer?: { new(): FileTransfer };
  resolveLocalFileSystemURL: (
    url: string,
    successCallback: (entry: FileSystemEntry) => void,
    errorCallback: (error: FileError) => void
  ) => void;
}

interface Cordova {
  file: {
    documentsDirectory: string | null;
    externalDataDirectory: string | null;
    cacheDirectory: string | null;
  };
  plugins: {
    permissions: {
      WRITE_EXTERNAL_STORAGE: string;
      READ_EXTERNAL_STORAGE: string;
      checkPermission: (
        permission: string,
        successCallback: (status: { hasPermission: boolean }) => void,
        errorCallback: (error: any) => void
      ) => void;
      requestPermission: (
        permission: string,
        successCallback: (status: { hasPermission: boolean }) => void,
        errorCallback: (error: any) => void
      ) => void;
    };
    fileOpener2?: {
      open: (
        filePath: string,
        mimeType: string,
        options: {
          error: (error: any) => void;
          success: () => void;
        }
      ) => void;
    };
  };
}

interface FileTransfer {
  download(
    source: string,
    target: string,
    successCallback: (entry: any) => void,
    errorCallback: (error: FileTransferError) => void,
    trustAllHosts?: boolean,
    options?: { headers?: Record<string, string> }
  ): void;
}

interface FileTransferError {
  code: number;
  source: string;
  target: string;
  http_status: number;
  body: string;
  exception: string;
}

interface FileSystemEntry {
  getFile(
    path: string,
    options: { create: boolean; exclusive: boolean },
    successCallback: (fileEntry: FileEntry) => void,
    errorCallback: (error: FileError) => void
  ): void;
}

interface FileEntry {
  createWriter(
    successCallback: (fileWriter: FileWriter) => void,
    errorCallback: (error: FileError) => void
  ): void;
  toURL(): string;
}

interface FileWriter {
  onwriteend: (() => void) | null;
  onerror: ((error: FileError) => void) | null;
  write(data: Blob): void;
}

interface FileError {
  code: number;
  message?: string;
}

interface Navigator {
  connection?: {
    type: string;
  };
}