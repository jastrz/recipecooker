import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IAlbum, Lightbox, LightboxConfig, LightboxModule } from 'ngx-lightbox';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
  standalone: true,
  imports: [CommonModule, LightboxModule],
})
export class AlbumComponent implements OnInit {
  @Input() pictureUrls: string[] = [];
  albums: IAlbum[] = [];

  constructor(
    private lightbox: Lightbox,
    private lightboxConfig: LightboxConfig
  ) {
    lightboxConfig.resizeDuration = 0.35;
    lightboxConfig.fadeDuration = 0.35;
    lightboxConfig.fitImageInViewPort = true;
    lightboxConfig.centerVertically = true;
    lightboxConfig.disableScrolling = true;
    lightboxConfig.showImageNumberLabel = false;
  }

  ngOnInit(): void {
    if (this.pictureUrls) this.generateAlbums();
  }

  open(index: number): void {
    this.lightbox.open(this.albums, index);
  }

  private generateAlbums() {
    this.pictureUrls.forEach((src, index) => {
      const album = {
        src: src,
        // caption: 'Image ' + (index + 1),
        thumb: src,
      };

      this.albums.push(album);
    });
  }
}
