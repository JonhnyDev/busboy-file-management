import { BusboyFileManagement, MemoryStorage } from '../src'

export default async (req: any, res: any, next: Function) => {
    const UploadManagement = new BusboyFileManagement({
        limits:{
            files: 2,
            fileSize: 2 * 1024 * 1024
        },
        storage: new MemoryStorage()
    });
    return await UploadManagement.handle(req, res, next);
}

