import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() name: string = '';

  // Emits an event when input value changes
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
  }
}
