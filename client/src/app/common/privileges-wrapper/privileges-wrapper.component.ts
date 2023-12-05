import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-privalages-wrapper',
  template: `
    <ng-container *ngIf="user | async as user">
      <ng-container *ngIf="user.roles?.some(isEliglible)">
        <ng-content> </ng-content>
      </ng-container>
    </ng-container>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class PrivilegesWrapperComponent {
  @Input() roles: string[] = [];

  constructor(private accountService: AccountService) {}

  get user(): Observable<User | null> {
    return this.accountService.user$;
  }

  public isEliglible = (role: string): boolean => this.roles.includes(role);
}
