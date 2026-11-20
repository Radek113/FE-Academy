import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoTesting } from '../../../testing/transloco-testing';
import { getTst } from '../../../testing/tst';
import { Footer } from './footer';

describe('Footer', () => {
  it('should show the copyright with the current year', async () => {
    // given
    TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideTranslocoTesting()],
    });
    const fixture: ComponentFixture<Footer> = TestBed.createComponent(Footer);

    // when
    await fixture.whenStable();

    // then
    expect(getTst(fixture.nativeElement, 'footer-copyright').textContent).toContain(
      String(new Date().getFullYear()),
    );
  });
});
