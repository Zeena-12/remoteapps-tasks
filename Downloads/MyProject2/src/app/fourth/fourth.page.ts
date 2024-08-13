import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CandidateStatusService } from '../candidate-status.service';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ActionSheetComponent } from '../custom-components/action-sheet/action-sheet.component';
import { catchError, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApplicantService } from '../services/applicant/applicant.service';
import * as moment from 'moment';
import { VacanciesService } from '../services/vacancies/vacancies.service';


@Component({
  selector: 'app-fourth',
  templateUrl: './fourth.page.html',
  styleUrls: ['./fourth.page.scss']
})
export class FourthPage implements OnInit, AfterViewInit {
  vacancyId: number = 0;
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
  ApplicantBestFitList: any[] = [];

  option: string = 'Candidates';

  cvData: any = null;
  answersData: any[] = [];

  ApplicantsIntreviewList: any = [];

  weekDays: { day: string; date: string }[] = [];
  times: { [day: string]: TimeSlot[] } = {}; // Interviews per day
  selectedDay: string = '';

  @ViewChild('datePicker') datePicker: any;
  selectedDate!: string;

  constructor(private candidateService: CandidateStatusService,
    private applicantsService: ApplicantService,
    private alertController: AlertController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private vacanciesService: VacanciesService,
  ) { }


  ngOnInit() {
    const vacancyIdParam = this.route.snapshot.paramMap.get('vacancyId');
    this.vacancyId = vacancyIdParam ? Number(vacancyIdParam) : 0;
    if (this.vacancyId) {
      this.loadVacancyApplicants();
    }
    console.log("vacancyIdParam id is ,", this.vacancyId);
    this.generateWeekDays();
    // this.generateTimes();
    this.selectedDay = this.weekDays[0]?.day; // Default to the first day
    this.loadApplicantData();
  }


  ngAfterViewInit(): void {
    console.log()
  }
  async loadVacancyApplicants() {
    try {
      const result = await this.applicantsService.getApplications(this.vacancyId)
      this.ApplicantList = result.list;
      // console.log('Result from getApplications from loadVacancyData from id:', this.ApplicantList);

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
  //     const result = await this.vacanciesService.getAllVacancyInterviews(this.vacancyId);
  //     this.ApplicantsIntreviewList = result.list;
  //     console.log('Result from getApplications from loadAllVacancyInterviews from id:', this.ApplicantsIntreviewList);
  //   } catch (error) {
  //     console.error('Error fetching loadVacancyData:', error);
  //   }
  // }
  async loadAllVacancyInterviews() {
    try {
      // Fetch the list of vacancy interviews
      const result = await this.vacanciesService.getAllVacancyInterviews(this.vacancyId);

      // Assign the result to your class property
      this.ApplicantsIntreviewList = result.list;
      console.log('Result from getApplications from loadAllVacancyInterviews from id:', this.ApplicantsIntreviewList);

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
      console.log('Result from getApplicantDataVacancie from loadApplicantData from id:', this.EmployeeList);

    } catch (error) {
      console.error('Error fetching loadVacancyData:', error);
    }
  }

  // Assuming generateTimes is defined as an async function





  // handleStatusChange(event: { id: number, newStatus: string }) {
  //   this.candidateService.updateCandidateStatus(event.id, event.newStatus).subscribe(() => {
  //     // this.loadCandidates();
  //   });
  //   console.log("calling handleStatusChange in fourth");
  // }
  async handleStatusChange(event: { id: number, newStatus: string }) {
    try {
      const result = await this.applicantsService.ChangeApplicationStatus(event.id, event.newStatus);
      console.log('Status update result:', result);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  // handleDisqualifyChange(event: { id: number, newDisqualified: boolean }) {
  //   this.candidateService.updateCandidateDisqualified(event.id, event.newDisqualified).subscribe(() => {
  //     // this.loadCandidates();
  //   });
  //   // console.log("calling handleDisqualifyChange in fourth");
  // }

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




  swiperSlideChanged(e: any) {
    console.log('change:', e);
  }

  peopleList: any[] = [
    {
      name: 'Khalil Alrashed',
      nationality: 'Bahraini',
      interviewType: 'First Interview',
      image: 'assets/avatar4.png',
      numberOfLikes: 4,
      numberOfDislike: 20,
      applicationDate: '11/09/2024 07:00:00 AM'
    },
    {
      name: 'Sara Alnasser',
      nationality: 'Non-Bahraini',
      interviewType: 'Second Interview',
      image: 'assets/avatar4.png',
      numberOfLikes: 5,
      numberOfDislike: 15,
      applicationDate: '12/08/2024 08:00:00 AM'
    },
    {
      name: 'Ali Alsaeed',
      nationality: 'Bahraini',
      interviewType: 'First Interview',
      image: 'assets/avatar4.png',
      numberOfLikes: 10,
      numberOfDislike: 8,
      applicationDate: '11/08/2024 09:00:00 AM'
    },
    {
      name: 'Mona Alhamad',
      nationality: 'Non-Bahraini',
      interviewType: 'Second Interview',
      image: 'assets/avatar4.png',
      numberOfLikes: 7,
      numberOfDislike: 12,
      applicationDate: '15/08/2024 09:00:00 AM'
    }
  ];



  // interview
  generateWeekDays() {
    const startOfWeek = moment().startOf('week'); // Start of the current week
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = startOfWeek.clone().add(i, 'days');
      return {
        day: day.format('ddd'), // Short day name (e.g., Sun)
        date: day.format('D') // Date (e.g., Aug 1)
      };
    });
  }

  async generateTimes() {
    console.log('Generating times...');
    this.weekDays.forEach(day => {
      console.log(`Processing day: ${day.day}`);
      const startTime = moment().startOf('day').hour(7); // Start at 7:00 AM
      const endTime = moment().startOf('day').hour(19); // End at 7:00 PM
      const dailyTimes: TimeSlot[] = [];
      let currentTime = startTime.clone();

      while (currentTime <= endTime) {
        const currentHour = currentTime.format('h:mm A');
        const currentDate = moment().startOf('week').add(this.weekDays.findIndex(d => d.day === day.day), 'days').format('DD/MM/YYYY');

        console.log(`Current time: ${currentHour}, Date: ${currentDate}`);

        const filteredPeople = this.ApplicantsIntreviewList.filter((person: { InterviewDate: moment.MomentInput; }) => {
          const personDateTime = moment(person.InterviewDate, 'DD/MM/YYYY h:mm:ss A');
          console.log(`Person time: ${personDateTime.format('h:mm A')}, Date: ${personDateTime.format('DD/MM/YYYY')}`);
          return personDateTime.format('h:mm A') === currentHour && personDateTime.format('DD/MM/YYYY') === currentDate;
        });

        console.log(`Filtered people: ${filteredPeople.length}`);

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