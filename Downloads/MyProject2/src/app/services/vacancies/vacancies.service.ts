import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { backend } from '../../../globals'; // Import the backend URL
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
  private apiUrlGetInterviewsData = `${backend}HCM/Recruitment/Vacancies/getInterviewsData`;
  private apiUrlAcceptOffer = `${backend}HCM/Recruitment/Vacancies/acceptOffer`;
  private apiUrlGetApplicantDataVacancies = `${backend}HCM/Recruitment/Vacancies/GetApplicantData`; //dont be confused one capital and one small
  private apiUrlGetApplications = `${backend}HCM/Recruitment/Vacancies/getApplications`;
  private apiUrlChangeApplicationStatus = `${backend}HCM/Recruitment/Vacancies/ChangeApplicationStatus`
  private apiUrlChangeDisqualifiedStatus = `${backend}HCM/Recruitment/Vacancies/ChangeDisqualifiedStatus`;
  private apiUrlGetApplicationQuestionAnswer = `${backend}HCM/Recruitment/Vacancies/getApplicationQuestionAnswer`;
  private apiUrlRejectOffer = `${backend}HCM/Recruitment/Vacancies/rejectOffer`;


  constructor(private http: HTTP) { }


  async getVacansiesData(): Promise<any> {

    try {
      const response: any = await this.http.post(this.apiUrlGetVacansiesData, {}, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      if (responseData) {

        const data = responseData;
        // console.log("data from applicant service: ", data);
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
      if (responseData.Parameters) {
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

  async getInterviewsData(vacancyID: number, interviewTypeID: number): Promise<any> {
    const data = {
      VacancyID: vacancyID,
      InterviewTypeID: interviewTypeID
    };
    console.log()
    try {
      const response: any = await this.http.post(this.apiUrlGetInterviewsData, data, {});

      // Parse the response data
      const responseData = JSON.parse(response.data);
      // Check if the response is successful and contains Parameters
      if (responseData.Parameters) {
        console.log("data from get getInterviewsData service: ", responseData.Parameters);
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

  async acceptOffer(applicationID: number): Promise<any> {
    const data = {
      ApplicationID: applicationID,
    };

    try {
      const response: any = await this.http.post(this.apiUrlAcceptOffer, data, {});
      console.log("calling acceptOffer")
      // Parse the response data
      const responseData = JSON.parse(response.data);
      // Check if the response is successful and contains Parameters
      if (responseData.Parameters) {
        console.log("result from acceptOffer from acceptOffer", responseData.Parameters)
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

  async ChangeDisqualifiedStatus(id: number, status: boolean, disqualifyReason?: any): Promise<any> {
    console.log("calling ChangeDisqualifiedStatus in applicant service");

    // Create the base data object
    const data: { ApplicationID: number; Status: boolean;[key: string]: any } = {
      ApplicationID: id,
      Status: status
    };

    // Add DisqualifyReason to the data object only if it is a non-empty string
    if (disqualifyReason) {
      data['DisqualifyReason'] = disqualifyReason;
    }
    console.log("data isssss ", data);

    try {
      const response: any = await this.http.post(this.apiUrlChangeDisqualifiedStatus, data, {});
      // Parse the response data
      const responseData = JSON.parse(response.data);

      // Check if the response is successful and contains Parameters
      console.log("sending what ", data);
      if (responseData) {
        const data = responseData;
        console.log("ChangeDisqualifiedStatus", data);
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

  async getApplicationQuestionAnswer(id: number): Promise<any> {
    console.log("calling getApplicationQuestionAnswer  in applicant service");
    const data = {
      ApplicationID: id,
    };

    try {
      const response: any = await this.http.post(this.apiUrlGetApplicationQuestionAnswer, data, {});

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

  async rejectOffer(applicationID: number): Promise<string> {
    const data = {
      ApplicationID: applicationID,
    };

    console.log("data: ", data);
    try {
      const response: any = await this.http.post(this.apiUrlRejectOffer, data, {});

      // Handle successful response
      console.log('Response from server for rejectOffer:', response.data);
      // Return a success message or any other relevant data
      return 'ChangeApplicationStatus successful!';
    } catch (error: any) {
      // Handle error response
      console.error('Error during rejectOffer:', error);

      // Return an error message or handle as needed
      if (error.status === 0) {
        return 'Network error or CORS issue. Please try again later.';
      } else {
        return 'Invalid credentials or other error occurred.';
      }
    }
  }


  private vacancy: any;

  setVacancy(vacancy: any): void {
    this.vacancy = vacancy;
  }

  getVacancy(): any {
    return this.vacancy;
  }


}
