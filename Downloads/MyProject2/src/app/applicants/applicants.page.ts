import { Component, OnInit } from '@angular/core';
import { ApplicantService } from '../services/applicant/applicant.service';
import { ModalController } from '@ionic/angular';
import { CvComponent } from '../../app/custom-components/cv/cv.component'; 

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.page.html',
  styleUrls: ['./applicants.page.scss'],
})
export class ApplicantsPage implements OnInit {

  applicantsList: any[] = []; // Array to hold the list of applicants
  errorMessage: string | null = null;

  constructor(private applicantService: ApplicantService, private modalController: ModalController) { }

  ngOnInit() {
    console.log("oninit");
    this.loadApplicantData();
  }

  async loadApplicantData() {
    try {
      this.applicantsList = await this.applicantService.getApplicantData();
      console.log(this.applicantsList);
    } catch (error) {
      this.errorMessage = 'Failed to load applicant data.';
      console.error('Error loading applicant data:', error);
    }
  }

  async openCV(applicantID: number) {
    const modal = await this.modalController.create({
      component: CvComponent,
      componentProps: {
        applicantID: applicantID
      },
      cssClass: 'cv-modal'
    });

    return await modal.present();
  }

}
