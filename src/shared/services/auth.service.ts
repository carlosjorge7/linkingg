import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/public/models/user';
import { environment } from 'src/environments/environment';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  public register(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiHost}users/`, user);
  }

  public login(user: User): Observable<Token> {
    return this.http.post<Token>(`${environment.apiHost}token/`, {
      username: user.username,
      password: user.password,
    });
  }

  public refreshToken(
    refresh: string | null
  ): Observable<{ access: string; refresh: string }> {
    return this.http.post<{ access: string; refresh: string }>(
      `${environment.apiHost}token/refresh/`,
      {
        refresh,
      }
    );
  }

  public setCredentials(credentials: Token): void {
    localStorage.setItem('token', credentials.access);
    localStorage.setItem('refresh', credentials.refresh);
    localStorage.setItem('user_id', credentials?.user_id);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public setAccessToken(access: string): void {
    localStorage.setItem('token', access);
  }

  public setRefreshToken(refresh: string): void {
    localStorage.setItem('refresh', refresh);
  }

  public getRefresh(): string | null {
    return localStorage.getItem('refresh');
  }

  public getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  public async loggout(): Promise<void> {
    localStorage.clear();
  }
}
