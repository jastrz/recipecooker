import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { ReplaySubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private hostUrl = "https://localhost:5002/api/";
  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();

  constructor(private http: HttpClient) { }

  register(values: any) {
    return this.http.post<User>(this.hostUrl + "user/register", values).pipe(
      map(user => {
        this.userSource.next(user);
        return user;
      }
    ))
  };

  login(values: any) {
    return this.http.post<User>(this.hostUrl + "user/login", values).pipe(
      map(user => {
        this.userSource.next(user);
        return user;
      }
    ))
  };

  logout() {
    this.userSource.next(null);
  }
}