import { Component, inject, ElementRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { PlausibleService } from '../../services/plausible.service';
import { GameFilters } from '../../models/game.model';
import { Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FilterBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private plausible = inject(PlausibleService);
  private meta = inject(Meta);
  private title = inject(Title);
  private el = inject(ElementRef);
  private baseHref = inject(APP_BASE_HREF, { optional: true }) ?? '/';

  filters: GameFilters = {
    query: '',
    duration: [],
    platforms: [],
    price: [],
    multiplayerType: [],
    playerCount: null,
  };

  ngOnInit(): void {
    const base = this.baseHref.endsWith('/') ? this.baseHref : this.baseHref + '/';
    (this.el.nativeElement as HTMLElement).style.setProperty(
      '--circuit-bg',
      `url('${base}circuit.svg')`
    );
  }

  constructor() {
    this.title.setTitle('Play With Friends - Games for Groups');
    this.meta.updateTag({ name: 'description', content: 'A curated collection of the best multiplayer games to play with friends — web games, co-op PC games, party games and more.' });
    this.meta.updateTag({ property: 'og:title', content: 'Play With Friends - Games for Groups' });
    this.meta.updateTag({ property: 'og:description', content: 'Find the perfect game to play with your friends online or locally.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  onFiltersChange(f: GameFilters): void {
    this.filters = f;
  }

  search(): void {
    const params: Record<string, string> = {};
    if (this.filters.query) params['q'] = this.filters.query;
    if (this.filters.duration.length) params['duration'] = this.filters.duration.join(',');
    if (this.filters.platforms.length) params['platform'] = this.filters.platforms.join(',');
    if (this.filters.price.length) params['price'] = this.filters.price.join(',');
    if (this.filters.multiplayerType.length) params['type'] = this.filters.multiplayerType.join(',');
    if (this.filters.playerCount !== null) params['players'] = String(this.filters.playerCount);

    this.plausible.event('Search');
    this.router.navigate(['/games'], { queryParams: params });
  }
}
