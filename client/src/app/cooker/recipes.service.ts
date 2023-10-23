import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  public getRecipes(tags?: Tag[]) {

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

  public getTags() {
    return this.http.get<Tag[]>(this.hostUrl + "recipes/tags").pipe(
      map(response => {
        this.tags = response;
        return this.tags;
      })
    )
  }

  public getRecipeSteps(recipeId: number) {
    console.log(recipeId);
    return this.http.get<RecipeStep[]>(this.hostUrl + "recipes/" + recipeId).pipe(
      map(response => {
        this.steps = response;
        return this.steps;
      })
    )
  }
}
