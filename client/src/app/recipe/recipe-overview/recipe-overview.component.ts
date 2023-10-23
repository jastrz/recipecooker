import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { animate, style, transition, trigger } from '@angular/animations';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-overview',
  templateUrl: './recipe-overview.component.html',
  styleUrls: ['./recipe-overview.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  animations: [
    trigger('pictureAnimation', [
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.99)' }),
        animate('150ms', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class RecipeOverviewComponent {
  @Input() recipe?: Recipe;

  constructor(private router: Router) {}

  public viewDetailsClicked() {
    this.router.navigateByUrl('/recipe/' + this.recipe?.id);
  }
}
