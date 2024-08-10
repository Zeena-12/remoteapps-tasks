import { Component } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx'; // Import HTTP from ionic-native
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';  


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  UserName: string = 'Zeen.Test@dev.com'; // Static username for demonstration
  Password: string = 'Bahrain1234'; // Static password for demonstration
  errorMessage: string = '';
  usData: any;

  constructor(private http: HTTP, private router: Router) {}

  // loginUser(): void {

  //   // const data = {
  //   //   UserName: this.UserName,
  //   //   Password: this.Password
  //   // };
  //   const formData = new FormData();
  //   formData.append('UserName', this.UserName);
  //   formData.append('Password', this.Password);

  //   const url = 'https://api.remoteapps.com/Profile/Login'; // Replace with your API endpoint



  //   const headers = {}; // Empty headers object if not required

  //   const options = {
  //     withCredentials: true // Use 'include' if you need to send cookies or other credentials
  //   };

  //   this.http.post(url, formData, {withCredentials: true})
  //     .then(response => {
  //       console.log('Response from server:', response.data);
  //       // Handle successful login response here
  //       // e.g., redirect to another page or store token
  //     })
  //     .catch(error => {
  //       console.error('Error during login:', error);
  //       if (error.status === 0) {
  //         this.errorMessage = 'Network error or CORS issue. Please try again later.';
  //       } else {
  //         this.errorMessage = 'Invalid credentials or other error occurred.';
  //       }
  //     });
  // }

//   async loginUser(us:string, ps:string) {
//     // const data = new FormData();
//     let data = {
//       UserName: 'Zeen.Test@dev.com',
//       Password: 'Bahrain1234',

//     }

//   //  data.append("UserName", 'Zeen.Test@dev.com');
//   //  data.append("Password", 'Bahrain1234');



//  let url = 'https://api.remoteapps.com/Profile/Login' ;
//  return await  this.http.post(url, data, {} ).then((data: any) => {

//    });
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
      this.router.navigate(['/vacancies']);
      // Return a success message or any other relevant data
      return 'Login successful!';
  } catch (error:any) {
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

  // post(url:string, body:any = {}, headers = {}): Promise<any> {
  //   if (url[22] == '/' && (window as any).Ionic.isLiveReload) {
  //     url = url.substring(0, 21) + url.substring(22);
  //   }
  //   let fdata: FormData;
  //   body instanceof FormData ? (fdata = body) : (fdata = new FormData());
  //   const keys = Object.keys(body);
  //   for (let key of keys) {
  //     let i = 0;
  //     if (Array.isArray(body[key])) {
  //       console.log('array', key);
  //       // if(Object.keys(body[key]))
  //       for (let val of body[key]) {
  //         let k = key + '[' + i + ']';
  //         if (typeof val == 'object' && !Array.isArray(val)) {
  //           const keys2 = Object.keys(val);
  //           for (let key2 of keys2) {
  //             let k2 = k + '[' + key2 + ']';
  //             fdata.append(k2, val[key2]);
  //           }
  //         } else {
  //           fdata.append(k, val);
  //         }
  //         i++;
  //       }
  //     } else {
  //       fdata.append(key, body[key]);
  //     }
  //   }

  //   return new Promise((resolve, reject) => {
  //     this.http.setDataSerializer('multipart');

  //     this.http
  //       .post(url, fdata, {})
  //       .then((data) => {
  //         this.showLogDebug(fdata);
  //         console.log('url', url);
  //         console.log('Logged data:', JSON.parse(data.data));
  //         resolve(data.data != '' ? JSON.parse(data.data) : null);
  //       })
  //       .catch((error) => {
  //         this.showLogDebug(fdata);
  //         console.log('error', error);
  //         console.log('url', url);

  //         console.log('error.status', error.status);
  //         console.log('error.error', error.error); // error message as string
  //         console.log('error.headers', error.headers);
  //         let err: any = { status: error.status };
  //         if (Number(error.status) == 401 || Number(error.status) == 403) {
  //           this.usData.redCard(error);
  //         }
  //         reject(err);
  //       });
  //   });
  // }

  showLogDebug(fdata: FormData) {
    throw new Error('Method not implemented.');
  }
}
