import { Component, OnInit, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner
} from '@ionic/angular';

import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { ProductService } from '../../services/product.service';
import { Product, ProductsResponse } from '../../models/product.model';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonSpinner,
    RouterLink,
    CurrencyPipe
  ],
})
export class ProductosPage implements OnInit {

  private productService = inject(ProductService);

  products: Product[] = [];

  loading = false;
  error = '';

  paginaActual = 1;
  productosPorPagina = 10;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getProducts().subscribe({
      next: (response: ProductsResponse) => {
        console.log('RESPUESTA API:', response);

        this.products = response.products;
        this.loading = false;

        console.log('PRODUCTOS:', this.products);
        console.log('LOADING:', this.loading);
      },

      error: (error) => {
        console.error('ERROR API:', error);

        this.error = 'No se han podido cargar los productos.';
        this.loading = false;
      }
    });
  }

  calcularStockValorado(product: Product): number {
    const totalSinDescuento =
      product.stock * product.price;

    const descuento =
      totalSinDescuento *
      (product.discountPercentage / 100);

    return totalSinDescuento - descuento;
  }

  get productosPaginados(): Product[] {
    const inicio =
      (this.paginaActual - 1) *
      this.productosPorPagina;

    const fin =
      inicio + this.productosPorPagina;

    return this.products.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(
      this.products.length /
      this.productosPorPagina
    );
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }
}