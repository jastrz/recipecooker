import { NgModule } from '@angular/core';
import { CookerComponent } from './cooker.component';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailsComponent } from '../recipe/recipe-details/recipe-details.component';

const routes: Routes = [
  { path: '', component: CookerComponent},
  { path: 'recipe/:id', component: RecipeDetailsComponent}
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
