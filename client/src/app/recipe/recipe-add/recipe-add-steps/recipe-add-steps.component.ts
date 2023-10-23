import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-recipe-add-steps',
  templateUrl: './recipe-add-steps.component.html',
  styleUrls: ['./recipe-add-steps.component.scss'],
  standalone: true,
  imports: [MatIconModule, FormsModule, ReactiveFormsModule, CommonModule, MatInputModule, MatSelectModule]

})
export class RecipeAddStepsComponent {
  @Input() recipeStepForm?: FormGroup;
  @Input() stepAdd? : () => void;

  public addRecipeStep() {
    this.stepAdd?.();
  }
}
