import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';
import { ModalController } from '@ionic/angular';
import { ActionSheetComponent } from '../action-sheet/action-sheet.component';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, CdkDragPlaceholder],
})
export class ProfileCardComponent implements OnInit {

  @Input() id: number = 0;
  @Input() name: string = '';
  @Input() nationality: string = '';
  @Input() avatar: string = '';
  @Input() thumbsDown: Number = 0;
  @Input() thumbsUp: Number = 0;
  @Input() disqualified: boolean = false;
  @Input() finalized: boolean = false;
  @Input() status: string = '';
  @Input() role: string = '';


  @Output() statusChanged = new EventEmitter<{ id: number, newStatus: string }>();
  @Output() diqualifyChanged = new EventEmitter<{ id: number, newDisqualified: boolean }>();

  FinalizedDropdownVisible: boolean = false;

  // Method to compute tag text and class
  getTagInfo() {
    let tagText = '';
    let tagClass = '';

    if (this.status === 'Finalized' && this.finalized === true) {
      tagText = 'Hire';
      tagClass = 'tag-hire';
    }
    else if (this.status === 'Finalized' && this.finalized === false) {
      tagText = 'Hire In Progress';
      tagClass = 'tag-hire-in-progress';
    } else if (this.status === 'Offered') {
      tagText = 'Offer';
      tagClass = 'tag-offer';
    } else if (this.status === 'Offer-Sent') {
      tagText = 'Offer Sent';
      tagClass = 'tag-offer-sent';
    } else if (this.status === 'offered-rejected') {
      tagText = 'Offer Rejected';
      tagClass = 'tag-offer-rejected';
    } else if (this.status === 'Offer-Sent') {
      tagText = 'Offer Sent';
      tagClass = 'tag-offer-sent';
    }
    else if (this.disqualified) {
      tagText = 'Disqualified';
      tagClass = 'tag-disqualified';
    }
    return { tagText, tagClass };
  }

  dropdownOpen = false;

  constructor(private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private modalController: ModalController,

  ) { }

  ngOnInit() { }

  // i think i dont need this, from chat GPT


  changeStatus(newStatus: string) {
    console.log("calling changeStatus in profile");
    this.status = newStatus;
    this.statusChanged.emit({ id: this.id, newStatus });
  }

  disqualifyStatus(newDisqualified: boolean) {
    console.log("calling disqualify in profile");
    this.disqualified = newDisqualified;
    this.diqualifyChanged.emit({ id: this.id, newDisqualified });
  }

  // dropdown options
  toggleDropdown() {
    this.FinalizedDropdownVisible = !this.FinalizedDropdownVisible;
  }

  optionSelected(option: string) {
    console.log(`Option ${option} selected.`);
    this.FinalizedDropdownVisible = false; // Close the dropdown after selection if needed
  }


  showOptions(status: string) {

    console.log(`Status: ${status}`);
    this.FinalizedDropdownVisible = !this.FinalizedDropdownVisible;
  }

  handleTag() {

  }


  // both doing the same

  // private onBodyClick = (event: MouseEvent) => {
  //   console.log("clicked on onBodyClick")
  //   if (!this.elementRef.nativeElement.contains(event.target)) {
  //     // Click occurred outside the component, close dropdown
  //     this.dropdownOpen = false;
  //     this.FinalizedDropdownVisible = false;
  //     document.body.removeEventListener('click', this.onBodyClick);
  //     this.cdr.detectChanges();
  //   }
  // };

  private onBodyClick = (event: MouseEvent) => {
    const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);

    if (!clickedInside) {
      // Click occurred outside the component, close dropdown
      this.dropdownOpen = false;
      this.FinalizedDropdownVisible = false;
      document.body.removeEventListener('click', this.onBodyClick);
      this.cdr.detectChanges();
    }
  };

}

interface Tag {
  label: string;
  background: string;
}
