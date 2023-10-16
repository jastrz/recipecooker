import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RecipesService } from 'src/app/cooker/recipes.service';
import { RecipeStep } from 'src/app/models/recipeStep';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class RecipeDetailsComponent implements OnInit {
  @Input() recipeId?: number;

  steps : RecipeStep[] = [];

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    console.log(this.recipeId);
    this.recipeId && this.recipeService.getRecipeSteps(this.recipeId).subscribe({
      next: data => this.steps = data
    })

    console.log(this.steps);
  }
}
