import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Play With Friends - Games for Groups',
  },
  {
    path: 'games',
    loadComponent: () => import('./pages/games/games.component').then((m) => m.GamesComponent),
    title: 'Games - Play With Friends',
  },
  {
    path: 'games/:slug',
    loadComponent: () =>
      import('./pages/game-detail/game-detail.component').then((m) => m.GameDetailComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
    title: 'About - Play With Friends',
  },
  {
    path: 'imprint',
    loadComponent: () =>
      import('./pages/imprint/imprint.component').then((m) => m.ImprintComponent),
    title: 'Impressum / Legal Notice - Play With Friends',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
