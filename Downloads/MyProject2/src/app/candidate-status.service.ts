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
        name: '1 hassa khalid',
        img: 'assets/avatar.png',
        nationality: 'American',
        role: 'Software Engineer',
        thumbsUp: 10,
        thumbsDown: 2,
        status: 'applied',
        disqualified: false,
  
  
      },
      {
        id: 2,
        name: '2 hassan khalid',
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
        name: '3 khalil khalid',
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
        name: '4 hassan khalid',
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
        name: '5 hassan khalid',
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
        name: '6 khalil khalid',
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
        name: '7 hussain khalid',
        img: 'assets/avatar2.png',
        nationality: 'British',
        role: 'UX Designer',
        thumbsUp: 8,
        thumbsDown: 1,
        status: 'shortlisted',
        disqualified: true,
  
      },
  
      {
        id: 49,
        name: '9 hassan khalid',
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
        name: '2 hassan khalid',
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
        name: '1 hassa khalid',
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
        name: '3 khalil khalid',
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
        name: '3 khalil khalid',
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
        name: '3 khalil khalid',
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
        name: '3 khalil khalid',
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
        name: '3 khalil khalid',
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
        name: '3 khalil khalid',
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
        console.log("calling updateCandidateStatus in service");
      }
      return of();
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
