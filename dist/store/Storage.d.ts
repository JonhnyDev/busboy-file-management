/// <reference types="node" />
/// <reference types="node" />
import { Readable } from 'stream';
export interface Data {
    buffer: Buffer;
    url: string;
}
interface ReadableStorage {
    read(url: string): Promise<Buffer>;
}
interface DestroyStorage {
    destroy(url: string): Promise<void>;
}
interface WritableStorage {
    write(file: Readable, filename: string): Promise<string>;
}
interface PersistInStorage {
    persist?(url: string): Promise<any>;
}
export interface Storage extends ReadableStorage, WritableStorage, DestroyStorage, PersistInStorage {
}
export {};
