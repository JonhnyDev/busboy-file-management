import { BusboyFileManagement, DataType, MemoryStorage } from '../src';
import { Readable } from 'stream';


describe('BusboyFileManagementMemory', () => {
  let middleware: BusboyFileManagement<MemoryStorage>;

  beforeEach(() => {
    middleware = new BusboyFileManagement({
        ignoreInternalLimit: true,
        limitSize: 80 * 1024 * 1024,
        limitFiles: 5,
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
      expect(result).toMatchObject<DataType>({
        buffer:  Buffer.from('test'),
        fieldname: 'file',
        originalname: 'test.txt',
        encoding: 'utf8',
        mimetype: 'text/plain',
        truncated: false,
        size: 4,
        url: '',
      });
      expect(result.buffer.toString()).toBe('test');
    });

    it('should process a file in temporary storage', async () => {
      const fileContent = 'test';
      const file = Readable.from(fileContent);
      const fileInfo = {
        filename: 'test.txt',
        encoding: 'utf8',
        mimeType: 'text/plain',
      };
      //middleware = new BusboyFileManagement({ type: 'temporary' });
      const result = await middleware['processFile']('file', file, fileInfo);
      expect(Buffer.isBuffer(result.buffer)).toBe(true);
      expect(result.fieldname).toBe('file')
      expect(result.originalname).toBe(fileInfo.filename)
      expect(result.encoding).toBe(fileInfo.encoding)
      expect(result.mimetype).toBe(fileInfo.mimeType)
      expect(result.truncated).toBe(false)
      expect(result.size).toBe(4)
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
