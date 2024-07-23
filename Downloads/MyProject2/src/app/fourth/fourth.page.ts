import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CandidateStatusService, Candidate } from '../candidate-status.service';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';


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

  constructor(private candidateService: CandidateStatusService,
    private alertController: AlertController
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
    console.log("calling handleStatusChange in fourth");
  }

  handleDisqualifyChange(event: { id: number,newDisqualified: boolean }) {
    this.candidateService.updateCandidateDisqualified(event.id,event.newDisqualified).subscribe(() => {
      this.loadCandidates();
    });
    console.log("calling handleDisqualifyChange in fourth");
  }

  async presentAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }



  // long press
  onLongPress() {
    this.presentAlert('Long press event triggered');
    console.log("long press");
    // Handle the long press event here
  }
}


// https://chatgpt.com/share/ed776c59-1eaa-4ebe-b6c0-2a64f54042d4