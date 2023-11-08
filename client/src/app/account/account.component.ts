import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AccountService } from '../services/account.service';
import { CommonModule } from '@angular/common';
import { SharedAnimationsModule } from '../common/animations/shared-animations.module';

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
  ],
  animations: [SharedAnimationsModule.openCloseAnimation],
})
export class AccountComponent {
  constructor(public accountService: AccountService) {}
}
