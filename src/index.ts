import busboy from 'busboy';
import { Storage } from './store/Storage'
import { MemoryStorage } from './store/MemoryStorage'
import { TemporaryStorage } from './store/TemporaryStorage'
import { Readable } from 'stream';
interface Settings<T extends Storage> {
    ignoreInternalLimit?: boolean
    limitSize?: number
    limitFiles?: number
    multi?: boolean
    storage: T
}
interface DataType {
    fieldname: string;
    buffer: Buffer;
    originalname: string;
    encoding: string;
    mimetype: string;
    truncated: boolean;
    size: number;
    url: string;
}

class BusboyFileManagement <T extends Storage>{
    MAXLIMIT: number = 25 * 1024 * 1024 // 25MB
    files: Array<DataType> = [];
    totalFiles: number = 0;
    constructor(readonly settings: Settings<T>){}
    public async handle(req: any, _res: any, next: Function){
        try{
            if (!req.is('multipart/form-data')) return next();
            if(this.settings?.ignoreInternalLimit && !this.settings?.limitSize){
                throw new Error("If you set the ignoreInternalLimit to true, limit must have a defined value and have a numerical value.");
            }
            if(this.settings?.ignoreInternalLimit && this.settings?.limitSize){
                this.MAXLIMIT = this.settings?.limitSize
            }
            if(!this.settings?.ignoreInternalLimit && this.settings?.limitSize){
                if(this.settings?.limitSize < this.MAXLIMIT){
                    this.MAXLIMIT = this.settings?.limitSize
                }
            }
            const BusBoy = busboy({ headers: req.headers, limits: { fileSize: this.MAXLIMIT, files: this.settings.limitFiles ?? 1 } });
            BusBoy.on('file', async (fieldname: string, file: Readable, { filename, encoding, mimeType }: busboy.FileInfo) => {
                try {
                    const filesPromise = await this.processFile(fieldname, file, { filename, encoding, mimeType });
                    this.files.push(filesPromise);
                } catch (err) {
                    return next(err);
                } finally {
                    this.totalFiles++;
                }
            });
            BusBoy.on('close', async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                req.files = this.files;
                return next()
            });
            BusBoy.on('error', (error) => next(error));
            BusBoy.on('filesLimit', () => {
                const error = new Error(`Limit exceeded, allowed only ${this.settings.limitFiles ?? 1} files.`)
                return next(error)
            });
            req.on('close', () => BusBoy.destroy());
            req.pipe(BusBoy);
        }catch(err){
            return next(err);
        }
    }
    private async processFile(fieldname: string, file: Readable, { filename, encoding, mimeType }: busboy.FileInfo): Promise<DataType> {
        try {
            if(!filename) throw new Error('The file must have a name');
            const data = await this.settings.storage.save(file)
            if ('truncated' in file) {
                if(file.truncated) throw new Error('The uploaded file exceeds the maximum size allowed by the server');
            }
            const response = {
                fieldname: fieldname,
                buffer: data.buffer,
                originalname: filename,
                encoding: encoding,
                mimetype: mimeType,
                truncated: false,
                size: Buffer.byteLength(data.buffer, 'binary'),
                url: data.url,
            }
            return response;
        } catch (err) {
            throw err;
        }
    }
}

export {
    BusboyFileManagement,
    DataType,
    Settings,
    MemoryStorage,
    TemporaryStorage,
    Storage
}