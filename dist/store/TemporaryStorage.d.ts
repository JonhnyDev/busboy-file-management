/// <reference types="node" />
/// <reference types="node" />
import { Storage } from "./Storage";
import { Readable } from 'stream';
export declare class TemporaryStorage implements Storage {
    destroy(url: string): Promise<void>;
    write(file: Readable, filename: string): Promise<string>;
    read(url: string): Promise<Buffer>;
}
