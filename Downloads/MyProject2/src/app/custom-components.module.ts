import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { InputComponent } from './custom-components/input/input.component';
import { CardComponent } from './custom-components/card/card.component';
import { BottomNavComponent } from './custom-components/bottom-nav/bottom-nav.component';
import { StatusBoxComponent } from './custom-components/status-box/status-box.component';
import { ProfileCardComponent } from './custom-components/profile-card/profile-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DropdownComponent } from './custom-components/dropdown/dropdown.component';
import { ActionSheetComponent } from './custom-components/action-sheet/action-sheet.component';
import { DirectivesModule } from './directives.module';





@NgModule({
  declarations: [InputComponent, CardComponent, BottomNavComponent, StatusBoxComponent, ProfileCardComponent, DropdownComponent,ActionSheetComponent ],
  imports: [
    CommonModule,
    FormsModule,  // Include FormsModule for form handling
    DragDropModule,
    DirectivesModule
  ],
  exports: [InputComponent, CardComponent, BottomNavComponent, StatusBoxComponent, ProfileCardComponent, DropdownComponent,ActionSheetComponent ]  // Export the component for use in other modules
})
export class CustomComponentsModule { }
