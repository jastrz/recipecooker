import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AccountService } from './account.service';
import { CommonModule } from '@angular/common';
import { SharedAnimationsModule } from '../common/animations/shared-animations.module';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { MatIconModule } from '@angular/material/icon';
import { UserMenuComponent } from './user-menu/user-menu.component';

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
    MatIconModule,
    UserMenuComponent,
  ],
  animations: [SharedAnimationsModule.openCloseAnimation],
})
export class AccountComponent {
  constructor(
    public accountService: AccountService,
    private bcService: BreadcrumbService
  ) {
    this.bcService.set('account/', 'Menu');
  }
}
