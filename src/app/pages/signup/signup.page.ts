/*signup.page.ts*/
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  validationMessages ={
    names:[{type:"required", message:"Fill this field/Llena este campo"}],
    phone:[{type:"required", message:"Fill this field/Llena este campo"}],
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
  loading:any;

  constructor(private formBuilder: FormBuilder, private authservice: AuthService, public loadingCtrl: LoadingController, private router: Router, private alertCtrl: AlertController, private navCtr:NavController) { 
    this.loading = this.loadingCtrl
  }

  ngOnInit() {
    this.validationFormUser = this.formBuilder.group({
      names: new FormControl('', Validators.compose([
        Validators.required
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required
      ])),
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
  registerUser(value: any) {
    console.log("Estoy Registrado", value);
  
    this.showalert(); // Muestra el loading
    try {
      this.authservice.userRegistration(value).then(
        (response) => {
          console.log(response);
          if (response.user) {
            // Cierra el loading si el registro es exitoso
            this.loading.dismiss();
            this.router.navigate(['tabs/home']); // Redirige si el registro es exitoso
          }
        },
        (error) => {
          // Cierra el loading y muestra error si falla
          this.loading.dismiss();
          this.errorLoading(error.message);
        }
      );
    } catch (err) {
      console.error(err);
      // Cierra el loading y maneja errores en el bloque try-catch
      this.loading.dismiss();
      this.errorLoading("Unexpected error occurred/Ha ocurrido un error inesperado");
    }
  }
  
  async errorLoading(message: any) {
    const alert = await this.alertCtrl.create({
      header: "Error register/Error al registrar",
      message: message,
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.navCtr.navigateBack(['signup']);
          },
        },
      ],
    });
    await alert.present();
  }

  async showalert() {
    this.loading = await this.loadingCtrl.create({
      message: "please wait/Por favor espere",
      spinner: "circles",
    });
    await this.loading.present();
  }


}
