import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  items: any[];  // Declare 'items' as an array

  constructor() {
    this.items = new Array(9);  // Initialize 'items' with 15 undefined elements
  }

}
