import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { map, of } from 'rxjs';
import { ITag } from '../models/tag';
import { RecipeStep } from '../models/recipeStep';
import { FileService } from '../services/file.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private hostUrl = environment.apiUrl;

  recipesCache: Recipe[] = [];
  tags: ITag[] = [];
  steps: RecipeStep[] = [];

  constructor(
    private http: HttpClient,
    private fileUploadService: FileService
  ) {}

  public getRecipes(tags?: ITag[], status?: string) {
    let params = this.getTagParams(tags);
    if (status) params = params.append('status', status);
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

  public setRecipeStatus(recipeId: number, status: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });
    return this.http.patch<boolean>(
      this.hostUrl + `recipes/${recipeId}/status`,
      JSON.stringify(status),
      { headers }
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
        } else if (!useCache) {
          this.recipesCache = this.recipesCache.filter(
            (r) => r.id != response.id
          );
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

  public deleteRecipe(recipeId: number) {
    return this.http.delete(this.hostUrl + `recipes/${recipeId}`);
  }

  public putRecipe(recipe: Recipe) {
    return this.http.put<number>(this.hostUrl + `recipes/${recipe.id}`, recipe);
  }

  // public uploadRecipe(recipe: Recipe) {
  //   return this.postRecipe(recipe);
  //   // var stepsObservables: Observable<any>[] = [];

  //   // return this.postRecipe(recipe).pipe(
  //   //   mergeMap((id) => {
  //   //     recipe.id = id;
  //   //     recipe.steps.map((step) => {
  //   //       if (step.pictures && step.pictures.length > 0) {
  //   //         stepsObservables.push(
  //   //           this.createStepsHttpObservable(recipe.id!, step.id, step.pictures)
  //   //         );
  //   //       }
  //   //     });

  //   //     return this.fileUploadService.uploadFiles(
  //   //       recipeImages,
  //   //       `recipes/${id}/images`
  //   //     );
  //   //   }),
  //   //   mergeMap(() => {
  //   //     return forkJoin(stepsObservables);
  //   //   })
  //   // );
  // }

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
