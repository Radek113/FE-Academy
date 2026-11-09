import { TestBed } from '@angular/core/testing';
import { provideTranslocoTesting } from '../../../testing/transloco-testing';
import { Footer } from './footer';

describe('Footer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideTranslocoTesting()],
    }).compileComponents();
  });

  it('should show the current year', async () => {
    const fixture = TestBed.createComponent(Footer);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      String(new Date().getFullYear()),
    );
  });
});
