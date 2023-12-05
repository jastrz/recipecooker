import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RecipeAddService } from '../recipe-add.service';
import { SharedAnimationsModule } from 'src/app/common/animations/shared-animations.module';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-recipe-add-ingredients',
  templateUrl: './recipe-add-ingredients.component.html',
  styleUrls: ['./recipe-add-ingredients.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    SharedAnimationsModule,
    FormsModule,
    MatCardModule,
  ],
  animations: [SharedAnimationsModule.elementAddedAnimation],
})
export class RecipeAddIngredientsComponent {
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();

  unitOptions: string[] = ['litre', 'ml', 'kg', 'g', 'unit', 'tbsp', 'tsp'];

  constructor(public recipeAddService: RecipeAddService) {}

  get ingredients(): FormArray {
    return this.recipeAddService.recipeForm.get('ingredients') as FormArray;
  }

  get recipeForm() {
    return this.recipeAddService.recipeForm;
  }

  addIngredient() {
    this.recipeAddService.addIngredient();
  }

  removeIngredient(index: number) {
    this.recipeAddService.removeIngredient(index);
  }

  onSubmit() {
    this.formSubmitted.emit();
  }
}
