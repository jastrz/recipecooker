import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { map } from 'rxjs';
import { Tag } from '../models/tag';
import { RecipeStep } from '../models/recipeStep';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private hostUrl = "https://localhost:5002/api/"

  recipes: Recipe[] = [];
  tags: Tag[] = [];
  steps: RecipeStep[] = [];

  constructor(private http: HttpClient) { }

  public getRecipes() {
    return this.http.get<Recipe[]>(this.hostUrl + "Recipes").pipe(
      map(response => {
        this.recipes = response;
        return this.recipes;
      })
    )
  }

  public getTags() {
    return this.http.get<Tag[]>(this.hostUrl + "Recipes/tags").pipe(
      map(response => {
        this.tags = response;
        return this.tags;
      })
    )
  }

  public getRecipeSteps(recipeId: number) {
    return this.http.get<RecipeStep[]>(this.hostUrl + "recipes/" + recipeId).pipe(
      map(response => {
        this.steps = response;
        return this.steps;
      })
    )
  }
}
