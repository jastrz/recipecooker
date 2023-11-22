import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, ReplaySubject, firstValueFrom, map, of } from 'rxjs';
import { Recipe } from '../models/recipe';
import { environment } from 'src/environments/environment';
import { GoogleLoginRequest } from '../models/google-login-request';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private hostUrl = environment.apiUrl;
  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();

  savedRecipeIds: string[] = [];

  constructor(
    private http: HttpClient,
    private authService: SocialAuthService
  ) {
    this.authService.authState.subscribe((user) => {
      this.loginWithGoogle(user.idToken).subscribe({
        next: (user) => console.log('logged in with google', user),
        error: (error) => console.log(error),
      });
    });
  }

  loadCurrentUser(token: string | null) {
    if (token === null) {
      this.userSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(this.hostUrl + 'user', { headers }).pipe(
      map((user) => {
        if (user) {
          this.setUser(user);
          return user;
        } else {
          return null;
        }
      })
    );
  }

  getSavedRecipesIds() {
    return this.user$.pipe(
      map((user) => {
        if (user && user.savedRecipeIds)
          this.savedRecipeIds = user.savedRecipeIds;
        return this.savedRecipeIds;
      })
    );
  }

  getDisplayName(): Observable<string | null> {
    return this.user$.pipe(map((user) => (user ? user.displayName : null)));
  }

  getSavedRecipes() {
    return this.http.get<Recipe[]>(this.hostUrl + 'user/recipes');
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await firstValueFrom(this.user$);
    return !!user;
  }

  register(values: any) {
    return this.http.post<User>(this.hostUrl + 'user/register', values).pipe(
      map((user) => {
        this.setUser(user);
        return user;
      })
    );
  }

  login(values: any) {
    return this.http.post<User>(this.hostUrl + 'user/login', values).pipe(
      map((user) => {
        this.setUser(user);
        return user;
      })
    );
  }

  loginWithGoogle(credential: string) {
    const request = new GoogleLoginRequest();
    request.idToken = credential;
    return this.http.post<User>(this.hostUrl + 'user/google', request).pipe(
      map((user) => {
        this.setUser(user);
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSource.next(null);
  }

  saveRecipe(recipeId: string, saved: boolean) {
    console.log(saved);
    return this.http
      .patch<string[]>(this.hostUrl + `user/recipes/${recipeId}/save`, saved)
      .pipe(
        map((savedRecipes) => {
          this.savedRecipeIds = savedRecipes;
          return this.savedRecipeIds;
        })
      );
  }

  private setUser(user: User) {
    this.userSource.next(user);
    localStorage.setItem('token', user.token);
  }
}
