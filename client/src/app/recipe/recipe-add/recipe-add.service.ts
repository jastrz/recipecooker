import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/models/ingredient';
import { Recipe } from 'src/app/models/recipe';
import { RecipeStep } from 'src/app/models/recipeStep';

@Injectable({
  providedIn: 'root',
})
export class RecipeAddService {
  ingredientForms: FormArray;
  recipeStepForms: FormArray;

  recipeForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    summary: ['', Validators.required],
    ingredientTags: ['', Validators.required],
    originTags: ['', Validators.required],
    characterTags: ['', Validators.required],
    files: this.fb.array([]),
  });

  constructor(private fb: FormBuilder) {
    this.ingredientForms = this.fb.array([this.createIngredientForm()]);
    this.recipeStepForms = this.fb.array([this.createStepsForm()]);
  }

  addIngredient() {
    this.ingredientForms.push(this.createIngredientForm());
  }

  addRecipeStep() {
    this.recipeStepForms.push(this.createStepsForm());
  }

  removeIngredient(index: number) {
    this.ingredientForms.removeAt(index);
  }

  removeRecipeStep(index: number) {
    this.recipeStepForms.removeAt(index);
  }

  createIngredientForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      unit: ['', Validators.required],
    });
  }

  createStepsForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      files: this.fb.array([]),
    });
  }

  getRecipe(): Recipe {
    const formValue = this.recipeForm.value;
    const recipeSteps = this.getRecipeSteps();
    const ingredients = this.getIngredients();

    const recipe: Recipe = {
      name: formValue.name as string,
      description: formValue.description as string,
      summary: formValue.summary as string,
      steps: recipeSteps,
      ingredients: ingredients,
      pictureUrls: [],
      tags: [],
    };

    // Map ingredientTags
    if (formValue.ingredientTags) {
      const ingredients = formValue.ingredientTags
        .split(',')
        .map((tag) => ({ name: tag.trim(), category: 'mainIngredient' }));
      recipe.tags.push(...ingredients);
    }

    // Map originTags
    if (formValue.originTags) {
      const origins = formValue.originTags
        .split(',')
        .map((tag) => ({ name: tag.trim(), category: 'origin' }));
      recipe.tags.push(...origins);
    }

    // Map characterTags
    if (formValue.characterTags) {
      const characters = formValue.characterTags
        .split(',')
        .map((tag) => ({ name: tag.trim(), category: 'character' }));
      recipe.tags.push(...characters);
    }

    console.log(recipe);
    return recipe;
  }

  getValidationInfo(): string[] {
    const errors: string[] = [];

    if (this.recipeForm.invalid) errors.push('recipe basics');

    if (this.recipeStepForms.invalid || this.recipeStepForms.length == 0)
      errors.push('recipe steps');

    if (this.ingredientForms.invalid || this.ingredientForms.length == 0)
      errors.push('ingredients');

    return errors;
  }

  private getIngredients(): Ingredient[] {
    const ingredients: Ingredient[] = [];

    this.ingredientForms.controls.forEach((ingredientForm) => {
      const ingredient: Ingredient = {
        name: ingredientForm.get('name')?.value,
        quantity: ingredientForm.get('quantity')?.value,
        unit: ingredientForm.get('unit')?.value,
      };
      ingredients.push(ingredient);
    });

    return ingredients;
  }

  private getRecipeSteps(): RecipeStep[] {
    const recipeSteps: RecipeStep[] = [];

    this.recipeStepForms.controls.forEach((stepForm, index) => {
      const recipeStep: RecipeStep = {
        id: index,
        name: stepForm.get('name')?.value,
        description: stepForm.get('description')?.value,
        pictureUrls: [],
        pictures: stepForm.get('files')?.value,
      };

      recipeSteps.push(recipeStep);
    });

    console.log(recipeSteps);

    return recipeSteps;
  }
}
