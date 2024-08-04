import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FourthPageRoutingModule } from './fourth-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomComponentsModule } from '../custom-components.module';
import { DirectivesModule } from '../directives.module';
// import { LongPressDirective } from '../directives/long-press/long-press.directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';



import { FourthPage } from './fourth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FourthPageRoutingModule, 
    DragDropModule,
    CustomComponentsModule,
    DirectivesModule
  ],
  declarations: [FourthPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class FourthPageModule {}
