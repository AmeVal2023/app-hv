//favorites.service.ts
import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  constructor(public firestore: Firestore, public auth: Auth) {}

  // Obtener los favoritos del usuario
  async getFavorites(): Promise<string[]> {
    const userUid = this.auth.currentUser?.uid;
    if (!userUid) {
        throw new Error('User UID not found. Ensure the user is authenticated.');
    }
    const userDocRef = doc(this.firestore, `users/${userUid}`);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists() ? userDocSnap.data()['favorites'] || [] : [];
  }


  // Agregar un producto a favoritos
  async addFavorite(productId: string): Promise<void> {
    const userUid = this.auth.currentUser?.uid;
    if (!userUid) throw new Error('User UID not found');

    const userDocRef = doc(this.firestore, `users/${userUid}`);
    await updateDoc(userDocRef, {
      favorites: arrayUnion(productId),
    });
  }

  // Eliminar un producto de favoritos
  async removeFavorite(productId: string): Promise<void> {
    const userUid = this.auth.currentUser?.uid;
    if (!userUid) throw new Error('User UID not found');

    const userDocRef = doc(this.firestore, `users/${userUid}`);
    await updateDoc(userDocRef, {
      favorites: arrayRemove(productId),
    });
  }
}
