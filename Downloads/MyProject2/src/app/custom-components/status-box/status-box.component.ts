import { Component, ChangeDetectorRef, Input, Output, ViewChildren, QueryList, OnChanges, SimpleChanges, Directive, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem, CdkDragPlaceholder, CdkDrag, CdkDropListGroup, CdkDropList, moveItemInArray, CdkDragStart, CdkDragPreview } from '@angular/cdk/drag-drop';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { Gesture, GestureController } from '@ionic/angular';
import { Candidate, CandidateStatusService } from 'src/app/candidate-status.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ActionSheetComponent } from '../action-sheet/action-sheet.component';
import { LongPressDirective } from 'src/app/directives/long-press/long-press.directive';
import { CustomModelComponent } from '../custom-model/custom-model.component';


@Component({
  selector: 'app-status-box',
  templateUrl: './status-box.component.html',
  styleUrls: ['./status-box.component.scss'],
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, CdkDropListGroup, CdkDragPreview],
  // directives: [LongPressDirective] // Declare your directive here
})
export class StatusBoxComponent implements OnInit, AfterViewInit {

  @Input() id: string = '';
  @Input() status: string = '';
  @Input() employeesList: any[] = [];
  @Input() containerColor: string = '';

  @Output() statusChange = new EventEmitter<{ id: number, newStatus: string }>();
  @Output() diqualifyChanged = new EventEmitter<{ id: number, newDisqualified: boolean }>();


  disqualify: string = '';


selectedOption: any;
modalContent: string = "no content";
@ViewChild('myModal') myModal: any;



  gestureArray: Gesture[] = [];
  @ViewChildren(ProfileCardComponent, { read: ElementRef }) items!: QueryList<ElementRef>;


  onStatusChange(event: { id: number, newStatus: string }) {
    this.statusChange.emit(event);
  }
  onDiqualifyChanged(event: { id: number, newDisqualified: boolean }) {
    this.diqualifyChanged.emit(event);
  }

  employeesList2: any[] = []; // Initialize as empty array



  item: any = { /* Initialize with your item properties */ };

  constructor(
    private gestureCtrl: GestureController,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {

  }

  ngOnInit() {

    console.log();
  }

  ngAfterViewInit() {
  }



  drop(event: CdkDragDrop<any[]>, target: string) {
    console.log("calling drop in status");
    // Reset all options to false first

    const draggedElement = event.item.element.nativeElement;



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
      const profileCard = draggedElement.querySelector('app-profile-card');
      if (profileCard) {
        profileCard.setAttribute('status', newStatus);
        const id = Number(profileCard.getAttribute('ng-reflect-id'));
        // console.log("id is: ", id);
        this.statusChange.emit({ id, newStatus });
      }
    }
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

  async openActionSheet(status: string) {
    let options: any = [];

    if (status === 'applied' || status === 'shortlisted' || status === 'interviewed') {
      options = [
        { label: 'Open CV', icon: '/assets/calendar.svg' },
        { label: 'Disqualify', icon: '/assets/calendar.svg' },
        { label: 'Regret', icon: '/assets/calendar.svg' },
        { label: 'View Tests', icon: '/assets/calendar.svg' },
        { label: 'View Answers', icon: '/assets/calendar.svg' },
      ];
    }

    if (status === 'offered' || status === 'finalized') {
      options = [
        { label: 'Open CV', icon: '/assets/calendar.svg' },
        { label: 'Accept Offer', icon: '/assets/calendar.svg' },
        { label: 'Reject Offer', icon: '/assets/calendar.svg' },
        { label: 'Generate Offer', icon: '/assets/calendar.svg' },
        { label: 'Send Offer', icon: '/assets/calendar.svg' },
        { label: 'Pre-Offer', icon: '/assets/calendar.svg' },
        { label: 'View Answers', icon: '/assets/calendar.svg' },
        { label: 'View interviews', icon: '/assets/calendar.svg' },
        { label: 'View Tests', icon: '/assets/calendar.svg' },
      ];
    }

    const modal = await this.modalController.create({
      component: ActionSheetComponent,
      componentProps: {
        options: options,
        optionSelected: this.handleOptionSelected.bind(this)
      },
      cssClass: 'custom-modal', // Optional: Add custom CSS class for styling
      backdropDismiss: true, // Optional: Close modal on backdrop click
    });

    return await modal.present();
  }

  handleOptionSelected(option: any) {
    console.log('Selected Option:', option.label);
    // Implement logic for option selection here
    switch (option.label) {
      case 'Open CV':
        this.openModal('cv-modal');
        break;
      case 'View Answers':
        this.openModal('answers-modal');
        break;
      case 'Regret':
        
        break;

      default:
        break;
    }
    if (this.myModal) {
      this.myModal.open();
    }

    // Optionally, dismiss the action sheet after an option is selected
    this.dismissModal();
  }

  async openModal(modalId: string) {
    const modal = document.getElementById(modalId) as HTMLIonModalElement;
    if (modal) {
      await modal.present();
    } else {
      console.error(`Modal with ID ${modalId} not found.`);
    }
  }

  dismissModal() {
    // Implement dismiss logic here (e.g., close the modal)
    console.log('Modal dismissed');
    this.modalController.dismiss();
  }

  openCV() {
    console.log("Open CV from open CV");
    // this.openModal();
  }


  // async openModal() {
  //   const modal = await this.modalController.create({
  //     component: CustomModelComponent,
  //     // cssClass: 'custom-modal-class', // Optional: Add custom CSS class for styling
  //     backdropDismiss: true, // Optional: Close modal on backdrop click
  //   });
  //   await modal.present();
  // }
}