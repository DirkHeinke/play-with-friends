import { Injectable } from '@angular/core';
import { Game, GameFilters, getPriceLabel } from '../models/game.model';

// Auto-generated at build time by scripts/generate-index.mjs.
// To add a game, drop a JSON file into src/data/games/ and rebuild.
import ALL_GAMES_DATA from '../../data/games/index.json';

const ALL_GAMES = ALL_GAMES_DATA as unknown as Game[];

@Injectable({ providedIn: 'root' })
export class GamesService {
  getAllGames(): Game[] {
    return ALL_GAMES;
  }

  getGameBySlug(slug: string): Game | undefined {
    return ALL_GAMES.find((g) => g.slug === slug);
  }

  getAllSlugs(): string[] {
    return ALL_GAMES.map((g) => g.slug);
  }

  filterGames(games: Game[], filters: GameFilters): Game[] {
    return games.filter((game) => {
      if (filters.duration.length > 0) {
        const hasMatch = filters.duration.some((d) => game.duration.includes(d));
        if (!hasMatch) return false;
      }

      if (filters.platforms.length > 0) {
        const hasMatch = filters.platforms.some((p) => game.platforms.includes(p));
        if (!hasMatch) return false;
      }

      if (filters.price.length > 0) {
        const gamePrice = getPriceLabel(game.price);
        if (!filters.price.includes(gamePrice)) return false;
      }

      if (filters.multiplayerType.length > 0) {
        const hasMatch = filters.multiplayerType.some((t) => game.multiplayerType.includes(t));
        if (!hasMatch) return false;
      }

      if (filters.controls.length > 0) {
        const hasMatch = filters.controls.some((c) => game.controls.includes(c));
        if (!hasMatch) return false;
      }

      if (filters.playerCount !== null) {
        if (game.players.min > filters.playerCount) return false;
        if (game.players.max < filters.playerCount && game.players.softLimit !== true) return false;
      }

      return true;
    });
  }
}
