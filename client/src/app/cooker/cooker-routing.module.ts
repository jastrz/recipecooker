import { NgModule } from '@angular/core';
import { CookerComponent } from './cooker.component';
import { RouterModule, Routes } from '@angular/router';

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
