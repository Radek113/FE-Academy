import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(StorageService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should store and read a value', () => {
    // given
    service.set('key', 'value');

    // when
    const result = service.get('key');

    // then
    expect(result).toBe('value');
  });

  it('should return null for a missing key', () => {
    // when
    const result = service.get('missing');

    // then
    expect(result).toBeNull();
  });

  it('should return null when storage cannot be read', () => {
    // given
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });

    // when
    const result = service.get('key');

    // then
    expect(result).toBeNull();
  });

  it('should not throw when storage cannot be written', () => {
    // given
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    // when
    // then
    expect(() => service.set('key', 'value')).not.toThrow();
  });
});
