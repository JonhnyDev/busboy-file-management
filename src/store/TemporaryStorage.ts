import { Storage } from "./Storage";
import { Readable } from 'stream';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto'

export class TemporaryStorage implements Storage {
    public async save(file: Readable){
        try{
            const tmpFile = path.join(os.tmpdir(), `${randomUUID()}`);
            const writeStream = fs.createWriteStream(tmpFile);
            file.pipe(writeStream);
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
            const data = await fs.promises.readFile(tmpFile);
            return { 
                buffer: data,
                url: tmpFile,
            };
        } catch (err) {
            throw err;
        }
    }
}