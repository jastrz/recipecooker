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

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: ['./recipe-add.component.scss'],
  standalone: true,
  imports: [RecipeStepsListComponent, RecipeDetailsComponent, CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatStepperModule, RecipeAddBasicsComponent, RecipeAddStepsComponent]
})
export class RecipeAddComponent {

  recipeSteps: RecipeStep[] = [];

  recipeForm = this.fb.group({
    name: [''],
    description: [''],
    pictureUrls: [''],
    ingredientTags: [''],
    originTags: [''],
    characterTags: ['']
  });

  recipeStepForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) { }

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
}
