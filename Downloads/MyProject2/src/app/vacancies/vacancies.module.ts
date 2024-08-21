import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VacanciesPageRoutingModule } from './vacancies-routing.module';

import { VacanciesPage } from './vacancies.page';
import { CustomPipesModule } from '../custom-pipes/custom-pipes.module';
import { CustomComponentsModule } from '../custom-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VacanciesPageRoutingModule,
    CustomPipesModule,
    CustomComponentsModule
  ],
  declarations: [VacanciesPage]
})
export class VacanciesPageModule {}
