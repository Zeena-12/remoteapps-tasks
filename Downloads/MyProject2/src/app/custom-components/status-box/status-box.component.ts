import { Component, ChangeDetectorRef, Input, Output, ViewChildren, QueryList, OnChanges, SimpleChanges, Directive, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem, CdkDragPlaceholder, CdkDrag, CdkDropListGroup, CdkDropList, moveItemInArray, CdkDragStart, CdkDragPreview } from '@angular/cdk/drag-drop';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { Gesture, GestureController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ActionSheetComponent } from '../action-sheet/action-sheet.component';
import { LongPressDirective } from 'src/app/directives/long-press/long-press.directive';
import { CustomModelComponent } from '../custom-model/custom-model.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { VacanciesService } from 'src/app/services/vacancies/vacancies.service';
import { ApplicantService } from 'src/app/services/applicant/applicant.service';


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

  @Output() openModalEvent = new EventEmitter<{ type: any, data: any }>();
  disqualify: string = '';


  selectedOption: any;
  modalContent: string = "no content";
  @ViewChild('myModal') myModal: any;
  @ViewChildren('placeholder') placeholders!: QueryList<any>;


  cvArray: any;
  answersArray: any;
  selectedCandidateId: any;
  selectedCandidateType: any;

  gestureArray: Gesture[] = [];
  @ViewChildren(ProfileCardComponent, { read: ElementRef }) items!: QueryList<ElementRef>;


  onStatusChange(event: { id: number, newStatus: string }) {
    this.statusChange.emit(event);
    console.log("calling onStatusChange");
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
    private vacanciesService: VacanciesService,
    private applicantService: ApplicantService

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
      const newStatus = this.status // Assuming you have a way to set the new status dynamically
      const profileCard = draggedElement.querySelector('app-profile-card');
      if (profileCard) {
        profileCard.setAttribute('status', newStatus);
        const id = Number(profileCard.getAttribute('ng-reflect-id'));
        console.log("id is: ", id);
        this.statusChange.emit({ id, newStatus });
      }
    }
  }


  // onDragStart(event: CdkDragStart<any>, index: number) {
  //   const draggedElement = event.source.element.nativeElement;
  //   console.log("#####calling onDragStart");

  //   // Access the placeholder by index
  //   // const placeholderElement = this.placeholders.toArray()[index]?.nativeElement;

  //   if (draggedElement) {
  //     console.log("#####calling onDragStart and item found", draggedElement);
  //     const width = draggedElement.offsetWidth;
  //     const height = draggedElement.offsetHeight;

  //     // Apply the dimensions to the placeholder
  //     draggedElement.style.width = `${width}px`;
  //     draggedElement.style.height = `${height}px`;

  //     // Add red border
  //     draggedElement.style.border = '2px dashed red';
  //   }
  // }

  

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

  async openActionSheet(candidate: any) {
    console.log("what is it : ", candidate.Status);
    let options: any = [];
    this.selectedCandidateId = candidate.ApplicantID;
    this.selectedCandidateType = candidate.ApplicantType;

    if (candidate.Status == 'Applied' || candidate.Status == 'Shortlisted' || candidate.Status == 'Interviewed') {
      options = [
        { label: 'Open CV', icon: '/assets/calendar.svg' },
        { label: 'Disqualify', icon: '/assets/calendar.svg' },
        { label: 'Regret', icon: '/assets/calendar.svg' },
        { label: 'View Tests', icon: '/assets/calendar.svg' },
        { label: 'View Answers', icon: '/assets/calendar.svg' },
      ];
    }

    if (candidate.Status == 'Offered' || candidate.Status == 'Finalized') {
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


  async handleOptionSelected(option: any) {

    console.log('Selected Option:', option.label);

    const candidateId = this.selectedCandidateId;
    const candidateType = this.selectedCandidateType;

    if (!candidateId) {
      console.error('No candidate ID selected');
      return;
    }

    let dataType: 'cv' | 'answers' | 'disqualify';

    if (option.label === 'Open CV') {
      dataType = 'cv';
    } else if (option.label === 'View Answers') {
      dataType = 'answers';
    } else if (option.label === 'Disqualify') {
      dataType = 'disqualify';
    } else {
      console.error('Unsupported option selected');
      return;
    }

    try {
      const details = await this.getCandidateDetails(candidateId, candidateType, dataType);
      console.log("**********details: ",details);
      console.log('Emitting data:', { type: dataType, data: details });
      this.openModalEvent.emit({ type: dataType, data: details });
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    }
  }


  // async openModal(modalId: string) {
  //   const modal = document.getElementById(modalId) as HTMLIonModalElement;
  //   if (modal) {
  //     await modal.present();
  //   } else {
  //     console.log(`Modal with ID ${modalId} not found.`);
  //   }
  // }

  dismissModal() {
    // Implement dismiss logic here (e.g., close the modal)
    console.log('Modal dismissed for select option############################');
    this.modalController.dismiss();
  }

  getCandidateDetails(id: number, type: string, arrayName: string): Promise<any> {
    console.log("from getCandidateDetails ", id, " ", type, " ", arrayName);
    
    return this.applicantService.getApplicantCV(id, type)
      .then((candidateDetails: any) => {
        if (arrayName === 'cv') {
          this.cvArray = candidateDetails;
          console.log("Array name is cv and the details ",this.cvArray);
        } else if (arrayName === 'answers') {
          this.answersArray = candidateDetails;
          console.log("Array name is answers and the details", this.answersArray);
        }
        console.log('Candidate Details:', candidateDetails);
        return candidateDetails;
      })
      .catch((error: any) => {
        console.error('Error fetching candidate details:', error);
        return null; // Return null if there's an error
      });
  }
  
}