import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private hostUrl = "https://localhost:5002/api/";
  private user? : User;

  constructor(private http: HttpClient) { }

  register(values: any) {
    return this.http.post<User>(this.hostUrl + "user/register", values).pipe(
      map(response => {
        this.user = response;
        return response;
      }
    ))
  };

  login(values: any) {
    return this.http.post<User>(this.hostUrl + "user/login", values).pipe(
      map(response => {
        this.user = response;
        return response;
      }
    ))
  };
}

  

