import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslocoTesting } from '../../../testing/transloco-testing';
import { getTst, queryAllTst } from '../../../testing/tst';
import { LanguageService } from '../../core/services/language/language.service';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let el: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.style.colorScheme = '';
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), provideTranslocoTesting()],
    });
    fixture = TestBed.createComponent(Header);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should render the brand and navigation links', () => {
    // when
    // then
    expect(getTst(el, 'header-brand').textContent).toContain('PhotoPortfolio');
    expect(queryAllTst(el, 'header-nav-link').map((a) => a.getAttribute('href'))).toEqual([
      '/',
      '/photos',
    ]);
  });

  it('should toggle the theme with the theme button', async () => {
    // given
    const button: HTMLElement = getTst(el, 'header-theme-toggle');
    const wasDark: boolean = button.getAttribute('aria-pressed') === 'true';

    // when
    button.click();
    await fixture.whenStable();

    // then
    expect(button.getAttribute('aria-pressed')).toBe(String(!wasDark));
    expect(document.documentElement.style.colorScheme).toBe(wasDark ? 'light' : 'dark');
  });

  it('should switch the language from the language menu', async () => {
    // given
    const languageService = TestBed.inject(LanguageService);
    languageService.setLanguage('en');
    await fixture.whenStable();

    // when
    getTst(el, 'header-language-button').click();
    await fixture.whenStable();
    getTst(document.body, 'header-language-option-pl').click();
    await fixture.whenStable();

    // then
    expect(languageService.language()).toBe('pl');
    expect(getTst(el, 'header-language-code').textContent).toBe('PL');
  });
});
