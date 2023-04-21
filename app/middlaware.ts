import { BusboyFileManagement } from '../src'

export default async (req: any, res: any, next: Function) => {
    const UploadManagement = new BusboyFileManagement();
    return await UploadManagement.handle(req, res, next);
}

