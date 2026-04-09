import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { GamesService } from './services/games.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'games',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'games/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const gamesService = inject(GamesService);
      return gamesService.getAllSlugs().map((slug) => ({ slug }));
    },
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'imprint',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
