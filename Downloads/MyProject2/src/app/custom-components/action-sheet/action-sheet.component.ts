import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalController } from '@ionic/angular'; 

@Component({
  selector: 'app-action-sheet',
  templateUrl: './action-sheet.component.html',
  styleUrls: ['./action-sheet.component.scss'],
})
export class ActionSheetComponent  implements OnInit {

  @Input() options: { label: string, icon: string }[] = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {}


  async dismiss() {
    await this.modalController.dismiss();
  }

}
