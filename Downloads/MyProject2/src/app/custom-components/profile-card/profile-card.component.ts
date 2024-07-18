import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, CdkDragPlaceholder],
})
export class ProfileCardComponent  implements OnInit {

  @Input() id: number = 0;
  @Input() name: string = '';
  @Input() nationality: string = '';
  @Input() avatar: string = '';
  @Input() likeCount: Number = 0; 
  @Input() dislikeCount: Number = 0; 
  @Input() disqualified: boolean = false; 
  @Input() status: string = ''; 
  @Input() role: string = ''; 


  @Output() statusChanged = new EventEmitter<{ id: number ,newStatus: string }>();
  @Output() diqualifyChanged = new EventEmitter<{ id: number ,newDisqualified: boolean }>();


  constructor() { }

  ngOnInit() {}

  // i think i dont need this, from chat GPT


  changeStatus(newStatus: string) {
    console.log("calling changeStatus in profile");
    this.status = newStatus;
    this.statusChanged.emit({ id: this.id,newStatus });
  }

  disqualifyStatus(newDisqualified: boolean) {
    console.log("calling disqualify in profile");
    this.disqualified = newDisqualified;
    this.diqualifyChanged.emit({ id: this.id, newDisqualified });
  }

}
