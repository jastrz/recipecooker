import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/models/ingredient';
import { Recipe } from 'src/app/models/recipe';
import { RecipeStep } from 'src/app/models/recipeStep';
import { FileService } from 'src/app/services/file.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeAddService {
  recipeForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    summary: ['', Validators.required],
    ingredientTags: ['', Validators.required],
    originTags: ['', Validators.required],
    characterTags: ['', Validators.required],
    files: this.fb.array([]),
    ingredients: this.fb.array([this.createIngredientForm()]),
    recipeSteps: this.fb.array([this.createStepsForm()]),
  });

  constructor(private fb: FormBuilder, private fileService: FileService) {}

  addIngredient() {
    this.ingredients.push(this.createIngredientForm());
    (this.recipeForm.get('ingredients') as FormArray).push(
      this.createIngredientForm()
    );
    console.log(this.recipeForm.get('ingredients') as FormArray);
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get recipeSteps() {
    return this.recipeForm.get('recipeSteps') as FormArray;
  }

  addRecipeStep() {
    this.recipeSteps.push(this.createStepsForm());
  }

  removeIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
    this.ingredients.removeAt(index);
  }

  removeRecipeStep(index: number) {
    (this.recipeForm.get('recipeSteps') as FormArray).removeAt(index);
    this.ingredients.removeAt(index);
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

  async loadRecipe(recipe: Recipe) {
    const recipePictures = await this.fileService.loadFilesFromUrls(
      recipe.pictureUrls
    );

    this.recipeForm.patchValue({
      name: recipe.name,
      description: recipe.description,
      summary: recipe.summary,
      ingredientTags: recipe.tags
        .filter((tag) => tag.category === 'mainIngredient')
        .map((tag) => tag.name)
        .join(','),
      originTags: recipe.tags
        .filter((tag) => tag.category === 'origin')
        .map((tag) => tag.name)
        .join(','),
      characterTags: recipe.tags
        .filter((tag) => tag.category === 'character')
        .map((tag) => tag.name)
        .join(','),
      files: recipePictures,
      ingredients: [],
      recipeSteps: [],
    });

    this.ingredients.clear();
    this.recipeSteps.clear();

    // Add new ingredients
    recipe.ingredients?.forEach((ingredient) => {
      this.ingredients.push(
        this.fb.group({
          name: [ingredient.name, Validators.required],
          quantity: [
            ingredient.quantity,
            [Validators.required, Validators.pattern('^[0-9]*$')],
          ],
          unit: [ingredient.unit, Validators.required],
        })
      );
    });

    // Add steps
    recipe.steps.forEach((step) => {
      this.recipeSteps.push(
        this.fb.group({
          name: [step.name, Validators.required],
          description: [step.description, Validators.required],
          files: this.fb.array([]),
        })
      );
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

    if (this.recipeSteps.invalid || this.recipeSteps.length == 0)
      errors.push('recipe steps');

    if (this.ingredients.invalid || this.ingredients.length == 0)
      errors.push('ingredients');

    return errors;
  }

  reset() {
    this.recipeForm.reset();
    this.ingredients.clear();
    this.recipeSteps.clear();
  }

  private getIngredients(): Ingredient[] {
    const ingredients: Ingredient[] = [];

    this.ingredients.controls.forEach((ingredientForm) => {
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

    this.recipeSteps.controls.forEach((stepForm, index) => {
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
