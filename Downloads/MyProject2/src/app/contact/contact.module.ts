import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactPageRoutingModule } from './contact-routing.module';

import { ContactPage } from './contact.page';
import { CustomComponentsModule } from '../custom-components/custom-components.module';  // Import the custom module
import { BottomNavComponent } from '../custom-components/bottom-nav/bottom-nav.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactPageRoutingModule,
    CustomComponentsModule, 

  ],
  declarations: [ContactPage]
})
export class ContactPageModule {}
