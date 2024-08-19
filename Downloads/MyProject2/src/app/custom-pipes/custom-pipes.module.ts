import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ExtractNamePipe } from './extract-name/extract-name.pipe'; 
import { ExtractNamePipe } from './extract-name/extract-name';
import { DateFormatPipe } from './date-format/date-format';



@NgModule({
  declarations: [ ExtractNamePipe, DateFormatPipe],
  imports: [
    CommonModule
  ],
  exports: [
    ExtractNamePipe,
    DateFormatPipe
     // Export your pipe so it can be used in other modules
  ]
})
export class CustomPipesModule { }
