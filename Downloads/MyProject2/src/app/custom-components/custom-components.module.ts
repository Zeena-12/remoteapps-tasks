import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { StatusBoxComponent } from './status-box/status-box.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';



@NgModule({
  declarations: [CardComponent, StatusBoxComponent, ProfileCardComponent],
  imports: [
    CommonModule
  ],
  exports: [CardComponent, StatusBoxComponent, ProfileCardComponent]
})
export class CustomComponentsModule { }
