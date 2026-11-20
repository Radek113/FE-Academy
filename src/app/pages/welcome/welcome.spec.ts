import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslocoTesting } from '../../../testing/transloco-testing';
import { getTst, queryAllTst } from '../../../testing/tst';
import { Welcome } from './welcome';
import { WELCOME_SCOPE_PROVIDER } from './welcome-scope.transloco';

describe('Welcome', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Welcome],
      providers: [provideRouter([]), provideTranslocoTesting(), WELCOME_SCOPE_PROVIDER],
    });
    const fixture = TestBed.createComponent(Welcome);
    await fixture.whenStable();
    el = fixture.nativeElement;
  });

  it('should render the heading and a call to action linking to the photos', () => {
    // when
    // then
    expect(getTst(el, 'welcome-heading').textContent).toBeTruthy();
    expect(getTst(el, 'welcome-cta').getAttribute('href')).toBe('/photos');
  });

  it('should render a card per feature', () => {
    // when
    // then
    expect(queryAllTst(el, 'welcome-feature')).toHaveLength(3);
  });
});
