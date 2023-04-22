import { Storage } from "./Storage";
import BufferListStream from 'bl';
import { Readable } from 'stream';

export class MemoryStorage implements Storage {
    public async save(file: Readable){
        try{
            return {
                buffer: await new Promise((resolve, reject) => {
                    file.pipe(
                        BufferListStream((err, data) => {
                            if (err) reject(err);
                            resolve(data);
                        })
                    );
                }) as Buffer,
                url: '',
            }
        } catch (err) {
            throw err;
        }
    }
}
