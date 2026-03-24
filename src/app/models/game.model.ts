import { z } from 'zod';
import { GameSchema, GameFiltersSchema } from './game.schema';

export type GamePlayers = z.infer<typeof GameSchema>['players'];
export type Game = z.infer<typeof GameSchema>;
export type GameFilters = z.infer<typeof GameFiltersSchema>;

export type Duration = Game['duration'][number];
export type Platform = Game['platforms'][number];
export type MultiplayerType = Game['multiplayerType'][number];
export type Control = Game['controls'][number];
export type PriceLabel = GameFilters['price'][number];

export function getPriceLabel(price: number): PriceLabel {
  if (price === 0) return 'free';
  if (price < 10) return 'cheap';
  if (price < 20) return 'medium';
  return 'expensive';
}

export function getPlayersLabel(players: GamePlayers): string {
  const max = players.softLimit === true ? `${players.max}+` : `${players.max}`;
  return `${players.min} - ${max}`;
}
