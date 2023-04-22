import { BusboyFileManagement, MemoryStorage } from '../src';


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
});
