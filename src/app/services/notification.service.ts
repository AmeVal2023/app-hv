//Frontend notification.service.ts
import { Injectable } from '@angular/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { ToastController } from '@ionic/angular';
import { Firestore, setDoc, doc, getDoc} from '@angular/fire/firestore';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private serverKey = 'TU_SERVER_KEY_AQUÍ'; // Reemplaza con tu clave del servidor de Firebase
  constructor(private toastController: ToastController, private firestore: Firestore) {}

  private async saveTokenToFirestore(token: string, userId: string) {
    const tokenRef = doc(this.firestore, `userTokens/${userId}`);
    await setDoc(tokenRef, { token });
    console.log('Token guardado en Firestore:', token);
  }
  async sendNotification(userId: string, title: string, message: string) {
    // Obtener el token del usuario desde Firestore
    const tokenRef = doc(this.firestore, `userTokens/${userId}`);
    const tokenDoc = await getDoc(tokenRef);

    if (!tokenDoc.exists()) {
      throw new Error('No se encontró el token para el usuario especificado');
    }

    const token = tokenDoc.data()?.['token'];

    // Enviar notificación usando Firebase Cloud Messaging
    const payload = {
      to: token,
      notification: {
        title: title,
        body: message,
      },
    };

    await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${this.serverKey}`,
      },
    });
  }

  async initializeNotifications() {
    try {
      // Solicitar permisos para las notificaciones push
      const permission = await FirebaseMessaging.requestPermissions();
      if (permission.receive === 'granted') {
        console.log('Notificación push permitida.');
        const result = await FirebaseMessaging.getToken();
        const token = result.token;
        await this.registerDeviceToken(token);
      } else {
        console.warn('Permiso para notificaciones denegado.');
      }

      // Suscribirse a eventos de notificaciones
      FirebaseMessaging.addListener('notificationReceived', async (notification: any) => {
        console.log('Notificación recibida:', notification);
        this.showToast(notification.notification?.title, notification.notification?.body);
      });

      FirebaseMessaging.addListener('tokenReceived', async (token: { token: string }) => {
        console.log('Nuevo token recibido:', token.token);
        await this.registerDeviceToken(token.token);
      });
    } catch (error) {
      console.error('Error al inicializar notificaciones:', error);
    }
  }

  private async registerDeviceToken(token: string) {
    try {
      const userId = 'exampleUserId'; // Aquí debes reemplazar con el ID del usuario autenticado
      const tokenRef = doc(this.firestore, `userTokens/${userId}`);
      await setDoc(tokenRef, { token });
      console.log('Token guardado en Firestore:', token);
    } catch (error) {
      console.error('Error al guardar el token:', error);
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
