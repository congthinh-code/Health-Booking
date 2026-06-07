import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/components/footer/footer';
import { Header } from "./shared/components/header/header";
import { Home } from "./home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, Home],
  // templateUrl: './app.html',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('health-booking-ui');
}
