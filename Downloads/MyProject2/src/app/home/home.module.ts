import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
// import { CustomComponentsModule } from '../custom-components/custom-components.module';  // Import the custom module
import { BottomNavComponent } from '../custom-components/bottom-nav/bottom-nav.component';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // CustomComponentsModule, 
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
