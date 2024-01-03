import { Injectable } from '@angular/core';
import { AccountService } from '../account/account.service';
import { RecipesService } from '../recipe/recipes.service';
import { Recipe } from '../models/recipe';
import { User } from '../models/user';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UserInventoryService {
  userRecipes: Recipe[] = [];

  constructor(
    private accountService: AccountService,
    private recipeService: RecipesService,
    private toast: ToastrService
  ) {
    accountService.user$.subscribe({
      next: (user) => this.setInventory(user),
      error: (error) => {
        toast.error(error);
        this.resetInventory();
      },
    });
  }

  refresh() {
    this.getUserRecipes();
  }

  private setInventory(user: User | null) {
    if (user) {
      this.refresh();
    } else {
      this.userRecipes = [];
    }
  }

  private getUserRecipes() {
    this.recipeService.getRecipesForUser().subscribe({
      next: (recipes) => {
        this.userRecipes = recipes;
      },
      error: (error) => console.log(error),
    });
  }

  private resetInventory() {
    this.userRecipes = [];
  }
}
