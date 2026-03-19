import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { GamesService } from '../../services/games.service';
import { Game, getPriceLabel, getPlayersLabel } from '../../models/game.model';

@Component({
  selector: 'app-game-detail',
  imports: [RouterLink],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.css',
})
export class GameDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gamesService = inject(GamesService);
  private meta = inject(Meta);
  private titleService = inject(Title);
  private document = inject(DOCUMENT);

  game: Game | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const game = this.gamesService.getGameBySlug(slug);

    if (!game) {
      this.router.navigate(['/games']);
      return;
    }

    this.game = game;
    this.setMeta(game);
    this.addJsonLd(game);
  }

  get priceLabel(): string {
    if (!this.game) return '';
    const label = getPriceLabel(this.game.price);
    if (label === 'free') return 'Free';
    return `${label.charAt(0).toUpperCase() + label.slice(1)} (~€${this.game.price})`;
  }

  get priceCssClass(): string {
    return this.game ? `price-${getPriceLabel(this.game.price)}` : '';
  }

  get playersLabel(): string {
    return this.game ? getPlayersLabel(this.game.players) : '';
  }

  get durationLabel(): string {
    return this.game ? this.game.duration.join(' - ') : '';
  }

  private setMeta(game: Game): void {
    const desc = game.description ?? `${game.title} — a multiplayer game for ${getPlayersLabel(game.players)} players. Play with friends online or locally.`;
    this.titleService.setTitle(`${game.title} - Play With Friends`);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: `${game.title} - Play With Friends` });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  private addJsonLd(game: Game): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: game.title,
      applicationCategory: 'Game',
      operatingSystem: game.platforms.join(', '),
      offers: {
        '@type': 'Offer',
        price: game.price,
        priceCurrency: 'EUR',
      },
      url: game.url,
      description: game.description ?? undefined,
    };

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
