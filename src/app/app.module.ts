//app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http'; // Importa provideHttpClient

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { firebaseConfig } from 'src/environments/environment';

//Other Imports
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { IonicNativePlugin } from '@ionic-native/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

//Import TinyMCE
import { EditorModule } from '@tinymce/tinymce-angular';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    EditorModule, // Importar el módulo de TinyMCE
    ],
  providers: [LottieSplashScreen,
    provideHttpClient(), // Reemplaza HttpClientModule por esta línea
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideFirebaseApp(() => initializeApp(firebaseConfig)), // Inicialización de Firebase App
    provideAuth(() => getAuth()), // Proveedor de autenticación
    provideFirestore(() => getFirestore()), // Proveedor de Firestore
    provideStorage(() => getStorage()), // Configura Storage
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
