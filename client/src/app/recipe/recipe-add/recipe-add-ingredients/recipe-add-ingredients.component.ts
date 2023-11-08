import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { RecipeAddService } from '../recipe-add.service';
import { SharedAnimationsModule } from 'src/app/common/animations/shared-animations.module';

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
    IngredientListComponent,
    SharedAnimationsModule,
  ],
  animations: [SharedAnimationsModule.elementAddedAnimation],
})
export class RecipeAddIngredientsComponent {
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  ingredientsForm?: FormGroup;

  unitOptions: string[] = ['litre', 'ml', 'kg', 'g', 'unit', 'tbsp', 'tsp'];

  constructor(private recipeAddService: RecipeAddService) {}

  get ingredientGroups(): FormGroup[] {
    return this.recipeAddService.ingredientForms.controls as FormGroup[];
  }

  // addIngredient = () => {
  //   const formValue = this.ingredientsForm?.value;
  //   const ingredient: Ingredient = {
  //     name: formValue.name ?? '',
  //     quantity: formValue.quantity ? +formValue.quantity : 0,
  //     unit: formValue.unit ?? '',
  //   };
  //   this.ingredients?.push(ingredient);
  //   this.ingredientsForm?.reset();
  // };

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
