import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @Input() startDate: string | null = null;
  @Input() endDate: string | null = null;
  @Input() isRange: boolean = false; // Flag to determine if range selection is allowed
  @Input() markedDates: any[] = []; 
  @Output() dateSelected: EventEmitter<{ start?: moment.Moment, end?: moment.Moment }> = new EventEmitter();
  
  @Output() selectButtonClicked = new EventEmitter<{ date: string, day: string }>();

  selectedStartDate: moment.Moment | null = null;
  selectedEndDate: moment.Moment | null = null;

  months: { [key: string]: { monthName: string, days: (number | null)[], year: number } } = {};
  todayDay!: number;

  ngOnInit() {
    this.generateCalendar();
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

  selectedDate: moment.Moment | null = null;

  onSelectButtonClick() {
    if (this.selectedDate) {
      console.log("onSelectButtonClick and selected date is ", this.selectedDate);
      this.selectButtonClicked.emit({
        date: this.selectedDate.format('YYYY-MM-DD'),
        day: this.selectedDate.format('ddd') // Short day name
      });
    } else {
      console.warn('No date selected');
    }
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

          // Emit only the start date for range selection
        this.dateSelected.emit({
          start: this.selectedStartDate || undefined
        });
        return; 


          
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
      this.dateSelected.emit({
        start: this.selectedStartDate || undefined
      });
  
      // Set selectedDate for immediate feedback
      this.selectedDate = this.selectedStartDate; 
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




  isDateMarked(day: number, monthKey: string): boolean {
    const [year, month] = monthKey.split('-').map(Number);
  // console.log(day, " ", monthKey);
    // Ensure day and month are two digits
    const dayFormatted = day < 10 ? '0' + day : day;
    const monthFormatted = (month + 1) < 10 ? '0' + (month + 1) : (month + 1);
  
    // Format date to 'dd/mm/yyyy'
    const formattedDate = `${dayFormatted}/${monthFormatted}/${year}`;  
    // console.log("dates are", formattedDate);
    // Check if formattedDate is in markedDates
    const result = this.markedDates.includes(formattedDate);
    if (result) {
      // console.log("Marked date found:", formattedDate);
    }
    return result;
  }
  
  ngAfterViewInit() {
    setTimeout(() => this.scrollToCurrentMonth(), 0);
  }

  // Function to generate month key
  // getMonthKey(year: number, month: number): string {
  //   return `${year}-${month < 9 ? '0' : ''}${month + 1}`; // Format like "2024-09"
  // }

  // getMonthKey(year: number, month: number): string {
  //   const formattedMonth = month < 9 ? '0' : '' + (month + 1); // Month is zero-based
  //   const key = `${year}-${formattedMonth}`;
  //   console.log(`Generated month key: ${key}`); // Print the generated key
  //   return key;
  // }

  getMonthKey(year: number, month: string): string {
    // Format month as "01" to "12"
    // console.log("month is ", month);
    // console.log("yera is ", year);
    const key = `${year}-${month}`
    // console.log(`Generated month key: ${key}`); // Print the generated key
    return key;
  }
  


  // Function to scroll the current month into view
  scrollToCurrentMonth() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = moment().format('MMMM'); // Full month name

    // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% what is month",currentMonth);

    const currentMonthKey = this.getMonthKey(currentYear, currentMonth);
    const currentMonthElement = document.getElementById(currentMonthKey);

    if (currentMonthElement) {
      currentMonthElement.scrollIntoView({
        block: 'center',
        inline: 'center'
      });
    } else {
      console.warn(`Month container with ID ${currentMonthKey} not found.`);
    }
  }


}


