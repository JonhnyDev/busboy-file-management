import { BusboyFileManagement } from '../src'
const management = new BusboyFileManagement();

export default async (req: any, res: any, next: Function) => await management.handle(req, res, next);

