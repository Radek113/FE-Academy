import { TestBed } from '@angular/core/testing';
import { ThumbhashService } from './thumbhash.service';

describe('ThumbhashService', () => {
  const hash = 'nwgeDQJ6eI+Hd3Z4h4eIiHlflPh2';
  let service: ThumbhashService;

  beforeEach(() => {
    service = TestBed.inject(ThumbhashService);
  });

  it('should decode a hash to a PNG data URL', () => {
    // when
    const result = service.toDataUrl(hash);

    // then
    expect(result).toMatch(/^data:image\/png;base64,/);
  });

  it('should return null for a hash that is not valid base64', () => {
    // when
    const result = service.toDataUrl('%%% not base64 %%%');

    // then
    expect(result).toBeNull();
  });
});
