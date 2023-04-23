import { Readable } from 'stream';
export interface Data {
    buffer: Buffer;
    url: string;
}
interface ReadableStorage {
    read(url: string): Promise<Buffer>;
}

interface WritableStorage {
    write(file: Readable): Promise<string>;
}

export interface Storage extends ReadableStorage, WritableStorage {}