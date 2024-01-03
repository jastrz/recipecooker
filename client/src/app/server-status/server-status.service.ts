import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverStatus } from '../models/server-status';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServerStatusService {
  constructor(private http: HttpClient) {}

  getServerStatus() {
    return this.http.get<serverStatus>(environment.apiUrl + 'serverStatus');
  }
}
