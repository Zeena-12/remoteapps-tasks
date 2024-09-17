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
import { IonModal } from '@ionic/angular';



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
  @Input() finalizedCount: number = 0;

  @Output() statusChange = new EventEmitter<{ id: number, newStatus: string }>();
  @Output() diqualifyChanged = new EventEmitter<{ id: number, newDisqualified: boolean }>();
  @Output() changeTag = new EventEmitter<void>(); // this can be used for changing the tags

  @Output() openCVModal = new EventEmitter<any>();
  @Output() dataFetched = new EventEmitter<any>();

  // disqualify: string = '';
  vacancy: any;


  selectedOption: any;
  modalContent: string = "no content";
  @ViewChild('myModal') myModal: any;
  @ViewChildren('placeholder') placeholders!: QueryList<any>;

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['finalizedCount']) {
  //     console.log('--------Updated finalizedCount-----------:', this.finalizedCount);
  //   }
  // }


  cvArray: any;
  answersArray: any;
  selectedApplicantID: any;
  selectedApplicationID: any;
  selectedApplicantType: any;

  gestureArray: Gesture[] = [];
  @ViewChildren(ProfileCardComponent, { read: ElementRef }) items!: QueryList<ElementRef>;


  onStatusChange(event: { id: number, newStatus: string }) {
    this.statusChange.emit(event);
    console.log("calling onStatusChange");
  }
  onDiqualifyChanged(event: { id: number, newDisqualified: boolean }) {
    this.diqualifyChanged.emit(event);
  }


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
    this.vacancy = this.vacanciesService.getVacancy();
    console.log("vacancy details from status box ", this.vacancy);
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
      console.log("vacancy opening are ", this.vacancy.NoOpenings);
      console.log("vacancy employeeList length ", this.employeesList.length);
      console.log(" status ", this.status);
    }
    const newStatus = this.status;
    // Update the count of finalized items if status is 'Finalized'

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
        mode: 'ios',
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
  // i know its long but just keep it for now as it is -- NO its not bad because the efficiency is O(1) if 
  async openActionSheet(candidate: any) {

    console.log("????????? what is the candidate ???????????? : ", candidate);
    let options: any = [];
    this.selectedApplicantID = candidate.ApplicantID;
    this.selectedApplicationID = candidate.ApplicationID; 
    this.selectedApplicantType = candidate.ApplicantType;


    if ((candidate.Status == 'Applied' || candidate.Status == 'Shortlisted') && (this.finalizedCount < this.vacancy.NoOpenings)) {
      options = [
        { label: 'Open CV', iconClass: 'icon-document-person' },
        { label: 'Regret', iconClass: 'icon-envelope' },
        { label: candidate.Disqualified ? 'Requalify' : 'Disqualify', iconClass: candidate.Disqualify ? 'icon-thumb-up-3' : 'icon-thumb-up-3' },
        { label: 'View Tests', iconClass: 'icon-document-list-true-false' },
        { label: 'View Answers', iconClass: 'icon-signed-document' },
      ];
    }
    else if ((candidate.Status == 'Applied' || candidate.Status == 'Shortlisted') && (this.finalizedCount >= this.vacancy.NoOpenings)) {
      options = [
        { label: 'Open CV', iconClass: 'icon-document-person' },
        { label: 'Regret', iconClass: 'icon-envelope' },
        { label: 'View Tests', iconClass: 'icon-document-list-true-false' },
        { label: 'View Answers', iconClass: 'icon-signed-document' },
      ];
    }
    else if (candidate.Status == 'Interviewed') {
      options = [
        { label: 'Open CV', iconClass: 'icon-document-person' },
        { label: 'Regret', iconClass: 'icon-envelope' },
        { label: 'View Interviews', iconClass: 'icon-calendar-6' },
        { label: 'View Tests', iconClass: 'icon-document-list-true-false' },
        { label: 'View Answers', iconClass: 'icon-signed-document' },
      ];
    }
    else if (candidate.Status == 'Offered') {
      options = [
        { label: 'Open CV', iconClass: 'icon-document-person' },
        { label: 'Accept Offer', iconClass: 'icon-check-2' },
        { label: 'Reject Offer', iconClass: 'icon-cancel-border' }, // reject offer show for Offered , finalized
        { label: 'Generate Offer', iconClass: 'icon-view-editor' },
        { label: 'Send Offer', iconClass: 'icon-envelope' },
        { label: 'Pre-Offer', iconClass: 'icon-timesheet' },
        { label: 'View Answers', iconClass: 'icon-signed-document' },
        { label: 'View interviews', iconClass: 'icon-calendar-6' },
        { label: 'View Tests', iconClass: 'icon-document-list-true-false' },
      ];
    }
    else if (candidate.Status == 'offered-rejected') {
      options = [
        { label: 'Open CV', iconClass: 'icon-document-person' },
        { label: 'Accept Offer', iconClass: 'icon-check-2' },
        { label: 'Generate Offer', iconClass: 'icon-view-editor' },
        { label: 'Send Offer', iconClass: 'icon-envelope' },
        { label: 'Pre-Offer', iconClass: 'icon-timesheet' },
        { label: 'View Answers', iconClass: 'icon-signed-document' },
        { label: 'View interviews', iconClass: 'icon-calendar-6' },
        { label: 'View Tests', iconClass: 'icon-document-list-true-false' },
        { label: 'Print Offer', iconClass: 'icon-document-list-true-false' }, // only for finalized
      ];
    }
    else if (candidate.Status == 'Finalized' && candidate.Finalized == false && candidate.OnBoardingCompleted == false) {
      options = [
        { label: 'Open CV', iconClass: 'icon-document-person' },
        { label: 'Finalized', iconClass: 'icon-check-2' },
        { label: 'Print Offer', iconClass: 'icon-document-list-true-false' }, // only for finalized
        { label: 'Reject Offer', iconClass: 'icon-cancel-border' }, // reject offer show for Offered , finalized
        { label: 'View Answers', iconClass: 'icon-signed-document' },
        { label: 'View interviews', iconClass: 'icon-calendar-6' },
        { label: 'View Tests', iconClass: 'icon-document-list-true-false' },
      ];
    }
    else if (candidate.Status == 'Finalized' && candidate.Finalized == false && candidate.OnBoardingCompleted == false) {
      options = [
        { label: 'Open CV', iconClass: 'icon-document-person' },
        { label: 'Finalized', iconClass: 'icon-check-2' },
        { label: 'Reject Offer', iconClass: 'icon-cancel-border' }, // reject offer show for Offered , finalized
        { label: 'Print Offer', iconClass: 'icon-document-list-true-false' }, // only for finalized
        { label: 'View Answers', iconClass: 'icon-signed-document' },
        { label: 'View interviews', iconClass: 'icon-calendar-6' },
        { label: 'View Tests', iconClass: 'icon-document-list-true-false' },
      ];
    }
    else if (candidate.Status == 'Finalized' && candidate.Finalized == true && candidate.OnBoardingCompleted == false) {
      options = [
        { label: 'Open CV', iconClass: 'icon-document-person' },
        { label: 'Print Offer', iconClass: 'icon-document-list-true-false' }, // only for finalized
        { label: 'View Answers', iconClass: 'icon-signed-document' },
        { label: 'View interviews', iconClass: 'icon-calendar-6' },
        { label: 'View Tests', iconClass: 'icon-document-list-true-false' },
      ];
    }
    else if (candidate.Status == 'Offer-Sent') {
      options = [
        { label: 'Open CV', iconClass: 'icon-document-person' },
        { label: 'Accept Offer', iconClass: 'icon-check-2' },
        { label: 'Generate Offer', iconClass: 'icon-view-editor' },
        { label: 'Generate Offer', iconClass: 'icon-view-editor' },
        { label: 'Send Offer', iconClass: 'icon-envelope' },
        { label: 'Pre-Offer', iconClass: 'icon-timesheet' },
        { label: 'View Answers', iconClass: 'icon-signed-document' },
        { label: 'View interviews', iconClass: 'icon-calendar-6' },
        { label: 'View Tests', iconClass: 'icon-document-list-true-false' },
      ];
    }


    const modal = await this.modalController.create({
      component: ActionSheetComponent,
      componentProps: {
        options: options,
        optionSelected: (option: any) => this.handleOptionSelected(option, modal)
      },
      cssClass: 'custom-modal',
      backdropDismiss: true,
    });

    return await modal.present();
  }




  async handleOptionSelected(option: any, modal: HTMLIonModalElement) {
    console.log('Selected Option in function handleOptionSelected :', option.label);
    const ApplicantID = this.selectedApplicantID;
    const ApplicationID = this.selectedApplicationID;
    const ApplicantType = this.selectedApplicantType;

    if (!ApplicantID) {
      console.error('No candidate ID selected');
      return;
    }
    await modal.dismiss();
    try {
      let disqualifyReason: string | undefined;
      let details;

      switch (option.label) {
        case 'Open CV':
          console.log("############### candidate id and type: ", ApplicantID, " ", ApplicantType);
          this.getCandidateDetails(ApplicantID, ApplicantType)
            .then((details) => {
              this.dataFetched.emit(this.cvArray);
            })
          break;

        case 'View Answers':
          details = await this.vacanciesService.getApplicationQuestionAnswer(ApplicantID);
          this.answersArray = details;
          console.log("Array name is answers and the details", this.answersArray);
          break;

        case 'Disqualify':
          const disqualifyReason = await this.alertForDisqualificationReason();
          console.log("reason is ", disqualifyReason);
          if (disqualifyReason !== undefined) {
            await this.vacanciesService.ChangeDisqualifiedStatus(ApplicationID, true, disqualifyReason);
            console.log("Disqualification processed.");
            this.changeTag.emit();
          } else {
            console.log('Disqualification was canceled.');
          }
          break;

        case 'Requalify':
          details = await this.vacanciesService.ChangeDisqualifiedStatus(ApplicationID, false, '');
          this.changeTag.emit();
          console.log("Requalification", details);
          break;


        case 'Accept Offer' :
          details = await this.vacanciesService.acceptOffer(ApplicationID);
          this.changeTag.emit();
        break;

        case 'Reject Offer' :
          details = await this.vacanciesService.rejectOffer(ApplicationID);
          this.changeTag.emit();
        break;

        default:
          console.error('Unsupported option selected');
          return;
      }

    } catch (error) {
      console.error('Error fetching candidate details:', error);
    }
  }

  async alertForDisqualificationReason(): Promise<string | undefined> {
    const alert = await this.alertController.create({
      header: 'Disqualification Reason',
      mode: 'ios',
      inputs: [
        {
          name: 'reason',
          type: 'textarea',
          placeholder: '',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => undefined
        },
        {
          text: 'Save',
          handler: (data) => data.reason || undefined
        }
      ]
    });

    await alert.present();
    const { data } = await alert.onDidDismiss();
    return data?.values?.reason || undefined;
  }





  dismissModal() {
    // Implement dismiss logic here (e.g., close the modal)
    console.log('Modal dismissed for select option ############################');
    this.modalController.dismiss();
  }

  getCandidateDetails(id: number, type: string): Promise<any> {
    console.log("from getCandidateDetails ", id);

    return this.applicantService.getApplicantCV(id, type)
      .then((candidateDetails: any) => {
        this.cvArray = candidateDetails;
        console.log("Array name is cv and the details ", this.cvArray);

        console.log('Candidate Details:', candidateDetails);
        // Emit the event with the fetched data
        this.openCVModal.emit(candidateDetails);
        return candidateDetails;
      })
      .catch((error: any) => {
        console.error('Error fetching candidate details:', error);
        return null;
      });
  }


}

interface Option {
  label: string;
  iconClass: string;
  status?: string | string[]; // Status or array of statuses for which this option is available
  onlyIf?: (candidate: Candidate) => boolean; // Optional function to determine if the option should be shown
}

interface Candidate {
  Status: string;
  Finalized: boolean;
  OnBoardingCompleted: boolean;
}