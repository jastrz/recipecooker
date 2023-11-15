import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { RecipeAddComponent } from './recipe/recipe-add/recipe-add.component';
import { AccountComponent } from './account/account.component';
import { SavedRecipesListComponent } from './account/saved-recipes-list/saved-recipes-list.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Home' },
    redirectTo: '/about',
    pathMatch: 'full',
  },
  {
    path: 'cook',
    loadChildren: () =>
      import('./cooker/cooker.module').then((m) => m.CookerModule),
  },
  { path: 'about', component: AboutComponent },
  { path: 'add-recipe', component: RecipeAddComponent },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account-routing.module').then(
        (m) => m.AccountRoutingModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
