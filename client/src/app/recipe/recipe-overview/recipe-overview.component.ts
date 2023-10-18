import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  @ViewChild(RecipeDetailsComponent) private details?: RecipeDetailsComponent;

  // detailsActive: boolean = false;

  public viewDetailsClicked() {
    // this.detailsActive = !this.detailsActive;
    this.details?.toggle();
  }
}
