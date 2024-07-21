import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { StatusBoxComponent } from './status-box/status-box.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { DropdownComponent } from './dropdown/dropdown.component';



@NgModule({
  declarations: [CardComponent, StatusBoxComponent, ProfileCardComponent, DropdownComponent],
  imports: [
    CommonModule,
    
  ],
  exports: [CardComponent, StatusBoxComponent, ProfileCardComponent, DropdownComponent]
})
export class CustomComponentsModule { }
