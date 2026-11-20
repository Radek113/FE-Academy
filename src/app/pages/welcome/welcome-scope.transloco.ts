import { Provider } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';

export const WELCOME_SCOPE = 'welcome';

export const WELCOME_SCOPE_PROVIDER: Provider = {
  provide: TRANSLOCO_SCOPE,
  useValue: WELCOME_SCOPE,
};
