// src/cordova.d.ts
interface Window {
    FileTransfer: any; // Minimal type for FileTransfer
  }
  
  declare namespace cordova {
    const file: {
      documentsDirectory: string;
      externalDataDirectory?: string;
      // Add other directories as needed
    };
  }