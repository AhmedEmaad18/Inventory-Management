import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { Product } from '../../../Models/Product';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  uniqueCategories: string[] = [];

  constructor(private productService: ProductService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
      this.extractUniqueCategories();
    });
  }

  extractUniqueCategories() {
    const categories = this.products.map(product => product.category);
    this.uniqueCategories = Array.from(new Set(categories));
  }

  editProduct(id: string) {
    this.router.navigate(['/edit-product', id]);
  }

  deleteProduct(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  searchProducts() {
    this.filteredProducts = this.products.filter(product =>
      (product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.selectedCategory ? product.category === this.selectedCategory : true)
    );
  }

  filterByCategory() {
    this.searchProducts(); 
  }
}
