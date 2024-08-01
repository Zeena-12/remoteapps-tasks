import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateStatusService {

  constructor() { }

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

    getCandidateList(): Observable<Candidate[]> {
      return of(this.candidates);
    }

    updateCandidateStatus(id: number, newStatus: string): Observable<void> {
      const candidate = this.candidates.find(c => c.id == id);
      if (candidate) {
        candidate.status = newStatus;
        // console.log("calling updateCandidateStatus in service");
        // console.log("updated status for ",id , "to " , newStatus);
      }
      return of();
    }
    updateCandidateDisqualified(id: number, Disqualified: boolean): Observable<void> {
      const candidate = this.candidates.find(c => c.id == id);
      if (candidate) {
        candidate.disqualified = Disqualified;
        // console.log("calling updateCandidateStatus in service");
        // console.log("updated Disqualified for ",id , "to " , Disqualified);
      }
      return of();
    }

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
     


    getCandidateById(id: number): Observable<any> {
      console.log("Calling getCandidateById in service with id:", id);
      
      // Find the candidate with the given ID
      const candidate = this.dummyData.find(candidate => candidate.id === id);
      
      // Return the candidate data as an observable
      return of(candidate || {});
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
  [key: string]: any; // This allows accessing any property by string index
}
