/// <reference types="node" />
type StorageType = 'memory' | 'temporary';
export interface Settings {
    ignoreInternalLimit?: boolean;
    limit?: number;
    multi?: boolean;
    type?: StorageType;
}
export interface DataType {
    fieldname: string;
    buffer: Buffer;
    originalname: string;
    encoding: string;
    mimetype: string;
    truncated: any;
    size: number;
    url: string;
}
export declare class BusboyFileManagement {
    LIMIT: number;
    MAXLIMIT: number;
    Options: Settings;
    TYPE: StorageType;
    constructor(options?: Settings);
    handle(req: any, _res: any, next: Function): Promise<any>;
    private processFile;
    private temporary;
    private memory;
}
export {};
