import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SharedAnimationsModule } from 'src/app/common/animations/shared-animations.module';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService
  ) {}

  login() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: (user) => console.log(user),
      error: (error) => console.log(error),
    });
  }
}
