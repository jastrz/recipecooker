import { Component, OnInit, ViewChild } from '@angular/core';
import { MatChipListbox } from '@angular/material/chips';
import { Recipe } from '../models/recipe';
import { Tag } from '../models/tag';
import { MatAccordion } from '@angular/material/expansion';
import { BreadcrumbService } from 'xng-breadcrumb';
import { CookerService } from './cooker.service';
import { SharedAnimationsModule } from '../common/animations/shared-animations.module';

@Component({
  selector: 'app-cooker',
  templateUrl: './cooker.component.html',
  styleUrls: ['./cooker.component.scss'],
  animations: [SharedAnimationsModule.openCloseAnimation],
})
export class CookerComponent implements OnInit {
  @ViewChild('meatList') meatList?: MatChipListbox;
  @ViewChild(MatAccordion) accordion?: MatAccordion;

  showRecipes: boolean = false;
  currentPage = 1;
  pageSize = 6;

  constructor(
    private bcService: BreadcrumbService,
    private cookerService: CookerService
  ) {
    bcService.set('cook/', 'find recipe');
  }

  ngOnInit(): void {
    this.cookerService.initialize();
  }

  toggleRecipes() {
    this.showRecipes = !this.showRecipes;

    if (this.showRecipes) this.accordion?.closeAll();
    else this.accordion?.openAll();
  }

  onCookerOpened() {
    this.showRecipes = false;
  }

  public get groupedTags(): Map<string, Tag[]> {
    return this.cookerService.groupedTags;
  }

  public get recipes(): Recipe[] {
    return this.cookerService.recipes;
  }

  getCurrentPageRecipes(): Recipe[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.recipes.slice(startIndex, endIndex);
  }

  splitCamelCase(input: string): string {
    return input
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
