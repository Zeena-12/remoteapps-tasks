import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicantService } from '../services/applicant/applicant.service';
import { ModalController } from '@ionic/angular';
import { CvComponent } from '../../app/custom-components/cv/cv.component';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.page.html',
  styleUrls: ['./applicants.page.scss'],
})
export class ApplicantsPage implements OnInit {
  EditForm!: FormGroup;
  AddApplicantForm!: FormGroup;

  applicantsList: any[] = []; // Array to hold the list of applicants
  errorMessage: string | null = null;

  //there are so many lists comming from API getEmployeeCV, getApplicantCV i will put each in a list
  ApplicantProfile: ApplicantProfile | null = null; // Adjust type if needed
  ApplicantionList: any[] = [];
  CertificateList: any[] = [];
  CourseList: any[] = [];
  DocumentList: any[] = [];
  ExperienceList: any[] = [];
  LanguagesList: any[] = [];
  ProjectExperienceList: any[] = [];
  QualificationList: any[] = [];
  SkillList: any[] = [];

  @ViewChild('EditModal') EditModal: any;
  @ViewChild('AddExperienceModal') AddExperienceModal: any;
  @ViewChild('AddApplicantModal') AddApplicantModal: any;

  selectedGender: number | null = null;
  selectedMaritalStatus: number | null = null;

  constructor(private applicantService: ApplicantService,
    private modalController: ModalController,
    private formbuilder: FormBuilder
  ) {

  }
  SubmitEdit(val: any) {
    if (this.EditForm.valid) {
      console.log('#### edit Successful###', val);
      this.applicantService.setApplicant(val);
    }
    else {
      console.log('#### edit NOT Successful###', val);
      // SHOW ALERT ERROR
    }
  }

  SubmitAddApplicant(val: any) {
    if (this.AddApplicantForm.valid) {
      console.log('#### add Successful###', val);
      this.applicantService.setApplicant(val);
    }
    else {
      console.log('#### add NOT Successful###', val);
      // SHOW ALERT ERROR
    }
  }

  ngOnInit() {
    console.log("oninit");
    this.loadApplicantData();
    this.initializeEditForm();
    this.initializeAddForm();
  }

initializeEditForm() {
  this.EditForm = this.formbuilder.group({
    Picture: [''],
    ApplicantID: [''],
    FirstName: [''],
    LastName: [''],
    Gender: ['', [Validators.required]],
    DateOfBirth: ['', [Validators.required]],
    MaritalStatus: ['', [Validators.required]],
    NumberOfDependent: ['', [Validators.required]],
    Nationality: ['', [Validators.required]],
    ResidenceCountry: ['', [Validators.required]],
    NationalIdentity: ['', [Validators.required]],
    Passport: ['', [Validators.required]],
    Currency: [''],
    CurrentSalary: [''],
    TargetSalary: [''],
    LandLine: [''],
    Mobile: ['', [Validators.required]],
    Email: ['', [Validators.required, Validators.email]],
    IsPreviousEmployee: [''],
    EmployeeID: [''],
    SpecializationID: ['']
  });
}

initializeAddForm() {
  this.AddApplicantForm = this.formbuilder.group({
    Picture: [''],
    FirstName: [''],
    LastName: [''],
    Gender: [null],
    DateOfBirth: ['', [Validators.required]],
    MaritalStatus: ['', [Validators.required]],
    NumberOfDependent: [null],
    Nationality: ['', [Validators.required]],
    ResidenceCountry: ['', [Validators.required]],
    NationalIdentity: ['', [Validators.required]],
    Passport: ['', [Validators.required]],
    Currency: [''],
    CurrentSalary: [''],
    TargetSalary: [''],
    LandLine: [''],
    Mobile: ['', [Validators.required]],
    Email: ['', [Validators.required, Validators.email]],
    IsPreviousEmployee: [''],
    EmployeeID: [''],
    SpecializationID: ['']
  });
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
      // save profiel data into interface profile
      if (this.ApplicantProfile) {
        this.EditForm.patchValue({ //why to use patchValue not setValue? bcz not all data need to change
          NationalIdentity: this.ApplicantProfile.NationalIdentity,
          NationalityName: this.ApplicantProfile.Nationality,
          Passport: this.ApplicantProfile.Passport,
          GenderName: this.ApplicantProfile.Gender,
          MaritalStatusName: this.ApplicantProfile.MaritalStatus,
          NumberOfDependents: this.ApplicantProfile.NumberOfDependent,
          DateOfBirth: this.ApplicantProfile.DateOfBirth,
          ResidenceCountryName: this.ApplicantProfile.ResidenceCountry,
          Mobile: this.ApplicantProfile.Mobile,
          Email: this.ApplicantProfile.Email
        });
      }

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

  openModalEdit(applicantID: any) {
    console.log("callig modal openModalEDit and the id is", applicantID);
    this.EditModal.present();
  }
  openModalAddExperience(applicantID: any) {
    console.log("callig modal openModalEDit and the id is", applicantID);
    this.AddExperienceModal.present();
  }

  OpenModalAddApplicant(){
    this.AddApplicantModal.present();
  }
  selectGender(value: number) {
    this.selectedGender = value;
    const genderControl = this.AddApplicantForm.get('Gender');
    if (genderControl) {
      genderControl.setValue(value);
    }
  }
  selectMaritalStatus(value: number) {
    this.selectedMaritalStatus = value;
    const maritalStatusControl = this.AddApplicantForm.get('MaritalStatus');
    if (maritalStatusControl) {
      maritalStatusControl.setValue(value);
    }
  }

  
}

export interface ApplicantProfile {
  Picture?: string;
  FirstName: string;
  LastName: string;
  Gender: number;
  DateOfBirth: string;
  MaritalStatus: number;
  NumberOfDependent: number;
  Nationality: number;
  ResidenceCountry: number;
  NationalIdentity: string;
  Passport: string;
  Currency: number;
  CurrentSalary: number;
  TargetSalary: number;
  LandLine: string;
  Mobile: string;
  Email: string;
  IsPreviousEmployee: boolean;
  EmployeeID: number;
  SpecializationID: number;
}




