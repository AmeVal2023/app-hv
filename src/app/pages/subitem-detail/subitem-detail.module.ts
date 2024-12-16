import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubitemDetailPageRoutingModule } from './subitem-detail-routing.module';

import { SubitemDetailPage } from './subitem-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubitemDetailPageRoutingModule
  ],
  declarations: [SubitemDetailPage]
})
export class SubitemDetailPageModule {}
