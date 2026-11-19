import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { provideTranslocoTesting } from '../testing/transloco-testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideTranslocoTesting()],
    }).compileComponents();
  });

  it('should render header and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-header')).toBeTruthy();
    expect(el.querySelector('app-footer')).toBeTruthy();
  });

  it('should show welcome page on root', async () => {
    const harness = await RouterTestingHarness.create('/');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Places');
  });

  it('should navigate to photos page', async () => {
    const harness = await RouterTestingHarness.create('/photos');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Photos');
  });

  it('should redirect unknown routes to welcome page', async () => {
    const harness = await RouterTestingHarness.create('/does-not-exist');
    expect(TestBed.inject(Router).url).toBe('/');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Places');
  });
});
