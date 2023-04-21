import { BusboyFileManagement, DataType, Settings } from '../src';
import fs from 'fs'
describe('BusboyFileManagement', () => {
  let middleware: BusboyFileManagement;

  beforeEach(() => {
    middleware = new BusboyFileManagement();
  });
  describe('constructor', () => {
    it('should create a new BusboyFileManagement instance', () => {
      expect(middleware).toBeInstanceOf(BusboyFileManagement);
    });

    it('should create a new BusboyFileManagement instance with specified options', () => {
      const Options: Settings = {
        ignoreInternalLimit: false,
        limit: 8 * 1024 * 1024,
        multi: false,
        type: 'memory'
      };
      middleware = new BusboyFileManagement(Options);
      expect(middleware).toBeInstanceOf(BusboyFileManagement);
      expect(middleware.Options).toEqual(Options);
    });
  });
  describe('handle', () => {
    it('should a handle function', () => {
      expect(typeof middleware.handle).toBe('function');
    });
  })
  describe('processFile', () => {
    it('should process a file in memory', async () => {
      const file = {
        pipe: jest.fn((stream: any) => {
          stream.write('test');
          stream.end();
        }),
      };
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
      const file = {
        pipe: jest.fn((stream: any) => {
          stream.write('test');
          stream.end();
        }),
      };
      const fileInfo = {
        filename: 'test.txt',
        encoding: 'utf8',
        mimeType: 'text/plain',
      };
      middleware = new BusboyFileManagement({ type: 'temporary' });
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
      const file = {
        pipe: jest.fn((stream: any) => {
          stream.write('test');
          stream.end();
        }),
      };
      const fileInfo = {
        filename: 'test.txt',
        encoding: 'utf8',
        mimeType: 'text/plain',
      };
      const result = await middleware['processFile']('otherFieldName', file, fileInfo);
      expect(result.fieldname).toBe('otherFieldName');
    });

    it('should process a file and store it on disk', async () => {
      const file = {
        pipe: jest.fn((stream: any) => {
          stream.write('test');
          stream.end();
        }),
      };
      const fileInfo = {
        filename: 'test.txt',
        encoding: 'utf8',
        mimeType: 'text/plain',
      };
      middleware = new BusboyFileManagement({ type: 'temporary' });
      const result = await middleware['processFile']('file', file, fileInfo);
      expect(Buffer.isBuffer(result.buffer)).toBe(true);
      expect(result.fieldname).toBe('file');
      expect(result.originalname).toBe('test.txt');
      expect(result.encoding).toBe('utf8');
      expect(result.mimetype).toBe('text/plain');
      expect(result.truncated).toBe(false);
      expect(result.size).toBe(4);
      expect(result.url).toBeDefined();
      expect(fs.existsSync(result.url)).toBe(true);
      expect(fs.readFileSync(result.url).toString()).toBe('test');
      fs.unlinkSync(result.url);
    });
  });
});
