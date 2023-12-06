import { NgModule } from '@angular/core';
import { CookerRoutingModule } from './cooker-routing.module';
import { CookerComponent } from './cooker.component';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { TagsholderComponent } from '../tagsholder/tagsholder.component';
import { RecipeOverviewComponent } from '../recipe/recipe-overview/recipe-overview.component';
import { RecipeDetailsComponent } from '../recipe/recipe-details/recipe-details.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneratorViewComponent } from './generator-view/generator-view.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [CookerComponent],
  imports: [
    CommonModule,
    CookerRoutingModule,
    MatChipsModule,
    TagsholderComponent,
    RecipeOverviewComponent,
    RecipeDetailsComponent,
    MatExpansionModule,
    NgbPaginationModule,
    GeneratorViewComponent,
    SearchComponent
  ],
})
export class CookerModule {}
