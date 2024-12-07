/*authservice.ts*/
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Firestore, doc, setDoc, collection } from '@angular/fire/firestore';

export interface User {
  username: string;
  uid: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user!: User;

  constructor(public auth: Auth, private firestore: Firestore) {}

  // Método para iniciar sesión
  loginFireauth(value: any): Promise<any> {
    return signInWithEmailAndPassword(this.auth, value.email, value.password)
      .then((res) => {
        console.log('Usuario autenticado:', res);
        return res;
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
        throw error;
      });
  }

  setUser(user: User) {
    this.user = user;
  }

  getUserUid(): string {
    return this.user.uid;
  }

  userRegistration(value: any): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, value.email, value.password)
      .then(async (res) => {
        console.log('Usuario Registrado:', res);
  
        // Configuración de Firestore
        const userUid = res.user.uid; // UID del usuario recién registrado
        const usersCollectionRef = collection(this.firestore, 'users'); // Obtiene la referencia de la colección
        const userDocRef = doc(usersCollectionRef, userUid); // Obtiene la referencia del documento dentro de la colección
  
        // Datos adicionales del usuario
        const userData = {
          name: value.names || '', // Nombre proporcionado o por defecto
          subscriptionType: 'Free', // Suscripción por defecto
          avatar: 'https://firebasestorage.googleapis.com/v0/b/hormonavida.firebasestorage.app/o/loginUploads%2Favatar.webp?alt=media&token=902c8df4-eec1-4206-abc5-2ef0e2fe724c', // Avatar por defecto
          email: value.email, // Guardamos también el email
        };
  
        // Guardar en Firestore
        await setDoc(userDocRef, userData);
  
        return res;
      })
      .catch((error) => {
        console.error('Error al realizar el registro:', error);
        throw error;
      });
  }
}
