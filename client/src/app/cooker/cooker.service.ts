import { Injectable } from '@angular/core';
import { ITag, Tag } from '../models/tag';
import { Recipe } from '../models/recipe';
import { RecipesService } from '../services/recipes.service';
import { map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CookerService {
  tagsSelectedForSearch: ITag[] = [];
  recipes: Recipe[] = [];
  groupedTags: Map<string, Tag[]> = new Map(); // tags grouped by category

  constructor(private recipesService: RecipesService) {}

  // todo: reset or add tag / tags after recipe additiion
  initialize() {
    if (this.groupedTags.size == 0) {
      return this.recipesService.getTags().subscribe({
        next: (result) => {
          this.updateGroupedTags(result);
          if (this.tagsSelectedForSearch.length > 0) {
            this.updateRecipes();
          }
        },
      });
    } else {
      if (this.tagsSelectedForSearch.length > 0) {
        this.updateRecipes();
      }
      return of(undefined);
    }
  }

  selectTag(tag: Tag) {
    if (tag.active) {
      this.tagsSelectedForSearch.push(tag);
    } else {
      this.tagsSelectedForSearch = this.tagsSelectedForSearch.filter(
        (t) => t.name !== tag.name
      );
    }

    this.updateRecipes();
  }

  private updateGroupedTags(result: ITag[]) {
    const tags = result.map((tag) => new Tag(tag, true));
    this.groupedTags = tags.reduce((grouped, tag) => {
      if (!grouped.has(tag.category)) {
        grouped.set(tag.category, []);
      }
      if (tag.name) grouped.get(tag.category)?.push(tag);
      return grouped;
    }, new Map<string, Tag[]>());
  }

  private updateRecipes() {
    return this.recipesService
      .getRecipesForOverview(this.tagsSelectedForSearch)
      .subscribe({
        next: (result) => {
          this.recipes = result;
          this.updateTags();
        },
      });
  }

  private updateTags() {
    const tagsInRecipes = new Set(
      this.recipes.map((o) => o.tags.map((o) => o.name)).flat()
    );
    console.log(tagsInRecipes);

    for (const [category, tags] of this.groupedTags) {
      for (const tag of tags) {
        tag.active = tagsInRecipes.has(tag.name);
      }
    }
  }
}
