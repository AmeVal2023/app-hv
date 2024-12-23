//auth-admin-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export const authAdminGuard: CanActivateFn = (): Observable<boolean> => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  return new Observable<boolean>((observer) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.warn('No user authenticated. Redirecting to login.');
        router.navigate(['/login']);
        observer.next(false);
        observer.complete();
        return;
      }

      // Verifica el rol en Firestore
      try {
        const userRef = doc(firestore, `users/${user.uid}`);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data()['rol'] === 'admin') {
          console.log('Access granted: User is admin.');
          observer.next(true);
        } else {
          console.warn('Access denied: User is not admin.');
          router.navigate(['/home']);
          observer.next(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.navigate(['/login']);
        observer.next(false);
      } finally {
        observer.complete();
      }
    });
  });
};
