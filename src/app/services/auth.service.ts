//auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, onAuthStateChanged } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

export interface User {
  username?: string;
  uid: string;
  email: string;
  subscriptionType?: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null); // Estado del usuario autenticado
  public user$ = this.userSubject.asObservable(); // Observable del usuario autenticado
  private vapidKey = 'BDCYr6nERSKdOVlSxQvCKBqlwgfN7hGl9HuXpaEiMHMuglQpZtrtugft_VshhPHnfJHBXXjDkg0N8WyGvCJ4VPA'; // Clave VAPID

  constructor(public auth: Auth, public firestore: Firestore) {
    this.monitorAuthState();
  }

  // Monitorear el estado del usuario autenticado
  private monitorAuthState() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as Partial<User>; // Asegúrate de que sea parcial
          this.userSubject.next({
            ...userData,
            uid: user.uid,
            email: user.email || '', // Proporciona un valor predeterminado si es null
          });
        }
      } else {
        this.userSubject.next(null);
      }
    });
  }

  // Método para iniciar sesión
  async loginFireauth(value: any): Promise<any> {
    try {
      const res = await signInWithEmailAndPassword(this.auth, value.email, value.password);
      console.log('Usuario autenticado:', res);

      const userUid = res.user.uid;
      const userDocRef = doc(this.firestore, `users/${userUid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.warn('Datos del usuario no encontrados. Creando nuevo documento...');
        const userData = {
          uid: userUid,
          email: value.email,
          subscriptionType: 'Free', // Asignación predeterminada
          avatar: 'https://firebasestorage.googleapis.com/v0/b/hormonavida.firebasestorage.app/o/loginUploads%2Favatar.webp?alt=media&token=902c8df4-eec1-4206-abc5-2ef0e2fe724c', // Avatar por defecto
        };
        await setDoc(userDocRef, userData);
        console.log('Documento creado en Firestore para el usuario:', userData);
      } else {
        console.log('Datos del usuario encontrados en Firestore:', userDocSnap.data());
      }

      return res;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Registro de usuario en Firebase Auth y Firestore
  async userRegistration(value: any): Promise<any> {
    try {
      console.log('Iniciando registro de usuario...');
      const res = await createUserWithEmailAndPassword(this.auth, value.email, value.password);
      console.log('Usuario registrado en Firebase Auth:', res);
  
      const userUid = res.user.uid;
      const userDocRef = doc(this.firestore, `users/${userUid}`);
  
      const userData = {
        name: value.names || '',
        subscriptionType: 'Free', // Suscripción predeterminada
        avatar: 'https://firebasestorage.googleapis.com/v0/b/hormonavida.firebasestorage.app/o/loginUploads%2Favatar.webp?alt=media&token=902c8df4-eec1-4206-abc5-2ef0e2fe724c', // Avatar por defecto
        email: value.email,
      };
  
      await setDoc(userDocRef, userData);
      console.log('Usuario guardado en Firestore:', userData);
  
      console.log('Solicitando permisos para notificaciones FCM...');
      const permission = await FirebaseMessaging.requestPermissions();
      if (permission.receive === 'granted') {
        console.log('Permiso para notificaciones FCM concedido.');
        try {
          const tokenResult = await FirebaseMessaging.getToken({ vapidKey: this.vapidKey });
          if (tokenResult?.token) {
            console.log('Token FCM recibido:', tokenResult.token);
            const tokenRef = doc(this.firestore, `userTokens/${userUid}`);
            await setDoc(tokenRef, { token: tokenResult.token });
            console.log('Token FCM guardado en Firestore:', tokenResult.token);
          } else {
            console.warn('No se generó un token FCM.');
          }
        } catch (tokenError) {
          console.error('Error obteniendo el token FCM:', tokenError);
        }
      } else {
        console.warn('Permiso para notificaciones FCM denegado.');
      }
  
      return res;
    } catch (error) {
      console.error('Error durante el registro del usuario:', error);
      throw error;
    }
  }
  
  

  // Obtener el estado actual del usuario
  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }
}
