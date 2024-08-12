import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { backend } from '../global'; // Import the backend URL
import { HTTP } from '@ionic-native/http/ngx'; // Import HTTP from ionic-native


@Injectable({
  providedIn: 'root'
})
export class CandidateStatusService {
  // private apiUrlApplications = 'http://localhost:3000/getApplications';

  private apiUrlGetApplicantData = `${backend}HCM/Recruitment/Applicants/getApplicantData`;

  private apiUrlApplications = `${backend}getApplications`;
  private apiUrlGetVacansiesData = `${backend}HCM/Recruitment/Vacancies/getVacansiesData`;
  usData: any;



  constructor(private http: HTTP) { }






  // getApplications(): Observable<any[]> {
  //   return this.http.get<any>(this.apiUrlApplications, { withCredentials: true }).pipe(
  //     // Log the entire response to understand its structure
  //     tap(response => {
  //       console.log('Raw response from getApplications:', response.ApplicantList);
  //     }),
  //     map(response => response.ApplicantList || []), // Extract ApplicantList from response
  //     catchError(this.handleError)
  //   );
  // }

  // this function caling local api and working fine
  // getApplications(): Observable<any[]> {
  //   return this.http.get<any>(this.apiUrlApplications).pipe(
  //     map(response => {
  //       // Assuming the relevant data is in the first item of the response array
  //       const dataArray =response || [];
  //       console.log("full data: ",dataArray);
  //       return dataArray;
  //     }),
  //     catchError(error => {
  //       console.error('Error fetching applications', error);
  //       return of([]); // Return an empty array in case of error
  //     })
  //   );
  // }







  // getApplications(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrlApplications).pipe(
  //     catchError(error => {
  //       console.error('Error fetching applications', error);
  //       return of([]); // Return an empty array in case of error
  //     })
  //   );
  // }


  // async getApplicantData(): Promise<string> {
  //   // const url = 'https://api.remoteapps.com/HCM/Recruitment/Vacancies/getVacansiesData';
  //   try {
  //     const response: any = await this.http.post(this.apiUrlGetApplicantData, {}, {});
  //     // Handle successful response
  //     console.log('Response from server:', response.data);
  //     // Return a success message or any other relevant data
  //     return response.data;
  //   } catch (error: any) {
  //     // Handle error response
  //     console.error('Error during login:', error);

  //     // Return an error message or handle as needed
  //     if (error.status === 0) {
  //       return 'Network error or CORS issue. Please try again later.';
  //     } else {
  //       return 'Invalid credentials or other error occurred.';
  //     }
  //   }
  // }

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


  // getCandidateList(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrlApplications).pipe(
  //     catchError(error => {
  //       console.error('Error fetching data', error);
  //       return of([]); // Return an empty array in case of error
  //     })
  //   );
  // }

  updateCandidateStatus(id: number, newStatus: string): Observable<void> {
    console.log("calling updateCandidateStatus");

    console.log("calling updateCandidateStatus in service");
    console.log("updated status for ",id , "to " , newStatus);
    return of();
  }
  
  // updateCandidateDisqualified(id: number, Disqualified: boolean): Observable<void> {
  //   const candidate = this.candidates.find(c => c.id == id);
  //   if (candidate) {
  //     candidate.disqualified = Disqualified;
  //     console.log("calling updateCandidateStatus in service");
  //     console.log("updated Disqualified for ",id , "to " , Disqualified);
  //   }
  //   return of();
  // }

  private dummyData = [
    {
      id: 1,
      cv: {
        passportNumber: 'X1234567',
        birthday: '1990-01-01',
        skills: ['JavaScript', 'TypeScript', 'Angular'],
        qualifications: ['BSc Computer Science', 'MSc Software Engineering']
      },
      answers: [
        { question: 'What is your greatest strength?', answer: 'Problem-solving skills' },
        { question: 'Why should we hire you?', answer: 'I have a proven track record of success in similar roles' },
        { question: 'Where do you see yourself in 5 years?', answer: 'In a leadership position within the company' }
      ]
    },
    {
      id: 1,
      cv: {
        passportNumber: 'X1234567',
        birthday: '1990-01-01',
        skills: ['JavaScript', 'TypeScript', 'Angular'],
        qualifications: ['BSc Computer Science', 'MSc Software Engineering']
      },
      answers: [
        { question: 'What is your greatest strength?', answer: 'Problem-solving skills' },
        { question: 'Why should we hire you?', answer: 'I have a proven track record of success in similar roles' },
        { question: 'Where do you see yourself in 5 years?', answer: 'In a leadership position within the company' }
      ]
    },
  ]

  // dummy data
  private candidates: Candidate[] = [
    {
      id: 1,
      name: 'hassa khalid',
      img: 'assets/avatar.png',
      nationality: 'American',
      role: 'Software Engineer',
      thumbsUp: 10,
      thumbsDown: 2,
      status: 'applied',
      disqualified: true,
    },
    {
      id: 2,
      name: 'hassan khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'applied',
      disqualified: true,
    },
    {
      id: 3,
      name: 'khalil khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'applied',
      disqualified: false,

    },
    {
      id: 4,
      name: 'hassan khalid',
      img: 'assets/avatar2.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'reviewed',
      disqualified: true,

    },
    {
      id: 5,
      name: 'hassan khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'reviewed',
      disqualified: true,

    },
    {
      id: 6,
      name: 'khalil khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'reviewed',
      disqualified: true,
    },
    {
      id: 7,
      name: 'hussain khalid',
      img: 'assets/avatar2.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'applied',
      disqualified: true,
    },

    {
      id: 49,
      name: 'hassan khalid',
      img: 'assets/avatar2.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'interviewed',
      disqualified: true,
    },

    {
      id: 44,
      name: 'hassan khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'offered',
      disqualified: true,
    },
    {
      id: 41,
      name: 'hassa khalid',
      img: 'assets/avatar.png',
      nationality: 'American',
      role: 'Software Engineer',
      thumbsUp: 10,
      thumbsDown: 2,
      status: 'finalized',
      disqualified: true,
    },
    {
      id: 312,
      name: 'khalil khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'finalized',
      disqualified: false,

    },
    {
      id: 45,
      name: 'khalil khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'finalized',
      disqualified: false,

    },
    {
      id: 53,
      name: 'khalil khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'finalized',
      disqualified: false,

    },
    {
      id: 52,
      name: 'khalil khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'finalized',
      disqualified: false,

    },
    {
      id: 51,
      name: 'khalil khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'finalized',
      disqualified: false,

    },
    {
      id: 50,
      name: 'khalil khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      thumbsUp: 8,
      thumbsDown: 1,
      status: 'finalized',
      disqualified: false,

    },

  ];



  getCandidateById(id: number): Observable<any> {
    console.log("Calling getCandidateById in service with id:", id);

    // Find the candidate with the given ID
    const candidate = this.dummyData.find(candidate => candidate.id === id);

    // Return the candidate data as an observable
    return of(candidate || {});
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    // Log the error or display a user-friendly message
    console.error('An error occurred:', error.message);
    return of([]); // Return an empty array or a suitable fallback
  }
}

export interface Candidate {
  id: number;
  name: string;
  img: string; // URL to the image
  nationality: string;
  role: string;
  thumbsUp: number;
  thumbsDown: number;
  status: string;
  disqualified: boolean;
}





