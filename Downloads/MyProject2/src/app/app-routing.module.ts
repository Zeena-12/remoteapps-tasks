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
    path: '',
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
    path: 'vacancies',
    loadChildren: () => import('./vacancies/vacancies.module').then( m => m.VacanciesPageModule)
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
