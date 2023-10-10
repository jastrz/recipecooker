import { NgModule } from '@angular/core';
import { CookerComponent } from './cooker.component';
import { RouterModule, Routes } from '@angular/router';
import { MatChipListbox } from '@angular/material/chips';

const routes: Routes = [
  { path: '', component: CookerComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CookerRoutingModule { }
