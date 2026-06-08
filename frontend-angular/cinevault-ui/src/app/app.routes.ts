import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home-page/home-page').then(
        (m) => m.HomePage
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/pages/search-page/search-page').then(
        (m) => m.SearchPage
      ),
  },
  {
    path: 'vault',
    loadComponent: () =>
      import('./features/vault/pages/vault-page/vault-page').then(
        (m) => m.VaultPage
      ),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import(
        './features/movie-details/pages/movie-details-page/movie-details-page'
      ).then((m) => m.MovieDetailsPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];