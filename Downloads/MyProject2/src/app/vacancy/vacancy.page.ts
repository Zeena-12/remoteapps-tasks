import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertController, IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ActionSheetComponent } from '../custom-components/action-sheet/action-sheet.component';
import { catchError, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApplicantService } from '../services/applicant/applicant.service';
import * as moment from 'moment';
import { VacanciesService } from '../services/vacancies/vacancies.service';
import { from } from 'rxjs';
import { map, toArray } from 'rxjs/operators';



@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.page.html',
  styleUrls: ['./vacancy.page.scss']
})
export class VacancyPage implements OnInit, AfterViewInit {

  vacancy: any;

  vacancyId: number = 0;
  interviewTypeID: number = 78;
  // candidates$ = this.candidateService.getCandidateList();
  // full list
  ApplicantList: any[] = [];
  // filder them here
  Applied: any[] = [];
  Shortlisted: any[] = [];
  Interviewed: any[] = [];
  Offered: any[] = [];
  Finalized: any[] = [];

  EmployeeList: any[] = [];
  ApplicantBestFitList: any[] = []; //full list
  BestFitApplicants: any = null; // to store the data of the best fit from applicant data

  option: string = 'Candidates';

  cvData: any = null;
  answersData: any[] = [];

  ApplicantsIntreviewList: any = [];
  InterviewsDataWithRate: any = [];
  UniqueApplicantFromRaing: any[] = [];

  weekDays: { day: string; date: string }[] = [];
  times: { [day: string]: TimeSlot[] } = {}; // Interviews per day
  selectedDay: string = '';

  @ViewChild('datePicker') datePicker: any;
  selectedDate: moment.Moment | null = null;
  isDatePickerVisible = false;
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

  startYear: number | null = null;
  endYear: number | null = null;
  isRange: boolean = false;

  markedDates: any[] = [];

  @ViewChild('calendarModal') calendarModal!: IonModal;

  constructor(
    private applicantsService: ApplicantService, 
    private alertController: AlertController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private vacanciesService: VacanciesService,
  ) { }


  ngOnInit() {
    // const vacancyIdParam = this.route.snapshot.paramMap.get('vacancyId');
    // this.vacancyId = vacancyIdParam ? Number(vacancyIdParam) : 0;
    this.vacancy = this.vacanciesService.getVacancy();
    if (this.vacancy.VacancyID) {
      console.log("yasalaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaam", this.vacancy);
      this.vacancyId = this.vacancy.VacancyID;
      this.loadVacancyApplicants();
    }
    console.log("vacancyIdParam id is ,", this.vacancyId);
    this.generateWeekDays();
    // this.generateTimes();
    this.selectedDay = this.weekDays[0]?.day; // Default to the first day
    console.log("selected day is ", this.selectedDay);
    this.loadApplicantData();
   // this.markedDates = ['07/01/2024', '15/01/2024', '24/01/2024', '25/01/2024', '20/01/2024', '31/01/2024', '07/01/2024', '01/04/2024'];
  }


  ngAfterViewInit(): void {
    console.log()
  }
  async loadVacancyApplicants() {
    try {
      const result = await this.applicantsService.getApplications(this.vacancyId)
      this.ApplicantList = result.list;
      console.log('Result from getApplications from loadVacancyData from id:', this.ApplicantList);

      // Filter the applicants based on their status
      this.ApplicantList.forEach(applicant => {
        switch (applicant.Status) {
          case 'Applied':
            this.Applied.push(applicant);
            break;
          case 'Shortlisted':
            this.Shortlisted.push(applicant);
            break;
          case 'Interviewed':
            this.Interviewed.push(applicant);
            break;
          case 'Offered':
            this.Offered.push(applicant);
            break;
          case 'offered-rejected':
            this.Offered.push(applicant);
            break;
          case 'Offer-Sent':
            this.Offered.push(applicant);
            break;
          case 'Finalized':
            this.Finalized.push(applicant);
            break;
          default:
            console.warn(`Unknown status: ${applicant.status}`);
        }
      });

      // console.log('Applied:', this.Applied);
      // console.log('Shortlisted:', this.Shortlisted);
      // console.log('Interviewed:', this.Interviewed);
      // console.log('Offered:', this.Offered);
      // console.log('Finalized:', this.Finalized);

    } catch (error) {
      console.error('Error fetching loadVacancyData:', error);
    }
  }


  // async loadAllVacancyInterviews() {
  //   try {
  //     // Fetch the list of vacancy interviews
  //     const result = await this.vacanciesService.getAllVacancyInterviews(this.vacancyId);

  //     // Assign the result to your class property
  //     this.ApplicantsIntreviewList = result.list;
  //     console.log('Result from getApplications from loadAllVacancyInterviews from id:', this.ApplicantsIntreviewList);

  //     // Perform additional actions, such as generating times
  //     await this.generateTimes(); // Assuming generateTimes is also an async function
  //   } catch (error) {
  //     // Log errors to the console
  //     console.error('Error fetching loadVacancyData:', error);
  //   }
  // }

  async loadAllVacancyInterviews() {
    try {
      // Fetch the list of vacancy interviews
      const result = await this.vacanciesService.getAllVacancyInterviews(this.vacancyId);
  
      // Assign the result to your class property
      this.ApplicantsIntreviewList = result.list;
      console.log('Result from getAllVacancyInterviews from loadAllVacancyInterviews from id:', this.ApplicantsIntreviewList);
  
      // Process the list and format InterviewDate using moment
      from(this.ApplicantsIntreviewList as any[]).pipe(
        map((item: any) => moment(item.InterviewDate, 'DD/MM/YYYY HH:mm:ss A').format('DD/MM/YYYY')), // Extract and format the date
        toArray() // Collect all formatted dates into an array
      ).subscribe({
        next: (dates) => {
          this.markedDates = dates; // Store the collected dates into markedDates
          console.log('Marked Dates:', this.markedDates); // Log the result or use it as needed
        },
        error: (err) => {
          console.error('Error processing InterviewDate:', err);
        }
      });
  
      // Perform additional actions, such as generating times
      await this.generateTimes(); // Assuming generateTimes is also an async function
    } catch (error) {
      // Log errors to the console
      console.error('Error fetching loadVacancyData:', error);
    }
  }

  async loadApplicantData() {
    // fetch data from api GetApplicantData
    try {
      const result = await this.applicantsService.getApplicantDataVacancie()
      this.EmployeeList = result.EmployeeList;
      this.ApplicantBestFitList = result.ApplicantBestFitList;
      this.findBestFitApplicants();
      console.log('Result from getApplicantDataVacancie from loadApplicantData from id:', this.EmployeeList);

    } catch (error) {
      console.error('Error fetching loadVacancyData:', error);
    }
  }




  async handleStatusChange(event: { id: number, newStatus: string }) {
    try {
      const result = await this.applicantsService.ChangeApplicationStatus(event.id, event.newStatus);
      console.log('Status update result:', result);
    } catch (error) {
      console.error('Error updating status:', error);
    }
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
      this.ApplicantProfile = this.cvData.ApplicantProfile;
      this.ApplicantionList = this.cvData.ApplicantionList;
      this.ExperienceList = this.cvData.ExperienceList;
      this.QualificationList = this.cvData.QualificationList;
      this.CertificateList = this.cvData.CertificateList;
      this.openModal('cv-modal');
    } else if (event.type === 'answers') {
      this.answersData = event.data;
      this.openModal('answers-modal');
    }
  }

  async openModal(modalId: string) {
    console.log("Attempting to open modal with ID:", modalId);
    const modal = document.getElementById(modalId) as HTMLIonModalElement | null;
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

  findBestFitApplicants() {
    if (this.ApplicantBestFitList.length === 0 || this.ApplicantList.length === 0) {
      return; // Exit if lists are empty or not yet loaded
    }

    // Find all applicants from the best fit list that are also in the applicant list
    this.BestFitApplicants = this.ApplicantBestFitList
      .map(bestFit => this.ApplicantList.find(applicant => applicant.ApplicantID === bestFit.ApplicantID))
      .filter(applicant => applicant !== undefined); // Remove any undefined values

    console.log("Best fit applicants: ", this.BestFitApplicants);
  }


  swiperSlideChanged(e: any) {
    console.log('change:', e);
  }


  selectedApplicant: any;

  // interview
  generateWeekDays() {
    console.log("calling generateWeekDays ade selected is ", this.selectedDate);
    if (this.selectedDate) {
      console.log("calling generateWeekDays for new day selected ", this.selectedDate);
      const startOfWeek = this.selectedDate.clone().startOf('week'); // Start of the week containing the selected day
      console.log("start of week  in if", startOfWeek);
      this.weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = startOfWeek.clone().add(i, 'days');
        console.log("in generateWeekDays in if day is", this.weekDays);
        return {
          day: day.format('ddd'), // Short day name (e.g., Thu)
          date: day.format('D') // Date (e.g., 29)
        };
      });
    } else {
      const startOfWeek = moment().startOf('week'); // Start of the current week
      console.log("start of week in else ", startOfWeek);
      this.weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = startOfWeek.clone().add(i, 'days');
        console.log("in generateWeekDaysc in else day is", this.weekDays);
        return {
          day: day.format('ddd'), // Short day name (e.g., Sun)
          date: day.format('D') // Date (e.g., Aug 1)
        };
      });
    }
  }

  async generateTimes() {
    // console.log('Generating times...');
    this.weekDays.forEach(day => {
      // console.log(`Processing day: ${day.day}`);
      const startTime = moment().startOf('day').hour(7); // Start at 7:00 AM
      const endTime = moment().startOf('day').hour(19); // End at 7:00 PM
      const dailyTimes: TimeSlot[] = [];
      let currentTime = startTime.clone();

      while (currentTime <= endTime) {
        const currentHour = currentTime.format('h:mm A');
        const currentDate = moment().startOf('week').add(this.weekDays.findIndex(d => d.day === day.day), 'days').format('DD/MM/YYYY');

        // console.log(`Current time: ${currentHour}, Date: ${currentDate}`);

        const filteredPeople = this.ApplicantsIntreviewList.filter((person: { InterviewDate: moment.MomentInput; }) => {
          const personDateTime = moment(person.InterviewDate, 'DD/MM/YYYY h:mm:ss A');
          // console.log(`Person time: ${personDateTime.format('h:mm A')}, Date: ${personDateTime.format('DD/MM/YYYY')}`);
          return personDateTime.format('h:mm A') === currentHour && personDateTime.format('DD/MM/YYYY') === currentDate;
        });

        // console.log(`Filtered people: ${filteredPeople.length}`);

        dailyTimes.push({
          time: currentTime.format('h:mm A'),
          people: filteredPeople // Use filtered people based on time
        });
        currentTime.add(1, 'hour');
      }
      this.times[day.day] = dailyTimes;
    });
  }
  selectDay(day: string) {
    this.selectedDay = day;
  }

  openDatePicker() {
    // Open the date picker programmatically
    this.datePicker.open();
  }

  @ViewChild('openTopInterview') openTopInterview: any;
  @ViewChild('openSelectInterviewee') openSelectInterviewee: any;
  SelectedApplicant: any;

  openSelectModal() {
    this.openSelectInterviewee.present();
  }

  async selectCandidate(candidate: any) {
    this.SelectedApplicant = candidate;
    await this.openSelectInterviewee.dismiss();
    this.openTopInterview.present();  // Reopen the first modal
  }

  // this function retun the data of applicant with the details of rating, for button Top interviews
  async loadInterviewsData() {
    try {
      // Fetch the list of vacancy interviews
      const result = await this.vacanciesService.getInterviewsData(this.vacancyId, this.interviewTypeID);

      // Assign the result to your class property
      this.InterviewsDataWithRate = result.list;
      console.log('Result from getInterviewsData from loadInterviewsData Rating details:', this.InterviewsDataWithRate);
      if (this.InterviewsDataWithRate) {
        this.getUniqueApplicants();
      }

      // Perform additional actions, such as generating times
      await this.generateTimes(); // Assuming generateTimes is also an async function
    } catch (error) {
      // Log errors to the console
      console.error('Error fetching loadVacancyData:', error);
    }
  }
  getUniqueApplicants() {
    // Create a map to store unique applicants by ApplicantID
    const uniqueMap = new Map<number, { ApplicantName: string, PositionName: string }>();

    this.InterviewsDataWithRate.forEach((applicant: { ApplicantID: any; ApplicantName: any; PositionName: any; }) => {
      // Add or update the map entry
      if (!uniqueMap.has(applicant.ApplicantID)) {
        uniqueMap.set(applicant.ApplicantID, {
          ApplicantName: applicant.ApplicantName,
          PositionName: applicant.PositionName
        });
      }
    });

    // Convert map values to an array
    this.UniqueApplicantFromRaing = Array.from(uniqueMap.entries()).map(([ApplicantID, { ApplicantName, PositionName }]) => ({
      ApplicantID,
      ApplicantName,
      PositionName
    }));
    this.SelectedApplicant = this.UniqueApplicantFromRaing[0];
    console.log("getUniqueApplicants ", this.UniqueApplicantFromRaing);
    console.log("selected applicant ", this.SelectedApplicant);
    if (this.SelectedApplicant) {
      this.getFilteredInterviews();
    }
  }

  getFilteredInterviews() {
    if (!this.SelectedApplicant) {
      // Debugging message if SelectedApplicant is undefined
      console.error("SelectedApplicant is undefined.");
      return [];
    }

    // Debugging message
    console.log("selected candidate is ", this.SelectedApplicant);

    return this.InterviewsDataWithRate.filter((candidate: { ApplicantID: any; }) =>
      candidate.ApplicantID === this.SelectedApplicant.ApplicantID
    );
  }

  handleDateSelected(range: { start: moment.Moment | null, end: moment.Moment | null }) {
    if (range.start && range.end) {
      console.log('Selected Range:', range.start.format('YYYY-MM-DD'), 'to', range.end.format('YYYY-MM-DD'));
      this.selectedDay = range.start.format('ddd-YYYY-MM-DD');
      console.log("selected day is ",this.selectedDay);
    } else if (range.start) {
      console.log('Selected Start Date:', range.start.format('YYYY-MM-DD'));
      this.selectedDay = range.start.format('ddd-YYYY-MM-DD');
      console.log("selected day is ",this.selectedDay);
    } else if (range.end) {
      console.log('Selected End Date:', range.end.format('YYYY-MM-DD'));
    } else {
      console.log('No date selected in handleDateSelected');
    }
  }

  onSelectButtonClicked() {
    this.generateWeekDays();
    if (this.calendarModal) {
      this.calendarModal.dismiss(); // Close the modal
    }
  }
}

interface Interview {
  name: string;
  nationality: string;
  interviewType: string;
  image: string;
  numberOfLikes: number;
  numberOfDislike: number;
}

interface TimeSlot {
  time: string;
  people?: Interview[];
}