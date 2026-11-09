import { TestBed } from '@angular/core/testing';
import { ThumbhashService } from './thumbhash.service';

describe('ThumbhashService', () => {
  const hash = 'nwgeDQJ6eI+Hd3Z4h4eIiHlflPh2';
  let service: ThumbhashService;

  beforeEach(() => {
    service = TestBed.inject(ThumbhashService);
  });

  it('should decode a hash to a PNG data URL', () => {
    expect(service.toDataUrl(hash)).toMatch(/^data:image\/png;base64,/);
  });

  it('should return the same value for repeated calls', () => {
    expect(service.toDataUrl(hash)).toBe(service.toDataUrl(hash));
  });
});
