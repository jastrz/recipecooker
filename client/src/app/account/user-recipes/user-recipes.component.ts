import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from 'src/app/models/recipe';
import { RecipeOverviewComponent } from 'src/app/recipe/recipe-overview/recipe-overview.component';
import { RecipesService } from 'src/app/recipe/recipes.service';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.scss'],
  standalone: true,
  imports: [CommonModule, RecipeOverviewComponent],
})
export class UserRecipesComponent {
  userRecipes$?: Observable<Recipe[]>;

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    this.userRecipes$ = this.recipeService.getRecipesForUser();
  }
}
