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
  
  validationUserMessage ={
    email:[
      {type:"required", message:"Fill this field/Llena este campo"},
      {type:"pattern", message:"Email Wrong/Email Incorrecto"}
    ],
    password:[
      {type:"required", message:"Fill this field/Llena este campo"},
      {type:"minlength", message:"Enter 5 Characters or more/Ingrese 5 Caracteres o más"}
    ]
  }

  validationFormUser!: FormGroup;

  constructor(public formBuilder: FormBuilder, public authservice: AuthService, private router: Router) { }

  ngOnInit() {
    this.validationFormUser = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ]))
    })
  }
  async LoginUser(value: any) {
    try {
        const resp = await this.authservice.loginFireauth(value);
        const userUid = resp.user?.uid;

        if (!userUid) {
            console.error('No UID found for the authenticated user');
            return;
        }

        // Referencia al documento del usuario en Firestore
        const userDocRef = doc(this.authservice.firestore, `users/${userUid}`);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            console.log('User data found:', userDocSnap.data());
            this.router.navigate(['tabs/home']); // Redirige si el login es exitoso
        } else {
            console.warn('User data not found in Firestore. Creating...');
            // Crea el documento si no existe
            await setDoc(userDocRef, {
                uid: userUid,
                email: value.email,
                subscriptionType: 'Free', // Valor predeterminado
            });
            this.router.navigate(['tabs/home']);
        }
    } catch (err) {
        console.error('Login error:', err);
    }
  }
  
}