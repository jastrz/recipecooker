import { NgModule } from '@angular/core';
import { CookerRoutingModule } from './cooker-routing.module';
import { CookerComponent } from './cooker.component';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    CookerComponent,
    
  ],
  imports: [
    CommonModule,
    CookerRoutingModule,
    MatChipsModule
  ]
})
export class CookerModule { }
