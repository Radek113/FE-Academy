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

  it('should render the mobile menu button', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Open navigation menu"]',
    );
    expect(button).toBeTruthy();
  });
});
