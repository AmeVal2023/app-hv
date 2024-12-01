/*loginscreen.page.ts*/
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
  LoginUser(value: any) { // La función ahora está correctamente dentro de la clase
    console.log("Estoy Logueado", value);
    try {
      this.authservice.loginFireauth(value).then( resp =>{
       console.log(resp); 
       this.router.navigate(['tabs/home']); // Redirige si el login es exitoso
      })
    } catch (err) {
      console.log(err);
    }
  }
}