import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumComponent } from 'src/app/common/album/album.component';
import { RecipesService } from 'src/app/recipe/recipes.service';
import { Recipe } from 'src/app/models/recipe';
import { BreadcrumbService } from 'xng-breadcrumb';
import { SharedAnimationsModule } from 'src/app/common/animations/shared-animations.module';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { AccountService } from 'src/app/account/account.service';
import { RecipeAddService } from '../recipe-add/recipe-add.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmationDialog,
  ConfirmationDialogData,
} from 'src/app/common/confirmation-dialog/confirmation-dialog';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { PrivilegesWrapperComponent } from 'src/app/common/privileges-wrapper/privileges-wrapper.component';

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
    MatSelectModule,
    FormsModule,
    PrivilegesWrapperComponent,
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
    private accountService: AccountService,
    private recipeAddService: RecipeAddService,
    public dialog: MatDialog
  ) {
    this.breadcrumbService.set('@recipe', ' ');
  }

  get user(): Observable<User | null> {
    return this.accountService.user$;
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

  onClickDeleteButton() {
    this.dialog.open(ConfirmationDialog, {
      data: {
        confirmationCallback: () => this.deleteRecipe(),
      } as ConfirmationDialogData,
    });
  }

  async onClickEditButton() {
    if (this.recipe) {
      await this.recipeAddService.loadRecipe(this.recipe);
      this.router.navigateByUrl('/add-recipe');
    }
  }

  onClickSaveButton() {
    console.log(this.accountService.savedRecipeIds);
    if (this.recipe?.id) {
      const id = this.recipe?.id.toString();
      this.accountService.saveRecipe(id, !this.isRecipeSaved).subscribe();
    }
  }

  onStatusChange() {
    if (this.recipe?.id && this.recipe?.status) {
      this.recipeService
        .setRecipeStatus(this.recipe?.id, this.recipe?.status)
        .subscribe({ next: (result) => console.log(result) });
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

  private deleteRecipe() {
    if (this.recipe?.id)
      this.recipeService.deleteRecipe(this.recipe?.id).subscribe({
        next: () => this.router.navigateByUrl('/cook'),
        error: (error) => console.log(error),
      });
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
