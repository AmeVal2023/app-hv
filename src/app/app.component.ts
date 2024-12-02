import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private lottieSlashScreen: LottieSplashScreen,
    private platform: Platform
  ) {
    this.initializeApp();
  }
  initializeApp(){
    this.lottieSlashScreen.show();
    this.platform.ready().then(()=>{
      setTimeout(()=>{
        this.lottieSlashScreen.hide();
      },2000)
    })

  }
}
