import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from 'src/app/cooker/recipes.service';
import { Recipe } from 'src/app/models/recipe';
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
  active : boolean = false;
  recipe?: Recipe;

  constructor(private recipeService: RecipesService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id) return;

    this.recipeService.getRecipe(+id).subscribe({
      next: data => {
        this.recipe = data;
      }
    })
  }

  onClickBackButton() {
    this.router.navigateByUrl("/cook");
  }
}
