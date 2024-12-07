/*profile.service.ts*/
import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Auth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private firestore: Firestore, private storage: Storage, private auth: Auth) {}

  getUserProfile(): Promise<any> {
    const userUid = this.auth.currentUser?.uid;
    const docRef = doc(this.firestore, `users/${userUid}`);
    return getDoc(docRef).then((snapshot) => snapshot.data());
  }  

  async uploadAvatar(): Promise<string> {
    const file = await this.selectFile();
    const storageRef = ref(this.storage, `avatars/${this.auth.currentUser?.uid}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async changePassword(oldPassword: string, newPassword: string) {
    const user = this.auth.currentUser;
    const credential = EmailAuthProvider.credential(user?.email!, oldPassword);
    await reauthenticateWithCredential(user!, credential);
    await updatePassword(user!, newPassword);
  }

  async updateUserProfile(data: any) {
    const userUid = this.auth.currentUser?.uid;
    const docRef = doc(this.firestore, `users/${userUid}`);
    await updateDoc(docRef, data);
  }

  private selectFile(): Promise<File> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = () => {
        resolve((input.files as FileList)[0]);
      };
      input.click();
    });
  }
}
