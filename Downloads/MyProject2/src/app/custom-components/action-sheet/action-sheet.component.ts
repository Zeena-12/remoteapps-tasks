import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalController } from '@ionic/angular'; 

@Component({
  selector: 'app-action-sheet',
  templateUrl: './action-sheet.component.html',
  styleUrls: ['./action-sheet.component.scss'],
})
export class ActionSheetComponent  implements OnInit {

  @Input() options: { label: string, icon: string }[] = [];
  @Input() optionSelected!: (option: any) => void;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}
 
  handleOptionSelected(option: any) {
    this.optionSelected(option);
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

}
