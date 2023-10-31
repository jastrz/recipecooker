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
import { Ingredient } from 'src/app/models/ingredient';
import { RecipeAddIngredientsComponent } from './recipe-add-ingredients/recipe-add-ingredients.component';
import { IngredientListComponent } from './recipe-add-ingredients/ingredient-list/ingredient-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: ['./recipe-add.component.scss'],
  standalone: true,
  imports: [ RecipeStepsListComponent, RecipeDetailsComponent, CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatStepperModule, RecipeAddBasicsComponent, RecipeAddStepsComponent, RecipeAddIngredientsComponent, IngredientListComponent]
})
export class RecipeAddComponent {

  recipeSteps: RecipeStep[] = [];
  ingredients: Ingredient[] = [];
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

  ingredientsForm = this.fb.group({
    name: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    unit: ['', Validators.required]
  })

  constructor(private fb: FormBuilder, private recipeService: RecipesService, 
    private fileUploadService : FileUploadService, private router: Router) { }

  setFiles(files: File[]) {
    this.selectedFiles = files;
  }

  addIngredient = () => {

    const formValue = this.ingredientsForm.value;
    const ingredient: Ingredient = {
      name: formValue.name ?? '',
      quantity: formValue.quantity ? +formValue.quantity : 0,
      unit: formValue.unit ?? '',
    };
    this.ingredients.push(ingredient);
    this.ingredientsForm.reset();
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
  }

  private getRecipe() : Recipe {
    return this.mapFormToRecipe();
  }

  postRecipe() {
    if(this.selectedFiles.length == 0) return;

    this.fileUploadService.uploadMultipleFiles(this.selectedFiles, "recipes/post/image").pipe(
      map(response => {
        this.pictureUrls = response;
        const recipe = this.getRecipe();
        return recipe;
      }),
      mergeMap(recipe => {
        return this.recipeService.postRecipe(recipe);
      })
    ).subscribe({
      next: id => this.router.navigateByUrl("cook/recipe/" + id),
      error: error => console.error(error)
    });
  }

  private mapFormToRecipe(): Recipe {

    const formValue = this.recipeForm.value;

    const recipe: Recipe = {
      name: formValue.name as string,
      description: formValue.description as string,
      pictureUrls: this.pictureUrls,
      steps: this.recipeSteps,
      ingredients: this.ingredients,
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
