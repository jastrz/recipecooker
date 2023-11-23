import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule
  ],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    // left temporarily
    // @ts-ignore
    // window.handleCredentialResponse = (response) => {
    //   console.log(response.credential);
    //   this.loginWithGoogle(response.credential);
    // };
  }

  login() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: (user) => console.log(user),
      error: (error) => console.log(error),
    });
  }

  // loginWithGoogle(credential: string) {
  //   this.accountService.loginWithGoogle(credential).subscribe({
  //     next: (user) => console.log('logged in with google', user),
  //     error: (error) => console.log(error),
  //   });
  // }
}
