import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { ReplaySubject, firstValueFrom, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private hostUrl = "https://localhost:5002/api/";
  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();

  constructor(private http: HttpClient) { }

  loadCurrentUser(token: string | null) {
    if(token === null) {
      this.userSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(this.hostUrl + 'user', {headers}).pipe(
      map(user => {
        if(user) {
          localStorage.setItem('token', user.token);
          this.userSource.next(user);
          return user;
        } else {
          return null;
        }
      })
    );
  }

  async isAuthenticated(): Promise<boolean> {
    // await new Promise(resolve => setTimeout(resolve, 2000));
    const user = await firstValueFrom(this.user$);
    return !!user;
  }

  register(values: any) {
    return this.http.post<User>(this.hostUrl + "user/register", values).pipe(
      map(user => {
        this.userSource.next(user);
        localStorage.setItem('token', user.token);
        return user;
      }
    ))
  };

  login(values: any) {
    return this.http.post<User>(this.hostUrl + "user/login", values).pipe(
      map(user => {
        this.userSource.next(user);
        localStorage.setItem('token', user.token);
        return user;
      }
    ))
  };

  logout() {
    localStorage.removeItem('token');
    this.userSource.next(null);
  }
}