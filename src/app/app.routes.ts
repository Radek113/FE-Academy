import { Routes } from '@angular/router';
import { PHOTOS_SCOPE_PROVIDER } from './pages/photos/photos-scope.transloco';
import { WELCOME_SCOPE_PROVIDER } from './pages/welcome/welcome-scope.transloco';

export const routes: Routes = [
  {
    path: '',
    title: 'PhotoPortfolio',
    providers: [WELCOME_SCOPE_PROVIDER],
    loadComponent: () => import('./pages/welcome/welcome').then((m) => m.Welcome),
  },
  {
    path: 'photos',
    title: 'Photos | PhotoPortfolio',
    providers: [PHOTOS_SCOPE_PROVIDER],
    loadComponent: () => import('./pages/photos/photos').then((m) => m.Photos),
  },
  { path: '**', redirectTo: '' },
];
