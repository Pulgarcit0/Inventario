import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'inventario-inteligente';
}
