/*loginscreen.page.ts*/
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { doc, getDoc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-loginscreen',
  templateUrl: './loginscreen.page.html',
  styleUrls: ['./loginscreen.page.scss'],
})
export class LoginscreenPage implements OnInit {
  validationUserMessage = {
    email: [
      { type: 'required', message: 'Fill this field/Llena este campo' },
      { type: 'pattern', message: 'Email Wrong/Email Incorrecto' },
    ],
    password: [
      { type: 'required', message: 'Fill this field/Llena este campo' },
      { type: 'minlength', message: 'Enter 5 Characters or more/Ingrese 5 Caracteres o más' },
    ],
  };

  validationFormUser!: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public authservice: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.validationFormUser = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
      ])),
    });
  }

  async LoginUser(value: any) {
    try {
      console.log('Attempting login with:', value);

      const resp = await this.authservice.loginFireauth(value);
      const userUid = resp.user?.uid;

      if (!userUid) {
        console.error('No UID found for the authenticated user');
        return;
      }

      // Verificar o registrar el usuario en Firestore
      const userDocRef = doc(this.authservice.firestore, `users/${userUid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        console.log('User data found in Firestore:', userDocSnap.data());
      } else {
        console.warn('User data not found in Firestore. Creating...');
        await setDoc(userDocRef, {
          uid: userUid,
          email: value.email,
          subscriptionType: 'Free', // Valor predeterminado
          createdAt: new Date().toISOString(),
        });
        console.log('User data created in Firestore.');
      }

      // Navegar al home tras el login exitoso
      this.router.navigate(['tabs/home']);
    } catch (err) {
      console.error('Login error:', err);
      this.handleLoginError(err);
    }
  }

  private async handleLoginError(err: any) {
    // Maneja diferentes errores de autenticación aquí
    if (err.code === 'auth/user-not-found') {
      console.error('User not found. Please register.');
    } else if (err.code === 'auth/wrong-password') {
      console.error('Wrong password.');
    } else {
      console.error('Unexpected error during login:', err.message || err);
    }
  }
}
