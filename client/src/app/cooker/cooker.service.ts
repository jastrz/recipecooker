import { Injectable } from '@angular/core';
import { ITag, Tag } from '../models/tag';
import { Recipe } from '../models/recipe';
import { RecipesService } from '../recipe/recipes.service';

@Injectable({
  providedIn: 'root',
})
export class CookerService {
  tagsSelectedForSearch: ITag[] = [];
  recipes: Recipe[] = [];
  groupedTags: Map<string, Tag[]> = new Map(); // tags grouped by category

  constructor(private recipesService: RecipesService) {}

  setTags() {
    this.recipesService.getTags().subscribe({
      next: (result) => {
        this.setGroupedTags(result);
        if (this.tagsSelectedForSearch.length > 0) {
          this.updateRecipes();
        }
      },
    });
  }

  selectTag(tag: Tag) {
    if (tag.selected) {
      this.tagsSelectedForSearch.push(tag);
    } else {
      this.tagsSelectedForSearch = this.tagsSelectedForSearch.filter(
        (t) => t.name !== tag.name
      );
    }

    this.updateRecipes();
  }

  async getRecipesContaining(name: string) {
    await this.recipesService.getRecipesForOverview().subscribe({
      next: (result) => {
        this.recipes = result.filter((r) =>
          r.name.toLowerCase().includes(name.toLowerCase())
        );
        console.log(this.recipes);
      },
      error: (error) => console.log(error),
    });
  }

  private setGroupedTags(result: ITag[]) {
    const tags = result.map((tag) => new Tag(tag, true));
    this.groupedTags = tags.reduce((grouped, tag) => {
      if (!grouped.has(tag.category)) {
        grouped.set(tag.category, []);
      }

      if (this.tagsSelectedForSearch.some((t) => t.name === tag.name)) {
        tag.selected = true;
      }
      grouped.get(tag.category)?.push(tag);

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
