//no-auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export const noAuthGuard: CanActivateFn = (): Observable<boolean> => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Observable<boolean>((observer) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Usuario autenticado, redirigir al home
        router.navigate(['/tabs/home']);
        observer.next(false);
        observer.complete();
      } else {
        // Usuario no autenticado, permitir acceso
        observer.next(true);
        observer.complete();
      }
    });
  });
};
