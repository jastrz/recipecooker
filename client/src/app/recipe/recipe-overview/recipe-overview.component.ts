import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';
import { animate, style, transition, trigger } from '@angular/animations';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-recipe-overview',
  templateUrl: './recipe-overview.component.html',
  styleUrls: ['./recipe-overview.component.scss'],
  standalone: true,
  imports: [CommonModule, RecipeDetailsComponent, MatCardModule, MatButtonModule],
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
  @ViewChild(RecipeDetailsComponent) private details?: RecipeDetailsComponent;

  // detailsActive: boolean = false;

  public viewDetailsClicked() {
    // this.detailsActive = !this.detailsActive;
    this.details?.toggle();
  }
}
