import { BusboyFileManagement, MemoryStorage } from '../src';


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
});
