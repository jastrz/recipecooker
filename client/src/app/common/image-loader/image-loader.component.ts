import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ImageLoaderComponent {
  @Input() pictureUrls?: string[];
  private selectedImages: File[] = [];

  constructor(private fileService: FileService) {}

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        const file: File = fileList[i];
        this.selectedImages?.push(file);
      }
    }
    console.log(this.selectedImages);

    if (this.selectedImages) {
      this.fileService
        .uploadFiles(this.selectedImages, 'recipes/images')
        .subscribe({
          next: (urls: string[]) => {
            urls.forEach((url) => {
              this.pictureUrls?.push(url);
            });
            this.selectedImages = [];
            console.log(this.pictureUrls);
          },
        });
    }
  }

  removeImage(id: number) {
    this.pictureUrls?.splice(id, 1);
  }
}
