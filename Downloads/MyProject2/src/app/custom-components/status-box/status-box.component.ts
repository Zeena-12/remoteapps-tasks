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
export class StatusBoxComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() id: string = '';
  @Input() status: string = '';
  @Input() employeesList: any[] = [];
  @Input() containerColor: string = '';
  @Input() finalizedCount: number = 0;

  @Output() statusChange = new EventEmitter<{ id: number, newStatus: string }>();
  @Output() diqualifyChanged = new EventEmitter<{ id: number, newDisqualified: boolean }>();

  @Output() openModalEvent = new EventEmitter<{ type: any, data: any }>();
  disqualify: string = '';
  vacancy: any;


  selectedOption: any;
  modalContent: string = "no content";
  @ViewChild('myModal') myModal: any;
  @ViewChildren('placeholder') placeholders!: QueryList<any>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['finalizedCount']) {
      console.log('--------Updated finalizedCount-----------:', this.finalizedCount);
    }
  }


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

    console.log("what is it : ", candidate.Status);
    let options: any = [];
    this.selectedCandidateId = candidate.ApplicationID;
    this.selectedCandidateType = candidate.ApplicantType;

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
        optionSelected: this.handleOptionSelected.bind(this)
      },
      cssClass: 'custom-modal', // Optional: Add custom CSS class for styling
      backdropDismiss: true, // Optional: Close modal on backdrop click
    });

    return await modal.present();
  }


  async handleOptionSelected2(option: any) {

    console.log('Selected Option:', option.label);
    const candidateId = this.selectedCandidateId;
    const candidateType = this.selectedCandidateType;

    if (!candidateId) {
      console.error('No candidate ID selected');
      return;
    }

    let actionRequested: string;

    if (option.label === 'Open CV') {
      actionRequested = 'cv';
    } else if (option.label === 'View Answers') {
      actionRequested = 'answers';
    } else if (option.label === 'Disqualify') {
      actionRequested = 'disqualify';
    } else if (option.label === 'Requalify') {
      actionRequested = 'requalify';
    } else {
      console.error('Unsupported option selected');
      return;
    }

    try {
      const details = await this.getCandidateDetails(candidateId, candidateType, actionRequested);
      console.log("**********details: ", details);
      console.log('Emitting data:', { type: actionRequested, data: details });
      this.openModalEvent.emit({ type: actionRequested, data: details });
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    }
  }

  async handleOptionSelected(option: any) {
    console.log('Selected Option:', option.label);
    const candidateId = this.selectedCandidateId;
    const candidateType = this.selectedCandidateType;

    if (!candidateId) {
      console.error('No candidate ID selected');
      return;
    }
    try {
      let disqualifyReason: string | undefined;
      let details;
  
      switch (option.label) {
        case 'Open CV':
          details = await this.applicantService.getApplicantCV(candidateId, candidateType);
          this.cvArray = details;
          console.log("Array name is cv and the details", this.cvArray);
          break;
  
        case 'View Answers':
          details = await this.applicantService.getApplicationQuestionAnswer(candidateId);
          this.answersArray = details;
          console.log("Array name is answers and the details", this.answersArray);
          break;
  
        case 'Disqualify':
          const disqualifyReason = await this.promptForDisqualificationReason();
          if (disqualifyReason !== undefined) {
            await this.ChangeDisqualifiedStatus(candidateId, false, disqualifyReason);
            console.log("Disqualification processed.");
          } else {
            console.log('Disqualification was canceled.');
          }
          break;
  
        case 'Requalify':
          details = await this.applicantService.ChangeDisqualifiedStatus(candidateId, false, '');
          console.log("Requalification", details);
          break;
  
        default:
          console.error('Unsupported option selected');
          return;
      }
  
      console.log("**********details: ", details);
      console.log('Emitting data:', { type: option.label.toLowerCase().replace(' ', '_'), data: details });
      this.openModalEvent.emit({ type: option.label.toLowerCase().replace(' ', '_'), data: details });
  
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    }
  }

  async promptForDisqualificationReason(): Promise<string | undefined> {
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
          text: 'OK',
          handler: (data) => data.reason || undefined
        }
      ]
    });

    await alert.present();
    const { data } = await alert.onDidDismiss();
    return data.reason;
  }

  async ChangeDisqualifiedStatus(id: number, status: boolean, disqualifyReason?: string): Promise<any> {
    console.log("calling ChangeDisqualifiedStatus in applicant service");

    const data: { ApplicationID: number; Status: boolean; DisqualifyReason?: string } = {
      ApplicationID: id,
      Status: status,
      ...(disqualifyReason && { DisqualifyReason: disqualifyReason }) // Conditionally add DisqualifyReason
    };

    try {
      const response = await this.applicantService.updateDisqualificationStatus(data);
      console.log("Disqualification status updated successfully", response);
      return response;
    } catch (error) {
      console.error("Error updating disqualification status:", error);
      throw error; // Rethrow or handle the error as needed
    }
  }




  dismissModal() {
    // Implement dismiss logic here (e.g., close the modal)
    console.log('Modal dismissed for select option############################');
    this.modalController.dismiss();
  }

  getCandidateDetails(id: number, type: string, requiestedAction: string): Promise<any> {
    console.log("from getCandidateDetails ", id, " ", type, " ", requiestedAction);

    return this.applicantService.getApplicantCV(id, type)
      .then((candidateDetails: any) => {
        if (requiestedAction === 'cv') {
          this.cvArray = candidateDetails;
          console.log("Array name is cv and the details ", this.cvArray);
        } else if (requiestedAction === 'answers') {
          this.answersArray = candidateDetails;
          console.log("Array name is answers and the details", this.answersArray);
        }
        console.log('Candidate Details:', candidateDetails);
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