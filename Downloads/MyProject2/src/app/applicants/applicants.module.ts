import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplicantsPageRoutingModule } from './applicants-routing.module';

import { ApplicantsPage } from './applicants.page';
import { CustomComponentsModule } from '../custom-components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicantsPageRoutingModule,
    CustomComponentsModule
  ],
  declarations: [ApplicantsPage]
})
export class ApplicantsPageModule {}
