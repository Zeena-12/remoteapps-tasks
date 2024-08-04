import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.page.html',
  styleUrls: ['./interviews.page.scss'],
})
export class InterviewsPage implements OnInit {

  weekDays: { day: string; date: string }[] = [];
  times: { [day: string]: TimeSlot[] } = {}; // Interviews per day
  selectedDay: string = '';

  constructor() { }

  ngOnInit() {
    this.generateWeekDays();
    this.generateTimes();
    this.selectedDay = this.weekDays[0]?.day; // Default to the first day
  }

  generateWeekDays() {
    const startOfWeek = moment().startOf('week'); // Start of the current week
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = startOfWeek.clone().add(i, 'days');
      return {
        day: day.format('ddd'), // Short day name (e.g., Sun)
        date: day.format('D') // Date (e.g., Aug 1)
      };
    });
  }

  generateTimes() {
    this.weekDays.forEach(day => {
      const startTime = moment().startOf('day').hour(7); // Start at 7:00 AM
      const endTime = moment().startOf('day').hour(19); // End at 7:00 PM
      const dailyTimes: TimeSlot[] = [];
      let currentTime = startTime.clone();
      while (currentTime <= endTime) {
        dailyTimes.push({
          time: currentTime.format('h:mm A'),
          people: this.generatePeople() // Generate dummy people data
        });
        currentTime.add(1, 'hour');
      }
      this.times[day.day] = dailyTimes;
    });
  }

  generatePeople() {
    const numPeople = Math.floor(Math.random() * 4); // 0 to 3 people
    if (numPeople === 0) return []; // No interviews
    const people = [];
    for (let i = 0; i < numPeople; i++) {
      people.push({
        name: `Khalil Alrashed `,
        nationality: i % 2 === 0 ? 'Bahraini' : 'Non-Bahraini',
        interviewType: i % 2 === 0 ? 'First Interview' : 'Second Interview',
        image: 'assets/avatar4.png',
        numberOfLikes: 4,
        numberOfDislike: 20,
      });
    }
    return people;
  }
  selectDay(day: string) {
    this.selectedDay = day;
  }

}

interface Interview {
  name: string;
  nationality: string;
  interviewType: string;
  image: string;
  numberOfLikes: number;
  numberOfDislike: number;
}

interface TimeSlot {
  time: string;
  people?: Interview[];
}
