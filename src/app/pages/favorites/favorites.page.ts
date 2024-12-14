//favorites.service.ts
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favoriteProducts: any[] = []; // Lista completa de productos favoritos
  filteredProducts: any[] = []; // Lista filtrada según la búsqueda
  isLoading: boolean = true;
  searchTerm: string = ''; // Para la barra de búsqueda
  products: any[] = [];

  constructor(public firestore: Firestore, public auth: Auth, public favoritesService: FavoritesService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  async loadFavorites() {
    try {
        this.isLoading = true;

        // Espera hasta que el usuario esté autenticado
        while (!this.auth.currentUser) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const favoriteIds = await this.favoritesService.getFavorites();
        const productCollection = collection(this.firestore, 'products');
        const productSnapshot = await getDocs(productCollection);

        this.favoriteProducts = productSnapshot.docs
            .filter((doc) => favoriteIds.includes(doc.id))
            .map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            
        // Asegúrate de inicializar `filteredProducts` aquí
        this.filteredProducts = [...this.favoriteProducts];

        console.log('Favorite products:', this.favoriteProducts);
    } catch (error) {
        console.error('Error loading favorites:', error);
    } finally {
        this.isLoading = false;
    }
  }

  // Filtrar productos favoritos según el término de búsqueda
  filterProducts() {
    const searchTermLower = this.searchTerm.toLowerCase();

    // Filtra la lista de productos favoritos por título o descripción
    this.filteredProducts = this.favoriteProducts.filter(product =>
      product.title.toLowerCase().includes(searchTermLower) ||
      product.description.toLowerCase().includes(searchTermLower)
    );
  }
  
  viewProduct(product: any) {
    // Navegar a la página de detalles del producto
    console.log('View product:', product);
  }

  async removeFromFavorites(productId: string) {
    try {
      await this.favoritesService.removeFavorite(productId);
      this.favoriteProducts = this.favoriteProducts.filter((product) => product.id !== productId);
      console.log(`Product ${productId} removed from favorites`);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

}
