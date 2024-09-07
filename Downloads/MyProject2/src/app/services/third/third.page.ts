import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { ProfileCardComponent } from '../custom-components/profile-card/profile-card.component';

@Component({
  selector: 'app-third',
  templateUrl: './third.page.html',
  styleUrls: ['./third.page.scss'],
})
export class ThirdPage implements AfterViewInit {

  candidates: any[] = [];

  constructor(private gestureCtrl: GestureController,
    

  ) { }

  applied: Employee[] = [
    {
      id: 1,
      name: '1 hassa khalid',
      img: 'assets/avatar.png',
      nationality: 'American',
      role: 'Software Engineer',
      like: 10,
      dislike: 2,
      status: 'Active'
    },
    {
      id: 2,
      name: '2 hassan khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      like: 8,
      dislike: 1,
      status: 'Inactive'
    },
    {
      id: 3,
      name: '3 khalil khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      like: 8,
      dislike: 1,
      status: 'Inactive'
    },
  ];

  reviewed: Employee[] = [
    {
      id: 4,
      name: '4 hassan khalid',
      img: 'assets/avatar2.png',
      nationality: 'British',
      role: 'UX Designer',
      like: 8,
      dislike: 1,
      status: 'Inactive'
    },
    {
      id: 5,
      name: '5 hassan khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      like: 8,
      dislike: 1,
      status: 'Inactive'
    },
    {
      id: 6,
      name: '6 khalil khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      like: 8,
      dislike: 1,
      status: 'Inactive'
    },
    {
      id: 7,
      name: '7 hussain khalid',
      img: 'assets/avatar2.png',
      nationality: 'British',
      role: 'UX Designer',
      like: 8,
      dislike: 1,
      status: 'Inactive'
    },
  ];

  shortlisted: Employee[] = [

    {
      id: 8,
      name: '8 hassan khalid',
      img: 'assets/avatar.png',
      nationality: 'British',
      role: 'UX Designer',
      like: 8,
      dislike: 1,
      status: 'Inactive'
    },
  ];

  interviewed: Employee[] = [

    {
      id: 9,
      name: '9 hassan khalid',
      img: 'assets/avatar2.png',
      nationality: 'British',
      role: 'UX Designer',
      like: 8,
      dislike: 1,
      status: 'Inactive'
    },
  ];

  // @ViewChild('dropxoneA') dropA!: ElementRef;
  // @ViewChild('dropxoneB') dropB!: ElementRef;
  // @ViewChild('dropxoneC') dropC!: ElementRef;
  // @ViewChild('dropxoneD') dropD!: ElementRef;
  // contentScrollActive = true;
  // @ViewChildren(ProfileCardComponent, { read: ElementRef }) profileCards!: QueryList<ElementRef>;





}

export interface Employee {
  id: number;
  name: string;
  img: string; // URL to the image
  nationality: string;
  role: string;
  like: number;
  dislike: number;
  status: string;
}



