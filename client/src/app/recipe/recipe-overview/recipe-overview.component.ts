import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';

@Component({
  selector: 'app-recipe-overview',
  templateUrl: './recipe-overview.component.html',
  styleUrls: ['./recipe-overview.component.scss'],
  standalone: true,
  imports: [CommonModule, RecipeDetailsComponent]
})
export class RecipeOverviewComponent {
  @Input() recipe?: Recipe;

  detailsActive: boolean = false;

  public viewDetailsClicked() {
    this.detailsActive = !this.detailsActive;
  }
}
