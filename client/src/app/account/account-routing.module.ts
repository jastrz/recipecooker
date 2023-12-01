import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { SavedRecipesListComponent } from './saved-recipes-list/saved-recipes-list.component';
import { RecipeVerificationComponent } from './recipe-verification/recipe-verification.component';
import { UserRecipesComponent } from './user-recipes/user-recipes.component';

const routes: Routes = [
  { path: '', component: AccountComponent },
  { path: 'saved-recipes', component: SavedRecipesListComponent },
  { path: 'verification', component: RecipeVerificationComponent },
  { path: 'added-recipes', component: UserRecipesComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
