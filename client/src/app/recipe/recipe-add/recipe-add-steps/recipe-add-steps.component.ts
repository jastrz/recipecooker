import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RecipeStepsListComponent } from './recipe-steps-list/recipe-steps-list.component';
import { RecipeStep } from 'src/app/models/recipeStep';
import { ImageLoaderComponent } from 'src/app/common/image-loader/image-loader.component';
import { RecipeAddService } from '../recipe-add.service';

@Component({
  selector: 'app-recipe-add-steps',
  templateUrl: './recipe-add-steps.component.html',
  styleUrls: ['./recipe-add-steps.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    ImageLoaderComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    RecipeStepsListComponent,
  ],
})
export class RecipeAddStepsComponent {
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  recipeStepForm?: FormGroup;

  constructor(private recipeAddService: RecipeAddService) {}

  get recipeStepsGroups(): FormGroup[] {
    return this.recipeAddService.recipeStepForms.controls as FormGroup[];
  }

  addRecipeStep() {
    this.recipeAddService.addRecipeStep();
  }

  removeRecipeStep(index: number) {
    this.recipeAddService.removeRecipeStep(index);
  }

  // addRecipeStep() {
  //   const name = this.recipeStepForm?.get('name')?.value;
  //   const description = this.recipeStepForm?.get('description')?.value;

  //   if (name && description) {
  //     const step: RecipeStep = {
  //       name: name,
  //       description: description,
  //       pictures: [...this.selectedImages],
  //       id: this.recipeSteps.length + 1,
  //     };
  //     this.recipeSteps?.push(step);
  //     this.recipeStepForm?.reset();
  //     this.selectedImages = [];
  //   }
  // }

  onSubmit() {
    this.formSubmitted.emit();
  }
}
