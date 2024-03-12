import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  private maxFileSize: number = 512 * 1024;

  constructor(
    private fileService: FileService,
    private toastr: ToastrService
  ) {}

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        const file: File = fileList[i];
        if (file.size < this.maxFileSize) {
          this.selectedImages?.push(file);
        } else {
          this.toastr.error(
            `${file.name} too big. Max file size: ${this.maxFileSize / 1024} kb`
          );
        }
      }
    }

    if (this.selectedImages.length > 0) {
      this.fileService
        .uploadFiles(this.selectedImages, 'recipes/images')
        .subscribe({
          next: (urls: string[]) => {
            urls.forEach((url) => {
              this.pictureUrls?.push(url);
            });
          },
          error: (err) => {
            this.toastr.error(err);
          },
        })
        .add(() => {
          this.selectedImages = [];
        });
    }
  }

  removeImage(id: number) {
    this.pictureUrls?.splice(id, 1);
  }
}
