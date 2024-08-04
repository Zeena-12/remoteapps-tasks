import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { backend } from './../../global'; // Adjust path as necessary

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = `${backend}Profile/Login`; // Endpoint for login
  private tokenKey = 'authToken'; // Key for storing the token

  constructor(private http: HttpClient) {}

  async doLogin(username: string, password: string): Promise<boolean> {
    const data = new FormData();
    data.append("UserName", username);
    data.append("Password", password);

    try {
      const response: any = await this.http.post<any>(this.loginUrl, data, { withCredentials: true }).toPromise();
      if (response && response.token) {
        localStorage.setItem(this.tokenKey, response.token); // Save token in local storage
        return true; // Login successful
      }
      return false; // Login failed
    } catch (error) {
      // Handle error when 'error' is of type 'unknown'
      if (error instanceof Error) {
        console.error('Login failed:', error.message);
      } else {
        console.error('Login failed: An unknown error occurred');
      }
      return false; // Return false on error
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey); // Remove token on logout
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey); // Retrieve token from storage
  }
}
