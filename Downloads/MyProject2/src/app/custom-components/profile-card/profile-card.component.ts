import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { ModalController } from '@ionic/angular';
import { ActionSheetComponent } from '../action-sheet/action-sheet.component';

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
  @Input() thumbsDown: Number = 0; 
  @Input() thumbsUp: Number = 0; 
  @Input() disqualified: boolean = false; 
  @Input() status: string = ''; 
  @Input() role: string = ''; 


  @Output() statusChanged = new EventEmitter<{ id: number ,newStatus: string }>();
  @Output() diqualifyChanged = new EventEmitter<{ id: number ,newDisqualified: boolean }>();

  FinalizedDropdownVisible: boolean = false;

  dropdownOpen = false;

  constructor(private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private modalController: ModalController,

  ) { }

  ngOnInit() {}

  // i think i dont need this, from chat GPT


  changeStatus(newStatus: string) {
    console.log("calling changeStatus in profile");
    this.status = newStatus;
    this.statusChanged.emit({ id: this.id , newStatus });
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
  
  
  showOptions(status: string){

    // this.dropdownOpen = !this.dropdownOpen;
    // if (this.dropdownOpen) {
    //   // Add event listener to close dropdown on outside click
    //   document.body.addEventListener('click', this.onBodyClick);
    // } else {
    //   // Remove event listener when dropdown is closed
    //   document.body.removeEventListener('click', this.onBodyClick);
    // }


    console.log(`Status: ${status}`);
      this.FinalizedDropdownVisible = !this.FinalizedDropdownVisible;
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
    
    async openActionSheet() {
      const modal = await this.modalController.create({
        component: ActionSheetComponent,
        componentProps: {
          options: [
            { label: 'Open CV', icon: '/assets/calendar.svg' },
            { label: 'Disqualify', icon: '/assets/calendar.svg' },
            { label: 'Regret', icon: '/assets/calendar.svg' },
            { label: 'View Tests', icon: '/assets/calendar.svg' },
            { label: 'View Answers', icon: '/assets/calendar.svg' },
          ]
        },
        cssClass: 'custom-modal', // Optional: Add custom CSS class for styling
        backdropDismiss: true, // Optional: Close modal on backdrop click
      });
      return await modal.present();
    }

}
