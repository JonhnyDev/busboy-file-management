import busboy from 'busboy';
import BufferListStream from 'bl';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto'
type StorageType = 'memory' | 'temporary' 

export interface Settings {
    ignoreInternalLimit?: boolean
    limit?: number
    multi?: boolean
    type?: StorageType
}
export interface DataType {
    fieldname: string;
    buffer: Buffer;
    originalname: string;
    encoding: string;
    mimetype: string;
    truncated: any;
    size: number;
    url: string;
}

export class BusboyFileManagement {
    LIMIT: number = 5 * 1024 * 1024
    MAXLIMIT: number = 25 * 1024 * 1024 // Limite maximum size 25 megas.
    Options: Settings = {}
    TYPE: StorageType;
    constructor(options?: Settings){
        this.Options = options || {};
        this.TYPE = options?.type ?? 'memory'
    }
    public async handle(req: any, _res: any, next: Function){
        if (!req.is('multipart/form-data')) return next();
        if(this.Options?.ignoreInternalLimit){
            if(!this.Options?.limit) throw new Error("Se você definir o ignoreInternalLimit como true, limit deve ter um ser definido e ter um valor numerico.");
            this.MAXLIMIT = this.Options?.limit
        }else{
            if(this.Options?.limit){
                if(this.Options?.limit < this.MAXLIMIT){
                    this.MAXLIMIT = this.Options?.limit
                }
                this.MAXLIMIT = this.Options?.limit
            }
        }
        const BusBoy = busboy({ headers: req.headers, limits: { fileSize: this.MAXLIMIT} });
        let files: DataType[] = [];
        BusBoy.on('file', async (fieldname: string, file: any, { filename, encoding, mimeType }: busboy.FileInfo) => {
            try {
                const fileData = await this.processFile(fieldname, file, { filename, encoding, mimeType });
                files.push(fileData);
            } catch (err) {
                return next(err);
            }
        });
        BusBoy.on('finish', () => next());
        BusBoy.on('error', (error) => next(error));
        req.files = files || [];
        req.body = req.body || {};
        req.on('close', () => BusBoy.destroy());
        req.pipe(BusBoy);
    }
    private async processFile(fieldname: string, file: any, { filename, encoding, mimeType }: busboy.FileInfo): Promise<DataType> {
        try {
            if (file?.truncated) {
                throw new Error('The uploaded file exceeds the maximum size allowed by the server');
            }
            const data = await this[this.TYPE](file, fieldname)

            return {
                fieldname: fieldname,
                buffer: data.buffer,
                originalname: filename,
                encoding: encoding,
                mimetype: mimeType,
                truncated: file?.truncated ?? false,
                size: Buffer.byteLength(data.buffer, 'binary'),
                url: data.url,
            };
        } catch (err) {
            throw err;
        }
    }
    private async temporary(file: any, fieldname: string){
        const tmpFile = path.join(os.tmpdir(), `${fieldname}-${randomUUID()}`);

        await new Promise<void>((resolve, reject) => {
            const writeStream = fs.createWriteStream(tmpFile);
            file.pipe(writeStream);
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        return { 
            buffer: await fs.promises.readFile(tmpFile),
            url: tmpFile,
        }
    }
    private async memory(file: any, fieldname: string){
        return {
            buffer: await new Promise((resolve, reject) => {
                file.pipe(
                BufferListStream((err, data) => {
                    if (err || !(data.length || fieldname)) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                })
                );
            }) as Buffer,
            url: '',
        }
    }
}