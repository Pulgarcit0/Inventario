import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Categoria {
  id?: string;
  nombre: string;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias$: Observable<Categoria[]>;
  nuevaCategoria = '';
  mensaje = '';

  constructor(private firestore: Firestore) {
    const catRef = collection(this.firestore, 'categorias');
    this.categorias$ = collectionData(catRef, { idField: 'id' }) as Observable<Categoria[]>;
  }

  async agregarCategoria() {
    if (!this.nuevaCategoria.trim()) {
      this.mensaje = '❌ Ingresa un nombre válido';
      return;
    }

    try {
      await addDoc(collection(this.firestore, 'categorias'), {
        nombre: this.nuevaCategoria.trim()
      });

      this.mensaje = '✅ Categoría agregada';
      this.nuevaCategoria = '';
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      this.mensaje = '❌ Error al agregar categoría';
    }
  }

  async eliminarCategoria(id: string) {
    try {
      await deleteDoc(doc(this.firestore, `categorias/${id}`));
      this.mensaje = '✅ Categoría eliminada';
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      this.mensaje = '❌ Error al eliminar categoría';
    }
  }

  ngOnInit(): void {}
}
