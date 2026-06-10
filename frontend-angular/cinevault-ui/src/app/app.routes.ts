import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/pages/home-page/home-page';

// 1. Import your details component
import { MovieDetailsPageComponent } from './features/movie-details/pages/movie-details-page/movie-details-page';
export const routes: Routes = [

    // 2. Add the dynamic route for the movie details
{ path: 'details/:type/:id', component: MovieDetailsPageComponent },

  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home-page/home-page').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/pages/search-page/search-page').then(
        (m) => m.SearchPageComponent
      ),
  },
  {
    path: 'vault',
    loadComponent: () =>
      import('./features/vault/pages/vault-page/vault-page').then(
        (m) => m.VaultPageComponent
      ),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import(
        './features/movie-details/pages/movie-details-page/movie-details-page'
      ).then((m) => m.MovieDetailsPageComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
  { path: '', component: HomePageComponent },
  

];