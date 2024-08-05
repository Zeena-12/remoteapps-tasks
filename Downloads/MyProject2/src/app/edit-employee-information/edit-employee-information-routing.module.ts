import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditEmployeeInformationPage } from './edit-employee-information.page';

const routes: Routes = [
  {
    path: '',
    component: EditEmployeeInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditEmployeeInformationPageRoutingModule {}
