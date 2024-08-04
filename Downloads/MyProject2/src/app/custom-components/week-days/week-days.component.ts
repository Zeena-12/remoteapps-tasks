import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-week-days',
  templateUrl: './week-days.component.html',
  styleUrls: ['./week-days.component.scss'],
})
export class WeekDaysComponent  implements OnInit {
  weekDays: { day: string, date: string }[] = [];
  times: { time: string }[] = [];

  constructor() { }

  ngOnInit() {
    this.generateWeekDays();
    this.generateTimes();
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
    const startTime = moment().startOf('day').hour(7); // Start at 7:00 AM
    const endTime = moment().startOf('day').hour(19); // End at 7:00 PM
    this.times = [];
    let currentTime = startTime.clone();
    while (currentTime <= endTime) {
      this.times.push({ time: currentTime.format('h:mm A') });
      currentTime.add(1, 'hour');
    }
  }
  

}
