import { BusboyFileManagement, TemporaryStorage } from '../src'

export default async (req: any, res: any, next: Function) => {
    const UploadManagement = new BusboyFileManagement({
        ignoreInternalLimit: true,
        limitSize: 80 * 1024 * 1024,
        limitFiles: 5,
        storage: new TemporaryStorage()
    });
    return await UploadManagement.handle(req, res, next);
}

