import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './account/login/login.component';
import { RecipeAddComponent } from './recipe/recipe-add/recipe-add.component';
import { RecipeDetailsComponent } from './recipe/recipe-details/recipe-details.component';

const routes: Routes = [
  { path: 'cook', loadChildren: () => import('./cooker/cooker.module').then(m => m.CookerModule)},
  { path: 'about', component: AboutComponent},
  { path: 'add-recipe', component: RecipeAddComponent},
  { path: 'login', component: LoginComponent},
  { path: 'recipe/:id', component: RecipeDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
