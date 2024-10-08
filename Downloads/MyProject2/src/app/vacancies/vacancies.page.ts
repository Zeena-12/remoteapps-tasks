import { Component, isDevMode, OnInit } from '@angular/core';
import { VacanciesService } from '../services/vacancies/vacancies.service';
import { ApplicantService } from '../services/applicant/applicant.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Device } from '@ionic-native/device/ngx';



@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.page.html',
  styleUrls: ['./vacancies.page.scss'],
})
export class VacanciesPage implements OnInit {

  selectedDate: moment.Moment | null = null;

  vacanciesList: any[] = []; // Array to hold the list of applicants
  applicationList: any[] = []; // Array to hold the list of applicants
  errorMessage: string | null = null;

  startYear: number | null = null;
  endYear: number | null = null;
  isRange: boolean = true;
 

  
  updateYears() {
    console.log("calling");
  }

  constructor(private vacanciesService: VacanciesService,
    private applicantsServive: ApplicantService,
    private router: Router
  ) {

   }

  ngOnInit() {
    this.loadVacanciesData();
   console.log("is div moda one?",  isDevMode());
   
  }


  startDate: string = moment().startOf('year').format('YYYY-MM-DD');
  endDate: string = moment().endOf('year').format('YYYY-MM-DD');

  async loadVacanciesData() {
    try {
      this.vacanciesList = await this.vacanciesService.getVacansiesData();
      console.log(this.vacanciesList);
    } catch (error) {
      this.errorMessage = 'Failed to load vacancies data.';
      console.error('Error loading vacancies data:', error);
    }
  }


  goToVacancyDetail(vacancies: any): void {
    console.log("what is vacancy????", vacancies);
    this.vacanciesService.setVacancy(vacancies);
    this.router.navigate(['/vacancy']);
  }

// change it to load applications
  async getApplications(vacancyId: number) {
    try {
      this.vacanciesList = await this.vacanciesService.getApplications(vacancyId);
      console.log("List of vacancy based in vacancy id " ,this.vacanciesList);
      this.router.navigate(['/vacancy']);
    } catch (error) {
      this.errorMessage = 'Failed to load vacancies data.';
      console.error('Error loading vacancies data:', error);
    }
  }



  handleDateSelected(range: { start: moment.Moment | null, end: moment.Moment | null }) {
    if (range.start && range.end) {
      console.log('Selected Range:', range.start.format('YYYY-MM-DD'), 'to', range.end.format('YYYY-MM-DD'));
    } else if (range.start) {
      console.log('Selected Start Date:', range.start.format('YYYY-MM-DD'));
    } else if (range.end) {
      console.log('Selected End Date:', range.end.format('YYYY-MM-DD'));
    } else {
      console.log('No date selected');
    }
  }

}

