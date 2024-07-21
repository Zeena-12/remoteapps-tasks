import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent  implements OnInit {
  @Output() optionSelected = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}
  selectOption(option: string) {
    this.optionSelected.emit(option);
  }

}
