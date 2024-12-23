import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubitemsPage } from './subitems.page';

const routes: Routes = [
  {
    path: '',
    component: SubitemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubitemsPageRoutingModule {}
