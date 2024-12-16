//product-detail.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  productId: string = ''; // ID del producto seleccionado
  productTitle: string = ''; // Título del producto
  productImage: string = ''; // Imagen del producto
  subitems: any[] = []; // Lista de subitems del producto
  isLoading: boolean = true; // Indicador de carga

  constructor(private route: ActivatedRoute, private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || ''; // Obtén el ID del producto desde la URL
    console.log('Product ID:', this.productId);
    if (this.productId) {
      this.loadProductDetails();
    } else {
      console.error('Product ID not found in route');
    }
  }

  async loadProductDetails() {
    try {
      this.isLoading = true;
  
      const productDocRef = doc(this.firestore, `products/${this.productId}`);
      const productDocSnap = await getDoc(productDocRef);
  
      if (productDocSnap.exists()) {
        const productData = productDocSnap.data();
        this.productTitle = productData['title'];
        this.productImage = productData['image'];
  
        const subitemIds = productData['subitems'] || [];
        console.log('Subitem IDs from Product:', subitemIds); // <-- Verificar IDs de subitems
  
        this.subitems = await this.loadSubitems(subitemIds);
        console.log('Loaded Subitems:', this.subitems); // <-- Verificar subitems cargados
      } else {
        console.error('Product not found in Firestore');
      }
    } catch (error) {
      console.error('Error loading product details:', error);
    } finally {
      this.isLoading = false;
    }
  }
  

  async loadSubitems(subitemIds: string[]): Promise<any[]> {
    try {
      const subitemsCollection = collection(this.firestore, 'subitems');
      const subitemsSnapshot = await getDocs(subitemsCollection);
  
      // Tipar los subitems para que TypeScript reconozca las propiedades
      return subitemsSnapshot.docs
        .filter((doc) => subitemIds.includes(doc.id))
        .map((doc) => ({ id: doc.id, ...doc.data() } as { id: string; order: number })) // Definir el tipo
        .sort((a, b) => a.order - b.order); // Ordenar por el campo 'order'
    } catch (error) {
      console.error('Error loading subitems:', error);
      return [];
    }
  }
  
  

  viewSubitem(subitem: any) {
    if (!this.subitems || this.subitems.length === 0) {
      console.error('Subitems list is empty. Cannot navigate.');
      return;
    }
  
    console.log('Navigating to subitem detail:', subitem);
    console.log('Subitem IDs:', this.subitems.map(item => item.id)); // <-- Verificar IDs ordenados
  
    const subitemIds = this.subitems.map(item => item.id);
    this.router.navigate(['/subitem-detail', subitem.id], {
      queryParams: {
        productId: this.productId, // Verificar si productId es correcto
        subitemIds: JSON.stringify(subitemIds),
      },
    });
  }
  
  
  
}
