import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx'; // Import HTTP from ionic-native
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
declare var window: any; // Allows accessing Cordova plugins


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  UserName: string = 'Zeen.Test@dev.com'; // Static username for demonstration
  Password: string = 'Bahrain1234'; // Static password for demonstration
  errorMessage: string = '';
  usData: any;

  constructor(private http: HTTP, private router: Router) { }

  ngOnInit() {
    console.log();
    // document.addEventListener('deviceready', () => {
    //   this.checkDevOptions();
    // }, false);
  }

  // checkDevOptions() {
  //   if (window.cordova && window.cordova.plugins && window.cordova.plugins.devoptionschecker) {
  //     window.cordova.plugins.devoptionschecker.check((result: any) => {
  //       console.log("what is result ", result);
  //       if (result.devOptionsEnabled) {
  //         console.log('Developer options are enabled.', result);
  //         alert("Developer options are enabled " + result);
  //       } else {
  //         console.log('Developer options are not enabled.', result);
  //         alert("Developer options are not enabled " + result);
  //       }
  //     }, (error: any) => {
  //       console.error('Error checking developer options: ' + error);
  //     });
  //   } else {
  //     console.error('DevOptionsChecker plugin is not available.');
  //   }
  // }

  async loginUser(us: string, ps: string): Promise<string> {
    const data = {
      UserName: 'Zeen.Test@dev.com',
      Password: 'Bahrain1234'
    };

    const url = 'https://api.remoteapps.com/Profile/Login';

    try {
      const response: any = await this.http.post(url, data, {});

      // Handle successful response
      console.log('Response from server:', response.data);
      this.router.navigate(['/applicants']);
      // Return a success message or any other relevant data
      return 'Login successful!';
    } catch (error: any) {
      // Handle error response
      console.error('Error during login:', error);

      // Return an error message or handle as needed
      if (error.status === 0) {
        return 'Network error or CORS issue. Please try again later.';
      } else {
        return 'Invalid credentials or other error occurred.';
      }
    }
  }
  showLogDebug(fdata: FormData) {
    throw new Error('Method not implemented.');
  }
}
