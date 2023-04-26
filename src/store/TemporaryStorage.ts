import { Storage } from "./Storage";
import { Readable } from 'stream';
import os from 'os';
import path from 'path';
import fs from 'fs';

export class TemporaryStorage implements Storage {
    public async destroy(url: string): Promise<void> {
        fs.unlinkSync(url);
    }
    public write(file: Readable, filename: string): Promise<string> {
        try {
            return new Promise((resolve, reject) => {
                const tmpFile = path.join(os.tmpdir(), `${filename}`);
                const writeStream = fs.createWriteStream(tmpFile);
                file.pipe(writeStream);
                writeStream.once('finish', () => {
                    fs.chmodSync(tmpFile, 0o600);
                    resolve(tmpFile)
                });
                writeStream.once('error', reject);
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