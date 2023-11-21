import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  standalone: true,
  imports: [CommonModule, MatInputModule, ReactiveFormsModule],
})
export class RegistrationComponent {
  registerForm = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService
  ) {}

  register() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: (user) => console.log(user),
      error: (error) => console.log(error),
    });
  }
}
