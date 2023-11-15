import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumComponent } from 'src/app/common/album/album.component';
import { RecipesService } from 'src/app/services/recipes.service';
import { Recipe } from 'src/app/models/recipe';
import { BreadcrumbService } from 'xng-breadcrumb';
import { SharedAnimationsModule } from 'src/app/common/animations/shared-animations.module';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { AccountService } from 'src/app/services/account.service';

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
    MatIconModule,
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
    private breadcrumbService: BreadcrumbService,
    private accountService: AccountService
  ) {
    this.breadcrumbService.set('@recipe', ' ');
  }

  get rate(): number {
    return this.recipe?.rating ? this.recipe.rating : 0;
  }

  get isRecipeSaved(): boolean {
    if (this.recipe?.id)
      return this.accountService.savedRecipeIds.includes(
        this.recipe?.id?.toString()
      );
    return false;
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.getRecipe(+id);
    this.accountService.getSavedRecipesIds().subscribe();
  }

  onClickBackButton() {
    this.router.navigateByUrl('/cook');
  }

  onClickEditButton() {}

  onClickSaveButton() {
    console.log(this.accountService.savedRecipeIds);
    if (this.recipe?.id) {
      const id = this.recipe?.id.toString();
      this.accountService.saveRecipe(id, !this.isRecipeSaved).subscribe();
    }
  }

  onRateChange(value: number) {
    if (this.recipe?.id) {
      const id = this.recipe?.id;
      this.recipeService.rateRecipe(id, value).subscribe({
        next: () => this.getRecipe(id, false),
        error: (error) => console.log(error),
      });
    }
  }

  private getRecipe(id: number, cached: boolean = true) {
    console.log('getting recipe');
    this.recipeService.getRecipe(id, cached).subscribe({
      next: (data) => {
        this.recipe = data;
        this.breadcrumbService.set('@recipe', this.recipe.name);
      },
    });
  }
}
