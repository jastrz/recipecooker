import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { SavedRecipesListComponent } from './saved-recipes-list/saved-recipes-list.component';

const routes: Routes = [
  { path: '', component: AccountComponent },
  { path: 'recipes', component: SavedRecipesListComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
