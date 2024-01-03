import { Ingredient } from './ingredient';
import { recipeStep } from './recipe-step';
import { ITag } from './tag';

export interface Recipe {
  id?: number;
  name: string;
  summary: string;
  description: string;
  pictureUrls: string[];
  steps: recipeStep[];
  tags: ITag[];
  ingredients?: Ingredient[];
  rating?: number;
  status?: string;
  userId?: string;
}
