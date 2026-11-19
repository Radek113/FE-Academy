import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { provideTranslocoTesting } from '../../../../testing/transloco-testing';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideTranslocoTesting()] });
  });

  it('should switch and persist the language', () => {
    const service = TestBed.inject(LanguageService);
    service.setLanguage('pl');
    expect(TestBed.inject(TranslocoService).getActiveLang()).toBe('pl');
    expect(service.language()).toBe('pl');
    expect(localStorage.getItem('language')).toBe('pl');
    expect(document.documentElement.lang).toBe('pl');
  });

  it('should restore a stored language', () => {
    localStorage.setItem('language', 'pl');
    expect(TestBed.inject(LanguageService).language()).toBe('pl');
  });
});
