import { RenderMode, ServerRoute } from '@angular/ssr';

// All game slugs — keep in sync with src/data/games/*.json
const GAME_SLUGS = [
  '8-ball-pool-bloob',
  'askew',
  'blomber-bloob',
  'bombparty-jklm',
  'broforce',
  'broken-picturephone',
  'categories-game',
  'checkers-bloob',
  'codenames',
  'couch-sumo',
  'dont-starve-together',
  'factorio',
  'four-in-a-row-bloob',
  'frantic-fanfic',
  'gartic-phone',
  'hanab',
  'nidhogg',
  'oombi-io',
  'parkitect',
  'playingcards-io',
  'popsauce-jklm',
  'pretend-youre-xyzzy',
  'rocket-league',
  'rotten-apples-bloob',
  'skribbl-io',
  'stopots',
  'telewave',
  'the-votes-out',
  'where-is-this-city',
  'wordrace-bloob',
];

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
      return GAME_SLUGS.map(slug => ({ slug }));
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
