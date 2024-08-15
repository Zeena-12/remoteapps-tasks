import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApplicantService } from 'src/app/services/applicant/applicant.service';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss'],
})
export class CvComponent implements OnInit {
  @Input() applicantID: any;

  ApplicantProfile: any[] = [];
  ApplicantionList: any[] = [];
  QualificationList: any[] = [];




  constructor(private modalController: ModalController, private applicantService: ApplicantService) { }

  ngOnInit() {
    // if (this.applicantID) {
    //   this. applicantCVData = this.applicantService.getApplicantCV(this.applicantID);
    //   console.log(this.applicantCVData);
    // }
    // this.loadCVData();
  }


  // async loadCVData() {
  //   if (this.applicantID) {
  //     try {
  //       const response = await this.applicantService.getApplicantCV(this.applicantID);
  //       this.ApplicantProfile = response.ApplicantProfile;
  //       this.QualificationList = response.QualificationList;
  //       console.log(response);

  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }
  // }




  close() {
    this.modalController.dismiss();
  }

}
