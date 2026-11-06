import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Welcome } from './welcome';

describe('Welcome', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Welcome],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render hero with link to photos', async () => {
    const fixture = TestBed.createComponent(Welcome);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')).toBeTruthy();
    expect(el.querySelector('a[href="/photos"]')).toBeTruthy();
  });

  it('should render a card per feature', async () => {
    const fixture = TestBed.createComponent(Welcome);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('mat-card').length).toBe(3);
  });
});
