import { BusboyFileManagement, TemporaryStorage } from '../src'

export default async (req: any, res: any, next: Function) => {
    const UploadManagement = new BusboyFileManagement({
        limits:{
            files: 50,
            fileSize: 100 * 1024 * 1024
        },
        storage: new TemporaryStorage() //new LocalStorage('/testando')
    });
    return await UploadManagement.handle(req, res, next);
}

