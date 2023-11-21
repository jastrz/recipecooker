import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AccountService } from './account.service';
import { CommonModule } from '@angular/common';
import { SharedAnimationsModule } from '../common/animations/shared-animations.module';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

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
  ],
  animations: [SharedAnimationsModule.openCloseAnimation],
})
export class AccountComponent {
  displayName: string = '';

  constructor(
    public accountService: AccountService,
    private bcService: BreadcrumbService
  ) {
    this.bcService.set('account/', 'Menu');
  }
}
