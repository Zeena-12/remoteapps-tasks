import { Component, ChangeDetectorRef, Input, Output, ViewChildren, QueryList, OnChanges, SimpleChanges, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem, CdkDragPlaceholder, CdkDrag, CdkDropListGroup, CdkDropList, moveItemInArray, CdkDragStart,CdkDragPreview } from '@angular/cdk/drag-drop';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { Gesture, GestureController } from '@ionic/angular';
import { Candidate, CandidateStatusService } from 'src/app/candidate-status.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ActionSheetComponent } from '../action-sheet/action-sheet.component';


@Component({
  selector: 'app-status-box',
  templateUrl: './status-box.component.html',
  styleUrls: ['./status-box.component.scss'],
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, CdkDropListGroup, CdkDragPreview]
})
export class StatusBoxComponent implements OnInit, AfterViewInit {

  @Input() id: string = '';
  @Input() status: string = '';
  @Input() employeesList: any[] = [];
  @Input() containerColor: string = '';

  @Output() statusChange = new EventEmitter<{ id: number, newStatus: string }>();
  @Output() diqualifyChanged = new EventEmitter<{ id: number, newDisqualified: boolean }>();


  disqualify: string = '';

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
  onDiqualifyChanged(event: { id: number, newDisqualified: boolean }) {
    this.diqualifyChanged.emit(event);
  }

  employeesList2: any[] = []; // Initialize as empty array

  showOptionsDisqualified: boolean = false;
  showOptionsOffered: boolean = false;
  showOptionsFinalized: boolean = false;

  item: any = { /* Initialize with your item properties */ };

  constructor(
    private gestureCtrl: GestureController,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
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
          oneItem.nativeElement.style.opacity = '0.5';
          const status = oneItem.nativeElement.getAttribute('ng-reflect-status');
          // console.log('user old status:', status);

          if (status) {
            if (status == 'applied') {
              const isDisqualified = oneItem.nativeElement.getAttribute('ng-reflect-disqualified')

              console.log("what is isDisqualified in onStart ", isDisqualified);
              if (isDisqualified == false) {
                this.disqualify = "Disqualify";

              }
              else if (isDisqualified == true) {
                this.disqualify = "Requalify";
              }
              this.showOptionsDisqualified = true;
              console.log("value if global disqualify is", this.disqualify);

            }
            else if (status == 'offered') {
              this.showOptionsOffered = true;
            } else if (status == 'finalized') {
              this.showOptionsFinalized = true;
            }
          }
          this.cdr.detectChanges();
        },

        onMove: ev => {
          const rect1 = oneItem.nativeElement.getBoundingClientRect();
          // console.log(`Current X: ${ev.currentX}, Current Y: ${ev.currentY}`); //
          const currentX = ev.currentX;
          const currentY = ev.currentY;
          const status = oneItem.nativeElement.getAttribute('ng-reflect-status');
          console.log('user old status:', status);

          // check the status and show show the correct option box
          if (status) {
            if (status == 'applied') {
              const isDisqualified = oneItem.nativeElement.getAttribute('ng-reflect-disqualified')

              console.log("what is isDisqualified in onMve ", isDisqualified);
              if (isDisqualified == "false") {
                this.disqualify = "Disqualify";
              }
              else if (isDisqualified == "true") {
                this.disqualify = "Requalify";
              }
              this.showOptionsDisqualified = true;
              console.log("value if global disqualify is", this.disqualify);
            }
            else if (status == 'offered') {
              this.showOptionsOffered = true;
            } else if (status == 'finalized') {
              this.showOptionsFinalized = true;
            }
          }
          oneItem.nativeElement.style.opacity = '0.5';
          this.checkDropZoneHover(currentX, currentY);
          this.cdr.detectChanges();
        },
        onEnd: ev => {
          oneItem.nativeElement.style.opacity = '1';
          const currentX = ev.currentX;
          const currentY = ev.currentY;
          console.log("end");
          this.showOptionsDisqualified = false;
          this.showOptionsOffered = false;
          this.showOptionsFinalized = false;
          // this.cdr.detectChanges();
          this.handleDrop(currentX, currentY, oneItem);
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


  // onDragStarted(event: CdkDragStart) {
  //   console.log("event is", event.source.element.nativeElement);
  //   console.log("dropzone ", this.dropzone1.nativeElement);

  //   // Access the element being dragged
  //   const element = event.source.element.nativeElement;

  //   // Set a custom zIndex (for example, 1000)
  //   element.style.zIndex = '1000';
  //   this.dropzone1.nativeElement.style.zIndex = '9999';
  // }


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

  async handleDrop(evCurrentX: number, evCurrentY: number, item: any) {

    if (!this.dropZoneDisqualify || !this.dropZoneAnswer) {
      console.error('Drop zones are not initialized yet.');
      return;
    }
    const dropZoneDisqualifyRect = this.dropZoneDisqualify.nativeElement.getBoundingClientRect();
    const dropZoneAnswerRect = this.dropZoneAnswer.nativeElement.getBoundingClientRect();


    if (this.areElementsTouching(evCurrentX, evCurrentY, dropZoneDisqualifyRect)) {
      console.log("Dropped in Drop Zone Disqualify");

      const confirm = await this.presentConfirmAlert();
      if (confirm) {
        console.log('User confirmed to proceed');
        // call toggle 
        const id = item.nativeElement.getAttribute('ng-reflect-id');
        const disqualifiedString = item.nativeElement.getAttribute('ng-reflect-disqualified');
        const disqualified = disqualifiedString === 'true';

        try {
          console.log("try call toggleDisqualify");
          this.toggleDisqualify(id, disqualified);
        }
        catch {
          console.error("failed to change the the disqualify");
        }
      } else {
        console.log('User canceled the action');
        // Handle the cancellation here
      }

    }

    if (this.areElementsTouching(evCurrentX, evCurrentY, dropZoneAnswerRect)) {
      console.log("Dropped in Drop Zone Answer");
      this.router.navigate(['/answer']);

    }
  }

  toggleDisqualify(candidateID: number, disqualified: boolean) {
    console.log("calling toggleDisqualify");
    this.disqualify = this.disqualify === 'Disqualify' ? 'Requalify' : 'Disqualify';
    const id = candidateID;
    const newDisqualified = !disqualified;
    console.log("my orignal disqualified is ", disqualified);
    console.log("my new des should beL ", newDisqualified);
    this.diqualifyChanged.emit({ id, newDisqualified });
    this.cdr.detectChanges();
  }

  async presentConfirmAlert(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirm',
        message: 'Do you want to (disqualify-requalify ) [name]?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Do nothing');
              resolve(false); // Resolve with false if "No" is clicked
            }
          },
          {
            text: 'Yes',
            handler: () => {
              resolve(true); // Resolve with true if "Yes" is clicked
            }
          }
        ]
      });

      await alert.present();
    });
  }

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