import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ImageLoaderComponent } from 'src/app/common/image-loader/image-loader.component';


@Component({
  selector: 'app-recipe-add-basics',
  templateUrl: './recipe-add-basics.component.html',
  styleUrls: ['./recipe-add-basics.component.scss'],
  standalone: true,
  imports: [MatIconModule, FormsModule, ReactiveFormsModule, CommonModule, MatInputModule, MatSelectModule, ImageLoaderComponent]
})
export class RecipeAddBasicsComponent {
  @Input() recipeForm? : FormGroup;
  @Input() recipeImages: File[] = [];
  // @Output() selectedFileEvent = new EventEmitter<File[]>();
  @Output() formSubmitted = new EventEmitter<null>();


  
  constructor(private fb: FormBuilder) {}

  onSubmit() {
    const formData = this.recipeForm?.value;
    console.log(formData);
    this.formSubmitted.emit();
  }

  
}
