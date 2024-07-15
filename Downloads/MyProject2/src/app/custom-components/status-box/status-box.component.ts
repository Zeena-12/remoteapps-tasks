import { Component, ChangeDetectorRef, Input, Output, ViewChildren, QueryList, OnChanges, SimpleChanges, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem, CdkDragPlaceholder, CdkDrag, CdkDropListGroup, CdkDropList, moveItemInArray, CdkDragStart } from '@angular/cdk/drag-drop';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { Gesture, GestureController } from '@ionic/angular';
import { Candidate, CandidateStatusService } from 'src/app/candidate-status.service';


@Component({
  selector: 'app-status-box',
  templateUrl: './status-box.component.html',
  styleUrls: ['./status-box.component.scss'],
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, CdkDropListGroup]
})
export class StatusBoxComponent implements OnInit ,AfterViewInit {

  @Input() id: string = '';
  @Input() status: string = '';
  @Input() employeesList: any[] = [];
  @Input() containerColor: string = '';
  @Output() statusChange = new EventEmitter<{ id: number, newStatus: string }>();


  @ViewChild('dropzone1') dropzone1!: ElementRef;
  @ViewChild('dropzone2') dropzone2!: ElementRef;
  @ViewChild('dropzone3') dropzone3!: ElementRef;

  @ViewChild('dropZoneDisqualify', { static: false })
  dropZoneDisqualify!: ElementRef;
  @ViewChild('dropZoneAnswer', { static: false })
  dropZoneAnswer!: ElementRef;

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

  ngOnInit() {

    console.log();
  }

  ngAfterViewInit() {
    this.updateGestures();
    // this.dropzone1.nativeElement.focus();
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
          oneItem.nativeElement.style.backgroundColor = 'pink';
          this.cdr.detectChanges();
        },

        onMove: ev => {
          const rect1 = oneItem.nativeElement.getBoundingClientRect();
          // console.log(`Current X: ${ev.currentX}, Current Y: ${ev.currentY}`); //
          const currentX = ev.currentX;
          const currentY = ev.currentY;
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
          // oneItem.nativeElement.style.opacity = '0.5';
          oneItem.nativeElement.style.zIndex = -999;
          oneItem.nativeElement.style.backgroundColor = 'pink';
          this.dropZoneDisqualify.nativeElement.zIndex = 99999;
          this.checkDropZoneHover(currentX, currentY);
          this.cdr.detectChanges();
        },
        onEnd: ev => {
          const currentX = ev.currentX;
          const currentY = ev.currentY;
          console.log("end");
          this.showOptionsDisqualified = false;
          this.showOptionsOffered = false;
          this.showOptionsFinalized = false;
          // this.cdr.detectChanges();
          this.handleDrop(currentX, currentY);
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


  onDragStarted(event: CdkDragStart) {
    console.log("event is", event.source.element.nativeElement);
    console.log("dropzone ", this.dropzone1.nativeElement);
   
    // Access the element being dragged
    const element = event.source.element.nativeElement;
    
    // Set a custom zIndex (for example, 1000)
    element.style.zIndex = '1000';
    this.dropzone1.nativeElement.style.zIndex = '9999';
  }


  checkDropZoneHover(evCurrentX: number, evCurrentY: number) {

    // const dragElement = element.nativeElement;

    const dropZoneDisqualifyRect = this.dropZoneDisqualify.nativeElement.getBoundingClientRect();
    const dropZoneAnswerRect = this.dropZoneAnswer.nativeElement.getBoundingClientRect();
    // console.log("dragged aelemtn", dragElement);

    if (this.areElementsTouching(evCurrentX, evCurrentY, dropZoneDisqualifyRect)) {
      // this.dropZoneDisqualify.nativeElement.querySelector('img').style.filter = 'invert(38%) sepia(87%) saturate(7491%) hue-rotate(200deg) brightness(46%) contrast(107%)';
      this.dropZoneDisqualify.nativeElement.querySelector('img').style.fill = '#00abec';
      this.dropZoneDisqualify.nativeElement.querySelector('p').style.color = '#00abec';
    } else {
      this.dropZoneDisqualify.nativeElement.querySelector('img').style.filter = '';
      this.dropZoneDisqualify.nativeElement.querySelector('p').style.color = '';
    }

    if (this.areElementsTouching(evCurrentX, evCurrentY, dropZoneAnswerRect)) {
      // this.dropZoneAnswer.nativeElement.querySelector('img').style.filter = 'invert(50%) sepia(100%) saturate(10000%) hue-rotate(200deg) brightness(46%) contrast(100%)';
      this.dropZoneAnswer.nativeElement.querySelector('img').style.fill = 'color';
      this.dropZoneAnswer.nativeElement.querySelector('p').style.color = '#00abec';
    } else {
      this.dropZoneAnswer.nativeElement.querySelector('img').style.filter = '';
      this.dropZoneAnswer.nativeElement.querySelector('p').style.color = '';
    }

  }

  areElementsTouching(evX: any, evY: any, dropZone: any): boolean {
    // Get the bounding rectangle of the drop zone
    const dropZoneRect = dropZone;

    // Extract the position and dimensions of the drop zone
    const dropZoneLeft = dropZoneRect.left;
    const dropZoneRight = dropZoneRect.right;
    const dropZoneTop = dropZoneRect.top;
    const dropZoneBottom = dropZoneRect.bottom;

    // console.log("Drop Zone Rect:", dropZoneRect);
    // console.log("Event X:", evX);
    // console.log("Event Y:", evY);

    // Check if the event's coordinates are within the drop zone's bounding rectangle
    const isTouching = evX >= dropZoneLeft && evX <= dropZoneRight && evY >= dropZoneTop && evY <= dropZoneBottom;
    return isTouching;
  }

  handleDrop(evCurrentX: number, evCurrentY: number) {

    if (!this.dropZoneDisqualify || !this.dropZoneAnswer) {
      console.error('Drop zones are not initialized yet.');
      return;
    }
      const dropZoneDisqualifyRect = this.dropZoneDisqualify.nativeElement.getBoundingClientRect();
      const dropZoneAnswerRect = this.dropZoneAnswer.nativeElement.getBoundingClientRect();

      // console.log("Drop Zone Disqualify Rect:", dropZoneDisqualifyRect);
      // console.log("Drop Zone Answer Rect:", dropZoneAnswerRect);

      if (this.areElementsTouching(evCurrentX, evCurrentY, dropZoneDisqualifyRect)) {
        console.log("Dropped in Drop Zone Disqualify");
      }

      if (this.areElementsTouching(evCurrentX, evCurrentY, dropZoneAnswerRect)) {
        console.log("Dropped in Drop Zone Answer");
      } 
  }


}