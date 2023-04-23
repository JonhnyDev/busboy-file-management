import { Storage } from "./Storage";
import BufferListStream from 'bl';
import { Readable } from 'stream';

export class MemoryStorage implements Storage {
    buffer: Buffer = Buffer.alloc(0);
    public async write(file: Readable): Promise<string> {
        try {
            const buffer = await new Promise<Buffer>((resolve, reject) => {
                file.pipe(
                    BufferListStream((err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    })
                );
            });
            this.buffer = buffer
            return ''
        } catch (err) {
            throw err;
        }
    }
    public async read(_url: string): Promise<Buffer> {
        try {
            return this.buffer;
        } catch (err) {
            throw err;
        }
    }
}
