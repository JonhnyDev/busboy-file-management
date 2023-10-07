import { BusboyFileManagement, LocalStorage } from '../src'

export default async (req: any, res: any, next: Function) => BusboyFileManagement.config({
  limits: {
    files: 50,
    fileSize: 100 * 1024 * 1024,
  },
  storage: new LocalStorage('/files'),
}).handle(req, res, next);


