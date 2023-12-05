import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ImageLoaderComponent } from 'src/app/common/image-loader/image-loader.component';
import { RecipeAddService } from '../recipe-add.service';
import { SharedAnimationsModule } from 'src/app/common/animations/shared-animations.module';
import { MatCardModule } from '@angular/material/card';

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
    SharedAnimationsModule,
    MatCardModule,
  ],
  animations: [SharedAnimationsModule.elementAddedAnimation],
})
export class RecipeAddStepsComponent {
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  recipeStepForm?: FormGroup;

  constructor(private recipeAddService: RecipeAddService) {}

  get recipeSteps() {
    return this.recipeAddService.recipeSteps;
  }

  get recipeForm() {
    return this.recipeAddService.recipeForm;
  }

  addRecipeStep() {
    this.recipeAddService.addRecipeStep();
  }

  removeRecipeStep(index: number) {
    console.log(`remove recipe step ${index}`);
    this.recipeAddService.removeRecipeStep(index);
  }

  onSubmit() {
    this.formSubmitted.emit();
  }
}
