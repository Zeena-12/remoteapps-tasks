import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VacancyPageRoutingModule } from './vacancy-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomComponentsModule } from '../custom-components.module';
import { CustomPipesModule } from '../custom-pipes/custom-pipes.module';
import { DirectivesModule } from '../directives.module';
// import { LongPressDirective } from '../directives/long-press/long-press.directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';



import { VacancyPage } from './vacancy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VacancyPageRoutingModule, 
    DragDropModule,
    CustomComponentsModule,
    CustomPipesModule,
    DirectivesModule
  ],
  declarations: [VacancyPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class VacancyPageModule {}
