import { Component, OnInit } from '@angular/core';
import { VacanciesService } from '../services/vacancies/vacancies.service';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.page.html',
  styleUrls: ['./vacancies.page.scss'],
})
export class VacanciesPage implements OnInit {

  vacanciesList: any[] = []; // Array to hold the list of applicants
  errorMessage: string | null = null;



  constructor(private vacanciesService: VacanciesService) { }

  ngOnInit() {
    this.loadVacanciesData();
  }

  async loadVacanciesData() {
    try {
      this.vacanciesList = await this.vacanciesService.getApplicantData();
      console.log(this.vacanciesList);
    } catch (error) {
      this.errorMessage = 'Failed to load vacancies data.';
      console.error('Error loading vacancies data:', error);
    }
  }

}
