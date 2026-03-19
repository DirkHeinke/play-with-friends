import { Component, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-imprint',
  imports: [],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.css',
})
export class ImprintComponent {
  constructor() {
    inject(Title).setTitle('Impressum / Legal Notice - Play With Friends');
    inject(Meta).updateTag({ name: 'description', content: 'Impressum und Datenschutzerklärung / Legal Notice and Privacy Policy for playwithfriends.link.' });
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });
  }
}
