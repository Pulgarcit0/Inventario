import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductoService } from '../../../core/producto.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Observable<any[]> = of([]);

  nuevo = { nombre: '', precio: 0, stock: 0 };
  editandoId: string | null = null;
  editando: any = { nombre: '', precio: 0, stock: 0 };

  mostrarConfirmacion = false;
  productoAEliminarId: string | null = null;
  productoAEliminarNombre = '';

  constructor(private servicio: ProductoService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productos = this.servicio.obtenerProductos();
  }

  guardarProducto(form: NgForm) {
    if (form.invalid || this.nuevo.precio <= 0 || this.nuevo.stock < 0) return;

    this.servicio.agregarProducto(this.nuevo).then(() => {
      this.nuevo = { nombre: '', precio: 0, stock: 0 };
      form.resetForm();
    }).catch(error => {
      console.error('Error al guardar producto:', error);
    });
  }

  confirmarEliminar(id: string, nombre: string) {
    this.productoAEliminarId = id;
    this.productoAEliminarNombre = nombre;
    this.mostrarConfirmacion = true;
  }

  eliminarProducto() {
    if (!this.productoAEliminarId) return;

    this.servicio.eliminarProducto(this.productoAEliminarId).then(() => {
      this.mostrarConfirmacion = false;
    }).catch(error => {
      console.error('Error al eliminar producto:', error);
      this.mostrarConfirmacion = false;
    });
  }

  editarProducto(p: any) {
    this.editandoId = p.id;
    this.editando = { ...p };
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.editando = { nombre: '', precio: 0, stock: 0 };
  }

  guardarEdicion(form: NgForm) {
    if (form.invalid || !this.editandoId || this.editando.precio <= 0 || this.editando.stock < 0) return;

    this.servicio.actualizarProducto(this.editandoId, this.editando).then(() => {
      this.cancelarEdicion();
    }).catch(error => {
      console.error('Error al actualizar producto:', error);
    });
  }
}
