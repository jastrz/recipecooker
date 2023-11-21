import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { RecipeAddBasicsComponent } from './recipe-add-basics/recipe-add-basics.component';
import { RecipeAddStepsComponent } from './recipe-add-steps/recipe-add-steps.component';
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';
import { RecipeStepsListComponent } from './recipe-add-steps/recipe-steps-list/recipe-steps-list.component';
import { RecipesService } from 'src/app/services/recipes.service';
import { RecipeAddIngredientsComponent } from './recipe-add-ingredients/recipe-add-ingredients.component';
import { IngredientListComponent } from './recipe-add-ingredients/ingredient-list/ingredient-list.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { RecipeAddService } from './recipe-add.service';
import { SharedAnimationsModule } from 'src/app/common/animations/shared-animations.module';
import { Observable } from 'rxjs';

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
    SharedAnimationsModule,
  ],
  animations: [SharedAnimationsModule.openCloseAnimation],
})
export class RecipeAddComponent {
  @ViewChild('stepper') stepper?: MatStepper;

  constructor(
    private recipeService: RecipesService,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService,
    private recipeAddService: RecipeAddService
  ) {}

  onBasicsStepSubmit() {
    console.log('submitted basics');
    this.stepper?.next();
  }

  onIngredientsStepSubmitted() {
    console.log('submitted ingredients');
    this.stepper?.next();
  }

  onStepsStepSubmitted() {
    console.log('submitted steps.');
    this.stepper?.next();
  }

  reset() {
    this.stepper?.reset();
    this.recipeAddService.reset();
  }

  async publishRecipe() {
    const authenticated = await this.accountService.isAuthenticated();
    console.log(`Authenticated: ${authenticated}`);
    if (!authenticated) this.router.navigateByUrl('account');

    const recipe = this.recipeAddService.getRecipe();

    console.log(recipe);

    let recipePublishObservable: Observable<number>;
    if (recipe.id) {
      recipePublishObservable = this.recipeService.putRecipe(recipe);
    } else {
      recipePublishObservable = this.recipeService.postRecipe(recipe);
    }

    recipePublishObservable.subscribe({
      next: (id) => {
        recipe.id = id;
        this.toastr.success('Recipe published!');
        this.recipeService.getRecipe(recipe.id, false).subscribe({
          next: () => {
            this.router.navigateByUrl('cook/recipe/' + recipe.id);
            this.reset();
          },
          error: (error) => console.log(error),
        });
      },
      error: (error) => {
        this.toastr.error(error);
        console.error(error);
      },
    });
  }

  get recipeValidationErrors(): string[] {
    return this.recipeAddService.getValidationInfo();
  }
}
