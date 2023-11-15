import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { RecipeOverviewComponent } from 'src/app/recipe/recipe-overview/recipe-overview.component';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-saved-recipes-list',
  templateUrl: './saved-recipes-list.component.html',
  styleUrls: ['./saved-recipes-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RecipeOverviewComponent],
})
export class SavedRecipesListComponent implements OnInit {
  savedRecipes: Recipe[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getSavedRecipes().subscribe({
      next: (data: Recipe[]) => (this.savedRecipes = data),
      error: (error) => console.log(error),
    });
  }
}
