import { Component, OnInit, ViewChild } from '@angular/core';
import { MatChipListbox } from '@angular/material/chips';
import { RecipesService } from './recipes.service';
import { Recipe } from '../models/recipe';
import { Tag } from '../models/tag';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-cooker',
  templateUrl: './cooker.component.html',
  styleUrls: ['./cooker.component.scss'],

})
export class CookerComponent implements OnInit {

  @ViewChild('meatList') meatList?: MatChipListbox;
  @ViewChild(MatAccordion) accordion?: MatAccordion;

  recipes: Recipe[] = [];
  tags: Map<string, string[]> = new Map();
  currentRecipeIndex: number = 0;
  currentRecipe: Recipe | undefined;
  tagsSelectedForSearch: Tag[] = [];

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
    this.recipesService.getRecipes(this.tagsSelectedForSearch).subscribe({
      next: result => {
        this.recipes = result;
        this.currentRecipeIndex = 0;
        this.getCurrentRecipe();
        this.accordion?.closeAll();
      },
      error: error => console.log(error)
    });
  }

  getTags() {
    this.recipesService.getTags().subscribe({
      next: result => {
        const tags = result;
        this.tags = tags.reduce((grouped, tag) => {
          if (!grouped.has(tag.category)) {
            grouped.set(tag.category, []);
          }
          if(tag.name) grouped.get(tag.category)?.push(tag.name);
          return grouped;
        }, new Map<string, string[]>());
        console.log(this.tags);
      }
    })
  }

  setTagForSearch($event : Tag) {
    const tagForSearch = this.tagsSelectedForSearch.find(tag => tag.category == $event.category);

    if(tagForSearch) 
      tagForSearch.name = $event.name;
    else
      this.tagsSelectedForSearch.push($event);

    console.log(this.tagsSelectedForSearch);
  }

  splitCamelCase(input: string): string {
    return input
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
