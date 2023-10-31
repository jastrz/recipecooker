import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-recipe-add-ingredients',
  templateUrl: './recipe-add-ingredients.component.html',
  styleUrls: ['./recipe-add-ingredients.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatSelectModule]
})
export class RecipeAddIngredientsComponent {
  @Input() ingriedientsForm?: FormGroup;
  @Output() addIngredientEvent: EventEmitter<void> = new EventEmitter<void>();

  unitOptions: string[] = ['litre', 'ml', 'kg', 'g', 'unit', 'tbsp', 'tsp'];

  public addIngredient() {
    this.addIngredientEvent.emit();
  }
}
