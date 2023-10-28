import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { map } from 'rxjs';
import { ITag } from '../models/tag';
import { RecipeStep } from '../models/recipeStep';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private hostUrl = "https://localhost:5002/api/";

  recipes: Recipe[] = [];
  tags: ITag[] = [];
  steps: RecipeStep[] = [];

  constructor(private http: HttpClient) { }

  public getRecipes(tags?: ITag[]) {

    let params = new HttpParams();
    if(tags)
    {
      tags.forEach((tag) => {
        if(tag.name)
        {
          params = params.append(tag.category, tag.name);
        }
      });
    }

    console.log(params);

    return this.http.get<Recipe[]>(this.hostUrl + "recipes", {params}).pipe(
      map(response => {
        this.recipes = response;
        return this.recipes;
      })
    )
  }

  public getRecipe(recipeId: number) {
    return this.http.get<Recipe>(this.hostUrl + "recipes/" + recipeId);
  }

  public getTags() {
    return this.http.get<ITag[]>(this.hostUrl + "recipes/tags").pipe(
      map(response => {
        this.tags = response;
        return this.tags;
      })
    )
  }

  public getRecipeSteps(recipeId: number) {
    return this.http.get<RecipeStep[]>(this.hostUrl + "recipes/steps/" + recipeId).pipe(
      map(response => {
        this.steps = response;
        return this.steps;
      })
    )
  }

  public postRecipe(recipe: Recipe) {
    return this.http.post<any>(this.hostUrl + "recipes/post", recipe);
  }
}
