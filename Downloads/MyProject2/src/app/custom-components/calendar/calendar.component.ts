import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() startDate: string | null = null;
  @Input() endDate: string | null = null;
  @Input() isRange: boolean = false; // Flag to determine if range selection is allowed
  @Input() marked: any[] = [];
  @Output() dateSelected: EventEmitter<{ start?: moment.Moment, end?: moment.Moment }> = new EventEmitter();

  selectedStartDate: moment.Moment | null = null;
  selectedEndDate: moment.Moment | null = null;

  months: { [key: string]: { monthName: string, days: (number | null)[], year: number } } = {};

  ngOnInit() {
    this.generateCalendar();

    setTimeout(() => {
      console.log("marked dates are: ", this.marked);
    }, 1000); // 1000 milliseconds = 1 second
    
  }
  constructor() {

   }
 

  generateCalendar() {
    if (this.startDate && this.endDate) {
      const start = moment(this.startDate);
      const end = moment(this.endDate);
      const startYear = start.year();
      const endYear = end.year();

      for (let year = startYear; year <= endYear; year++) {
        for (let month = 0; month < 12; month++) {
          if (moment({ year, month }).isBetween(start, end, 'month', '[]')) {
            const monthMoment = moment({ year, month });
            const daysInMonth = monthMoment.daysInMonth();
            const startDay = monthMoment.startOf('month').day(); // Day of the week the month starts
            const endDay = monthMoment.endOf('month').day(); // Day of the week the month ends

            const days: (number | null)[] = [];
            // Fill the days before the start of the month
            for (let i = 0; i < startDay; i++) {
              days.push(null);
            }
            // Fill the days of the month
            for (let i = 1; i <= daysInMonth; i++) {
              days.push(i);
            }
            // Fill the days after the end of the month
            for (let i = endDay + 1; i < 7; i++) {
              days.push(null);
            }

            this.months[`${year}-${month}`] = {
              monthName: monthMoment.format('MMMM'),
              days,
              year
            };
          }
        }
      }
    }
  }

  getMonthKeys(): string[] {
    return Object.keys(this.months);
  }

  selectDate(day: number | null, monthKey: string) {
    if (day !== null) {
      const [year, month] = monthKey.split('-').map(Number);
      const date = moment({ year, month, day });

      if (this.isRange) {
        if (!this.selectedStartDate || (this.selectedEndDate && !this.selectedStartDate)) {
          // No start date or end date, set the start date
          this.selectedStartDate = date;
          this.selectedEndDate = null;
        } else if (this.selectedStartDate && !this.selectedEndDate) {
          // Start date set, now set the end date
          if (date.isBefore(this.selectedStartDate)) {
            // If selected date is before start date, swap them
            this.selectedEndDate = this.selectedStartDate;
            this.selectedStartDate = date;
          } else {
            this.selectedEndDate = date;
          }
        } else if (this.selectedStartDate && this.selectedEndDate) {
          // Both dates set, reset selection
          this.selectedStartDate = date;
          this.selectedEndDate = null;
        }

        this.dateSelected.emit({
          start: this.selectedStartDate || undefined,
          end: this.selectedEndDate || undefined
        });
      } else {
        // Single date selection
        this.selectedStartDate = date;
        this.selectedEndDate = null;
        this.dateSelected.emit({
          start: this.selectedStartDate || undefined
        });
      }
    }
  }

  isDateInRange(day: number | null, monthKey: string): boolean {
    if (day === null || !this.selectedStartDate || !this.selectedEndDate) {
      return false;
    }

    const [year, month] = monthKey.split('-').map(Number);
    const date = moment({ year, month, day });

    return date.isBetween(this.selectedStartDate, this.selectedEndDate, 'day', '[]');
  }

  isSelected(day: number | null, monthKey: string): boolean {
    if (day === null) {
      return false;
    }
    const [year, month] = monthKey.split('-').map(Number);
    return this.selectedStartDate?.isSame(moment({ year, month, day }), 'day') ||
      this.selectedEndDate?.isSame(moment({ year, month, day }), 'day') ||
      (this.isRange && this.isDateInRange(day, monthKey));
  }

  // Method to check if the given date is the start of the range
  isStart(day: number | null, monthKey: string): boolean {
    if (day === null || !this.selectedStartDate || (!this.selectedEndDate && this.isRange)) {
      return false;
    }
    const [year, month] = monthKey.split('-').map(Number);
    return this.selectedStartDate.isSame(moment({ year, month, day }), 'day');
  }

  // Method to check if the given date is the end of the range
  isEnd(day: number | null, monthKey: string): boolean {
    if (day === null || !this.selectedEndDate || (!this.selectedStartDate && this.isRange)) {
      return false;
    }
    const [year, month] = monthKey.split('-').map(Number);
    return this.selectedEndDate.isSame(moment({ year, month, day }), 'day');
  }

  // Method to check if the date should be fully rounded (single selection or range is false)
  isSingleSelection(day: number | null, monthKey: string): boolean {
    if (day === null || this.isRange) {
      return false;
    }
    const [year, month] = monthKey.split('-').map(Number);
    return this.selectedStartDate?.isSame(moment({ year, month, day }), 'day') || false;
  }

  trymarkedDates = ['07/01/2024', '01/02/2024'];

  // isDateMarked(day: number, monthKey: string): boolean {
  //   const [year, month] = monthKey.split('-');

  //   // Ensure day is two digits (e.g., '01' instead of '1')
  //   const dayFormatted = day < 10 ? '0' + day : day;

  //   // Format date to 'dd/mm/yyyy'
  //   const formattedDate = `${dayFormatted}/${month}/${year}`;
  //   // Check if formattedDate is in markedDates
  //   const result = this.trymarkedDates.includes(formattedDate);
  //   if(result==true){
  //     console.log("true ", formattedDate);
  //   }
  //   return result;
  // }

  isDateMarked(day: number, monthKey: string): boolean {
    const [year, month] = monthKey.split('-');
  
    // Ensure day and month are two digits
    const dayFormatted = day < 10 ? '0' + day : day;
    const monthFormatted = month.length === 1 ? '0' + month : month;
  
    // Format date to 'dd/mm/yyyy'
    const formattedDate = `${dayFormatted}/${monthFormatted}/${year}`;  
    console.log("dates are", formattedDate);
    // Check if formattedDate is in markedDates
    const result = this.trymarkedDates.includes(formattedDate);
    if (result) {
      console.log("Marked date found:", formattedDate);
    }
    return result;
  }
  







  selectButtonClicked() {

  }
}
