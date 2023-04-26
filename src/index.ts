import busboy from 'busboy';
import { Readable } from 'stream';
import { Storage } from './store/Storage'
import { MemoryStorage } from './store/MemoryStorage'
import { TemporaryStorage } from './store/TemporaryStorage'
import { LocalStorage } from './store/LocalStorage'
import { randomUUID } from 'crypto'
interface File {
  fieldname: string;
  buffer: Buffer;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  url: string;
  extra?: any;
  processed: boolean;
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
interface Process {
    [key: string]: File
}
class BusboyFileManagement implements UploadHandler {
    private readonly MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
    private DEFAULT_LIMITS: UploadLimits = { fileSize: this.MAX_FILE_SIZE, files: 1 }
    private updateUploadFiles:Array<File> = []
    private inProcess: Process = {}
    private checkloading: NodeJS.Timer | undefined
    constructor(private readonly settings: Settings) {
        this.DEFAULT_LIMITS = { ...this.settings.limits }
    }
  
    public async handle(req: any, _res: any, next: Function): Promise<UploadResult> {
        try {
            if (!req.is('multipart/form-data')) return next();
            const busboy = this.createBusboy(req);
            const uploadedFiles = await this.processFiles(busboy);
            req.files = uploadedFiles
            return next();
        } catch (err) {
            return next(err);
        }
    }

    private createBusboy(req: any) {
        const busboyInstance = busboy({ headers: req.headers, limits: this.DEFAULT_LIMITS });
        req.on('close', () => busboyInstance.destroy());
        req.pipe(busboyInstance);
        return busboyInstance;
    }
    private async processFiles(busboy: busboy.Busboy): Promise<File[]> {
        return new Promise((resolve, reject) => {
            const FileListiner = async (fieldname: string, file: Readable, fileInfo: busboy.FileInfo) => {
                try {
                    const uuid = randomUUID()
                    this.inProcess[uuid] = { ...this.inProcess[uuid],  processed: false }
                    file.on('error', (error: Error) => busboy.emit('error', error));
                    const result = await this.processFile(fieldname, file, fileInfo);
                    this.updateUploadFiles.push(result)
                    this.inProcess[uuid] = { ...result }
                } catch (error) {
                    reject(error);
                }
            }
            const closeListiner = () => {
                this.checkloading = setInterval(() => {
                    const allProcessed = Object.values(this.inProcess).every(file => file.processed);
                    if(allProcessed){
                        clearInterval(this.checkloading)
                        resolve(this.updateUploadFiles)
                    }
                }, 5)
            }
            const errorListiner = (error: Error) => {
                busboy.removeListener('close', closeListiner);
                clearInterval(this.checkloading)
                reject(error)
            }
            busboy.on('file', FileListiner)
            busboy.on('close', closeListiner)
            busboy.on('error', errorListiner);
            busboy.on('filesLimit', () => busboy.emit('error', new Error(`Limit exceeded, allowed only ${this.DEFAULT_LIMITS.files} files.`)));
        });
    }

    private async processFile(fieldname: string, file: Readable, { filename, encoding, mimeType }: busboy.FileInfo): Promise<File> {
        if (!filename) throw new Error('The file must have a name');
        const url = await this.settings.storage.write(file, filename);
        if ('truncated' in file && file.truncated) {
            await this.settings.storage.destroy(url);
            throw new Error('The uploaded file exceeds the maximum size allowed by the server');
        }
        const buffer = await this.settings.storage.read(url);
        let extra = {}
        if (typeof this.settings.storage.persist === 'function') {
            extra = await this.settings.storage.persist(url)
        }
        return {
            fieldname,
            buffer,
            encoding,
            url,
            extra,
            originalname: filename,
            mimetype: mimeType,
            size: buffer.byteLength,
            processed: true
        };
    }
}

export { BusboyFileManagement, MemoryStorage, TemporaryStorage, LocalStorage, File }
