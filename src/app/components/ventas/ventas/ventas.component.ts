import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { addDoc, collection, collectionData, doc, Firestore, getDoc, updateDoc, query, orderBy } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
}

interface Venta {
  id?: string;
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  fecha: string;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule], // Added AsyncPipe as it's used in your template
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  productos$: Observable<Producto[]>;
  ventas$: Observable<Venta[]>;
  productoSeleccionado = '';
  cantidad = 1;
  mensaje = '';
  cargando = false;

  constructor(private firestore: Firestore) {
    const productosRef = collection(this.firestore, 'productos');
    this.productos$ = collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>;

    const ventasQuery = query(
      collection(this.firestore, 'ventas'),
      orderBy('fecha', 'desc')
    );
    this.ventas$ = collectionData(ventasQuery, { idField: 'id' }) as Observable<Venta[]>;
  }

  async registrarVenta() {
    if (!this.productoSeleccionado || this.cantidad <= 0) {
      this.mensaje = '❌ Completa todos los campos correctamente';
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    try {
      const productoRef = doc(this.firestore, `productos/${this.productoSeleccionado}`);
      const productoSnap = await getDoc(productoRef);

      if (!productoSnap.exists()) {
        this.mensaje = '❌ El producto no existe.';
        this.cargando = false;
        return;
      }

      const productoData = productoSnap.data() as Producto;

      if (productoData.stock < this.cantidad) {
        this.mensaje = `⚠️ Stock insuficiente. Disponible: ${productoData.stock}`;
        this.cargando = false;
        return;
      }

      // Calcula total de venta
      const totalVenta = productoData.precio * this.cantidad;

      // Registra la venta en Firestore
      await addDoc(collection(this.firestore, 'ventas'), {
        productoId: productoSnap.id, // aquí sí sacamos el id correcto
        productoNombre: productoData.nombre,
        cantidad: this.cantidad,
        precioUnitario: productoData.precio,
        total: totalVenta,
        fecha: new Date().toISOString()
      });

      // Actualiza stock
      const nuevoStock = productoData.stock - this.cantidad;
      await updateDoc(productoRef, { stock: nuevoStock });

      this.mensaje = `✅ Venta registrada: ${productoData.nombre} x${this.cantidad} - Total: $${totalVenta.toFixed(2)}`;
      this.productoSeleccionado = '';
      this.cantidad = 1;
    } catch (error) {
      console.error('Error al registrar venta:', error);
      this.mensaje = '❌ Error al registrar la venta';
    } finally {
      this.cargando = false;
    }
  }

  ngOnInit(): void {}
}
