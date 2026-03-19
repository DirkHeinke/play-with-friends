import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Game, getPriceLabel, getPlayersLabel } from '../../models/game.model';

@Component({
  selector: 'app-game-card',
  imports: [RouterLink],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css',
})
export class GameCardComponent {
  @Input({ required: true }) game!: Game;

  get priceLabel(): string {
    const label = getPriceLabel(this.game.price);
    if (label === 'free') return 'free';
    return `${label} (~€${this.game.price})`;
  }

  get priceCssClass(): string {
    return `price-${getPriceLabel(this.game.price)}`;
  }

  get playersLabel(): string {
    return getPlayersLabel(this.game.players);
  }

  get durationLabel(): string {
    return this.game.duration.join(' - ');
  }
}
