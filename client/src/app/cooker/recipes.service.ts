import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private hostUrl = "https://localhost:5002/api/"
  recipes: Recipe[] = [];

  constructor(private http: HttpClient) { }

  public getRecipes() {
    return this.http.get<Recipe[]>(this.hostUrl + "Recipes");
  }
}
