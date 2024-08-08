import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractName',
  standalone: false
})
export class ExtractNamePipe implements PipeTransform {

  transform(value: string): string {
    if (value) {
      return value.split(' - ')[1] || value;
    }
    return '-';
  }

}
