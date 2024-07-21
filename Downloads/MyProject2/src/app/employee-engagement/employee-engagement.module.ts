import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeEngagementPageRoutingModule } from './employee-engagement-routing.module';

import { EmployeeEngagementPage } from './employee-engagement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeEngagementPageRoutingModule
  ],
  declarations: [EmployeeEngagementPage]
})
export class EmployeeEngagementPageModule {}
