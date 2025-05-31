import { Injectable } from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productosRef;

  constructor(private firestore: Firestore) {
    this.productosRef = collection(this.firestore, 'productos');
  }

  obtenerProductos() {
    return collectionData(this.productosRef, { idField: 'id' });
  }

  agregarProducto(producto: any) {
    return addDoc(this.productosRef, producto);
  }

  eliminarProducto(id: string) {
    const ref = doc(this.firestore, `productos/${id}`);
    return deleteDoc(ref);
  }

  actualizarProducto(id: string, data: any) {
    const ref = doc(this.firestore, `productos/${id}`);
    return updateDoc(ref, data);
  }
}
