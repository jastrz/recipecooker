import { NgModule } from '@angular/core';
import { CookerRoutingModule } from './cooker-routing.module';
import { CookerComponent } from './cooker.component';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { TagsholderComponent } from '../tagsholder/tagsholder.component';


@NgModule({
  declarations: [
    CookerComponent,
    
  ],
  imports: [
    CommonModule,
    CookerRoutingModule,
    MatChipsModule,
    TagsholderComponent
  ]
})
export class CookerModule { }
