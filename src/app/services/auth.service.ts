/*authservice.ts*/
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public auth: Auth) {}

  // Método para iniciar sesión
  loginFireauth(value: any): Promise<any> {
    return signInWithEmailAndPassword(this.auth, value.email, value.password)
      .then((res) => {
        console.log('Usuario autenticado:', res);
        return res;
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
        throw error;
      });
  }

  userRegistration(value: any): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, value.email, value.password)
      .then((res) => {
        console.log('Usuario Registrado:', res);
        return res;
      })
      .catch((error) => {
        console.error('Error al realizar el registro:', error);
        throw error;
      });
  }
}
