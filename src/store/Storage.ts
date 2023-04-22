import { Readable } from 'stream';
export interface Data {
    buffer: Buffer;
    url: string;
}

export interface Storage {
    save: (file: Readable) => Promise<Data>;
}