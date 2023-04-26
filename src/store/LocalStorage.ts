import { Storage } from "./Storage";
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs';

export class LocalStorage implements Storage {
    private currentWriteStream: fs.WriteStream | undefined;
    constructor(private readonly dirPath: string){}
    public async destroy(url: string): Promise<void> {
        try {
            if (this.currentWriteStream) {
                this.currentWriteStream.destroy();
                this.currentWriteStream = undefined;
            }
            fs.unlinkSync(url);
        } catch (err) {
            throw err;
        }
    }
    public async write(file: Readable, filename?: string): Promise<string> {
        try {
            const rootPath = path.join(process.cwd(), this.dirPath);
            const filePath = path.join(rootPath, `${filename}`);
            if (!fs.existsSync(rootPath)) {
                fs.mkdirSync(rootPath, { recursive: true });
            }
            return new Promise((resolve, reject) => {
                this.currentWriteStream = fs.createWriteStream(filePath);
                file.pipe(this.currentWriteStream);
                this.currentWriteStream.once('finish', () => {
                    fs.chmodSync(filePath, 0o600);
                    this.currentWriteStream = undefined;
                    resolve(filePath)
                })
                this.currentWriteStream.once('error', reject);
            });
        } catch (err) {
            throw err;
        }
    }
    public async read(url: string): Promise<Buffer> {
        try {
            return await fs.promises.readFile(url);
        } catch (err) {
            throw err;
        }
    }
}