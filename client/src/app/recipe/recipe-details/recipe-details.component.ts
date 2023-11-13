import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumComponent } from 'src/app/common/album/album.component';
import { RecipesService } from 'src/app/services/recipes.service';
import { Recipe } from 'src/app/models/recipe';
import { BreadcrumbService } from 'xng-breadcrumb';
import { SharedAnimationsModule } from 'src/app/common/animations/shared-animations.module';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AlbumComponent,
    SharedAnimationsModule,
    NgbRatingModule,
  ],
  animations: [SharedAnimationsModule.openCloseAnimation],
})
export class RecipeDetailsComponent implements OnInit {
  active: boolean = false;
  recipe?: Recipe;

  constructor(
    private recipeService: RecipesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.set('@recipe', ' ');
  }

  get rate(): number {
    return this.recipe?.rating ? this.recipe.rating : 0;
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    this.recipeService.getRecipe(+id).subscribe({
      next: (data) => {
        this.recipe = data;
        this.breadcrumbService.set('@recipe', this.recipe.name);
      },
    });
  }

  onClickBackButton() {
    this.router.navigateByUrl('/cook');
  }

  onClickEditButton() {}

  onRateChange(value: number) {
    console.log('rate changed');
    if (this.recipe?.id) {
      this.recipeService.rateRecipe(this.recipe.id, value).subscribe({
        next: (response) => console.log('updated rating'),
        error: (error) => console.log(error),
      });
    }
  }
}
