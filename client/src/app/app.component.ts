import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'recipecooker';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe();
  }
}