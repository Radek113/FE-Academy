import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiBaseUrlInterceptor } from './api-base-url.interceptor';
import { API_BASE_URL } from './api-base-url.token';

describe('apiBaseUrlInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: API_BASE_URL, useValue: '/api' },
        provideHttpClient(withInterceptors([apiBaseUrlInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should prefix root-relative urls with the base url', () => {
    // when
    http.get('/images/metadata').subscribe();

    // then
    controller.expectOne('/api/images/metadata').flush([]);
  });

  it.each(['assets/i18n/en.json', 'https://example.com/data', '//cdn.example.com/data'])(
    'should leave %s untouched',
    (url: string) => {
      // when
      http.get(url).subscribe();

      // then
      controller.expectOne(url).flush({});
    },
  );
});
