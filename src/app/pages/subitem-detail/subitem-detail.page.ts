//subitem-detail.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-subitem-detail',
  templateUrl: './subitem-detail.page.html',
  styleUrls: ['./subitem-detail.page.scss'],
})
export class SubitemDetailPage implements OnInit {
  subitemId: string = '';
  subitem: any = {};
  allSubitems: any[] = [];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.subitemId = this.route.snapshot.paramMap.get('id') || '';
    if (this.subitemId) {
      this.loadSubitemDetails();
    }
  }

  async loadSubitemDetails() {
    try {
      this.isLoading = true;
  
      // Obtener subitem actual
      const subitemDocRef = doc(this.firestore, `subitems/${this.subitemId}`);
      const subitemSnap = await getDoc(subitemDocRef);
      if (subitemSnap.exists()) {
        this.subitem = { id: subitemSnap.id, ...subitemSnap.data() };
      }
  
      // Obtener los IDs de subitems pasados como parámetro
      const subitemIds = JSON.parse(this.route.snapshot.queryParamMap.get('subitemIds') || '[]');
      console.log('Subitem IDs from Params:', subitemIds);
  
      // Obtener todos los subitems directamente desde Firestore
      const subitemsCollection = collection(this.firestore, 'subitems');
      const subitemsSnapshot = await getDocs(subitemsCollection);
  
      this.allSubitems = subitemsSnapshot.docs
        .filter((doc) => subitemIds.includes(doc.id)) // Filtrar usando los IDs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            order: data['order'] ?? 0,
            ...data,
          };
        })
        .sort((a, b) => a.order - b.order); // Ordenar por 'order'
  
      console.log('Filtered and Sorted Subitems:', this.allSubitems);
    } catch (error) {
      console.error('Error loading subitem details:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  
  navigateToSubitem(direction: string) {
    const currentIndex = this.allSubitems.findIndex((item) => item.id === this.subitemId);
    console.log('Current Index:', currentIndex);
  
    if (currentIndex === -1) {
      console.error('Current subitem not found in allSubitems.');
      return;
    }
  
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
  
    if (newIndex >= 0 && newIndex < this.allSubitems.length) {
      const newSubitemId = this.allSubitems[newIndex].id;
      console.log(`Navigating to new Subitem ID: ${newSubitemId}`);
      this.router.navigate(['/subitem-detail', newSubitemId], {
        queryParams: {
          productId: this.route.snapshot.queryParamMap.get('productId'),
          subitemIds: JSON.stringify(this.allSubitems.map(item => item.id)), // Reenviar los IDs
        },
      });
    } else {
      console.warn('No further navigation possible.');
    }
  }
  
  

  // Marcar como completado
  async markAsCompleted() {
    const subitemDocRef = doc(this.firestore, `subitems/${this.subitemId}`);
    await updateDoc(subitemDocRef, { state: true });
    this.subitem.state = true;
  }

  // Determinar visibilidad de botones
  canNavigateBack(): boolean {
    const currentIndex = this.allSubitems.findIndex((item) => item.id === this.subitemId);
    return currentIndex > 0; // Puede navegar atrás si no está en el primer subitem
  }
  
  canNavigateNext(): boolean {
    const currentIndex = this.allSubitems.findIndex((item) => item.id === this.subitemId);
    return currentIndex < this.allSubitems.length - 1; // Puede navegar adelante si no está en el último subitem
  }
  
  
  
}