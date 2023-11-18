import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from 'src/app/models/recipe';
import { RecipeOverviewComponent } from 'src/app/recipe/recipe-overview/recipe-overview.component';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-recipe-verification',
  templateUrl: './recipe-verification.component.html',
  styleUrls: ['./recipe-verification.component.scss'],
  standalone: true,
  imports: [CommonModule, RecipeOverviewComponent],
})
export class RecipeVerificationComponent {
  unverifiedRecipes$?: Observable<Recipe[]>;

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    this.unverifiedRecipes$ = this.recipeService.getRecipes([], 'Unverified');
  }
}
