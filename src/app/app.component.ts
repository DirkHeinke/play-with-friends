import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
