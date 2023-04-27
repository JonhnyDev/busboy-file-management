/// <reference types="node" />
/// <reference types="node" />
import { Storage } from "./Storage";
import { Readable } from 'stream';
export declare class MemoryStorage implements Storage {
    private buffer;
    destroy(_url: string): Promise<void>;
    write(file: Readable, _filename: string): Promise<string>;
    read(): Promise<Buffer>;
}
