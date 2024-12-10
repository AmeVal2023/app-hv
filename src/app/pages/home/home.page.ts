//home.page.ts
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore'; // Agrega `doc` y `getDoc`
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'Free';
  userSubscriptionType: string = '';
  noAccessMessage: string = '';

  constructor(public firestore: Firestore, public auth: Auth) {}

  ngOnInit() {
    this.initializeData();
  }
  
  async initializeData() {
    console.log('Initializing data...');
    
    // Obtén el tipo de suscripción del usuario
    await this.getUserSubscriptionType();
    
    // Carga los productos desde Firestore
    await this.loadProducts();
    
    // Aplica el filtro inicial
    this.filterProducts();
  }
  
  filterProducts() {
    console.log('Filtering products with userSubscriptionType:', this.userSubscriptionType);
  
    if (!this.userSubscriptionType) {
      console.warn('UserSubscriptionType is not yet set. Skipping filtering.');
      return;
    }
  
    const subscriptionHierarchy = ['Free', 'Premium', 'Deluxe'];
    const userLevel = subscriptionHierarchy.indexOf(this.userSubscriptionType);
  
    // Filtra los productos basándose en el nivel de suscripción y la categoría seleccionada
    this.filteredProducts = this.products.filter((product) => {
      const productLevel = subscriptionHierarchy.indexOf(product.category);
  
      console.log(
        `Product: ${product.title} | User Level: ${userLevel} | Product Level: ${productLevel}`
      );
  
      return (
        productLevel <= userLevel &&
        product.category === this.selectedCategory &&
        product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  
    console.log('Filtered products:', this.filteredProducts);
  
    // Configura el mensaje si no hay productos visibles
    if (this.filteredProducts.length === 0) {
      this.noAccessMessage = `You don't have access to ${this.selectedCategory} products. Upgrade your subscription to view them.`;
    } else {
      this.noAccessMessage = ''; // Resetea el mensaje si hay productos visibles
    }
  }  

  async getUserSubscriptionType() {
    const userUid = this.auth.currentUser?.uid;
    if (!userUid) {
      console.error('User UID not found');
      return;
    }
    
    console.log('Authenticated User UID:', userUid);
  
    // Acceder directamente al documento usando el Document ID (UID)
    const userDocRef = doc(this.firestore, `users/${userUid}`);
    const userDocSnap = await getDoc(userDocRef);
  
    if (userDocSnap.exists()) {
      this.userSubscriptionType = userDocSnap.data()['subscriptionType'];
      console.log('User subscription type set to:', this.userSubscriptionType);
    } else {
      console.warn('No user data found for this UID');
      this.userSubscriptionType = 'Free'; // Valor predeterminado
    }
  
    this.filterProducts(); // Filtrar productos una vez obtenido el tipo de suscripción
  }
  
    async loadProducts() {
    const productCollection = collection(this.firestore, 'products');
    const productSnapshot = await getDocs(productCollection);
  
    this.products = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    console.log('Loaded products:', this.products);
    this.filterProducts();
  }
  
  viewProduct(product: any) {
    // Navegar a la página de detalles del producto
    console.log('View product:', product);
  }

  goToProfile() {
    console.log('Navigating to profile...');
    // Reemplaza esto con la lógica de navegación de tu proyecto
    window.location.href = '/tabs/profile'; // Si estás usando rutas
  }
  
}
