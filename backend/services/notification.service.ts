//Backend notification.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private backendUrl = 'http://localhost:3000/send-notification';

  constructor(private http: HttpClient) {}

  sendNotification(registrationToken: string, title: string, body: string) {
    const payload = { registrationToken, title, body };
    return this.http.post(this.backendUrl, payload);
  }
}
