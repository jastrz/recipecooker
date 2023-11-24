import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AccountService } from './account.service';
import { CommonModule } from '@angular/common';
import { SharedAnimationsModule } from '../common/animations/shared-animations.module';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmationDialog,
  ConfirmationDialogData,
} from '../common/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    RegistrationComponent,
    SharedAnimationsModule,
    RouterModule,
    GoogleSigninButtonModule,
  ],
  animations: [SharedAnimationsModule.openCloseAnimation],
})
export class AccountComponent {
  displayName: string = '';

  constructor(
    public accountService: AccountService,
    private bcService: BreadcrumbService,
    public dialog: MatDialog
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
}
