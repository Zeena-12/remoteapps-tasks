import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FourthPageRoutingModule } from './fourth-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomComponentsModule } from '../custom-components.module';


import { FourthPage } from './fourth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FourthPageRoutingModule, 
    DragDropModule,
    CustomComponentsModule
  ],
  declarations: [FourthPage]
})
export class FourthPageModule {}
