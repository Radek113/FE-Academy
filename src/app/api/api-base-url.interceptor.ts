import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) =>
  req.url.startsWith('/') ? next(req.clone({ url: environment.apiBaseUrl + req.url })) : next(req);
