import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
// import { CustomComponentsModule } from '../custom-components/custom-components.module';  // Import the custom module
import { BottomNavComponent } from '../custom-components/bottom-nav/bottom-nav.component';

import { HomePageRoutingModule } from './home-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
     ReactiveFormsModule,
    IonicModule,
    // CustomComponentsModule, 
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
