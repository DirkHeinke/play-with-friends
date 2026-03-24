import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class PlausibleService {
  private platformId = inject(PLATFORM_ID);

  event(name: string, props?: Record<string, string | number | boolean>): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const w = window as unknown as { plausible?: (name: string, opts?: { props?: Record<string, string | number | boolean> }) => void };
    if (typeof w['plausible'] !== 'function') return;

    w['plausible'](name, props ? { props } : undefined);
  }
}
