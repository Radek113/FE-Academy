import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { NEVER } from 'rxjs';
import { provideTranslocoTesting } from '../testing/transloco-testing';
import { queryTst } from '../testing/tst';
import { App } from './app';
import { routes } from './app.routes';
import { ImageMetadataService } from './core/services/image-metadata/image-metadata.service';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        provideTranslocoTesting(),
        { provide: ImageMetadataService, useValue: { getImages: () => NEVER } },
      ],
    });
  });

  it('should render the header and footer', async () => {
    // given
    const fixture: ComponentFixture<App> = TestBed.createComponent(App);

    // when
    await fixture.whenStable();

    // then
    expect(queryTst(fixture.nativeElement, 'app-header')).not.toBeNull();
    expect(queryTst(fixture.nativeElement, 'app-footer')).not.toBeNull();
  });

  it('should show the welcome page on the root route', async () => {
    // when
    const harness: RouterTestingHarness = await RouterTestingHarness.create('/');

    // then
    expect(queryTst(harness.routeNativeElement as HTMLElement, 'welcome-heading')).not.toBeNull();
  });

  it('should show the photos page on /photos', async () => {
    // when
    const harness = await RouterTestingHarness.create('/photos');

    // then
    expect(queryTst(harness.routeNativeElement as HTMLElement, 'photos-page')).not.toBeNull();
  });

  it('should redirect unknown routes to the welcome page', async () => {
    // when
    const harness = await RouterTestingHarness.create('/does-not-exist');

    // then
    expect(TestBed.inject(Router).url).toBe('/');
    expect(queryTst(harness.routeNativeElement as HTMLElement, 'welcome-heading')).not.toBeNull();
  });
});
