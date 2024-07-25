import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-custom-model',
  templateUrl: './custom-model.component.html',
  styleUrls: ['./custom-model.component.scss'],
})
export class CustomModelComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

}
