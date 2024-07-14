import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToArray'
})
export class MapToArrayPipe implements PipeTransform {
  transform(value: any): { key: string, label: string, value: string }[] {
    if (!value) return [];
    return Object.keys(value).map(key => ({
      key,
      label: value[key].Label,
      value: value[key].Value
    }));
  }
}
