import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { SavedRecipesListComponent } from './saved-recipes-list/saved-recipes-list.component';
import { RecipeVerificationComponent } from './recipe-verification/recipe-verification.component';
import { UserRecipesComponent } from './user-recipes/user-recipes.component';
import { AuthGuard } from '../core/auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  { path: '', component: AccountComponent },
  {
    path: 'saved-recipes',
    component: SavedRecipesListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'verification',
    component: RecipeVerificationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'added-recipes',
    component: UserRecipesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
