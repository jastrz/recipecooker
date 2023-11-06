import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { Observable, forkJoin, map, mergeMap } from 'rxjs';
import { ITag } from '../models/tag';
import { RecipeStep } from '../models/recipeStep';
import { FileUploadService } from '../services/file-upload.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private hostUrl = 'https://localhost:5002/api/';

  recipes: Recipe[] = [];
  tags: ITag[] = [];
  steps: RecipeStep[] = [];

  constructor(
    private http: HttpClient,
    private fileUploadService: FileUploadService
  ) {}

  public getRecipes(tags?: ITag[]) {
    let params = new HttpParams();
    if (tags) {
      tags.forEach((tag) => {
        if (tag.name) {
          params = params.append(tag.category, tag.name);
        }
      });
    }

    return this.http.get<Recipe[]>(this.hostUrl + 'recipes', { params }).pipe(
      map((response) => {
        this.recipes = response;
        return this.recipes;
      })
    );
  }

  public getRecipe(recipeId: number) {
    return this.http.get<Recipe>(this.hostUrl + 'recipes/' + recipeId);
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
}
