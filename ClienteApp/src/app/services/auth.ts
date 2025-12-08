import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

const API_BASE_URL = 'https://localhost:44385/api/'

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = API_BASE_URL + 'Auth/Login'
  private tokenKey = 'jwtToken'

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) localStorage.setItem(this.tokenKey, response.token)
      })
    )
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey)
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }
}
