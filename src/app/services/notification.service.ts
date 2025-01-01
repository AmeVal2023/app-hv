//Frontend notification.service.ts
import { Injectable } from '@angular/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { ToastController } from '@ionic/angular';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';
import { AuthService } from './auth.service'; // Importar el servicio de autenticación

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private vapidKey = 'BDCYr6nERSKdOVlSxQvCKBqlwgfN7hGl9HuXpaEiMHMuglQpZtrtugft_VshhPHnfJHBXXjDkg0N8WyGvCJ4VPA'; // Reemplaza con tu clave VAPID

  constructor(
    private toastController: ToastController,
    private firestore: Firestore,
    private authService: AuthService // Injectar AuthService
  ) {}

  async initializeNotifications() {
    try {
      console.log('Inicializando notificaciones...');
      const permission = await FirebaseMessaging.requestPermissions();
      if (permission.receive === 'granted') {
        console.log('Permiso para notificaciones concedido.');
        try {
          const result = await FirebaseMessaging.getToken({ vapidKey: this.vapidKey });
          if (result?.token) {
            console.log('Token recibido:', result.token);
            const user = await this.authService.user$.toPromise();
            if (user?.uid) {
              const tokenRef = doc(this.firestore, `userTokens/${user.uid}`);
              await setDoc(tokenRef, { token: result.token });
              console.log('Token FCM guardado en Firestore:', result.token);
            } else {
              console.error('Usuario no autenticado, no se puede guardar el token.');
            }
          } else {
            console.warn('No se generó un token FCM.');
          }
        } catch (getTokenError) {
          console.error('Error obteniendo el token FCM:', getTokenError);
        }
      } else {
        console.warn('Permiso para notificaciones denegado.');
      }
  
      FirebaseMessaging.addListener('notificationReceived', async (notification: any) => {
        console.log('Notificación recibida:', notification);
        this.showToast(notification.notification?.title, notification.notification?.body);
      });
    } catch (error) {
      console.error('Error al inicializar las notificaciones:', error);
    }
  }
  
  

  private async registerDeviceToken(token: string, userId: string) {
    try {
      const tokenRef = doc(this.firestore, `userTokens/${userId}`);
      await setDoc(tokenRef, { token });
      console.log('Token guardado en Firestore:', token);
    } catch (error) {
      console.error('Error al guardar el token en Firestore:', error);
    }
  }

  private async showToast(title?: string, body?: string) {
    const toast = await this.toastController.create({
      header: title || 'Notificación',
      message: body || 'No hay contenido.',
      duration: 5000,
      position: 'top',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}
