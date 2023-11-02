import { Ingredient } from "./ingredient";
import { RecipeStep } from "./recipeStep";
import { ITag } from "./tag";

export interface Recipe {
    id?: number;
    name: string;
    description: string;
    pictureUrls: string[];
    steps: RecipeStep[];
    tags: ITag[];
    ingredients?: Ingredient[];
}