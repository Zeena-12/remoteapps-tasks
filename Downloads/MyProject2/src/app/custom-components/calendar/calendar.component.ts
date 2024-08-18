import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent  implements OnInit {
  selectedDate!: string;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.dismiss();
  }


  dismiss() {
    this.modalController.dismiss({
      'date': this.selectedDate
    });
  }

}
