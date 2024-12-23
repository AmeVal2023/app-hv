//app.component.ts
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { register } from 'swiper/element/bundle';
import { NotificationService } from './services/notification.service';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private lottieSlashScreen: LottieSplashScreen,
    private platform: Platform,
    private notificationService: NotificationService
  ) {
    this.initializeApp();
  }
  initializeApp(){
    this.notificationService.initializeNotifications();
    this.lottieSlashScreen.show();
    this.platform.ready().then(()=>{
      setTimeout(()=>{
        this.lottieSlashScreen.hide();
      },2000)
    })

  }
}
