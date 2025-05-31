import { Routes } from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard/dashboard.component';
import {ProductosComponent} from './components/productos/productos/productos.component';
import {CategoriasComponent} from './components/categorias/categorias/categorias.component';
import {VentasComponent} from './components/ventas/ventas/ventas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // 👈 redirección por default
  { path: 'dashboard', component: DashboardComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'ventas', component: VentasComponent },
];
