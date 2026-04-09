import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  constructor() {
    inject(Title).setTitle('About - Play With Friends');
    inject(Meta).updateTag({
      name: 'description',
      content:
        'About Play With Friends — a curated list of multiplayer games for remote and local play with your friends.',
    });
  }
}
