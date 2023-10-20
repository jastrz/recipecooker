import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { RecipeAddBasicsComponent } from './recipe-add-basics/recipe-add-basics.component';
import { RecipeAddStepsComponent } from './recipe-add-steps/recipe-add-steps.component';
import { Recipe } from 'src/app/models/recipe';

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: ['./recipe-add.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatStepperModule, RecipeAddBasicsComponent, RecipeAddStepsComponent]
})
export class RecipeAddComponent {

  recipeForm = this.fb.group({
    name: [''],
    description: [''],
    pictureUrls: [''],
    ingredientTags: [''],
    originTags: [''],
    characterTags: ['']
  });

  constructor(private fb: FormBuilder) {

  }
}
