import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  standalone: true,
  imports: [CommonModule, MatInputModule, ReactiveFormsModule],
})
export class RegistrationComponent {
  registerForm = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    passwordRepeat: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  register() {
    if (
      this.registerForm.get('password')?.value ===
      this.registerForm.get('passwordRepeat')?.value
    ) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: (user) => this.toastr.success('Registered!'),
        error: (error) => console.log(error),
      });
    } else {
      this.toastr.error('Passwords must be the same!');
    }
  }
}
