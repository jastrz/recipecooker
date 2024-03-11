import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedAnimationsModule } from 'src/app/common/animations/shared-animations.module';
import { AccountService } from '../account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, MatInputModule, ReactiveFormsModule],
  animations: [SharedAnimationsModule.openCloseAnimation],
  template: `
    <div class="d-flex justify-content-center" [@openClose]="'open'">
      <div class="panel" style="width: 400px" [formGroup]="changePasswordForm">
        <h2 style="align-self: flex-start">Change Password:</h2>

        <mat-form-field class="field">
          <mat-label>New password</mat-label>
          <input
            matInput
            placeholder="..."
            formControlName="password"
            type="password"
          />
        </mat-form-field>

        <mat-form-field class="field">
          <mat-label>Repeat Password</mat-label>
          <input
            matInput
            placeholder="..."
            formControlName="passwordRepeat"
            type="password"
          />
        </mat-form-field>

        <button
          (click)="changePassword()"
          class="btn btn-primary"
          style="align-self: flex-end"
        >
          Ok
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class ChangePasswordComponent {
  changePasswordForm = this.fb.group({
    password: ['', Validators.required],
    passwordRepeat: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  changePassword() {
    const password = this.changePasswordForm.get('password')?.value;
    const passwordRepeat = this.changePasswordForm.get('passwordRepeat')?.value;

    if (password !== passwordRepeat) {
      this.toastr.error('Passwords do not match.');
      return;
    }

    this.accountService
      .changePassword(this.changePasswordForm.value)
      .subscribe({
        next: () => {
          this.toastr.success('Password changed!');
          this.router.navigateByUrl('/account');
        },
        error: (error) => {
          console.log(error);
          this.toastr.error("Couldn't change password!");
        },
      });
  }
}
