import { Component, OnInit } from '@angular/core';
import { VacanciesService } from '../services/vacancies/vacancies.service';
import { ApplicantService } from '../services/applicant/applicant.service';
import { Router } from '@angular/router';  


@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.page.html',
  styleUrls: ['./vacancies.page.scss'],
})
export class VacanciesPage implements OnInit {

  vacanciesList: any[] = []; // Array to hold the list of applicants
  applicationList: any[] = []; // Array to hold the list of applicants
  errorMessage: string | null = null;



  constructor(private vacanciesService: VacanciesService,
    private applicantsServive: ApplicantService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadVacanciesData();
  }

  async loadVacanciesData() {
    try {
      this.vacanciesList = await this.vacanciesService.getVacansiesData();
      console.log(this.vacanciesList);
    } catch (error) {
      this.errorMessage = 'Failed to load vacancies data.';
      console.error('Error loading vacancies data:', error);
    }
  }

  async getApplications(vacancyId: number) {
    try {
      this.vacanciesList = await this.applicantsServive.getApplications(vacancyId);
      console.log(this.vacanciesList);
      this.router.navigate(['/fourth']);
    } catch (error) {
      this.errorMessage = 'Failed to load vacancies data.';
      console.error('Error loading vacancies data:', error);
    }
  }





}
