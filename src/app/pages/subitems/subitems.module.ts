import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
// Importar TinyMCE
import { EditorModule } from '@tinymce/tinymce-angular';

import { SubitemsPageRoutingModule } from './subitems-routing.module';
import { SubitemsPage } from './subitems.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule, // Asegurarse de importar este módulo
    EditorModule, // Importa EditorModule aquí
    SubitemsPageRoutingModule
  ],
  declarations: [SubitemsPage]
})
export class SubitemsPageModule {}
