import { BusboyFileManagement, MemoryStorage } from '../src';
import { Readable } from 'stream';


describe('BusboyFileManagementMemory', () => {
  let middleware: BusboyFileManagement;

  beforeEach(() => {
    middleware = BusboyFileManagement.config({
        limits:{
            files: 5,
            fileSize: 80 * 1024 * 1024
        },
        storage: new MemoryStorage()
    });
  });
  describe('constructor', () => {
    it('should create a new BusboyFileManagement instance', () => {
      expect(middleware).toBeInstanceOf(BusboyFileManagement);
    });
  });
  describe('handle', () => {
    it('should a handle function', () => {
      expect(typeof middleware.handle).toBe('function');
    });
  })
  describe('processFile', () => {
    it('should process a file in memory', async () => {
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
      expect(result.buffer.toString()).toBe('test');
    });

    it('should process a file with a different field name', async () => {
      const fileContent = 'test';
      const file = Readable.from(fileContent);
      const fileInfo = {
        filename: 'test.txt',
        encoding: 'utf8',
        mimeType: 'text/plain',
      };
      const result = await middleware['processFile']('otherFieldName', file, fileInfo);
      expect(result.fieldname).toBe('otherFieldName');
    });
  });
});
