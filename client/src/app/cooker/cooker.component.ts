import { Component, OnInit, ViewChild } from '@angular/core';
import { MatChipListbox } from '@angular/material/chips';
import { RecipesService } from './recipes.service';
import { Recipe } from '../models/recipe';
import { ITag, Tag } from '../models/tag';
import { MatAccordion } from '@angular/material/expansion';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-cooker',
  templateUrl: './cooker.component.html',
  styleUrls: ['./cooker.component.scss'],

})
export class CookerComponent implements OnInit {

  @ViewChild('meatList') meatList?: MatChipListbox;
  @ViewChild(MatAccordion) accordion?: MatAccordion;

  recipes: Recipe[] = [];
  groupedTags: Map<string, Tag[]> = new Map();
  tagsSelectedForSearch: ITag[] = [];
  showRecipes: boolean = false;
  activeTags: Tag[] = [];

  currentPage = 1;
  pageSize = 6;

  constructor(private recipesService: RecipesService, private bcService : BreadcrumbService) {
    bcService.set('cook/', 'find recipe')
  }

  ngOnInit(): void {
    this.getTags();
  }

  toggleRecipes() {
    this.showRecipes = !this.showRecipes;

    if(this.showRecipes) 
      this.accordion?.closeAll();
    else
      this.accordion?.openAll();
  }

  onCookerOpened() {
    this.showRecipes = false;
  }

  getRecipes() {
    this.recipesService.getRecipes(this.tagsSelectedForSearch).subscribe({
      next: result => {
        this.recipes = result;
        this.updateTags();
      },
      error: error => console.log(error)
    });
  }

  getTags() {
    this.recipesService.getTags().subscribe({
      next: result => {
        const tags = result.map(tag => new Tag(tag, true));
        this.groupedTags = tags.reduce((grouped, tag) => {
          if (!grouped.has(tag.category)) {
            grouped.set(tag.category, []);
          }
          if(tag.name) grouped.get(tag.category)?.push(tag);
          return grouped;
        }, new Map<string, Tag[]>());
      }
    })
  }

  getCurrentPageRecipes(): Recipe[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.recipes.slice(startIndex, endIndex);
  }

  selectTag(tag: Tag) {
    if(tag.active) {
      this.tagsSelectedForSearch.push(tag);
    } 
    else {
      this.tagsSelectedForSearch = this.tagsSelectedForSearch.filter(t => t.name !== tag.name);
    }

    this.getRecipes();
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

  private updateTags() {
    const tagsInRecipes = new Set(this.recipes.map(o => o.tags.map(o => o.name)).flat());
    console.log(tagsInRecipes);

    for (const [category, tags] of this.groupedTags) {
      for (const tag of tags) {
        tag.active = tagsInRecipes.has(tag.name);
      }
    }
  }
}