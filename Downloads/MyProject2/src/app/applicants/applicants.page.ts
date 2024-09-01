import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicantService } from '../services/applicant/applicant.service';
import { ModalController } from '@ionic/angular';
import { CvComponent } from '../../app/custom-components/cv/cv.component';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AppServiceService } from '../services/app-service/app-service.service';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.page.html',
  styleUrls: ['./applicants.page.scss'],
})
export class ApplicantsPage implements OnInit {
  EditForm!: FormGroup;
  AddApplicantForm!: FormGroup;

  ApplicantList: any[] = []; // Array to hold the list of applicants
  ApplicantBestFitList: any[] = [];
  ApplicantBestFitDetails: any[] = [];
  errorMessage: string | null = null;
  selectedSegment: string = 'Applicants'; // Default selected segment

  // ComobBox
  ApplicantSpecializationList: any[] = [];
  MaritalStatusList: any[] = [];
  NationalityList: any[] = [];
  GenderList: any[] = [];


  objfrom = "Zeena";

  //there are so many lists comming from API getEmployeeCV, getApplicantCV i will put each in a list
  ApplicantProfile!: ApplicantProfile ;
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
    private formbuilder: FormBuilder,
    private appService: AppServiceService
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
    this.loadAppComobBoxes();
    this.initializeEditForm();
  }

  initializeEditForm() {
    console.log("what is ApplicantProfile data during the initializeEditForm ", this.ApplicantProfile)
    this.EditForm = this.formbuilder.group({
      Picture: [''],
      ApplicantID: [''],
      FirstName: [''],
      LastName: [''],
      Gender: ['', [Validators.required]],
      GenderName: ['', [Validators.required]],
      DateOfBirth: ['', [Validators.required]],
      MaritalStatusName: ['', [Validators.required]],
      NumberOfDependent: ['', [Validators.required]],
      NationalityName: ['', [Validators.required]],
      Nationality: ['', [Validators.required]],
      ResidenceCountryName: ['', [Validators.required]],
      NationalIdentity: ['', [Validators.required]],
      Passport: ['', [Validators.required]],
      CurrencyFullName: [''],
      CurrentSalary: [''],
      TargetSalary: [''],
      LandLine: [''],
      Mobile: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      IsPreviousEmployee: [],
      EmployeeID: [''],
      SpecializationName: ['']
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
      MaritalStatusName: ['', [Validators.required]],
      NumberOfDependent: [null],
      Nationality: ['', [Validators.required]],
      ResidenceCountry: ['', [Validators.required]],
      NationalIdentity: ['', [Validators.required]],
      Passport: ['', [Validators.required]],
      CurrencyFullName: [''],
      CurrentSalary: [''],
      TargetSalary: [''],
      LandLine: [''],
      Mobile: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      IsPreviousEmployee: [],
      EmployeeID: [''],
      SpecializationName: [''],
      GenderName: ['']

    });
  }


  async loadApplicantData() {
    try {
      const response = await this.applicantService.getApplicantData();

      this.ApplicantList = response.ApplicantList;
      this.ApplicantBestFitList = response.ApplicantBestFitList;
      console.log(response);

      // Extract IDs from ApplicantBestFitList
      const bestFitIds = this.ApplicantBestFitList.map(applicant => applicant.ApplicantID);

      // Filter ApplicantList based on the extracted IDs
      const applicantDetails = this.ApplicantList.filter(applicant => bestFitIds.includes(applicant.ApplicantID));

      // Include any additional data directly from ApplicantBestFitList if needed
      // For example, you might want to keep the raw data of the best fit applicants
      this.ApplicantBestFitDetails = applicantDetails.map(detail => {
        // Find additional data if needed
        const bestFitData = this.ApplicantBestFitList.find(bestFit => bestFit.ApplicantID === detail.ApplicantID);
        return {
          ...detail,
          additionalData: bestFitData // include additional data here if required
        };
      });

      console.log(this.ApplicantBestFitDetails);

    } catch (error) {
      this.errorMessage = 'Failed to load applicant data.';
      console.error('Error loading applicant data:', error);
    }
  }



  async openModalCV(applicantID: any) {
    this.initializeEditForm();
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
          FirstName: this.ApplicantProfile.FirstName,
          LastName: this.ApplicantProfile.LastName,
          NationalIdentity: this.ApplicantProfile.NationalIdentity,
          NationalityName: this.ApplicantProfile.NationalityName,
          Passport: this.ApplicantProfile.Passport,
          GenderName: this.ApplicantProfile.GenderName,
          MaritalStatusName: this.ApplicantProfile.MaritalStatusName,
          CurrentSalary: this.ApplicantProfile.CurrentSalary,
          CurrencyFullName: this.ApplicantProfile.CurrencyFullName,
          TargetSalary: this.ApplicantProfile.TargetSalary,
          NumberOfDependent: this.ApplicantProfile.NumberOfDependent,
          DateOfBirth: this.ApplicantProfile.DateOfBirth,
          ResidenceCountryName: this.ApplicantProfile.ResidenceCountryName,
          Mobile: this.ApplicantProfile.Mobile,
          Email: this.ApplicantProfile.Email,
          LandLine: this.ApplicantProfile.LandLine,
          SpecializationName: this.ApplicantProfile.SpecializationName,
          IsPreviousEmployee: this.ApplicantProfile.IsPreviousEmployee
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

  OpenModalAddApplicant() {
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
  // get the general data
  async loadAppComobBoxes() {
    try {
      const response = await this.appService.getComobBoxes();

      this.MaritalStatusList = response.MaritalStatusList;
      this.ApplicantSpecializationList = response.ApplicantSpecializationList;
      this.NationalityList = response.NationalityList;
      this.GenderList = response.GenderList;

      console.log("Comobox ",this.GenderList);

    } catch (error) {
      this.errorMessage = 'Failed to load ComobBoxes data.';
      console.error('Error loading ComobBoxes data:', error);
    }
  }


}

export interface ApplicantProfile {
  ResidenceCountryName: any;
    ApplicantID: number;
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
    GenderName: string;
    NationalityName: string;
    MaritalStatusName: string;
    CurrencyFullName: any;
    CurrentPosition: any;
    CurrentCompany: any;
    CurrentSalary: number;
    TargetSalary: number;
    LandLine: string;
    Mobile: string;
    Email: string;
    IsPreviousEmployee: boolean;
    EmployeeID: number;
    SpecializationID: number;
    SpecializationName: string;
  }


