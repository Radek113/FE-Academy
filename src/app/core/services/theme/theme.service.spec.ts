import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.colorScheme = '';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const stubSystemPreference = (prefersDark: boolean): void => {
    vi.stubGlobal('matchMedia', () => ({ matches: prefersDark }));
  };

  it('should toggle and persist the theme', () => {
    // given
    stubSystemPreference(false);
    const service = TestBed.inject(ThemeService);

    // when
    service.toggle();
    TestBed.tick();

    // then
    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('should restore a stored theme over the system preference', () => {
    // given
    stubSystemPreference(false);
    localStorage.setItem('theme', 'dark');

    // when
    // then
    expect(TestBed.inject(ThemeService).theme()).toBe('dark');
  });

  it('should follow the system preference when nothing is stored', () => {
    // given
    stubSystemPreference(true);

    // when
    // then
    expect(TestBed.inject(ThemeService).theme()).toBe('dark');
  });

  it('should ignore an invalid stored theme', () => {
    // given
    stubSystemPreference(false);
    localStorage.setItem('theme', 'purple');

    // when
    // then
    expect(TestBed.inject(ThemeService).theme()).toBe('light');
  });
});
