import { BusboyFileManagement, TemporaryStorage } from '../src';
import fs from 'fs'
import { Readable } from 'stream';


describe('BusboyFileManagementTemporary', () => {
  let middleware: BusboyFileManagement;

  beforeEach(() => {
    middleware = BusboyFileManagement.config({
        limits:{
            files: 5,
            fileSize: 80 * 1024 * 1024
        },
        storage: new TemporaryStorage()
    });
  });
  describe('processFile', () => {
    it('should process a file and store it on disk', async () => {
      const fileContent = 'test';
      const file = Readable.from(fileContent);
      const fileInfo = {
        filename: 'test.txt',
        encoding: 'utf8',
        mimeType: 'text/plain',
      };
      const result = await middleware['processFile']('file', file, fileInfo);
      expect(Buffer.isBuffer(result.buffer)).toBe(true);
      expect(result.fieldname).toBe('file');
      expect(result.originalname).toBe('test.txt');
      expect(result.encoding).toBe('utf8');
      expect(result.mimetype).toBe('text/plain');
      expect(result.size).toBe(4);
      expect(result.url).toBeDefined();
      expect(fs.existsSync(result.url)).toBe(true);
      expect(fs.readFileSync(result.url).toString()).toBe('test');
      fs.unlinkSync(result.url);
    });
  });
});
