import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should toggle and persist the theme', () => {
    const service = TestBed.inject(ThemeService);
    service.theme.set('light');
    service.toggle();
    TestBed.tick();
    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('should restore a stored theme', () => {
    localStorage.setItem('theme', 'dark');
    expect(TestBed.inject(ThemeService).theme()).toBe('dark');
  });
});
