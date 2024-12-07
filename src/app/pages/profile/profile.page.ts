//profile.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { ProfileService } from 'src/app/services/profile.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {};
  oldPassword: string = '';
  newPassword: string = '';
  slideOpts = {
    autoplay: {
      delay: 5000,
    },
    initialSlide: 0,
    speed: 700,
    loop: true,
  };
  

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  // Función para confirmar y cerrar sesión
  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          handler: () => {
            this.auth.signOut().then(() => {
              this.router.navigate(['/login']);
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async loadUserData() {
    try {
      const data = await this.profileService.getUserProfile();
      if (data) {
        this.user = data;
      } else {
        console.error('No user data found');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }
  
  async uploadAvatar() {
    const url = await this.profileService.uploadAvatar();
    if (url) {
      this.user.avatar = url;
    }
  }

  async updatePassword() {
    try {
      if (!this.oldPassword || !this.newPassword) {
        throw new Error('Please fill both old and new passwords.');
      }
      await this.profileService.changePassword(this.oldPassword, this.newPassword);
      const alert = await this.alertCtrl.create({
        header: 'Success',
        message: 'Password updated successfully.',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (err: any) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: err.message || 'Unknown error occurred.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  
  

  changeSubscription(type: string) {
    this.user.subscriptionType = type;
  }

  async saveChanges() {
    const loader = await this.loadingCtrl.create({
      message: 'Saving changes...',
    });
    await loader.present();
  
    try {
      await this.profileService.updateUserProfile(this.user);
      await loader.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Success',
        message: 'Profile updated successfully.',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigate(['/tabs/home']);
    } catch (error: any) {
      await loader.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: error.message || 'Failed to save changes.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
