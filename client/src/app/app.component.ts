import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'recipecooker';

  constructor(
    private accountService: AccountService,
    public bcService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe();
  }
}
