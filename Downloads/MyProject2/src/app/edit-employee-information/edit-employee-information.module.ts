import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditEmployeeInformationPageRoutingModule } from './edit-employee-information-routing.module';

import { EditEmployeeInformationPage } from './edit-employee-information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditEmployeeInformationPageRoutingModule
  ],
  declarations: [EditEmployeeInformationPage]
})
export class EditEmployeeInformationPageModule {}
