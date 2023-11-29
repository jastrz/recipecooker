import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/models/ingredient';
import { Recipe } from 'src/app/models/recipe';
import { RecipeStep } from 'src/app/models/recipeStep';

@Injectable({
  providedIn: 'root',
})
export class RecipeAddService {
  loadedRecipe?: Recipe | null;

  private basics = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    summary: ['', Validators.required],
    ingredientTags: ['', Validators.required],
    originTags: ['', Validators.required],
    characterTags: ['', Validators.required],
    pictureUrls: this.fb.array([]),
  });

  recipeForm = this.fb.group({
    basics: this.basics,
    ingredients: this.fb.array([this.createIngredientForm()]),
    recipeSteps: this.fb.array([this.createStepsForm()]),
  });

  constructor(private fb: FormBuilder) {}

  addIngredient() {
    this.ingredients.push(this.createIngredientForm());
  }

  get recipeBasics() {
    return this.recipeForm.get('basics') as FormGroup;
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get recipeSteps() {
    return this.recipeForm.get('recipeSteps') as FormArray;
  }

  get pictureUrls() {
    return this.recipeBasics.get('pictureUrls') as FormArray;
  }

  addRecipeStep() {
    this.recipeSteps.push(this.createStepsForm());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  removeRecipeStep(index: number) {
    this.recipeSteps.removeAt(index);
  }

  createIngredientForm(ingredient?: Ingredient): FormGroup {
    return this.fb.group({
      name: [ingredient?.name ?? '', Validators.required],
      quantity: [
        ingredient?.quantity ?? '',
        [Validators.required, Validators.pattern('^[0-9]+(.[0-9]+)?$')],
      ],
      unit: [ingredient?.unit ?? '', Validators.required],
    });
  }

  createStepsForm(step? : RecipeStep): FormGroup {
    return this.fb.group({
      name: [step?.name ?? '', Validators.required],
      description: [step?.description ?? '', Validators.required],
      pictureUrls: this.fb.array([]),
    });
  }

  private getTags(recipe: Recipe, category: string) {
    return recipe.tags
      ?.filter((tag) => tag.category === category)
      ?.map((tag) => tag.name)
      ?.join(',');
  }

  loadRecipe(recipe: Recipe) {
    this.loadedRecipe = recipe;

    this.basics.patchValue({
      name: recipe.name,
      description: recipe.description,
      summary: recipe.summary,
      ingredientTags: this.getTags(recipe, 'mainIngredient') || '',
      originTags: this.getTags(recipe, 'origin') || '',
      characterTags: this.getTags(recipe, 'character') || '',
    });

    this.ingredients.clear();
    this.recipeSteps.clear();
    this.pictureUrls.clear();

    // Add recipe pictures
    if (recipe.pictureUrls) {
      recipe.pictureUrls.forEach((url) => {
        this.pictureUrls.push(this.fb.control(url));
      });
    }

    // Add new ingredients
    recipe.ingredients?.forEach((ingredient) => {
      const ingredientFb = this.createIngredientForm(ingredient);
      this.ingredients.push(ingredientFb);
    });

    // Add steps
    recipe.steps.forEach((step) => {
      const stepGroup = this.createStepsForm(step);
      step.pictureUrls?.forEach((url) => {
        (stepGroup.get('pictureUrls') as FormArray).push(this.fb.control(url));
      });

      this.recipeSteps.push(stepGroup);
    });

    console.log(this.recipeForm);
  }

  getRecipeFromForm(): Recipe {
    const formValue = this.basics.value;
    const recipeSteps = this.getRecipeSteps();
    const ingredients = this.getIngredients();

    const recipe: Recipe = {
      name: formValue.name as string,
      description: formValue.description as string,
      summary: formValue.summary as string,
      steps: recipeSteps,
      ingredients: ingredients,
      pictureUrls: this.pictureUrls.value,
      tags: [],
      id: this.loadedRecipe ? this.loadedRecipe.id : undefined,
    };

    // Map ingredientTags
    if (formValue.ingredientTags) {
      const ingredients = formValue.ingredientTags
        .split(',')
        .map((tag: string) => ({
          name: tag.trim(),
          category: 'mainIngredient',
        }));
      recipe.tags.push(...ingredients);
    }

    // Map originTags
    if (formValue.originTags) {
      const origins = formValue.originTags
        .split(',')
        .map((tag: string) => ({ name: tag.trim(), category: 'origin' }));
      recipe.tags.push(...origins);
    }

    // Map characterTags
    if (formValue.characterTags) {
      const characters = formValue.characterTags
        .split(',')
        .map((tag: string) => ({ name: tag.trim(), category: 'character' }));
      recipe.tags.push(...characters);
    }

    return recipe;
  }

  getValidationInfo(): string[] {
    const errors: string[] = [];

    if (this.basics.invalid) errors.push('recipe basics');

    if (this.recipeSteps.invalid || this.recipeSteps.length == 0)
      errors.push('recipe steps');

    if (this.ingredients.invalid || this.ingredients.length == 0)
      errors.push('ingredients');

    return errors;
  }

  reset() {
    this.recipeForm.reset();
    this.pictureUrls.clear();
    this.ingredients.clear();
    this.ingredients.push(this.createIngredientForm());
    this.recipeSteps.clear();
    this.recipeSteps.push(this.createStepsForm());
    this.loadedRecipe = undefined;
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
        pictureUrls: stepForm.get('pictureUrls')?.value,
      };

      recipeSteps.push(recipeStep);
    });

    return recipeSteps;
  }
}
