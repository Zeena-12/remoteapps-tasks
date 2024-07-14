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
          this.checkDropZoneHover(oneItem);
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








  // checkDropZoneHover(x: number, y: number) {
  //   const dropZoneDisqualifyRect = this.dropZoneDisqualify.nativeElement.getBoundingClientRect();
  //   const dropZoneAnswerRect = this.dropZoneAnswer.nativeElement.getBoundingClientRect();

  //   const isHoveringDisqualify = this.isInZone(x, y, dropZoneDisqualifyRect);
  //   const isHoveringAnswer = this.isInZone(x, y, dropZoneAnswerRect);

  //   if (isHoveringDisqualify) {
  //     this.dropZoneDisqualify.nativeElement.style.backgroundColor = 'blue';
  //   } else {
  //     this.dropZoneDisqualify.nativeElement.style.backgroundColor = 'black';
  //   }

  //   if (isHoveringAnswer) {
  //     this.dropZoneAnswer.nativeElement.style.backgroundColor = 'green';
  //   } else {
  //     this.dropZoneAnswer.nativeElement.style.backgroundColor = 'black';
  //   }
  // }



  // isInZone(x: Number, y: Number, dropzone: any) {
  //   if (x < dropzone.left || x >= dropzone.right) {
  //     return false;
  //   }
  //   if (x < dropzone.top || x >= dropzone.bottom) {
  //     return false;
  //   }
  //   return true;
  // }

  checkDropZoneHover(element: any) {

    const dragElement = element.nativeElement;

    const dropZoneDisqualifyRect = this.dropZoneDisqualify.nativeElement.getBoundingClientRect();
    const dropZoneAnswerRect = this.dropZoneAnswer.nativeElement.getBoundingClientRect();
    // console.log("dragged aelemtn", dragElement);
    // console.log("dropzone 1", dropZoneDisqualifyRect);
    // console.log("dropzone 2 ", dropZoneAnswerRect);
    if (this.areElementsTouching(dragElement, this.dropZoneDisqualify.nativeElement)) {
      this.dropZoneDisqualify.nativeElement.style.backgroundColor = 'blue';
    } else {
      this.dropZoneDisqualify.nativeElement.style.backgroundColor = 'black';
    }

    if (this.areElementsTouching(dragElement, this.dropZoneAnswer.nativeElement)) {
      this.dropZoneAnswer.nativeElement.style.backgroundColor = 'green';
    } else {
      this.dropZoneAnswer.nativeElement.style.backgroundColor = 'black';
    }

  }

  isInZone(x: number, y: number, dropzone: any) {
    if (x < dropzone.left || x >= dropzone.right) {
      return false;
    }
    if (y < dropzone.top || y >= dropzone.bottom) {
      return false;
    }
    return true;
  }

  areElementsTouching(element1: any, element2: any): boolean {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    console.log("drect 1", rect1);
    console.log("rect 2 ", rect2);
    if (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    ) {
      return true;
    } else {
      return false;
    }

  }

}
