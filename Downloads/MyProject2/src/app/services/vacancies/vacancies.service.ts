import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { backend } from '../../../global'; // Import the backend URL
import { HTTP } from '@ionic-native/http/ngx'; // Import HTTP from ionic-native


@Injectable({
  providedIn: 'root'
})
export class VacanciesService {

  getApplicantData(): any[] | PromiseLike<any[]> {
    throw new Error('Method not implemented.');
  }
  private apiUrlGetVacansiesData = `${backend}HCM/Recruitment/Vacancies/getVacansiesData`;
  private apiUrlGetAllVacancyInterviews = `${backend}HCM/Recruitment/Vacancies/getAllVacancyInterviews`;


  constructor(private http: HTTP) { }


  async getVacansiesData(): Promise<any> {

    try {
      const response: any = await this.http.post(this.apiUrlGetVacansiesData, {}, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData) {

        const data = responseData;
        console.log("data from applicant service: ", data);
        return data.Parameters.VacancyList;
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

  async getAllVacancyInterviews(vacancyID: number): Promise<any> {
    const data = {
      VacancyID: vacancyID
    };
    try {
      const response: any = await this.http.post(this.apiUrlGetAllVacancyInterviews, data, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData.Parameters && responseData.Parameters) {
        console.log("data from get AllVacancyInterviewst service: ", responseData.Parameters);
        return responseData.Parameters;
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
