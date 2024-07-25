import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CvPageRoutingModule } from './cv-routing.module';
// import { SwiperModule} from 'swiper/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import { CvPage } from './cv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CvPageRoutingModule,
  ],
  declarations: [CvPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CvPageModule {}
