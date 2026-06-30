import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Make sure this matches your Spring Boot port!
  private apiUrl = 'https://cinevault-backend.onrender.com/api/auth';

  // This acts like a live broadcast tower. When a user logs in, it instantly tells the Navbar to change its buttons!
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  // 1. Send Registration Data
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { responseType: 'text' });
  }

  // 2. Send Login Data & Catch the VIP Pass (JWT)
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          // Save the token to the browser's vault
          localStorage.setItem('cinevault_jwt', response.token);
          // Broadcast that we are officially logged in!
          this.loggedIn.next(true); 
        }
      })
    );
  }

  // 3. Destroy the VIP Pass
  logout(): void {
    localStorage.removeItem('cinevault_jwt');
    this.loggedIn.next(false);
  }

  // 4. Utility to grab the token for future requests
  getToken(): string | null {
    return localStorage.getItem('cinevault_jwt');
  }

  // 5. Check if the user currently has a pass
  private hasToken(): boolean {
    return !!localStorage.getItem('cinevault_jwt');
  }
}