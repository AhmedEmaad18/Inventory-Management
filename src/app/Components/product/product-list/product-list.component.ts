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
  styleUrls: ['./product-list.component.css'] 
})
export class ProductListComponent {
  products: Product[] = [];
  filteredProducts: Product[] = []; // Array to hold filtered products based on search and category
  searchTerm: string = ''; // Search term for filtering products
  selectedCategory: string = ''; // Selected category for filtering
  uniqueCategories: string[] = []; // Array to hold unique product categories

  constructor(private productService: ProductService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts(); // Load products when the component initializes
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
      this.extractUniqueCategories();
    });
  }

  extractUniqueCategories() {
    // Get unique categories from the products array
    const categories = this.products.map(product => product.category);
    this.uniqueCategories = Array.from(new Set(categories)); // Use Set to filter unique categories
  }

  editProduct(id: string) {
    // Navigate to the edit product page with the selected product ID
    this.router.navigate(['/edit-product', id]);
  }

  deleteProduct(id: string) {
    // Open confirmation dialog before deleting a product
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If confirmed, delete the product and reload the product list
        this.productService.deleteProduct(id).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  searchProducts() {
    // Filter products based on the search term and selected category
    this.filteredProducts = this.products.filter(product =>
      (product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.selectedCategory ? product.category === this.selectedCategory : true)
    );
  }

  filterByCategory() {
    // Trigger search when filtering by category
    this.searchProducts();
  }
}
