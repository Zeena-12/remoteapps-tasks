import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CandidateStatusService, Candidate } from '../candidate-status.service';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ActionSheetComponent } from '../custom-components/action-sheet/action-sheet.component';


@Component({
  selector: 'app-fourth',
  templateUrl: './fourth.page.html',
  styleUrls: ['./fourth.page.scss']
})
export class FourthPage implements OnInit, AfterViewInit {
  applied: Candidate[] = [];
  shortlisted: Candidate[] = [];
  interviewed: Candidate[] = [];
  offered: Candidate[] = [];
  finalized: Candidate[] = [];

  cvData: any = null;
  answersData: any[] = [];

  constructor(private candidateService: CandidateStatusService,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.loadCandidates();
  }

  ngAfterViewInit(): void {
console.log()
  }

  loadCandidates() {
    this.candidateService.getCandidateList().subscribe((data: Candidate[]) => {
      const itemsByStatus: { [key: string]: Candidate[] } = {
        applied: [],
        shortlisted: [],
        interviewed: [],
        offered: [],
        finalized: []
      };

      // Group items by status
      data.forEach(item => {
        const { status } = item;
        if (itemsByStatus.hasOwnProperty(status)) {
          itemsByStatus[status].push(item);
        }
      });

      // Assign to respective arrays
      this.applied = itemsByStatus['applied'];
      this.shortlisted = itemsByStatus['shortlisted'];
      this.interviewed = itemsByStatus['interviewed'];
      this.offered = itemsByStatus['offered'];
      this.finalized = itemsByStatus['finalized'];
    });
  }

  handleStatusChange(event: { id: number,newStatus: string }) {
    this.candidateService.updateCandidateStatus(event.id,event.newStatus).subscribe(() => {
      this.loadCandidates();
    });
    // console.log("calling handleStatusChange in fourth");
  }

  handleDisqualifyChange(event: { id: number,newDisqualified: boolean }) {
    this.candidateService.updateCandidateDisqualified(event.id,event.newDisqualified).subscribe(() => {
      this.loadCandidates();
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
      console.log("from inside ",  this.cvData);
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


div(){
  console.log("wooooow well done");
  alert("ggg");
}

swiperSlideChanged(e: any){
  console.log('change:', e);
}

}


// https://chatgpt.com/share/ed776c59-1eaa-4ebe-b6c0-2a64f54042d4