import { Component, OnInit, ViewChild } from '@angular/core';
import { MatChipListbox, MatChipListboxChange } from '@angular/material/chips';
import { RecipesService } from './recipes.service';
import { Recipe } from '../models/recipe';

@Component({
  selector: 'app-cooker',
  templateUrl: './cooker.component.html',
  styleUrls: ['./cooker.component.scss'],

})
export class CookerComponent implements OnInit {

  @ViewChild('meatList') meatList?: MatChipListbox;
  recipes: Recipe[] = [];
  tags: Map<string, string[]> = new Map();
  currentRecipeIndex: number = 0;
  currentRecipe: Recipe | undefined;

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.getTags();
  }

  getCurrentRecipe(): Recipe | undefined {
    this.currentRecipe = this.recipes[this.currentRecipeIndex]; 
    return this.currentRecipe;
  }

  incrementRecipeIndex() {
    if (this.currentRecipeIndex < this.recipes.length - 1) {
      this.currentRecipeIndex++;
      this.getCurrentRecipe();
    }
  }

  decrementRecipeIndex() {
    if (this.currentRecipeIndex > 0) {
      this.currentRecipeIndex--;
      this.getCurrentRecipe();
    }
  }

  getRecipes() {
    this.recipesService.getRecipes().subscribe({
      next: result => {
        this.recipes = result;
        this.getCurrentRecipe();
      },
      error: error => console.log(error)
    });
  }

  getTags() {
    this.recipesService.getTags().subscribe({
      next: result => {
        console.log("got tags", result);
        const tags = result;
        this.tags = tags.reduce((grouped, tag) => {
          if (!grouped.has(tag.type)) {
            grouped.set(tag.type, []);
          }
          grouped.get(tag.type)?.push(tag.name);
          return grouped;
        }, new Map<string, string[]>());
        console.log(this.tags);
      }
    })
  }
}
