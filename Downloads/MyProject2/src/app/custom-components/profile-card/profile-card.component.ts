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

  @Input() id: string = '';
  @Input() name: string = '';
  @Input() nationality: string = '';
  @Input() avatar: string = '';
  @Input() likeCount: Number = 0; 
  @Input() dislikeCount: Number = 0; 
  @Input() disqualified: boolean = true; 
  @Input() status: string = ''; 
  @Input() role: string = ''; 

  @Output() statusChanged = new EventEmitter<{ id: string, newStatus: string }>();

  constructor() { }

  ngOnInit() {}

  changeStatus(newStatus: string) {
    this.status = newStatus;
    this.statusChanged.emit({ id: this.id, newStatus });
    console.log("calling changeStatus in profile");
  }

}
