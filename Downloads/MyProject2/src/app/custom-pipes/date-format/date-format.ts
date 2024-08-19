import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
   name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string, format: string = 'MMM YYYY'): string {
    if (!value) {
      return '';
    }
    
    // Parse the input date string using Moment.js and format it
    return moment(value).format(format);
  }

}
