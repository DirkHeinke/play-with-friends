export interface GamePlayers {
  min: number;
  max: number;
  softLimit: boolean | null;
}

export type Duration = 'short' | 'medium' | 'long';
export type Platform = 'web' | 'windows' | 'linux' | 'macos';
export type MultiplayerType = 'local' | 'remote';
export type Control = 'smartphone-controller';
export type PriceLabel = 'free' | 'cheap' | 'medium' | 'expensive';

export interface Game {
  slug: string;
  title: string;
  description: string | null;
  url: string;
  players: GamePlayers;
  price: number;
  duration: Duration[];
  platforms: Platform[];
  multiplayerType: MultiplayerType[];
  tags: string[];
  controls: Control[];
  image: string | null;
}

export interface GameFilters {
  query: string;
  duration: Duration[];
  platforms: Platform[];
  price: PriceLabel[];
  multiplayerType: MultiplayerType[];
  playerCount: number | null;
}

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
