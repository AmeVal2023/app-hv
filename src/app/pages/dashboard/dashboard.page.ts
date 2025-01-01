//dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDoc, getDocs, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  products: any[] = [];
  users: any[] = [];
  selectedProduct: any = null;
  subitems: any[] = [];
  form: FormGroup;
  notificationForm: FormGroup;
  private backendUrl = 'http://localhost:3000/send-notification';
  private currentUserId: string | null = null;

  constructor(
    private firestore: Firestore,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private auth: Auth
  ) {
    // Inicializar formularios
    this.form = this.fb.group({
      title: [''],
      description: [''],
      category: ['Free'], // Free, Premium, Deluxe
    });
    this.notificationForm = this.fb.group({
      titleNotification: [''],
      message: [''],
      userId: [''], // ID del usuario al que se enviará la notificación
    });

    // Monitorear autenticación del usuario
    this.monitorAuthState();
  }

  ngOnInit() {
    this.loadProducts();
    this.loadUsers();
  }

  // Monitorear el estado de autenticación del usuario
  private monitorAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        console.log('Usuario autenticado:', user);
      } else {
        this.currentUserId = null;
        console.warn('Usuario no autenticado.');
      }
    });
  }

  // Enviar notificación al backend
  async sendNotification() {
    const { titleNotification, message, userId } = this.notificationForm.value;
  
    console.log('Enviando notificación con los datos:', {
      userId, // Este ahora es el ID real del usuario
      titleNotification,
      message,
    });
  
    if (!userId) {
      console.error('ID de usuario no especificado.');
      return;
    }
  
    const payload = { userId, title: titleNotification, body: message };
  
    try {
      const response = await this.http.post(this.backendUrl, payload).toPromise();
      console.log('Respuesta del backend:', response);
    } catch (error) {
      console.error('Error al enviar la notificación desde el dashboard:', error);
    }
  }

  // Cargar usuarios
  async loadUsers() {
    try {
      const usersRef = collection(this.firestore, 'users');
      const snapshot = await getDocs(usersRef);
  
      this.users = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const userData: any = { id: docSnap.id, ...docSnap.data(), token: null }; // Declara token con valor inicial null
          const tokenRef = doc(this.firestore, `userTokens/${docSnap.id}`);
          const tokenDoc = await getDoc(tokenRef);
  
          if (tokenDoc.exists() && tokenDoc.data()?.['token']) {
            userData.token = tokenDoc.data()['token']; // Accede de forma segura con indexación
          }
  
          return userData;
        })
      );
  
      // Filtrar solo los usuarios que tienen tokens
      this.users = this.users.filter((user) => !!user.token); // Filtrar usuarios con token válido
      console.log('Usuarios con tokens válidos:', this.users);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  }
  
  

  // Cargar productos
  async loadProducts() {
    try {
      const productsRef = collection(this.firestore, 'products');
      const snapshot = await getDocs(productsRef);
      this.products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }

  // Crear o editar un producto
  async saveProduct() {
    try {
      const productsRef = collection(this.firestore, 'products');

      if (this.selectedProduct) {
        const productRef = doc(this.firestore, `products/${this.selectedProduct.id}`);
        await updateDoc(productRef, this.form.value);
      } else {
        await addDoc(productsRef, this.form.value);
      }

      this.loadProducts();
      this.resetForm();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  }

  // Eliminar producto
  async deleteProduct(productId: string) {
    try {
      const productRef = doc(this.firestore, `products/${productId}`);
      await deleteDoc(productRef);
      this.loadProducts();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  }

  // Seleccionar producto para edición
  selectProduct(product: any) {
    this.selectedProduct = product;
    this.form.patchValue(product);
  }

  // Resetear formulario
  resetForm() {
    this.selectedProduct = null;
    this.form.reset();
    this.form.patchValue({ category: 'Free' });
  }

  // Ir a la página de subitems
  viewSubitems(productId: string) {
    this.router.navigate(['/subitems'], { queryParams: { productId } });
  }
}
