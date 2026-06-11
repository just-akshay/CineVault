import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Unified Media Details Route (Handles both Movies & TV Shows/Anime)
  { 
    path: 'details/:type/:id', 
    loadComponent: () => import('./features/movie-details/pages/movie-details-page/movie-details-page')
      .then(m => m.MovieDetailsPageComponent) 
  },

  // 2. Advanced Filter Page Route
  { 
    path: 'discover', 
    loadComponent: () => import('./features/filter/pages/filter-page/filter-page')
      .then(m => m.FilterPageComponent) 
  },

  // 3. Search Dashboard Route
  {
    path: 'search',
    loadComponent: () => import('./features/search/pages/search-page/search-page')
      .then(m => m.SearchPageComponent),
  },

  // 4. Personalized Vault Route
  {
    path: 'vault',
    loadComponent: () => import('./features/vault/pages/vault-page/vault-page')
      .then(m => m.VaultPageComponent),
  },

  // 5. Core Entry Point (Lazy-Loaded Home Dashboard)
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home-page/home-page')
      .then(m => m.HomePageComponent),
  },

  // 6. Wildcard Catch-All (CRUCIAL: Must always be at the absolute bottom!)
  {
    path: '**',
    redirectTo: '',
  }
];