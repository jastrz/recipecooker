import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatChipListbox, MatChipListboxChange } from '@angular/material/chips';
import { RecipesService } from './recipes.service';
import { Recipe } from '../models/recipe';
// import { MatChipInputEvent, MatChipListbox, MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-cooker',
  templateUrl: './cooker.component.html',
  styleUrls: ['./cooker.component.scss'],

})
export class CookerComponent implements OnInit {

  @ViewChild('meatList') meatList?: MatChipListbox;
  recipes: Recipe[] = [];

  constructor(private recipesService: RecipesService) {

  }

  ngOnInit(): void {
    
    console.log(this.meatList?.ariaOrientation);
    
  }

  public onChange(event : MatChipListboxChange) {
    console.log(event.value);
  }

  public getRecipes() {
    this.recipesService.getRecipes().subscribe({
      next: result => {
        this.recipes = result;
        console.log("got data: " + result);
      },
      error: error => console.log(error)
    });

  }
}
