import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { RecipeAddBasicsComponent } from './recipe-add-basics/recipe-add-basics.component';
import { RecipeAddStepsComponent } from './recipe-add-steps/recipe-add-steps.component';
import { RecipeStep } from 'src/app/models/recipeStep';
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';
import { RecipeStepsListComponent } from './recipe-add-steps/recipe-steps-list/recipe-steps-list.component';
import { Recipe } from 'src/app/models/recipe';
import { RecipesService } from 'src/app/cooker/recipes.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: ['./recipe-add.component.scss'],
  standalone: true,
  imports: [RecipeStepsListComponent, RecipeDetailsComponent, CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatStepperModule, RecipeAddBasicsComponent, RecipeAddStepsComponent]
})
export class RecipeAddComponent {

  recipeSteps: RecipeStep[] = [];
  selectedFiles: File[] = [];
  private pictureUrls : string[] = [];

  recipeForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    ingredientTags: ['', Validators.required],
    originTags: ['', Validators.required],
    characterTags: ['', Validators.required]
  });

  recipeStepForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private recipeService: RecipesService, private fileUploadService : FileUploadService) { }

  setFiles(files: File[]) {
    this.selectedFiles = files;
  }

  addRecipeStep = () => {

    const name = this.recipeStepForm.get('name')?.value;
    const description = this.recipeStepForm.get('description')?.value;

    if(name && description) {
      const step: RecipeStep = {
        name: name,
        description: description
      };
      this.recipeSteps.push(step);
      this.recipeStepForm.reset();
    } 

    console.log(this.getRecipeData());
  }

  private getRecipeData() : {recipe: Recipe, recipeSteps: RecipeStep[]} {
    return { 
      recipe: this.mapFormToRecipe(),
      recipeSteps: this.recipeSteps,
    };
  }

  postRecipe() {
    if(this.selectedFiles.length == 0) return;

    this.fileUploadService.uploadMultipleFiles(this.selectedFiles, "recipes/post/image").pipe(
      map(response => {
        this.pictureUrls = response;
        const recipeData = this.getRecipeData();
        return recipeData;
      }),
      mergeMap(recipeData => {
        return this.recipeService.postRecipe(recipeData.recipe, recipeData.recipeSteps);
      })
    ).subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    });
  }

  private mapFormToRecipe(): Recipe {

    const formValue = this.recipeForm.value;

    const recipe: Recipe = {
      name: formValue.name as string,
      description: formValue.description as string,
      pictureUrls: this.pictureUrls,
      recipeTags: [],
    };

    
    // Map ingredientTags
    if (formValue.ingredientTags) {
      const ingredients = formValue.ingredientTags.split(',').map(tag => ({ name: tag.trim(), category: 'mainIngredient' }));
      recipe.recipeTags.push(...ingredients);
    }
    
    // Map originTags
    if (formValue.originTags) {
      const origins = formValue.originTags.split(',').map(tag => ({ name: tag.trim(), category: 'origin' }));
      recipe.recipeTags.push(...origins);
    }
    
    // Map characterTags
    if (formValue.characterTags) {
      const characters = formValue.characterTags.split(',').map(tag => ({ name: tag.trim(), category: 'character' }));
      recipe.recipeTags.push(...characters);
    }
    
    console.log(recipe);
    return recipe;
  }
}
