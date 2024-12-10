//auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Firestore, doc, setDoc, collection, getDoc } from '@angular/fire/firestore';

export interface User {
  username: string;
  uid: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user!: User;

  constructor(public auth: Auth, public firestore: Firestore) {}

  // Método para iniciar sesión
  async loginFireauth(value: any): Promise<any> {
    try {
      const res = await signInWithEmailAndPassword(this.auth, value.email, value.password);
      console.log('Usuario autenticado:', res);

      // Verificar si el usuario ya está registrado en la colección `users`
      const userUid = res.user.uid;
      const userDocRef = doc(this.firestore, `users/${userUid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Si no existe, creamos un documento predeterminado
        console.warn('User data not found. Creating new document...');
        const userData = {
          uid: userUid,
          email: value.email,
          subscriptionType: 'Free', // Asignación predeterminada
          avatar: 'https://firebasestorage.googleapis.com/v0/b/hormonavida.firebasestorage.app/o/loginUploads%2Favatar.webp?alt=media&token=902c8df4-eec1-4206-abc5-2ef0e2fe724c', // Avatar por defecto
        };
        await setDoc(userDocRef, userData);
      } else {
        console.log('User data found:', userDocSnap.data());
      }

      return res;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Configurar usuario autenticado
  setUser(user: User) {
    this.user = user;
  }

  // Obtener UID del usuario autenticado
  getUserUid(): string {
    return this.user.uid;
  }

  // Registro de usuario en Firebase Auth y Firestore
  async userRegistration(value: any): Promise<any> {
    try {
      const res = await createUserWithEmailAndPassword(this.auth, value.email, value.password);
      console.log('Usuario Registrado:', res);

      // Configuración de Firestore
      const userUid = res.user.uid; // UID del usuario recién registrado
      const usersCollectionRef = collection(this.firestore, 'users'); // Obtiene la referencia de la colección
      const userDocRef = doc(usersCollectionRef, userUid); // Referencia del documento del usuario

      // Datos adicionales del usuario
      const userData = {
        name: value.names || '', // Nombre proporcionado o por defecto
        subscriptionType: 'Free', // Suscripción predeterminada
        avatar: 'https://firebasestorage.googleapis.com/v0/b/hormonavida.firebasestorage.app/o/loginUploads%2Favatar.webp?alt=media&token=902c8df4-eec1-4206-abc5-2ef0e2fe724c', // Avatar por defecto
        email: value.email, // Guardar email
      };

      // Guardar en Firestore
      await setDoc(userDocRef, userData);

      return res;
    } catch (error) {
      console.error('Error al realizar el registro:', error);
      throw error;
    }
  }
}
