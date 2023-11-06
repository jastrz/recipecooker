import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ImageLoaderComponent {
  @Input() selectedImages?: File[];
  imagesData: (string | ArrayBuffer | null)[] = [];

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;

    if (this.selectedImages?.length == 0) {
      this.imagesData = [];
    }

    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        const file: File = fileList[i];
        this.selectedImages?.push(file);
        this.readImage(file);
      }
    }
    console.log(this.selectedImages);
  }

  removeImage(id: number) {
    this.selectedImages?.splice(id, 1);
    this.imagesData.splice(id, 1);
  }

  private readImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e);
      if (e.target) {
        this.imagesData.push(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  }
}
