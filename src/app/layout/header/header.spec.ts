import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslocoTesting } from '../../../testing/transloco-testing';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), provideTranslocoTesting()],
    }).compileComponents();
  });

  it('should render brand and navigation links', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('a[aria-label="PhotoPortfolio home"]')?.textContent).toContain(
      'PhotoPortfolio',
    );
    const hrefs = Array.from(el.querySelectorAll('nav a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/', '/photos']);
  });

  it('should toggle dark mode via the theme button', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const button = el.querySelector<HTMLButtonElement>('.theme-toggle')!;
    const before = button.getAttribute('aria-pressed');
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-pressed')).not.toBe(before);
    expect(document.documentElement.style.colorScheme).toBe(before === 'true' ? 'light' : 'dark');
  });

  it('should show the active language code', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const code = (fixture.nativeElement as HTMLElement).querySelector('.language-code');
    expect(code?.textContent).toMatch(/^(EN|PL)$/);
  });

  it('should render the mobile menu button', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Open navigation menu"]',
    );
    expect(button).toBeTruthy();
  });
});
