import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap, from, pipe } from 'rxjs';
import { backend } from '../../../global'; // Import the backend URL
import { HTTP } from '@ionic-native/http/ngx'; // Import HTTP from ionic-native

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  // api list
  private apiUrlGetApplicantData = `${backend}HCM/Recruitment/Applicants/getApplicantData`;
  private apiUrlGetApplicantDataVacancies = `${backend}HCM/Recruitment/Vacancies/GetApplicantData`; //dont be confused one capital and one small
  private apiUrlGetApplicantCV = `${backend}HCM/Recruitment/Applicants/getApplicantCV`;
  private apiUrlGetEmployeeCV = `${backend}HCM/Recruitment/Applicants/getEmployeeCV`;
  private apiUrlGetApplications = `${backend}HCM/Recruitment/Vacancies/getApplications`;
  private apiUrlChangeApplicationStatus = `${backend}HCM/Recruitment/Vacancies/ChangeApplicationStatus`;
  private apiUrlSetApplicant = `${backend}HCM/Recruitment/Applicants/setApplicant`;
  private apiUrlSetApplicantExperience = `${backend}HCM/Recruitment/Applicants/setApplicantExperience`;





  constructor(private http: HTTP) { }

  async getApplicantData(): Promise<any> {

    try {
      const response: any = await this.http.post(this.apiUrlGetApplicantData, {}, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData) {

        const data = responseData;
        console.log("data from applicant service function getApplicantData: ", data);
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


  async getApplicantCV(id: number, type: string): Promise<any> {
    console.log("calling getApplicantCV in applicant service");
    let data: any = {};
    let url: string;

    if (type === 'A') {
      data = { ApplicantID: id };
      url = this.apiUrlGetApplicantCV;
    } else if (type === 'E') {
      data = { EmployeeID: id };
      url = this.apiUrlGetEmployeeCV;
    } else {
      throw new Error('Invalid type provided.');
    }
    try {
      const response: any = await this.http.post(url, data, {});

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

  // workingg
  async getApplications(vacancyId: number): Promise<any> {
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

  async getApplicantDataVacancie(): Promise<any> {

    try {
      const response: any = await this.http.post(this.apiUrlGetApplicantDataVacancies, {}, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData) {

        const data = responseData;
        console.log("data from applicant service function getApplicantDataVacancie: ", data);
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

  async ChangeApplicationStatus(applicationID: number, status: string): Promise<string> {


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
    } catch (error: any) {
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

  async setApplicant(newData: any): Promise<any> {

    const applicantID = newData.ApplicantID ? newData.ApplicantID : -1;

    const data = {
      Picture: newData.Picture,
      ApplicantID: applicantID,
      FirstName: newData.FirstName,
      LastName: newData.LastName,
      Gender: newData.Gender,
      DateOfBirth: newData.DateOfBirth,
      MaritalStatus: newData.MaritalStatus,
      NumberOfDependent: newData.NumberOfDependent,
      Nationality: newData.Nationality,
      ResidenceCountry: newData.ResidenceCountry,
      NationalIdentity: newData.NationalIdentity,
      Passport: newData.Passport,
      Currency: newData.Currency,
      CurrentSalary: newData.CurrentSalary,
      TargetSalary: newData.TargetSalary,
      LandLine: newData.LandLine,
      Mobile: newData.Mobile,
      Email: newData.Email,
      IsPreviousEmployee: newData.IsPreviousEmployee,
      EmployeeID: newData.EmployeeID,
      SpecializationID: newData.SpecializationID
    };
    try {
      const response: any = await this.http.post(this.apiUrlSetApplicant, data, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData) {

        const data = responseData;
        console.log("saved applicant updated data successff: ", data);
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


  async setApplicantExperience(experienceData: any): Promise<any> {

    const applicantExperienceID = experienceData.ApplicantExperienceID ? experienceData.ApplicantExperienceID : -1;

    const data = {
      ApplicantExperienceID: applicantExperienceID,
      ApplicantID: experienceData.ApplicantID,
      CompanyName: experienceData.CompanyName,
      Position: experienceData.Position,
      Location: experienceData.Location,
      Industry: experienceData.Industry,
      StartDate: experienceData.StartDate,
      EndDate: experienceData.EndDate,
      IsCurrent: experienceData.IsCurrent,
      ReportingTo: experienceData.ReportingTo,
      MainRole: experienceData.MainRole,
      ReasonForLeaving: experienceData.ReasonForLeaving
    };
    console.log("data is ",data);
    try {
      const response: any = await this.http.post(this.apiUrlSetApplicantExperience, data, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData) {

        const data = responseData;
        console.log("saved applicant updated data successff: ", data);
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

  // Helper function to capitalize the first letter of a string
  private capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    // Capitalize first letter and convert the rest to lowercase
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

}
