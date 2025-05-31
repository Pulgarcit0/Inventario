import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalProductos = 0;
  totalCategorias = 0;
  totalVentas = 0;

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const productosSnap = await getDocs(collection(this.firestore, 'productos'));
    const categoriasSnap = await getDocs(collection(this.firestore, 'categorias'));
    const ventasSnap = await getDocs(collection(this.firestore, 'ventas'));

    this.totalProductos = productosSnap.size;
    this.totalCategorias = categoriasSnap.size;
    this.totalVentas = ventasSnap.size;

    // Mapea productoId => nombre
    const mapaProductos = new Map<string, string>();
    productosSnap.forEach(doc => {
      const producto = doc.data();
      mapaProductos.set(doc.id, producto['nombre']);
    });

    const productoConteo: { [key: string]: number } = {};
    const ventasPorFecha: { [fecha: string]: number } = {};

    ventasSnap.forEach((doc) => {
      const venta = doc.data();
      const nombreProducto = mapaProductos.get(venta['productoId']) || venta['productoId'];

      if (!productoConteo[nombreProducto]) productoConteo[nombreProducto] = 0;
      productoConteo[nombreProducto] += venta['cantidad'];

      const fecha = new Date(venta['fecha']).toLocaleDateString();
      if (!ventasPorFecha[fecha]) ventasPorFecha[fecha] = 0;
      ventasPorFecha[fecha] += venta['cantidad'];
    });

    const labels = Object.keys(productoConteo);
    const data = Object.values(productoConteo);

    const fechas = Object.keys(ventasPorFecha);
    const valores = Object.values(ventasPorFecha);

    this.crearGraficaBarras(labels, data);
    this.crearGraficaLineas(fechas, valores);
  }

  crearGraficaBarras(labels: string[], data: number[]) {
    new Chart('ventasChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Productos más vendidos',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Top productos vendidos'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  crearGraficaLineas(labels: string[], data: number[]) {
    new Chart('ventasDiaChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ventas por día',
            data: data,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Ventas diarias'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
