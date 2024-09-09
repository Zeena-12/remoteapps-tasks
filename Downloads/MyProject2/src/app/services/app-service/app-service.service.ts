import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap, from, pipe } from 'rxjs';
import { backend } from '../../../globals'; // Import the backend URL
import { HTTP } from '@ionic-native/http/ngx'; // Import HTTP from ionic-native

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
  private apiUrlGetComobBoxes = `${backend}HCM/Recruitment/Applicants/getComobBoxes`;


  constructor(private http: HTTP) { }

  async getComobBoxes(): Promise<any> {

    try {
      const response: any = await this.http.post(this.apiUrlGetComobBoxes, {}, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData) {

        const data = responseData;
        console.log("data from app service function getComobBoxes: ", data);
        //  return data.Parameters.ApplicantList; // i will try  to change to retun the full list
        return data.Parameters; // i will try  to change to retun the full list

      } else {
        throw new Error('Invalid response structure or no data available.');
      }
    } catch (error: any) {
      // Handle error response
      console.error('Error during data retrieval:', error);

      // Return an error message or handle as needed
      if (error.status === 0) {
        return 'Network error or CORS issue. Please try again later.';
      } else {
        throw new Error('An error occurred while retrieving data.');
      }
    }
  }
}
