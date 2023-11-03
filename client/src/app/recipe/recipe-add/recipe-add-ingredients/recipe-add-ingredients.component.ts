import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Ingredient } from 'src/app/models/ingredient';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';

@Component({
  selector: 'app-recipe-add-ingredients',
  templateUrl: './recipe-add-ingredients.component.html',
  styleUrls: ['./recipe-add-ingredients.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatSelectModule, IngredientListComponent]
})
export class RecipeAddIngredientsComponent {
  @Input() ingredientsForm?: FormGroup;
  @Input() ingredients: Ingredient[] = [];
  @Output() formSubmitted: EventEmitter<Ingredient[]> = new EventEmitter<Ingredient[]>();

  

  unitOptions: string[] = ['litre', 'ml', 'kg', 'g', 'unit', 'tbsp', 'tsp'];

  constructor(private fb: FormBuilder) {}

  addIngredient = () => {

    const formValue = this.ingredientsForm?.value;
    const ingredient: Ingredient = {
      name: formValue.name ?? '',
      quantity: formValue.quantity ? +formValue.quantity : 0,
      unit: formValue.unit ?? '',
    };
    this.ingredients?.push(ingredient);
    this.ingredientsForm?.reset();
  }

  onSubmit() {
    this.formSubmitted.emit(this.ingredients);
  }
}
