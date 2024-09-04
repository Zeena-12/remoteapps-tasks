import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ApplicantService } from '../services/applicant/applicant.service';
import { ModalController } from '@ionic/angular';
import { CvComponent } from '../../app/custom-components/cv/cv.component';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AppServiceService } from '../services/app-service/app-service.service';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.page.html',
  styleUrls: ['./applicants.page.scss'],
})
export class ApplicantsPage implements OnInit, AfterViewInit {
  applicantID!: any;
  EditForm!: FormGroup;
  AddApplicantForm!: FormGroup;
  AddExperienceForm!: FormGroup;

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
  CountryList: any[] = [];
  CurrencyList: any[] = [];
  IndustryList: any[] = [];



  // Object to hold the selected value
  // objfrom: { ComboBoxValueID: number; Text: string; } | undefined;


  //there are so many lists comming from API getEmployeeCV, getApplicantCV i will put each in a list
  ApplicantProfile!: ApplicantProfile;
  ApplicantionList: any[] = [];
  CertificateList: any[] = [];
  CourseList: any[] = [];
  DocumentList: any[] = [];
  ExperienceList: any[] = [];
  LanguagesList: any[] = [];
  ProjectExperienceList: any[] = [];
  QualificationList: any[] = [];
  SkillList: any[] = [];

  @ViewChild('EditApplicantModal') EditApplicantModal: any;
  @ViewChild('AddExperienceModal') AddExperienceModal: any;
  @ViewChild('AddApplicantModal') AddApplicantModal: any;

  selectedGender: number | null = null;
  selectedMaritalStatus: number | null = null;

  constructor(private applicantService: ApplicantService,
    private modalController: ModalController,
    private formbuilder: FormBuilder,
    private appService: AppServiceService,
    private alertController: AlertController
  ) {

  }
  ngAfterViewInit(): void {
    this.initializeAddExperienceForm();
  }

  async SubmitEdit(val: any) {
    if (this.EditForm.valid) {
      console.log('#### edit Successful ###', val);
      this.applicantService.setApplicant(val);
    } else {
      console.log('#### edit NOT Successful ###', val);
      const errors = this.getValidationErrors(this.EditForm);
      if (errors.length > 0) {
        await this.presentAlert(errors[0]);
      }
    }
  }

  async SubmitAddApplicant(val: any) {
    if (this.AddApplicantForm.valid) {
      console.log('#### add Successful###', val);
      this.applicantService.setApplicant(val);
    }
    else {
      console.log('#### edit NOT Successful ###', val);
      const errors = this.getValidationErrors(this.AddApplicantForm);
      if (errors.length > 0) {
        await this.presentAlert(errors[0]);
      }
    }
  }

  async SubmitAddExperienceForm(val: any) {
    console.log("id is ", this.ApplicantProfile.ApplicantID);
    this.AddExperienceForm.get('ApplicantID')?.setValue(this.ApplicantProfile.ApplicantID);
    
    if (this.AddExperienceForm.valid) {
      console.log('#### add experience Successful###', val);
      this.applicantService.setApplicantExperience(val);
    }
    else {
      console.log('#### edit NOT Successful ###', val);
    }
  }




  ngOnInit() {
    console.log("oninit");
    this.loadApplicantData();
    this.loadAppComobBoxes();
    this.initializeEditForm();
    this.initializeAddForm();
    //this.initializeAddExperienceForm();
  }





  formatDate(dateString: string): string {
    return moment(dateString).format('YYYY/MM/DD');
  }




  initializeEditForm() {
    this.EditForm = this.formbuilder.group({
      ApplicantID: [''],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Gender: ['',  [Validators.required, Validators.pattern('^[0-9]*$')]],
      GenderName: ['', [Validators.required]],
      DateOfBirth: ['2006/08/31', [Validators.required]],
      MaritalStatus: ['',  [Validators.required, Validators.pattern('^[0-9]*$')]],
      MaritalStatusName: ['', [Validators.required]],
      NumberOfDependent: ['', [Validators.required]],
      NationalityName: ['', [Validators.required]],
      Nationality: ['',  [Validators.required, Validators.pattern('^[0-9]*$')]],
      ResidenceCountry: ['',  [Validators.required, Validators.pattern('^[0-9]*$')]],
      ResidenceCountryName: ['', [Validators.required]],
      NationalIdentity: ['', [Validators.required]],
      Passport: ['', [Validators.required]],
      CurrencyFullName: [''],
      Currency: [''],
      CurrentSalary: ['', [Validators.pattern('^[0-9]*$')]],
      TargetSalary:  ['', [Validators.pattern('^[0-9]*$')]],
      LandLine: [''],
      Mobile: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      IsPreviousEmployee: [''],
      EmployeeID:['',  [ Validators.pattern('^[0-9]*$')]],
      SpecializationName: [''],
      SpecializationID:['',  [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }


  initializeAddForm() {
    this.AddApplicantForm = this.formbuilder.group({
      ApplicantID: [''],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Gender: ['',  [Validators.required, Validators.pattern('^[0-9]*$')]],
      GenderName: ['', [Validators.required]],
      DateOfBirth: ['2006/08/31', [Validators.required]],
      MaritalStatus: ['',  [Validators.required, Validators.pattern('^[0-9]*$')]],
      MaritalStatusName: ['', [Validators.required]],
      NumberOfDependent: ['', [Validators.required]],
      NationalityName: ['', [Validators.required]],
      Nationality: ['',  [Validators.required, Validators.pattern('^[0-9]*$')]],
      ResidenceCountry: ['',  [Validators.required, Validators.pattern('^[0-9]*$')]],
      ResidenceCountryName: ['', [Validators.required]],
      NationalIdentity: ['', [Validators.required]],
      Passport: ['', [Validators.required]],
      CurrencyFullName: [''],
      Currency: [''],
      CurrentSalary: ['', [Validators.pattern('^[0-9]*$')]],
      TargetSalary:  ['', [Validators.pattern('^[0-9]*$')]],
      LandLine: [''],
      Mobile: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      IsPreviousEmployee: [false, [Validators.required]],
      EmployeeID:['', [ Validators.pattern('^[0-9]*$')]],
      SpecializationName: [''],
      SpecializationID:['',  [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }


  initializeAddExperienceForm() {
    this.AddExperienceForm = this.formbuilder.group({
      ApplicantExperienceID : [''],
      ApplicantID : [''],
      CompanyName : ['', [Validators.required]],
      Position: ['', [Validators.required]],
      Location : ['', [Validators.required]],
      Industry : [435, [Validators.required]],
      StartDate : ['2024/09/30', [Validators.required]],
      EndDate : ['2024/09/30',],
      IsCurrent : [false, [Validators.required]],
      ReportingTo : ['', [Validators.required]],
      MainRole : ['', [Validators.required]],
      ReasonForLeaving : ['', [Validators.required]],
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
    this.applicantID = applicantID;
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
          ApplicantID: this.ApplicantProfile.ApplicantID,
          FirstName: this.ApplicantProfile.FirstName,
          LastName: this.ApplicantProfile.LastName,
          NationalIdentity: this.ApplicantProfile.NationalIdentity,
          Nationality: this.ApplicantProfile.Nationality,
          NationalityName: this.ApplicantProfile.NationalityName,
          Passport: this.ApplicantProfile.Passport,
          Gender: this.ApplicantProfile.Gender,
          GenderName: this.ApplicantProfile.GenderName,
          MaritalStatus: this.ApplicantProfile.MaritalStatus,
          MaritalStatusName: this.ApplicantProfile.MaritalStatusName,
          CurrentSalary: this.ApplicantProfile.CurrentSalary === -1 ? 0 : this.ApplicantProfile.CurrentSalary,      
          CurrencyFullName: this.ApplicantProfile.CurrencyFullName,
          Currency: this.ApplicantProfile.Currency,
          TargetSalary: this.ApplicantProfile.TargetSalary,
          NumberOfDependent: this.ApplicantProfile.NumberOfDependent,
          DateOfBirth: this.formatDate(this.ApplicantProfile.DateOfBirth),
          ResidenceCountry: this.ApplicantProfile.ResidenceCountry,
          ResidenceCountryName: this.ApplicantProfile.ResidenceCountryName,
          Mobile: this.ApplicantProfile.Mobile,
          Email: this.ApplicantProfile.Email,
          LandLine: this.ApplicantProfile.LandLine,
          SpecializationName: this.ApplicantProfile.SpecializationName,
          SpecializationID: this.ApplicantProfile.SpecializationID,
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
    this.EditApplicantModal.present();

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
      this.CountryList = response.CountryList;
      this.CurrencyList = response.CurrencyList;
      this.IndustryList = response.IndustryList;

      console.log("Comobox ", this.GenderList);

    } catch (error) {
      this.errorMessage = 'Failed to load ComobBoxes data.';
      console.error('Error loading ComobBoxes data:', error);
    }
  }



  // this list to get the id of the selected item from its list
  ChangeIDInloadAppComobBoxes(form: any, list: any[], displayAttr: any, idAttr: any, formControlName: any, formControlID: any) {
    try{
      console.log("calling meee", list, " ", displayAttr, " ", idAttr, " ", formControlName, " ", formControlID);
      const selectedValue = form.get(formControlName)?.value;
      const item = list.find(item => item[displayAttr] === selectedValue);
      const idValue = item ? item[idAttr] : null;
      console.log(selectedValue, " ", item, " ", idValue);
      form.get(formControlID)?.setValue(idValue);
    } catch(error) {
      console.log("error in ChangeIDInloadAppComobBoxes ", error);
    } 
  }

  private getValidationErrors(form: FormGroup): string[] {
    const controls = form.controls;
    const errorMessages: string[] = [];
  
    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = controls[controlName];
        if (control.invalid) {
          const errors = control.errors;
  
          // Collect error messages
          if (errors?.['required']) {
            errorMessages.push(`${controlName} is required.`);
          } else if (errors?.['email']) {
            errorMessages.push(`${controlName} must be a valid email address.`);
          } else if (errors?.['pattern']) {
            if (errors['pattern'].requiredPattern === '^[0-9]*$') {
              errorMessages.push(`${controlName} must contain only numbers.`);
            } else if (errors['pattern'].requiredPattern === '^[a-zA-Z]*$') {
              errorMessages.push(`${controlName} must contain only text.`);
            } else {
              errorMessages.push(`${controlName} is invalid.`);
            }
          }
          // Add more custom error handling here
        }
      }
    }
    return errorMessages;
  }
  

  private async presentAlert(message: string) {
    console.log("calling present ");
    const alert = await this.alertController.create({
      header: 'Validation Errors',
      message: message,
      buttons: ['OK'],
       mode: 'ios'
    });
    await alert.present();
  }
}

export interface ApplicantProfile {
  ResidenceCountryName: any;
  ApplicantID: number;
  // Picture?: string;
  FirstName: string;
  LastName: string;
  Gender: number;
  DateOfBirth: string;
  MaritalStatus: number;
  MaritalStatusName: string;
  NumberOfDependent: number;
  Nationality: number;
  ResidenceCountry: number;
  NationalIdentity: string;
  Passport: string;
  GenderName: string;
  NationalityName: string;
  CurrencyFullName: any;
  Currency: any;
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


