declare module 'qr-scanner' {
  export type QrScannerOptions = {
    preferredCamera?: 'environment' | 'user';
    highlightScanRegion?: boolean;
    highlightCodeOutline?: boolean;
    onDecodeError?: (error: Error) => void;
    maxScansPerSecond?: number;
    returnDetailedScanResult?: boolean;
  };

  export type QrScanResult = {
    data: string;
  };

  export default class QrScanner {
    constructor(
      video: HTMLVideoElement,
      onScan: (result: QrScanResult) => void,
      options?: QrScannerOptions
    );
    start(): Promise<void>;
    stop(): Promise<void>;
    destroy(): void;
    static scanImage(
      image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap | File | Blob,
      options?: { returnDetailedScanResult?: boolean }
    ): Promise<string>;
    static hasCamera(): Promise<boolean>;
    static listCameras(): Promise<Array<{ id: string; label: string }>>;
  }
}
