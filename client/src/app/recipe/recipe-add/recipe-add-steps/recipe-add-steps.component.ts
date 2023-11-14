import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RecipeStepsListComponent } from './recipe-steps-list/recipe-steps-list.component';
import { ImageLoaderComponent } from 'src/app/common/image-loader/image-loader.component';
import { RecipeAddService } from '../recipe-add.service';
import { SharedAnimationsModule } from 'src/app/common/animations/shared-animations.module';

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
    SharedAnimationsModule,
  ],
  animations: [SharedAnimationsModule.elementAddedAnimation],
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

  onSubmit() {
    this.formSubmitted.emit();
  }
}
