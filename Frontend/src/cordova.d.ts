// src/cordova.d.ts
interface FileTransfer {
    download(
      source: string,
      target: string,
      successCallback: (entry: any) => void,
      errorCallback: (error: any) => void,
      trustAllHosts?: boolean,
      options?: { headers?: Record<string, string> }
    ): void;
  }
  
  interface Window {
    FileTransfer: { new(): FileTransfer };
    cordova: any;
  }
  
  declare namespace cordova {
    const file: {
      documentsDirectory: string;
      externalDataDirectory?: string;
      dataDirectory?: string;
      cacheDirectory?: string;
    };
    namespace plugins {
      const permissions: {
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
    }
  }