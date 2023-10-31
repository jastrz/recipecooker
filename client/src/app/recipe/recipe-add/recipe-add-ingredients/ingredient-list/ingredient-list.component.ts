import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Ingredient } from 'src/app/models/ingredient';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class IngredientListComponent {
  @Input() ingredients: Ingredient[] = [];

  removeIngredient(id: number) {
    if (id >= 0 && id < this.ingredients.length) {
      this.ingredients.splice(id, 1);
    }
  }
}
