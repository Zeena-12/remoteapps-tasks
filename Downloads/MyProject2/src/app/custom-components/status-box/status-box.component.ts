import { Component, ChangeDetectorRef, Input, Output, ViewChildren, QueryList, OnChanges, SimpleChanges, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem, CdkDragPlaceholder, CdkDrag, CdkDropListGroup, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { Gesture, GestureController } from '@ionic/angular';
import { Candidate, CandidateStatusService } from 'src/app/candidate-status.service';


@Component({
  selector: 'app-status-box',
  templateUrl: './status-box.component.html',
  styleUrls: ['./status-box.component.scss'],
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, CdkDropListGroup]
})
export class StatusBoxComponent implements AfterViewInit {

  @Input() id: string = '';
  @Input() status: string = '';
  @Input() employeesList: any[] = [];
  @Input() containerColor: string = '';
  @Output() statusChange = new EventEmitter<{ id: number, newStatus: string }>();


  @ViewChild('dropzone1') dropzone1!: ElementRef;
  @ViewChild('dropzone2') dropzone2!: ElementRef;
  @ViewChild('dropzone3') dropzone3!: ElementRef;

  @ViewChild('dropZoneDisqualify') dropZoneDisqualify!: ElementRef;
  @ViewChild('dropZoneAnswer') dropZoneAnswer!: ElementRef;
  @ViewChild('dropZoneOffer') dropZoneOffer!: ElementRef;
  @ViewChild('dropZoneFinalize') dropZoneFinalize!: ElementRef;
  @ViewChild('dropZoneReturn') dropZoneReturn!: ElementRef;
  @ViewChild('dropZoneMessage') dropZoneMessage!: ElementRef;


  gestureArray: Gesture[] = [];
  @ViewChildren(ProfileCardComponent, { read: ElementRef }) items!: QueryList<ElementRef>;
  // @ViewChildren(ProfileCardComponent) items!: QueryList<ProfileCardComponent>;


  onStatusChange(event: { id: number, newStatus: string }) {
    this.statusChange.emit(event);
  }

  employeesList2: any[] = []; // Initialize as empty array

  showOptionsDisqualified: boolean = false;
  showOptionsOffered: boolean = false;
  showOptionsFinalized: boolean = false;




  constructor(
    private gestureCtrl: GestureController,
    private cdr: ChangeDetectorRef,
  ) {
    this.showOptionsDisqualified = false;
    this.showOptionsOffered = false;
    this.showOptionsFinalized = false;
  }

  ngAfterViewInit() {
    this.updateGestures();


  }

  updateGestures() {
    // Destroy existing gestures
    this.gestureArray.forEach(gesture => gesture.destroy());
    this.gestureArray = [];

    // Create new gestures
    this.items.forEach((oneItem) => {
      const drag = this.gestureCtrl.create({
        el: oneItem.nativeElement,

        threshold: 1,
        gestureName: 'drag',

        onStart: ev => {
          console.log("start");
          const status = oneItem.nativeElement.getAttribute('ng-reflect-status');
          // console.log('user old status:', status);

          // check the status and show show the correct option box
          if (status) {
            if (status == 'applied') {
              this.showOptionsDisqualified = true;
            } else if (status == 'offered') {
              this.showOptionsOffered = true;
            } else if (status == 'finalized') {
              this.showOptionsFinalized = true;
            }
          }
          oneItem.nativeElement.style.opacity = '0.6';
        },

        onMove: ev => {
          console.log("move");
          const status = oneItem.nativeElement.getAttribute('ng-reflect-status');
          // console.log('user old status:', status);

          // check the status and show show the correct option box
          if (status) {
            if (status == 'applied') {
              this.showOptionsDisqualified = true;
            } else if (status == 'offered') {
              this.showOptionsOffered = true;
            } else if (status == 'finalized') {
              this.showOptionsFinalized = true;
            }
          }
          oneItem.nativeElement.style.zIndex = 1;
          // this.dropzone1.nativeElement.style.backgroundColor = 'red';
          this.checkDropZoneHover(ev.currentX, ev.currentY);


        },
        onEnd: ev => {
          console.log("end");
          this.showOptionsDisqualified = false;
          this.showOptionsOffered = false;
          this.showOptionsFinalized = false;
          this.cdr.detectChanges();
          oneItem.nativeElement.style.opacity = '1';
        }
      });

      drag.enable();
      this.gestureArray.push(drag);
    });
  }

  drop(event: CdkDragDrop<any[]>, target: string) {
    // Reset all options to false first
    this.showOptionsDisqualified = false;
    this.showOptionsOffered = false;
    this.showOptionsFinalized = false;

    const draggedElement = event.item.element.nativeElement;


    // console.log('Dragged element:', draggedElement);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const newStatus = this.status.toLowerCase(); // Assuming you have a way to set the new status dynamically
      // console.log("current status :", newStatus);
      // Update the status of the <app-profile-card> component inside the dragged element
      const profileCard = draggedElement.querySelector('app-profile-card');
      // console.log("see what in profile card: ", profileCard);
      if (profileCard) {
        profileCard.setAttribute('status', newStatus);
        const id = Number(profileCard.getAttribute('ng-reflect-id'));
        console.log("id is: ", id);
        this.statusChange.emit({ id, newStatus });
      }
    }
  }

  handleStatusChange(event: { id: number, newStatus: string }) {
    this.statusChange.emit(event);
    console.log("calling handleStatusChange from statsu");
  }



  // see the dragged item in which status and show the options box
  onDragStarted(status: string) {
    this.showOptionsDisqualified = false;
    this.showOptionsOffered = false;
    this.showOptionsFinalized = false;

    // console.log('item dragged in  status:', status);
    if (status === 'applied') {
      this.showOptionsDisqualified = true;
    } else if (status === 'offered') {
      this.showOptionsOffered = true;
    } else if (status === 'finalized') {
      this.showOptionsFinalized = true;
    }
    // Reset options to false after 2 seconds
    // setTimeout(() => {
    //   this.showOptionsDisqualified = false;
    //   this.showOptionsOffered = false;
    //   this.showOptionsFinalized = false;
    //   this.cdr.detectChanges(); // Ensure view updates
    // }, 4000);
  }

  checkDropZoneHover(x: Number, y: Number) {
    const dropZoneDisqualify = this.dropZoneDisqualify.nativeElement.getBoundingClientRect();
    const dropZoneAnswer = this.dropZoneDisqualify.nativeElement.getBoundingClientRect();


    if (this.isInZone(x, y, dropZoneDisqualify)) {
      this.dropZoneDisqualify.nativeElement.style.backgroundColor = 'blue';
    }
    if (this.isInZone(x, y, dropZoneAnswer)) {
      this.dropZoneAnswer.nativeElement.style.backgroundColor = 'blue';
    }
    else{
      this.dropZoneDisqualify.nativeElement.style.backgroundColor = 'red';
      this.dropZoneAnswer.nativeElement.style.backgroundColor = 'red';
    }
  }

  isInZone(x: Number, y: Number, dropzone: any) {
    if (x < dropzone.left || x >= dropzone.right) {
      return false;
    }
    if (x < dropzone.top || x >= dropzone.bottom) {
      return false;
    }
    return true;
  }
}

