import { Storage } from "./Storage";
import { Readable } from 'stream';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto'

export class TemporaryStorage implements Storage {
    public write(file: Readable): Promise<string> {
        try {
            return new Promise((resolve, reject) => {
                const tmpFile = path.join(os.tmpdir(), `${randomUUID()}`);
                const writeStream = fs.createWriteStream(tmpFile);
                file.pipe(writeStream);
                writeStream.once('finish', () => {
                    resolve(tmpFile);
                });
                //process.on('beforeExit', () => {
                //    // Se o processo estiver sendo encerrado, fecha o stream
                //    writeStream.close();
                //});
                writeStream.once('error', reject);
            });
        } catch (err) {
            console.log('TemporaryStorage aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            throw err;
        }
    }
    public async read(url: string): Promise<Buffer> {
        try {
            return await fs.promises.readFile(url);
        } catch (err) {
            console.log('TemporaryStorage read aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            throw err;
        }
    }
}