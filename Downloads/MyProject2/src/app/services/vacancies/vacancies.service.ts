import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { backend, backendImgSrc } from '../../../global'; // Import the backend URL
import { HTTP } from '@ionic-native/http/ngx'; // Import HTTP from ionic-native

@Injectable({
  providedIn: 'root'
})
export class VacanciesService {
  getApplicantData(): any[] | PromiseLike<any[]> {
    throw new Error('Method not implemented.');
  }
  private apiUrlGetVacansiesData = `${backend}HCM/Recruitment/Vacancies/getVacansiesData`;
  private apiUrlGetApplications = `${backend}HCM/Recruitment/Vacancies/getApplications`;


  constructor(private http: HTTP) { }

  // async getApplicantData(): Promise<any> {
  //   try {
  //     // Fetch data from the API
  //     const response: any = await this.http.post(this.apiUrlGetVacansiesData, {}, {});
  
  //     // Parse the response data
  //     const responseData = JSON.parse(response.data);
  
  //     // Check if the response is successful and contains Parameters
  //     if (responseData.Succeeded && responseData.Parameters && responseData.Parameters.VacancyList) {
  //       // Extract and process the VacancyList
  //       const vacancyList = responseData.Parameters.VacancyList.map((item: any) => {
  //         console.log("item: ", item);
  
  //         // Process Recruiter field
  //         if (item.Recruiter) {
  //           const recruiterName = item.Recruiter.split(' - ')[1];
  //           console.log("Recruiter name is ", recruiterName);
  //           item.Recruiter = recruiterName;
  //         }
  
  //         // Process RaisedBy field
  //         if (item.RaisedBy) {
  //           const raisedByName = item.RaisedBy.split(' - ')[1];
  //           console.log("RaisedBy name is ", raisedByName);
  //           item.RaisedBy = raisedByName;
  //         }
  
  //         return item; // Return the item with processed fields
  //       });
  
  //       // Return the processed VacancyList
  //       return vacancyList;
  //     } else {
  //       throw new Error('Invalid response structure or no data available.');
  //     }
  //   } catch (error: any) {
  //     // Handle error response
  //     console.error('Error during data retrieval:', error);
  
  //     // Return an error message or handle as needed
  //     if (error.status === 0) {
  //       return 'Network error or CORS issue. Please try again later.';
  //     } else {
  //       throw new Error('An error occurred while retrieving data.');
  //     }
  //   }
  // }
  
  async getApplications(): Promise<any> {

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
