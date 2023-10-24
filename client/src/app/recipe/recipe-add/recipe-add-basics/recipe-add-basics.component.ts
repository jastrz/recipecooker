import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-recipe-add-basics',
  templateUrl: './recipe-add-basics.component.html',
  styleUrls: ['./recipe-add-basics.component.scss'],
  standalone: true,
  imports: [MatIconModule, FormsModule, ReactiveFormsModule, CommonModule, MatInputModule, MatSelectModule]
})
export class RecipeAddBasicsComponent {
  @Input() recipeForm?: FormGroup;
  @Output() selectedFileEvent = new EventEmitter<File>();

  selectedFile? : File;
  imageData: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;

    if(event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileEvent.emit(this.selectedFile);
      const reader = new FileReader();

      reader.onload = (e) => {
        if(e.target) this.imageData = e.target.result;
      };
      
      if(this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    } else {
      this.imageData = null;
    }
  }

  onSubmit() {
    const formData = this.recipeForm?.value;
    console.log(formData);
  }
}
