import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from 'src/app/models/recipe';
import { RecipeOverviewComponent } from 'src/app/recipe/recipe-overview/recipe-overview.component';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-saved-recipes-list',
  templateUrl: './saved-recipes-list.component.html',
  standalone: true,
  imports: [CommonModule, RecipeOverviewComponent],
})
export class SavedRecipesListComponent implements OnInit {
  savedRecipes$?: Observable<Recipe[]>;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.savedRecipes$ = this.accountService.getSavedRecipes();
  }
}
