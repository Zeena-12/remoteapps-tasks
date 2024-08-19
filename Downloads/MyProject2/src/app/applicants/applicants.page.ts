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

    //there are so many lists comming from API getEmployeeCV, getApplicantCV i will put each in a list
    ApplicantProfile: any[] = [];
    ApplicantionList: any[] = [];
    CertificateList: any[] = [];
    CourseList: any[] = [];
    DocumentList: any[] = [];
    ExperienceList: any[] = [];
    LanguagesList: any[] = [];
    ProjectExperienceList: any[] = [];
    QualificationList: any[] = [];
    SkillList: any[] = [];

  constructor(private applicantService: ApplicantService, private modalController: ModalController) { }

  ngOnInit() {
    console.log("oninit");
    this.loadApplicantData();
  }

  async loadApplicantData() {
    try {
      const response = await this.applicantService.getApplicantData();
      this.applicantsList = response.ApplicantList;
      console.log(this.applicantsList);
    } catch (error) {
      this.errorMessage = 'Failed to load applicant data.';
      console.error('Error loading applicant data:', error);
    }
  }



  async openModalCV(applicantID: any) {
    try {
      // Call the service method to get the CV data
      const result = await this.applicantService.getApplicantCV(applicantID, 'A');
      console.log("Data retrieved successfully:", result);
      this.ApplicantProfile = result.ApplicantProfile;
      this.ApplicantionList = result.ApplicantionList;
      this.ExperienceList = result.ExperienceList;
      this.QualificationList = result.QualificationList;
      this.CertificateList = result.CertificateList;
  
      // Now open the modal
      const modalId = 'cv-modal'; // Hardcoded modal ID
      console.log("Attempting to open modal with ID:", modalId);
      const modal = document.getElementById(modalId) as HTMLIonModalElement | null;
  
      if (modal) {
        await modal.present();
      } else {
        console.log(`Modal with ID ${modalId} not found.`);
      }
    } catch (error) {
      console.error('Error during data retrieval or modal opening:', error);
    }
  }

  openModalEdit(applicantID: any){
    console.log("callig modal openModalEDit and the id is", applicantID);
  }
  


  

}
