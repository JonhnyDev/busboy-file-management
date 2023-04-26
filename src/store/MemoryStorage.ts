import { Storage } from "./Storage";
import BufferListStream from 'bl';
import { Readable } from 'stream';

export class MemoryStorage implements Storage {
    private buffer: Buffer = Buffer.alloc(0);
    public async destroy(_url: string): Promise<void> {
        this.buffer = Buffer.alloc(0);
    }
    public async write(file: Readable, _filename: string): Promise<string> {
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
    public async read(): Promise<Buffer> {
        return this.buffer;
    }
}
