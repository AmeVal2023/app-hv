//subitems.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { arrayUnion } from '@angular/fire/firestore';

@Component({
  selector: 'app-subitems',
  templateUrl: './subitems.page.html',
  styleUrls: ['./subitems.page.scss'],
})
export class SubitemsPage implements OnInit {
  form: FormGroup;
  productId: string = '';
  subitems: any[] = []; // Lista de subitems
  selectedSubitem: any = null; // subitem seleccionado
  uploadProgress: boolean = false; // Indicador de carga de la imagen

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private firestore: Firestore) {
    this.form = this.fb.group({
      title: [''],
      content: [''],
      image: [''], // URL de la imagen
      order: [''],
      state: [false],
    });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.queryParamMap.get('productId') || '';
    this.loadSubitems(); // Cargar subitems
  }

  // Guardar subitem
  async saveSubitem() {
    if (!this.productId) return;
  
    const subitemsRef = collection(this.firestore, 'subitems');
  
    if (this.selectedSubitem) {
      // Editar subitem existente
      const subitemRef = doc(this.firestore, 'subitems', this.selectedSubitem.id);
      await updateDoc(subitemRef, { ...this.form.value, productId: this.productId });
    } else {
      // Guardar nuevo subitem
      const docRef = await addDoc(subitemsRef, {
        ...this.form.value,
        productId: this.productId,
      });
  
      // Actualizar el documento del producto con el ID del nuevo subitem
      const productRef = doc(this.firestore, 'products', this.productId);
      await updateDoc(productRef, {
        subitems: arrayUnion(docRef.id),
      });
    }
  
    this.form.reset();
    this.selectedSubitem = null; // Reiniciar selección
    this.loadSubitems(); // Refrescar la lista
  }
  

  // Cargar subitems asociados al producto
  async loadSubitems() {
    if (!this.productId) return;

    const subitemsRef = collection(this.firestore, 'subitems');
    const q = query(subitemsRef, where('productId', '==', this.productId));
    const querySnapshot = await getDocs(q);

    this.subitems = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log('Loaded Subitems:', this.subitems); // Depuración
  }

  // Seleccionar subitem para editar
  editSubitem(subitem: any) {
    this.selectedSubitem = subitem;
    this.form.patchValue({
      title: subitem.title,
      content: subitem.content,
      image: subitem.image,
      order: subitem.order,
      state: subitem.state,
    });
  }

  // Borrar un subitem
  async deleteSubitem(subitemId: string) {
    const subitemRef = doc(this.firestore, 'subitems', subitemId);
    await deleteDoc(subitemRef);
    this.loadSubitems(); // Refrescar la lista
  }

  // Subir una imagen
  async uploadImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadProgress = true;
    const storage = getStorage();
    const filePath = `subitems/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, filePath);

    try {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      this.form.patchValue({ image: downloadURL }); // Actualizar campo imagen con la URL
      console.log('Image uploaded:', downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      this.uploadProgress = false;
    }
  }
}

