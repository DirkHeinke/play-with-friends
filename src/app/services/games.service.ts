import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, shareReplay, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Game, GameFilters, getPriceLabel } from '../models/game.model';

// Statically import all game JSON files so they are bundled and available
// for SSG prerendering without HTTP calls.
import factorio from '../../data/games/factorio.json';
import garticPhone from '../../data/games/gartic-phone.json';
import skribblIo from '../../data/games/skribbl-io.json';
import codenames from '../../data/games/codenames.json';
import whereIsThisCity from '../../data/games/where-is-this-city.json';
import stopots from '../../data/games/stopots.json';
import pretendYoureXyzzy from '../../data/games/pretend-youre-xyzzy.json';
import dontStarveTogether from '../../data/games/dont-starve-together.json';
import parkitect from '../../data/games/parkitect.json';
import nidhogg from '../../data/games/nidhogg.json';
import broforce from '../../data/games/broforce.json';
import rocketLeague from '../../data/games/rocket-league.json';
import couchSumo from '../../data/games/couch-sumo.json';
import categoriesGame from '../../data/games/categories-game.json';
import brokenPicturephone from '../../data/games/broken-picturephone.json';
import hanab from '../../data/games/hanab.json';
import telewave from '../../data/games/telewave.json';
import playingcardsIo from '../../data/games/playingcards-io.json';
import wordraceBloob from '../../data/games/wordrace-bloob.json';
import fourInARowBloob from '../../data/games/four-in-a-row-bloob.json';
import rottenApplesBloob from '../../data/games/rotten-apples-bloob.json';
import checkersBloob from '../../data/games/checkers-bloob.json';
import franticFanfic from '../../data/games/frantic-fanfic.json';
import askew from '../../data/games/askew.json';
import theVotesOut from '../../data/games/the-votes-out.json';
import blomberBloob from '../../data/games/blomber-bloob.json';
import eightBallPoolBloob from '../../data/games/8-ball-pool-bloob.json';
import bombpartyJklm from '../../data/games/bombparty-jklm.json';
import popsauceJklm from '../../data/games/popsauce-jklm.json';

const ALL_GAMES: Game[] = [
  factorio, garticPhone, skribblIo, codenames, whereIsThisCity,
  stopots, pretendYoureXyzzy, dontStarveTogether, parkitect, nidhogg,
  broforce, rocketLeague, couchSumo, categoriesGame, brokenPicturephone,
  hanab, telewave, playingcardsIo, wordraceBloob, fourInARowBloob,
  rottenApplesBloob, checkersBloob, franticFanfic, askew,
  theVotesOut, blomberBloob, eightBallPoolBloob, bombpartyJklm, popsauceJklm,
] as Game[];

@Injectable({ providedIn: 'root' })
export class GamesService {
  getAllGames(): Game[] {
    return ALL_GAMES;
  }

  getGameBySlug(slug: string): Game | undefined {
    return ALL_GAMES.find(g => g.slug === slug);
  }

  getAllSlugs(): string[] {
    return ALL_GAMES.map(g => g.slug);
  }

  filterGames(games: Game[], filters: GameFilters): Game[] {
    return games.filter(game => {
      if (filters.duration.length > 0) {
        const hasMatch = filters.duration.some(d => game.duration.includes(d));
        if (!hasMatch) return false;
      }

      if (filters.platforms.length > 0) {
        const hasMatch = filters.platforms.some(p => game.platforms.includes(p));
        if (!hasMatch) return false;
      }

      if (filters.price.length > 0) {
        const gamePrice = getPriceLabel(game.price);
        if (!filters.price.includes(gamePrice)) return false;
      }

      if (filters.multiplayerType.length > 0) {
        const hasMatch = filters.multiplayerType.some(t => game.multiplayerType.includes(t));
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
