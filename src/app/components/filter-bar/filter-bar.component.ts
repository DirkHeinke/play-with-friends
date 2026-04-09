import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  GameFilters,
  Duration,
  Platform,
  PriceLabel,
  MultiplayerType,
  Control,
  getControlLabel,
} from '../../models/game.model';

@Component({
  selector: 'app-filter-bar',
  imports: [FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css',
})
export class FilterBarComponent {
  @Input() filters: GameFilters = this.emptyFilters();
  @Output() filtersChange = new EventEmitter<GameFilters>();

  durations: Duration[] = ['short', 'medium', 'long'];
  platforms: Platform[] = ['web', 'windows', 'macos', 'linux'];
  prices: PriceLabel[] = ['free', 'cheap', 'medium', 'expensive'];
  multiplayerTypes: MultiplayerType[] = ['remote', 'local'];
  controls: Control[] = ['smartphone-controller', 'game-controller'];
  getControlLabel = getControlLabel;

  emptyFilters(): GameFilters {
    return {
      query: '',
      duration: [],
      platforms: [],
      price: [],
      multiplayerType: [],
      playerCount: null,
      controls: [],
    };
  }

  toggleDuration(d: Duration): void {
    this.filters = {
      ...this.filters,
      duration: this.toggleItem(this.filters.duration, d),
    };
    this.filtersChange.emit(this.filters);
  }

  togglePlatform(p: Platform): void {
    this.filters = {
      ...this.filters,
      platforms: this.toggleItem(this.filters.platforms, p),
    };
    this.filtersChange.emit(this.filters);
  }

  togglePrice(p: PriceLabel): void {
    this.filters = {
      ...this.filters,
      price: this.toggleItem(this.filters.price, p),
    };
    this.filtersChange.emit(this.filters);
  }

  toggleMultiplayerType(t: MultiplayerType): void {
    this.filters = {
      ...this.filters,
      multiplayerType: this.toggleItem(this.filters.multiplayerType, t),
    };
    this.filtersChange.emit(this.filters);
  }

  toggleControl(c: Control): void {
    this.filters = {
      ...this.filters,
      controls: this.toggleItem(this.filters.controls, c),
    };
    this.filtersChange.emit(this.filters);
  }

  onQueryChange(q: string): void {
    this.filters = { ...this.filters, query: q };
    this.filtersChange.emit(this.filters);
  }

  onPlayerCountChange(val: string): void {
    const n = parseInt(val, 10);
    this.filters = { ...this.filters, playerCount: isNaN(n) ? null : n };
    this.filtersChange.emit(this.filters);
  }

  reset(): void {
    this.filters = this.emptyFilters();
    this.filtersChange.emit(this.filters);
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.filters.query ||
      this.filters.duration.length ||
      this.filters.platforms.length ||
      this.filters.price.length ||
      this.filters.multiplayerType.length ||
      this.filters.controls.length ||
      this.filters.playerCount !== null
    );
  }

  isActive<T>(arr: T[], val: T): boolean {
    return arr.includes(val);
  }

  private toggleItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }
}
