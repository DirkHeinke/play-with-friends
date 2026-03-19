import { Injectable } from '@angular/core';
import lunr from 'lunr';
import { Game } from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private index: lunr.Index | null = null;
  private gamesMap = new Map<string, Game>();

  buildIndex(games: Game[]): void {
    this.gamesMap.clear();
    games.forEach(g => this.gamesMap.set(g.slug, g));

    this.index = lunr(function () {
      this.ref('slug');
      this.field('title', { boost: 10 });
      this.field('description', { boost: 3 });
      this.field('tags', { boost: 5 });
      this.field('platforms');
      this.field('multiplayerType');
      this.field('controls');
      this.field('duration');

      games.forEach(game => {
        this.add({
          slug: game.slug,
          title: game.title,
          description: game.description ?? '',
          tags: game.tags.join(' '),
          platforms: game.platforms.join(' '),
          multiplayerType: game.multiplayerType.join(' '),
          controls: game.controls.join(' '),
          duration: game.duration.join(' '),
        });
      });
    });
  }

  search(query: string): Game[] {
    if (!this.index || !query.trim()) return [];

    try {
      // Try wildcard search first for partial matches
      const wildcardQuery = query.trim().split(/\s+/).map(t => `${t}*`).join(' ');
      let results = this.index.search(wildcardQuery);

      // Fall back to fuzzy if no results
      if (results.length === 0) {
        const fuzzyQuery = query.trim().split(/\s+/).map(t => `${t}~1`).join(' ');
        results = this.index.search(fuzzyQuery);
      }

      return results
        .map(r => this.gamesMap.get(r.ref))
        .filter((g): g is Game => g !== undefined);
    } catch {
      return [];
    }
  }
}
