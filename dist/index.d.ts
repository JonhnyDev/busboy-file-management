/// <reference types="node" />
import { Storage } from './store/Storage';
import { MemoryStorage } from './store/MemoryStorage';
import { TemporaryStorage } from './store/TemporaryStorage';
import { LocalStorage } from './store/LocalStorage';
interface File {
    fieldname: string;
    buffer: Buffer;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    url: string;
    extra?: any;
    processed: boolean;
}
interface UploadResult {
    files: File[];
}
interface UploadHandler {
    handle(req: any, res: any, next: Function): Promise<UploadResult>;
}
interface UploadLimits {
    fileSize?: number;
    files?: number;
}
interface Settings {
    storage: Storage;
    limits: UploadLimits;
}
declare class BusboyFileManagement implements UploadHandler {
    private readonly settings;
    private readonly MAX_FILE_SIZE;
    private DEFAULT_LIMITS;
    private updateUploadFiles;
    private inProcess;
    private checkloading;
    constructor(settings: Settings);
    handle(req: any, _res: any, next: Function): Promise<UploadResult>;
    private createBusboy;
    private processFiles;
    private processFile;
}
export { BusboyFileManagement, MemoryStorage, TemporaryStorage, LocalStorage, File };
