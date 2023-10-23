import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RecipeStep } from 'src/app/models/recipeStep';

@Component({
  selector: 'app-recipe-steps-list',
  templateUrl: './recipe-steps-list.component.html',
  styleUrls: ['./recipe-steps-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class RecipeStepsListComponent {
  @Input() recipeSteps: RecipeStep[] = [];

  removeRecipeStep(id: number) {
    if (id >= 0 && id < this.recipeSteps.length) {
      this.recipeSteps.splice(id, 1);
    }
  }
}
