import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ImageLoaderComponent } from 'src/app/common/image-loader/image-loader.component';
import { RecipeAddService } from '../recipe-add.service';

@Component({
  selector: 'app-recipe-add-basics',
  templateUrl: './recipe-add-basics.component.html',
  styleUrls: ['./recipe-add-basics.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    ImageLoaderComponent,
  ],
})
export class RecipeAddBasicsComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<null>();
  recipeForm?: FormGroup;

  constructor(private recipeAddService: RecipeAddService) {}
  async ngOnInit(): Promise<void> {
    this.recipeForm = this.recipeAddService.recipeForm;
  }

  get pictures() {
    return this.recipeForm?.get('files')?.value;
  }

  onSubmit() {
    const formData = this.recipeForm?.value;
    console.log(formData);
    this.formSubmitted.emit();
  }
}
