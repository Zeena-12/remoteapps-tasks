import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CandidateStatusService } from '../candidate-status.service';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ActionSheetComponent } from '../custom-components/action-sheet/action-sheet.component';
import { catchError, of } from 'rxjs';


@Component({
  selector: 'app-fourth',
  templateUrl: './fourth.page.html',
  styleUrls: ['./fourth.page.scss']
})
export class FourthPage implements OnInit, AfterViewInit {

  // candidates$ = this.candidateService.getCandidateList();
  candidates: any[] = [];

  Applied: any[] = [];
  Shortlisted: any[] = [];
  Interviewed: any[] = [];
  Offered: any[] = [];
  Finalized: any[] = [];

  cvData: any = null;
  answersData: any[] = [];

  constructor(private candidateService: CandidateStatusService,
    private alertController: AlertController,
    private modalController: ModalController,
  ) { }


  ngOnInit() {
    //  this.loadCandidates();
    // this.candidateService.getCandidateList().pipe(
    //   catchError(error => {
    //     console.error('Error fetching data', error);
    //     return of([]); // Return an empty array in case of error
    //   })
    // ).subscribe(data => {
    //   console.log(data);
    //   this.candidates = data;
    //   console.log("data found", this.candidates);
    // });
    // this.loadCandidates(); 
    this.loadCandidatesFake();

  }


  ngAfterViewInit(): void {
    console.log()
  }
  async loadCandidatesFake() {
    try {
      const result = await this.candidateService.getApplicantData();
      console.log('Result from getApplications:', result);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }
  

  // loadCandidates() {
  //   this.candidateService.getCandidateList().subscribe((data: any[]) => {
  //     const itemsByStatus: { [key: string]: any[] } = {
  //       Applied: [],
  //       Shortlisted: [],
  //       Interviewed: [],
  //       Offered: [],
  //       Finalized: [],
  //     };

  //     // Group items by status
  //     data.forEach(item => {
  //       const status = item.Status; // Use status as it is, with the first letter capitalized
  //       if (itemsByStatus.hasOwnProperty(status)) {
  //         itemsByStatus[status].push(item);
  //       }
  //     });

  //     // Assign to respective arrays
  //     this.Applied = itemsByStatus['Applied'];
  //     this.Shortlisted = itemsByStatus['Shortlisted'];
  //     this.Interviewed = itemsByStatus['Interviewed'];
  //     this.Offered = itemsByStatus['Offered'];
  //     this.Finalized = itemsByStatus['Finalized'];
  //   });
  //   console.log("list applied: ", this.Applied);
  // }
  // loadCandidates() {
  //   this.candidateService.getApplications().pipe(
  //     catchError(error => {
  //       console.error('Error fetching data', error);
  //       return of([]); // Return an empty array in case of error
  //     })
  //   ).subscribe(data => {
  //     console.log('Raw response from getApplications in loadCandidates :', data[0]); // Log raw data
      
  //     const itemsByStatus: { [key: string]: any[] } = {
  //       Applied: [],
  //       Shortlisted: [],
  //       Interviewed: [],
  //       Finalized: [],
  //       Offered: []
  //     };
  
  //     // Check if the data is an array
  //     if (Array.isArray(data)) {
  //       // Group items by status
  //       data.forEach(item => {
  //         const status = item.Status; // Use status as it is
  //         console.log("one item ,", item);
  //         if (itemsByStatus.hasOwnProperty(status)) {
  //           itemsByStatus[status].push(item);
  //         }
  //       });
  
  //       // Assign to respective arrays
  //       this.Applied = itemsByStatus['Applied'];
  //       this.Shortlisted = itemsByStatus['Shortlisted'];
  //       this.Interviewed = itemsByStatus['Interviewed'];
  //       this.Finalized = itemsByStatus['Finalized'];
  //       this.Offered = itemsByStatus['Offered'];
  
  //       console.log("Applied list:", this.Applied);
  //       console.log("Shortlisted list:", this.Shortlisted);
  //       console.log("Interviewed list:", this.Interviewed);
  //       console.log("Finalized list:", this.Finalized);
  //       console.log("Offered list:", this.Offered);
  //     } else {
  //       console.warn('Unexpected data format:', data);
  //     }
  //   });
  // }
  // loadCandidates() {
  //   this.candidateService.getApplications().pipe(
  //     catchError(error => {
  //       console.error('Error fetching data', error);
  //       return of([]); // Return an empty array in case of error
  //     })
  //   ).subscribe(data => {
  //     // Initialize status groups
  //     const itemsByStatus: { [key: string]: any[] } = {
  //       Applied: [],
  //       Shortlisted: [],
  //       Interviewed: [],
  //       Finalized: [],
  //       Offered: []
  //     };
  
  //     if (Array.isArray(data)) {
  //       // Group items by status
  //       data.forEach(item => {
  //         console.log("Processing item: ", item); // Log each item being processed
  //         const status = item.Status; // Use status as it is
  //         if (itemsByStatus.hasOwnProperty(status)) {
  //           itemsByStatus[status].push(item);
  //         } else {
  //           console.warn(`Status "${status}" is not recognized and will be ignored.`);
  //         }
  //       });
  
  //       // Assign to respective arrays
  //       this.Applied = itemsByStatus['Applied'];
  //       this.Shortlisted = itemsByStatus['Shortlisted'];
  //       this.Interviewed = itemsByStatus['Interviewed'];
  //       this.Finalized = itemsByStatus['Finalized'];
  //       this.Offered = itemsByStatus['Offered'];
  
  //       // console.log("Applied List: ", this.Applied);
  //       // console.log("Shortlisted List: ", this.Shortlisted);
  //       // console.log("Interviewed List: ", this.Interviewed);
  //       // console.log("Finalized List: ", this.Finalized);
  //       // console.log("Offered List: ", this.Offered);
  //     } else {
  //       console.error('Data is not an array:', data);
  //     }
  //   });
  // }
   


  handleStatusChange(event: { id: number, newStatus: string }) {
    this.candidateService.updateCandidateStatus(event.id, event.newStatus).subscribe(() => {
      // this.loadCandidates();
    });
    // console.log("calling handleStatusChange in fourth");
  }

  handleDisqualifyChange(event: { id: number, newDisqualified: boolean }) {
    this.candidateService.updateCandidateDisqualified(event.id, event.newDisqualified).subscribe(() => {
      // this.loadCandidates();
    });
    // console.log("calling handleDisqualifyChange in fourth");
  }

  async presentAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }



  handleOpenModalEvent(event: { type: string, data: any }) {
    console.log('Received event:', event);
    if (event.type === 'cv') {
      this.cvData = event.data;
      console.log("from inside ", this.cvData);
      this.openModal('cv-modal');

    } else if (event.type === 'answers') {
      this.answersData = event.data;
      this.openModal('answers-modal');
    }
  }

  async openModal(modalId: string) {
    console.log("from inside openModel ", this.cvData);
    const modal = document.getElementById(modalId) as HTMLIonModalElement;
    if (modal) {
      await modal.present();
    } else {
      console.log(`Modal with ID ${modalId} not found.`);
    }
  }

  dismissModal() {
    // Implement dismiss logic here (e.g., close the modal)
    console.log('Modal dismissed for select option');
    this.modalController.dismiss();
  }


  div() {
    console.log("wooooow well done");
    alert("ggg");
  }

  swiperSlideChanged(e: any) {
    console.log('change:', e);
  }

}
