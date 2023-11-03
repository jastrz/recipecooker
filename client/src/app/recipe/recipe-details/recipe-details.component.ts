import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from 'src/app/cooker/recipes.service';
import { Recipe } from 'src/app/models/recipe';
import { IAlbum, Lightbox, LightboxConfig, LightboxModule } from 'ngx-lightbox';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
  standalone: true,
  imports: [CommonModule, LightboxModule ],
  animations: [
    trigger('openClose', [
      state('closed', style({ transform: 'translateX(-100%)', opacity: 0})),
      transition('open => closed', [
        animate('.1s ease-out')
      ]),
      transition('closed => open', [
        animate(('.15s ease-in'))
      ])
    ])
  ]
})
export class RecipeDetailsComponent implements OnInit {
  active : boolean = false;
  recipe?: Recipe;
  albums: IAlbum[] = [];

  constructor(private recipeService: RecipesService, private activatedRoute: ActivatedRoute, 
    private router: Router, private lightbox : Lightbox, private lightboxConfig : LightboxConfig,
    private breadcrumbService : BreadcrumbService) {
      lightboxConfig.resizeDuration = .35;
      lightboxConfig.fadeDuration = .35;
      lightboxConfig.fitImageInViewPort = true;
      lightboxConfig.centerVertically = true;
      lightboxConfig.disableScrolling = true;

      this.breadcrumbService.set('@recipe', ' ');
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id) return;

    this.recipeService.getRecipe(+id).subscribe({
      next: data => {
        this.recipe = data;
        this.breadcrumbService.set('@recipe', this.recipe.name);
        this.generateAlbums();
      }
    });
  }

  onClickBackButton() {
    this.router.navigateByUrl("/cook");
  }

  open(index: number): void {
    this.lightbox.open(this.albums, index);
  }

  generateAlbums() {
    this.recipe?.pictureUrls.forEach((src, index) => {
      const album = {
        src: src,
        caption: 'Image ' + (index + 1),
        thumb: src
      };

      this.albums.push(album);
    });
  }
}
