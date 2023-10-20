import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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

  //selectedFiles: FileList = new FileList();
  fileNames: string[] = [];
  selectedFile: File | null = null;
  imageData: string | ArrayBuffer | null = null;

  //selectedFile?: File;

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    //this.selectedFiles = [...event.target.files];

    if(event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Create a FileReader to read the selected file
      const reader = new FileReader();
      reader.onload = (e) => {
        // Set the imageData to the data URL of the selected image
        if(e.target) this.imageData = e.target.result;
      };
      if(this.selectedFile) reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.imageData = null;
    }

    console.log(this.selectedFile);
  }

  onSubmit() {
    
    const formData = this.recipeForm?.value;
    console.log(formData);
    
  }
}
