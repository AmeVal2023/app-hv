//auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const auth = inject(Auth); // Usamos `inject` para obtener el servicio de Auth
  const router = inject(Router); // Usamos `inject` para obtener el Router

  return new Observable<boolean>((observer) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Usuario autenticado, permitir acceso
        observer.next(true);
        observer.complete();
      } else {
        // Usuario no autenticado, redirigir al login
        router.navigate(['/login']);
        observer.next(false);
        observer.complete();
      }
    });
  });
};
