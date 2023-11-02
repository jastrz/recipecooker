import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { RecipeAddComponent } from './recipe/recipe-add/recipe-add.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  { path: '', data: { breadcrumb: 'Home'}, redirectTo: '/about', pathMatch: 'full'},
  { path: 'cook', loadChildren: () => import('./cooker/cooker.module').then(m => m.CookerModule)},
  { path: 'about', component: AboutComponent},
  { path: 'add-recipe', component: RecipeAddComponent},
  { path: 'account', component: AccountComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
