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
import { UserInventoryService } from 'src/app/services/user-inventory.service';
import { ToastrService } from 'ngx-toastr';
import { RecipeDetailsRatingComponent } from './recipe-details-rating.component';

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
    RecipeDetailsRatingComponent
  ],
  animations: [SharedAnimationsModule.openCloseAnimation],
})
export class RecipeDetailsComponent implements OnInit {
  active: boolean = false;
  recipe?: Recipe;
  ownerDisplayName: string = '';

  constructor(
    public dialog: MatDialog,
    private recipeService: RecipesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private accountService: AccountService,
    private recipeAddService: RecipeAddService,
    private userInventory: UserInventoryService,
    private toastr: ToastrService
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

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.getRecipe(+id);
  }

  isEliglibleForEdit(user: User) {
    if (!user) return false;

    if (user.roles?.includes('Administrator')) return true;

    return this.userInventory.userRecipes.some(
      (recipe: Recipe) => recipe.id === this.recipe?.id
    );
  }

  isEliglibleForVerification(user: User) {
    const roles: string[] = ['Administrator', 'SuperUser'];
    return user.roles?.some((role) => roles.includes(role));
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

  async onClickSaveButton() {
    const authenticated = await this.accountService.isAuthenticated();
    if (authenticated) {
      if (this.recipe?.id) {
        const id = this.recipe?.id.toString();
        this.accountService.saveRecipe(id, !this.isRecipeSaved).subscribe({
          next: () => {
            console.log(this.accountService.savedRecipeIds);
          },
        });
      }
    } else {
      this.router.navigate(['/account'], {
        queryParams: { returnUrl: this.router.url },
      });
    }
  }

  onStatusChange() {
    if (this.recipe?.id && this.recipe?.status) {
      this.recipeService
        .setRecipeStatus(this.recipe?.id, this.recipe?.status)
        .subscribe({ next: (result) => console.log(result) });
    }
  }

  async onRateChange(value: number) {
    const authenticated = await this.accountService.isAuthenticated();
    if (authenticated) {
      if (this.recipe?.id) {
        const id = this.recipe?.id;
        this.recipeService.rateRecipe(id, value).subscribe({
          next: () => this.getRecipe(id, false),
          error: (error) => console.log(error),
        });
      }
    } else {
      this.router.navigate(['/account'], {
        queryParams: { returnUrl: this.router.url },
      });
    }
  }

  private deleteRecipe() {
    if (this.recipe?.id)
      this.recipeService.deleteRecipe(this.recipe?.id).subscribe({
        next: () => {
          this.toastr.success('Successfully deleted!');
          this.router.navigateByUrl('/cook');
        },
        error: (error) => {
          this.toastr.error(error), console.log(error);
        },
      });
  }

  private getRecipe(id: number, cached: boolean = true) {
    this.recipeService.getRecipe(id, cached).subscribe({
      next: (data) => {
        this.recipe = data;
        this.breadcrumbService.set('@recipe', this.recipe.name);
        this.accountService.getSavedRecipesIds().subscribe({
          next: () => {
            console.log(this.accountService.savedRecipeIds);
          },
        });
        if (data.userId)
          this.accountService.getDisplayNameForUserId(data.userId).subscribe({
            next: (displayName: any) => {
              this.ownerDisplayName = displayName;
            },
            error: (error) => console.log(error),
          });
      },
    });
  }
}
