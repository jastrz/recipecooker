import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { Observable, forkJoin, map, mergeMap, of } from 'rxjs';
import { ITag } from '../models/tag';
import { RecipeStep } from '../models/recipeStep';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private hostUrl = 'https://localhost:5002/api/';

  recipesCache: Recipe[] = [];
  tags: ITag[] = [];
  steps: RecipeStep[] = [];

  constructor(
    private http: HttpClient,
    private fileUploadService: FileService
  ) {}

  public getRecipes(tags?: ITag[]) {
    const params = this.getTagParams(tags);
    return this.http.get<Recipe[]>(this.hostUrl + 'recipes', { params }).pipe(
      map((response: Recipe[]) => {
        this.recipesCache.push(
          ...response.filter(
            (recipe) => !this.recipesCache.some((r) => r.id === recipe.id)
          )
        );
        return response;
      })
    );
  }

  public getRecipeCount(tags?: ITag[]) {
    const params = this.getTagParams(tags);
    return this.http.get<number>(this.hostUrl + 'recipes/count', { params });
  }

  public getRecipesForOverview(tags?: ITag[]) {
    const params = this.getTagParams(tags);
    console.log(params);
    return this.http
      .get<Recipe[]>(this.hostUrl + 'recipes/overview', { params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public getRecipe(recipeId: number, useCache: boolean = true) {
    if (useCache) {
      const recipe = this.recipesCache.find((r) => r.id == recipeId);
      if (recipe) return of(recipe);
    }

    return this.http.get<Recipe>(this.hostUrl + 'recipes/' + recipeId).pipe(
      map((response: Recipe) => {
        if (!this.recipesCache.some((r) => r.id === response.id)) {
          this.recipesCache.push(response);
        }
        return response;
      })
    );
  }

  public getTags() {
    return this.http.get<ITag[]>(this.hostUrl + 'recipes/tags').pipe(
      map((response) => {
        this.tags = response;
        return this.tags;
      })
    );
  }

  public getRecipeSteps(recipeId: number) {
    return this.http
      .get<RecipeStep[]>(this.hostUrl + 'recipes/steps/' + recipeId)
      .pipe(
        map((response) => {
          this.steps = response;
          return this.steps;
        })
      );
  }

  public uploadRecipe(recipe: Recipe, recipeImages: File[]) {
    var stepsObservables: Observable<any>[] = [];

    return this.postRecipe(recipe).pipe(
      mergeMap((id) => {
        recipe.id = id;
        recipe.steps.map((step) => {
          if (step.pictures && step.pictures.length > 0) {
            stepsObservables.push(
              this.createStepsHttpObservable(recipe.id!, step.id, step.pictures)
            );
          }
        });

        return this.fileUploadService.uploadFiles(
          recipeImages,
          `recipes/${id}/images`
        );
      }),
      mergeMap(() => {
        return forkJoin(stepsObservables);
      })
    );
  }

  public postRecipe(recipe: Recipe) {
    return this.http.post<any>(this.hostUrl + 'recipes', recipe);
  }

  public rateRecipe(id: number, rating: number) {
    console.log(`recipes/${id}/rating/${rating}`);
    return this.http.patch(this.hostUrl + `recipes/${id}/rating/${rating}`, {});
  }

  private createStepsHttpObservable(
    recipeId: number,
    stepId: number,
    files: File[]
  ) {
    return this.fileUploadService.uploadFiles(
      files,
      `recipes/${recipeId}/${stepId}/images`
    );
  }

  private getTagParams(tags?: ITag[]) {
    let params = new HttpParams();
    if (tags) {
      tags.forEach((tag) => {
        if (tag.name) {
          params = params.append(tag.category, tag.name);
        }
      });
    }
    return params;
  }
}
