export interface User {
  displayName: string;
  email: string;
  token: string;
  savedRecipeIds?: string[];
}
