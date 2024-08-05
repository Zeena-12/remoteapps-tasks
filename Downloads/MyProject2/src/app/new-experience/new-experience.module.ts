import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewExperiencePageRoutingModule } from './new-experience-routing.module';

import { NewExperiencePage } from './new-experience.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewExperiencePageRoutingModule
  ],
  declarations: [NewExperiencePage]
})
export class NewExperiencePageModule {}
