import { Provider } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';

export const PHOTOS_SCOPE = 'photos';

export const PHOTOS_SCOPE_PROVIDER: Provider = {
  provide: TRANSLOCO_SCOPE,
  useValue: PHOTOS_SCOPE,
};
