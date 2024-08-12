import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap, from  } from 'rxjs';
import { backend } from '../../../global'; // Import the backend URL
import { HTTP } from '@ionic-native/http/ngx'; // Import HTTP from ionic-native

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  // api list
  private apiUrlGetApplicantData = `${backend}HCM/Recruitment/Applicants/getApplicantData`;
  private apiUrlGetApplicantCV = `${backend}HCM/Recruitment/Applicants/getApplicantCV`;
  private apiUrlGetApplications = `${backend}HCM/Recruitment/Vacancies/getApplications`;
  private apiUrlChangeApplicationStatus = `${backend}HCM/Recruitment/Vacancies/ChangeApplicationStatus`;





  constructor(private http: HTTP) { }

  async getApplicantData(): Promise<any> {

    try {
      const response: any = await this.http.post(this.apiUrlGetApplicantData, {}, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData) {

        const data = responseData;
        console.log("data from applicant service: ", data);
        return data.Parameters.ApplicantList;
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

  async getApplicantCV(applicantID: number): Promise<any> {
    const data = {
      ApplicantID: applicantID
    };
    try {
      const response: any = await this.http.post(this.apiUrlGetApplicantCV, data, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData.Parameters && responseData.Parameters) {
        // console.log("data from applicant service: ", responseData.Parameters.ApplicantList)
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

// working
  async getApplications(vacancyId: number): Promise<any>{
    const data = {
      VacancyID: vacancyId,
  };
    try {
      const response: any = await this.http.post(this.apiUrlGetApplications, data, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData) {

        const data = responseData;
        console.log("data from applicant service related to choosen vacancyID: ", data);
        return data.Parameters;
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


  // async loginUser(us: string, ps: string): Promise<string> {
  //   const data = {
  //       UserName: 'Zeen.Test@dev.com',
  //       Password: 'Bahrain1234'
  //   };





  async ChangeApplicationStatus(applicationID: number, status: string): Promise<string> {

    // Capitalize the first letter of the status
    // const capitalizedStatus = this.capitalizeFirstLetter(status);

    const data = {
      ApplicationID: applicationID,
      Status: status
    };
  
  console.log("data: ", data);
    try {
        const response: any = await this.http.post(this.apiUrlChangeApplicationStatus, data, {});
  
        // Handle successful response
        console.log('Response from server for ChangeApplicationStatus:', response.data);
        // Return a success message or any other relevant data
        return 'ChangeApplicationStatus successful!';
    } catch (error:any) {
        // Handle error response
        console.error('Error during ChangeApplicationStatus:', error);
  
        // Return an error message or handle as needed
        if (error.status === 0) {
            return 'Network error or CORS issue. Please try again later.';
        } else {
            return 'Invalid credentials or other error occurred.';
        }
    }
  }

// Helper function to capitalize the first letter of a string
private capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  // Capitalize first letter and convert the rest to lowercase
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

}
