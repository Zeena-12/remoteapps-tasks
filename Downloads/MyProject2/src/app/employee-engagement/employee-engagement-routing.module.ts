import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeEngagementPage } from './employee-engagement.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeEngagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeEngagementPageRoutingModule {}
