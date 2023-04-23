import busboy from 'busboy';
import { Readable } from 'stream';
import { Storage } from './store/Storage'
import { MemoryStorage } from './store/MemoryStorage'
import { TemporaryStorage } from './store/TemporaryStorage'

interface File {
  fieldname: string;
  buffer: Buffer;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  url: string;
}

interface UploadResult {
  files: File[];
}

interface UploadHandler {
  handle(req: any, res: any, next: Function): Promise<UploadResult>;
}

interface UploadLimits {
  fileSize?: number;
  files?: number;
}

interface Settings {
    storage: Storage,
    limits: UploadLimits
}
class BusboyFileManagement implements UploadHandler {
  private readonly MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
  private DEFAULT_LIMITS: UploadLimits = { fileSize: this.MAX_FILE_SIZE, files: 1 }
  constructor(private readonly settings: Settings) {}
  
  public async handle(req: any, _res: any, next: Function): Promise<UploadResult> {
    try {
      if (!req.is('multipart/form-data')) next();
        const busboy = this.createBusboy(req);
        const uploadedFiles = await this.processFiles(busboy);
        req.files = uploadedFiles
        return next();
    } catch (err) {
      return next(err);
    }
  }

  private createBusboy(req: any) {
    this.DEFAULT_LIMITS = { ...this.settings.limits }
    const busboyInstance = busboy({ headers: req.headers, limits: this.DEFAULT_LIMITS });
    req.on('close', () => busboyInstance.destroy());
    req.pipe(busboyInstance);
    return busboyInstance;
  }

  private async processFiles(busboy: busboy.Busboy): Promise<File[]> {
    const uploadedFiles: File[] = [];
    let lastDataReceivedTime = Date.now();
    return new Promise((resolve, reject) => {
        busboy.on('file', async (fieldname: string, file: Readable, fileInfo: busboy.FileInfo) => {
            try {
                file.on('data', () => {
                    lastDataReceivedTime = Date.now();
                });
                file.on('error', (error: Error) => {
                  reject(error);
                });
                const uploadedFile = await this.processFile(fieldname, file, fileInfo);
                uploadedFiles.push(uploadedFile);
            } catch (err) {
                reject(err);
            }
        });
        busboy.on('close', () => {
            const checkDataReceivedInterval = setInterval(() => {
                if (Date.now() - lastDataReceivedTime > 100) {
                    clearInterval(checkDataReceivedInterval);
                    resolve(uploadedFiles);
                }
            }, 50);
        });
        busboy.on('error', (error: Error) => {
          if (error.message === 'Unexpected end of file') resolve([])
            reject(error);
        });

        busboy.on('filesLimit', () => {
            reject(new Error(`Limit exceeded, allowed only ${this.DEFAULT_LIMITS.files} files.`));
        });
    });
  }

  private async processFile(fieldname: string, file: Readable, { filename, encoding, mimeType }: busboy.FileInfo): Promise<File> {
    if (!filename) throw new Error('The file must have a name');

    const url = await this.settings.storage.write(file);

    if ('truncated' in file) {
      if (file.truncated) {
        throw new Error('The uploaded file exceeds the maximum size allowed by the server');
      }
    }

    const buffer = await this.settings.storage.read(url);

    return {
        fieldname,
        buffer,
        encoding,
        originalname: filename,
        mimetype: mimeType,
        size: buffer.byteLength,
        url,
    };
  }
}

export { BusboyFileManagement, MemoryStorage, TemporaryStorage, File }
