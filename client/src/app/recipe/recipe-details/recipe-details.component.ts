import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RecipesService } from 'src/app/cooker/recipes.service';
import { RecipeStep } from 'src/app/models/recipeStep';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('openClose', [
      state('closed', style({ transform: 'translateX(-100%)', opacity: 0})),
      transition('open => closed', [
        animate('.1s ease-out')
      ]),
      transition('closed => open', [
        animate(('.15s ease-in'))
      ])
    ])
  ]
})
export class RecipeDetailsComponent implements OnInit {
  @Input() recipeId?: number;

  steps : RecipeStep[] = [];
  active : boolean = false;

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    console.log(this.recipeId);
    this.recipeId && this.recipeService.getRecipeSteps(this.recipeId).subscribe({
      next: data => this.steps = data
    })

    console.log(this.steps);
    
  }

  toggle() {
    this.active = !this.active;
    console.log(this.active);
  }
}
