import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';

const routes: Routes = [

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    // map
    path: 'second',
    loadChildren: () => import('./second/second.module').then( m => m.SecondPageModule)
  },

  {
    // old drag and drop
    path: 'third',
    loadChildren: () => import('./third/third.module').then( m => m.ThirdPageModule)
  },
  {
    // list of candidates
    path: 'fourth',
    loadChildren: () => import('./fourth/fourth.module').then( m => m.FourthPageModule)
  },
  {
    path: 'answer',
    loadChildren: () => import('./answer/answer.module').then( m => m.AnswerPageModule)
  },
  {
    path: 'employee-engagement',
    loadChildren: () => import('./employee-engagement/employee-engagement.module').then( m => m.EmployeeEngagementPageModule)
  },
  {
    path: 'cv',
    loadChildren: () => import('./cv/cv.module').then( m => m.CvPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./vacancies/vacancies.module').then( m => m.VacanciesPageModule)
  },
  {
    path: 'applicants',
    loadChildren: () => import('./applicants/applicants.module').then( m => m.ApplicantsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'myhome',
    loadChildren: () => import('./myhome/myhome.module').then( m => m.MyhomePageModule)
  },
  {
    path: 'edit-employee-information',
    loadChildren: () => import('./edit-employee-information/edit-employee-information.module').then( m => m.EditEmployeeInformationPageModule)
  },
  {
    path: 'new-experience',
    loadChildren: () => import('./new-experience/new-experience.module').then( m => m.NewExperiencePageModule)
  },


];
@NgModule({
  imports: [
    ScrollingModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
