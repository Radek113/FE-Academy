import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { provideTranslocoTesting } from '../../../../testing/transloco-testing';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideTranslocoTesting()] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should switch and persist the language', () => {
    // given
    const service: LanguageService = TestBed.inject(LanguageService);

    // when
    service.setLanguage('pl');

    // then
    expect(TestBed.inject(TranslocoService).getActiveLang()).toBe('pl');
    expect(service.language()).toBe('pl');
    expect(localStorage.getItem('language')).toBe('pl');
    expect(document.documentElement.lang).toBe('pl');
  });

  it('should restore a stored language over the browser language', () => {
    // given
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    localStorage.setItem('language', 'pl');

    // when
    // then
    expect(TestBed.inject(LanguageService).language()).toBe('pl');
  });

  it('should fall back to the browser language when the stored one is unsupported', () => {
    // given
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('pl-PL');
    localStorage.setItem('language', 'de');

    // when
    // then
    expect(TestBed.inject(LanguageService).language()).toBe('pl');
  });

  it('should default to English when the browser language is unsupported', () => {
    // given
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-DE');

    // when
    // then
    expect(TestBed.inject(LanguageService).language()).toBe('en');
  });
});
