export interface RecipeStep {
  id: number;
  name: string;
  description: string;
  pictureUrls?: string[];
  pictures?: File[];
}
