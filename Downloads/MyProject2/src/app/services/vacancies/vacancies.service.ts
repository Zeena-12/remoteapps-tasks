import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { backend } from '../../../global'; // Import the backend URL
import { HTTP } from '@ionic-native/http/ngx'; // Import HTTP from ionic-native

@Injectable({
  providedIn: 'root'
})
export class VacanciesService {
  private apiUrlGetVacansiesData = `${backend}HCM/Recruitment/Vacancies/getVacansiesData`;


  constructor(private http: HTTP) { }

  async getApplicantData(): Promise<any> {

    try {
      const response: any = await this.http.post(this.apiUrlGetVacansiesData, {}, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData.Succeeded && responseData.Parameters && responseData.Parameters) {
        // console.log("data from applicant service: ", responseData.Parameters.ApplicantList)
        return responseData.Parameters.VacancyList;
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
