import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AccountService } from '../account.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { RecipesService } from 'src/app/recipe/recipes.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  ConfirmationDialog,
  ConfirmationDialogData,
} from 'src/app/common/confirmation-dialog/confirmation-dialog';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/models/user';
import { RouterModule } from '@angular/router';
import { SharedAnimationsModule } from 'src/app/common/animations/shared-animations.module';
import { ServerStatusComponent } from 'src/app/server-status/server-status.component';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule, SharedAnimationsModule, ServerStatusComponent],
  animations: [SharedAnimationsModule.openCloseAnimation],
})
export class UserMenuComponent {
  @Input() user?: User;

  constructor(
    public accountService: AccountService,
    private bcService: BreadcrumbService,
    private recipeService: RecipesService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.bcService.set('account/', 'Menu');
  }

  onClickDeleteButton() {
    this.dialog.open(ConfirmationDialog, {
      data: {
        confirmationCallback: () => this.accountService.deleteUser(),
      } as ConfirmationDialogData,
    });
  }

  onClickBackupRecipes() {
    this.recipeService.backupRecipes().subscribe({
      next: () => this.toastr.success('Recipes backed up!'),
      error: (error) => this.toastr.error(error),
    });
  }

  onRecipesFileSelected($event: any) {
    console.log('file selected');
    console.log($event.file);
  }
}
