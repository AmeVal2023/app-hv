//product-detail.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, collection, getDocs } from '@angular/fire/firestore';

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

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

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

      // Obtén los detalles del producto desde Firebase
      const productDocRef = doc(this.firestore, `products/${this.productId}`);
      const productDocSnap = await getDoc(productDocRef);

      if (productDocSnap.exists()) {
        const productData = productDocSnap.data();
        this.productTitle = productData['title'];
        this.productImage = productData['image'];

        // Cargar subitems relacionados
        const subitemIds = productData['subitems'] || [];
        this.subitems = await this.loadSubitems(subitemIds);
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

      // Filtrar y mapear los subitems correspondientes a los IDs
      return subitemsSnapshot.docs
        .filter((doc) => subitemIds.includes(doc.id))
        .map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error loading subitems:', error);
      return [];
    }
  }

  viewSubitem(subitem: any) {
    // Navegar a la pantalla de detalle del subitem
    console.log('Viewing subitem:', subitem);
    // Aquí puedes implementar la navegación a la página de detalle del subitem
  }
}
