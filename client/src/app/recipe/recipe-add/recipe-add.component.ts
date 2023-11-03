import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { RecipeAddBasicsComponent } from './recipe-add-basics/recipe-add-basics.component';
import { RecipeAddStepsComponent } from './recipe-add-steps/recipe-add-steps.component';
import { RecipeStep } from 'src/app/models/recipeStep';
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';
import { RecipeStepsListComponent } from './recipe-add-steps/recipe-steps-list/recipe-steps-list.component';
import { Recipe } from 'src/app/models/recipe';
import { RecipesService } from 'src/app/cooker/recipes.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { mergeMap } from 'rxjs';
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
  imports: [ RecipeStepsListComponent, RecipeDetailsComponent, CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatStepperModule, RecipeAddBasicsComponent, RecipeAddStepsComponent, RecipeAddIngredientsComponent, IngredientListComponent]
})
export class RecipeAddComponent {
  @ViewChild('stepper') stepper?: MatStepper;

  recipeSteps: RecipeStep[] = [];
  ingredients: Ingredient[] = [];
  recipeImages: File[] = [];
  stepImages: File[] = [];
  private pictureUrls : string[] = [];
  private stepsImagesUrls: string[] = [];
  private recipeFormValues : any;

  recipeForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    ingredientTags: ['', Validators.required],
    originTags: ['', Validators.required],
    characterTags: ['', Validators.required]
  });

  ingredientsForm = this.fb.group({
    name: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    unit: ['', Validators.required]
  })

  recipeStepForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
    // imageFile: File
  });

  constructor(private fb: FormBuilder, private recipeService: RecipesService, 
    private fileUploadService : FileUploadService, private router: Router, private toastr: ToastrService,
    private accountService: AccountService) { }

  setFiles(files: File[]) {
    this.recipeImages = files;
  }

  onBasicsStepSubmit() {
    console.log("submitted basics");
    console.log(this.recipeImages);
    this.stepper?.next();
  }

  onIngredientsStepSubmitted(ingredients: Ingredient[]) {
    // this.ingredients = ingredients;
    console.log("submitted ingredients");
    console.log(this.ingredients);
    this.stepper?.next();
  }

  onStepsStepSubmitted(steps: RecipeStep[]) {
    // this.recipeSteps = steps;
    console.log("submitted steps.");
    console.log(this.recipeSteps);
    this.stepper?.next();
  }

  private getRecipe() : Recipe {
    return this.mapFormToRecipe();
  }

  async postRecipe() {

    const authenticated = await this.accountService.isAuthenticated();
    console.log(`Authenticated: ${authenticated}`);
    if(!authenticated) this.router.navigateByUrl('account');

    if(this.recipeImages.length == 0) return;

    this.fileUploadService.uploadFiles(this.recipeImages, "recipes/post/image").pipe(
      mergeMap(response => {
        this.pictureUrls = response;
        return this.fileUploadService.uploadFiles(this.stepImages, "recipes/post/step-images");
      }),
      mergeMap(response => {
        this.stepsImagesUrls = response;
        const recipe = this.getRecipe();
        return this.recipeService.postRecipe(recipe);
      })
    ).subscribe({
      next: id => {
        this.toastr.success("Recipe added!");
        this.router.navigateByUrl("cook/recipe/" + id);
      },
      error: error => {
        this.toastr.error(error);
        console.error(error)
      }
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
      tags: [],
    };
    
    // Map ingredientTags
    if (formValue.ingredientTags) {
      const ingredients = formValue.ingredientTags.split(',').map(tag => ({ name: tag.trim(), category: 'mainIngredient' }));
      recipe.tags.push(...ingredients);
    }
    
    // Map originTags
    if (formValue.originTags) {
      const origins = formValue.originTags.split(',').map(tag => ({ name: tag.trim(), category: 'origin' }));
      recipe.tags.push(...origins);
    }
    
    // Map characterTags
    if (formValue.characterTags) {
      const characters = formValue.characterTags.split(',').map(tag => ({ name: tag.trim(), category: 'character' }));
      recipe.tags.push(...characters);
    }
    
    console.log(recipe);
    return recipe;
  }
}
