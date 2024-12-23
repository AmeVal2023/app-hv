//dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  products: any[] = [];
  selectedProduct: any = null; // Producto seleccionado
  subitems: any[] = [];
  form: FormGroup;
  notificationForm: FormGroup; // Declarar notificationForm

  constructor(
    private firestore: Firestore,
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) {
    // Inicializar el formulario
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
  }

  ngOnInit() {
    this.loadProducts();
  }
  async sendNotification() {
    const { titleNotification, message, userId } = this.notificationForm.value;
    try {
      await this.notificationService.sendNotification(userId, titleNotification, message);
      console.log('Notificación enviada correctamente');
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
    }
  }

  // Cargar productos
  async loadProducts() {
    const productsRef = collection(this.firestore, 'products');
    const snapshot = await getDocs(productsRef);
    this.products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Crear o editar un producto
  async saveProduct() {
    const productsRef = collection(this.firestore, 'products');

    if (this.selectedProduct) {
      // Editar producto
      const productRef = doc(this.firestore, `products/${this.selectedProduct.id}`);
      await updateDoc(productRef, this.form.value);
    } else {
      // Crear producto
      await addDoc(productsRef, this.form.value);
    }

    this.loadProducts();
    this.resetForm();
  }

  // Eliminar producto
  async deleteProduct(productId: string) {
    const productRef = doc(this.firestore, `products/${productId}`);
    await deleteDoc(productRef);
    this.loadProducts();
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
