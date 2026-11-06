import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'PhotoPortfolio',
    loadComponent: () => import('./pages/welcome/welcome').then((m) => m.Welcome),
  },
  {
    path: 'photos',
    title: 'Photos | PhotoPortfolio',
    loadComponent: () => import('./pages/photos/photos').then((m) => m.Photos),
  },
  { path: '**', redirectTo: '' },
];
