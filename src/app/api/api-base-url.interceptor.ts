import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from './api-base-url.token';

const isRootRelative = (url: string): boolean => url.startsWith('/') && !url.startsWith('//');

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl: string = inject(API_BASE_URL);
  return next(isRootRelative(req.url) ? req.clone({ url: baseUrl + req.url }) : req);
};
