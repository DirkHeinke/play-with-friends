import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { GamesService } from '../../services/games.service';
import { SearchService } from '../../services/search.service';
import { PlausibleService } from '../../services/plausible.service';
import {
  Game,
  GameFilters,
  Duration,
  Platform,
  PriceLabel,
  MultiplayerType,
  Control,
} from '../../models/game.model';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-games',
  imports: [GameCardComponent, FilterBarComponent],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css',
})
export class GamesComponent implements OnInit {
  private gamesService = inject(GamesService);
  private searchService = inject(SearchService);
  private plausible = inject(PlausibleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private meta = inject(Meta);
  private titleService = inject(Title);

  allGames: Game[] = [];
  filters = signal<GameFilters>({
    query: '',
    duration: [],
    platforms: [],
    price: [],
    multiplayerType: [],
    playerCount: null,
    controls: [],
  });

  filteredGames = signal<Game[]>([]);

  ngOnInit(): void {
    this.titleService.setTitle('Games - Play With Friends');
    this.meta.updateTag({
      name: 'description',
      content:
        'Browse all multiplayer games — filter by platform, price, duration and number of players.',
    });

    this.allGames = this.gamesService.getAllGames();
    this.searchService.buildIndex(this.allGames);

    // Read initial filters from query params
    const params = this.route.snapshot.queryParamMap;
    const initial: GameFilters = {
      query: params.get('q') ?? '',
      duration: (params.get('duration')?.split(',') ?? []) as Duration[],
      platforms: (params.get('platform')?.split(',') ?? []) as Platform[],
      price: (params.get('price')?.split(',') ?? []) as PriceLabel[],
      multiplayerType: (params.get('type')?.split(',') ?? []) as MultiplayerType[],
      playerCount: params.get('players') ? parseInt(params.get('players')!, 10) : null,
      controls: (params.get('controls')?.split(',') ?? []) as Control[],
    };
    this.filters.set(initial);
    this.applyFilters(initial);
  }

  onFiltersChange(f: GameFilters): void {
    this.filters.set(f);
    this.applyFilters(f);
    this.syncQueryParams(f);
    this.plausible.event('Filter');
  }

  private applyFilters(f: GameFilters): void {
    let base: Game[];

    if (f.query.trim()) {
      base = this.searchService.search(f.query);
    } else {
      base = this.allGames;
    }

    const result = this.gamesService.filterGames(base, f);
    this.filteredGames.set(result);
  }

  private syncQueryParams(f: GameFilters): void {
    const params: Record<string, string | null> = {
      q: f.query || null,
      duration: f.duration.length ? f.duration.join(',') : null,
      platform: f.platforms.length ? f.platforms.join(',') : null,
      price: f.price.length ? f.price.join(',') : null,
      type: f.multiplayerType.length ? f.multiplayerType.join(',') : null,
      players: f.playerCount !== null ? String(f.playerCount) : null,
      controls: f.controls.length ? f.controls.join(',') : null,
    };
    this.router.navigate([], { queryParams: params, replaceUrl: true });
  }
}
