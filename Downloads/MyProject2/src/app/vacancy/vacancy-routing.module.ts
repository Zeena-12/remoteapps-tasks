import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VacancyPage } from './vacancy.page';

const routes: Routes = [
  {
    path: '',
    component: VacancyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VacancyPageRoutingModule {}
