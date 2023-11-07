import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { RecipeAddBasicsComponent } from './recipe-add-basics/recipe-add-basics.component';
import { RecipeAddStepsComponent } from './recipe-add-steps/recipe-add-steps.component';
import { RecipeStep } from 'src/app/models/recipeStep';
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';
import { RecipeStepsListComponent } from './recipe-add-steps/recipe-steps-list/recipe-steps-list.component';
import { Recipe } from 'src/app/models/recipe';
import { RecipesService } from 'src/app/services/recipes.service';
import { Ingredient } from 'src/app/models/ingredient';
import { RecipeAddIngredientsComponent } from './recipe-add-ingredients/recipe-add-ingredients.component';
import { IngredientListComponent } from './recipe-add-ingredients/ingredient-list/ingredient-list.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: ['./recipe-add.component.scss'],
  standalone: true,
  imports: [
    RecipeStepsListComponent,
    RecipeDetailsComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatStepperModule,
    RecipeAddBasicsComponent,
    RecipeAddStepsComponent,
    RecipeAddIngredientsComponent,
    IngredientListComponent,
  ],
})
export class RecipeAddComponent {
  @ViewChild('stepper') stepper?: MatStepper;

  recipeSteps: RecipeStep[] = [];
  ingredients: Ingredient[] = [];
  recipeImages: File[] = [];
  stepImages: File[] = [];

  recipeForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    summary: ['', Validators.required],
    ingredientTags: ['', Validators.required],
    originTags: ['', Validators.required],
    characterTags: ['', Validators.required],
  });

  ingredientsForm = this.fb.group({
    name: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    unit: ['', Validators.required],
  });

  recipeStepForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipesService,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService
  ) {}

  setFiles(files: File[]) {
    this.recipeImages = files;
  }

  onBasicsStepSubmit() {
    console.log('submitted basics');
    console.log(this.recipeImages);
    this.stepper?.next();
  }

  onIngredientsStepSubmitted(ingredients: Ingredient[]) {
    console.log('submitted ingredients');
    console.log(this.ingredients);
    this.stepper?.next();
  }

  onStepsStepSubmitted(steps: RecipeStep[]) {
    console.log('submitted steps.');
    console.log(this.recipeSteps);
    this.stepper?.next();
  }

  private getRecipe(): Recipe {
    return this.mapFormToRecipe();
  }

  async postRecipe() {
    const authenticated = await this.accountService.isAuthenticated();
    console.log(`Authenticated: ${authenticated}`);
    if (!authenticated) this.router.navigateByUrl('account');

    const recipe = this.getRecipe();

    this.recipeService.uploadRecipe(recipe, this.recipeImages).subscribe({
      next: () => {
        this.toastr.success('Recipe added!');
        this.router.navigateByUrl('cook/recipe/' + recipe.id);
        console.log(recipe.id);
      },
      error: (error) => {
        this.toastr.error(error);
        console.error(error);
        console.log(recipe.id);
      },
    });
  }

  private mapFormToRecipe(): Recipe {
    const formValue = this.recipeForm.value;

    const recipe: Recipe = {
      name: formValue.name as string,
      description: formValue.description as string,
      summary: formValue.summary as string,
      steps: this.recipeSteps,
      ingredients: this.ingredients,
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
}
