import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backend } from './../../global'; // Adjust path as necessary
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  UserName: string = '';
  Password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  doLogin(username: string, password: string): void {
    const data = new FormData();
    data.append("UserName", username);
    data.append("Password", password);

    const url = `https://cors-anywhere.herokuapp.com/https://api.remoteapps.com/Profile/Login`;
    // const url = `${backend}Profile/Login`;

    this.http.post<any>(url, data, { withCredentials: true }).pipe(
      tap(response => {
        console.log("Response from server:", response);
        // Navigate to myhome page if login is successful
        // this.router.navigate(['/myhome']); // Make sure to inject Router
      }),
      catchError(error => {
        console.error("Error during login:", error);
        if (error.status === 0) {
          this.errorMessage = 'Network error or CORS issue. Please try again later.';
        } else {
          this.errorMessage = 'Invalid credentials or other error occurred.';
        }
        return of(null);
      })
    ).subscribe();
  }

  loginUser() {
    this.errorMessage = ''; // Clear previous errors
    this.doLogin(this.UserName, this.Password);
  }
}
