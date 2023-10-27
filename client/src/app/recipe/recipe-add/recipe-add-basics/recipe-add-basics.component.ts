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
  @Output() selectedFileEvent = new EventEmitter<File[]>();

  selectedFiles : File[] = [];
  imagesData: (string | ArrayBuffer | null)[] = [];

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;

    
    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        const file: File = fileList[i];
        this.selectedFiles.push(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            this.imagesData.push(e.target.result);
          }
        };
        
        reader.readAsDataURL(file);
      }
      
      this.selectedFileEvent.emit(this.selectedFiles);
    } else {
      this.imagesData = [];
    }
    console.log(this.selectedFiles);
  }

  removeImage(id : number) {
    this.selectedFiles.splice(id, 1);
    this.imagesData.splice(id, 1);
  }

  onSubmit() {
    const formData = this.recipeForm?.value;
    console.log(formData);
  }
}
