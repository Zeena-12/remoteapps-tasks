import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() imageurl: string = ''; // Optional image URL
  @Input() num: string = ''; // Optional image URL
  @Input() numfor: string = ''; // Optional image URL

  people = [
    {
      name: 'Person 1',
      personalNumbers: [
        { value: '18', label: 'Age' },
        { value: '0.4', label: 'Service' },
        { value: 'M1', label: 'Grade' },
        { value: '1', label: 'Reporting' }
      ]
    },
    {
      name: 'Person 2',
      personalNumbers: [
        { value: '25', label: 'Age' },
        { value: '1.2', label: 'Service' },
        { value: 'S2', label: 'Grade' },
        { value: '2', label: 'Reporting' }
      ]
    },
    {
      name: 'Person 3',
      personalNumbers: [
        { value: '25', label: 'Age' },
        { value: '1.2', label: 'Service' },
        { value: 'S2', label: 'Grade' },
        { value: '2', label: 'Reporting' }
      ]
    }
  ];

}
