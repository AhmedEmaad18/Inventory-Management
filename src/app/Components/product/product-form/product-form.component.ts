import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../Models/Product';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  product: Product = { id: '', name: '', description: '', quantity: 0, price: 0, category: '' };

  // List of categories for the product
  categories: string[] = ['Electronics', 'Books', 'Clothing', 'Home Appliances', 'Toys'];

  constructor(
    private productService: ProductService, // Service to handle product-related operations
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.productService.getProducts().subscribe(products => {
        // Find the product by ID and assign it to the product object
        this.product = products.find(p => p.id === id) || this.product;
      });
    }
  }

  // Method to save the product (either add or update)
  saveProduct() {
    if (this.isFormValid()) {
      if (this.product.id) {
        this.productService.updateProduct(this.product).subscribe(() => {
          this.router.navigate(['/products']);
        });
      } else {
        this.productService.addProduct(this.product).subscribe(() => {
          this.snackBar.open('Product added successfully!', 'Close', {
            duration: 2000,
          });
          this.router.navigate(['/products']);
        });
      }
      console.log('Product saved:', this.product);
    } else {
      alert('Please fill in all required fields.');
    }
  }

  // Method to validate the form fields
  isFormValid() {
    return this.product.name &&
           this.product.quantity !== null &&
           this.product.description &&
           this.product.price !== null &&
           this.product.category; 
  }
}
